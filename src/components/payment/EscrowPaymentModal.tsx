import React, { useState } from 'react';
import { Job } from '../../types';
import { formatPula, generateSHA256Hash } from '../../utils/crypto';
import { ShieldCheck, Lock, CheckCircle, CreditCard, Smartphone, Building, X, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EscrowPaymentModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (method: 'Orange Money' | 'Mascom MyZaka' | 'Absa / FNB Card' | 'EFT Bank Transfer', hash: string) => void;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  job,
  isOpen,
  onClose,
  onConfirmPayment,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'Orange Money' | 'Mascom MyZaka' | 'Absa / FNB Card' | 'EFT Bank Transfer'>('Orange Money');
  const [phoneNumber, setPhoneNumber] = useState('74120983');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedHash, setGeneratedHash] = useState('');

  if (!isOpen) return null;

  const fare = job.agreedFareBWP || job.customerProposedFareBWP;
  const insuranceFee = 25.00;
  const helperAllowance = job.helpersRequired * 40.00;
  const totalAmount = fare + insuranceFee;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate cryptographic SHA-256 ledger record
    const hash = await generateSHA256Hash(`${job.jobCode}_${totalAmount}_${selectedMethod}_${Date.now()}`);
    setGeneratedHash(hash);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0284c7', '#10b981', '#ffffff'],
      });

      setTimeout(() => {
        onConfirmPayment(selectedMethod, hash);
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Funds Secured in Escrow Vault!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your payment of <strong className="text-sky-400">{formatPula(totalAmount)}</strong> is locked safely. The truck driver is only paid after you verify successful delivery.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono text-slate-400 text-left break-all">
              <p className="text-slate-500 font-sans mb-1 font-semibold">Ledger Cryptographic Proof:</p>
              {generatedHash}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Secure Escrow Checkout</h2>
                <p className="text-xs text-slate-400">Trip {job.jobCode} · Matshelonyana Protected</p>
              </div>
            </div>

            {/* Escrow Guarantee Banner */}
            <div className="p-3 bg-sky-950/50 border border-sky-800/60 rounded-xl mb-5 flex items-start gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <p>
                <strong>Zero Risk Guarantee:</strong> Funds remain in escrow until goods are delivered and you verify all items are safe.
              </p>
            </div>

            {/* Itemized Breakdown */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 mb-5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Agreed Truck Haulage Fare</span>
                <span className="font-mono text-white">{formatPula(fare)}</span>
              </div>
              {job.helpersRequired > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>{job.helpersRequired} Dedicated Helper(s)</span>
                  <span className="font-mono text-white">Included</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Goods In-Transit Insurance & Protection</span>
                <span className="font-mono text-white">{formatPula(insuranceFee)}</span>
              </div>
              <div className="h-px bg-slate-800 my-2" />
              <div className="flex justify-between text-sm font-semibold text-white">
                <span>Total Escrow Deposit</span>
                <span className="font-mono text-sky-400">{formatPula(totalAmount)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Botswana Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Orange Money', label: 'Orange Money', icon: Smartphone, desc: 'Instant USSD Push' },
                    { id: 'Mascom MyZaka', label: 'Mascom MyZaka', icon: Smartphone, desc: 'Instant Mobile Wallet' },
                    { id: 'Absa / FNB Card', label: 'FNB / Absa / Stanbic', icon: CreditCard, desc: 'Debit / Credit Card' },
                    { id: 'EFT Bank Transfer', label: 'Instant EFT', icon: Building, desc: 'Botswana Local Bank' },
                  ].map((m) => {
                    const isSelected = selectedMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          isSelected
                            ? 'bg-sky-950/80 border-sky-500 text-white shadow-md shadow-sky-950/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                          <span className="text-xs font-bold text-white">{m.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{m.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile / Card details */}
              {(selectedMethod === 'Orange Money' || selectedMethod === 'Mascom MyZaka') ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Botswana Mobile Number
                  </label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 focus-within:border-sky-500 rounded-xl px-3 py-2 text-xs">
                    <span className="text-slate-400 font-mono mr-2">+267</span>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="74 120 983"
                      className="bg-transparent text-white font-mono outline-none w-full"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    A prompt will appear on your phone asking you to enter your {selectedMethod} secret PIN.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Card / Account PIN Authorization
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN for demo"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono tracking-widest outline-none"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Securing Funds...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Lock {formatPula(totalAmount)} in Escrow</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
