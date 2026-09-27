import React, { useState } from 'react';
import {
  Upload,
  ScanLine,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_OCR_PRESCRIPTIONS } from '../data/mockData';
import { OCRScanResult } from '../types';

export const OCRUploadScreen: React.FC = () => {
  const { saveOCRResult, navigateTo, showToast, t } = useApp();

  const [selectedImage, setSelectedImage] = useState<string>(
    SAMPLE_OCR_PRESCRIPTIONS[0].image
  );
  const [isScanning, setIsScanning] = useState(false);
  const [extractedMedicines, setExtractedMedicines] = useState<OCRScanResult[]>(
    SAMPLE_OCR_PRESCRIPTIONS[0].extracted
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          triggerScan();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSample = (index: number) => {
    const sample = SAMPLE_OCR_PRESCRIPTIONS[index];
    setSelectedImage(sample.image);
    triggerScan(sample.extracted);
  };

  const triggerScan = (customResults?: OCRScanResult[]) => {
    setIsScanning(true);
    showToast('AI OCR analyzing handwriting...', 'info');

    setTimeout(() => {
      setIsScanning(false);
      setExtractedMedicines(
        customResults || [
          {
            medicine: 'Paracetamol',
            dosage: '500mg',
            frequency: '2 times/day',
            duration: '5 days',
            confidence: 97,
            notes: 'Take after food',
          },
          {
            medicine: 'Amoxicillin',
            dosage: '500mg',
            frequency: '2 times/day',
            duration: '5 days',
            confidence: 94,
            notes: 'Antibiotic course',
          },
          {
            medicine: 'Cetirizine',
            dosage: '10mg',
            frequency: '1 time/day',
            duration: '3 days',
            confidence: 91,
            notes: 'Bedtime',
          },
        ]
      );
      showToast('Handwritten prescription digitized with 95% confidence! 🚀', 'success');
    }, 1500);
  };

  const handleUpdateMedicine = (
    index: number,
    field: keyof OCRScanResult,
    value: string
  ) => {
    const updated = [...extractedMedicines];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedMedicines(updated);
  };

  const handleAddMedicine = () => {
    setExtractedMedicines([
      ...extractedMedicines,
      {
        medicine: 'New Medicine',
        dosage: '100mg',
        frequency: '1 time/day',
        duration: '3 days',
        confidence: 99,
      },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setExtractedMedicines(extractedMedicines.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    saveOCRResult(extractedMedicines);
    navigateTo('patient-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ScanLine className="w-7 h-7 text-teal-600" />
            {t('uploadPrescription')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Turn doctor's handwritten notes into clear digital schedules with audio reminders.
          </p>
        </div>

        {/* 2-Column Grid: Image Upload & AI Digitization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload / Image preview (Prompt: [Upload Image]) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-800">
                Prescription Photo
              </h2>

              {/* Upload Dropzone */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-teal-300 bg-slate-950 flex flex-col items-center justify-center min-h-[260px] group">
                {selectedImage ? (
                  <div className="relative w-full h-full max-h-[340px]">
                    <img
                      src={selectedImage}
                      alt="Uploaded prescription"
                      className="w-full h-full object-cover"
                    />

                    {/* Laser Scanning Animation */}
                    {isScanning && (
                      <div className="absolute inset-0 bg-teal-500/20">
                        <div className="w-full h-1 bg-teal-400 shadow-[0_0_15px_#2dd4bf] animate-[bounce_2s_infinite]" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                          <div className="bg-slate-900/90 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-teal-500/40">
                            <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
                            AI Neural OCR Scanning...
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Camera className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                    <p className="text-xs font-semibold text-slate-300">
                      Snap or upload photo
                    </p>
                  </div>
                )}

                {/* Upload button overlay (Exact CTA: [Upload Image]) */}
                <label className="absolute bottom-3 left-3 right-3 py-2.5 bg-teal-600/90 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-xs transition-all">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image / Camera</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Rural Rx Shortcuts */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Or Test with Sample Prescriptions:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => loadSample(0)}
                    className="p-2 rounded-xl text-left bg-slate-50 hover:bg-teal-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    📄 Sample 1: Dr. Sharma Viral Fever
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSample(1)}
                    className="p-2 rounded-xl text-left bg-slate-50 hover:bg-teal-50 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    📄 Sample 2: PHC Hypertension Slip
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Prescription Digitization (Exact Requested Table:
              Medicine, Dosage, Frequency, Duration, [Save]) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  {t('aiDigitization')}
                </h3>
                <p className="text-xs text-slate-500">
                  Auto-extracted fields from your paper slip
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddMedicine}
                className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medicine
              </button>
            </div>

            {/* Editable Fields Table */}
            <div className="space-y-3">
              {extractedMedicines.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-teal-300 transition-all space-y-2.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-teal-800">
                      Medicine #{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {item.confidence}% Match
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Medicine */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Medicine
                      </label>
                      <input
                        type="text"
                        value={item.medicine}
                        onChange={(e) =>
                          handleUpdateMedicine(index, 'medicine', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>

                    {/* Dosage */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={item.dosage}
                        onChange={(e) =>
                          handleUpdateMedicine(index, 'dosage', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={item.frequency}
                        onChange={(e) =>
                          handleUpdateMedicine(index, 'frequency', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={item.duration}
                        onChange={(e) =>
                          handleUpdateMedicine(index, 'duration', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Requested CTA: [Save] */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('save')} to My Digital Health Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
