import React, { useState, useEffect } from 'react';
import { GameScreen, PlayerState, Destination } from './types/game';
import { DESTINATIONS_DATA, BADGES_DATA } from './data/destinations';
import { loadPlayerState, savePlayerState, checkUnlockables } from './services/storage';
import { soundManager } from './services/sound';

import { SplashScreen } from './components/common/SplashScreen';
import { WelcomeModal } from './components/common/WelcomeModal';
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { HomeDashboard } from './components/home/HomeDashboard';
import { WorldMapView } from './components/map/WorldMapView';
import { GameSelectionView } from './components/games/GameSelectionView';
import { GuessDestinationGame } from './components/games/GuessDestinationGame';
import { PackSuitcaseGame } from './components/games/PackSuitcaseGame';
import { FlyWithMuseGame } from './components/games/FlyWithMuseGame';
import { DigitalPassport } from './components/passport/DigitalPassport';
import { RewardsScreen } from './components/rewards/RewardsScreen';
import { LeaderboardScreen } from './components/leaderboard/LeaderboardScreen';
import { HolidayDiscoveryView } from './components/holidays/HolidayDiscoveryView';
import { HolidayEnquiryModal } from './components/holidays/HolidayEnquiryModal';
import { ProfileSettingsModal } from './components/profile/ProfileSettingsModal';

import { Sparkles, Trophy, Award, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('splash');
  const [player, setPlayer] = useState<PlayerState>(loadPlayerState);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(() => {
    return localStorage.getItem('posch_welcome_viewed') === 'true';
  });

  // Active game context
  const [activeDestinationId, setActiveDestinationId] = useState<string>('singapore');
  
  // Modals
  const [showEnquiryModal, setShowEnquiryModal] = useState<boolean>(false);
  const [enquiryDestinationId, setEnquiryDestinationId] = useState<string | undefined>(undefined);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  
  // Toast notification for unlock / badge
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync sound manager with initial player state
  useEffect(() => {
    soundManager.setEnabled(player.soundEnabled);
  }, [player.soundEnabled]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleUpdatePlayer = (updated: PlayerState) => {
    setPlayer(updated);
    savePlayerState(updated);
  };

  const handleSplashEnter = () => {
    if (!hasSeenWelcome) {
      setScreen('welcome');
    } else {
      setScreen('home');
    }
  };

  const handleWelcomeStart = () => {
    localStorage.setItem('posch_welcome_viewed', 'true');
    setHasSeenWelcome(true);
    setScreen('home');
  };

  // Launch a game
  const handleLaunchGame = (destId: string, gameType: 'guess' | 'pack' | 'fly') => {
    setActiveDestinationId(destId);
    if (gameType === 'guess') setScreen('game_guess');
    else if (gameType === 'pack') setScreen('game_pack');
    else if (gameType === 'fly') setScreen('game_fly');
  };

  // Mini-game completion handlers
  const handleGuessFinished = (scoreEarned: number, stampAwarded: boolean) => {
    let updatedStamps = [...player.stampsCollected];
    if (stampAwarded && !updatedStamps.includes(activeDestinationId)) {
      updatedStamps.push(activeDestinationId);
      showToast(`🏆 Official ${activeDestinationId.toUpperCase()} Visa Stamp Awarded!`);
    }

    const updatedState: PlayerState = {
      ...player,
      points: player.points + scoreEarned,
      stampsCollected: updatedStamps,
      completedGames: {
        ...player.completedGames,
        guess: Array.from(new Set([...player.completedGames.guess, activeDestinationId])),
      },
    };

    // Check unlocks & badges
    evaluateProgression(updatedState);
  };

  const handlePackFinished = (scoreEarned: number, allCorrect: boolean) => {
    let updatedBadges = [...player.unlockedBadges];
    if (allCorrect && !updatedBadges.includes('badge_master_packer')) {
      updatedBadges.push('badge_master_packer');
      showToast('🌟 Unlocked Badge: Master Packer!');
    }

    let updatedStamps = [...player.stampsCollected];
    if (allCorrect && !updatedStamps.includes(activeDestinationId)) {
      updatedStamps.push(activeDestinationId);
      showToast(`🏆 Official ${activeDestinationId.toUpperCase()} Visa Stamp Awarded!`);
    }

    const updatedState: PlayerState = {
      ...player,
      points: player.points + scoreEarned,
      stampsCollected: updatedStamps,
      unlockedBadges: updatedBadges,
      completedGames: {
        ...player.completedGames,
        pack: Array.from(new Set([...player.completedGames.pack, activeDestinationId])),
      },
    };

    evaluateProgression(updatedState);
  };

  const handleFlyFinished = (scoreEarned: number, reachedCheckpoint: boolean) => {
    let updatedBadges = [...player.unlockedBadges];
    if (scoreEarned >= 100 && !updatedBadges.includes('badge_sky_ace')) {
      updatedBadges.push('badge_sky_ace');
      showToast('✈️ Unlocked Badge: Sky Ace!');
    }

    const updatedState: PlayerState = {
      ...player,
      points: player.points + scoreEarned,
      unlockedBadges: updatedBadges,
      completedGames: {
        ...player.completedGames,
        flyCount: player.completedGames.flyCount + 1,
        highestFlyScore: Math.max(player.completedGames.highestFlyScore, scoreEarned),
      },
    };

    evaluateProgression(updatedState);
  };

  // Evaluate unlock conditions and badges
  const evaluateProgression = (baseState: PlayerState) => {
    const { state: unlockedState, newUnlocks } = checkUnlockables(baseState);

    let finalBadges = [...unlockedState.unlockedBadges];
    if (unlockedState.stampsCollected.length >= 3 && !finalBadges.includes('badge_globe_trotter')) {
      finalBadges.push('badge_globe_trotter');
      showToast('🛂 Unlocked Badge: Globe Trotter!');
    }
    if (unlockedState.points >= 500 && !finalBadges.includes('badge_trivia_virtuoso')) {
      finalBadges.push('badge_trivia_virtuoso');
      showToast('🏆 Unlocked Badge: Wanderlust Virtuoso!');
    }
    if (unlockedState.stampsCollected.length >= 7 && !finalBadges.includes('badge_posch_elite')) {
      finalBadges.push('badge_posch_elite');
      showToast('👑 Unlocked Badge: Posch Elite Explorer!');
    }

    const finalState = {
      ...unlockedState,
      unlockedBadges: finalBadges,
    };

    if (newUnlocks.length > 0) {
      showToast(`🎉 New Destination Level Unlocked: ${newUnlocks.join(', ').toUpperCase()}!`);
    }

    handleUpdatePlayer(finalState);
  };

  const handlePlanHoliday = (destId?: string) => {
    setEnquiryDestinationId(destId);
    setShowEnquiryModal(true);
  };

  const activeDestObj = DESTINATIONS_DATA.find((d) => d.id === activeDestinationId) || DESTINATIONS_DATA[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-2 border border-amber-300 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 fill-slate-950 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-950/70 hover:text-slate-950 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Splash Screen */}
      {screen === 'splash' && <SplashScreen onEnter={handleSplashEnter} />}

      {/* Welcome Modal */}
      {screen === 'welcome' && <WelcomeModal onStart={handleWelcomeStart} />}

      {/* Main Game Interface */}
      {screen !== 'splash' && screen !== 'welcome' && (
        <div className="flex-1 flex flex-col pb-20 md:pb-6 bg-slate-950/20">
          {/* Top Bar Contract navigation */}
          <TopBar
            currentScreen={screen}
            onNavigate={(newScreen) => setScreen(newScreen)}
            onOpenProfile={() => setShowProfileModal(true)}
            onPlanHoliday={() => handlePlanHoliday()}
            soundEnabled={player.soundEnabled}
            onToggleSound={() => {
              const nextVal = !player.soundEnabled;
              soundManager.setEnabled(nextVal);
              handleUpdatePlayer({ ...player, soundEnabled: nextVal });
            }}
            points={player.points}
          />

          {/* Main App Content Viewport */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4">
            {screen === 'home' && (
              <HomeDashboard
                player={player}
                onNavigateScreen={(s) => setScreen(s)}
                onLaunchGame={handleLaunchGame}
                onPlanHoliday={handlePlanHoliday}
              />
            )}

            {screen === 'map' && (
              <WorldMapView
                player={player}
                onLaunchGame={handleLaunchGame}
                onPlanHoliday={handlePlanHoliday}
                onViewPackage={(destId) => {
                  setScreen('holidays');
                }}
              />
            )}

            {screen === 'games' && (
              <GameSelectionView player={player} onPlayGame={handleLaunchGame} />
            )}

            {screen === 'game_guess' && (
              <GuessDestinationGame
                destination={activeDestObj}
                onFinish={handleGuessFinished}
                onBack={() => setScreen('games')}
                onPlanHoliday={handlePlanHoliday}
              />
            )}

            {screen === 'game_pack' && (
              <PackSuitcaseGame
                destination={activeDestObj}
                onFinish={handlePackFinished}
                onBack={() => setScreen('games')}
                onPlanHoliday={handlePlanHoliday}
              />
            )}

            {screen === 'game_fly' && (
              <FlyWithMuseGame
                destination={activeDestObj}
                onFinish={handleFlyFinished}
                onBack={() => setScreen('games')}
                onPlanHoliday={handlePlanHoliday}
              />
            )}

            {screen === 'passport' && (
              <DigitalPassport
                player={player}
                onSelectDestination={(destId) => {
                  setActiveDestinationId(destId);
                  setScreen('map');
                }}
                onPlanHoliday={handlePlanHoliday}
              />
            )}

            {screen === 'rewards' && (
              <RewardsScreen
                player={player}
                onPlanHoliday={() => handlePlanHoliday()}
              />
            )}

            {screen === 'leaderboard' && (
              <LeaderboardScreen player={player} />
            )}

            {screen === 'holidays' && (
              <HolidayDiscoveryView onPlanHoliday={handlePlanHoliday} />
            )}
          </main>

          {/* Mobile Bottom Tab Navigation Bar */}
          <BottomNav currentScreen={screen} onNavigate={(s) => setScreen(s)} />
        </div>
      )}

      {/* Holiday Enquiry Modal */}
      {showEnquiryModal && (
        <HolidayEnquiryModal
          initialDestinationId={enquiryDestinationId}
          player={player}
          onClose={() => setShowEnquiryModal(false)}
          onEnquirySubmitted={(updatedPlayer) => {
            handleUpdatePlayer(updatedPlayer);
            showToast('🎉 Holiday enquiry sent! +100 Quest Points credited.');
          }}
        />
      )}

      {/* Profile & Settings Modal */}
      {showProfileModal && (
        <ProfileSettingsModal
          player={player}
          onUpdatePlayer={handleUpdatePlayer}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}
