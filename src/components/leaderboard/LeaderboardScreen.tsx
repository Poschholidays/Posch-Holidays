import React, { useState } from 'react';
import { PlayerState } from '../../types/game';
import { getLeaderboardData } from '../../services/storage';
import { soundManager } from '../../services/sound';
import { Trophy, Star, Shield, Info, Medal } from 'lucide-react';

interface Props {
  player: PlayerState;
}

export const LeaderboardScreen: React.FC<Props> = ({ player }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');

  const entries = getLeaderboardData(player, period);

  return (
    <div className="max-w-lg mx-auto space-y-4 my-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase block">
              Global Explorer Standings
            </span>
            <h2 className="text-xl font-bold font-display">Quest Leaderboard</h2>
          </div>
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>
        <p className="text-xs text-blue-200">
          Rankings are updated based on completed trivia quizzes, suitcase challenges, and flight checkpoints.
        </p>

        {/* Period Switcher Tabs */}
        <div className="flex bg-slate-900/70 p-1 rounded-xl mt-4 border border-blue-900/60">
          <button
            onClick={() => {
              soundManager.playClick();
              setPeriod('daily');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              period === 'daily' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            Today's Explorers
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setPeriod('weekly');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              period === 'weekly' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-blue-200 hover:text-white'
            }`}
          >
            Weekly Grand Tour
          </button>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 flex items-start gap-2.5 text-blue-900 text-xs">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-tight">
          <strong className="block mb-0.5 text-blue-950">Community Standings Notice:</strong>
          Displaying preview community rankings. Your real device score is dynamically calculated and positioned. Real-time multiplayer synchronization activates with enterprise server connection.
        </div>
      </div>

      {/* Leaderboard Table / Card List */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {entries.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const medalColor =
              entry.rank === 1
                ? 'text-amber-500 bg-amber-50'
                : entry.rank === 2
                ? 'text-slate-400 bg-slate-100'
                : entry.rank === 3
                ? 'text-amber-700 bg-amber-100/60'
                : 'text-slate-500 bg-slate-50';

            return (
              <div
                key={entry.name}
                className={`p-3.5 flex items-center justify-between gap-3 transition ${
                  entry.isUser
                    ? 'bg-amber-50/70 border-l-4 border-amber-500 font-semibold'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Rank & Avatar */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${medalColor}`}
                  >
                    {isTop3 ? (
                      <Medal className="w-4 h-4" />
                    ) : (
                      <span className="tabular-nums">#{entry.rank}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {entry.name}
                      </span>
                      {entry.isUser && (
                        <span className="text-[9px] bg-blue-900 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span>{entry.badge}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">
                        {entry.stamps} / 7 Stamps
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="text-xs font-bold text-amber-600 tabular-nums">
                    {entry.points} PTS
                  </div>
                  <div className="text-[10px] text-slate-400">Rank #{entry.rank}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
