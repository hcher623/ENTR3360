'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext(null);

const STORAGE_KEYS = {
  PROFILE: 'careercompass_profile',
  BOOKMARKS: 'careercompass_bookmarks',
  LEGACY_PROFILE: 'myrimaven_profile',
  LEGACY_BOOKMARKS: 'myrimaven_bookmarks'
};

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(null);
  const [bookmarks, setBookmarksState] = useState([]);
  const [toast, setToast] = useState(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage on mount (with backwards compatibility)
  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem(STORAGE_KEYS.LEGACY_PROFILE);
      if (rawProfile) setProfileState(JSON.parse(rawProfile));

      const rawBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || localStorage.getItem(STORAGE_KEYS.LEGACY_BOOKMARKS);
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
      localStorage.removeItem(STORAGE_KEYS.LEGACY_PROFILE);
    } catch (e) {
      console.error('Error resetting profile:', e);
    }
    showToast('Profile reset successfully. Ready for a new start!', 'success');
  };

  const selectPersona = (persona) => {
    if (!persona) return;
    const personaProfile = {
      ...persona.profile,
      _personaId: persona.id,
      _personaRole: persona.role,
      _personaAvatar: persona.avatar,
      _personaBadge: persona.badge
    };
    saveProfile(personaProfile);
    setShowPersonaModal(false);
    showToast(`Now exploring as ${persona.name}!`, 'success');
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
      selectPersona,
      bookmarks,
      toggleBookmark,
      toast,
      showToast,
      showResetDialog,
      setShowResetDialog,
      showPersonaModal,
      setShowPersonaModal,
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
