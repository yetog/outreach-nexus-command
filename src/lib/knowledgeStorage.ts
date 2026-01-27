export interface KnowledgeEntry {
  id: string;
  category: string;
  data: Record<string, string>;
  createdAt: string;
}

export interface PhoneScript {
  id: string;
  type: 'voicemail' | 'call';
  title: string;
  content: string;
  createdAt: string;
}

const KNOWLEDGE_KEY = 'onx.knowledge';
const SCRIPTS_KEY = 'onx.scripts';

export const knowledgeStorage = {
  // Knowledge entries
  getAllKnowledge(): KnowledgeEntry[] {
    try {
      const data = localStorage.getItem(KNOWLEDGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  createKnowledge(entry: Omit<KnowledgeEntry, 'id' | 'createdAt'>): KnowledgeEntry {
    const entries = this.getAllKnowledge();
    
    // Check if category exists, merge data if so
    const existingIndex = entries.findIndex(e => e.category === entry.category);
    if (existingIndex !== -1) {
      entries[existingIndex].data = { ...entries[existingIndex].data, ...entry.data };
      localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify(entries));
      return entries[existingIndex];
    }
    
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    entries.push(newEntry);
    localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify(entries));
    return newEntry;
  },

  updateKnowledge(id: string, updates: Partial<KnowledgeEntry>): KnowledgeEntry | null {
    const entries = this.getAllKnowledge();
    const index = entries.findIndex(e => e.id === id);
    if (index === -1) return null;

    entries[index] = { ...entries[index], ...updates };
    localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify(entries));
    return entries[index];
  },

  deleteKnowledge(id: string): boolean {
    const entries = this.getAllKnowledge();
    const filtered = entries.filter(e => e.id !== id);
    if (filtered.length === entries.length) return false;
    localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Phone scripts
  getAllScripts(): PhoneScript[] {
    try {
      const data = localStorage.getItem(SCRIPTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  createScript(script: Omit<PhoneScript, 'id' | 'createdAt'>): PhoneScript {
    const newScript: PhoneScript = {
      ...script,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const scripts = this.getAllScripts();
    scripts.push(newScript);
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
    return newScript;
  },

  updateScript(id: string, updates: Partial<PhoneScript>): PhoneScript | null {
    const scripts = this.getAllScripts();
    const index = scripts.findIndex(s => s.id === id);
    if (index === -1) return null;

    scripts[index] = { ...scripts[index], ...updates };
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
    return scripts[index];
  },

  deleteScript(id: string): boolean {
    const scripts = this.getAllScripts();
    const filtered = scripts.filter(s => s.id !== id);
    if (filtered.length === scripts.length) return false;
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(filtered));
    return true;
  },

  bulkCreateKnowledge(entries: Omit<KnowledgeEntry, 'id'>[]): KnowledgeEntry[] {
    const existing = this.getAllKnowledge();
    const newEntries = entries.map(e => ({
      ...e,
      id: crypto.randomUUID(),
    }));
    localStorage.setItem(KNOWLEDGE_KEY, JSON.stringify([...existing, ...newEntries]));
    return newEntries as KnowledgeEntry[];
  },

  bulkCreateScripts(scripts: Omit<PhoneScript, 'id'>[]): PhoneScript[] {
    const existing = this.getAllScripts();
    const newScripts = scripts.map(s => ({
      ...s,
      id: crypto.randomUUID(),
    }));
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify([...existing, ...newScripts]));
    return newScripts as PhoneScript[];
  },

  clearAll(): void {
    localStorage.removeItem(KNOWLEDGE_KEY);
    localStorage.removeItem(SCRIPTS_KEY);
  },
};
