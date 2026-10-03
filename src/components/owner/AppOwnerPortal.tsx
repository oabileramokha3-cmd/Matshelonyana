import React, { useState } from 'react';
import { DriverApplication, TransactionRecord, Job } from '../../types';
import { formatPula } from '../../utils/crypto';
import { 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  FileCheck,
  CreditCard, 
  Truck, 
  UserCheck, 
  AlertTriangle, 
  ExternalLink, 
  ArrowUpRight, 
  Building, 
  Smartphone, 
  Search, 
  Eye, 
  Download,
  Calendar,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppOwnerPortalProps {
  applications: DriverApplication[];
  onApproveApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string, reason: string) => void;
  transactions: TransactionRecord[];
  jobs: Job[];
}

export const AppOwnerPortal: React.FC<AppOwnerPortalProps> = ({
  applications,
  onApproveApplication,
  onRejectApplication,
  transactions,
  jobs,
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'commissions' | 'settings'>('applications');
  const [appFilter, setAppFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<DriverApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Expired Omang ID or invalid driver licence copy. Please re-upload current documents.');
  const [searchQuery, setSearchQuery] = useState('');

  // Owner payout withdrawal modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'FNB Botswana' | 'Absa Bank' | 'Orange Money Merchant'>('FNB Botswana');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // 5% Commission & Revenue Calculations
  const totalVolumeBWP = transactions.reduce((acc, t) => {
    if (t.transactionType === 'Escrow Hold' || t.transactionType === 'Driver Payout (95%)') {
      return acc + t.amountBWP;
    }
    return acc;
  }, 0) / 2 || 24850;

  // 5% Platform commission cut
  const ownerCommissionBWP = totalVolumeBWP * 0.05;
  const driverDisbursementsBWP = totalVolumeBWP * 0.95;

  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  const filteredApps = applications.filter((app) => {
    const matchesFilter = appFilter === 'all' || app.status === appFilter;
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.truckPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.omangNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (app: DriverApplication) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onApproveApplication(app.id);
    setSelectedApp(null);
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRejectModal) return;
    onRejectApplication(showRejectModal.id, rejectionReason);
    setShowRejectModal(null);
    setSelectedApp(null);
  };

  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Executive App Owner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-md">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Matshelonyana App Owner Portal</span>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded-full">
                  Admin & Treasury
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                5% Platform Commission Engine, KYC Driver Verifications & Digital Revenue Ledger
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw 5% Profits</span>
          </button>
        </div>
      </div>

      {/* 5% Commission & Treasury Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border-2 border-sky-500/50 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">App Owner Cut (5%)</span>
            <div className="w-7 h-7 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatPula(ownerCommissionBWP)}
          </p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>Automatic 5% deducted on every completed haul</span>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Gross Platform Volume</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatPula(totalVolumeBWP)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            100% Escrow protected
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Driver Net Earnings (95%)</span>
            <Truck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatPula(driverDisbursementsBWP)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Disbursed to Orange / MyZaka wallets
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Driver Applications</span>
            <UserCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {pendingAppsCount} Driver{pendingAppsCount !== 1 ? 's' : ''}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Omang ID & Licences awaiting review
          </p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Driver Applications & KYC Verification</span>
          {pendingAppsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('commissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'commissions'
              ? 'bg-sky-600 text-white shadow'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>5% Commission Ledger & Payouts</span>
        </button>
      </div>

      {/* TAB 1: DRIVER APPLICATIONS & KYC APPROVALS */}
      {activeTab === 'applications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Botswana Transporter Registration Desk</span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect applicant Omang ID copies, driver licence classes, and carrier permits before granting the Matshelonyana transport badge.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter pills */}
              <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setAppFilter(f)}
                    className={`px-3 py-1 rounded-md capitalize transition-colors ${
                      appFilter === f
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, Omang, plate..."
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none w-44"
                />
              </div>
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="text-sm font-semibold text-slate-300">No applications match your filter</p>
              <p className="text-xs">All pending driver registrations have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 font-bold text-base shrink-0">
                      {app.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{app.fullName}</h4>
                        <span className="text-xs font-mono text-sky-400 bg-sky-950 border border-sky-800/60 px-2 py-0.5 rounded">
                          {app.truckPlate}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          app.status === 'pending'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/60 animate-pulse'
                            : app.status === 'approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-1">
                        {app.truckMakeModel} ({app.truckType}) · {app.city}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1 text-slate-300">
                          <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                          <span>Omang: {app.omangNumber}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>Licence: {app.licenceNumber} ({app.licenceClass})</span>
                        </span>
                        <span>·</span>
                        <span>Phone: {app.phone}</span>
                      </div>

                      {app.rejectionReason && (
                        <p className="text-[11px] text-rose-300/90 mt-2 bg-rose-950/20 border border-rose-900/30 p-2 rounded-lg italic">
                          Rejection Reason: {app.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>Inspect KYC Docs</span>
                    </button>

                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(app)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Driver</span>
                        </button>
                        <button
                          onClick={() => setShowRejectModal(app)}
                          className="px-3 py-2 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-xl text-xs font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 5% COMMISSION REVENUE & DIGITAL LEDGER */}
      {activeTab === 'commissions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-sky-400" />
                <span>5% Platform Commission Accounting Ledger</span>
              </h3>
              <p className="text-xs text-slate-400">
                Itemized log of every 5% platform cut automatically deducted upon escrow release to drivers.
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Commission Earned</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                {formatPula(ownerCommissionBWP)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Trip Code</th>
                  <th className="py-2.5 px-3">Transaction Description</th>
                  <th className="py-2.5 px-3 text-right">Gross Haul (100%)</th>
                  <th className="py-2.5 px-3 text-right">App Owner (5%)</th>
                  <th className="py-2.5 px-3 text-right">Driver (95%)</th>
                  <th className="py-2.5 px-3">Payout Gateway</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                {[
                  { code: 'MT-9024', gross: 480, owner: 24.0, driver: 456.0, gateway: 'Orange Money', date: 'Today' },
                  { code: 'MT-7512', gross: 1100, owner: 55.0, driver: 1045.0, gateway: 'Absa Card', date: 'Today' },
                  { code: 'MT-8810', gross: 620, owner: 31.0, driver: 589.0, gateway: 'Mascom MyZaka', date: 'Yesterday' },
                  { code: 'MT-3109', gross: 750, owner: 37.5, driver: 712.5, gateway: 'FNB Instant EFT', date: 'Yesterday' },
                  { code: 'MT-1044', gross: 350, owner: 17.5, driver: 332.5, gateway: 'Orange Money', date: '2 days ago' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-sky-400">{row.code}</td>
                    <td className="py-3 px-3 font-sans text-slate-300">
                      Standard Goods Haul Escrow Release
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {formatPula(row.gross)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-sky-400 bg-sky-950/30">
                      +{formatPula(row.owner)}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-400">
                      {formatPula(row.driver)}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400">{row.gateway}</td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Credited
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT DRIVER KYC DOCUMENTS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative text-white my-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400 font-bold">
                {selectedApp.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Driver KYC & Identity Review: {selectedApp.fullName}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Plate: {selectedApp.truckPlate} · Phone: {selectedApp.phone} · City: {selectedApp.city}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Omang Verification Section */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <CreditCard className="w-4 h-4 text-sky-400" />
                    <span>Botswana Omang National Identity Document</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Expiry: {selectedApp.omangExpiry}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">OMANG ID NUMBER:</span>
                    <span className="font-bold text-white text-sm">{selectedApp.omangNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ATTACHED FILE:</span>
                    <span className="text-sky-400 underline truncate block">{selectedApp.omangDocName}</span>
                  </div>
                </div>

                {/* Mock preview banner */}
                <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Republic of Botswana National Identity Card (Omang) - Verified Hologram</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Front & Back Scanned</span>
                </div>
              </div>

              {/* Driving Licence & PrDP Section */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>Driver's Licence & PrDP Goods Authorization</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Expiry: {selectedApp.licenceExpiry}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">LICENCE NUMBER:</span>
                    <span className="font-bold text-white text-sm">{selectedApp.licenceNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">AUTHORIZATION CLASS:</span>
                    <span className="text-white">{selectedApp.licenceClass}</span>
                  </div>
                </div>

                <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>PrDP Professional Driving Permit (Goods / Heavy Haulage)</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Valid & Inspected</span>
                </div>
              </div>

              {/* Vehicle Specifications & Roadworthiness */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Truck className="w-4 h-4 text-sky-400" />
                  <span>Truck & Vehicle Roadworthiness</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-slate-300 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">REGISTRATION:</span>
                    <span className="text-sky-400 font-bold">{selectedApp.truckPlate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MAKE & MODEL:</span>
                    <span className="text-white">{selectedApp.truckMakeModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">CAPACITY:</span>
                    <span className="text-white">{selectedApp.truckType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>

              {selectedApp.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(selectedApp);
                      setSelectedApp(null);
                    }}
                    className="px-4 py-2 bg-rose-900/80 hover:bg-rose-800 text-rose-200 rounded-xl text-xs font-semibold"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedApp)}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Driver & Grant Badge</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT DRIVER MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
            <h3 className="text-base font-bold text-white mb-1">
              Reject Application ({showRejectModal.fullName})
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              State the reason why the driver's Omang ID or licence copy was declined. An SMS will be dispatched to +267 {showRejectModal.phone}.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Declining
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(null)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow transition-all"
                >
                  Confirm Rejection & Send SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW OWNER 5% COMMISSIONS MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {withdrawSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400" />
                <h3 className="text-base font-bold text-white">Commission Payout Dispatched!</h3>
                <p className="text-xs text-slate-300">
                  {formatPula(ownerCommissionBWP)} transferred to your {withdrawMethod} treasury account.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  Withdraw 5% Platform Earnings
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Payout the accumulated 5% commission cut directly to your Botswana business account.
                </p>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 mb-4 text-center">
                  <span className="text-xs text-slate-400 block mb-0.5">Available for Payout</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {formatPula(ownerCommissionBWP)}
                  </span>
                </div>

                <form onSubmit={handleConfirmWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Destination Bank / Merchant Wallet
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: 'FNB Botswana', label: 'First National Bank (FNB Botswana)' },
                        { id: 'Absa Bank', label: 'Absa Bank Botswana Commercial' },
                        { id: 'Orange Money Merchant', label: 'Orange Money Merchant Terminal' },
                      ].map((m) => (
                        <button
                          type="button"
                          key={m.id}
                          onClick={() => setWithdrawMethod(m.id as any)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between ${
                            withdrawMethod === m.id
                              ? 'bg-sky-950 border-sky-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{m.label}</span>
                          {withdrawMethod === m.id && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowWithdrawModal(false)}
                      className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all active:scale-95"
                    >
                      Confirm Payout
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
