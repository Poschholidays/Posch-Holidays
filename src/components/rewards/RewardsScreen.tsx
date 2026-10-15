import React from 'react';
import { PlayerState } from '../../types/game';
import { BADGES_DATA } from '../../data/destinations';
import { soundManager } from '../../services/sound';
import { Award, Star, CheckCircle2, Lock, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

interface Props {
  player: PlayerState;
  onPlanHoliday: () => void;
}

export const RewardsScreen: React.FC<Props> = ({ player, onPlanHoliday }) => {
  const currentTier = player.points >= 700
    ? { title: 'Platinum Globetrotter', perk: 'VIP Room Upgrade on Select Posch Resorts', next: null, min: 700 }
    : player.points >= 250
    ? { title: 'Gold Voyager', perk: 'Complimentary Sunset Cruise / High Tea Voucher', next: 'Platinum Globetrotter (700 PTS)', min: 250 }
    : { title: 'Silver Explorer', perk: 'Welcome Travel Kit & Resort Airport Meet-and-Greet', next: 'Gold Voyager (250 PTS)', min: 0 };

  return (
    <div className="max-w-lg mx-auto space-y-4 my-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase block">
              Explorer Rewards
            </span>
            <h2 className="text-xl font-bold font-display">Tiers & Achievements</h2>
          </div>
          <div className="bg-amber-400 text-slate-950 px-3 py-1.5 rounded-2xl font-extrabold text-sm flex items-center gap-1 shadow">
            <Star className="w-4 h-4 fill-slate-950" />
            <span className="tabular-nums">{player.points} PTS</span>
          </div>
        </div>

        {/* Current Tier Status */}
        <div className="bg-blue-900/60 border border-blue-800 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-200">Current Club Level:</span>
            <span className="font-extrabold text-amber-300">{currentTier.title}</span>
          </div>
          <div className="text-[11px] text-blue-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Resort Concierge Privilege: {currentTier.perk}</span>
          </div>
          {currentTier.next && (
            <div className="text-[10px] text-blue-300 pt-1 border-t border-blue-800/80">
              Next Goal: {currentTier.next}
            </div>
          )}
        </div>
      </div>

      {/* Clear Compliance & Transparency Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-slate-600">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <strong className="text-slate-800 block mb-0.5">Virtual Points & Rewards Policy:</strong>
          Points, badges, and passport stamps are virtual game progression metrics. They hold no cash surrender value and are not redeemable for currency. Privilege tier perks apply as complimentary value-adds upon booking verified Posch Holidays vacation packages.
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Achievement Badges ({player.unlockedBadges.length} / {BADGES_DATA.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = player.unlockedBadges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border transition ${
                  isUnlocked
                    ? 'border-amber-300 bg-amber-50/60 shadow-sm'
                    : 'border-slate-200 bg-slate-50/70 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">
                  {badge.title}
                </h4>
                <p className="text-[10px] text-slate-500 leading-tight">{badge.description}</p>
                <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block mt-2">
                  {isUnlocked ? 'Unlocked' : 'In Progress'}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA to Plan Holiday */}
        <button
          onClick={() => {
            soundManager.playSuccessChime();
            onPlanHoliday();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Apply Privileges — Plan Your Holiday</span>
        </button>
      </div>
    </div>
  );
};
