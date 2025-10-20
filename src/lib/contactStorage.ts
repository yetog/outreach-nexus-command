export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  linkedinUrl?: string;
  profilePhoto?: string;
  headline?: string;
  location?: string;
  connectionDegree?: '1st' | '2nd' | '3rd' | '3rd+';
  tags: string[];
  notes?: string;
  enrichmentStatus: 'pending' | 'completed' | 'failed';
  scrapedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedInProfileData {
  name: string;
  headline?: string;
  location?: string;
  profileUrl?: string;
  currentCompany?: string;
  currentPosition?: string;
  connectionDegree?: '1st' | '2nd' | '3rd' | '3rd+';
  profilePhoto?: string;
  email?: string;
  phone?: string;
}

const STORAGE_KEY = 'onx.contacts';

export const contactStorage = {
  getAll(): Contact[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  getById(id: string): Contact | null {
    const contacts = this.getAll();
    return contacts.find(c => c.id === id) || null;
  },

  create(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const now = new Date().toISOString();
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    const contacts = this.getAll();
    contacts.push(newContact);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    return newContact;
  },

  bulkCreate(contactsData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]): Contact[] {
    const now = new Date().toISOString();
    const newContacts = contactsData.map(data => ({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }));
    
    const existing = this.getAll();
    const all = [...existing, ...newContacts];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return newContacts;
  },

  update(id: string, updates: Partial<Contact>): Contact | null {
    const contacts = this.getAll();
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) return null;

    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    return contacts[index];
  },

  delete(id: string): boolean {
    const contacts = this.getAll();
    const filtered = contacts.filter(c => c.id !== id);
    if (filtered.length === contacts.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  search(query: string): Contact[] {
    const contacts = this.getAll();
    const lowerQuery = query.toLowerCase();
    return contacts.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.email?.toLowerCase().includes(lowerQuery) ||
      c.company?.toLowerCase().includes(lowerQuery) ||
      c.position?.toLowerCase().includes(lowerQuery)
    );
  },

  filterByTag(tag: string): Contact[] {
    const contacts = this.getAll();
    return contacts.filter(c => c.tags.includes(tag));
  },

  importFromLinkedIn(profiles: LinkedInProfileData[]): Contact[] {
    const existing = this.getAll();
    const existingUrls = new Set(existing.map(c => c.linkedinUrl).filter(Boolean));
    
    // Deduplicate by LinkedIn URL
    const newProfiles = profiles.filter(p => 
      p.profileUrl && !existingUrls.has(p.profileUrl)
    );

    const contactsToCreate = newProfiles.map(profile => ({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      company: profile.currentCompany,
      position: profile.currentPosition,
      linkedinUrl: profile.profileUrl,
      profilePhoto: profile.profilePhoto,
      headline: profile.headline,
      location: profile.location,
      connectionDegree: profile.connectionDegree,
      tags: ['linkedin-import'],
      enrichmentStatus: 'pending' as const,
      scrapedAt: new Date().toISOString(),
    }));

    return this.bulkCreate(contactsToCreate);
  },

  exportToCSV(): string {
    const contacts = this.getAll();
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Position', 'LinkedIn URL', 'Location', 'Tags'];
    const rows = contacts.map(c => [
      c.name,
      c.email || '',
      c.phone || '',
      c.company || '',
      c.position || '',
      c.linkedinUrl || '',
      c.location || '',
      c.tags.join('; ')
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  },

  importFromCSV(csvText: string): Contact[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    const dataLines = lines.slice(1);

    const profiles: LinkedInProfileData[] = dataLines.map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const row: any = {};
      headers.forEach((header, i) => {
        row[header] = values[i] || '';
      });

      return {
        name: row.name || row.fullname || 'Unknown',
        headline: row.headline || row.title,
        location: row.location,
        profileUrl: row['linkedin url'] || row.linkedin || row.url,
        currentCompany: row.company || row['current company'],
        currentPosition: row.position || row['current position'] || row.title,
        email: row.email,
        phone: row.phone,
      };
    }).filter(p => p.name && p.name !== 'Unknown');

    return this.importFromLinkedIn(profiles);
  }
};
