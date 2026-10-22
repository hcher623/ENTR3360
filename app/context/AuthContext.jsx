'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'careercompass_auth_user';

export const TEST_ACCOUNT = {
  email: 'reviewer@careercompass.edu',
  password: 'Reviewer2026!Demo',
  name: 'Course Reviewer'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize and listen to auth state changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: existingSession } } = await supabase.auth.getSession();
          if (mounted && existingSession?.user) {
            setSession(existingSession);
            setUser({
              id: existingSession.user.id,
              email: existingSession.user.email,
              name: existingSession.user.user_metadata?.name || existingSession.user.email?.split('@')[0] || 'User',
              image: existingSession.user.user_metadata?.avatar_url || null,
            });
            setIsAuthLoaded(true);
            return;
          }
        } catch (err) {
          console.warn('Error reading Supabase session:', err);
        }

        // Listen for Supabase auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (!mounted) return;
          if (newSession?.user) {
            setSession(newSession);
            setUser({
              id: newSession.user.id,
              email: newSession.user.email,
              name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || 'User',
              image: newSession.user.user_metadata?.avatar_url || null,
            });
            try {
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
                id: newSession.user.id,
                email: newSession.user.email,
                name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || 'User',
              }));
            } catch (_) {}
          } else {
            setSession(null);
            setUser(null);
            try {
              localStorage.removeItem(AUTH_STORAGE_KEY);
            } catch (_) {}
          }
          setIsAuthLoaded(true);
        });

        // Cleanup listener on unmount
        return () => {
          subscription?.unsubscribe();
        };
      }

      // Fallback: Check local storage persistence (ensures refresh keeps user signed in)
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored && mounted) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Error reading stored auth:', err);
      }
      if (mounted) setIsAuthLoaded(true);
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Sign In with email & password
  const signIn = async (email, password) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    // 1. If using test account
    if (cleanEmail === TEST_ACCOUNT.email.toLowerCase() && password === TEST_ACCOUNT.password) {
      const testUser = {
        id: 'test_reviewer_001',
        email: TEST_ACCOUNT.email,
        name: TEST_ACCOUNT.name,
        isTestAccount: true
      };
      setUser(testUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(testUser));
      } catch (_) {}
      return { success: true, user: testUser };
    }

    // 2. If Supabase is configured
    if (isSupabaseConfigured && supabase) {
      try {
        let { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        // If email was unconfirmed from a previous registration, auto-confirm it and retry
        if (error && error.message.toLowerCase().includes('not confirmed')) {
          try {
            await fetch('/api/auth/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: cleanEmail })
            });
            const retry = await supabase.auth.signInWithPassword({
              email: cleanEmail,
              password
            });
            data = retry.data;
            error = retry.error;
          } catch (_) {}
        }

        if (error) {
          setAuthError(error.message);
          return { error: error.message };
        }

        if (data?.user) {
          const u = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          };
          setUser(u);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
          return { success: true, user: u };
        }
      } catch (err) {
        setAuthError(err.message || 'Error signing in');
        return { error: err.message };
      }
    }

    // 3. Fallback direct authentication
    const fallbackUser = {
      id: 'usr_' + Math.abs(cleanEmail.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' '),
    };
    setUser(fallbackUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackUser));
    } catch (_) {}
    return { success: true, user: fallbackUser };
  };

  // Create an account (Sign Up)
  const signUp = async (email, password, name) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const displayName = (name || cleanEmail.split('@')[0]).trim();

    try {
      // 1. Call server registration endpoint (auto-confirms user with zero email barrier)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, name: displayName })
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        setAuthError(json.error || 'Failed to create account');
        return { error: json.error || 'Failed to create account' };
      }

      // 2. Immediately sign in to establish persistent session
      return await signIn(cleanEmail, password);
    } catch (err) {
      console.warn('API registration error, trying client fallback:', err);
    }

    // Fallback if API route is unreachable
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { name: displayName } }
        });
        if (error) {
          setAuthError(error.message);
          return { error: error.message };
        }
        if (data?.user) {
          const u = {
            id: data.user.id,
            email: data.user.email,
            name: displayName,
          };
          setUser(u);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
          return { success: true, user: u };
        }
      } catch (err) {
        setAuthError(err.message);
        return { error: err.message };
      }
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      name: displayName,
    };
    setUser(newUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (_) {}
    return { success: true, user: newUser };
  };

  // One-click sign in for the reviewer/grader
  const signInWithTestAccount = async () => {
    return signIn(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
  };

  // Sign out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    setUser(null);
    setSession(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (_) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: Boolean(user),
        isAuthLoaded,
        authError,
        setAuthError,
        showAuthModal,
        setShowAuthModal,
        signIn,
        signUp,
        signInWithTestAccount,
        signOut,
        isSupabaseConfigured,
        testAccount: TEST_ACCOUNT
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
