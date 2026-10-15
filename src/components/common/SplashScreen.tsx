import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../../services/sound';

interface Props {
  onEnter: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onEnter }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  const handleStart = () => {
    soundManager.playSuccessChime();
    onEnter();
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#0b193d] via-[#1e3a8a] to-[#0d2357] text-white text-center overflow-hidden">
      {/* Background ambient lighting and stars */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Brand Tag */}
      <div className="pt-8 z-10">
        <span className="text-[11px] font-bold tracking-[0.25em] text-amber-400 uppercase">
          Posch Holidays & Resorts
        </span>
      </div>

      {/* Hero Central Lockup with Muse Mascot */}
      <div className="flex flex-col items-center z-10 max-w-sm">
        <div className="relative mb-5">
          <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-2xl animate-float">
            <img
              src="/src/assets/images/posch_muse_mascot_1792047114029.jpg"
              alt="Muse Mascot Posch Holidays"
              className="w-full h-full object-cover rounded-full shadow-inner"
            />
          </div>
          <div className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            MUSE · AVIATOR
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-display">
          POSCH HOLIDAY QUEST
        </h1>
        <p className="text-sm font-medium text-amber-300 mb-2">
          Play. Explore. Unlock Your Next Holiday.
        </p>
        <p className="text-xs text-blue-200/90 leading-relaxed px-4">
          Journey across 7 iconic destinations, master playful travel mini-games, collect digital passport stamps, and discover handcrafted luxury escapes.
        </p>
      </div>

      {/* Bottom Progress & CTA */}
      <div className="w-full max-w-xs z-10 pb-6 space-y-4">
        {progress < 100 ? (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-blue-200 font-medium">
              <span>Preparing Flight Radar...</span>
              <span className="tabular-nums font-bold text-amber-400">{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-blue-950/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 fill-current text-slate-950" />
            <span>Embark On Quest</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        <div className="text-[10px] text-blue-300/70">
          Official Mobile Travel Game · Posch Holidays & Resorts
        </div>
      </div>
    </div>
  );
};
