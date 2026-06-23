import { supabase } from '@/integrations/supabase/client';

/**
 * All localStorage keys that should be mirrored to the cloud.
 * Each becomes a row in public.user_data keyed by this string.
 */
export const SYNCED_KEYS = [
  'onx.contacts',
  'onx.deals',
  'onx.tasks',
  'onx.call_logs',
  'onx.campaigns',
  'onx.templates',
  'onx.pitches',
  'onx.knowledge',
  'onx.phone_scripts',
  'onx.gamification.profile',
  'onx.gamification.events',
  'onx.gamification.badges',
  'onx.gamification.quests',
  'onx.onboarded',
  'onx.demo.seeded',
] as const;

const pendingPushes = new Map<string, ReturnType<typeof setTimeout>>();
let syncSuspended = false;

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export function suspendCloudSync(fn: () => void | Promise<void>) {
  syncSuspended = true;
  try {
    return fn();
  } finally {
    syncSuspended = false;
  }
}

export const cloudSync = {
  /** Pull every synced key from cloud → localStorage. Run after sign-in. */
  async pullAll(): Promise<void> {
    const uid = await currentUserId();
    if (!uid) return;

    const { data, error } = await supabase
      .from('user_data')
      .select('key, data')
      .eq('user_id', uid);

    if (error) {
      console.warn('[cloudSync] pullAll failed', error);
      return;
    }

    syncSuspended = true;
    try {
      for (const row of data ?? []) {
        try {
          localStorage.setItem(row.key, JSON.stringify(row.data));
        } catch (e) {
          console.warn('[cloudSync] write to localStorage failed', row.key, e);
        }
      }
    } finally {
      syncSuspended = false;
    }
  },

  /** Push a single key from localStorage → cloud. Debounced per-key. */
  pushKey(key: string): void {
    if (!SYNCED_KEYS.includes(key as any)) return;
    const existing = pendingPushes.get(key);
    if (existing) clearTimeout(existing);
    const t = setTimeout(() => doPush(key), 300);
    pendingPushes.set(key, t);
  },

  /** Immediate push (no debounce). */
  async pushKeyNow(key: string): Promise<void> {
    await doPush(key);
  },

  /** Push every synced key from localStorage → cloud right now. */
  async pushAll(): Promise<void> {
    await Promise.all(SYNCED_KEYS.map(k => doPush(k)));
  },

  /** Remove all synced keys from local storage (e.g. on sign-out). */
  clearLocal(): void {
    for (const k of SYNCED_KEYS) localStorage.removeItem(k);
  },

  /** Wipe all of this user's cloud data. */
  async clearCloud(): Promise<void> {
    const uid = await currentUserId();
    if (!uid) return;
    await supabase.from('user_data').delete().eq('user_id', uid);
  },
};

async function doPush(key: string): Promise<void> {
  const uid = await currentUserId();
  if (!uid) return;

  const raw = localStorage.getItem(key);
  if (raw === null) {
    // Treat removal as a cloud delete for that key
    await supabase.from('user_data').delete().eq('user_id', uid).eq('key', key);
    return;
  }

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = raw;
  }

  const { error } = await supabase
    .from('user_data')
    .upsert(
      { user_id: uid, key, data: parsed },
      { onConflict: 'user_id,key' },
    );

  if (error) console.warn('[cloudSync] push failed', key, error);
}

/**
 * Monkey-patch localStorage.setItem / removeItem so every existing storage
 * module automatically syncs to cloud without per-module changes.
 */
let installed = false;
export function installAutoSync() {
  if (installed) return;
  installed = true;

  const origSet = localStorage.setItem.bind(localStorage);
  const origRemove = localStorage.removeItem.bind(localStorage);

  localStorage.setItem = (key: string, value: string) => {
    origSet(key, value);
    if (SYNCED_KEYS.includes(key as any)) cloudSync.pushKey(key);
  };

  localStorage.removeItem = (key: string) => {
    origRemove(key);
    if (SYNCED_KEYS.includes(key as any)) cloudSync.pushKey(key);
  };
}
