import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  Building,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { MOCK_DOCTORS } from '../data/mockData';

export const AppointmentBookingScreen: React.FC = () => {
  const {
    selectedDoctor,
    bookAppointment,
    navigateTo,
    t,
  } = useApp();

  const doctor = selectedDoctor || MOCK_DOCTORS[0];

  // Requested in prompt: Select Date -> 27 September
  const dates = ['27 September', '28 September', '29 September', '30 September'];
  const [selectedDate, setSelectedDate] = useState('27 September');

  // Requested in prompt: Available -> 10:00, 11:30, 14:00, 16:00
  const slots = ['10:00', '11:30', '14:00', '16:00'];
  const [selectedSlot, setSelectedSlot] = useState('16:00');

  const [consultType, setConsultType] = useState<'video' | 'audio' | 'phc-kiosk'>('video');
  const [symptoms, setSymptoms] = useState('Recurring fever, throat soreness and body ache for 3 days');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);

    // Fire celebratory confetti for rural health appointment booking confirmation!
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback if canvas blocked
    }

    setTimeout(() => {
      bookAppointment(doctor, selectedDate, selectedSlot, symptoms);
      setIsSubmitting(false);
      navigateTo('patient-dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigateTo('find-doctor')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctors List
        </button>

        {/* Doctor Summary Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center gap-4">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{doctor.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                ★★★★★ {doctor.rating}
              </span>
            </div>
            <p className="text-xs font-semibold text-teal-700">
              {doctor.specialization} • {doctor.hospital}
            </p>
            <p className="text-xs text-slate-500">
              Fee: ₹{doctor.consultationFee} • Free for BPL/Ayushman Cardholders
            </p>
          </div>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
          {/* 1. Select Date (Requested: Select Date e.g. 27 September) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-600" />
              {t('selectDate')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    selectedDate === date
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  <div>{date}</div>
                  <div
                    className={`text-[10px] font-normal ${
                      selectedDate === date ? 'text-teal-100' : 'text-slate-400'
                    }`}
                  >
                    {date === '27 September' ? 'Today' : 'Upcoming'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Available Slots (Requested: Available -> 10:00, 11:30, 14:00, 16:00) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              Available Time Slots
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                    selectedSlot === slot
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-400'
                  }`}
                >
                  <span className="font-mono text-sm">{slot}</span>
                  <span
                    className={`text-[10px] ${
                      selectedSlot === slot ? 'text-sky-100' : 'text-emerald-600 font-medium'
                    }`}
                  >
                    Open Slot
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Consultation Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Consultation Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setConsultType('video')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  consultType === 'video'
                    ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Video className="w-4 h-4 text-teal-600 mb-1" />
                <div>Jitsi Video Call</div>
                <div className="text-[10px] text-slate-400 font-normal">HD / 2G Adapt</div>
              </button>

              <button
                type="button"
                onClick={() => setConsultType('audio')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  consultType === 'audio'
                    ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Phone className="w-4 h-4 text-teal-600 mb-1" />
                <div>Audio Call Only</div>
                <div className="text-[10px] text-slate-400 font-normal">Ultra low data</div>
              </button>

              <button
                type="button"
                onClick={() => setConsultType('phc-kiosk')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  consultType === 'phc-kiosk'
                    ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <Building className="w-4 h-4 text-teal-600 mb-1" />
                <div>Village Kiosk</div>
                <div className="text-[10px] text-slate-400 font-normal">ASHA Assisted</div>
              </button>
            </div>
          </div>

          {/* 4. Symptoms / Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Health Issue / Symptoms
            </label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe what you are feeling (e.g. fever, headache, body pain)..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
            />
          </div>

          {/* Prompt requested CTA: [Confirm Appointment] */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirm}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {isSubmitting ? 'Confirming...' : `${t('confirmAppointment')} (${selectedDate} • ${selectedSlot})`}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Instant SMS confirmation sent to your registered mobile number.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
