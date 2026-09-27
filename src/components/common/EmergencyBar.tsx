import React from 'react';
import { PhoneCall, Wifi, WifiOff, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencyBar: React.FC = () => {
  const { lowBandwidthMode, setLowBandwidthMode, t } = useApp();

  return (
    <div className="bg-slate-900 text-white text-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-red-600/90 text-white font-bold px-2 py-0.5 rounded text-[11px] animate-pulse">
          <ShieldAlert className="w-3 h-3" /> 108 / 104
        </span>
        <span className="hidden sm:inline text-slate-300">
          National Rural Health Tele-Emergency Line (Toll-Free 24x7)
        </span>
        <a
          href="tel:108"
          className="text-red-300 font-semibold hover:underline inline-flex items-center gap-0.5"
        >
          <PhoneCall className="w-3 h-3" /> {t('emergencyHelpline')}
        </a>
      </div>

      <div className="flex items-center gap-3">
        {/* Low bandwidth mode toggle */}
        <button
          onClick={() => setLowBandwidthMode((prev) => !prev)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
            lowBandwidthMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
          title="Optimizes telemedicine video and UI for 2G/3G rural networks"
        >
          {lowBandwidthMode ? (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>Low-Data Mode ON (2G/3G)</span>
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span>Full Bandwidth (4G/WiFi)</span>
            </>
          )}
        </button>

        <span className="text-[10px] text-slate-400 hidden md:inline">
          Ayushman Bharat Digital Mission (ABDM) Compatible
        </span>
      </div>
    </div>
  );
};
