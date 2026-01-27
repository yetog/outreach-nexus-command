export interface Pitch {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'onx.pitches';

export const pitchStorage = {
  getAll(): Pitch[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  create(pitch: Omit<Pitch, 'id' | 'createdAt'>): Pitch {
    const newPitch: Pitch = {
      ...pitch,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const pitches = this.getAll();
    pitches.push(newPitch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pitches));
    return newPitch;
  },

  update(id: string, updates: Partial<Pitch>): Pitch | null {
    const pitches = this.getAll();
    const index = pitches.findIndex(p => p.id === id);
    if (index === -1) return null;

    pitches[index] = { ...pitches[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pitches));
    return pitches[index];
  },

  delete(id: string): boolean {
    const pitches = this.getAll();
    const filtered = pitches.filter(p => p.id !== id);
    if (filtered.length === pitches.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  bulkCreate(pitches: Omit<Pitch, 'id'>[]): Pitch[] {
    const existing = this.getAll();
    const newPitches = pitches.map(p => ({
      ...p,
      id: crypto.randomUUID(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, ...newPitches]));
    return newPitches as Pitch[];
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
