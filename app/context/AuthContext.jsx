'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Context & storage
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'myrimaven_auth';

/**
 * Very lightweight "hash" for client-side password storage.
 * NOTE: This is NOT cryptographically secure — it is only appropriate for a
 * demo/prototype where there is no real backend. Replace with a proper auth
 * provider (e.g. NextAuth, Supabase, Firebase) for production.
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { name, email, passwordHash }
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error('AuthContext: error loading stored user:', e);
    }
    setIsAuthLoaded(true);
  }, []);

  // -------------------------------------------------------------------------
  // Sign up — creates a new account (overwrites any existing local account)
  // -------------------------------------------------------------------------
  const signUp = useCallback(async ({ name, email, password }) => {
    setAuthError(null);
    if (!name || !email || !password) {
      const msg = 'Name, email, and password are all required.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      const passwordHash = await hashPassword(password);
      const newUser = { name: name.trim(), email: email.trim().toLowerCase(), passwordHash };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (e) {
      const msg = 'An unexpected error occurred during sign up.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // -------------------------------------------------------------------------
  // Sign in — validates credentials against stored account
  // -------------------------------------------------------------------------
  const signIn = useCallback(async ({ email, password }) => {
    setAuthError(null);
    if (!email || !password) {
      const msg = 'Email and password are required.';
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        const msg = 'No account found. Please sign up first.';
        setAuthError(msg);
        return { success: false, error: msg };
      }

      const stored = JSON.parse(raw);
      if (stored.email !== email.trim().toLowerCase()) {
        const msg = 'Email or password is incorrect.';
        setAuthError(msg);
        return { success: false, error: msg };
      }

      const passwordHash = await hashPassword(password);
      if (stored.passwordHash !== passwordHash) {
        const msg = 'Email or password is incorrect.';
        setAuthError(msg);
        return { success: false, error: msg };
      }

      setUser(stored);
      return { success: true };
    } catch (e) {
      const msg = 'An unexpected error occurred during sign in.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // -------------------------------------------------------------------------
  // Sign out — clears session state (does NOT delete the stored account)
  // -------------------------------------------------------------------------
  const signOut = useCallback(() => {
    setUser(null);
    setAuthError(null);
  }, []);

  // -------------------------------------------------------------------------
  // Update profile fields (name / email / password)
  // -------------------------------------------------------------------------
  const updateUser = useCallback(async ({ name, email, newPassword } = {}) => {
    setAuthError(null);
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      const base = raw ? JSON.parse(raw) : {};
      const updated = {
        ...base,
        ...(name        !== undefined ? { name: name.trim() }                             : {}),
        ...(email       !== undefined ? { email: email.trim().toLowerCase() }             : {}),
        ...(newPassword               ? { passwordHash: await hashPassword(newPassword) } : {}),
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
      return { success: true };
    } catch (e) {
      const msg = 'An unexpected error occurred while updating your profile.';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // -------------------------------------------------------------------------
  // Delete account
  // -------------------------------------------------------------------------
  const deleteAccount = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setAuthError(null);
  }, []);

  // -------------------------------------------------------------------------
  // Convenience derived state
  // -------------------------------------------------------------------------
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        // State
        user,            // { name, email, passwordHash } | null
        isAuthenticated,
        isAuthLoaded,
        authError,
        setAuthError,
        // Actions
        signUp,
        signIn,
        signOut,
        updateUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
