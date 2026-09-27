import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { navigateTo, loginUser, switchRole, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleTabChange = (role: 'patient' | 'doctor' | 'admin') => {
    setActiveTab(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = emailOrPhone.trim();
    if (!identifier) {
      showToast('Please enter your name, email, or mobile number', 'warning');
      return;
    }
    loginUser(identifier, password, activeTab);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('4829');
    showToast('Demo OTP sent: 4829 (Valid for 10 mins)', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-800 p-6 text-white text-center">
            <h2 className="text-2xl font-bold tracking-tight">Portal Login</h2>
            <p className="text-xs text-teal-100 mt-1">
              Arogya Setu • Rural Healthcare & Telemedicine Platform
            </p>
          </div>

          {/* Role Switcher Tabs (Requested: Patient | Doctor) */}
          <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1">
            <button
              type="button"
              onClick={() => handleTabChange('patient')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'patient'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Patient
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('doctor')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'doctor'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              ASHA Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Login Method:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    loginMethod === 'email'
                      ? 'bg-teal-100 text-teal-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Name / Email / ABHA
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    loginMethod === 'otp'
                      ? 'bg-teal-100 text-teal-800 font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Mobile OTP
                </button>
              </div>
            </div>

            {loginMethod === 'email' ? (
              <>
                {/* Name / Email / ABHA input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Real Name, Email or ABHA ID *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder={
                        activeTab === 'patient'
                          ? 'e.g. Arif or arif@example.com'
                          : activeTab === 'doctor'
                          ? 'e.g. Dr. Rajesh Sharma'
                          : 'e.g. Sunita Devi'
                      }
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <a href="#forgot" className="text-[11px] text-teal-700 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Mobile OTP flow */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your 10-digit Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden focus:bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 shrink-0 cursor-pointer"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 4-Digit OTP (Auto-filled: 4829)
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="4829"
                      maxLength={4}
                      className="w-full text-center tracking-widest font-mono text-lg py-2 bg-teal-50 border border-teal-300 rounded-xl font-bold text-teal-800"
                    />
                  </div>
                )}
              </>
            )}

            {/* Login CTA */}
            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Login as {activeTab === 'patient' ? 'Patient' : activeTab === 'doctor' ? 'Doctor' : 'ASHA Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Registration link */}
            <div className="text-center text-xs text-slate-500 pt-2">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => navigateTo('register')}
                className="text-teal-700 font-bold hover:underline"
              >
                Register with your real name
              </button>
            </div>
          </form>

          {/* Quick 1-Click Demo Profiles for testing */}
          <div className="bg-slate-50 p-4 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-600" />
                Demo Evaluation Profiles
              </span>
              <span className="text-[10px] text-slate-400">Click to preview role</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => switchRole('patient')}
                className="p-2 text-left bg-white border border-slate-200 rounded-lg hover:border-teal-400 text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">Demo Patient</div>
                <div className="text-[10px] text-teal-700 font-medium">Rahul Sharma</div>
              </button>
              <button
                type="button"
                onClick={() => switchRole('doctor')}
                className="p-2 text-left bg-white border border-slate-200 rounded-lg hover:border-blue-400 text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">Demo Doctor</div>
                <div className="text-[10px] text-blue-700 font-medium">Dr. Sharma</div>
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className="p-2 text-left bg-white border border-slate-200 rounded-lg hover:border-purple-400 text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-800">Demo Admin</div>
                <div className="text-[10px] text-purple-700 font-medium">Sunita (ASHA)</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
