import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  Send,
  X,
  ShieldCheck,
  Wifi,
  Sparkles,
  Maximize2,
  FileText,
  Volume2,
  Settings,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoConsultationScreen: React.FC = () => {
  const {
    selectedDoctor,
    currentUser,
    activeAppointment,
    navigateTo,
    showToast,
    lowBandwidthMode,
    setLowBandwidthMode,
    t,
  } = useApp();

  const doctorName = activeAppointment?.doctorName || selectedDoctor?.name || 'Dr. Ramesh Sharma';
  const doctorSpecialization =
    activeAppointment?.doctorSpecialization || selectedDoctor?.specialization || 'General Physician';

  // Video and Mic states
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // 2 mins 22 secs

  // Chat messages
  const [messages, setMessages] = useState<
    { sender: 'doctor' | 'patient'; text: string; time: string }[]
  >([
    {
      sender: 'doctor',
      text: 'Namaste Rahul ji. I can see you clearly. How has your fever been since yesterday?',
      time: '04:01 PM',
    },
    {
      sender: 'patient',
      text: 'Namaste Doctor saab. Fever touched 101 F last night, and throat hurts when swallowing.',
      time: '04:02 PM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Self webcam stream ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webcamActive, setWebcamActive] = useState(false);

  useEffect(() => {
    // Timer for consultation
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Attempt to access user webcam for realistic self view if permitted
    let stream: MediaStream | null = null;
    if (cameraEnabled && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setWebcamActive(true);
          }
        })
        .catch(() => {
          // Fallback gracefully to simulated patient stream
          setWebcamActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraEnabled]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: 'patient' as const,
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    const userQuery = inputMessage;
    setInputMessage('');

    // Simulate doctor response after a brief pause
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'doctor',
          text: `Understood. I am adding Paracetamol 500mg and warm salt gargles to your prescription. Let me open your prescription pad.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const handleEndCall = () => {
    showToast('Consultation ended. Dr. Sharma has finalized your digital prescription.', 'info');
    if (currentUser.role === 'doctor') {
      navigateTo('create-prescription');
    } else {
      navigateTo('prescription-view');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Telemedicine Status Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{doctorName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                JITSI TELE-HEALTH
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {doctorSpecialization} • Duration: {formatDuration(callDuration)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Low Bandwidth badge */}
          <button
            onClick={() => setLowBandwidthMode((prev) => !prev)}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 border ${
              lowBandwidthMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <Wifi className="w-3 h-3" />
            <span className="hidden sm:inline">
              {lowBandwidthMode ? '2G/3G Low Data Audio-First' : '4G HD Video'}
            </span>
          </button>

          <span className="text-[11px] text-slate-400 hidden md:flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            End-to-End Encrypted (ABDM)
          </span>
        </div>
      </div>

      {/* Main Video Grid & In-Call Chat */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        {/* Left Column: Doctor Video + Self View (Prompt: Dr. Sharma JITSI VIDEO) */}
        <div
          className={`${
            chatOpen ? 'lg:col-span-8' : 'lg:col-span-12'
          } flex flex-col items-center justify-center p-3 sm:p-6 bg-slate-900 relative overflow-hidden transition-all`}
        >
          {/* Main Feed: Dr. Sharma */}
          <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
            {lowBandwidthMode ? (
              // Low Bandwidth Audio-First View
              <div className="text-center p-6 space-y-4">
                <div className="relative inline-block">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"
                    alt={doctorName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-teal-500 shadow-xl mx-auto"
                  />
                  <div className="absolute -bottom-1 right-2 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                    <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{doctorName}</h3>
                  <p className="text-xs text-teal-300 font-medium mt-1">
                    Audio Call Active (Data Saver Mode - 32 kbps)
                  </p>
                </div>
                <div className="flex justify-center gap-1 items-end h-8">
                  <div className="w-1.5 bg-teal-500 h-4 animate-pulse rounded-full" />
                  <div className="w-1.5 bg-teal-400 h-8 animate-pulse rounded-full delay-75" />
                  <div className="w-1.5 bg-teal-300 h-6 animate-pulse rounded-full delay-150" />
                  <div className="w-1.5 bg-teal-500 h-7 animate-pulse rounded-full delay-100" />
                  <div className="w-1.5 bg-teal-400 h-5 animate-pulse rounded-full" />
                </div>
              </div>
            ) : (
              // HD Video Feed
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&q=80"
                  alt={doctorName}
                  className="w-full h-full object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

                {/* Doctor overlay tag */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">{doctorName}</span>
                  <span className="text-[10px] text-teal-300">Civil Hospital Hub</span>
                </div>

                {/* Simulated speaking audio visualizer */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                  <Volume2 className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span className="text-[11px] text-slate-300">Speaking...</span>
                </div>
              </div>
            )}

            {/* Picture-in-Picture: Patient Self View */}
            <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-44 sm:h-32 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-xl">
              {cameraEnabled ? (
                webcamActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-white">
                      You ({currentUser.name.split(' ')[0]})
                    </div>
                  </div>
                )
              ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-500">
                  <VideoOff className="w-6 h-6 text-slate-600 mb-1" />
                  <span className="text-[10px]">Camera Off</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Consultation Controls (Prompt requested: [Camera] [Mic] [End Call]) */}
          <div className="mt-4 flex items-center gap-3 sm:gap-4 bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800 shadow-xl">
            {/* Camera Toggle */}
            <button
              onClick={() => {
                setCameraEnabled(!cameraEnabled);
                showToast(cameraEnabled ? 'Camera turned off' : 'Camera turned on', 'info');
              }}
              className={`p-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                cameraEnabled
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
              title="Camera toggle"
            >
              {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              <span className="hidden sm:inline">{cameraEnabled ? 'Camera' : 'Cam Off'}</span>
            </button>

            {/* Mic Toggle */}
            <button
              onClick={() => {
                setMicEnabled(!micEnabled);
                showToast(micEnabled ? 'Microphone muted' : 'Microphone unmuted', 'info');
              }}
              className={`p-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                micEnabled
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
              title="Microphone toggle"
            >
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              <span className="hidden sm:inline">{micEnabled ? 'Mic' : 'Muted'}</span>
            </button>

            {/* Toggle In-call Chat */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-3 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                chatOpen
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">{t('chat')}</span>
            </button>

            {/* Exact CTA from Prompt: [End Call] */}
            <button
              onClick={handleEndCall}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <PhoneOff className="w-5 h-5" />
              <span>{t('endCall')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: In-Call Live Chat (Requested: Chat) */}
        {chatOpen && (
          <div className="lg:col-span-4 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-[40vh] lg:h-auto">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white">Consultation Chat</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    m.sender === 'patient' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                      m.sender === 'patient'
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type symptom or question..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
