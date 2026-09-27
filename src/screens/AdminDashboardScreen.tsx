import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  BatteryCharging,
  Wifi,
  Users,
  Pill,
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_KIOSKS } from '../data/mockData';

export const AdminDashboardScreen: React.FC = () => {
  const { currentUser, navigateTo, showToast } = useApp();
  const [kiosks, setKiosks] = useState(MOCK_KIOSKS);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    showToast('Syncing village tele-kiosks with state health repository...', 'info');

    setTimeout(() => {
      setIsSyncing(false);
      showToast('All 3 village kiosks successfully synchronized! ✅', 'success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Admin Hub Header */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Rural Health Mission • Block Tele-Hub
                </span>
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Kiosks Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                ASHA & Village Kiosk Administration
              </h1>
              <p className="text-xs sm:text-sm text-purple-200 mt-1">
                Coordinator: {currentUser.name} • Cholapur Block Primary Health Center
              </p>
            </div>

            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Offline Records'}</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-purple-700/60 text-xs">
            <div>
              <div className="text-2xl font-black text-white">61</div>
              <div className="text-purple-200 font-medium">Patients Seen Today</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">10</div>
              <div className="text-purple-200 font-medium">Pending Tele-Consults</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-300">92%</div>
              <div className="text-purple-200 font-medium">Avg Solar Battery</div>
            </div>
            <div>
              <div className="text-2xl font-black text-sky-300">3/3</div>
              <div className="text-purple-200 font-medium">Kiosks Online</div>
            </div>
          </div>
        </div>

        {/* Telemedicine Kiosks Monitor */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                Village Tele-Kiosks Live Status
              </h2>
              <p className="text-xs text-slate-500">
                Solar batteries, network resilience & medicine stocks
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {kiosks.map((kiosk) => (
              <div
                key={kiosk.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-purple-300 bg-white transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {kiosk.village}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ASHA In-Charge: <strong>{kiosk.ashaWorker}</strong> • {kiosk.district}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5" />
                      {kiosk.connectivityStatus}
                    </span>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                      <BatteryCharging className="w-3.5 h-3.5" />
                      Solar {kiosk.solarBatteryStatus}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Consultations
                    </span>
                    <span className="font-bold text-slate-800">
                      {kiosk.patientsSeenToday} Completed • {kiosk.pendingTeleConsults} Waiting
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Dispensary Stock
                    </span>
                    <span
                      className={`font-bold ${
                        kiosk.medicinesStockLevel === 'Optimal'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {kiosk.medicinesStockLevel} Medicine Reserve
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between col-span-2 sm:col-span-1">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Quick Action
                      </span>
                      <button
                        onClick={() => {
                          showToast(`Connecting to ${kiosk.village} audio relay...`, 'info');
                          navigateTo('video-consultation');
                        }}
                        className="text-purple-700 font-bold hover:underline flex items-center gap-1 mt-0.5"
                      >
                        Join Kiosk Room <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Dispatch & Health Alert Center */}
        <div className="bg-amber-50/80 rounded-3xl border border-amber-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                108 Emergency Ambulance & Blood Dispatch
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Instant priority dispatch for obstetric complications or acute cardiac cases in Cholapur Block.
            </p>
          </div>

          <a
            href="tel:108"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-red-600/30 shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108 Emergency</span>
          </a>
        </div>
      </div>
    </div>
  );
};
