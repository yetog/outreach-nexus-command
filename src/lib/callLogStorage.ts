import { gamificationStorage } from './gamificationStorage';

export interface CallLog {
  id: string;
  contactId?: string;
  contactName?: string;
  transcript?: string;
  summary?: string;
  actionItems: string[];
  outcome: 'answered' | 'voicemail' | 'no-answer' | 'busy';
  duration?: number;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = 'onx.call_logs';

export const callLogStorage = {
  getAll(): CallLog[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  getById(id: string): CallLog | null {
    return this.getAll().find(log => log.id === id) || null;
  },

  getByContactId(contactId: string): CallLog[] {
    return this.getAll().filter(log => log.contactId === contactId);
  },

  getRecent(limit: number = 10): CallLog[] {
    return this.getAll()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  create(log: Omit<CallLog, 'id' | 'createdAt'>): CallLog {
    const newLog: CallLog = {
      ...log,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    const logs = this.getAll();
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    
    // Award XP for logging a call
    gamificationStorage.addEvent('call_logged', `Logged call${log.contactName ? `: ${log.contactName}` : ''}`);
    gamificationStorage.updateStats('callsLogged');
    
    // Update daily quest
    const quests = gamificationStorage.getQuests();
    const callQuest = quests.find(q => q.type === 'daily' && q.title === 'Call Champion');
    if (callQuest) {
      gamificationStorage.updateQuest(callQuest.id, callQuest.current + 1);
    }
    
    return newLog;
  },

  update(id: string, updates: Partial<CallLog>): CallLog | null {
    const logs = this.getAll();
    const index = logs.findIndex(l => l.id === id);
    if (index === -1) return null;

    logs[index] = { ...logs[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    return logs[index];
  },

  delete(id: string): boolean {
    const logs = this.getAll();
    const filtered = logs.filter(l => l.id !== id);
    if (filtered.length === logs.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
