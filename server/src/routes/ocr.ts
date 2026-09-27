import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const ocrRouter = Router();

// Scan image and extract medicines with AI OCR model simulation
ocrRouter.post('/scan', (req: Request, res: Response) => {
  try {
    const { image } = req.body;

    // Simulate smart OCR parsing of handwritten Indian medical slips
    const extracted = [
      {
        medicine: 'Paracetamol',
        dosage: '500mg',
        frequency: '2 times/day',
        duration: '5 days',
        confidence: 97,
        notes: 'Take after food with warm water',
      },
      {
        medicine: 'Amoxicillin Trihydrate',
        dosage: '500mg',
        frequency: '2 times/day',
        duration: '5 days',
        confidence: 94,
        notes: 'Antibiotic course',
      },
      {
        medicine: 'Cetirizine HCl',
        dosage: '10mg',
        frequency: '1 time/day (Night)',
        duration: '3 days',
        confidence: 91,
        notes: 'Bedtime',
      },
    ];

    return res.json({ success: true, extracted });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Save digitized prescription to user health record
ocrRouter.post('/save', (req: Request, res: Response) => {
  try {
    const { userId = 'user-current', title = 'Handwritten PHC Slip', imageUrl, items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Extracted items are required' });
    }

    const id = `ocr-${Date.now()}`;
    const stmt = db.prepare(`
      INSERT INTO ocr_scans (id, user_id, title, image_url, extracted_json)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, title, imageUrl || '', JSON.stringify(items));

    return res.status(201).json({
      success: true,
      id,
      message: `${items.length} medicines digitized and persisted to database`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get user OCR scans
ocrRouter.get('/:userId', (req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM ocr_scans WHERE user_id = ? ORDER BY created_at DESC').all(req.params.userId) as any[];
    const scans = rows.map((s) => ({
      id: s.id,
      userId: s.user_id,
      title: s.title,
      imageUrl: s.image_url,
      extracted: JSON.parse(s.extracted_json || '[]'),
      createdAt: s.created_at,
    }));

    return res.json({ scans });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
