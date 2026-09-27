export type UserRole = 'patient' | 'doctor' | 'admin' | 'public';

export type Language = 'en' | 'hi' | 'bn' | 'te';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar: string;
  age?: number;
  gender?: string;
  district?: string;
  village?: string;
  abhaId?: string; // Ayushman Bharat Health Account ID
  password?: string;
  specialization?: string;
  qualification?: string;
  hospital?: string;
  regNumber?: string;
  experience?: string;
  rating?: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  hospital: string;
  district: string;
  languages: string[];
  consultationFee: number;
  isBPLFree: boolean;
  avatar: string;
  availability: 'Available Today' | 'Next Available: Tomorrow' | 'In Consultation';
  nextSlot: string;
  availableDates: string[];
  slots: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  time: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'phc-kiosk';
  symptoms: string;
  phcCenter?: string;
}

export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'Before Food' | 'After Food' | 'With Food' | 'As Needed';
  instructions?: string;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorRegNo: string;
  hospital: string;
  date: string;
  diagnosis: string;
  medicines: MedicineItem[];
  advice: string;
  followUpDate?: string;
  qrCodeUrl?: string;
  remindersActive?: boolean;
}

export interface OCRScanResult {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  confidence: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'doctor' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isDisclaimer?: boolean;
  quickActions?: string[];
}

export interface KioskStats {
  id: string;
  village: string;
  district: string;
  ashaWorker: string;
  solarBatteryStatus: number; // percentage
  connectivityStatus: 'Strong 4G' | 'Low 2G/3G' | 'Satellite Online' | 'Offline Syncing';
  patientsSeenToday: number;
  pendingTeleConsults: number;
  medicinesStockLevel: 'Optimal' | 'Low' | 'Critical';
}
