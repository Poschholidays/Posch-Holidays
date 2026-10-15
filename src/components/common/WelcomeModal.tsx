import React from 'react';
import { Compass, Luggage, Plane, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../../services/sound';

interface Props {
  onStart: () => void;
}

export const WelcomeModal: React.FC<Props> = ({ onStart }) => {
  const handleStart = () => {
    soundManager.playSuccessChime();
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100">
        {/* Top Hero Banner with Muse */}
        <div className="bg-gradient-to-br from-[#0b193d] to-[#1e3a8a] p-6 text-center text-white relative">
          <div className="w-24 h-24 rounded-full mx-auto p-1 bg-amber-400 shadow-xl mb-3 overflow-hidden">
            <img
              src="/src/assets/images/posch_muse_mascot_1792047114029.jpg"
              alt="Muse Mascot"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
            Welcome Explorer!
          </span>
          <h2 className="text-xl font-bold font-display mt-0.5">Meet Muse Your Flight Guide</h2>
          <p className="text-xs text-blue-200 mt-1 max-w-xs mx-auto">
            "Pack your wanderlust! I'm here to guide you across 7 incredible destinations with games, stamps, and real Posch perks."
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">1. Explore 7 World Levels</h4>
              <p className="text-[11px] text-slate-500">
                Start in Singapore and unlock Malaysia, Maldives, Bali, Dubai, Goa, and Ooty.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Luggage className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">2. Master 3 Mini-Games</h4>
              <p className="text-[11px] text-slate-500">
                Test trivia in Guess Destination, organize packing in Pack My Suitcase, and soar in Fly with Muse.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">3. Unlock Real Holidays</h4>
              <p className="text-[11px] text-slate-500">
                Collect passport stamps and submit direct inquiries for verified Posch luxury resort packages.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStart}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Start Adventure (+120 Starter Pts)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
