import { gamificationStorage } from './gamificationStorage';

export interface Deal {
  id: string;
  contactName: string;
  company: string;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'closing' | 'won' | 'lost';
  value: number;
  priority: 'low' | 'medium' | 'high';
  nextStep: string;
  lastActivity: string;
  createdAt: string;
}

const STORAGE_KEY = 'onx.deals';

export const dealStorage = {
  getAll(): Deal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  create(deal: Omit<Deal, 'id' | 'createdAt' | 'lastActivity'>): Deal {
    const newDeal: Deal = {
      ...deal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: 'Just now',
    };
    const deals = this.getAll();
    deals.push(newDeal);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
    
    // Award XP for creating a deal
    gamificationStorage.addEvent('deal_stage_advance', `Created deal: ${newDeal.company}`);
    gamificationStorage.updateStats('dealsAdvanced');
    
    return newDeal;
  },

  update(id: string, updates: Partial<Deal>): Deal | null {
    const deals = this.getAll();
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) return null;

    const oldDeal = deals[index];
    deals[index] = {
      ...oldDeal,
      ...updates,
      lastActivity: 'Just now',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
    
    // Award XP for advancing deal stage
    if (updates.stage && updates.stage !== oldDeal.stage) {
      const stageOrder = ['discovery', 'proposal', 'negotiation', 'closing', 'won'];
      const oldIndex = stageOrder.indexOf(oldDeal.stage);
      const newIndex = stageOrder.indexOf(updates.stage);
      
      if (newIndex > oldIndex) {
        gamificationStorage.addEvent('deal_stage_advance', `Advanced deal to ${updates.stage}: ${oldDeal.company}`);
        gamificationStorage.updateStats('dealsAdvanced');
      }
    }
    
    return deals[index];
  },

  delete(id: string): boolean {
    const deals = this.getAll();
    const filtered = deals.filter(d => d.id !== id);
    if (filtered.length === deals.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  bulkCreate(deals: Omit<Deal, 'id'>[]): Deal[] {
    const existing = this.getAll();
    const newDeals = deals.map(deal => ({
      ...deal,
      id: crypto.randomUUID(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, ...newDeals]));
    return newDeals as Deal[];
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
