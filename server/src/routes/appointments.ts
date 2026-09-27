import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const appointmentsRouter = Router();

// Get appointments
appointmentsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { patientId, doctorId } = req.query;

    let query = 'SELECT * FROM appointments WHERE 1=1';
    const params: any[] = [];

    if (patientId) {
      query += ' AND patient_id = ?';
      params.push(patientId);
    }

    if (doctorId) {
      query += ' AND doctor_id = ?';
      params.push(doctorId);
    }

    query += ' ORDER BY created_at DESC';

    const rows = db.prepare(query).all(...params) as any[];

    const appointments = rows.map((a) => ({
      id: a.id,
      doctorId: a.doctor_id,
      doctorName: a.doctor_name,
      doctorSpecialization: a.doctor_specialization,
      doctorAvatar: a.doctor_avatar,
      patientId: a.patient_id,
      patientName: a.patient_name,
      patientAge: a.patient_age,
      patientGender: a.patient_gender,
      date: a.date,
      time: a.time,
      status: a.status,
      type: a.type,
      symptoms: a.symptoms,
      phcCenter: a.phc_center,
      createdAt: a.created_at,
    }));

    return res.json({ appointments });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Book new appointment
appointmentsRouter.post('/', (req: Request, res: Response) => {
  try {
    const {
      doctorId,
      doctorName,
      doctorSpecialization,
      doctorAvatar,
      patientId,
      patientName,
      patientAge = 28,
      patientGender = 'Male',
      date,
      time,
      type = 'video',
      symptoms = 'General Rural Tele-Consultation',
      phcCenter = 'Rampur Sub-Center Tele-Kiosk',
    } = req.body;

    if (!doctorId || !patientName || !date || !time) {
      return res.status(400).json({ error: 'Missing required appointment fields' });
    }

    const id = `apt-${Date.now()}`;

    const stmt = db.prepare(`
      INSERT INTO appointments (id, doctor_id, doctor_name, doctor_specialization, doctor_avatar, patient_id, patient_name, patient_age, patient_gender, date, time, status, type, symptoms, phc_center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      doctorId,
      doctorName,
      doctorSpecialization,
      doctorAvatar,
      patientId,
      patientName,
      patientAge,
      patientGender,
      date,
      time,
      'upcoming',
      type,
      symptoms,
      phcCenter
    );

    const created = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as any;

    const formatted = {
      id: created.id,
      doctorId: created.doctor_id,
      doctorName: created.doctor_name,
      doctorSpecialization: created.doctor_specialization,
      doctorAvatar: created.doctor_avatar,
      patientId: created.patient_id,
      patientName: created.patient_name,
      patientAge: created.patient_age,
      patientGender: created.patient_gender,
      date: created.date,
      time: created.time,
      status: created.status,
      type: created.type,
      symptoms: created.symptoms,
      phcCenter: created.phc_center,
    };

    return res.status(201).json({ success: true, appointment: formatted });
  } catch (error: any) {
    console.error('Book appointment error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Update appointment status (e.g. in-progress, completed)
appointmentsRouter.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, req.params.id);
    return res.json({ success: true, id: req.params.id, status });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
