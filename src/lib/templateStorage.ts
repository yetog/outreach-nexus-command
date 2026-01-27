export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  tags: string[];
  createdAt: string;
}

const STORAGE_KEY = 'onx.templates';

export const templateStorage = {
  getAll(): EmailTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  create(template: Omit<EmailTemplate, 'id' | 'createdAt'>): EmailTemplate {
    const newTemplate: EmailTemplate = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const templates = this.getAll();
    templates.push(newTemplate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return newTemplate;
  },

  update(id: string, updates: Partial<EmailTemplate>): EmailTemplate | null {
    const templates = this.getAll();
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return null;

    templates[index] = { ...templates[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return templates[index];
  },

  delete(id: string): boolean {
    const templates = this.getAll();
    const filtered = templates.filter(t => t.id !== id);
    if (filtered.length === templates.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  bulkCreate(templates: Omit<EmailTemplate, 'id'>[]): EmailTemplate[] {
    const existing = this.getAll();
    const newTemplates = templates.map(t => ({
      ...t,
      id: crypto.randomUUID(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, ...newTemplates]));
    return newTemplates as EmailTemplate[];
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
