import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  driverName: string;
  driverAvatar?: string;
  truckPlate: string;
  jobCode: string;
  fareBWP: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitRating: (stars: number, compliments: string[], review: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  driverName,
  driverAvatar,
  truckPlate,
  jobCode,
  fareBWP,
  isOpen,
  onClose,
  onSubmitRating,
}) => {
  const [stars, setStars] = useState(5);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([
    'Careful with Furniture',
    'Arrived On Time',
  ]);
  const [reviewText, setReviewText] = useState('');

  if (!isOpen) return null;

  const complimentsList = [
    'Careful with Furniture',
    'Arrived On Time',
    'Heavy Lifting Pro',
    'Polite & Professional',
    'Clean Truck & Moving Quilts',
    'Fair & Honest Fare',
  ];

  const toggleCompliment = (comp: string) => {
    if (selectedCompliments.includes(comp)) {
      setSelectedCompliments(selectedCompliments.filter((c) => c !== comp));
    } else {
      setSelectedCompliments([...selectedCompliments, comp]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#ffffff', '#0f172a'],
    });
    onSubmitRating(stars, selectedCompliments, reviewText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800 border-2 border-sky-500 overflow-hidden shadow-lg flex items-center justify-center">
            {driverAvatar ? (
              <img
                src={driverAvatar}
                alt={driverName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-sky-400">{driverName.charAt(0)}</span>
            )}
          </div>
          <h2 className="text-lg font-bold text-white">Rate Your Driver</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {driverName} · {truckPlate} · Trip {jobCode}
          </p>
        </div>

        {/* Stars Selector */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHoveredStars(s)}
              onMouseLeave={() => setHoveredStars(0)}
              onClick={() => setStars(s)}
              className="p-1 transition-transform hover:scale-125 focus:outline-none"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  s <= (hoveredStars || stars)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Compliments Badges */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-300 mb-2.5">
            What went especially well?
          </p>
          <div className="flex flex-wrap gap-1.5">
            {complimentsList.map((comp) => {
              const isSelected = selectedCompliments.includes(comp);
              return (
                <button
                  key={comp}
                  type="button"
                  onClick={() => toggleCompliment(comp)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-sky-950 border-sky-500 text-sky-300 shadow-sm'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Review */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Leave a note for {driverName}
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="e.g. Handled our large couches with great care up the stairs and arrived exactly on time."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg transition-all active:scale-95"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};
