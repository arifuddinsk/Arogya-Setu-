import React from 'react';
import {
  Users,
  Calendar,
  Clock,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  ChevronRight,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment, UserProfile } from '../types';
import { MOCK_PATIENT } from '../data/mockData';

export const DoctorDashboardScreen: React.FC = () => {
  const {
    currentUser,
    appointments,
    navigateTo,
    setSelectedPatient,
    setActiveAppointment,
    showToast,
    t,
  } = useApp();

  // Handle [View Patient] action
  const handleViewPatient = (appointment: Appointment) => {
    setActiveAppointment(appointment);
    // Setup patient record
    const patientProfile: UserProfile = {
      id: appointment.patientId,
      name: appointment.patientName,
      role: 'patient',
      email: `${appointment.patientName.toLowerCase().replace(' ', '.')}@graminhealth.in`,
      phone: '+91 98765 43210',
      avatar:
        appointment.patientName === 'Rahul' || appointment.patientName.includes('Rahul')
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
          : appointment.patientName.includes('Priya')
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      village: 'Rampur Sub-Center',
      district: 'Varanasi Rural',
      abhaId: '91-8842-1029-4412',
    };

    setSelectedPatient(patientProfile);
    navigateTo('patient-details');
  };

  // Handle [Start Consultation] action
  const handleStartConsultation = (appointment: Appointment) => {
    setActiveAppointment(appointment);
    handleViewPatient(appointment);
    navigateTo('video-consultation');
    showToast(`Starting Video Consultation with ${appointment.patientName}`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card (Requested: Welcome Dr. Sharma) */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase tracking-wide">
                  Tele-Duty Active • Civil Hospital Hub
                </span>
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Available for Calls
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('welcomeDoctor')}
              </h1>
              <p className="text-xs sm:text-sm text-blue-200">
                General Physician & Rural Health Specialist • Reg: MCI-UP-48921
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
              <img
                src={currentUser.avatar}
                alt="Dr. Sharma"
                className="w-12 h-12 rounded-2xl object-cover border-2 border-white/40"
              />
              <div className="text-left">
                <div className="text-xs font-bold text-white">Dr. Ramesh Sharma</div>
                <div className="text-[11px] text-blue-200">3 Rural Kiosks Linked</div>
              </div>
            </div>
          </div>

          {/* Quick Doctor Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-blue-700/60">
            <div>
              <div className="text-2xl font-black text-white">8</div>
              <div className="text-xs text-blue-200 font-medium">Today's Queue</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">5</div>
              <div className="text-xs text-blue-200 font-medium">Completed Tele-Calls</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300">3</div>
              <div className="text-xs text-blue-200 font-medium">Pending Prescriptions</div>
            </div>
            <div>
              <div className="text-2xl font-black text-sky-300">100%</div>
              <div className="text-xs text-blue-200 font-medium">Network Uptime</div>
            </div>
          </div>
        </div>

        {/* Today's Appointments Section (Exact Prompt:
            Today's Appointments
            10:00 Rahul
            11:30 Priya
            14:00 Amit
            [View Patient] [Start Consultation]) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {t('todaysAppointments')} (27 September)
              </h2>
              <p className="text-xs text-slate-500">
                Patients lined up at village tele-health kiosks
              </p>
            </div>

            <button
              onClick={() => navigateTo('create-prescription')}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              Write New Prescription
            </button>
          </div>

          <div className="space-y-3.5">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xs"
              >
                {/* Patient Information & Time */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 font-mono font-bold text-sm flex flex-col items-center justify-center border border-blue-200 shrink-0">
                    <Clock className="w-3.5 h-3.5 mb-0.5 text-blue-600" />
                    <span>{apt.time}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {apt.patientName}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        Age: {apt.patientAge} • {apt.patientGender}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-bold border border-teal-200">
                        {apt.phcCenter || 'Rampur Kiosk'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-slate-800">Reported Symptoms:</strong>{' '}
                      {apt.symptoms}
                    </p>
                  </div>
                </div>

                {/* Prompt Requested Action Buttons:
                    [View Patient]
                    [Start Consultation] */}
                <div className="w-full md:w-auto flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <button
                    onClick={() => handleViewPatient(apt)}
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('viewPatient')}</span>
                  </button>

                  <button
                    onClick={() => handleStartConsultation(apt)}
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>{t('startConsultation')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
