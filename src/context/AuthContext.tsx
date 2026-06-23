import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cloudSync } from '@/lib/cloudSync';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  hydrating: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrating, setHydrating] = useState(false);

  useEffect(() => {
    // Listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Hydrate cloud → localStorage on each sign-in (deferred to avoid deadlock)
        setTimeout(async () => {
          setHydrating(true);
          try {
            await cloudSync.pullAll();
          } finally {
            setHydrating(false);
            window.dispatchEvent(new Event('cloud-sync-complete'));
          }
        }, 0);
      }
    });

    // Then read existing session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);

      if (s?.user) {
        setHydrating(true);
        cloudSync.pullAll().finally(() => {
          setHydrating(false);
          window.dispatchEvent(new Event('cloud-sync-complete'));
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: displayName ? { display_name: displayName } : undefined,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    cloudSync.clearLocal();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, hydrating, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
