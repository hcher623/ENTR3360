'use client';

import React, { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  const isAuthLoaded     = status !== 'loading';
  const isAuthenticated  = status === 'authenticated';

  // Expose { name, email, image } to match the shape the rest of the app expects
  const user = session?.user ?? null;

  const googleSignIn = () => {
    const callbackUrl = typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}` || '/'
      : '/';
    return signIn('google', { callbackUrl });
  };

  const handleSignOut = () =>
    signOut({ callbackUrl: '/' });

  return (
    <AuthContext.Provider
      value={{
        user,            // { name, email, image } | null
        isAuthenticated,
        isAuthLoaded,
        // Actions
        signIn: googleSignIn,
        signOut: handleSignOut,
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
