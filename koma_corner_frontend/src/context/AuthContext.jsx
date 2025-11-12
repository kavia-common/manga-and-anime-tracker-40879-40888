import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Shape of values we expose - minimal but useful for UI
const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
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
   * - Surfaces loading and error states for UI feedback
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial session and subscribe to changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Auth getSession error:', sessionError);
          if (mounted) setError(sessionError.message || 'Failed to get session');
        }
        if (!mounted) return;
        setUser(session?.user ?? null);
      } catch (e) {
        console.error('Auth init error:', e);
        if (mounted) setError(e.message || 'Auth initialization failed');
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

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      signInWithGoogle: async () => {
        /**
         * PUBLIC_INTERFACE
         * Initiate Google OAuth sign in using Supabase.
         * Note: Requires REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in the environment.
         */
        try {
          setError(null);
          const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
          await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: siteUrl,
            },
          });
        } catch (e) {
          console.error('signInWithGoogle error:', e);
          setError(e.message || 'Sign-in failed');
        }
      },
      signOut: async () => {
        /**
         * PUBLIC_INTERFACE
         * Signs out the current user.
         */
        try {
          setError(null);
          await supabase.auth.signOut();
        } catch (e) {
          console.error('signOut error:', e);
          setError(e.message || 'Sign-out failed');
        }
      },
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
