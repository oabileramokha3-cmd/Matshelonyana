import React, { useState } from 'react';
import { Job, DriverBid, ChatMessage } from '../../types';
import { MapView } from '../MapView';
import { InAppChat } from '../chat/InAppChat';
import { RatingModal } from './RatingModal';
import { EscrowPaymentModal } from '../payment/EscrowPaymentModal';
import { formatPula } from '../../utils/crypto';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  CheckCircle2, 
  Star, 
  AlertCircle,
  Lock,
  ArrowRight,
  Phone,
  Plus
} from 'lucide-react';

interface CustomerViewProps {
  jobs: Job[];
  activeJobId: string;
  onSelectJob: (jobId: string) => void;
  onAcceptBid: (jobId: string, bid: DriverBid) => void;
  onReleaseEscrow: (jobId: string) => void;
  onSubmitRating: (jobId: string, stars: number, compliments: string[], review: string) => void;
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (jobId: string, text: string) => void;
  onOpenNewHaul: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  jobs,
  activeJobId,
  onSelectJob,
  onAcceptBid,
  onReleaseEscrow,
  onSubmitRating,
  messages,
  onSendMessage,
  onOpenNewHaul,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [pendingBidToAccept, setPendingBidToAccept] = useState<DriverBid | null>(null);

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  const handleStartAcceptBid = (bid: DriverBid) => {
    setPendingBidToAccept(bid);
    setShowEscrowModal(true);
  };

  const handleEscrowPaid = (method: any, hash: string) => {
    if (pendingBidToAccept && activeJob) {
      onAcceptBid(activeJob.id, pendingBidToAccept);
      setPendingBidToAccept(null);
    }
  };

  const handleTriggerRelease = () => {
    if (activeJob) {
      onReleaseEscrow(activeJob.id);
      setShowRatingModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Trip Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 mr-2 whitespace-nowrap">Your Hauls:</span>
          {jobs.map((j) => {
            const isSelected = j.id === activeJob?.id;
            return (
              <button
                key={j.id}
                onClick={() => onSelectJob(j.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-sky-600 border-sky-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{j.jobCode}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="truncate max-w-[120px]">{j.title}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenNewHaul}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Haul</span>
        </button>
      </div>

      {activeJob && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left / Middle Column (7 or 8 cols): Map or Bidding View */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header for Active Job */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-slate-950 text-sky-400 px-2.5 py-1 rounded-lg border border-slate-800">
                    {activeJob.jobCode}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span>{activeJob.totalWeightCategory}</span>
                    <span>·</span>
                    <span>{activeJob.helpersRequired} Helpers Needed</span>
                    <span>·</span>
                    <span>{activeJob.scheduledTimeWindow || 'Immediate'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    activeJob.currentStatus === 'in_transit'
                      ? 'bg-sky-950 text-sky-300 border border-sky-500/40 animate-pulse'
                      : activeJob.currentStatus === 'bidding'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {activeJob.currentStatus === 'in_transit' && 'Live in Transit'}
                    {activeJob.currentStatus === 'bidding' && `${activeJob.bids.length} Driver Bids Active`}
                    {activeJob.currentStatus === 'cargo_loaded' && 'Cargo Strapped & Inspected'}
                    {activeJob.currentStatus === 'delivered' && 'Delivered'}
                    {activeJob.currentStatus === 'completed' && 'Trip Completed'}
                  </span>
                </div>
              </div>

              <h1 className="text-lg font-bold text-white mb-4 leading-snug">
                {activeJob.title}
              </h1>

              {/* Route Summary Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-sky-900/60 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{activeJob.pickup.suburb}</p>
                    <p className="text-slate-400 text-[11px] truncate">{activeJob.pickup.address}</p>
                    <p className="text-[10px] text-sky-400 mt-0.5">{activeJob.pickup.floorLevel}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{activeJob.dropoff.suburb}</p>
                    <p className="text-slate-400 text-[11px] truncate">{activeJob.dropoff.address}</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">{activeJob.dropoff.floorLevel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE GPS RADAR MAP (If job is in transit, cargo loaded, or en route) */}
            {activeJob.currentStatus !== 'bidding' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-400" />
                    <span>Real-Time GPS Delivery Tracking</span>
                  </h3>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{showChat ? 'Hide In-App Chat' : 'Open In-App Chat'}</span>
                  </button>
                </div>

                <MapView job={activeJob} />

                {/* Milestone Stepper */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Trip Logistics Milestones
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeJob.milestones.map((ms, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                          ms.completed
                            ? 'bg-sky-950/40 border-sky-600/40 text-slate-200'
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${ms.completed ? 'text-sky-400' : 'text-slate-600'}`} />
                          <span className="font-semibold text-[11px] truncate">{ms.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{ms.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* IN-DRIVE BIDDING RADAR VIEW (Drivers submitting bids & counter-offers) */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Live Driver Offers & Bids</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </h3>
                    <p className="text-xs text-slate-400">
                      Your proposed fare was <strong className="text-sky-400">{formatPula(activeJob.customerProposedFareBWP)}</strong>. Drivers can accept or counter-bid below.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Radar Status:</span>
                    <span className="block text-xs font-semibold text-emerald-400">Broadcasting to Gaborone Drivers</span>
                  </div>
                </div>

                {activeJob.bids.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 space-y-2">
                    <Truck className="w-10 h-10 mx-auto text-slate-600 animate-bounce" />
                    <p className="text-sm font-semibold text-slate-300">Broadcasting request to nearby truck drivers...</p>
                    <p className="text-xs max-w-sm mx-auto">Verified transporters in your area are reviewing your cargo specs and route.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeJob.bids.map((bid) => (
                      <div
                        key={bid.id}
                        className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={bid.driverAvatar}
                            alt={bid.driverName}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{bid.driverName}</h4>
                              <div className="flex items-center gap-1 text-xs text-amber-400">
                                <Star className="w-3 h-3 fill-amber-400" />
                                <span className="font-semibold">{bid.rating}</span>
                                <span className="text-slate-500 text-[10px]">({bid.completedHauls} hauls)</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {bid.truckType} · <span className="font-mono text-sky-400">{bid.truckPlate}</span>
                            </p>
                            {bid.counterOfferNote && (
                              <p className="text-[11px] text-slate-400 mt-1 italic max-w-md bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                                "{bid.counterOfferNote}"
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono">
                              <span>ETA: {bid.etaMinutes} mins away</span>
                              <span>·</span>
                              <span>Includes {bid.helpersOffered} helpers</span>
                            </div>
                          </div>
                        </div>

                        {/* Bid Price & Action */}
                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Offered Fare</span>
                            <span className="text-lg font-bold font-mono text-white">
                              {formatPula(bid.proposedFareBWP)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleStartAcceptBid(bid)}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow transition-all active:scale-95 whitespace-nowrap"
                          >
                            Accept & Fund Escrow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Cargo Specs, Escrow Protection, Driver Card & In-App Chat */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Driver Profile Card (If driver assigned) */}
            {activeJob.assignedDriver && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Transporter</span>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Botswana Carrier
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={activeJob.assignedDriver.driverAvatar}
                    alt={activeJob.assignedDriver.driverName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-500/60 shadow"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeJob.assignedDriver.driverName}</h3>
                    <p className="text-xs text-slate-400">{activeJob.assignedDriver.truckType}</p>
                    <p className="text-xs font-mono text-sky-400">{activeJob.assignedDriver.truckPlate}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{activeJob.assignedDriver.rating}</span>
                      <span className="text-slate-500">({activeJob.assignedDriver.completedHauls} trips)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    <span>In-App Chat</span>
                  </button>

                  <a
                    href={`tel:${activeJob.assignedDriver.driverPhone}`}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>
            )}

            {/* In-App Chat Box (when toggled) */}
            {showChat && (
              <div className="h-[400px]">
                <InAppChat
                  job={activeJob}
                  currentUserRole="customer"
                  messages={messages[activeJob.id] || []}
                  onSendMessage={(txt) => onSendMessage(activeJob.id, txt)}
                  onClose={() => setShowChat(false)}
                />
              </div>
            )}

            {/* Digital Escrow & Payment Action Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-sky-400" />
                  <span>Escrow & Digital Security</span>
                </h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  activeJob.escrowStatus === 'held_in_escrow'
                    ? 'bg-sky-950 text-sky-400 border border-sky-600/40'
                    : activeJob.escrowStatus === 'released'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {activeJob.escrowStatus === 'held_in_escrow' && 'Held in Escrow'}
                  {activeJob.escrowStatus === 'released' && 'Released to Driver'}
                  {activeJob.escrowStatus === 'unfunded' && 'Unfunded'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Fare:</span>
                  <span className="font-mono text-white font-bold">
                    {formatPula(activeJob.agreedFareBWP || activeJob.customerProposedFareBWP)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Transit Insurance:</span>
                  <span className="text-emerald-400 font-semibold">Active & Covered</span>
                </div>
                {activeJob.escrowReleaseCode && (
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                    <span>Release PIN:</span>
                    <span className="font-mono font-bold text-sky-400 tracking-wider">
                      {activeJob.escrowReleaseCode}
                    </span>
                  </div>
                )}
              </div>

              {/* Release Escrow Button */}
              {activeJob.escrowStatus === 'held_in_escrow' ? (
                <button
                  onClick={handleTriggerRelease}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Delivery & Release Payment</span>
                </button>
              ) : activeJob.escrowStatus === 'released' ? (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-center text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span>Escrow released successfully. Driver paid!</span>
                </div>
              ) : null}
            </div>

            {/* Cargo Items Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Items In This Haul ({activeJob.items.length})
              </h3>
              <div className="space-y-2">
                {activeJob.items.map((it) => (
                  <div
                    key={it.id}
                    className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-slate-200">
                      <Package className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{it.description}</span>
                    </div>
                    {it.isFragile && (
                      <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded font-medium">
                        Fragile
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Escrow Checkout Modal */}
      {showEscrowModal && activeJob && (
        <EscrowPaymentModal
          job={activeJob}
          isOpen={showEscrowModal}
          onClose={() => setShowEscrowModal(false)}
          onConfirmPayment={handleEscrowPaid}
        />
      )}

      {/* Rating & Feedback Modal */}
      {showRatingModal && activeJob && activeJob.assignedDriver && (
        <RatingModal
          driverName={activeJob.assignedDriver.driverName}
          driverAvatar={activeJob.assignedDriver.driverAvatar}
          truckPlate={activeJob.assignedDriver.truckPlate}
          jobCode={activeJob.jobCode}
          fareBWP={activeJob.agreedFareBWP || activeJob.customerProposedFareBWP}
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmitRating={(stars, compliments, review) =>
            onSubmitRating(activeJob.id, stars, compliments, review)
          }
        />
      )}
    </div>
  );
};
