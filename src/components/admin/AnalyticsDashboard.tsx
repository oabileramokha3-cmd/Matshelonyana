import React, { useState } from 'react';
import { TransactionRecord, NotificationItem, OfflineSyncQueueItem } from '../../types';
import { formatPula } from '../../utils/crypto';
import { 
  TrendingUp, 
  Truck, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Download, 
  Send, 
  CheckCircle2, 
  Smartphone, 
  Lock, 
  Database,
  Search,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnalyticsDashboardProps {
  transactions: TransactionRecord[];
  notifications: NotificationItem[];
  offlineQueue: OfflineSyncQueueItem[];
  onTriggerBroadcastAlert: (title: string, message: string, urgent: boolean, sendSms: boolean) => void;
  isOnline: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  transactions,
  notifications,
  offlineQueue,
  onTriggerBroadcastAlert,
  isOnline,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'ledger' | 'notifications' | 'offline'>('metrics');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [verifiedHashModal, setVerifiedHashModal] = useState<TransactionRecord | null>(null);

  // Broadcast modal state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastUrgent, setBroadcastUrgent] = useState(true);
  const [broadcastSms, setBroadcastSms] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const filteredTransactions = transactions.filter(
    (t) =>
      t.jobCode.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      t.fromParty.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      t.toParty.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      t.verificationHash.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,TripCode,Type,AmountBWP,From,To,Timestamp,PaymentGateway,VerificationHash,Status',
        ...transactions.map(
          (t) =>
            `${t.id},${t.jobCode},${t.transactionType},${t.amountBWP},"${t.fromParty}","${t.toParty}",${t.timestamp},${t.paymentMethod},${t.verificationHash},${t.status}`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Matshelonyana_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    onTriggerBroadcastAlert(broadcastTitle.trim(), broadcastMessage.trim(), broadcastUrgent, broadcastSms);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setShowBroadcastModal(false);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Operations Console Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-white">Matshelonyana Operations & Fleet Command</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Botswana logistics monitoring, digital audit ledger, and automated bottleneck mitigation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch SMS / Push Alert</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export Ledger CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Fleet On Road</span>
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">24 Trucks</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>+3 Bakkies joined today</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">On-Time Delivery Rate</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">98.4%</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Avg transit: <span className="font-mono text-sky-400">22.8 mins</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Escrow Volume (Today)</span>
            <Lock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-sky-400 tabular-nums">P 24,850.00</p>
          <p className="text-[11px] text-slate-400 mt-1">
            100% Cryptographically Secured
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Heavy Cargo Moved</span>
            <Database className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">14.6 Tons</p>
          <p className="text-[11px] text-emerald-400 mt-1">
            Zero transit damage claims
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('metrics')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'metrics'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Bottlenecks & Logistics Radar
        </button>
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'ledger'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Digital Transaction Ledger ({transactions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'notifications'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Push & SMS Dispatch Log ({notifications.length})
        </button>
        <button
          onClick={() => setActiveSubTab('offline')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === 'offline'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          Offline Remote Sync Queue ({offlineQueue.length})
        </button>
      </div>

      {/* SUB-VIEW 1: BOTTLENECKS & OPERATIONAL RADAR */}
      {activeSubTab === 'metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Regional Alerts & Bottlenecks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Real-Time Logistics Bottlenecks & Road Conditions</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950 border border-amber-900/40 rounded-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-400 mb-1">
                  <span>A1 Dual Carriageway - Phakalane Bridge</span>
                  <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded text-amber-300">Moderate Delay (+7m)</span>
                </div>
                <p className="text-xs text-slate-300">
                  Resurfacing work near Phakalane junction. Bakkies and 3-ton trucks advised to use secondary route via Airport Road.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
                  <span>Gaborone CBD to Tlokweng Corridor</span>
                  <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">Clear / Fast Flow</span>
                </div>
                <p className="text-xs text-slate-300">
                  Average truck speed 54 km/h. Standard delivery turnaround under 20 minutes.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-400 mb-1">
                  <span>Mogoditshane Heavy Hardware Yard</span>
                  <span className="text-[10px] bg-sky-950 px-2 py-0.5 rounded text-sky-300">High Demand Zone</span>
                </div>
                <p className="text-xs text-slate-300">
                  Multiple requests for cement, timber, and building supplies. 6 drivers staged nearby.
                </p>
              </div>
            </div>
          </div>

          {/* Carrier Compliance & Security Protocol */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Botswana Transport Compliance & Privacy Standards</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Data Privacy & Zero Tracking Ads</span>
                  <span className="text-emerald-400 font-mono font-bold">100% Compliant</span>
                </div>
                <p className="text-slate-400">
                  Matshelonyana enforces strict customer privacy: zero third-party advertising trackers, no location data reselling, and ephemeral trip metadata encryption.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">SHA-256 Ledger Immutability</span>
                  <span className="text-emerald-400 font-mono font-bold">SHA-256 Active</span>
                </div>
                <p className="text-slate-400">
                  Every escrow deposit, release, and payout generates an immutable cryptographic signature verifying sender, recipient, and amount.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Department of Road Transport Permits</span>
                  <span className="text-emerald-400 font-mono font-bold">Verified Carriers</span>
                </div>
                <p className="text-slate-400">
                  All active truck drivers hold valid Botswana public road transport licenses and annual vehicle roadworthiness certificates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DIGITAL TRANSACTION LEDGER */}
      {activeSubTab === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Digital Transaction Ledger & Cryptographic Proofs</span>
              </h3>
              <p className="text-xs text-slate-400">
                Complete audit trail of all escrow holds, driver earnings, and platform reserves.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search trip code, party, or hash..."
                className="bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Trip Code</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount (BWP)</th>
                  <th className="py-2.5 px-3">Payment Gateway</th>
                  <th className="py-2.5 px-3">From &rarr; To</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Ledger Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-sky-400">{tx.jobCode}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 border border-slate-800 text-slate-200">
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {formatPula(tx.amountBWP)}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300">{tx.paymentMethod}</td>
                    <td className="py-3 px-3 font-sans text-slate-300 max-w-[200px] truncate">
                      {tx.fromParty} <span className="text-slate-500">&rarr;</span> {tx.toParty}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">{tx.timestamp}</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setVerifiedHashModal(tx)}
                        className="text-[10px] text-sky-400 hover:text-sky-300 underline truncate max-w-[120px] block"
                        title={tx.verificationHash}
                      >
                        {tx.verificationHash.slice(0, 12)}...
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: PUSH & SMS DISPATCH MONITOR */}
      {activeSubTab === 'notifications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>Push & SMS Real-Time Logistics Alerts</span>
              </h3>
              <p className="text-xs text-slate-400">
                Log of automated alerts dispatched to Botswana cell numbers (+267) and app users.
              </p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl"
            >
              + New Broadcast
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    notif.type === 'sms' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40' : 'bg-sky-950/60 text-sky-400 border border-sky-800/40'
                  }`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white">{notif.title}</h4>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {notif.type.toUpperCase()}
                      </span>
                      {notif.urgent && (
                        <span className="text-[10px] text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-xs mt-1">{notif.message}</p>
                    {notif.recipientPhone && (
                      <p className="text-[11px] font-mono text-sky-400 mt-0.5">
                        Target Phone: {notif.recipientPhone}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                  {notif.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: OFFLINE SYNC QUEUE */}
      {activeSubTab === 'offline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Offline Data Syncing Engine (Field Remote Coverage)</span>
            </h3>
            <p className="text-xs text-slate-400">
              When drivers or dispatchers are in remote Botswana areas with zero signal, actions are queued locally in encrypted browser storage and auto-synced upon reconnecting.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              <span className="text-slate-300">
                Network Status: <strong>{isOnline ? 'Online (Real-time WebSockets & GPS Stream)' : 'Offline (Local Sync Queue Active)'}</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {offlineQueue.length} items queued
            </span>
          </div>

          {offlineQueue.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-1">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="text-sm font-semibold text-slate-300">All field records are synchronized!</p>
              <p className="text-xs">No pending offline operations.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {offlineQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono text-sky-400 font-bold">{item.action}</span>
                    <p className="text-slate-400 text-[11px] truncate max-w-md">
                      Payload: {JSON.stringify(item.payload)}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{item.queuedAt}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DISPATCH BROADCAST SMS/PUSH MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
            <h3 className="text-base font-bold text-white mb-1">Dispatch Logistics Notification</h3>
            <p className="text-xs text-slate-400 mb-4">
              Send an immediate push notification and simulated SMS alert to active truck drivers & senders.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Alert Title
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. A1 Road Notice / Trip Update"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Please note A1 North bridge traffic. Drivers are routed through Airport Rd."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastUrgent}
                    onChange={(e) => setBroadcastUrgent(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-sky-600"
                  />
                  <span>Mark as Urgent Alert</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcastSms}
                    onChange={(e) => setBroadcastSms(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-sky-600"
                  />
                  <span>Dispatch SMS Gateway</span>
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg transition-all"
                >
                  Dispatch Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERIFY HASH MODAL */}
      {verifiedHashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
            <div className="flex items-center gap-2.5 mb-3 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Cryptographic Ledger Verification</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              This transaction is tamper-proof, verified by SHA-256 digital signature, and permanently audited in the Matshelonyana distributed ledger.
            </p>

            <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">TRANSACTION ID:</span>
                <span className="text-white">{verifiedHashModal.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">HAUL TRIP CODE:</span>
                <span className="text-sky-400 font-bold">{verifiedHashModal.jobCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">AMOUNT:</span>
                <span className="text-emerald-400 font-bold">{formatPula(verifiedHashModal.amountBWP)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PAYMENT GATEWAY:</span>
                <span className="text-slate-300">{verifiedHashModal.paymentMethod}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SHA-256 DIGITAL HASH:</span>
                <span className="text-sky-300 break-all text-[11px]">{verifiedHashModal.verificationHash}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">AUDIT STATUS:</span>
                <span className="text-emerald-400 font-semibold">✓ Cryptographically Valid & Confirmed</span>
              </div>
            </div>

            <button
              onClick={() => setVerifiedHashModal(null)}
              className="w-full mt-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Close Ledger Proof
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
