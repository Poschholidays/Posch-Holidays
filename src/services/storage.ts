import { PlayerState, LeaderboardEntry, EnquirySubmission } from '../types/game';
import { DESTINATIONS_DATA } from '../data/destinations';

const STORAGE_KEY = 'posch_holiday_quest_player_state_v1';

export const INITIAL_PLAYER_STATE: PlayerState = {
  name: 'Adventurer',
  avatar: 'aviator',
  points: 120, // Starting bonus points from welcome
  unlockedDestinations: ['singapore'], // First destination is unlocked by default
  stampsCollected: ['singapore'], // Starts with initial welcoming stamp
  completedGames: {
    guess: [],
    pack: [],
    flyCount: 0,
    highestFlyScore: 0,
  },
  dailyChallenge: {
    date: new Date().toISOString().split('T')[0],
    task: 'Pack for Tropical Singapore',
    targetDestination: 'singapore',
    gameType: 'pack',
    points: 75,
    isCompleted: false,
  },
  unlockedBadges: ['badge_first_flight'],
  soundEnabled: true,
  hapticsEnabled: true,
  enquiries: [],
};

export const loadPlayerState = (): PlayerState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PLAYER_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PLAYER_STATE,
      ...parsed,
      completedGames: {
        ...INITIAL_PLAYER_STATE.completedGames,
        ...(parsed.completedGames || {}),
      },
      dailyChallenge: {
        ...INITIAL_PLAYER_STATE.dailyChallenge,
        ...(parsed.dailyChallenge || {}),
      },
    };
  } catch (e) {
    console.error('Error loading game state:', e);
    return INITIAL_PLAYER_STATE;
  }
};

export const savePlayerState = (state: PlayerState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving game state:', e);
  }
};

export const resetGameProgress = (): PlayerState => {
  localStorage.removeItem(STORAGE_KEY);
  return { ...INITIAL_PLAYER_STATE };
};

// Check if new destinations can be unlocked based on points
export const checkUnlockables = (currentState: PlayerState): { state: PlayerState; newUnlocks: string[] } => {
  const newUnlocks: string[] = [];
  const currentUnlocked = new Set(currentState.unlockedDestinations);

  DESTINATIONS_DATA.forEach((dest) => {
    if (!currentUnlocked.has(dest.id) && currentState.points >= dest.pointsToUnlock) {
      currentUnlocked.add(dest.id);
      newUnlocks.push(dest.id);
    }
  });

  if (newUnlocks.length > 0) {
    const updated = {
      ...currentState,
      unlockedDestinations: Array.from(currentUnlocked),
    };
    savePlayerState(updated);
    return { state: updated, newUnlocks };
  }

  return { state: currentState, newUnlocks: [] };
};

// Leaderboard demo data combined with user score
export const getLeaderboardData = (player: PlayerState, period: 'daily' | 'weekly'): LeaderboardEntry[] => {
  const demoRoster = [
    { name: 'Kavita Sundaram', avatar: 'compass', stamps: 7, points: period === 'daily' ? 420 : 1850, badge: 'Posch Elite' },
    { name: 'David Chen', avatar: 'camera', stamps: 6, points: period === 'daily' ? 380 : 1620, badge: 'Globe Trotter' },
    { name: 'Aarav Mehta', avatar: 'aviator', stamps: 5, points: period === 'daily' ? 310 : 1340, badge: 'Sky Ace' },
    { name: 'Sophie Laurent', avatar: 'palm', stamps: 5, points: period === 'daily' ? 260 : 1190, badge: 'Master Packer' },
    { name: 'Rohan Pillai', avatar: 'sunglasses', stamps: 4, points: period === 'daily' ? 190 : 890, badge: 'Wanderlust' },
    { name: 'Elena Rostova', avatar: 'yacht', stamps: 3, points: period === 'daily' ? 140 : 640, badge: 'Explorer' },
    { name: 'Arjun Verma', avatar: 'ticket', stamps: 2, points: period === 'daily' ? 90 : 410, badge: 'Novice' },
  ];

  // Insert user
  const userEntry: LeaderboardEntry = {
    rank: 1,
    name: `${player.name} (You)`,
    avatar: player.avatar,
    stamps: player.stampsCollected.length,
    points: player.points,
    badge: player.stampsCollected.length >= 7 ? 'Posch Elite' : player.stampsCollected.length >= 3 ? 'Globe Trotter' : 'Explorer',
    isUser: true,
  };

  const combined = [...demoRoster, userEntry].sort((a, b) => b.points - a.points);
  return combined.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

export const submitEnquiry = (enquiry: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>, currentState: PlayerState): { enquiry: EnquirySubmission; updatedState: PlayerState } => {
  const newSubmission: EnquirySubmission = {
    ...enquiry,
    id: `POSCH-REQ-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    status: 'Received',
  };

  const updatedState: PlayerState = {
    ...currentState,
    enquiries: [newSubmission, ...currentState.enquiries],
    points: currentState.points + 100, // Reward player for genuine holiday enquiry!
  };

  savePlayerState(updatedState);
  return { enquiry: newSubmission, updatedState };
};
