import React from 'react';
import { GameScreen } from '../../types/game';
import { soundManager } from '../../services/sound';
import { Sparkles, User, Volume2, VolumeX } from 'lucide-react';

interface Props {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  onOpenProfile: () => void;
  onPlanHoliday: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  points: number;
}

export const TopBar: React.FC<Props> = ({
  currentScreen,
  onNavigate,
  onOpenProfile,
  onPlanHoliday,
  soundEnabled,
  onToggleSound,
  points,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-14">
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('home');
          }}
          className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow">
            P
          </span>
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-white font-display group-hover:text-amber-300 transition-colors">
            POSCH HOLIDAY QUEST
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links (desktop/tablet) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('home');
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentScreen === 'home' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('map');
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentScreen === 'map' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            World Map
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('games');
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentScreen === 'games' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Mini-Games
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('passport');
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentScreen === 'passport' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Passport
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('holidays');
            }}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentScreen === 'holidays' ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Holiday Packages
          </button>
        </nav>

        {/* Zone 3: 1 primary action + compact status icons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Audio Mute/Unmute */}
          <button
            onClick={onToggleSound}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Profile Modal trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProfile();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition"
            title="Profile & Settings"
            aria-label="Open profile"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              soundManager.playSuccessChime();
              onPlanHoliday();
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg hover:brightness-105 active:scale-95 transition whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan Holiday</span>
          </button>
        </div>
      </div>
    </header>
  );
};
