import React, { useState } from 'react';
import {
  Pill,
  BellRing,
  Volume2,
  Printer,
  CheckCircle2,
  QrCode,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrescriptionScreen: React.FC = () => {
  const {
    prescriptions,
    selectedPrescription,
    togglePrescriptionReminder,
    navigateTo,
    showToast,
    t,
  } = useApp();

  const rx = selectedPrescription || prescriptions[0];
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const reminderTimes = {
    morning: '08:00 AM',
    afternoon: '01:30 PM',
    night: '08:30 PM',
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      showToast('Reading medicine instructions aloud 🔊', 'info');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigateTo('patient-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 text-xs font-semibold flex items-center gap-1 shadow-xs"
              title="Print Prescription"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Digital Prescription Paper Document */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-800 to-sky-900 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-700/60 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight">
                    {t('prescriptions')} (Rx)
                  </span>
                  <span className="bg-teal-500/20 text-teal-300 border border-teal-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Digital Certified
                  </span>
                </div>
                <p className="text-xs text-teal-100 mt-1">
                  Civil Hospital Tele-Health Center • District Tele-Hub
                </p>
              </div>

              {/* QR Code Verification for Pharmacy */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900">
                  <QrCode className="w-9 h-9" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-teal-200 uppercase font-mono">
                    Rx ID: {rx.id}
                  </div>
                  <div className="text-xs font-bold text-white">ABDM Validated</div>
                </div>
              </div>
            </div>

            {/* Doctor & Patient Metadata Row (Exact fields requested: Dr. Sharma, 27 Sep 2026) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div>
                <span className="text-teal-200 text-[11px] font-semibold block">
                  Attending Tele-Doctor:
                </span>
                <span className="font-extrabold text-white text-base">
                  {rx.doctorName}
                </span>
                <span className="text-teal-100 block text-[11px]">
                  {rx.doctorSpecialization} • Reg: {rx.doctorRegNo}
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-teal-200 text-[11px] font-semibold block">
                  Date of Consultation:
                </span>
                <span className="font-bold text-white text-sm">
                  {rx.date}
                </span>
                <span className="text-teal-100 block text-[11px]">
                  Patient: {rx.patientName} (Age: {rx.patientAge} • Male)
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Clinical Diagnosis */}
            <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-200 flex items-start gap-3">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider block">
                  Clinical Diagnosis
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {rx.diagnosis}
                </span>
              </div>
            </div>

            {/* Exact Medicine Table / Cards Requested in Prompt:
                Medicine: 500mg, 2 times/day, 5 days
                [Set Reminder] */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  Prescribed Medicines & Dosages
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {rx.medicines.length} Medicines Prescribed
                </span>
              </div>

              <div className="space-y-3">
                {rx.medicines.map((med, index) => (
                  <div
                    key={med.id || index}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            {med.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                            {med.dosage}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                          <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                            Frequency: {med.frequency}
                          </span>
                          <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                            Duration: {med.duration}
                          </span>
                          <span className="text-slate-500 font-medium">
                            Timing: {med.timing}
                          </span>
                        </div>

                        {med.instructions && (
                          <p className="text-xs text-slate-500 mt-1.5 pl-8 italic">
                            "{med.instructions}"
                          </p>
                        )}
                      </div>

                      {/* Read Aloud button for elderly/rural patients */}
                      <button
                        onClick={() =>
                          handleSpeak(
                            `Take ${med.name} ${med.dosage}. Frequency is ${med.frequency} for ${med.duration}. ${med.instructions || ''}`
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                        title="Read out medicine dosage in audio"
                      >
                        <Volume2 className="w-4 h-4 text-teal-600" />
                        <span>Listen Audio</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice & Warning */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Doctor's Dietary & Lifestyle Advice:</span>
              <p className="leading-relaxed text-slate-700">{rx.advice}</p>
              <div className="pt-1 text-[11px] text-amber-800 font-medium">
                Follow-up Date: {rx.followUpDate || 'In 5 days at local tele-kiosk'}
              </div>
            </div>

            {/* Doctor Digital Signature */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-200">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900">Dr. Ramesh Sharma, MD</div>
                <div className="text-[11px] text-slate-500">
                  Digitally Signed via National e-Sign Portal (DSC-UP-9941)
                </div>
              </div>

              {/* Exact CTA from Prompt: [Set Reminder] */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <button
                  onClick={() => setReminderModalOpen(true)}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    rx.remindersActive
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                      : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30'
                  }`}
                >
                  <BellRing className="w-4 h-4" />
                  <span>
                    {rx.remindersActive ? 'Reminders Active (Manage)' : t('setReminder')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Set Reminder Modal */}
        {reminderModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      Medicine Reminders
                    </h3>
                    <p className="text-xs text-slate-500">Automated SMS & Voice Call Reminders</p>
                  </div>
                </div>
                <button
                  onClick={() => setReminderModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Morning Dose (After breakfast)</span>
                    <span className="font-mono font-semibold text-teal-700">{reminderTimes.morning}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Paracetamol 500mg, Amoxicillin 500mg
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Night Dose (Bedtime)</span>
                    <span className="font-mono font-semibold text-teal-700">{reminderTimes.night}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cetirizine 10mg, Paracetamol 500mg
                  </div>
                </div>

                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    Reminders will ring via local automated phone call and SMS in Hindi so no dose is missed!
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    togglePrescriptionReminder(rx.id);
                    setReminderModalOpen(false);
                  }}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  Save & Enable Reminder Alerts
                </button>
                <button
                  onClick={() => setReminderModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
