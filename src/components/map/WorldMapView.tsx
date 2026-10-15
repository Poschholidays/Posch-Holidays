import React, { useState } from 'react';
import { PlayerState, Destination } from '../../types/game';
import { DESTINATIONS_DATA } from '../../data/destinations';
import { soundManager } from '../../services/sound';
import { Lock, CheckCircle2, ChevronRight, Play, Sparkles, MapPin, Compass, ArrowRight } from 'lucide-react';

interface Props {
  player: PlayerState;
  onLaunchGame: (destId: string, gameType: 'guess' | 'pack' | 'fly') => void;
  onPlanHoliday: (destId: string) => void;
  onViewPackage: (destId: string) => void;
}

export const WorldMapView: React.FC<Props> = ({
  player,
  onLaunchGame,
  onPlanHoliday,
  onViewPackage,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(player.unlockedDestinations[0] || 'singapore');

  const selectedDestination = DESTINATIONS_DATA.find((d) => d.id === selectedDestId) || DESTINATIONS_DATA[0];
  const isUnlocked = player.unlockedDestinations.includes(selectedDestination.id);
  const isStamped = player.stampsCollected.includes(selectedDestination.id);

  const handleSelectDest = (dest: Destination) => {
    soundManager.playClick();
    setSelectedDestId(dest.id);
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 my-2">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">World Adventure Map</h2>
          </div>
          <span className="text-xs font-semibold text-amber-300 tabular-nums">
            {player.unlockedDestinations.length} of 7 Unlocked
          </span>
        </div>
        <p className="text-xs text-blue-200">
          Tap destination waypoints below to embark on quests, collect stamps, and discover Posch Holidays luxury stays.
        </p>

        {/* Level Progression Trail Strip (Horizontal mobile scroller) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 mt-2">
          {DESTINATIONS_DATA.map((dest, idx) => {
            const unlocked = player.unlockedDestinations.includes(dest.id);
            const active = selectedDestId === dest.id;
            const stamped = player.stampsCollected.includes(dest.id);

            return (
              <button
                key={dest.id}
                onClick={() => handleSelectDest(dest)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition active:scale-95 ${
                  active
                    ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                    : unlocked
                    ? 'bg-blue-800/80 text-blue-100 hover:bg-blue-800'
                    : 'bg-blue-950/60 text-blue-400/70 border border-blue-900/60'
                }`}
              >
                <span>{dest.icon}</span>
                <span>{dest.name}</span>
                {stamped ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : !unlocked ? (
                  <Lock className="w-3 h-3 text-blue-400/60 shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Destination Feature Card with 3D Miniature Artwork */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Destination 3D Image Banner */}
        <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
          <img
            src={selectedDestination.image}
            alt={selectedDestination.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
              Level {selectedDestination.level}
            </span>
            {isStamped ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" /> Passport Stamped
              </span>
            ) : isUnlocked ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-slate-950">
                Unlocked & Ready
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Unlocks at {selectedDestination.pointsToUnlock} pts
              </span>
            )}
          </div>

          {/* Title & Tagline */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedDestination.country}</span>
            </div>
            <h3 className="text-2xl font-bold font-display leading-tight">
              {selectedDestination.name}
            </h3>
            <p className="text-xs text-slate-200 line-clamp-1">{selectedDestination.tagline}</p>
          </div>
        </div>

        {/* Content & Actions */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedDestination.description}
          </p>

          {/* Mini-Games Launch Roster for this Destination */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Destination Challenges ({isUnlocked ? 'Play to Earn Stamps' : 'Locked'}):
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={!isUnlocked}
                onClick={() => {
                  soundManager.playClick();
                  onLaunchGame(selectedDestination.id, 'guess');
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 transition text-center flex flex-col items-center justify-center disabled:opacity-40"
              >
                <span className="text-xl mb-1">🏛️</span>
                <span className="text-[11px] font-bold text-slate-900 leading-tight">Guess Trivia</span>
                <span className="text-[9px] text-amber-600 font-semibold mt-0.5">+150 PTS</span>
              </button>

              <button
                disabled={!isUnlocked}
                onClick={() => {
                  soundManager.playClick();
                  onLaunchGame(selectedDestination.id, 'pack');
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50 hover:border-amber-300 transition text-center flex flex-col items-center justify-center disabled:opacity-40"
              >
                <span className="text-xl mb-1">🧳</span>
                <span className="text-[11px] font-bold text-slate-900 leading-tight">Pack Suitcase</span>
                <span className="text-[9px] text-amber-600 font-semibold mt-0.5">+150 PTS</span>
              </button>

              <button
                disabled={!isUnlocked}
                onClick={() => {
                  soundManager.playClick();
                  onLaunchGame(selectedDestination.id, 'fly');
                }}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-sky-50 hover:border-sky-300 transition text-center flex flex-col items-center justify-center disabled:opacity-40"
              >
                <span className="text-xl mb-1">✈️</span>
                <span className="text-[11px] font-bold text-slate-900 leading-tight">Fly with Muse</span>
                <span className="text-[9px] text-amber-600 font-semibold mt-0.5">+100+ PTS</span>
              </button>
            </div>
          </div>

          {/* Posch Verified Holiday Package Teaser */}
          <div className="bg-gradient-to-r from-blue-900/5 via-blue-900/10 to-amber-500/10 border border-blue-900/15 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                Verified Posch Holiday Package
              </span>
              <h5 className="text-xs font-bold text-slate-900 truncate">
                {selectedDestination.holidayPackage.title}
              </h5>
              <p className="text-[11px] text-slate-500">
                {selectedDestination.holidayPackage.duration} · {selectedDestination.holidayPackage.resortType.split('&')[0]}
              </p>
            </div>
            <button
              onClick={() => onViewPackage(selectedDestination.id)}
              className="px-3 py-2 rounded-xl bg-blue-900 text-white text-xs font-semibold shrink-0 hover:bg-blue-800 active:scale-95 transition"
            >
              Details
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onPlanHoliday(selectedDestination.id)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan Your Holiday to {selectedDestination.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
