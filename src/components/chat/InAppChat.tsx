import React, { useState } from 'react';
import { ChatMessage, Job } from '../../types';
import { Send, Phone, ShieldCheck, MapPin, X, AlertCircle } from 'lucide-react';

interface InAppChatProps {
  job: Job;
  currentUserRole: 'customer' | 'driver';
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose?: () => void;
}

export const InAppChat: React.FC<InAppChatProps> = ({
  job,
  currentUserRole,
  messages,
  onSendMessage,
  onClose,
}) => {
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  const counterpartyName =
    currentUserRole === 'customer'
      ? job.assignedDriver?.driverName || 'Truck Driver'
      : job.customerName;

  const counterpartyPhone =
    currentUserRole === 'customer'
      ? job.assignedDriver?.driverPhone || '+267 72 000 000'
      : job.customerPhone;

  const quickReplies =
    currentUserRole === 'customer'
      ? [
          'Gate code is #1042',
          'Items are ready on verandah',
          'Please call when 5 mins away',
          'Is the truck covered against rain?',
        ]
      : [
          'Arrived at your gate!',
          'Items are safely strapped and covered',
          'En route now via A1',
          'Need assistance opening the main entrance',
        ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const startSimulatedCall = () => {
    setIsCalling(true);
    setCallTimer(0);
    const interval = window.setInterval(() => {
      setCallTimer((prev) => prev + 1);
    }, 1000);

    setTimeout(() => {
      // Auto end call after 8 seconds simulation
      clearInterval(interval);
      setIsCalling(false);
    }, 8000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sky-900/60 border border-sky-500/40 flex items-center justify-center text-sky-200 font-bold text-sm">
            {counterpartyName.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span>{counterpartyName}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Trip {job.jobCode} · {counterpartyPhone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={startSimulatedCall}
            className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Call counterparty"
          >
            <Phone className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Simulated VoIP Call Modal Overlay */}
      {isCalling && (
        <div className="bg-sky-950 border-b border-sky-800 px-4 py-3 flex items-center justify-between animate-fade-in text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              Connected in-app call with <strong>{counterpartyName}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>00:0{callTimer}</span>
            <button
              onClick={() => setIsCalling(false)}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 rounded text-[11px] font-semibold"
            >
              End
            </button>
          </div>
        </div>
      )}

      {/* Privacy Notice Banner */}
      <div className="px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>End-to-end encrypted dispatch channel. No third-party data tracking.</span>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <p className="text-xs">No messages yet. Send a quick update to coordinate pickup or delivery.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-500">
                  <span>{msg.senderName}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Reply Pills */}
      <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {quickReplies.map((reply, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(reply)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap border border-slate-700/60 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${counterpartyName}...`}
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl shadow transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
