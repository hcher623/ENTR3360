'use client';

import React from 'react';
import { PERSONAS } from '../../data/personas.js';
import { useProfile } from '../context/ProfileContext';

export default function PersonaModal() {
  const { showPersonaModal, setShowPersonaModal, selectPersona, profile, resetProfile } = useProfile();

  if (!showPersonaModal) return null;

  const currentPersonaId = profile?._personaId || (
    profile?.name ? PERSONAS.find(p => p.name.toLowerCase() === profile.name.toLowerCase())?.id : null
  );

  return (
    <div className="modal-overlay" onClick={() => setShowPersonaModal(false)}>
      <div 
        className="persona-modal-card"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="persona-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="persona-modal-header">
          <div>
            <div className="badge-tag">Demo Explorer</div>
            <h2 id="persona-modal-title" className="font-display" style={{ fontSize: '1.75rem', margin: 'var(--space-2xs) 0' }}>
              Explore as a Demo Persona
            </h2>
            <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.925rem' }}>
              Switch perspectives instantly to see how recommendations and fit scores adapt to different personalities, skills, and values.
            </p>
          </div>
          <button 
            className="persona-modal-close" 
            onClick={() => setShowPersonaModal(false)}
            aria-label="Close persona modal"
          >
            ✕
          </button>
        </div>

        <div className="persona-modal-grid">
          {PERSONAS.map(p => {
            const isCurrent = currentPersonaId === p.id;
            return (
              <div 
                key={p.id} 
                className={`persona-modal-item ${isCurrent ? 'active' : ''}`}
                onClick={() => selectPersona(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && selectPersona(p)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xs)' }}>
                  <span style={{ fontSize: '2rem' }}>{p.avatar}</span>
                  <span className="persona-badge">{p.badge}</span>
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.2rem 0' }}>{p.name}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-forest)', fontWeight: 500, marginBottom: '0.5rem' }}>
                  {p.role}
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-gray)', lineHeight: 1.45, flex: 1, marginBottom: 'var(--space-md)' }}>
                  {p.description}
                </p>
                <button 
                  className={`btn ${isCurrent ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ width: '100%', pointerEvents: 'none' }}
                >
                  {isCurrent ? '✓ Currently Exploring' : `Explore as ${p.name} →`}
                </button>
              </div>
            );
          })}
        </div>

        <div className="persona-modal-footer">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => {
              resetProfile();
              setShowPersonaModal(false);
            }}
          >
            Start fresh with custom answers
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowPersonaModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
