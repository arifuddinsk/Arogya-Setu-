import React from 'react';
import {
  Stethoscope,
  ShieldCheck,
  Video,
  FileCheck2,
  Bot,
  ArrowRight,
  HeartPulse,
  Users,
  Wifi,
  PhoneCall,
  Sparkles,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingScreen: React.FC = () => {
  const { navigateTo, switchRole, t } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
      {/* Top Banner for Rural Telemedicine Mission */}
      <div className="bg-teal-700 text-white text-xs py-2 px-4 text-center font-medium">
        <span className="inline-block bg-teal-800/80 px-2 py-0.5 rounded text-[11px] font-bold mr-2 uppercase tracking-wide">
          Gramin Tele-Health Mission
        </span>
        Connecting 600,000+ villages to qualified MD doctors across India.
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Rural Tele-Care • Digital Arogya Setu
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Healthcare shouldn't depend on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600 underline decoration-teal-400 decoration-wavy decoration-2">
                where you live.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
              Consult doctors remotely. Manage prescriptions. Get AI-powered
              health assistance. Optimized for low-bandwidth rural connections
              and regional languages.
            </p>

            {/* CTAs Requested in Prompt: [Find a Doctor] [Login] */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('find-doctor')}
                className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-5 h-5" />
                Find a Doctor
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => navigateTo('login')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border-2 border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                Login to Portal
              </button>

              <button
                onClick={() => navigateTo('register')}
                className="text-xs font-semibold text-teal-700 hover:underline px-2 py-1"
              >
                New patient? Register here
              </button>
            </div>

            {/* Quick trust badges */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-200 max-w-lg">
              <div>
                <div className="text-2xl font-black text-slate-900">50,000+</div>
                <div className="text-xs text-slate-500 font-medium">Villages Covered</div>
              </div>
              <div>
                <div className="text-2xl font-black text-teal-600">2,400+</div>
                <div className="text-xs text-slate-500 font-medium">Certified MDs</div>
              </div>
              <div>
                <div className="text-2xl font-black text-sky-600">100% Free</div>
                <div className="text-xs text-slate-500 font-medium">For BPL / ABHA</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive App Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-sky-400 rounded-3xl opacity-20 blur-xl"></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Tele-Kiosk Header Mockup */}
              <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5 text-teal-200" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-200">
                      Live Telemedicine Kiosk
                    </div>
                    <div className="font-bold text-sm">Rampur Sub-Center • UP</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>

              {/* Sample Doctor & Patient Consultation Preview */}
              <div className="p-5 space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"
                    alt="Dr. Ramesh Sharma"
                    className="w-12 h-12 rounded-xl object-cover border border-teal-200"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-900">Dr. Ramesh Sharma</div>
                    <div className="text-xs text-teal-700 font-medium">General Physician • AIIMS</div>
                    <div className="text-[11px] text-slate-500">Speaking: Hindi, Bhojpuri, English</div>
                  </div>
                  <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">
                    ★★★★★
                  </span>
                </div>

                {/* Simulated upcoming appointment card */}
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-sky-900">Today's Appointment</span>
                    <span className="font-semibold text-sky-700">4:00 PM</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Patient: <strong>Rahul Sharma</strong> (Fever & Cough follow-up)
                  </p>
                  <button
                    onClick={() => {
                      switchRole('patient');
                      navigateTo('video-consultation');
                    }}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Video className="w-3.5 h-3.5" /> Join Consultation (JITSI Video)
                  </button>
                </div>

                {/* Quick actions row */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      switchRole('patient');
                      navigateTo('ocr-upload');
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-teal-500 bg-white text-slate-700 hover:text-teal-700 font-medium flex items-center gap-2 transition-all"
                  >
                    <FileCheck2 className="w-4 h-4 text-teal-600" />
                    OCR Prescription
                  </button>

                  <button
                    onClick={() => {
                      switchRole('patient');
                      navigateTo('ai-assistant');
                    }}
                    className="p-2.5 rounded-lg border border-purple-200 hover:border-purple-500 bg-purple-50/50 text-purple-900 font-medium flex items-center gap-2 transition-all"
                  >
                    <Bot className="w-4 h-4 text-purple-600" />
                    Aarogya Setu AI
                  </button>
                </div>
              </div>

              {/* Bottom Quick Switch Bar */}
              <div className="bg-slate-100 p-3 border-t border-slate-200 text-center text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Explore interfaces:</span>{' '}
                <button
                  onClick={() => switchRole('patient')}
                  className="text-teal-700 font-bold hover:underline ml-1"
                >
                  Patient
                </button>{' '}
                •{' '}
                <button
                  onClick={() => switchRole('doctor')}
                  className="text-blue-700 font-bold hover:underline"
                >
                  Doctor
                </button>{' '}
                •{' '}
                <button
                  onClick={() => switchRole('admin')}
                  className="text-purple-700 font-bold hover:underline"
                >
                  ASHA Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars of Arogya Setu Rural Care */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Engineered for the Realities of Rural India
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Reliable tele-consultations even on unstable 2G/3G mobile data and solar-powered village kiosks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-teal-50/40 border border-teal-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Low-Bandwidth Video & Audio
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Adaptive Jitsi/WebRTC engine that automatically switches from HD video to ultra-low bitrate audio and syncs when connection restores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-sky-50/40 border border-sky-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Handwritten Rx OCR & Audio Reminders
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Photograph paper prescriptions to auto-extract dosage and listen to instructions aloud in regional languages like Hindi, Bengali, or Telugu.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/40 border border-purple-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Aarogya Setu 24/7 AI Health Assistant
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instant preliminary guidance on common rural ailments, fever management, medicine intake directions, and direct PHC triage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
