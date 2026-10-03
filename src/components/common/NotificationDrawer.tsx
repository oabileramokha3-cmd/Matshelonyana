import React from 'react';
import { NotificationItem } from '../../types';
import { Bell, Smartphone, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Logistics Alerts & SMS Center</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Check className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="text-xs font-semibold text-slate-300">No unread notifications</p>
              <p className="text-[11px]">All delivery and GPS status changes are up to date.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${
                  notif.urgent
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-100'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {notif.type === 'sms' ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800/50">
                        <Smartphone className="w-3 h-3" />
                        SMS
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800/50">
                        <Bell className="w-3 h-3" />
                        PUSH
                      </span>
                    )}

                    <h4 className="font-bold text-white text-xs">{notif.title}</h4>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-[11px] leading-relaxed text-slate-300 mb-1">
                  {notif.message}
                </p>

                {notif.jobCode && (
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>Trip: {notif.jobCode}</span>
                    {notif.recipientPhone && <span>To: {notif.recipientPhone}</span>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Automated SMS gateway powered by Botswana Telecommunications & Mobile Networks.
        </div>
      </div>
    </div>
  );
};
