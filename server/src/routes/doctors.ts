import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const doctorsRouter = Router();

// Get all doctors with optional filters
doctorsRouter.get('/', (req: Request, res: Response) => {
  try {
    const { specialization, location, search } = req.query;

    let query = 'SELECT * FROM doctors WHERE 1=1';
    const params: any[] = [];

    if (specialization && specialization !== 'All') {
      query += ' AND specialization = ?';
      params.push(specialization);
    }

    if (location && location !== 'All') {
      query += ' AND (district LIKE ? OR hospital LIKE ?)';
      params.push(`%${location}%`, `%${location}%`);
    }

    if (search) {
      query += ' AND (name LIKE ? OR specialization LIKE ? OR hospital LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const rows = db.prepare(query).all(...params) as any[];

    // Parse JSON array fields
    const doctors = rows.map((doc) => ({
      ...doc,
      isBPLFree: Boolean(doc.is_bpl_free),
      experienceYears: doc.experience_years,
      reviewsCount: doc.reviews_count,
      consultationFee: doc.consultation_fee,
      nextSlot: doc.next_slot,
      languages: JSON.parse(doc.languages_json || '[]'),
      availableDates: JSON.parse(doc.available_dates_json || '[]'),
      slots: JSON.parse(doc.slots_json || '[]'),
    }));

    return res.json({ doctors });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get doctor by ID
doctorsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const doc: any = db.prepare('SELECT * FROM doctors WHERE id = ?').get(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const formatted = {
      ...doc,
      isBPLFree: Boolean(doc.is_bpl_free),
      experienceYears: doc.experience_years,
      reviewsCount: doc.reviews_count,
      consultationFee: doc.consultation_fee,
      nextSlot: doc.next_slot,
      languages: JSON.parse(doc.languages_json || '[]'),
      availableDates: JSON.parse(doc.available_dates_json || '[]'),
      slots: JSON.parse(doc.slots_json || '[]'),
    };

    return res.json({ doctor: formatted });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
