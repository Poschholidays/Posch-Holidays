import React from 'react';
import { GameScreen } from '../../types/game';
import { soundManager } from '../../services/sound';
import { Home, Compass, Gamepad2, BookMarked, Palmtree, Trophy } from 'lucide-react';

interface Props {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  unreadStamps?: boolean;
}

export const BottomNav: React.FC<Props> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home' as GameScreen, label: 'Home', icon: Home },
    { id: 'map' as GameScreen, label: 'Map', icon: Compass },
    { id: 'games' as GameScreen, label: 'Arcade', icon: Gamepad2 },
    { id: 'passport' as GameScreen, label: 'Passport', icon: BookMarked },
    { id: 'holidays' as GameScreen, label: 'Holidays', icon: Palmtree },
    { id: 'leaderboard' as GameScreen, label: 'Ranks', icon: Trophy },
  ];

  const handleTab = (screen: GameScreen) => {
    soundManager.playClick();
    onNavigate(screen);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'games' && ['game_guess', 'game_pack', 'game_fly'].includes(currentScreen));

          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-all ${
                isActive ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
