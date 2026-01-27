import { contactStorage } from './contactStorage';
import { taskStorage } from './taskStorage';
import { dealStorage } from './dealStorage';
import { campaignStorage } from './campaignStorage';
import { templateStorage } from './templateStorage';
import { pitchStorage } from './pitchStorage';
import { knowledgeStorage } from './knowledgeStorage';
import { gamificationStorage } from './gamificationStorage';
import { format, subDays, addDays } from 'date-fns';

const DEMO_SEEDED_KEY = 'onx.demo.seeded';

export const DEMO_CONTACTS = [
  { name: 'John Smith', email: 'john.smith@acme.com', company: 'Acme Corp', position: 'VP Sales', phone: '+1 555-0101', tags: ['enterprise', 'hot-lead'], notes: 'Met at SaaStr conference', enrichmentStatus: 'completed' as const },
  { name: 'Sarah Johnson', email: 'sarah.j@techstart.io', company: 'TechStart Inc', position: 'Founder', phone: '+1 555-0102', tags: ['startup', 'decision-maker'], notes: 'Interested in automation features', enrichmentStatus: 'completed' as const },
  { name: 'Michael Chen', email: 'm.chen@globaltech.com', company: 'GlobalTech', position: 'CTO', phone: '+1 555-0103', tags: ['enterprise', 'technical'], notes: 'Needs API integration', enrichmentStatus: 'completed' as const },
  { name: 'Emily Davis', email: 'emily@innovate.co', company: 'Innovate Co', position: 'Head of Ops', phone: '+1 555-0104', tags: ['mid-market', 'referral'], notes: 'Referred by John Smith', enrichmentStatus: 'completed' as const },
  { name: 'David Wilson', email: 'dwilson@nexus.io', company: 'Nexus Solutions', position: 'CEO', phone: '+1 555-0105', tags: ['startup', 'hot-lead'], notes: 'Demo scheduled for next week', enrichmentStatus: 'completed' as const },
  { name: 'Lisa Brown', email: 'lisa.b@enterprise.com', company: 'Enterprise Inc', position: 'Director of Sales', phone: '+1 555-0106', tags: ['enterprise', 'champion'], notes: 'Strong internal advocate', enrichmentStatus: 'completed' as const },
  { name: 'James Taylor', email: 'jtaylor@growth.co', company: 'Growth Co', position: 'Sales Manager', phone: '+1 555-0107', tags: ['mid-market', 'warm'], notes: 'Follow up after webinar', enrichmentStatus: 'completed' as const },
  { name: 'Anna Martinez', email: 'anna@velocity.io', company: 'Velocity', position: 'COO', phone: '+1 555-0108', tags: ['startup', 'decision-maker'], notes: 'Fast-growing team, urgent need', enrichmentStatus: 'completed' as const },
];

export const DEMO_DEALS = [
  { contactName: 'John Smith', company: 'Acme Corp', stage: 'proposal' as const, value: 25000, priority: 'high' as const, nextStep: 'Follow up on proposal feedback', lastActivity: '2 days ago', createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd') },
  { contactName: 'Sarah Johnson', company: 'TechStart Inc', stage: 'discovery' as const, value: 15000, priority: 'medium' as const, nextStep: 'Schedule demo call', lastActivity: '1 day ago', createdAt: format(subDays(new Date(), 8), 'yyyy-MM-dd') },
  { contactName: 'Michael Chen', company: 'GlobalTech', stage: 'negotiation' as const, value: 75000, priority: 'high' as const, nextStep: 'Send revised pricing', lastActivity: '3 hours ago', createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd') },
  { contactName: 'Emily Davis', company: 'Innovate Co', stage: 'closing' as const, value: 32000, priority: 'high' as const, nextStep: 'Final contract review', lastActivity: 'Yesterday', createdAt: format(subDays(new Date(), 45), 'yyyy-MM-dd') },
  { contactName: 'David Wilson', company: 'Nexus Solutions', stage: 'discovery' as const, value: 18000, priority: 'medium' as const, nextStep: 'Technical requirements call', lastActivity: '4 days ago', createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd') },
];

export const DEMO_CAMPAIGNS = [
  { name: 'Q1 Tech Outreach', template: 'cold-outreach', status: 'running' as const, targetCount: 150, sentCount: 47, scheduleType: 'drip' as const, dailyLimit: 25, createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd') },
  { name: 'Webinar Follow-up', template: 'follow-up', status: 'scheduled' as const, targetCount: 85, sentCount: 0, scheduleType: 'scheduled' as const, scheduledDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'), dailyLimit: 50, createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd') },
  { name: 'Enterprise Intro', template: 'introduction', status: 'completed' as const, targetCount: 30, sentCount: 30, scheduleType: 'immediate' as const, dailyLimit: 30, createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd') },
];

export const DEMO_TEMPLATES = [
  { name: 'Cold Outreach - Tech', subject: 'Quick question about {{company}}', body: 'Hi {{name}},\n\nI noticed {{company}} is scaling fast—congrats! Teams like yours often struggle with manual outreach eating up 10+ hours weekly.\n\nWe help sales teams automate personalized outreach without losing the human touch. Would you be open to a 15-min chat to see if we could help?\n\nBest,\nYour Name', tags: ['cold', 'tech'], createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd') },
  { name: 'Follow-up Template', subject: 'Re: Our conversation', body: 'Hi {{name}},\n\nJust following up on our chat last week. I wanted to share a quick case study showing how a company similar to {{company}} increased their response rates by 3x.\n\nWould you have 10 minutes this week to discuss?\n\nBest,\nYour Name', tags: ['follow-up', 'warm'], createdAt: format(subDays(new Date(), 25), 'yyyy-MM-dd') },
  { name: 'Introduction Template', subject: 'Introduction: {{company}} + Our Solution', body: 'Hi {{name}},\n\nI hope this email finds you well. I am reaching out because I believe there is a strong synergy between {{company}} and what we do.\n\nWe specialize in helping teams like yours streamline their sales process. I would love to learn more about your current challenges and share some ideas.\n\nWould you be open to a brief call?\n\nBest regards,\nYour Name', tags: ['intro', 'formal'], createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd') },
];

export const DEMO_PITCHES = [
  { title: 'Value Prop - SMB SaaS', tags: ['value', 'smb', 'saas'], content: 'We help SMB SaaS teams automate outreach and increase conversion by 22%. Our platform integrates with your existing CRM in under 5 minutes, and most teams see ROI within the first month.', createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd') },
  { title: 'Objection - Budget', tags: ['objection', 'budget'], content: 'Totally understand budget caution. Teams like Acme started small with our lite plan ($99/mo) and funded the rollout from early wins. Most see 3x ROI in 60 days. Would a pilot make sense?', createdAt: format(subDays(new Date(), 25), 'yyyy-MM-dd') },
  { title: 'Objection - Timing', tags: ['objection', 'timing'], content: 'I hear you on timing. Actually, Q1 is when most teams see the biggest impact—new budgets, fresh goals. What if we did a quick 2-week trial so you could see results before committing?', createdAt: format(subDays(new Date(), 20), 'yyyy-MM-dd') },
  { title: 'Competitor Comparison', tags: ['competitor', 'comparison'], content: 'Great question about [Competitor]. The main difference is our AI personalization—we generate truly unique emails, not just mail merge. Plus, our response rates are 40% higher on average.', createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd') },
];

export const DEMO_KNOWLEDGE = [
  { category: 'Product Features', data: { 'Feature Name': 'AI Automation', 'Description': 'Automated lead scoring and nurturing', 'Benefits': 'Saves 10+ hours weekly', 'Price Point': '$299/month' }, createdAt: format(subDays(new Date(), 60), 'yyyy-MM-dd') },
  { category: 'Pricing Tiers', data: { 'Starter': '$99/mo - 500 contacts', 'Growth': '$299/mo - 5000 contacts', 'Enterprise': 'Custom - Unlimited' }, createdAt: format(subDays(new Date(), 55), 'yyyy-MM-dd') },
  { category: 'Case Studies', data: { 'Acme Corp': '3x response rate, 45% time saved', 'TechStart': '2x pipeline in 90 days', 'GlobalTech': '60% faster deal cycles' }, createdAt: format(subDays(new Date(), 50), 'yyyy-MM-dd') },
];

export const DEMO_SCRIPTS = [
  { type: 'call' as const, title: 'Cold Outreach Script', content: 'Hi [Name], this is [Your Name] from [Company]. I noticed you\'re working on scaling your sales team. We help companies like yours automate outreach without losing the personal touch. Do you have 30 seconds for me to explain how?', createdAt: format(subDays(new Date(), 40), 'yyyy-MM-dd') },
  { type: 'voicemail' as const, title: 'Follow-up Voicemail', content: 'Hi [Name], [Your Name] calling from [Company]. I sent you an email yesterday about helping your team save 10 hours weekly on outreach. Call me back at [number] or I\'ll try you again tomorrow. Thanks!', createdAt: format(subDays(new Date(), 35), 'yyyy-MM-dd') },
  { type: 'call' as const, title: 'Discovery Call Opener', content: 'Hi [Name], thanks for taking the time today. Before I dive in, I\'d love to learn more about your current process. Can you walk me through how your team handles outreach today?', createdAt: format(subDays(new Date(), 30), 'yyyy-MM-dd') },
];

const DEMO_TASKS = [
  { title: 'Call John Smith - proposal follow-up', type: 'call' as const, priority: 'high' as const, dueDate: format(new Date(), 'yyyy-MM-dd'), dueTime: '10:00', completed: false },
  { title: 'Email Sarah Johnson - demo invite', type: 'email' as const, priority: 'medium' as const, dueDate: format(new Date(), 'yyyy-MM-dd'), dueTime: '11:30', completed: false },
  { title: 'Meeting with Michael Chen - pricing discussion', type: 'meeting' as const, priority: 'high' as const, dueDate: format(new Date(), 'yyyy-MM-dd'), dueTime: '14:00', completed: false },
  { title: 'Follow up with Emily Davis - contract', type: 'follow-up' as const, priority: 'high' as const, dueDate: format(new Date(), 'yyyy-MM-dd'), dueTime: '16:00', completed: false },
  { title: 'Call David Wilson - requirements', type: 'call' as const, priority: 'medium' as const, dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'), completed: false },
];

export function seedDemoData(): void {
  if (localStorage.getItem(DEMO_SEEDED_KEY)) {
    return; // Already seeded
  }

  // Seed contacts
  DEMO_CONTACTS.forEach(contact => {
    contactStorage.create(contact);
  });

  // Seed deals
  dealStorage.bulkCreate(DEMO_DEALS);

  // Seed campaigns
  campaignStorage.bulkCreate(DEMO_CAMPAIGNS);

  // Seed templates
  templateStorage.bulkCreate(DEMO_TEMPLATES);

  // Seed pitches
  pitchStorage.bulkCreate(DEMO_PITCHES);

  // Seed knowledge and scripts
  knowledgeStorage.bulkCreateKnowledge(DEMO_KNOWLEDGE);
  knowledgeStorage.bulkCreateScripts(DEMO_SCRIPTS);

  // Seed tasks
  DEMO_TASKS.forEach(task => {
    taskStorage.create(task);
  });

  // Initialize gamification with some starting progress
  gamificationStorage.getProfile(); // Ensures profile exists

  localStorage.setItem(DEMO_SEEDED_KEY, 'true');
}

export function resetDemoData(): void {
  // Clear all storage
  clearAllData();
  
  // Re-seed
  seedDemoData();
}

export function clearAllData(): void {
  // Clear all storage without re-seeding
  contactStorage.clear();
  taskStorage.clear();
  dealStorage.clear();
  campaignStorage.clear();
  templateStorage.clear();
  pitchStorage.clear();
  knowledgeStorage.clearAll();
  gamificationStorage.clear();
  
  // Also clear call logs
  localStorage.removeItem('onx.call_logs');
  
  // Remove seeded flag
  localStorage.removeItem(DEMO_SEEDED_KEY);
}

export function hasAnyData(): boolean {
  return contactStorage.getAll().length > 0 ||
    dealStorage.getAll().length > 0 ||
    taskStorage.getAll().length > 0;
}

export function isDemoSeeded(): boolean {
  return localStorage.getItem(DEMO_SEEDED_KEY) === 'true';
}

export function isFirstTimeUser(): boolean {
  // Check if any onx.* keys exist in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('onx.')) {
      return false;
    }
  }
  return true;
}
