import React, { useState } from 'react';
import { PlayerState } from '../../types/game';
import { DESTINATIONS_DATA } from '../../data/destinations';
import { soundManager } from '../../services/sound';
import { Play, Sparkles, ChevronRight, Award, Trophy, Compass } from 'lucide-react';

interface Props {
  player: PlayerState;
  onPlayGame: (destId: string, gameType: 'guess' | 'pack' | 'fly') => void;
}

export const GameSelectionView: React.FC<Props> = ({ player, onPlayGame }) => {
  const [activeGameType, setActiveGameType] = useState<'guess' | 'pack' | 'fly'>('guess');
  const [selectedDestId, setSelectedDestId] = useState<string>(player.unlockedDestinations[0] || 'singapore');

  const selectedDestination = DESTINATIONS_DATA.find((d) => d.id === selectedDestId) || DESTINATIONS_DATA[0];

  const handleStart = () => {
    soundManager.playSuccessChime();
    onPlayGame(selectedDestId, activeGameType);
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 my-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 rounded-3xl p-5 text-white shadow-xl">
        <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase block mb-1">
          Posch Arcade Terminal
        </span>
        <h2 className="text-xl font-bold font-display">Select Your Mini-Game</h2>
        <p className="text-xs text-blue-200 mt-1">
          Sharpen your travel wits, collect official passport stamps, and earn virtual points toward Posch holiday perks.
        </p>

        {/* 3 Game Selector Cards */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveGameType('guess');
            }}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
              activeGameType === 'guess'
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md'
                : 'bg-blue-900/60 text-blue-100 border-blue-800/80 hover:bg-blue-900'
            }`}
          >
            <span className="text-2xl mb-1">🏛️</span>
            <span className="text-xs font-bold leading-tight">Guess Destination</span>
            <span className="text-[9px] opacity-80 mt-0.5">Trivia & Photo</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveGameType('pack');
            }}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
              activeGameType === 'pack'
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md'
                : 'bg-blue-900/60 text-blue-100 border-blue-800/80 hover:bg-blue-900'
            }`}
          >
            <span className="text-2xl mb-1">🧳</span>
            <span className="text-xs font-bold leading-tight">Pack Suitcase</span>
            <span className="text-[9px] opacity-80 mt-0.5">Tactical Gear</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveGameType('fly');
            }}
            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
              activeGameType === 'fly'
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md'
                : 'bg-blue-900/60 text-blue-100 border-blue-800/80 hover:bg-blue-900'
            }`}
          >
            <span className="text-2xl mb-1">✈️</span>
            <span className="text-xs font-bold leading-tight">Fly with Muse</span>
            <span className="text-[9px] opacity-80 mt-0.5">Arcade Flight</span>
          </button>
        </div>
      </div>

      {/* Selected Game Preview & Destination Picker */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 space-y-4">
        {/* Game Details Summary */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Active Challenge
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {activeGameType === 'guess' && 'Game A — Guess the Destination'}
              {activeGameType === 'pack' && 'Game B — Pack My Suitcase'}
              {activeGameType === 'fly' && 'Game C — Fly with Muse'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeGameType === 'guess' &&
                'Identify landmarks, culture, and facts across 4 answer choices with instant explanations.'}
              {activeGameType === 'pack' &&
                'Organize the perfect luggage items tailored for tropical, mountain, or desert escapes.'}
              {activeGameType === 'fly' &&
                'Steer Muse through clouds, collect golden stars, and navigate safely to the checkpoint.'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 text-xl">
            {activeGameType === 'guess' ? '🏛️' : activeGameType === 'pack' ? '🧳' : '✈️'}
          </div>
        </div>

        {/* Destination Chooser */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Select Destination Level:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DESTINATIONS_DATA.map((dest) => {
              const isUnlocked = player.unlockedDestinations.includes(dest.id);
              const isSelected = selectedDestId === dest.id;

              return (
                <button
                  key={dest.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedDestId(dest.id);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition active:scale-[0.98] ${
                    isSelected
                      ? 'border-blue-700 bg-blue-50/90 text-blue-900 font-bold shadow-sm'
                      : isUnlocked
                      ? 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                      : 'border-slate-100 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xl">{dest.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs leading-tight truncate">{dest.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {isUnlocked ? `Level ${dest.level}` : 'Locked'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rewards Preview */}
        <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Challenge Potential:</span>
          </div>
          <span className="font-bold text-amber-700 tabular-nums">+150 PTS & Passport Stamp</span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current text-amber-400" />
          <span>Launch {selectedDestination.name} Challenge</span>
        </button>
      </div>
    </div>
  );
};
