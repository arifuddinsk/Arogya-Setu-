import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Doctor,
  Appointment,
  Prescription,
  OCRScanResult,
  Language,
  UserRole,
} from '../types';
import {
  MOCK_PATIENT,
  MOCK_DOCTOR,
  MOCK_ADMIN,
  MOCK_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  TRANSLATIONS,
} from '../data/mockData';
import { api } from '../services/api';

export type ScreenType =
  | 'landing'
  | 'login'
  | 'register'
  | 'patient-dashboard'
  | 'find-doctor'
  | 'appointment-booking'
  | 'video-consultation'
  | 'prescription-view'
  | 'ocr-upload'
  | 'ai-assistant'
  | 'doctor-dashboard'
  | 'patient-details'
  | 'create-prescription'
  | 'admin-dashboard';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: UserProfile;
  currentScreen: ScreenType;
  registeredUsers: UserProfile[];
  selectedDoctor: Doctor | null;
  selectedPatient: UserProfile | null;
  selectedPrescription: Prescription | null;
  activeAppointment: Appointment | null;
  appointments: Appointment[];
  prescriptions: Prescription[];
  savedOCRScans: OCRScanResult[];
  language: Language;
  lowBandwidthMode: boolean;
  toasts: Toast[];
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  setLowBandwidthMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  navigateTo: (screen: ScreenType) => void;
  switchRole: (role: UserRole) => void;
  registerUser: (profile: Omit<UserProfile, 'id'>, password?: string) => UserProfile;
  loginUser: (identifier: string, password?: string, role?: UserRole) => UserProfile;
  logoutUser: () => void;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  setSelectedPatient: (patient: UserProfile | null) => void;
  setSelectedPrescription: (prescription: Prescription | null) => void;
  setActiveAppointment: (appointment: Appointment | null) => void;
  bookAppointment: (doctor: Doctor, date: string, time: string, symptoms: string) => void;
  createPrescription: (newRx: Omit<Prescription, 'id'>) => Prescription;
  togglePrescriptionReminder: (prescriptionId: string) => void;
  saveOCRResult: (items: OCRScanResult[]) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('arogya_registered_users');
    return saved ? JSON.parse(saved) : [MOCK_PATIENT, MOCK_DOCTOR, MOCK_ADMIN];
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('arogya_user');
    return saved ? JSON.parse(saved) : MOCK_PATIENT;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const saved = localStorage.getItem('arogya_screen');
    return (saved as ScreenType) || 'landing';
  });

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(MOCK_DOCTORS[0]);
  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(currentUser);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(INITIAL_PRESCRIPTIONS[0]);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(INITIAL_APPOINTMENTS[0]);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('arogya_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('arogya_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [savedOCRScans, setSavedOCRScans] = useState<OCRScanResult[]>(() => {
    const saved = localStorage.getItem('arogya_ocr');
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguageState] = useState<Language>('en');
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('arogya_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('arogya_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('arogya_screen', currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    localStorage.setItem('arogya_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('arogya_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('arogya_ocr', JSON.stringify(savedOCRScans));
  }, [savedOCRScans]);

  // Sync data with SQLite Backend Server on startup
  useEffect(() => {
    api.appointments.getAll()
      .then((res) => {
        if (res.appointments && res.appointments.length > 0) {
          setAppointments(res.appointments);
          const upcoming = res.appointments.find((a: any) => a.status === 'upcoming') || res.appointments[0];
          if (upcoming) setActiveAppointment(upcoming);
        }
      })
      .catch((err) => {
        console.warn('Backend server syncing offline, using local store:', err.message);
      });

    api.prescriptions.getAll()
      .then((res) => {
        if (res.prescriptions && res.prescriptions.length > 0) {
          setPrescriptions(res.prescriptions);
          if (res.prescriptions[0]) setSelectedPrescription(res.prescriptions[0]);
        }
      })
      .catch((err) => {
        console.warn('Backend server prescriptions offline, using local store:', err.message);
      });
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const langNames: Record<Language, string> = {
      en: 'English',
      hi: 'हिंदी (Hindi)',
      bn: 'বাংলা (Bengali)',
      te: 'తెలుగు (Telugu)',
    };
    showToast(`Language switched to ${langNames[lang]}`, 'info');
  };

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Register a new user with their real details
  const registerUser = (profileData: Omit<UserProfile, 'id'>, password?: string): UserProfile => {
    const id = `user-${Date.now()}`;
    const avatar = profileData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profileData.name)}&backgroundColor=0d9488`;
    const abhaId = profileData.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: UserProfile = {
      ...profileData,
      id,
      avatar,
      abhaId,
      password: password || '123456',
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Persist to backend SQLite
    api.auth.register(newUser).catch((err) => {
      console.warn('Backend register sync warning:', err.message);
    });

    if (newUser.role === 'patient') {
      // Create a personalized upcoming appointment for this new patient
      const welcomeAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        doctorId: 'doc-sharma',
        doctorName: 'Dr. Ramesh Sharma',
        doctorSpecialization: 'General Physician',
        doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
        patientId: newUser.id,
        patientName: newUser.name,
        patientAge: newUser.age || 28,
        patientGender: newUser.gender || 'Male',
        date: '27 September',
        time: '16:00',
        status: 'upcoming',
        type: 'video',
        symptoms: 'General Rural Health Checkup & Consultation',
        phcCenter: `${newUser.village || 'Rampur'} Tele-Kiosk`,
      };
      setAppointments((prev) => [welcomeAppointment, ...prev]);
      setActiveAppointment(welcomeAppointment);
      navigateTo('patient-dashboard');
    } else if (newUser.role === 'doctor') {
      navigateTo('doctor-dashboard');
    } else {
      navigateTo('admin-dashboard');
    }

    showToast(`Welcome to Arogya Setu, ${newUser.name}!`, 'success');
    return newUser;
  };

  // Login existing user or authenticate with provided identifier
  const loginUser = (identifier: string, password?: string, role: UserRole = 'patient'): UserProfile => {
    const cleanId = identifier.trim().toLowerCase();

    // Check if user exists in registeredUsers
    const foundUser = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '') ||
        u.name.toLowerCase() === cleanId
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setSelectedPatient(foundUser);
      if (foundUser.role === 'doctor') {
        navigateTo('doctor-dashboard');
      } else if (foundUser.role === 'admin') {
        navigateTo('admin-dashboard');
      } else {
        navigateTo('patient-dashboard');
      }
      showToast(`Welcome back, ${foundUser.name}!`, 'success');
      return foundUser;
    }

    // If new user identifier typed, derive user name and create account dynamically
    const rawName = identifier.includes('@')
      ? identifier.split('@')[0].replace(/[._-]/g, ' ')
      : identifier;
    const formattedName = rawName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: formattedName || 'Health User',
      role,
      email: identifier.includes('@') ? identifier : `${rawName.toLowerCase().replace(/\s+/g, '')}@graminhealth.in`,
      phone: identifier.match(/^\+?\d+$/) ? identifier : '+91 98765 43210',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=0d9488`,
      district: 'Varanasi Rural',
      village: 'Rampur Sub-Center',
      abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      password: password || '123456',
      age: 28,
      gender: 'Male',
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Sync to backend SQLite
    api.auth.login(identifier, password, role).catch((err) => {
      console.warn('Backend login sync warning:', err.message);
    });

    if (role === 'patient') {
      const welcomeAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        doctorId: 'doc-sharma',
        doctorName: 'Dr. Ramesh Sharma',
        doctorSpecialization: 'General Physician',
        doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=250&q=80',
        patientId: newUser.id,
        patientName: newUser.name,
        patientAge: 28,
        patientGender: 'Male',
        date: '27 September',
        time: '16:00',
        status: 'upcoming',
        type: 'video',
        symptoms: 'General Rural Health Checkup & Consultation',
        phcCenter: 'Rampur Sub-Center Tele-Kiosk',
      };
      setAppointments((prev) => [welcomeAppointment, ...prev]);
      setActiveAppointment(welcomeAppointment);
      navigateTo('patient-dashboard');
    } else if (role === 'doctor') {
      navigateTo('doctor-dashboard');
    } else {
      navigateTo('admin-dashboard');
    }

    showToast(`Logged in successfully as ${newUser.name}!`, 'success');
    return newUser;
  };

  const logoutUser = () => {
    setCurrentUser(MOCK_PATIENT);
    navigateTo('landing');
    showToast('Logged out successfully', 'info');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'doctor') {
      setCurrentUser(MOCK_DOCTOR);
      setSelectedPatient(MOCK_PATIENT);
      navigateTo('doctor-dashboard');
      showToast('Switched to Doctor Profile: Dr. Ramesh Sharma', 'info');
    } else if (role === 'admin') {
      setCurrentUser(MOCK_ADMIN);
      navigateTo('admin-dashboard');
      showToast('Switched to ASHA Health Coordinator: Sunita Devi', 'info');
    } else if (role === 'patient') {
      // Find latest patient or Rahul
      const lastPatient = registeredUsers.find((u) => u.role === 'patient') || MOCK_PATIENT;
      setCurrentUser(lastPatient);
      setSelectedPatient(lastPatient);
      navigateTo('patient-dashboard');
      showToast(`Switched to Patient Profile: ${lastPatient.name}`, 'info');
    } else {
      navigateTo('landing');
    }
  };

  const bookAppointment = (
    doctor: Doctor,
    date: string,
    time: string,
    symptoms: string
  ) => {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorAvatar: doctor.avatar,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientAge: currentUser.age || 28,
      patientGender: currentUser.gender || 'Male',
      date,
      time,
      status: 'upcoming',
      type: 'video',
      symptoms: symptoms || 'General Tele-Consultation',
      phcCenter: `${currentUser.village || 'Rampur'} Tele-Kiosk`,
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setActiveAppointment(newAppointment);

    // Persist to backend SQLite database
    api.appointments.book(newAppointment).catch((err) => {
      console.warn('Backend appointment sync warning:', err.message);
    });

    showToast(`Appointment confirmed with ${doctor.name} on ${date} at ${time}!`, 'success');
  };

  const createPrescription = (newRxData: Omit<Prescription, 'id'>): Prescription => {
    const newRx: Prescription = {
      ...newRxData,
      id: `rx-${Date.now()}`,
      remindersActive: true,
    };
    setPrescriptions((prev) => [newRx, ...prev]);
    setSelectedPrescription(newRx);

    // Persist to backend SQLite database
    api.prescriptions.create(newRx).catch((err) => {
      console.warn('Backend prescription sync warning:', err.message);
    });

    showToast(`Prescription generated successfully for ${newRx.patientName}!`, 'success');
    return newRx;
  };

  const togglePrescriptionReminder = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === prescriptionId) {
          const nextState = !rx.remindersActive;
          showToast(
            nextState
              ? 'SMS & Voice Reminders activated for your medicine schedule! 🔔'
              : 'Reminders paused.',
            nextState ? 'success' : 'info'
          );
          api.prescriptions.toggleReminder(prescriptionId).catch(() => {});
          return { ...rx, remindersActive: nextState };
        }
        return rx;
      })
    );
  };

  const saveOCRResult = (items: OCRScanResult[]) => {
    setSavedOCRScans((prev) => [...items, ...prev]);
    api.ocr.save(items, currentUser.id).catch(() => {});
    showToast(`${items.length} medicines digitized and added to your health record!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentScreen,
        registeredUsers,
        selectedDoctor,
        selectedPatient,
        selectedPrescription,
        activeAppointment,
        appointments,
        prescriptions,
        savedOCRScans,
        language,
        lowBandwidthMode,
        toasts,
        t,
        setLanguage,
        setLowBandwidthMode,
        navigateTo,
        switchRole,
        registerUser,
        loginUser,
        logoutUser,
        setSelectedDoctor,
        setSelectedPatient,
        setSelectedPrescription,
        setActiveAppointment,
        bookAppointment,
        createPrescription,
        togglePrescriptionReminder,
        saveOCRResult,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
