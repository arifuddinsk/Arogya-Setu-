import React, { useState } from 'react';
import {
  Activity,
  Globe,
  User,
  Stethoscope,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Layers,
  ArrowRight,
  LogOut,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useApp, ScreenType } from '../../context/AppContext';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentScreen,
    language,
    setLanguage,
    navigateTo,
    switchRole,
    logoutUser,
    t,
  } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [screensMenuOpen, setScreensMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const screensList: { id: ScreenType; label: string; tag: string }[] = [
    { id: 'landing', label: '1. Landing Page', tag: 'Public' },
    { id: 'login', label: '2. Login', tag: 'Auth' },
    { id: 'register', label: '3. Registration', tag: 'Auth' },
    { id: 'patient-dashboard', label: '4. Patient Dashboard', tag: 'Patient' },
    { id: 'find-doctor', label: '5. Find Doctor', tag: 'Patient' },
    { id: 'appointment-booking', label: '6. Appointment Booking', tag: 'Patient' },
    { id: 'video-consultation', label: '7. Video Consultation', tag: 'Patient/Dr' },
    { id: 'prescription-view', label: '8. Prescription & Reminders', tag: 'Patient' },
    { id: 'ocr-upload', label: '9. OCR Rx Digitizer', tag: 'Patient' },
    { id: 'ai-assistant', label: '10. AI Health Assistant', tag: 'Patient' },
    { id: 'doctor-dashboard', label: '11. Doctor Dashboard', tag: 'Doctor' },
    { id: 'patient-details', label: '12. Patient Details Record', tag: 'Doctor' },
    { id: 'create-prescription', label: '13. Create Prescription (Rx)', tag: 'Doctor' },
    { id: 'admin-dashboard', label: '14. Admin / Tele-Kiosk Hub', tag: 'Admin' },
  ];

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  Arogya<span className="text-teal-600">Setu</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Rural Health
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Rural Telehealth & Digital Mission
              </p>
            </div>
          </div>

          {/* Center Navigation Shortcuts (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentUser.role === 'patient' && (
              <>
                <button
                  onClick={() => navigateTo('patient-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentScreen === 'patient-dashboard'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('find-doctor')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentScreen === 'find-doctor'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Find Doctor
                </button>
                <button
                  onClick={() => navigateTo('prescription-view')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentScreen === 'prescription-view'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Prescriptions
                </button>
                <button
                  onClick={() => navigateTo('ocr-upload')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentScreen === 'ocr-upload'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  OCR Scan
                </button>
                <button
                  onClick={() => navigateTo('ai-assistant')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    currentScreen === 'ai-assistant'
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  AI Assistant
                </button>
              </>
            )}

            {currentUser.role === 'doctor' && (
              <>
                <button
                  onClick={() => navigateTo('doctor-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentScreen === 'doctor-dashboard'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Appointments Queue
                </button>
                <button
                  onClick={() => navigateTo('patient-details')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentScreen === 'patient-details'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Patient Records
                </button>
                <button
                  onClick={() => navigateTo('create-prescription')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentScreen === 'create-prescription'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Write Prescription
                </button>
              </>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700"
              >
                Tele-Kiosks & Village Surveillance
              </button>
            )}
          </nav>

          {/* Right Action Tools: Screen Jumper + Language Selector + Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Screen Jumper Dropdown (Crucial for Reviewers to jump to any of the 14 screens instantly!) */}
            <div className="relative">
              <button
                onClick={() => setScreensMenuOpen(!screensMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
                title="Jump to any screen"
              >
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Screens (14)</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {screensMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setScreensMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Jump to Frontend Screen
                  </div>
                  {screensList.map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() => navigateTo(screen.id)}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentScreen === screen.id
                          ? 'bg-teal-50 text-teal-800 font-bold border-l-4 border-teal-600'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{screen.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          screen.tag === 'Doctor'
                            ? 'bg-blue-100 text-blue-700'
                            : screen.tag === 'Patient'
                            ? 'bg-emerald-100 text-emerald-700'
                            : screen.tag === 'Admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {screen.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <button
                    onClick={() => handleLanguageSelect('en')}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center justify-between ${
                      language === 'en' ? 'font-bold text-teal-600' : 'text-slate-700'
                    }`}
                  >
                    English <span>EN</span>
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('hi')}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center justify-between ${
                      language === 'hi' ? 'font-bold text-teal-600' : 'text-slate-700'
                    }`}
                  >
                    हिन्दी <span>HI</span>
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('bn')}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center justify-between ${
                      language === 'bn' ? 'font-bold text-teal-600' : 'text-slate-700'
                    }`}
                  >
                    বাংলা <span>BN</span>
                  </button>
                  <button
                    onClick={() => handleLanguageSelect('te')}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center justify-between ${
                      language === 'te' ? 'font-bold text-teal-600' : 'text-slate-700'
                    }`}
                  >
                    తెలుగు <span>TE</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Role Switcher (Patient / Doctor / Admin) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  currentUser.role === 'doctor'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : currentUser.role === 'admin'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : 'bg-teal-50 text-teal-800 border-teal-200'
                }`}
              >
                {currentUser.role === 'doctor' ? (
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                ) : currentUser.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                ) : (
                  <User className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span className="hidden sm:inline font-bold truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-1 rounded bg-white/70">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  {/* Current Account Card */}
                  <div className="px-3.5 pb-2.5 border-b border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Active Account
                    </div>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="overflow-hidden">
                        <div className="font-extrabold text-xs text-slate-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Demo Preset Profiles
                  </div>
                  <button
                    onClick={() => switchRole('patient')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-teal-50 flex items-center gap-2 text-slate-800"
                  >
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Rahul Sharma</div>
                      <div className="text-[11px] text-slate-500">Demo Patient</div>
                    </div>
                  </button>
                  <button
                    onClick={() => switchRole('doctor')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center gap-2 text-slate-800"
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Dr. Ramesh Sharma</div>
                      <div className="text-[11px] text-slate-500">Demo Doctor</div>
                    </div>
                  </button>
                  <button
                    onClick={() => switchRole('admin')}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-purple-50 flex items-center gap-2 text-slate-800"
                  >
                    <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold">Sunita Devi</div>
                      <div className="text-[11px] text-slate-500">Demo ASHA Admin</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1.5" />
                  <button
                    onClick={() => logoutUser()}
                    className="w-full px-3.5 py-2 text-left text-xs hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Log Out / Switch Account</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase">
              Main Navigation
            </div>
            {currentUser.role === 'patient' && (
              <>
                <button
                  onClick={() => {
                    navigateTo('patient-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigateTo('find-doctor');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Find Doctor
                </button>
                <button
                  onClick={() => {
                    navigateTo('prescription-view');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Prescriptions
                </button>
                <button
                  onClick={() => {
                    navigateTo('ocr-upload');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  OCR Scan Prescription
                </button>
                <button
                  onClick={() => {
                    navigateTo('ai-assistant');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-purple-700 hover:bg-purple-50 font-medium"
                >
                  Aarogya Setu AI Assistant
                </button>
              </>
            )}
            {currentUser.role === 'doctor' && (
              <>
                <button
                  onClick={() => {
                    navigateTo('doctor-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Doctor Appointments
                </button>
                <button
                  onClick={() => {
                    navigateTo('patient-details');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Patient Medical Records
                </button>
                <button
                  onClick={() => {
                    navigateTo('create-prescription');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  Generate Prescription
                </button>
              </>
            )}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  navigateTo('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Tele-Kiosks & Village Surveillance
              </button>
            )}
            <div className="border-t border-slate-100 pt-2 px-2 flex justify-between items-center">
              <button
                onClick={() => {
                  navigateTo('landing');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Landing Page
              </button>
              <button
                onClick={() => {
                  navigateTo('login');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-teal-600 font-semibold"
              >
                Switch Account
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
