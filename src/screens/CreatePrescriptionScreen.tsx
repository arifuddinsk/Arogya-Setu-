import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { MedicineItem } from '../types';

export const CreatePrescriptionScreen: React.FC = () => {
  const {
    currentUser,
    selectedPatient,
    createPrescription,
    navigateTo,
    showToast,
    t,
  } = useApp();

  const patientName = selectedPatient?.name || 'Rahul Sharma';
  const patientAge = 28;

  const [diagnosis, setDiagnosis] = useState('Acute Viral Pharyngitis with Pyrexia');
  const [advice, setAdvice] = useState(
    'Drink plenty of boiled warm water. Avoid cold beverages and excessive dust. Report if fever exceeds 102°F.'
  );
  const [followUpDate, setFollowUpDate] = useState('02 Oct 2026');

  // Exact Fields from Prompt:
  // Medicine, Dosage, Frequency, Duration, Instructions
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: 'med-1',
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: '2 times/day',
      duration: '5 days',
      timing: 'After Food',
      instructions: 'Take 1 tablet after meals with warm water.',
    },
    {
      id: 'med-2',
      name: 'Amoxicillin Trihydrate',
      dosage: '500mg',
      frequency: '2 times/day',
      duration: '5 days',
      timing: 'After Food',
      instructions: 'Complete full 5-day course even if fever abates.',
    },
  ]);

  const handleUpdateMedicine = (
    index: number,
    field: keyof MedicineItem,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: `med-${Date.now()}`,
        name: '',
        dosage: '500mg',
        frequency: '2 times/day',
        duration: '5 days',
        timing: 'After Food',
        instructions: 'Take after meals',
      },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) {
      showToast('Prescription must contain at least one medicine', 'warning');
      return;
    }
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Exact CTA from Prompt: [Generate Prescription]
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (medicines.some((m) => !m.name.trim())) {
      showToast('Please fill in all medicine names', 'warning');
      return;
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    createPrescription({
      patientId: selectedPatient?.id || 'patient-rahul',
      patientName,
      patientAge,
      doctorId: currentUser.id || 'doc-sharma',
      doctorName: currentUser.name || 'Dr. Ramesh Sharma',
      doctorSpecialization: currentUser.specialization || 'General Physician',
      doctorRegNo: 'MCI-UP-48921-2010',
      hospital: 'Civil Hospital Tele-Health Center, Varanasi',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      diagnosis,
      medicines,
      advice,
      followUpDate,
    });

    // Navigate to prescription view to see the generated Rx!
    navigateTo('prescription-view');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => navigateTo('doctor-dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctor Dashboard
        </button>

        {/* Form Container */}
        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight">
                  Create Prescription (Rx Pad)
                </span>
                <span className="bg-blue-400/20 text-blue-200 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Tele-Health Pad
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1">
                Civil Hospital Tele-Hub • Patient: {patientName} (Age: {patientAge} • Male)
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-blue-300 block uppercase font-mono">
                Doctor On Duty:
              </span>
              <span className="text-xs font-bold text-white">Dr. Ramesh Sharma, MD</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Diagnosis Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Viral Pharyngitis with Pyrexia"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden focus:bg-white"
              />
            </div>

            {/* Medicines List Section (Requested: Medicine, Dosage, Frequency, Duration, Instructions) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-600" />
                  Prescribed Medications ({medicines.length})
                </label>

                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medicine
                </button>
              </div>

              <div className="space-y-4">
                {medicines.map((med, index) => (
                  <div
                    key={med.id || index}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-800">
                        Medicine #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Exact fields from prompt */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Medicine */}
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Medicine Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={med.name}
                          onChange={(e) =>
                            handleUpdateMedicine(index, 'name', e.target.value)
                          }
                          placeholder="e.g. Paracetamol"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      {/* Dosage */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Dosage *
                        </label>
                        <input
                          type="text"
                          required
                          value={med.dosage}
                          onChange={(e) =>
                            handleUpdateMedicine(index, 'dosage', e.target.value)
                          }
                          placeholder="e.g. 500mg"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      {/* Frequency */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Frequency *
                        </label>
                        <select
                          value={med.frequency}
                          onChange={(e) =>
                            handleUpdateMedicine(index, 'frequency', e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-blue-500"
                        >
                          <option value="2 times/day">2 times/day (Morning & Night)</option>
                          <option value="3 times/day">3 times/day (TDS)</option>
                          <option value="1 time/day (Morning)">1 time/day (Morning)</option>
                          <option value="1 time/day (Night)">1 time/day (Night Bedtime)</option>
                          <option value="As Needed (SOS)">As Needed (SOS)</option>
                        </select>
                      </div>

                      {/* Duration */}
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Duration *
                        </label>
                        <input
                          type="text"
                          required
                          value={med.duration}
                          onChange={(e) =>
                            handleUpdateMedicine(index, 'duration', e.target.value)
                          }
                          placeholder="e.g. 5 days"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>

                      {/* Instructions */}
                      <div className="sm:col-span-12">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Instructions
                        </label>
                        <input
                          type="text"
                          value={med.instructions || ''}
                          onChange={(e) =>
                            handleUpdateMedicine(index, 'instructions', e.target.value)
                          }
                          placeholder="e.g. Take after food with warm water. Do not take on empty stomach."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-hidden focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice & Follow-Up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Lifestyle / Dietary Advice
                </label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Follow-up Date
                </label>
                <input
                  type="text"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Exact CTA from Prompt: [Generate Prescription] */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('generatePrescription')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
