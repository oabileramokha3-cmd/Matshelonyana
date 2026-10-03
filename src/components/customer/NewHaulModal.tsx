import React, { useState } from 'react';
import { Job, CargoCategory, CargoItem } from '../../types';
import { BOTSWANA_LOCATIONS } from '../../data/mockData';
import { formatPula, generateJobCode } from '../../utils/crypto';
import { Package, Truck, Calendar, Clock, MapPin, Plus, Trash2, ShieldCheck, X, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewHaulModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: (newJob: Job) => void;
}

export const NewHaulModal: React.FC<NewHaulModalProps> = ({
  isOpen,
  onClose,
  onCreateJob,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CargoCategory>('furniture');
  const [pickupIndex, setPickupIndex] = useState(1); // Broadhurst
  const [dropoffIndex, setDropoffIndex] = useState(0); // Phakalane
  const [pickupFloor, setPickupFloor] = useState('Ground Floor');
  const [dropoffFloor, setDropoffFloor] = useState('1st Floor (Stairs)');
  const [scheduledType, setScheduledType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledTime, setScheduledTime] = useState('Today 16:30 - 18:00');
  const [helpersRequired, setHelpersRequired] = useState(2);
  const [weightCategory, setWeightCategory] = useState<'Light (<200kg)' | 'Medium (200-800kg)' | 'Heavy (800kg-2.5t)' | 'Extra Heavy (2.5t+)'>('Medium (200-800kg)');
  const [proposedFare, setProposedFare] = useState<number>(450);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [items, setItems] = useState<CargoItem[]>([
    { id: '1', description: '3-Piece Living Room Sofa Set', quantity: 1, weightKgEstimate: 120, isFragile: false },
    { id: '2', description: 'Dining Room Table & 6 Chairs', quantity: 1, weightKgEstimate: 85, isFragile: true },
  ]);
  const [newItemText, setNewItemText] = useState('');

  if (!isOpen) return null;

  const addItem = () => {
    if (!newItemText.trim()) return;
    setItems([
      ...items,
      {
        id: String(Date.now()),
        description: newItemText.trim(),
        quantity: 1,
        weightKgEstimate: 40,
        isFragile: false,
      },
    ]);
    setNewItemText('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || items.length === 0) return;

    const pLoc = BOTSWANA_LOCATIONS[pickupIndex];
    const dLoc = BOTSWANA_LOCATIONS[dropoffIndex];

    const jobCode = generateJobCode();

    const newJob: Job = {
      id: `job-${Date.now()}`,
      jobCode,
      title: title.trim(),
      category,
      customerId: 'cust-amantle',
      customerName: 'Amantle Kgari',
      customerPhone: '+267 74 120 983',
      customerAvatar: '/src/assets/images/avatar_customer_amantle_1790988358805.jpg',
      pickup: {
        name: pLoc.name,
        suburb: pLoc.suburb,
        address: `${pLoc.name}, Gaborone`,
        coords: pLoc.coords,
        floorLevel: pickupFloor,
        contactPhone: '+267 74 120 983',
      },
      dropoff: {
        name: dLoc.name,
        suburb: dLoc.suburb,
        address: `${dLoc.name}, Gaborone`,
        coords: dLoc.coords,
        floorLevel: dropoffFloor,
        contactPhone: '+267 74 120 983',
      },
      scheduledType,
      scheduledTimeWindow: scheduledType === 'scheduled' ? scheduledTime : 'Immediate (Next 30 mins)',
      items,
      totalWeightCategory: weightCategory,
      helpersRequired,
      specialInstructions: specialInstructions.trim() || undefined,
      itemPhotos: ['/src/assets/images/matshelonyana_truck_hero_1790988338230.jpg'],
      customerProposedFareBWP: proposedFare,
      currentStatus: 'bidding',
      bids: [],
      milestones: [
        { status: 'accepted', label: 'Job Published & Bidding Active', timestamp: 'Just now', completed: true },
      ],
      escrowStatus: 'unfunded',
      createdAt: new Date().toISOString(),
    };

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#ffffff', '#0f172a'],
    });

    onCreateJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative text-white my-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center text-white shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Post Goods & Furniture Haul</h2>
            <p className="text-xs text-slate-400">Propose your price inDrive style & get bids from verified truck drivers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Haul Title / Summary
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 3-Piece L-Couch & Dining Suite Move"
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CargoCategory)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="furniture">Heavy Furniture</option>
                <option value="appliances">Appliances (Fridge/Washer)</option>
                <option value="full_house">Full House Move</option>
                <option value="office">Office Relocation</option>
                <option value="building_material">Building Materials</option>
                <option value="commercial_heavy">Heavy Machinery</option>
              </select>
            </div>
          </div>

          {/* Pickup and Dropoff Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Pickup Location</span>
              </div>
              <select
                value={pickupIndex}
                onChange={(e) => setPickupIndex(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none mb-2"
              >
                {BOTSWANA_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={idx}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={pickupFloor}
                onChange={(e) => setPickupFloor(e.target.value)}
                placeholder="Floor level (e.g. Ground Floor, 2nd floor)"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Drop-off Destination</span>
              </div>
              <select
                value={dropoffIndex}
                onChange={(e) => setDropoffIndex(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none mb-2"
              >
                {BOTSWANA_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={idx}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={dropoffFloor}
                onChange={(e) => setDropoffFloor(e.target.value)}
                placeholder="Floor level (e.g. 1st Floor, Elevator available)"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Automated Delivery Scheduling */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Automated Scheduling
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setScheduledType('immediate')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  scheduledType === 'immediate'
                    ? 'bg-sky-950 border-sky-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Immediate Dispatch (ASAP)</span>
              </button>
              <button
                type="button"
                onClick={() => setScheduledType('scheduled')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  scheduledType === 'scheduled'
                    ? 'bg-sky-950 border-sky-500 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Schedule Later Window</span>
              </button>
            </div>

            {scheduledType === 'scheduled' && (
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. Tomorrow 09:00 - 11:30 AM"
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            )}
          </div>

          {/* Item Checklist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Items Being Transported ({items.length})
              </label>
              <span className="text-[11px] text-slate-400">List heavy objects</span>
            </div>
            
            <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto pr-1">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-sky-400" />
                    <span>{it.description}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add another item (e.g. Glass coffee table, 4 door wardrobe)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem();
                  }
                }}
              />
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Helpers & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Truck Helpers Needed
              </label>
              <select
                value={helpersRequired}
                onChange={(e) => setHelpersRequired(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value={0}>Driver only (I will help lift)</option>
                <option value={1}>1 Helper (+Driver)</option>
                <option value={2}>2 Helpers (Recommended for Couches)</option>
                <option value={3}>3 Helpers (Heavy Piano / Safes)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Weight Classification
              </label>
              <select
                value={weightCategory}
                onChange={(e) => setWeightCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Light (<200kg)">Light (&lt;200kg)</option>
                <option value="Medium (200-800kg)">Medium (200 - 800kg)</option>
                <option value="Heavy (800kg-2.5t)">Heavy (800kg - 2.5t)</option>
                <option value="Extra Heavy (2.5t+)">Extra Heavy (2.5t+)</option>
              </select>
            </div>
          </div>

          {/* inDrive Style Fare Proposal */}
          <div className="p-3.5 bg-sky-950/40 border border-sky-800/60 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-sky-400" />
                <span>Your Proposed Fare (inDrive Pricing)</span>
              </label>
              <span className="text-[11px] text-sky-300 font-mono">Suggested: P380 - P520</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                <span className="text-slate-400 font-bold mr-2 text-sm">P</span>
                <input
                  type="number"
                  min={100}
                  step={10}
                  value={proposedFare}
                  onChange={(e) => setProposedFare(Number(e.target.value))}
                  className="bg-transparent text-white font-mono font-bold text-base outline-none w-full tabular-nums"
                />
              </div>

              {/* Quick adjustment buttons */}
              <div className="flex items-center gap-1">
                {[-20, +20, +50].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => setProposedFare((p) => Math.max(150, p + delta))}
                    className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-[11px] font-mono rounded-lg text-slate-300 transition-colors"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">
              Drivers nearby will see your proposed fare. They can accept immediately or submit a counter-offer with their truck details.
            </p>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Special Handling / Notes
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please bring ratcheting straps and protective blankets for leather surface."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Form Actions */}
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
              className="flex-1 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg transition-all active:scale-95"
            >
              Post Haul for {formatPula(proposedFare)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
