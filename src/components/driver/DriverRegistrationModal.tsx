import React, { useState } from 'react';
import { DriverApplication, TruckType } from '../../types';
import { 
  Truck, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  CreditCard, 
  ShieldCheck, 
  FileCheck,
  Building,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DriverRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (application: DriverApplication) => void;
}

export const DriverRegistrationModal: React.FC<DriverRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplication,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('72 000 000');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Gaborone');
  
  // Truck Specs
  const [truckType, setTruckType] = useState<TruckType>('1-Ton Bakkie (Hilux/D-Max)');
  const [truckMakeModel, setTruckMakeModel] = useState('');
  const [truckPlate, setTruckPlate] = useState('B ');
  const [truckYear, setTruckYear] = useState(2022);
  const [experienceYears, setExperienceYears] = useState(5);

  // Botswana KYC Documents
  const [omangNumber, setOmangNumber] = useState('');
  const [omangExpiry, setOmangExpiry] = useState('2030-12-31');
  const [omangFile, setOmangFile] = useState<string | null>(null);

  const [licenceNumber, setLicenceNumber] = useState('');
  const [licenceClass, setLicenceClass] = useState('Class B & PrDP Goods');
  const [licenceExpiry, setLicenceExpiry] = useState('2028-06-30');
  const [licenceFile, setLicenceFile] = useState<string | null>(null);

  const [permitFile, setPermitFile] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSimulateUpload = (type: 'omang' | 'licence' | 'permit') => {
    // Generate simulated document attachment
    if (type === 'omang') {
      setOmangFile('Omang_Identity_Card_Both_Sides_Verified.pdf');
    } else if (type === 'licence') {
      setLicenceFile('Botswana_Drivers_Licence_PrDP.pdf');
    } else if (type === 'permit') {
      setPermitFile('DRTS_Goods_Transport_Permit_2026.pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newApp: DriverApplication = {
      id: `app-${Date.now()}`,
      fullName: fullName.trim(),
      phone: `+267 ${phone.replace('+267', '').trim()}`,
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@driver.bw`,
      city,
      omangNumber: omangNumber.trim() || '492019881',
      omangExpiry,
      omangDocName: omangFile || 'Omang_ID_Scanned_Copy.pdf',
      omangDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
      licenceNumber: licenceNumber.trim() || 'DL-BW-77821',
      licenceClass,
      licenceExpiry,
      licenceDocName: licenceFile || 'Drivers_Licence_ClassB_PrDP.pdf',
      licenceDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
      permitDocName: permitFile || 'DRTS_Carrier_Permit.pdf',
      permitDocUrl: '/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg',
      truckType,
      truckMakeModel: truckMakeModel.trim() || 'Toyota Hilux 2.4 GD-6',
      truckPlate: truckPlate.trim().toUpperCase(),
      truckYear,
      experienceYears,
      status: 'pending',
      submittedAt: 'Just now',
    };

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });

    setIsSubmitted(true);
    onSubmitApplication(newApp);

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative text-white my-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Application Submitted!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your Omang ID, Driver's Licence, and Vehicle documents have been forwarded to the <strong>Matshelonyana App Owner Portal</strong> for review and badge approval.
            </p>
            <p className="text-[11px] text-sky-400 font-mono">
              You will receive an SMS alert at +267 {phone} once verified.
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-600/40 flex items-center justify-center text-sky-400 shadow">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Join Matshelonyana as a Transporter
                </h2>
                <p className="text-xs text-slate-400">
                  Earn 95% of every haul. Valid Omang ID & Driver's Licence required.
                </p>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-3 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`font-semibold pb-1 flex items-center gap-1.5 ${
                  step === 1 ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'
                }`}
              >
                <span>1. Personal & Base</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`font-semibold pb-1 flex items-center gap-1.5 ${
                  step === 2 ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'
                }`}
              >
                <span>2. Truck & Fleet</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`font-semibold pb-1 flex items-center gap-1.5 ${
                  step === 3 ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'
                }`}
              >
                <span>3. Omang & Licences</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1: Personal & Contact */}
              {step === 1 && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Legal Name (as shown on Omang ID)
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kefentse Dibeela"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Botswana Phone Number
                      </label>
                      <div className="flex items-center bg-slate-950 border border-slate-800 focus-within:border-sky-500 rounded-xl px-3 py-2 text-xs">
                        <span className="text-slate-400 font-mono mr-1.5">+267</span>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="72 419 802"
                          className="bg-transparent text-white font-mono outline-none w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Base Operating City / Town
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                      >
                        <option value="Gaborone">Gaborone (Greater Area)</option>
                        <option value="Francistown">Francistown</option>
                        <option value="Maun">Maun</option>
                        <option value="Palapye">Palapye</option>
                        <option value="Lobatse">Lobatse</option>
                        <option value="Jwaneng">Jwaneng</option>
                        <option value="Kasane">Kasane</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="driver@example.bw"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={!fullName.trim()}
                      onClick={() => setStep(2)}
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow transition-all"
                    >
                      Next: Truck Details &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Truck Specs */}
              {step === 2 && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Truck Capacity & Body Type
                    </label>
                    <select
                      value={truckType}
                      onChange={(e) => setTruckType(e.target.value as TruckType)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="1-Ton Bakkie (Hilux/D-Max)">1-Ton Bakkie (Hilux, D-Max, Ranger)</option>
                      <option value="3-Ton Drop-Side Truck">3-Ton Drop-Side Truck (Dyna, Canter)</option>
                      <option value="5-Ton Heavy Enclosed Van">5-Ton Heavy Enclosed Box Van</option>
                      <option value="8-Ton Flatbed Truck">8-Ton Flatbed Commercial Truck</option>
                      <option value="12-Ton Multi-Axle Hauler">12-Ton Multi-Axle Hauler</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Vehicle Make & Model
                      </label>
                      <input
                        type="text"
                        required
                        value={truckMakeModel}
                        onChange={(e) => setTruckMakeModel(e.target.value)}
                        placeholder="e.g. Toyota Hilux 2.4 GD-6"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Botswana Registration Plate
                      </label>
                      <input
                        type="text"
                        required
                        value={truckPlate}
                        onChange={(e) => setTruckPlate(e.target.value.toUpperCase())}
                        placeholder="e.g. B 492 BAZ"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-sky-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Year of Manufacture
                      </label>
                      <input
                        type="number"
                        min={2005}
                        max={2026}
                        value={truckYear}
                        onChange={(e) => setTruckYear(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Years of Commercial Haulage
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={35}
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="button"
                      disabled={!truckMakeModel.trim() || !truckPlate.trim()}
                      onClick={() => setStep(3)}
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow transition-all"
                    >
                      Next: Document Uploads &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Mandatory KYC Documents (Omang ID, Driver Licence, Carrier Permit) */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3 bg-sky-950/40 border border-sky-800/50 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Compliance Mandate:</strong> App Owner and DRTS Botswana regulations require verified Omang National ID and valid Driving Licence for all transporters.
                    </span>
                  </div>

                  {/* 1. Omang National ID Upload & Number */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-sky-400" />
                        <span>1. Valid Botswana Omang National Identity Card</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-medium">Required</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Omang ID Number (9 Digits)</span>
                        <input
                          type="text"
                          required
                          maxLength={9}
                          value={omangNumber}
                          onChange={(e) => setOmangNumber(e.target.value)}
                          placeholder="e.g. 392019401"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Expiry Date</span>
                        <input
                          type="date"
                          value={omangExpiry}
                          onChange={(e) => setOmangExpiry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 truncate max-w-[200px]">
                          {omangFile || 'Attach Omang front & back (PDF/JPG)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSimulateUpload('omang')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] rounded font-medium transition-colors"
                      >
                        {omangFile ? 'Attached ✓' : 'Upload Copy'}
                      </button>
                    </div>
                  </div>

                  {/* 2. Driver's Licence & PrDP */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-sky-400" />
                        <span>2. Botswana Driver's Licence (PrDP Goods)</span>
                      </label>
                      <span className="text-[10px] text-emerald-400 font-medium">Required</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Licence Number</span>
                        <input
                          type="text"
                          required
                          value={licenceNumber}
                          onChange={(e) => setLicenceNumber(e.target.value)}
                          placeholder="e.g. DL-BW-88219"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Class Authorization</span>
                        <select
                          value={licenceClass}
                          onChange={(e) => setLicenceClass(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none"
                        >
                          <option value="Class B & PrDP Goods">Class B (1-Ton Bakkie)</option>
                          <option value="Class C1 & PrDP Goods">Class C1 (3-Ton / 5-Ton)</option>
                          <option value="Class C & PrDP Goods">Class C (Heavy Rigid)</option>
                          <option value="Class EC & PrDP Goods">Class EC (Articulated)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 truncate max-w-[200px]">
                          {licenceFile || 'Attach Licence Card Copy (PDF/JPG)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSimulateUpload('licence')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] rounded font-medium transition-colors"
                      >
                        {licenceFile ? 'Attached ✓' : 'Upload Copy'}
                      </button>
                    </div>
                  </div>

                  {/* 3. Transport Permit (DRTS) */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-sky-400" />
                        <span>3. DRTS Goods / Carrier Road Permit</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Optional / Fast-Track</span>
                    </div>

                    <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 truncate max-w-[200px]">
                          {permitFile || 'Attach Carrier Permit / Roadworthiness'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSimulateUpload('permit')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] rounded font-medium transition-colors"
                      >
                        {permitFile ? 'Attached ✓' : 'Upload Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                      &larr; Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit for Owner Review</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
