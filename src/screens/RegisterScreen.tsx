import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  Phone,
  Mail,
  Lock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RegisterScreen: React.FC = () => {
  const { navigateTo, registerUser, showToast } = useApp();

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    age: '28',
    gender: 'Male',
    village: 'Rampur',
    district: 'Varanasi Rural',
    language: 'Hindi',
    abhaNumber: '',
    // Doctor fields
    regNumber: '',
    specialization: 'General Physician',
    hospital: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }

    const cleanEmail =
      formData.email.trim() ||
      `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@graminhealth.in`;

    registerUser(
      {
        name: formData.fullName.trim(),
        role,
        email: cleanEmail,
        phone: formData.mobile || '+91 98765 43210',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          formData.fullName.trim()
        )}&backgroundColor=0d9488`,
        age: parseInt(formData.age, 10) || 28,
        gender: formData.gender,
        village: formData.village || 'Rampur',
        district: formData.district || 'Varanasi Rural',
        abhaId: formData.abhaNumber,
        specialization: role === 'doctor' ? formData.specialization : undefined,
        hospital: role === 'doctor' ? formData.hospital : undefined,
        regNumber: role === 'doctor' ? formData.regNumber : undefined,
      },
      formData.password || 'password123'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-sky-700 p-6 text-white text-center">
          <h2 className="text-2xl font-bold tracking-tight">Create Healthcare Account</h2>
          <p className="text-xs text-teal-100 mt-1">
            Ayushman Bharat Digital Mission (ABDM) Compatible Registration
          </p>
        </div>

        {/* Role Picker */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setRole('patient')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'patient'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Patient Registration
          </button>
          <button
            type="button"
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'doctor'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Doctor Onboarding
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Real Full Name {role === 'doctor' ? '(with Dr. prefix)' : ''} *
            </label>
            <input
              type="text"
              required
              placeholder={role === 'doctor' ? 'e.g. Dr. Rajesh Verma' : 'e.g. Arif Ullah or Priya Sharma'}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                placeholder="Create password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
              >
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="English">English</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Bhojpuri">भोजपुरी (Bhojpuri)</option>
              </select>
            </div>
          </div>

          {role === 'patient' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village / Town
                  </label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ABHA Health ID (Optional or Auto-Generated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 91-8842-1029-4412"
                  value={formData.abhaNumber}
                  onChange={(e) => setFormData({ ...formData, abhaNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  MCI / State Medical Council Registration No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MCI-UP-48921-2010"
                  value={formData.regNumber}
                  onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Specialization
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                  >
                    <option value="General Physician">General Physician</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital / Tele-Hub
                  </label>
                  <input
                    type="text"
                    placeholder="Civil Hospital Tele-Hub"
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Complete Registration & Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center text-xs text-slate-500">
            Already registered?{' '}
            <button
              type="button"
              onClick={() => navigateTo('login')}
              className="text-teal-700 font-bold hover:underline"
            >
              Login here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
