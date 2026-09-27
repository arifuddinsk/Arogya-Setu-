import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  Volume2,
  Stethoscope,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ChatMessage } from '../types';

export const AIAssistantScreen: React.FC = () => {
  const { currentUser, navigateTo, showToast } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      senderName: 'Aarogya Setu AI',
      text: 'Namaste! I am your Aarogya Setu AI rural healthcare assistant. How can I help you today?',
      timestamp: '12:00 PM',
      quickActions: [
        'How should I take my medicine?',
        'Home remedies for seasonal cough',
        'What to do if fever reaches 102°F?',
        'Is Paracetamol safe on an empty stomach?',
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: currentUser.name || 'You',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const response = await api.ai.chat(query, currentUser.name);
      if (response && response.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            senderName: response.assistantName || 'Aarogya Setu AI',
            text: response.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Backend AI chat request failed, using local offline fallback:', err);
    }

    // Local clinical fallback if backend is momentarily unreachable
    setTimeout(() => {
      let aiText = '';
      const lower = query.toLowerCase();

      if (lower.includes('how should i take my medicine') || lower.includes('take medicine')) {
        aiText = `Namaste ${currentUser.name}! Based on clinical guidance:\n1. **Paracetamol 500mg**: Take 1 tablet twice a day strictly **after meals** with warm water. Do not exceed 4 doses in 24 hours.\n2. **Amoxicillin 500mg**: Take morning and evening after food. Always complete the entire 5-day course.\n3. **Cetirizine 10mg**: Take 1 tablet at bedtime (night only).\n4. Stay well hydrated by drinking boiled warm water and ORS throughout the day.`;
      } else if (lower.includes('cough') || lower.includes('throat')) {
        aiText = `For seasonal cough and throat soreness in rural climates:\n• **Warm Salt Water Gargle**: Dissolve 1/2 tsp salt in warm water, gargle 3 times daily.\n• **Ginger & Honey Decoction (Kadha)**: Fresh crushed ginger with warm water and honey.\n• **Avoid cold drinks**, ice, and early morning agricultural dust.\n• *Note: If coughing produces rusty or green phlegm, consult your doctor right away.*`;
      } else if (lower.includes('fever') || lower.includes('102')) {
        aiText = `Fever management protocol:\n• Take **Paracetamol 500mg** after food.\n• Apply cool tap water compresses (cold sponging) on the forehead and neck.\n• Wear light cotton clothes and drink electrolyte solutions or boiled water.\n• ⚠️ **Red Flag Warning**: If fever crosses 102°F and does not subside in 48 hours, visit your local PHC or dial 108 immediately.`;
      } else if (lower.includes('empty stomach')) {
        aiText = `It is strongly advised **NOT** to take Paracetamol or antibiotics on an empty stomach. Taking them with or after a light meal prevents gastric acidity, nausea, and stomach irritation.`;
      } else {
        aiText = `Namaste ${currentUser.name}. I understand your concern regarding "${query}". In rural healthcare, rest and adequate hydration are vital first steps. Please monitor your body temperature and symptoms closely. Would you like me to connect you directly with a doctor via tele-consultation?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          senderName: 'Aarogya Setu AI',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // clean markdown asterisks for speech
      const clean = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      showToast('Reading Aarogya Setu AI response aloud 🔊', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 pb-20 lg:pb-12">
      <div className="max-w-3xl mx-auto flex flex-col h-[82vh] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header: 🤖 Aarogya Setu AI */}
        <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Bot className="w-6 h-6 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold">🤖 Aarogya Setu AI</h1>
                <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30">
                  Rural Health Triage
                </span>
              </div>
              <p className="text-xs text-purple-100">
                24/7 AI Health Assistance • Regional Language Ready
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('find-doctor')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hidden sm:flex items-center gap-1.5 cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Consult Doctor
          </button>
        </div>

        {/* Mandatory Medical Disclaimer Banner (Exact Copy from User Prompt:
            ⚠️ For informational purposes only. Consult a qualified healthcare professional for medical decisions.) */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="font-semibold leading-tight text-[11px] sm:text-xs">
            ⚠️ For informational purposes only. Consult a qualified healthcare professional for medical decisions.
          </p>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-xs shadow-md shadow-purple-600/20'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span
                    className={`font-bold text-[11px] ${
                      msg.sender === 'user' ? 'text-purple-200' : 'text-purple-700'
                    }`}
                  >
                    {msg.senderName}
                  </span>

                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="text-slate-400 hover:text-purple-700 p-0.5 rounded transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="whitespace-pre-line leading-relaxed font-normal">
                  {msg.text}
                </div>

                {/* Quick prompt chips if available */}
                {msg.quickActions && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                    {msg.quickActions.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 text-[11px] font-semibold transition-all hover:scale-102 cursor-pointer shadow-2xs"
                      >
                        "{chip}"
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-2xl w-24 text-slate-500 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything, e.g. How should I take my medicine?..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />

            <button
              type="submit"
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-md shadow-purple-600/20 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1">
            <span>Trained on Indian Ministry of Health & Family Welfare guidelines</span>
            <button
              onClick={() => handleSend('How should I take my medicine?')}
              className="text-purple-600 hover:underline font-semibold"
            >
              Ask: "How should I take my medicine?"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
