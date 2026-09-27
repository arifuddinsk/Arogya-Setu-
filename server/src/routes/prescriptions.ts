import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const prescriptionsRouter = Router();

// Get prescriptions
prescriptionsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { patientId } = req.query;

    let query = 'SELECT * FROM prescriptions WHERE 1=1';
    const params: any[] = [];

    if (patientId) {
      query += ' AND patient_id = ?';
      params.push(patientId);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];

    const prescriptions = rows.map((rx) => ({
      id: rx.id,
      appointmentId: rx.appointment_id,
      patientId: rx.patient_id,
      patientName: rx.patient_name,
      patientAge: rx.patient_age,
      doctorId: rx.doctor_id,
      doctorName: rx.doctor_name,
      doctorSpecialization: rx.doctor_specialization,
      doctorRegNo: rx.doctor_reg_no,
      hospital: rx.hospital,
      date: rx.date,
      diagnosis: rx.diagnosis,
      medicines: JSON.parse(rx.medicines_json || '[]'),
      advice: rx.advice,
      followUpDate: rx.follow_up_date,
      remindersActive: Boolean(rx.reminders_active),
      createdAt: rx.created_at,
    }));

    return res.json({ prescriptions });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new prescription
prescriptionsRouter.post('/', (req: Request, res: Response) => {
  try {
    const {
      appointmentId,
      patientId,
      patientName,
      patientAge = 28,
      doctorId,
      doctorName,
      doctorSpecialization,
      doctorRegNo = 'MCI-UP-48921-2010',
      hospital = 'Civil Hospital Tele-Health Center, Varanasi',
      date,
      diagnosis,
      medicines,
      advice,
      followUpDate,
    } = req.body;

    if (!patientName || !diagnosis || !medicines) {
      return res.status(400).json({ error: 'Missing required prescription fields' });
    }

    const id = `rx-${Date.now()}`;
    const rxDate =
      date ||
      new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

    const stmt = db.prepare(`
      INSERT INTO prescriptions (id, appointment_id, patient_id, patient_name, patient_age, doctor_id, doctor_name, doctor_specialization, doctor_reg_no, hospital, date, diagnosis, medicines_json, advice, follow_up_date, reminders_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    stmt.run(
      id,
      appointmentId || null,
      patientId || 'patient-user',
      patientName,
      patientAge,
      doctorId || 'doc-sharma',
      doctorName || 'Dr. Ramesh Sharma',
      doctorSpecialization || 'General Physician',
      doctorRegNo,
      hospital,
      rxDate,
      diagnosis,
      JSON.stringify(medicines),
      advice || '',
      followUpDate || 'In 5 days'
    );

    const created = db.prepare('SELECT * FROM prescriptions WHERE id = ?').get(id) as any;

    const formatted = {
      id: created.id,
      appointmentId: created.appointment_id,
      patientId: created.patient_id,
      patientName: created.patient_name,
      patientAge: created.patient_age,
      doctorId: created.doctor_id,
      doctorName: created.doctor_name,
      doctorSpecialization: created.doctor_specialization,
      doctorRegNo: created.doctor_reg_no,
      hospital: created.hospital,
      date: created.date,
      diagnosis: created.diagnosis,
      medicines: JSON.parse(created.medicines_json || '[]'),
      advice: created.advice,
      followUpDate: created.follow_up_date,
      remindersActive: Boolean(created.reminders_active),
    };

    return res.status(201).json({ success: true, prescription: formatted });
  } catch (error: any) {
    console.error('Create prescription error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Toggle reminder
prescriptionsRouter.patch('/:id/reminder', (req: Request, res: Response) => {
  try {
    const rx: any = db.prepare('SELECT reminders_active FROM prescriptions WHERE id = ?').get(req.params.id);
    if (!rx) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    const nextState = rx.reminders_active ? 0 : 1;
    db.prepare('UPDATE prescriptions SET reminders_active = ? WHERE id = ?').run(nextState, req.params.id);

    return res.json({ success: true, id: req.params.id, remindersActive: Boolean(nextState) });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
