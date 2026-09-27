import React from 'react';
import {
  Home,
  UserCheck,
  FileText,
  Bot,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, currentUser } = useApp();

  if (currentScreen === 'video-consultation' || currentScreen === 'landing') {
    return null; // hide bottom nav during active video call or clean landing page
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {currentUser.role === 'patient' ? (
          <>
            <button
              onClick={() => navigateTo('patient-dashboard')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                currentScreen === 'patient-dashboard'
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className={`w-5 h-5 mb-0.5 ${currentScreen === 'patient-dashboard' ? 'text-teal-600' : ''}`} />
              Home
            </button>
            <button
              onClick={() => navigateTo('find-doctor')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                currentScreen === 'find-doctor'
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck className={`w-5 h-5 mb-0.5 ${currentScreen === 'find-doctor' ? 'text-teal-600' : ''}`} />
              Doctors
            </button>
            <button
              onClick={() => navigateTo('prescription-view')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                currentScreen === 'prescription-view'
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className={`w-5 h-5 mb-0.5 ${currentScreen === 'prescription-view' ? 'text-teal-600' : ''}`} />
              Rx Presc
            </button>
            <button
              onClick={() => navigateTo('ai-assistant')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                currentScreen === 'ai-assistant'
                  ? 'text-purple-700 font-bold'
                  : 'text-slate-500 hover:text-purple-600'
              }`}
            >
              <Bot className={`w-5 h-5 mb-0.5 ${currentScreen === 'ai-assistant' ? 'text-purple-600' : ''}`} />
              AI Care
            </button>
          </>
        ) : currentUser.role === 'doctor' ? (
          <>
            <button
              onClick={() => navigateTo('doctor-dashboard')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                currentScreen === 'doctor-dashboard'
                  ? 'text-blue-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className={`w-5 h-5 mb-0.5 ${currentScreen === 'doctor-dashboard' ? 'text-blue-600' : ''}`} />
              Queue
            </button>
            <button
              onClick={() => navigateTo('patient-details')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                currentScreen === 'patient-details'
                  ? 'text-blue-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardList className={`w-5 h-5 mb-0.5 ${currentScreen === 'patient-details' ? 'text-blue-600' : ''}`} />
              Patient Records
            </button>
            <button
              onClick={() => navigateTo('create-prescription')}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                currentScreen === 'create-prescription'
                  ? 'text-blue-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className={`w-5 h-5 mb-0.5 ${currentScreen === 'create-prescription' ? 'text-blue-600' : ''}`} />
              Create Rx
            </button>
          </>
        ) : (
          <button
            onClick={() => navigateTo('admin-dashboard')}
            className="flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold text-purple-700"
          >
            <Home className="w-5 h-5 mb-0.5 text-purple-600" />
            Kiosk Hub
          </button>
        )}
      </div>
    </div>
  );
};
