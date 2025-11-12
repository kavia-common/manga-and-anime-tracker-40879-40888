import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Shape of user we expose - we keep it minimal
const AuthContext = createContext({
  user: null,
  loading: true,
  // PUBLIC_INTERFACE
  signInWithGoogle: async () => {},
  // PUBLIC_INTERFACE
  signOut: async () => {},
});

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context with current user and helper methods. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides authenticated user state using Supabase auth.
   * - Tracks session via onAuthStateChange
   * - Exposes signInWithGoogle and signOut
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial session and subscribe to changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error('Auth getSession error:', error);
        if (!mounted) return;
        setUser(session?.user ?? null);
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signInWithGoogle: async () => {
      /**
       * PUBLIC_INTERFACE
       * Initiate Google OAuth sign in using Supabase.
       * Note: Requires REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in the environment.
       */
      const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
      // emailRedirectTo is important for Supabase hosted flows; this is a no-op if not required.
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: siteUrl,
        },
      });
    },
    signOut: async () => {
      /**
       * PUBLIC_INTERFACE
       * Signs out the current user.
       */
      await supabase.auth.signOut();
    },
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
