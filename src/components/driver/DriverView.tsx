import React, { useState } from 'react';
import { Job, DriverBid, ChatMessage, JobStatus } from '../../types';
import { MapView } from '../MapView';
import { InAppChat } from '../chat/InAppChat';
import { formatPula, generateSHA256Hash } from '../../utils/crypto';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  DollarSign, 
  CheckCircle, 
  CheckCircle2, 
  MessageSquare, 
  Navigation, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  Camera, 
  PenTool, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DriverViewProps {
  jobs: Job[];
  onAcceptJobDirect: (jobId: string, driverBid: DriverBid) => void;
  onSubmitCounterBid: (jobId: string, counterBid: DriverBid) => void;
  onUpdateJobStatus: (jobId: string, status: JobStatus, milestoneLabel: string) => void;
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (jobId: string, text: string) => void;
  isOnline: boolean;
}

export const DriverView: React.FC<DriverViewProps> = ({
  jobs,
  onAcceptJobDirect,
  onSubmitCounterBid,
  onUpdateJobStatus,
  messages,
  onSendMessage,
  isOnline,
}) => {
  const [selectedTruckFilter, setSelectedTruckFilter] = useState<string>('all');
  const [activeJobId, setActiveJobId] = useState<string>(
    jobs.find((j) => j.assignedDriverId === 'drv-kgosi-01' || j.currentStatus === 'in_transit')?.id || jobs[0]?.id
  );
  const [showCounterModalForJob, setShowCounterModalForJob] = useState<Job | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(450);
  const [counterHelpers, setCounterHelpers] = useState<number>(2);
  const [counterNote, setCounterNote] = useState<string>('I have heavy-duty moving blankets and ratcheting straps.');
  const [showChat, setShowChat] = useState<boolean>(false);

  // Delivery confirmation states
  const [showProofModal, setShowProofModal] = useState<boolean>(false);
  const [recipientName, setRecipientName] = useState('Amantle Kgari');
  const [isSigned, setIsSigned] = useState(false);

  const activeJob = jobs.find((j) => j.id === activeJobId);

  // Open jobs open for bidding or accepting
  const availableBiddingJobs = jobs.filter((j) => j.currentStatus === 'bidding');

  // Active hauls assigned to the driver
  const myActiveHaul = jobs.find(
    (j) => j.currentStatus !== 'bidding' && j.currentStatus !== 'completed'
  );

  const handleQuickAccept = (job: Job) => {
    const defaultBid: DriverBid = {
      id: `bid-${Date.now()}`,
      driverId: 'drv-kgosi-01',
      driverName: 'Kgosi Mogorosi',
      driverPhone: '+267 72 419 802',
      driverAvatar: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
      truckType: '1-Ton Bakkie (Hilux/D-Max)',
      truckPlate: 'B 492 BAZ',
      rating: 4.95,
      completedHauls: 285,
      proposedFareBWP: job.customerProposedFareBWP,
      helpersOffered: 2,
      counterOfferNote: 'Quick accepted your proposed fare. On the way with blankets.',
      etaMinutes: 10,
      submittedAt: 'Just now',
      status: 'accepted',
    };

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    onAcceptJobDirect(job.id, defaultBid);
    setActiveJobId(job.id);
  };

  const handleSendCounterBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCounterModalForJob) return;

    const counterBid: DriverBid = {
      id: `bid-${Date.now()}`,
      driverId: 'drv-kgosi-01',
      driverName: 'Kgosi Mogorosi',
      driverPhone: '+267 72 419 802',
      driverAvatar: '/src/assets/images/avatar_driver_kgosi_1790988349051.jpg',
      truckType: '1-Ton Bakkie (Hilux/D-Max)',
      truckPlate: 'B 492 BAZ',
      rating: 4.95,
      completedHauls: 285,
      proposedFareBWP: counterPrice,
      helpersOffered: counterHelpers,
      counterOfferNote: counterNote,
      etaMinutes: 12,
      submittedAt: 'Just now',
      status: 'pending',
    };

    onSubmitCounterBid(showCounterModalForJob.id, counterBid);
    setShowCounterModalForJob(null);
  };

  const advanceMilestone = (status: JobStatus, label: string) => {
    if (!myActiveHaul) return;
    onUpdateJobStatus(myActiveHaul.id, status, label);
  };

  const handleCompleteDelivery = () => {
    if (!myActiveHaul) return;
    onUpdateJobStatus(myActiveHaul.id, 'delivered', 'Delivered & Customer Verified');
    setShowProofModal(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Driver Status Banner & Daily Earnings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src="/src/assets/images/avatar_driver_kgosi_1790988349051.jpg"
                alt="Kgosi Mogorosi"
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Kgosi Mogorosi</h2>
                <span className="text-[11px] font-mono text-sky-400 bg-sky-950 border border-sky-800/60 px-2 py-0.5 rounded-full">
                  B 492 BAZ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1-Ton Bakkie (Toyota Hilux) · Commercial Transport Permit Certified
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Today's Earnings</span>
              <span className="text-sm font-mono font-bold text-emerald-400">P 1,420.00</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Hauls Today</span>
              <span className="text-sm font-mono font-bold text-white">3 Trips</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Driver Rating</span>
              <span className="text-sm font-mono font-bold text-amber-400">4.95 ★</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE HAUL NAVIGATION WORKFLOW (If currently on an assigned trip) */}
      {myActiveHaul && (
        <div className="bg-slate-900 border-2 border-sky-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-base font-bold text-white">Current Active Trip Navigation</h3>
                <span className="text-xs font-mono text-sky-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {myActiveHaul.jobCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{myActiveHaul.title}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Chat Sender</span>
              </button>

              <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
                {formatPula(myActiveHaul.agreedFareBWP || myActiveHaul.customerProposedFareBWP)}
              </span>
            </div>
          </div>

          {/* Interactive Navigation Map */}
          <MapView job={myActiveHaul} isDriverView={true} />

          {/* Large Quick-Tap Milestone Trigger Buttons for Driver */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Field Action Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {myActiveHaul.currentStatus === 'accepted' && (
                <button
                  onClick={() => advanceMilestone('en_route_pickup', 'Arrived at Pickup')}
                  className="py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>1. Mark "Arrived at Pickup"</span>
                </button>
              )}

              {myActiveHaul.currentStatus === 'en_route_pickup' && (
                <button
                  onClick={() => advanceMilestone('cargo_loaded', 'Cargo Strapped & Inspected')}
                  className="py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Package className="w-4 h-4" />
                  <span>2. Confirm "Cargo Loaded & Strapped"</span>
                </button>
              )}

              {(myActiveHaul.currentStatus === 'cargo_loaded' || myActiveHaul.currentStatus === 'in_transit') && (
                <button
                  onClick={() => setShowProofModal(true)}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>3. Complete Delivery with E-Signature</span>
                </button>
              )}

              {myActiveHaul.currentStatus === 'delivered' && (
                <div className="sm:col-span-3 p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center text-xs text-emerald-300 font-semibold">
                  ✓ Delivery Complete! Escrow release pending customer verification code ({myActiveHaul.escrowReleaseCode || '6824'}).
                </div>
              )}
            </div>
          </div>

          {/* In-App Chat Modal for Driver */}
          {showChat && (
            <div className="h-[350px]">
              <InAppChat
                job={myActiveHaul}
                currentUserRole="driver"
                messages={messages[myActiveHaul.id] || []}
                onSendMessage={(txt) => onSendMessage(myActiveHaul.id, txt)}
                onClose={() => setShowChat(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* AVAILABLE HAULS RADAR (inDrive style job board) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-400" />
              <span>Gaborone Haulage Radar ({availableBiddingJobs.length} Available)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Review customer budget proposals. Accept directly or submit a counter-offer.
            </p>
          </div>

          {/* Filter by truck type */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['all', 'furniture', 'appliances', 'building_material'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTruckFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedTruckFilter === cat
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'All Hauls' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {availableBiddingJobs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-400" />
            <p className="text-sm font-semibold text-slate-300">All current hauls are booked!</p>
            <p className="text-xs">New haul requests from Broadhurst, Phakalane, and Block 6 will appear here in real time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableBiddingJobs
              .filter((j) => selectedTruckFilter === 'all' || j.category === selectedTruckFilter)
              .map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Job Details */}
                    <div className="space-y-2.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                          {job.jobCode}
                        </span>
                        <span className="text-xs text-slate-400">
                          {job.scheduledTimeWindow || 'Immediate'}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400 font-medium">
                          {job.totalWeightCategory}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400">
                          {job.helpersRequired} Helpers Req.
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">
                        {job.title}
                      </h4>

                      {/* Locations */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">
                            <strong>From:</strong> {job.pickup.name} ({job.pickup.floorLevel})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">
                            <strong>To:</strong> {job.dropoff.name} ({job.dropoff.floorLevel})
                          </span>
                        </div>
                      </div>

                      {/* Items badge list */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.items.map((it) => (
                          <span
                            key={it.id}
                            className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1"
                          >
                            <Package className="w-3 h-3 text-sky-400" />
                            <span>{it.description}</span>
                          </span>
                        ))}
                      </div>

                      {job.specialInstructions && (
                        <p className="text-[11px] text-amber-300/90 italic bg-amber-950/20 border border-amber-900/30 p-2 rounded-lg">
                          Note: {job.specialInstructions}
                        </p>
                      )}
                    </div>

                    {/* Fare & Quick inDrive Bidding Actions */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Sender Proposed Fare
                        </span>
                        <span className="text-xl font-bold font-mono text-emerald-400">
                          {formatPula(job.customerProposedFareBWP)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Counter-offer button */}
                        <button
                          onClick={() => {
                            setShowCounterModalForJob(job);
                            setCounterPrice(job.customerProposedFareBWP + 60);
                          }}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-semibold transition-all active:scale-95"
                        >
                          Counter Offer
                        </button>

                        {/* Direct accept button */}
                        <button
                          onClick={() => handleQuickAccept(job)}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 whitespace-nowrap"
                        >
                          Accept Fare
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* COUNTER-OFFER MODAL (inDrive style) */}
      {showCounterModalForJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
            <h3 className="text-base font-bold text-white mb-1">
              Submit Counter-Offer (Trip {showCounterModalForJob.jobCode})
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Sender offered {formatPula(showCounterModalForJob.customerProposedFareBWP)}. Propose your price and what services you include.
            </p>

            <form onSubmit={handleSendCounterBid} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Counter-Offer (BWP)
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <span className="text-slate-400 font-bold mr-2 text-sm">P</span>
                  <input
                    type="number"
                    min={100}
                    step={10}
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(Number(e.target.value))}
                    className="bg-transparent text-white font-mono font-bold text-base outline-none w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Helpers You Will Bring
                </label>
                <select
                  value={counterHelpers}
                  onChange={(e) => setCounterHelpers(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  <option value={1}>1 Helper (+Driver)</option>
                  <option value={2}>2 Helpers (Recommended for Heavy Furniture)</option>
                  <option value={3}>3 Helpers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Explanation Note to Customer
                </label>
                <textarea
                  rows={2}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="e.g. Includes 2 helpers for stairs and heavy moving blankets for table glass."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowCounterModalForJob(null)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Send Counter-Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELIVERY PROOF & E-SIGNATURE MODAL */}
      {showProofModal && myActiveHaul && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>Complete Delivery Verification</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Capture recipient signature and photo confirmation for Trip {myActiveHaul.jobCode}.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Digital E-Signature
                </label>
                <div
                  onClick={() => setIsSigned(true)}
                  className="h-28 bg-slate-950 border border-dashed border-slate-700 rounded-xl flex items-center justify-center cursor-pointer hover:border-sky-500 transition-colors p-4 text-center"
                >
                  {isSigned ? (
                    <div className="text-emerald-400 font-mono text-sm italic font-bold">
                      ✓ Electronically Signed by {recipientName}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-xs flex flex-col items-center gap-1">
                      <PenTool className="w-5 h-5 text-slate-400" />
                      <span>Tap here to simulate recipient customer signature</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl text-[11px] text-slate-300 flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Cargo photo proof automatically timestamped and encrypted into the ledger.</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowProofModal(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCompleteDelivery}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Confirm & Request Escrow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
