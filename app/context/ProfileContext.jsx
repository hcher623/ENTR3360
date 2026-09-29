'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext(null);

const STORAGE_KEYS = {
  PROFILE: 'myrimaven_profile',
  BOOKMARKS: 'myrimaven_bookmarks'
};

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(null);
  const [bookmarks, setBookmarksState] = useState([]);
  const [toast, setToast] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (rawProfile) setProfileState(JSON.parse(rawProfile));

      const rawBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (rawBookmarks) setBookmarksState(JSON.parse(rawBookmarks));
    } catch (e) {
      console.error('Error loading stored profile:', e);
    }
    setIsLoaded(true);
  }, []);

  const saveProfile = (newProfile) => {
    setProfileState(newProfile);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  const resetProfile = () => {
    setProfileState(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch (e) {
      console.error('Error resetting profile:', e);
    }
    showToast('Profile reset successfully. Ready for a new start!', 'success');
  };

  const toggleBookmark = (careerId) => {
    setBookmarksState(prev => {
      const exists = prev.includes(careerId);
      const updated = exists ? prev.filter(id => id !== careerId) : [...prev, careerId];
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving bookmarks:', e);
      }
      showToast(exists ? 'Removed from saved careers' : 'Career saved to bookmarks!', 'info');
      return updated;
    });
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      saveProfile,
      resetProfile,
      bookmarks,
      toggleBookmark,
      toast,
      showToast,
      showResetDialog,
      setShowResetDialog,
      isLoaded
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
