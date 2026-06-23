# Make Outreach Nexus a Real, Cloud-Backed Personal CRM

## Goal

Turn the app from a localStorage demo into a working single-user CRM you can actually use day-to-day: data lives in the cloud (survives device changes, browser clears), you log in with email + password, and every sidebar link goes somewhere real.

---

## Phase 1 — Enable Cloud + Auth

1. Enable Lovable Cloud (Postgres + auth + edge functions).
2. Add email + password auth:
   - `/auth` page (sign in / sign up tabs)
   - Protected route wrapper — redirects to `/auth` if not signed in
   - Sign-out button in sidebar footer
   - Single-user friendly: first signup works, optional "disable new signups" toggle later
3. Minimal `profiles` table (id, email, display_name) auto-created on signup via trigger.

## Phase 2 — Database Schema

Create cloud tables mirroring current localStorage models, all scoped by `user_id` with RLS so only you see your data:

- `contacts`, `deals`, `tasks`, `call_logs`, `campaigns`, `email_templates`, `pitches`, `knowledge_entries`, `phone_scripts`
- `gamification_profiles`, `xp_events`
- Each table: `user_id uuid references auth.users`, RLS policies `auth.uid() = user_id` for select/insert/update/delete, proper GRANTs to `authenticated` + `service_role`.

## Phase 3 — Storage Layer Migration

Rewrite each `src/lib/*Storage.ts` module to call Supabase instead of localStorage, keeping the same function signatures so components don't need rewrites:

- `contactStorage`, `dealStorage`, `taskStorage`, `callLogStorage`, `campaignStorage`, `templateStorage`, `pitchStorage`, `knowledgeStorage`, `gamificationStorage`
- Convert to async (`await`) — update callers to handle promises (mostly `useEffect` + `useState` already)
- One-time migration helper: on first login, if localStorage has data, offer "Import my local data to cloud" button in Settings.

## Phase 4 — Sidebar & Route Audit

Full audit of `AppSidebar.tsx` and every route in `App.tsx`. Goal: every sidebar item links to a working page.

Current sidebar items to verify/fix:
- Today, Contacts, Deals, Campaigns, Call Notes, Content Hub (Pitches/Knowledge/Scripts), Analytics, Settings
- Any "Sequences", "Insights", "Quotes" or other items that are dead → either build a minimal page or remove from sidebar
- Add missing route definitions in `App.tsx`
- Fix broken buttons inside pages (e.g. "New Campaign", "Generate Quote") to open their dialogs/flows

I'll do the audit during build and list every broken link I find + how I fixed it.

## Phase 5 — Settings & Polish

- Settings page: account info, sign out, "Load demo data" / "Clear my data" (now cloud-scoped), data export (CSV)
- Remove the auto-seed on app load — replace with onboarding modal choice (already exists, just needs to write to cloud)
- Loading + empty states across all pages

---

## Out of Scope (for this pass)

- Real email sending (Resend) — wire up later when you want to actually send campaigns
- Multi-user / teams
- LinkedIn scraper backend
- Odoo integration (the HANDOFF.md stays as the future roadmap)

---

## Technical Notes

- Auth: Supabase email/password, `onAuthStateChange` listener in a top-level `AuthProvider`, `getUser()` for trust checks.
- All storage modules become async — components using them need `await` and loading states. Most already use `useEffect` so the change is localized.
- Gamification XP events become inserts into `xp_events`; profile stats computed via a view or aggregated on read.
- IONOS AI calls stay client-side for now (key is already in the app); can move to edge functions later.
- Estimated work: ~3–4 hours of build time.

## Files

**New:**
- `src/pages/Auth.tsx`
- `src/components/ProtectedRoute.tsx`
- `src/context/AuthContext.tsx`
- Cloud migrations for all tables + RLS + GRANTs

**Modified (storage → async + cloud):**
- `src/lib/{contact,deal,task,callLog,campaign,template,pitch,knowledge,gamification}Storage.ts`

**Modified (UI):**
- `src/App.tsx` — wrap in AuthProvider, add `/auth`, add ProtectedRoute, fix missing routes
- `src/components/AppSidebar.tsx` — audit links, add sign-out
- `src/pages/Settings.tsx` — account section, cloud-aware reset
- Component-level fixes for any broken in-page buttons found in audit
