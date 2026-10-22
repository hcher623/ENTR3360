'use client';

import React from 'react';
import Link from 'next/link';
import { useProfile } from '../context/ProfileContext';
import { PERSONAS } from '../../data/personas.js';

export default function PersonaBar() {
  const { profile, setShowResetDialog, setShowPersonaModal } = useProfile();

  // Determine if current profile matches one of our 3 personas
  const matchedPersona = profile ? (
    PERSONAS.find(p => 
      (profile._personaId && p.id === profile._personaId) ||
      (profile.name && p.name.toLowerCase() === profile.name.toLowerCase())
    )
  ) : null;

  return (
    <div className="persona-bar" id="persona-bar">
      <div className="persona-bar-inner">
        {matchedPersona ? (
          <>
            <div className="persona-bar-info">
              <span className="persona-bar-avatar">{matchedPersona.avatar}</span>
              <div className="persona-bar-text">
                <span className="persona-bar-title">
                  You are exploring as <strong>{matchedPersona.name}</strong>
                </span>
                <span className="persona-bar-desc">
                  ({matchedPersona.role})
                </span>
              </div>
            </div>
            <div className="persona-bar-actions">
              <button 
                className="btn-persona-action btn-persona-change"
                onClick={() => setShowPersonaModal(true)}
                title="Switch to another persona"
              >
                🔄 Change Persona
              </button>
              <button 
                className="btn-persona-action btn-persona-reset"
                onClick={() => setShowResetDialog(true)}
                title="Reset profile and start fresh"
              >
                ✕ Reset
              </button>
            </div>
          </>
        ) : profile ? (
          <>
            <div className="persona-bar-info">
              <span className="persona-bar-avatar">✨</span>
              <div className="persona-bar-text">
                <span className="persona-bar-title">
                  You are exploring as <strong>{profile.name || 'Custom Explorer'}</strong>
                </span>
                <span className="persona-bar-desc">
                  ({profile.interests?.length || 0} interests · {profile.skills?.length || 0} skills)
                </span>
              </div>
            </div>
            <div className="persona-bar-actions">
              <button 
                className="btn-persona-action btn-persona-change"
                onClick={() => setShowPersonaModal(true)}
                title="Try exploring as Priya, Marcus, or Leah"
              >
                👥 Try a Demo Persona
              </button>
              <Link 
                href="/discover"
                className="btn-persona-action"
                style={{ textDecoration: 'none' }}
              >
                ✎ Edit Answers
              </Link>
              <button 
                className="btn-persona-action btn-persona-reset"
                onClick={() => setShowResetDialog(true)}
                title="Reset answers"
              >
                ✕ Reset
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="persona-bar-info">
              <span className="persona-bar-avatar">🧭</span>
              <div className="persona-bar-text">
                <span className="persona-bar-title">
                  <strong>Try exploring as a sample student</strong>
                </span>
                <span className="persona-bar-desc">
                  See how Priya, Marcus, or Leah discover their best career paths.
                </span>
              </div>
            </div>
            <div className="persona-bar-actions">
              <button 
                className="btn-persona-action btn-persona-highlight"
                onClick={() => setShowPersonaModal(true)}
              >
                👥 Choose a Persona
              </button>
              <Link 
                href="/discover"
                className="btn-persona-action"
                style={{ textDecoration: 'none' }}
              >
                Start Discovery →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
