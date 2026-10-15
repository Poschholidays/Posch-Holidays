export type GameScreen = 
  | 'splash'
  | 'welcome'
  | 'home'
  | 'map'
  | 'games'
  | 'game_guess'
  | 'game_pack'
  | 'game_fly'
  | 'passport'
  | 'rewards'
  | 'leaderboard'
  | 'holidays'
  | 'enquiry'
  | 'profile';

export interface DestinationStamp {
  id: string;
  destinationId: string;
  name: string;
  symbol: string;
  country: string;
  color: string;
  earnedDate?: string;
  inkQuote: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  hint: string;
  image?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface SuitcaseItem {
  id: string;
  name: string;
  category: 'clothing' | 'gear' | 'cosmetic' | 'documents' | 'wrong';
  icon: string;
  isCorrect: boolean;
  reason: string;
}

export interface HolidayPackage {
  id: string;
  destinationId: string;
  title: string;
  duration: string;
  resortType: string;
  highlights: string[];
  inclusions: string[];
  bestSeason: string;
  curatorNote: string;
  featuredImage: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  level: number;
  pointsToUnlock: number;
  image: string;
  bgGradient: string;
  icon: string;
  stamp: DestinationStamp;
  quizQuestions: QuizQuestion[];
  suitcaseTheme: {
    themeName: string;
    climate: string;
    description: string;
    targetCount: number;
    items: SuitcaseItem[];
  };
  holidayPackage: HolidayPackage;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'journey' | 'games' | 'mastery';
  condition: (player: PlayerState) => boolean;
}

export interface EnquirySubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  travelMonth: string;
  guests: number;
  specialRequests: string;
  consentAgreed: boolean;
  createdAt: string;
  status: 'Received' | 'Assigned to Specialist';
}

export interface PlayerState {
  name: string;
  avatar: string;
  points: number;
  unlockedDestinations: string[];
  stampsCollected: string[];
  completedGames: {
    guess: string[]; // destinationIds
    pack: string[];  // destinationIds
    flyCount: number;
    highestFlyScore: number;
  };
  dailyChallenge: {
    date: string;
    task: string;
    targetDestination: string;
    gameType: 'guess' | 'pack' | 'fly';
    points: number;
    isCompleted: boolean;
  };
  unlockedBadges: string[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  enquiries: EnquirySubmission[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  stamps: number;
  points: number;
  badge: string;
  isUser?: boolean;
}
