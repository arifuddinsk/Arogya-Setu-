import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { EmergencyBar } from './components/common/EmergencyBar';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';

// All 14 Screens
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { PatientDashboardScreen } from './screens/PatientDashboardScreen';
import { FindDoctorScreen } from './screens/FindDoctorScreen';
import { AppointmentBookingScreen } from './screens/AppointmentBookingScreen';
import { VideoConsultationScreen } from './screens/VideoConsultationScreen';
import { PrescriptionScreen } from './screens/PrescriptionScreen';
import { OCRUploadScreen } from './screens/OCRUploadScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { DoctorDashboardScreen } from './screens/DoctorDashboardScreen';
import { PatientDetailsScreen } from './screens/PatientDetailsScreen';
import { CreatePrescriptionScreen } from './screens/CreatePrescriptionScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';

import { Activity, ShieldCheck, HeartPulse, Globe } from 'lucide-react';

const ScreenRouter: React.FC = () => {
  const { currentScreen, navigateTo } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen />;
      case 'login':
        return <LoginScreen />;
      case 'register':
        return <RegisterScreen />;
      case 'patient-dashboard':
        return <PatientDashboardScreen />;
      case 'find-doctor':
        return <FindDoctorScreen />;
      case 'appointment-booking':
        return <AppointmentBookingScreen />;
      case 'video-consultation':
        return <VideoConsultationScreen />;
      case 'prescription-view':
        return <PrescriptionScreen />;
      case 'ocr-upload':
        return <OCRUploadScreen />;
      case 'ai-assistant':
        return <AIAssistantScreen />;
      case 'doctor-dashboard':
        return <DoctorDashboardScreen />;
      case 'patient-details':
        return <PatientDetailsScreen />;
      case 'create-prescription':
        return <CreatePrescriptionScreen />;
      case 'admin-dashboard':
        return <AdminDashboardScreen />;
      default:
        return <LandingScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-500 selection:text-white">
      {/* 108 Emergency and Low-Bandwidth Mode Bar */}
      <EmergencyBar />

      {/* Main Header with Logo, Role Switcher & Screen Jumper */}
      <Header />

      {/* Active Screen View */}
      <main className="flex-1">{renderScreen()}</main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Accessible Footer (Hidden during video consultation to keep screen clear) */}
      {currentScreen !== 'video-consultation' && (
        <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white text-sm">
                  Arogya Setu <span className="text-teal-400 font-normal">| Rural Health Platform</span>
                </span>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 text-slate-400">
                <button
                  onClick={() => navigateTo('landing')}
                  className="hover:text-white transition-colors"
                >
                  Landing Page
                </button>
                <button
                  onClick={() => navigateTo('patient-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Patient Dashboard
                </button>
                <button
                  onClick={() => navigateTo('doctor-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Doctor Dashboard
                </button>
                <button
                  onClick={() => navigateTo('admin-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  ASHA Tele-Kiosks
                </button>
                <button
                  onClick={() => navigateTo('ai-assistant')}
                  className="hover:text-purple-300 transition-colors"
                >
                  AI Assistant
                </button>
              </div>

              <div className="text-[11px] text-slate-500">
                ABDM National Health Authority Compliant • 2G/3G Optimized
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}

export default App;
