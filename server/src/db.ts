import 'dotenv/config';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If DB_PATH is provided, use it; otherwise use sensible local development path
export const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.resolve(__dirname, '../arogya_setu.db');

// Ensure parent directory exists before opening database (e.g. /data or custom persistent path)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize schema and seed data
export function initDatabase() {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      password TEXT,
      avatar TEXT,
      age INTEGER,
      gender TEXT,
      district TEXT,
      village TEXT,
      abha_id TEXT,
      specialization TEXT,
      qualification TEXT,
      hospital TEXT,
      reg_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Doctors Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      qualification TEXT,
      experience_years INTEGER,
      rating REAL,
      reviews_count INTEGER,
      hospital TEXT,
      district TEXT,
      languages_json TEXT,
      consultation_fee INTEGER,
      is_bpl_free INTEGER DEFAULT 1,
      avatar TEXT,
      availability TEXT,
      next_slot TEXT,
      available_dates_json TEXT,
      slots_json TEXT
    );
  `);

  // Appointments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      doctor_id TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      doctor_specialization TEXT NOT NULL,
      doctor_avatar TEXT,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      patient_age INTEGER,
      patient_gender TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT DEFAULT 'upcoming',
      type TEXT DEFAULT 'video',
      symptoms TEXT,
      phc_center TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Prescriptions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      appointment_id TEXT,
      patient_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      patient_age INTEGER,
      doctor_id TEXT NOT NULL,
      doctor_name TEXT NOT NULL,
      doctor_specialization TEXT,
      doctor_reg_no TEXT,
      hospital TEXT,
      date TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      medicines_json TEXT NOT NULL,
      advice TEXT,
      follow_up_date TEXT,
      reminders_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // OCR Scans Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ocr_scans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT,
      image_url TEXT,
      extracted_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Village Tele-Kiosks Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS kiosks (
      id TEXT PRIMARY KEY,
      village TEXT NOT NULL,
      district TEXT NOT NULL,
      asha_worker TEXT NOT NULL,
      solar_battery_status INTEGER DEFAULT 90,
      connectivity_status TEXT DEFAULT 'Strong 4G',
      patients_seen_today INTEGER DEFAULT 0,
      pending_tele_consults INTEGER DEFAULT 0,
      medicines_stock_level TEXT DEFAULT 'Optimal'
    );
  `);

  seedInitialData();
}

function seedInitialData() {
  // Check if users already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, role, email, phone, password, avatar, age, gender, district, village, abha_id, specialization, qualification, reg_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'patient-rahul',
      'Rahul Sharma',
      'patient',
      'rahul.sharma@graminhealth.in',
      '+91 98765 43210',
      '123456',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      28,
      'Male',
      'Varanasi Rural',
      'Rampur, Block Cholapur',
      '91-8842-1029-4412',
      null,
      null,
      null
    );

    insertUser.run(
      'doc-sharma',
      'Dr. Ramesh Sharma',
      'doctor',
      'dr.sharma@district-telehealth.gov.in',
      '+91 94150 12345',
      'doctor123',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      45,
      'Male',
      'Varanasi District Hospital',
      'Tele-Hub Room 4',
      null,
      'General Physician & Rural Health Specialist',
      'MBBS, MD - AIIMS',
      'MCI-UP-48921-2010'
    );

    insertUser.run(
      'admin-sunita',
      'Sunita Devi',
      'admin',
      'sunita.asha@arogyasetu.gov.in',
      '+91 98390 77112',
      'asha123',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      38,
      'Female',
      'Varanasi Rural',
      'Rampur Sub-Center',
      null,
      null,
      null,
      null
    );
  }

  // Check doctors
  const docCount = db.prepare('SELECT COUNT(*) as count FROM doctors').get() as { count: number };
  if (docCount.count === 0) {
    const insertDoc = db.prepare(`
      INSERT INTO doctors (id, name, specialization, qualification, experience_years, rating, reviews_count, hospital, district, languages_json, consultation_fee, is_bpl_free, avatar, availability, next_slot, available_dates_json, slots_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertDoc.run(
      'doc-sharma',
      'Dr. Ramesh Sharma',
      'General Physician',
      'MBBS, MD - AIIMS',
      15,
      4.9,
      342,
      'Civil Hospital Tele-Health Center',
      'Varanasi',
      JSON.stringify(['Hindi', 'English', 'Bhojpuri']),
      150,
      1,
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      'Available Today',
      'Today • 4:00 PM',
      JSON.stringify(['27 September', '28 September', '29 September']),
      JSON.stringify(['10:00', '11:30', '14:00', '16:00'])
    );

    insertDoc.run(
      'doc-priya',
      'Dr. Priya Patel',
      'Pediatrician (Child Specialist)',
      'MBBS, DCH, DNB',
      11,
      4.8,
      219,
      'District Maternal & Child Care Hospital',
      'Varanasi',
      JSON.stringify(['Hindi', 'English', 'Gujarati']),
      200,
      1,
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=250&q=80',
      'Available Today',
      'Today • 2:30 PM',
      JSON.stringify(['27 September', '28 September', '30 September']),
      JSON.stringify(['10:30', '12:00', '14:30', '17:00'])
    );

    insertDoc.run(
      'doc-rajesh',
      'Dr. Rajesh Kumar',
      'Cardiologist',
      'MBBS, MD, DM (Cardiology)',
      18,
      4.7,
      185,
      'Regional Heart & Vascular Institute',
      'Lucknow Tele-Link',
      JSON.stringify(['Hindi', 'English']),
      300,
      1,
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=250&q=80',
      'Next Available: Tomorrow',
      'Tomorrow • 10:00 AM',
      JSON.stringify(['28 September', '29 September', '01 October']),
      JSON.stringify(['10:00', '11:00', '15:00', '16:30'])
    );

    insertDoc.run(
      'doc-ananya',
      'Dr. Ananya Sen',
      'Gynecologist & Obstetrician',
      'MBBS, MS (OBG) - KGMU',
      13,
      4.9,
      290,
      'Women & Child Wellness Tele-Hub',
      'Varanasi',
      JSON.stringify(['Hindi', 'English', 'Bengali']),
      200,
      1,
      'https://images.unsplash.com/photo-1594824813576-928923b9d038?auto=format&fit=crop&w=250&q=80',
      'Available Today',
      'Today • 5:15 PM',
      JSON.stringify(['27 September', '28 September', '29 September']),
      JSON.stringify(['11:00', '13:00', '15:15', '17:15'])
    );
  }

  // Check appointments
  const aptCount = db.prepare('SELECT COUNT(*) as count FROM appointments').get() as { count: number };
  if (aptCount.count === 0) {
    const insertApt = db.prepare(`
      INSERT INTO appointments (id, doctor_id, doctor_name, doctor_specialization, doctor_avatar, patient_id, patient_name, patient_age, patient_gender, date, time, status, type, symptoms, phc_center)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertApt.run(
      'apt-001',
      'doc-sharma',
      'Dr. Ramesh Sharma',
      'General Physician',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      'patient-rahul',
      'Rahul Sharma',
      28,
      'Male',
      '27 September',
      '16:00',
      'upcoming',
      'video',
      'Recurring high fever, body ache, mild dry cough for 3 days',
      'Rampur Sub-Center Tele-Kiosk'
    );

    insertApt.run(
      'apt-002',
      'doc-sharma',
      'Dr. Ramesh Sharma',
      'General Physician',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      'patient-priya',
      'Priya Verma',
      24,
      'Female',
      '27 September',
      '11:30',
      'upcoming',
      'video',
      'Prenatal 2nd trimester routine check-up & weakness',
      'Cholapur PHC Kiosk 1'
    );

    insertApt.run(
      'apt-003',
      'doc-sharma',
      'Dr. Ramesh Sharma',
      'General Physician',
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
      'patient-amit',
      'Amit Patel',
      52,
      'Male',
      '27 September',
      '14:00',
      'upcoming',
      'video',
      'Hypertension follow-up & BP medication review',
      'Shivpur Kiosk'
    );
  }

  // Check prescriptions
  const rxCount = db.prepare('SELECT COUNT(*) as count FROM prescriptions').get() as { count: number };
  if (rxCount.count === 0) {
    const insertRx = db.prepare(`
      INSERT INTO prescriptions (id, appointment_id, patient_id, patient_name, patient_age, doctor_id, doctor_name, doctor_specialization, doctor_reg_no, hospital, date, diagnosis, medicines_json, advice, follow_up_date, reminders_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const medicines = [
      {
        id: 'med-1',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: '2 times/day',
        duration: '5 days',
        timing: 'After Food',
        instructions: 'Morning and evening after meals with warm water. Do not exceed 4 doses/24hr.',
      },
      {
        id: 'med-2',
        name: 'Amoxicillin Trihydrate',
        dosage: '500mg',
        frequency: '2 times/day',
        duration: '5 days',
        timing: 'After Food',
        instructions: 'Complete full 5-day course even if fever subsides.',
      },
      {
        id: 'med-3',
        name: 'Cetirizine HCl',
        dosage: '10mg',
        frequency: '1 time/day (Night)',
        duration: '3 days',
        timing: 'After Food',
        instructions: 'Take 1 tablet at bedtime for throat itch and nasal congestion.',
      },
      {
        id: 'med-4',
        name: 'Oral Rehydration Salts (ORS)',
        dosage: '1 Sachet in 1L boiled water',
        frequency: 'Throughout day',
        duration: '3 days',
        timing: 'As Needed',
        instructions: 'Drink frequently to prevent dehydration during fever episodes.',
      },
    ];

    insertRx.run(
      'rx-2026-0927',
      'apt-001',
      'patient-rahul',
      'Rahul Sharma',
      28,
      'doc-sharma',
      'Dr. Ramesh Sharma',
      'General Physician',
      'MCI-UP-48921-2010',
      'Civil Hospital Tele-Health Center, Varanasi',
      '27 Sep 2026',
      'Acute Viral Pharyngitis with Pyrexia (Viral Fever)',
      JSON.stringify(medicines),
      'Drink plenty of boiled warm water. Avoid cold beverages and dust. If fever persists above 102°F after 48 hours, report to nearest PHC immediately.',
      '02 Oct 2026',
      1
    );
  }

  // Check kiosks
  const kioskCount = db.prepare('SELECT COUNT(*) as count FROM kiosks').get() as { count: number };
  if (kioskCount.count === 0) {
    const insertKiosk = db.prepare(`
      INSERT INTO kiosks (id, village, district, asha_worker, solar_battery_status, connectivity_status, patients_seen_today, pending_tele_consults, medicines_stock_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertKiosk.run('kiosk-01', 'Rampur Sub-Center', 'Varanasi Rural', 'Sunita Devi', 94, 'Strong 4G', 18, 3, 'Optimal');
    insertKiosk.run('kiosk-02', 'Cholapur Main PHC', 'Varanasi Rural', 'Rekha Maurya', 82, 'Low 2G/3G', 31, 6, 'Optimal');
    insertKiosk.run('kiosk-03', 'Badagaon Kiosk', 'Varanasi Rural', 'Meena Yadav', 68, 'Satellite Online', 12, 1, 'Low');
  }
}
