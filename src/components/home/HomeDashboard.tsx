import React from 'react';
import { PlayerState } from '../../types/game';
import { DESTINATIONS_DATA } from '../../data/destinations';
import { soundManager } from '../../services/sound';
import { Sparkles, Trophy, Luggage, Compass, Plane, CheckCircle2, ArrowRight, Star, Calendar } from 'lucide-react';

interface Props {
  player: PlayerState;
  onNavigateScreen: (screen: any) => void;
  onLaunchGame: (destId: string, gameType: 'guess' | 'pack' | 'fly') => void;
  onPlanHoliday: (destId?: string) => void;
}

export const HomeDashboard: React.FC<Props> = ({
  player,
  onNavigateScreen,
  onLaunchGame,
  onPlanHoliday,
}) => {
  const nextDestination = DESTINATIONS_DATA.find(
    (d) => !player.unlockedDestinations.includes(d.id)
  ) || DESTINATIONS_DATA[0];

  const currentDestination = DESTINATIONS_DATA.find(
    (d) => d.id === player.unlockedDestinations[player.unlockedDestinations.length - 1]
  ) || DESTINATIONS_DATA[0];

  const handleDailyPlay = () => {
    soundManager.playSuccessChime();
    onLaunchGame(player.dailyChallenge.targetDestination, player.dailyChallenge.gameType);
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 my-2">
      {/* Top Welcome Card with Muse Avatar & Points Balance */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 p-0.5 shadow-md overflow-hidden shrink-0">
              <img
                src="/src/assets/images/posch_muse_mascot_1792047114029.jpg"
                alt="Muse Mascot"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                Posch Explorer
              </span>
              <h2 className="text-lg font-bold font-display leading-tight">{player.name}</h2>
              <span className="text-xs text-blue-200">
                {player.stampsCollected.length >= 7 ? '👑 Posch Elite Voyager' : '✈️ Flying with Muse'}
              </span>
            </div>
          </div>

          {/* Points Counter Badge */}
          <div className="bg-blue-900/80 border border-amber-400/30 rounded-2xl px-3.5 py-2 text-right">
            <span className="text-[10px] text-blue-200 uppercase font-semibold block">Quest Points</span>
            <div className="flex items-center justify-end gap-1 text-amber-400 font-extrabold text-base tabular-nums">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{player.points}</span>
            </div>
          </div>
        </div>

        {/* Passport Progress Bar */}
        <div className="bg-blue-900/60 rounded-2xl p-3 border border-blue-800/80 space-y-2 relative z-10">
          <div className="flex justify-between text-xs">
            <span className="text-blue-200 font-medium">Passport Completion</span>
            <span className="font-bold text-amber-300 tabular-nums">
              {player.stampsCollected.length} / {DESTINATIONS_DATA.length} Stamps
            </span>
          </div>
          <div className="w-full h-2 bg-blue-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-500"
              style={{ width: `${(player.stampsCollected.length / DESTINATIONS_DATA.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Plan Your Holiday Sticky / High-Intent Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-2xl p-4 text-slate-950 shadow-md flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for a Real Vacation?</span>
          </div>
          <h4 className="text-sm font-bold text-slate-950 truncate">
            Unlock Exclusive Posch Resort Privileges
          </h4>
          <p className="text-[11px] text-amber-900">
            Handcrafted luxury itineraries across Singapore, Maldives, Bali & Dubai.
          </p>
        </div>
        <button
          onClick={() => {
            soundManager.playSuccessChime();
            onPlanHoliday();
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-950 text-amber-300 font-bold text-xs shrink-0 hover:bg-slate-900 active:scale-95 shadow-sm transition"
        >
          Plan Holiday
        </button>
      </div>

      {/* Daily Challenge Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                Daily Quest
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {player.dailyChallenge.task}
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            +{player.dailyChallenge.points} PTS
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Complete today's challenge to keep your streak alive and earn instant points toward unlocking new travel horizons!
        </p>

        <button
          onClick={handleDailyPlay}
          className="w-full py-3 px-4 rounded-xl bg-blue-900 text-white font-bold text-xs shadow-md hover:bg-blue-800 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <span>Play Daily Challenge</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mini-Games Quick Access Grid */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-bold text-slate-900">Arcade Mini-Games</h3>
          <button
            onClick={() => onNavigateScreen('games')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-700"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              onLaunchGame('singapore', 'guess');
            }}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-blue-400 hover:shadow-md transition active:scale-95 group"
          >
            <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🏛️</div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Guess Dest</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Trivia Quiz</div>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onLaunchGame('maldives', 'pack');
            }}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-amber-400 hover:shadow-md transition active:scale-95 group"
          >
            <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🧳</div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Pack Suitcase</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Tactical Bag</div>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onLaunchGame('dubai', 'fly');
            }}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-sky-400 hover:shadow-md transition active:scale-95 group"
          >
            <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">✈️</div>
            <div className="text-xs font-bold text-slate-900 leading-tight">Fly with Muse</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Flight Arcade</div>
          </button>
        </div>
      </div>

      {/* Featured Destination Spotlights */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-sm font-bold text-slate-900">Holiday Destinations</h3>
          <button
            onClick={() => onNavigateScreen('map')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-700"
          >
            World Map →
          </button>
        </div>

        <div className="space-y-2.5">
          {DESTINATIONS_DATA.slice(0, 3).map((dest) => {
            const isUnlocked = player.unlockedDestinations.includes(dest.id);
            const isStamped = player.stampsCollected.includes(dest.id);

            return (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center justify-between gap-3 shadow-sm hover:shadow transition"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isStamped && (
                    <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{dest.name}</span>
                    <span className="text-[10px] text-slate-500">· Level {dest.level}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{dest.tagline}</p>
                  <span className="text-[10px] text-blue-900 font-semibold block mt-0.5">
                    {dest.holidayPackage.duration}
                  </span>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onLaunchGame(dest.id, 'guess');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 text-xs font-bold hover:bg-blue-100 shrink-0"
                >
                  Play Level
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
