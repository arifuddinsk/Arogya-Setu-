import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Pill,
  FileText,
  Bot,
  Video,
  ScanLine,
  Clock,
  Heart,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Volume2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PatientDashboardScreen: React.FC = () => {
  const {
    currentUser,
    appointments,
    prescriptions,
    navigateTo,
    setSelectedDoctor,
    setActiveAppointment,
    setSelectedPrescription,
    showToast,
    t,
  } = useApp();

  const [takenMeds, setTakenMeds] = useState<Record<string, boolean>>({
    'med-1': true,
    'med-2': false,
  });

  // Find upcoming appointment for the logged in patient (or fallback to latest upcoming)
  const upcomingApt =
    appointments.find((a) => a.patientId === currentUser.id && a.status === 'upcoming') ||
    appointments.find((a) => a.status === 'upcoming') ||
    appointments[0];

  const handleJoinConsultation = () => {
    if (upcomingApt) {
      setActiveAppointment(upcomingApt);
    }
    navigateTo('video-consultation');
  };

  const handleToggleMed = (id: string, name: string) => {
    const nextVal = !takenMeds[id];
    setTakenMeds({ ...takenMeds, [id]: nextVal });
    showToast(
      nextVal ? `Marked ${name} as taken! ✅` : `Unmarked ${name}`,
      nextVal ? 'success' : 'info'
    );
  };

  const handleSpeakDosage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      showToast('Playing voice dosage instruction 🔊', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-12">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 text-white px-4 sm:px-6 lg:px-8 pt-8 pb-14 rounded-b-3xl shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-200 text-xs font-semibold uppercase tracking-wider">
                Gramin Swasthya Card
              </span>
              <span className="bg-teal-900/60 text-teal-300 text-[10px] px-2 py-0.5 rounded font-mono border border-teal-600/40">
                ABHA: {currentUser.abhaId || '91-8842-1029-4412'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('goodMorning')}, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-0.5">
              Village: {currentUser.village || 'Rampur, Cholapur Block'} • Dist: Varanasi
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white/50"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-white">{currentUser.name}</div>
              <div className="text-[10px] text-teal-200">Patient Active</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 space-y-6">
        {/* Highlighted Upcoming Appointment Card (From User Prompt Specification) */}
        {upcomingApt && (
          <div className="bg-white rounded-2xl shadow-xl border border-teal-100 p-5 overflow-hidden relative">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-28 h-28 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                    {t('upcomingAppointment')}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Today • 4:00 PM (16:00)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={upcomingApt.doctorAvatar}
                    alt={upcomingApt.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-100 shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {upcomingApt.doctorName}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700">
                      {upcomingApt.doctorSpecialization} • Civil Hospital Tele-Hub
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Symptoms: {upcomingApt.symptoms}
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact CTA from Prompt: [Join Consultation] */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <button
                  onClick={handleJoinConsultation}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-5 h-5 animate-pulse" />
                  <span>{t('joinConsultation')}</span>
                </button>
                <span className="text-[11px] text-slate-400 text-center sm:text-right">
                  Tele-Room ready • 2G/3G low latency enabled
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions Grid (Exact List from Prompt:
            🩺 Find Doctor
            📅 Appointments
            💊 Medicines
            📄 Prescriptions
            🤖 AI Assistant
            Plus OCR Scan) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              {t('quickActions')}
            </h2>
            <span className="text-xs text-slate-500">Tap to access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* 🩺 Find Doctor */}
            <button
              onClick={() => navigateTo('find-doctor')}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  🩺 Find Doctor
                </div>
                <div className="text-[10px] text-slate-500">Search specialists</div>
              </div>
            </button>

            {/* 📅 Appointments */}
            <button
              onClick={() => navigateTo('appointment-booking')}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  📅 Appointments
                </div>
                <div className="text-[10px] text-slate-500">Book new visit</div>
              </div>
            </button>

            {/* 💊 Medicines */}
            <button
              onClick={() => navigateTo('prescription-view')}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  💊 Medicines
                </div>
                <div className="text-[10px] text-slate-500">Dosage schedule</div>
              </div>
            </button>

            {/* 📄 Prescriptions */}
            <button
              onClick={() => navigateTo('prescription-view')}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  📄 Prescriptions
                </div>
                <div className="text-[10px] text-slate-500">View digital Rx</div>
              </div>
            </button>

            {/* 🤖 AI Assistant */}
            <button
              onClick={() => navigateTo('ai-assistant')}
              className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 hover:border-purple-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-purple-900 group-hover:text-purple-700 transition-colors">
                  🤖 Aarogya Setu AI
                </div>
                <div className="text-[10px] text-purple-600">Aarogya Setu AI</div>
              </div>
            </button>

            {/* 📷 Scan Rx (OCR) */}
            <button
              onClick={() => navigateTo('ocr-upload')}
              className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all text-left group flex flex-col justify-between h-28"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors flex items-center justify-center">
                <ScanLine className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-teal-900 group-hover:text-teal-700 transition-colors">
                  📷 OCR Upload
                </div>
                <div className="text-[10px] text-teal-600">Digitize paper Rx</div>
              </div>
            </button>
          </div>
        </div>

        {/* 2-Column Section: Today's Medicines & Rural Health Vitals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Today's Prescribed Medicine Schedule */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-600" />
                  Today's Medicines (From Dr. Sharma Rx)
                </h3>
                <p className="text-xs text-slate-500">Tap checkmark when taken</p>
              </div>
              <button
                onClick={() => navigateTo('prescription-view')}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-0.5"
              >
                View Full Rx <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Medicine 1 */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  takenMeds['med-1']
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-teal-50/40 border-teal-200 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleMed('med-1', 'Paracetamol 500mg')}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      takenMeds['med-1']
                        ? 'bg-teal-600 text-white'
                        : 'border-2 border-slate-300 hover:border-teal-600 bg-white'
                    }`}
                  >
                    {takenMeds['med-1'] && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        takenMeds['med-1']
                          ? 'line-through text-slate-500'
                          : 'text-slate-900'
                      }`}
                    >
                      Paracetamol 500mg (Morning Dose)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      2 times/day • After Food • For 5 days
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleSpeakDosage(
                      'Take Paracetamol 500 milligram after breakfast with warm water'
                    )
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-white"
                  title="Listen dosage instruction in Hindi/English"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Medicine 2 */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  takenMeds['med-2']
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleMed('med-2', 'Amoxicillin 500mg')}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      takenMeds['med-2']
                        ? 'bg-teal-600 text-white'
                        : 'border-2 border-slate-300 hover:border-teal-600 bg-white'
                    }`}
                  >
                    {takenMeds['med-2'] && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        takenMeds['med-2']
                          ? 'line-through text-slate-500'
                          : 'text-slate-900'
                      }`}
                    >
                      Amoxicillin 500mg (Antibiotic)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Take 1 capsule evening after meals with water
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleSpeakDosage(
                      'Take Amoxicillin 500 milligram after evening dinner'
                    )
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-100"
                  title="Listen dosage instruction"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Vitals Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                Latest Vitals (Sub-Center Kiosk)
              </h3>
              <span className="text-[10px] text-slate-400">Synced Today</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  Blood Pressure
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">118 / 78</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Normal range</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  SpO2 (Oxygen)
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">98%</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Optimal</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  Pulse / Heart Rate
                </div>
                <div className="text-lg font-black text-slate-900 mt-1">74 bpm</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Steady</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  Temperature
                </div>
                <div className="text-lg font-black text-amber-600 mt-1">99.1 °F</div>
                <div className="text-[10px] text-amber-600 font-semibold">Mild Pyrexia</div>
              </div>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-2 text-xs text-sky-900">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                Verified by ASHA Worker Sunita Devi at Rampur Tele-Health Kiosk.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
