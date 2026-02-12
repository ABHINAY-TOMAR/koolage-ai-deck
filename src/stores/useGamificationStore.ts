import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  target: number;
  progress: number;
  reward: number; // coins
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  type: 'chat' | 'mindmap' | 'slides' | 'page' | 'explore' | 'streak' | 'any';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  unlockedAt: string | null;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  requirement: { type: string; count: number };
}

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
}

const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Freshman', xpRequired: 0 },
  { level: 2, title: 'Sophomore', xpRequired: 100 },
  { level: 3, title: 'Junior', xpRequired: 300 },
  { level: 4, title: 'Senior', xpRequired: 600 },
  { level: 5, title: 'Scholar', xpRequired: 1000 },
  { level: 6, title: 'Expert', xpRequired: 1500 },
  { level: 7, title: 'Master', xpRequired: 2200 },
  { level: 8, title: 'Grandmaster', xpRequired: 3000 },
  { level: 9, title: 'Sage', xpRequired: 4000 },
  { level: 10, title: 'Legend', xpRequired: 5500 },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-chat', title: 'First Words', description: 'Send your first chat message', icon: '💬', unlockedAt: null, tier: 'bronze', requirement: { type: 'chats', count: 1 } },
  { id: 'chat-10', title: 'Conversationalist', description: 'Send 10 chat messages', icon: '🗣️', unlockedAt: null, tier: 'silver', requirement: { type: 'chats', count: 10 } },
  { id: 'chat-50', title: 'Chatterbox', description: 'Send 50 chat messages', icon: '📢', unlockedAt: null, tier: 'gold', requirement: { type: 'chats', count: 50 } },
  { id: 'first-map', title: 'Mind Explorer', description: 'Generate your first mind map', icon: '🧠', unlockedAt: null, tier: 'bronze', requirement: { type: 'mindmaps', count: 1 } },
  { id: 'map-5', title: 'Cartographer', description: 'Generate 5 mind maps', icon: '🗺️', unlockedAt: null, tier: 'silver', requirement: { type: 'mindmaps', count: 5 } },
  { id: 'first-deck', title: 'Presenter', description: 'Generate your first slide deck', icon: '📊', unlockedAt: null, tier: 'bronze', requirement: { type: 'slides', count: 1 } },
  { id: 'deck-5', title: 'Keynote Speaker', description: 'Generate 5 slide decks', icon: '🎤', unlockedAt: null, tier: 'silver', requirement: { type: 'slides', count: 5 } },
  { id: 'first-write', title: 'Wordsmith', description: 'Use AI writing for the first time', icon: '✍️', unlockedAt: null, tier: 'bronze', requirement: { type: 'writes', count: 1 } },
  { id: 'streak-3', title: 'On Fire', description: 'Maintain a 3-day streak', icon: '🔥', unlockedAt: null, tier: 'bronze', requirement: { type: 'streak', count: 3 } },
  { id: 'streak-7', title: 'Unstoppable', description: 'Maintain a 7-day streak', icon: '⚡', unlockedAt: null, tier: 'silver', requirement: { type: 'streak', count: 7 } },
  { id: 'streak-30', title: 'Dedicated', description: 'Maintain a 30-day streak', icon: '🏆', unlockedAt: null, tier: 'gold', requirement: { type: 'streak', count: 30 } },
  { id: 'coins-500', title: 'Wealthy', description: 'Accumulate 500 coins', icon: '💰', unlockedAt: null, tier: 'silver', requirement: { type: 'totalCoins', count: 500 } },
  { id: 'coins-2000', title: 'Tycoon', description: 'Accumulate 2000 coins', icon: '👑', unlockedAt: null, tier: 'diamond', requirement: { type: 'totalCoins', count: 2000 } },
  { id: 'level-5', title: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlockedAt: null, tier: 'silver', requirement: { type: 'level', count: 5 } },
  { id: 'level-10', title: 'Living Legend', description: 'Reach level 10', icon: '🌟', unlockedAt: null, tier: 'diamond', requirement: { type: 'level', count: 10 } },
  { id: 'buy-3', title: 'Collector', description: 'Buy 3 items from Explore', icon: '🛒', unlockedAt: null, tier: 'bronze', requirement: { type: 'purchases', count: 3 } },
];

function generateDailyQuests(): Quest[] {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  
  const allQuests: Omit<Quest, 'completed' | 'claimed' | 'progress'>[] = [
    { id: 'q-chat-3', title: 'Chat Champion', description: 'Send 3 messages in Chat', icon: '💬', target: 3, reward: 15, xpReward: 20, type: 'chat' },
    { id: 'q-chat-5', title: 'Deep Thinker', description: 'Send 5 messages in Chat', icon: '🧐', target: 5, reward: 25, xpReward: 30, type: 'chat' },
    { id: 'q-map-1', title: 'Map Maker', description: 'Generate a mind map', icon: '🧠', target: 1, reward: 20, xpReward: 25, type: 'mindmap' },
    { id: 'q-slides-1', title: 'Deck Builder', description: 'Create a slide deck', icon: '📊', target: 1, reward: 20, xpReward: 25, type: 'slides' },
    { id: 'q-write-1', title: 'Creative Writer', description: 'Use AI to write or edit text', icon: '✍️', target: 1, reward: 15, xpReward: 20, type: 'page' },
    { id: 'q-explore-1', title: 'Window Shopper', description: 'Buy something from Explore', icon: '🛍️', target: 1, reward: 10, xpReward: 15, type: 'explore' },
    { id: 'q-any-3', title: 'Busy Bee', description: 'Complete 3 AI actions (any type)', icon: '🐝', target: 3, reward: 30, xpReward: 35, type: 'any' },
    { id: 'q-streak', title: 'Keep it Burning', description: 'Log in today to maintain streak', icon: '🔥', target: 1, reward: 10, xpReward: 10, type: 'streak' },
  ];

  // Pick 4 quests deterministically based on date
  const picked: typeof allQuests = [];
  // Always include streak quest
  picked.push(allQuests[allQuests.length - 1]);
  
  const rest = allQuests.slice(0, -1);
  for (let i = 0; i < 3; i++) {
    const idx = (seed + i * 7) % rest.length;
    if (!picked.find(q => q.id === rest[idx].id)) {
      picked.push(rest[idx]);
    } else {
      picked.push(rest[(idx + 1) % rest.length]);
    }
  }

  return picked.map(q => ({ ...q, completed: false, claimed: false, progress: 0 }));
}

interface GamificationState {
  // XP & Leveling
  xp: number;
  totalCoinsEarned: number;
  
  // Quests
  dailyQuests: Quest[];
  questDate: string | null;
  
  // Achievements  
  achievements: Achievement[];
  
  // Activity counters (lifetime)
  stats: {
    chats: number;
    mindmaps: number;
    slides: number;
    writes: number;
    purchases: number;
  };
  
  // Last login for streak
  lastLoginDate: string | null;
  
  // Actions
  refreshDailyQuests: () => void;
  trackAction: (type: 'chat' | 'mindmap' | 'slides' | 'write' | 'explore') => void;
  claimQuest: (questId: string) => { coins: number; xp: number } | null;
  addXp: (amount: number) => void;
  checkStreakOnLogin: () => void;
  
  // Computed helpers
  getCurrentLevel: () => LevelInfo;
  getNextLevel: () => LevelInfo | null;
  getLevelProgress: () => number; // 0-100
  getStreakMultiplier: () => number;
  getUnlockedAchievements: () => Achievement[];
  getNewlyUnlocked: () => Achievement[];
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      totalCoinsEarned: 100, // started with 100
      
      dailyQuests: [],
      questDate: null,
      
      achievements: DEFAULT_ACHIEVEMENTS,
      
      stats: { chats: 0, mindmaps: 0, slides: 0, writes: 0, purchases: 0 },
      
      lastLoginDate: null,
      
      refreshDailyQuests: () => {
        const today = new Date().toDateString();
        const { questDate } = get();
        if (questDate !== today) {
          set({ dailyQuests: generateDailyQuests(), questDate: today });
        }
      },
      
      trackAction: (type) => {
        const statKey = type === 'explore' ? 'purchases' : type === 'write' ? 'writes' : type === 'mindmap' ? 'mindmaps' : type === 'slides' ? 'slides' : 'chats';
        
        set((state) => {
          const newStats = { ...state.stats, [statKey]: state.stats[statKey] + 1 };
          
          // Update quest progress
          const questTypeMap: Record<string, string> = { chat: 'chat', mindmap: 'mindmap', slides: 'slides', write: 'page', explore: 'explore' };
          const questType = questTypeMap[type];
          
          const newQuests = state.dailyQuests.map(q => {
            if (q.completed) return q;
            if (q.type === questType || q.type === 'any') {
              const newProgress = Math.min(q.progress + 1, q.target);
              return { ...q, progress: newProgress, completed: newProgress >= q.target };
            }
            return q;
          });
          
          // Check achievements
          const newAchievements = state.achievements.map(a => {
            if (a.unlockedAt) return a;
            const val = a.requirement.type === 'level' 
              ? get().getCurrentLevel().level 
              : a.requirement.type === 'totalCoins'
              ? state.totalCoinsEarned
              : a.requirement.type === 'streak'
              ? (window as any).__kolage_streak ?? 0
              : newStats[a.requirement.type as keyof typeof newStats] ?? 0;
            if (val >= a.requirement.count) {
              return { ...a, unlockedAt: new Date().toISOString() };
            }
            return a;
          });
          
          return { stats: newStats, dailyQuests: newQuests, achievements: newAchievements };
        });
      },
      
      claimQuest: (questId) => {
        const state = get();
        const quest = state.dailyQuests.find(q => q.id === questId);
        if (!quest || !quest.completed || quest.claimed) return null;
        
        const streakMult = state.getStreakMultiplier();
        const coins = Math.round(quest.reward * streakMult);
        const xp = quest.xpReward;
        
        set((s) => ({
          dailyQuests: s.dailyQuests.map(q => q.id === questId ? { ...q, claimed: true } : q),
          totalCoinsEarned: s.totalCoinsEarned + coins,
        }));
        
        get().addXp(xp);
        
        return { coins, xp };
      },
      
      addXp: (amount) => {
        set((state) => {
          const newXp = state.xp + amount;
          // Check level-based achievements
          const newLevel = LEVELS.filter(l => newXp >= l.xpRequired).pop()!;
          const newAchievements = state.achievements.map(a => {
            if (a.unlockedAt) return a;
            if (a.requirement.type === 'level' && newLevel.level >= a.requirement.count) {
              return { ...a, unlockedAt: new Date().toISOString() };
            }
            return a;
          });
          return { xp: newXp, achievements: newAchievements };
        });
      },
      
      checkStreakOnLogin: () => {
        const today = new Date().toDateString();
        const { lastLoginDate } = get();
        
        if (lastLoginDate === today) return; // Already logged in today
        
        // Auto-complete the streak quest
        set((state) => ({
          lastLoginDate: today,
          dailyQuests: state.dailyQuests.map(q => 
            q.type === 'streak' ? { ...q, progress: 1, completed: true } : q
          ),
        }));
      },
      
      getCurrentLevel: () => {
        const { xp } = get();
        return LEVELS.filter(l => xp >= l.xpRequired).pop() || LEVELS[0];
      },
      
      getNextLevel: () => {
        const current = get().getCurrentLevel();
        return LEVELS.find(l => l.level === current.level + 1) || null;
      },
      
      getLevelProgress: () => {
        const { xp } = get();
        const current = get().getCurrentLevel();
        const next = get().getNextLevel();
        if (!next) return 100;
        const progress = ((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100;
        return Math.min(Math.max(progress, 0), 100);
      },
      
      getStreakMultiplier: () => {
        // Use streak from main app store - accessed via window bridge
        const streak = (window as any).__kolage_streak ?? 0;
        if (streak >= 30) return 2.0;
        if (streak >= 14) return 1.5;
        if (streak >= 7) return 1.3;
        if (streak >= 3) return 1.1;
        return 1.0;
      },
      
      getUnlockedAchievements: () => {
        return get().achievements.filter(a => a.unlockedAt !== null);
      },
      
      getNewlyUnlocked: () => {
        const fiveMinAgo = Date.now() - 5 * 60 * 1000;
        return get().achievements.filter(a => 
          a.unlockedAt && new Date(a.unlockedAt).getTime() > fiveMinAgo
        );
      },
    }),
    {
      name: 'kolage-gamification',
      partialize: (state) => ({
        xp: state.xp,
        totalCoinsEarned: state.totalCoinsEarned,
        dailyQuests: state.dailyQuests,
        questDate: state.questDate,
        achievements: state.achievements,
        stats: state.stats,
        lastLoginDate: state.lastLoginDate,
      }),
    }
  )
);

export { LEVELS };
