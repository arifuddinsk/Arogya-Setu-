import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

// Register new user
authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const {
      name,
      role = 'patient',
      email,
      phone,
      password = 'password123',
      avatar,
      age = 28,
      gender = 'Male',
      district = 'Varanasi Rural',
      village = 'Rampur',
      abhaId,
      specialization,
      qualification,
      hospital,
      regNumber,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = `user-${Date.now()}`;
    const userEmail =
      email || `${name.toLowerCase().replace(/\s+/g, '')}@graminhealth.in`;
    const userAvatar =
      avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name
      )}&backgroundColor=0d9488`;
    const userAbhaId =
      abhaId ||
      `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}-${Math.floor(1000 + Math.random() * 9000)}`;

    const stmt = db.prepare(`
      INSERT INTO users (id, name, role, email, phone, password, avatar, age, gender, district, village, abha_id, specialization, qualification, hospital, reg_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      name,
      role,
      userEmail,
      phone || '+91 98765 43210',
      password,
      userAvatar,
      age,
      gender,
      district,
      village,
      userAbhaId,
      specialization || null,
      qualification || null,
      hospital || null,
      regNumber || null
    );

    // Also automatically create an initial welcome appointment with Dr. Ramesh Sharma if patient
    if (role === 'patient') {
      const aptStmt = db.prepare(`
        INSERT INTO appointments (id, doctor_id, doctor_name, doctor_specialization, doctor_avatar, patient_id, patient_name, patient_age, patient_gender, date, time, status, type, symptoms, phc_center)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      aptStmt.run(
        `apt-${Date.now()}`,
        'doc-sharma',
        'Dr. Ramesh Sharma',
        'General Physician',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
        id,
        name,
        age,
        gender,
        '27 September',
        '16:00',
        'upcoming',
        'video',
        'General Rural Health Checkup & Consultation',
        `${village || 'Rampur'} Tele-Kiosk`
      );
    }

    const createdUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return res.status(201).json({ success: true, user: createdUser });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message || 'Failed to register user' });
  }
});

// Login
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const rawId = req.body.identifier || req.body.email || req.body.phone || req.body.name;
    const { password, role = 'patient' } = req.body;

    if (!rawId || typeof rawId !== 'string' || !rawId.trim()) {
      return res.status(400).json({ error: 'Identifier (name, email, or mobile) is required' });
    }

    const identifier = rawId.trim();
    const clean = identifier.toLowerCase();

    // Check if user exists
    let user: any = db
      .prepare(
        'SELECT * FROM users WHERE LOWER(email) = ? OR phone = ? OR LOWER(name) = ?'
      )
      .get(clean, identifier.trim(), clean);

    // If not found, dynamically create this user so any new user can log in with their real name!
    if (!user) {
      const rawName = identifier.includes('@')
        ? identifier.split('@')[0].replace(/[._-]/g, ' ')
        : identifier;
      const formattedName = rawName
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const id = `user-${Date.now()}`;
      const email = identifier.includes('@')
        ? identifier
        : `${rawName.toLowerCase().replace(/\s+/g, '')}@graminhealth.in`;
      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        formattedName
      )}&backgroundColor=0d9488`;
      const abhaId = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
        1000 + Math.random() * 9000
      )}-${Math.floor(1000 + Math.random() * 9000)}`;

      const stmt = db.prepare(`
        INSERT INTO users (id, name, role, email, phone, password, avatar, age, gender, district, village, abha_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        formattedName,
        role,
        email,
        identifier.match(/^\+?\d+$/) ? identifier : '+91 98765 43210',
        password || '123456',
        avatar,
        28,
        'Male',
        'Varanasi Rural',
        'Rampur Sub-Center',
        abhaId
      );

      // Create welcome appointment
      db.prepare(`
        INSERT INTO appointments (id, doctor_id, doctor_name, doctor_specialization, doctor_avatar, patient_id, patient_name, patient_age, patient_gender, date, time, status, type, symptoms, phc_center)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `apt-${Date.now()}`,
        'doc-sharma',
        'Dr. Ramesh Sharma',
        'General Physician',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
        id,
        formattedName,
        28,
        'Male',
        '27 September',
        '16:00',
        'upcoming',
        'video',
        'General Rural Health Consultation',
        'Rampur Sub-Center Tele-Kiosk'
      );

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    return res.json({ success: true, user });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Failed to login' });
  }
});

// List users
authRouter.get('/users', (_req: Request, res: Response) => {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    return res.json({ users });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
