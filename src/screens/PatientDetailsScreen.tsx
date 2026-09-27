import React from 'react';
import {
  User,
  Calendar,
  FileText,
  Pill,
  FileCheck2,
  Video,
  ArrowLeft,
  Activity,
  Heart,
  ShieldCheck,
  Download,
  Eye,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_PATIENT } from '../data/mockData';

export const PatientDetailsScreen: React.FC = () => {
  const {
    selectedPatient,
    prescriptions,
    navigateTo,
    showToast,
    t,
  } = useApp();

  const patient = selectedPatient || MOCK_PATIENT;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigateTo('doctor-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctor Dashboard
        </button>

        {/* Patient Profile Card (Requested: Patient, Age) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {patient.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                    Age: 28 Years • Male
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ABHA ID: <span className="font-mono text-slate-700 font-bold">{patient.abhaId || '91-8842-1029-4412'}</span> • Village: Rampur, Varanasi Rural
                </p>
                <p className="text-xs text-slate-500">
                  Phone: {patient.phone} • Blood Group: O+ Positive
                </p>
              </div>
            </div>

            {/* Prompt Requested Action Buttons:
                [Start Consultation]
                [Create prescription] */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('video-consultation')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>{t('startConsultation')}</span>
              </button>

              <button
                onClick={() => navigateTo('create-prescription')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Create Prescription</span>
              </button>
            </div>
          </div>

          {/* Patient Quick Vitals Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">BP (Last Tested)</div>
              <div className="text-base font-black text-slate-800 mt-0.5">118 / 78 mmHg</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Pulse Rate</div>
              <div className="text-base font-black text-slate-800 mt-0.5">74 bpm</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Blood Sugar (Fasting)</div>
              <div className="text-base font-black text-slate-800 mt-0.5">96 mg/dL</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Allergies</div>
              <div className="text-base font-bold text-emerald-700 mt-0.5">None Known (NKDA)</div>
            </div>
          </div>
        </div>

        {/* 2. Current Medications (Requested: Current medications) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              Current Medications
            </h3>
            <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
              Active Regimen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="font-bold text-xs text-slate-900">Paracetamol 500mg</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Dosage: 500mg • 2 times/day • 5 days
              </div>
              <div className="text-[11px] text-teal-700 mt-1 font-medium">
                Started: 27 Sep 2026 • Reason: Pyrexia
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="font-bold text-xs text-slate-900">Amoxicillin Trihydrate 500mg</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Dosage: 500mg • 2 times/day • 5 days
              </div>
              <div className="text-[11px] text-teal-700 mt-1 font-medium">
                Started: 27 Sep 2026 • Antibiotic
              </div>
            </div>
          </div>
        </div>

        {/* 3. Previous Prescriptions (Requested: Previous prescriptions) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Previous Prescriptions
            </h3>
            <span className="text-xs text-slate-500">
              {prescriptions.length} Records on ABDM
            </span>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {rx.diagnosis}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">
                      {rx.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    By {rx.doctorName} ({rx.doctorSpecialization})
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Medicines:{' '}
                    {rx.medicines.map((m) => `${m.name} (${m.dosage})`).join(', ')}
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('prescription-view')}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Rx
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Medical Documents (Requested: Medical documents) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              Medical Documents & Lab Reports
            </h3>
            <span className="text-xs text-slate-500">Verified Files</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50/40 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Complete Blood Count (CBC)</div>
                <div className="text-[10px] text-slate-500">Report: Normal • 25 Sep 2026</div>
              </div>
              <button
                onClick={() => showToast('Opening CBC Lab Report PDF...', 'info')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50/40 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Malaria & Dengue Card Test</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Negative (Non-Reactive)</div>
              </div>
              <button
                onClick={() => showToast('Opening Dengue test result...', 'info')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 bg-slate-50/40 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">ASHA Kiosk Vitals Log</div>
                <div className="text-[10px] text-slate-500">BP & Temp Log Sheet</div>
              </div>
              <button
                onClick={() => showToast('Opening Vitals Log...', 'info')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
