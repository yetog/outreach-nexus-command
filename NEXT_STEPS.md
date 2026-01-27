# Outreach Nexus - Next Steps for Production

## Current Architecture (Demo Mode)

- **Frontend**: React + Vite + TypeScript + Tailwind + shadcn/ui
- **Data**: localStorage (browser-based, single user)
- **AI**: IONOS AI Model Hub (Llama 3.1)
- **PDF Generation**: jsPDF (client-side)

## Production Architecture Requirements

### 1. Database Migration (Priority: High)

**Technology**: PostgreSQL database (Supabase or IONOS VM)

**Tables needed**:

```sql
-- Core CRM
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  title TEXT,
  phone TEXT,
  tags TEXT[],
  notes TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  contact_id UUID REFERENCES contacts(id),
  stage TEXT NOT NULL,
  value NUMERIC,
  priority TEXT,
  next_step TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  contact_id UUID REFERENCES contacts(id),
  deal_id UUID REFERENCES deals(id),
  title TEXT NOT NULL,
  type TEXT,
  priority TEXT,
  due_date DATE,
  due_time TIME,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns & Emails
CREATE TABLE email_templates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  template_id UUID REFERENCES email_templates(id),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  target_count INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  daily_limit INT DEFAULT 50,
  schedule_type TEXT,
  scheduled_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_logs (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  contact_id UUID REFERENCES contacts(id),
  status TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);

-- Content
CREATE TABLE pitches (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  embeddings VECTOR(1536), -- For RAG search
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE knowledge_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE phone_scripts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE call_notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  contact_id UUID REFERENCES contacts(id),
  transcript TEXT,
  summary TEXT,
  action_items TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gamification
CREATE TABLE gamification_profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id),
  level INT DEFAULT 1,
  total_xp INT DEFAULT 0,
  current_xp INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_activity_date DATE,
  badges TEXT[]
);

CREATE TABLE xp_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  points INT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  target INT,
  current INT DEFAULT 0,
  xp_reward INT,
  badge_reward TEXT,
  expires_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT FALSE
);
```

### 2. Authentication (Priority: High)

**Options**:
- Supabase Auth (recommended for quick setup)
- Custom JWT with IONOS VM

**Features needed**:
- Email/password login
- OAuth (Google, LinkedIn)
- Role-based access (admin, user, viewer)
- Team/organization support
- Session management

### 3. API Layer (Priority: High)

**Technology**: Edge Functions (Supabase) or FastAPI on IONOS VM

**Endpoints needed**:

```
# Auth
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

# Contacts
GET    /api/contacts
POST   /api/contacts
PUT    /api/contacts/:id
DELETE /api/contacts/:id
POST   /api/contacts/import  # CSV/JSON import

# Deals
GET    /api/deals
POST   /api/deals
PUT    /api/deals/:id
DELETE /api/deals/:id

# Tasks
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id

# Campaigns
GET    /api/campaigns
POST   /api/campaigns
PUT    /api/campaigns/:id
POST   /api/campaigns/:id/send
POST   /api/campaigns/:id/pause

# AI Features
POST   /api/ai/email-generate
POST   /api/ai/call-summary
POST   /api/ai/pitch-search
POST   /api/ai/insights

# Analytics
GET    /api/analytics/overview
GET    /api/analytics/campaigns
GET    /api/analytics/deals
```

### 4. Email Integration (Priority: Medium)

**Options**:
- Resend (recommended, simple API)
- SendGrid (enterprise features)
- Custom SMTP

**Features**:
- Transactional email sending
- Open/click tracking via webhooks
- Unsubscribe handling
- Rate limiting (default 50/day per user)
- Bounce handling

### 5. LinkedIn Automation (Priority: Medium)

**Components**:
- Chrome extension for profile scraping
- Queue system for rate-limited actions
- Connection request automation
- InMail drafting

**Considerations**:
- LinkedIn ToS compliance
- Rate limiting (max 100 connections/week)
- Human-like delays between actions

### 6. File Storage (Priority: Low)

**Technology**: IONOS S3 or Supabase Storage

**Use cases**:
- Quote PDF storage
- Contact import files
- Call recording uploads
- Email attachments

### 7. Advanced Analytics (Priority: Low)

**Features**:
- Dashboard with key metrics
- Email campaign performance
- Deal pipeline analytics
- Rep performance scorecards
- Activity heatmaps
- A/B testing for email campaigns

**Implementation**:
- Materialized views for performance
- Daily/weekly automated reports
- Export to CSV/PDF

---

## Deployment Checklist

### Infrastructure Setup
- [ ] Provision PostgreSQL database (Supabase or IONOS VM)
- [ ] Set up S3-compatible storage
- [ ] Configure DNS for custom domain
- [ ] Set up SSL certificates (Let's Encrypt)

### Database Setup
- [ ] Run schema migrations
- [ ] Create database indexes
- [ ] Set up RLS policies (if using Supabase)
- [ ] Configure backup strategy (daily snapshots)

### Backend Deployment
- [ ] Deploy API to IONOS VM or Supabase Edge Functions
- [ ] Configure environment variables
- [ ] Set up rate limiting
- [ ] Configure CORS for frontend domain

### Frontend Deployment
- [ ] Build production bundle
- [ ] Deploy to CDN or IONOS hosting
- [ ] Configure service worker for offline support
- [ ] Set up error tracking (Sentry)

### Security
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting per user/IP
- [ ] Audit logging

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Database query performance monitoring
- [ ] API response time tracking

---

## Migration Strategy

### Phase 1: Database Migration (Week 1)
1. Create production database
2. Run schema migrations
3. Update frontend to use API instead of localStorage
4. Test all CRUD operations

### Phase 2: Authentication (Week 2)
1. Implement auth endpoints
2. Add login/register UI
3. Protect routes
4. Add team/org support

### Phase 3: Email Integration (Week 3)
1. Integrate email provider
2. Set up webhook endpoints
3. Implement tracking
4. Test campaign sending

### Phase 4: Polish & Launch (Week 4)
1. Performance optimization
2. Error handling improvements
3. Documentation
4. User acceptance testing
5. Production launch

---

## Estimated Costs (Monthly)

| Service | Estimated Cost |
|---------|----------------|
| Supabase Pro | $25/mo |
| IONOS VM (if self-hosted) | $10-50/mo |
| Email service (Resend) | $20-100/mo |
| Domain + SSL | $15/year |
| CDN (optional) | $10-20/mo |
| **Total** | **$55-200/mo** |

---

## Contact

For questions about this implementation plan, contact the development team.

Last updated: January 2025
