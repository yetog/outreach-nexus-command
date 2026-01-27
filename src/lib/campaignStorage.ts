import { gamificationStorage } from './gamificationStorage';

export interface Campaign {
  id: string;
  name: string;
  template: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';
  targetCount: number;
  sentCount: number;
  scheduleType: 'immediate' | 'scheduled' | 'drip';
  scheduledDate?: string;
  dailyLimit: number;
  createdAt: string;
}

const STORAGE_KEY = 'onx.campaigns';

export const campaignStorage = {
  getAll(): Campaign[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  create(campaign: Omit<Campaign, 'id' | 'createdAt' | 'sentCount'>): Campaign {
    const newCampaign: Campaign = {
      ...campaign,
      id: crypto.randomUUID(),
      sentCount: 0,
      createdAt: new Date().toISOString(),
    };
    const campaigns = this.getAll();
    campaigns.push(newCampaign);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    return newCampaign;
  },

  update(id: string, updates: Partial<Campaign>): Campaign | null {
    const campaigns = this.getAll();
    const index = campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;

    campaigns[index] = { ...campaigns[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    return campaigns[index];
  },

  delete(id: string): boolean {
    const campaigns = this.getAll();
    const filtered = campaigns.filter(c => c.id !== id);
    if (filtered.length === campaigns.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  send(id: string): Campaign | null {
    const campaign = this.update(id, { 
      status: 'running',
      sentCount: 1 
    });
    
    if (campaign) {
      // Award XP for sending email campaign
      gamificationStorage.addEvent('email_sent', `Started campaign: ${campaign.name}`);
      gamificationStorage.updateStats('emailsSent');
    }
    
    return campaign;
  },

  bulkCreate(campaigns: Omit<Campaign, 'id'>[]): Campaign[] {
    const existing = this.getAll();
    const newCampaigns = campaigns.map(c => ({
      ...c,
      id: crypto.randomUUID(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, ...newCampaigns]));
    return newCampaigns as Campaign[];
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
