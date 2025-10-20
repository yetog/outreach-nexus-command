export interface XPEvent {
  id: string;
  type: 'first_touch' | 'task_complete' | 'call_logged' | 'email_sent' | 'deal_stage_advance' | 'contact_added' | 'streak_bonus';
  xp: number;
  description: string;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'contacts' | 'tasks' | 'calls' | 'emails' | 'deals' | 'streak';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  expiresAt: string;
}

export interface GamificationProfile {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  stats: {
    contactsAdded: number;
    tasksCompleted: number;
    callsLogged: number;
    emailsSent: number;
    dealsAdvanced: number;
  };
}

const STORAGE_KEYS = {
  PROFILE: 'onx.gamification.profile',
  EVENTS: 'onx.gamification.events',
  BADGES: 'onx.gamification.badges',
  QUESTS: 'onx.gamification.quests',
};

const XP_VALUES = {
  first_touch: 5,
  task_complete: 10,
  call_logged: 15,
  email_sent: 8,
  deal_stage_advance: 25,
  contact_added: 12,
  streak_bonus: 20,
};

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];

const DEFAULT_BADGES: Badge[] = [
  { id: 'first_contact', name: 'First Contact', description: 'Add your first contact', icon: '👤', requirement: 1, category: 'contacts', unlocked: false },
  { id: 'contact_collector', name: 'Contact Collector', description: 'Add 25 contacts', icon: '📇', requirement: 25, category: 'contacts', unlocked: false },
  { id: 'networking_pro', name: 'Networking Pro', description: 'Add 100 contacts', icon: '🌐', requirement: 100, category: 'contacts', unlocked: false },
  
  { id: 'task_starter', name: 'Task Starter', description: 'Complete 5 tasks', icon: '✅', requirement: 5, category: 'tasks', unlocked: false },
  { id: 'task_master', name: 'Task Master', description: 'Complete 50 tasks', icon: '🎯', requirement: 50, category: 'tasks', unlocked: false },
  { id: 'productivity_king', name: 'Productivity King', description: 'Complete 200 tasks', icon: '👑', requirement: 200, category: 'tasks', unlocked: false },
  
  { id: 'first_call', name: 'First Call', description: 'Log your first call', icon: '📞', requirement: 1, category: 'calls', unlocked: false },
  { id: 'call_champion', name: 'Call Champion', description: 'Log 50 calls', icon: '📱', requirement: 50, category: 'calls', unlocked: false },
  
  { id: 'email_enthusiast', name: 'Email Enthusiast', description: 'Send 25 emails', icon: '📧', requirement: 25, category: 'emails', unlocked: false },
  { id: 'inbox_hero', name: 'Inbox Hero', description: 'Send 100 emails', icon: '💌', requirement: 100, category: 'emails', unlocked: false },
  
  { id: 'deal_maker', name: 'Deal Maker', description: 'Advance 10 deals', icon: '💼', requirement: 10, category: 'deals', unlocked: false },
  { id: 'sales_legend', name: 'Sales Legend', description: 'Advance 50 deals', icon: '🏆', requirement: 50, category: 'deals', unlocked: false },
  
  { id: 'week_warrior', name: 'Week Warrior', description: '7-day streak', icon: '🔥', requirement: 7, category: 'streak', unlocked: false },
  { id: 'month_master', name: 'Month Master', description: '30-day streak', icon: '⚡', requirement: 30, category: 'streak', unlocked: false },
];

export const gamificationStorage = {
  getProfile(): GamificationProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {}
    
    const defaultProfile: GamificationProfile = {
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      stats: {
        contactsAdded: 0,
        tasksCompleted: 0,
        callsLogged: 0,
        emailsSent: 0,
        dealsAdvanced: 0,
      },
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(defaultProfile));
    return defaultProfile;
  },

  updateProfile(updates: Partial<GamificationProfile>): GamificationProfile {
    const profile = this.getProfile();
    const updated = { ...profile, ...updates };
    
    // Calculate level based on XP
    if (updates.totalXP !== undefined) {
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (updated.totalXP >= LEVEL_THRESHOLDS[i]) {
          updated.level = i + 1;
          break;
        }
      }
    }
    
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return updated;
  },

  getEvents(): XPEvent[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  addEvent(type: XPEvent['type'], description?: string): XPEvent {
    const profile = this.getProfile();
    const xp = XP_VALUES[type];
    
    const event: XPEvent = {
      id: crypto.randomUUID(),
      type,
      xp,
      description: description || this.getDefaultDescription(type),
      timestamp: new Date().toISOString(),
    };
    
    const events = this.getEvents();
    events.unshift(event);
    
    // Keep last 100 events
    if (events.length > 100) events.pop();
    
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    
    // Update profile XP and check streak
    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.lastActiveDate;
    
    let newStreak = profile.currentStreak;
    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActive === yesterdayStr) {
        newStreak += 1;
        if (newStreak > profile.longestStreak) {
          this.updateProfile({ longestStreak: newStreak });
        }
      } else if (lastActive !== today) {
        newStreak = 1;
      }
    }
    
    this.updateProfile({
      totalXP: profile.totalXP + xp,
      currentStreak: newStreak,
      lastActiveDate: today,
    });
    
    // Check badge unlocks
    this.checkBadgeUnlocks();
    
    return event;
  },

  getDefaultDescription(type: XPEvent['type']): string {
    const descriptions = {
      first_touch: 'First contact with prospect',
      task_complete: 'Completed a task',
      call_logged: 'Logged a call',
      email_sent: 'Sent an email',
      deal_stage_advance: 'Advanced deal stage',
      contact_added: 'Added new contact',
      streak_bonus: 'Daily streak bonus',
    };
    return descriptions[type];
  },

  updateStats(stat: keyof GamificationProfile['stats'], increment: number = 1): void {
    const profile = this.getProfile();
    profile.stats[stat] += increment;
    this.updateProfile(profile);
  },

  getBadges(): Badge[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (saved) return JSON.parse(saved);
    } catch {}
    
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(DEFAULT_BADGES));
    return DEFAULT_BADGES;
  },

  checkBadgeUnlocks(): Badge[] {
    const profile = this.getProfile();
    const badges = this.getBadges();
    const newlyUnlocked: Badge[] = [];
    
    badges.forEach(badge => {
      if (badge.unlocked) return;
      
      let currentValue = 0;
      switch (badge.category) {
        case 'contacts':
          currentValue = profile.stats.contactsAdded;
          break;
        case 'tasks':
          currentValue = profile.stats.tasksCompleted;
          break;
        case 'calls':
          currentValue = profile.stats.callsLogged;
          break;
        case 'emails':
          currentValue = profile.stats.emailsSent;
          break;
        case 'deals':
          currentValue = profile.stats.dealsAdvanced;
          break;
        case 'streak':
          currentValue = profile.longestStreak;
          break;
      }
      
      if (currentValue >= badge.requirement) {
        badge.unlocked = true;
        badge.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(badge);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    }
    
    return newlyUnlocked;
  },

  getQuests(): Quest[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
      if (saved) {
        const quests: Quest[] = JSON.parse(saved);
        // Filter out expired quests
        const now = new Date().toISOString();
        return quests.filter(q => q.expiresAt > now);
      }
    } catch {}
    
    const quests = this.generateQuests();
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    return quests;
  },

  generateQuests(): Quest[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    
    return [
      {
        id: crypto.randomUUID(),
        title: 'Daily Hustler',
        description: 'Complete 5 tasks today',
        type: 'daily',
        target: 5,
        current: 0,
        xpReward: 50,
        completed: false,
        expiresAt: tomorrow.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Call Champion',
        description: 'Log 3 calls today',
        type: 'daily',
        target: 3,
        current: 0,
        xpReward: 40,
        completed: false,
        expiresAt: tomorrow.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Weekly Warrior',
        description: 'Complete 25 tasks this week',
        type: 'weekly',
        target: 25,
        current: 0,
        xpReward: 200,
        completed: false,
        expiresAt: nextWeek.toISOString(),
      },
    ];
  },

  updateQuest(questId: string, progress: number): Quest | null {
    const quests = this.getQuests();
    const quest = quests.find(q => q.id === questId);
    
    if (!quest || quest.completed) return null;
    
    quest.current = Math.min(progress, quest.target);
    
    if (quest.current >= quest.target && !quest.completed) {
      quest.completed = true;
      const profile = this.getProfile();
      this.updateProfile({ totalXP: profile.totalXP + quest.xpReward });
      
      this.addEvent('task_complete', `Quest completed: ${quest.title} (+${quest.xpReward} XP)`);
    }
    
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    return quest;
  },

  getXPForNextLevel(): number {
    const profile = this.getProfile();
    const nextThreshold = LEVEL_THRESHOLDS[profile.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    return nextThreshold - profile.totalXP;
  },

  getProgressToNextLevel(): number {
    const profile = this.getProfile();
    const currentThreshold = LEVEL_THRESHOLDS[profile.level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[profile.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const progress = profile.totalXP - currentThreshold;
    const total = nextThreshold - currentThreshold;
    return Math.min((progress / total) * 100, 100);
  },
};
