import React, { useState } from 'react';
import { PlayerState } from '../../types/game';
import { DESTINATIONS_DATA } from '../../data/destinations';
import { soundManager } from '../../services/sound';
import { Award, Lock, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  player: PlayerState;
  onSelectDestination: (destId: string) => void;
  onPlanHoliday: (destId: string) => void;
}

export const DigitalPassport: React.FC<Props> = ({
  player,
  onSelectDestination,
  onPlanHoliday,
}) => {
  const [activePage, setActivePage] = useState<'id' | 'stamps'>('id');
  const [selectedStampId, setSelectedStampId] = useState<string | null>(null);

  const totalStamps = DESTINATIONS_DATA.length;
  const collectedCount = player.stampsCollected.length;

  const handleStampClick = (destId: string) => {
    soundManager.playStamp();
    setSelectedStampId(destId);
  };

  const selectedDestination = DESTINATIONS_DATA.find((d) => d.id === selectedStampId);
  const isSelectedCollected = selectedStampId ? player.stampsCollected.includes(selectedStampId) : false;

  return (
    <div className="max-w-md mx-auto my-4 space-y-4">
      {/* Passport Book Exterior / Container */}
      <div className="bg-[#1a233a] rounded-3xl p-5 shadow-2xl border-4 border-[#2d3b5d] text-white relative overflow-hidden">
        {/* Subtle leather texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-black/60 pointer-events-none" />

        {/* Passport Gold Foil Header */}
        <div className="text-center border-b border-amber-400/20 pb-4 mb-4 relative z-10">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-amber-400/60 flex items-center justify-center text-amber-400 mb-2">
            <span className="text-xl">✈️</span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-extrabold block">
            Posch Holidays & Resorts
          </span>
          <h2 className="text-lg font-extrabold tracking-wide text-amber-100 font-display">
            GLOBAL TRAVEL PASSPORT
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1 text-[11px] text-blue-200">
            <span>Official Quest Document</span>
            <span>·</span>
            <span className="font-bold text-amber-400 tabular-nums">
              {collectedCount}/{totalStamps} STAMPS COLLECTED
            </span>
          </div>
        </div>

        {/* Passport Page Switcher Tabs */}
        <div className="flex bg-slate-900/70 p-1 rounded-xl mb-4 border border-blue-900/60 relative z-10">
          <button
            onClick={() => {
              soundManager.playClick();
              setActivePage('id');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activePage === 'id' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            Explorer Identity
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActivePage('stamps');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activePage === 'stamps' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            Visa Stamps ({collectedCount})
          </button>
        </div>

        {/* PAGE 1: Explorer Identity Page */}
        {activePage === 'id' && (
          <div className="bg-[#fcfbf7] text-slate-900 rounded-2xl p-4 shadow-inner border border-amber-100 relative z-10 space-y-4">
            <div className="flex items-start gap-3 border-b border-slate-200 pb-3">
              {/* Photo Box */}
              <div className="w-20 h-24 bg-slate-100 rounded-xl overflow-hidden border-2 border-slate-300 shrink-0 relative">
                <img
                  src="/src/assets/images/posch_muse_mascot_1792047114029.jpg"
                  alt="Explorer Photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-blue-900 text-amber-300 text-[8px] font-bold text-center py-0.5">
                  VERIFIED
                </div>
              </div>

              {/* Identity Fields */}
              <div className="flex-1 space-y-1 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Explorer Name</span>
                  <span className="font-bold text-sm text-slate-900">{player.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Classification</span>
                  <span className="font-semibold text-blue-900">Posch Quest Adventurer</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Points</span>
                    <span className="font-bold text-amber-600 tabular-nums">{player.points} PTS</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Stamps</span>
                    <span className="font-bold text-emerald-700 tabular-nums">{collectedCount} / 7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Security Watermark / Hologram strip */}
            <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-blue-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-900 font-medium">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Verified Posch Travel Status</span>
              </div>
              <span className="font-bold text-blue-900">TIER: GOLD EXPLORER</span>
            </div>

            {/* Machine Readable Travel Zone */}
            <div className="bg-slate-100 p-2 rounded-lg font-mono text-[9px] text-slate-600 tracking-wider leading-tight">
              P&lt;POSCH&lt;&lt;QUEST&lt;{player.name.toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br />
              EXP2026&lt;STAMPS{collectedCount}00&lt;PTS{player.points}000&lt;&lt;&lt;&lt;&lt;&lt;9
            </div>
          </div>
        )}

        {/* PAGE 2: Visa Stamps Collection */}
        {activePage === 'stamps' && (
          <div className="bg-[#fcfbf7] text-slate-900 rounded-2xl p-4 shadow-inner border border-amber-100 relative z-10 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200">
              <span>Official Destination Visas</span>
              <span>Tap a stamp to inspect</span>
            </div>

            {/* Stamp Grid */}
            <div className="grid grid-cols-2 gap-3">
              {DESTINATIONS_DATA.map((dest) => {
                const isCollected = player.stampsCollected.includes(dest.id);
                return (
                  <button
                    key={dest.id}
                    onClick={() => handleStampClick(dest.id)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center relative ${
                      isCollected
                        ? 'border-dashed border-2 bg-amber-50/60 hover:scale-[1.02] shadow-sm'
                        : 'border-dashed border-slate-300 bg-slate-50/80 opacity-60'
                    }`}
                    style={{ borderColor: isCollected ? dest.stamp.color : '#cbd5e1' }}
                  >
                    {isCollected ? (
                      <>
                        <div
                          className="w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-xl mb-1 rotate-[-6deg]"
                          style={{ borderColor: dest.stamp.color, color: dest.stamp.color }}
                        >
                          {dest.stamp.symbol}
                        </div>
                        <span
                          className="text-[11px] font-extrabold uppercase tracking-wider rotate-[-2deg]"
                          style={{ color: dest.stamp.color }}
                        >
                          {dest.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">
                          OFFICIAL VISA
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 mb-1">
                          <Lock className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          {dest.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">Locked</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Stamp Detail Modal */}
      {selectedDestination && (
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200 animate-in fade-in space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{selectedDestination.stamp.symbol}</span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedDestination.name} Visa Stamp</h3>
                <p className="text-[11px] text-slate-500 italic">"{selectedDestination.stamp.inkQuote}"</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStampId(null)}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Stamp Status:</span>
              <span className={`font-bold ${isSelectedCollected ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isSelectedCollected ? 'Collected in Passport ✓' : 'Awaiting Unlock'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Destination Level:</span>
              <span className="font-semibold text-slate-800">Level {selectedDestination.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Posch Resort Package:</span>
              <span className="font-semibold text-blue-900">{selectedDestination.holidayPackage.title}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onPlanHoliday(selectedDestination.id)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-sm hover:brightness-105 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Plan {selectedDestination.name} Holiday
            </button>
            <button
              onClick={() => onSelectDestination(selectedDestination.id)}
              className="py-2.5 px-4 rounded-xl bg-blue-900 text-white font-semibold text-xs hover:bg-blue-800"
            >
              View Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
