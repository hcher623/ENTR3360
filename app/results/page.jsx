'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfile } from '../context/ProfileContext';
import { getPersonalityArchetype, matchCareers } from '../../engine/matcher.js';

export default function ResultsPage() {
  const router = useRouter();
  const { profile, setShowResetDialog, isLoaded } = useProfile();

  if (!isLoaded) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        Loading summary...
      </div>
    );
  }

  if (!profile || (!profile.interests?.length && !profile.skills?.length)) {
    return (
      <div className="page container-narrow" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>📋</div>
        <h2 className="font-display" style={{ fontSize: '2.25rem', marginBottom: 'var(--space-xs)' }}>No profile found yet</h2>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: 'var(--space-xl)' }}>
          Complete your 4-step discovery profile first, or try one of our demo profiles to see how it works.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
          <Link href="/discover" className="btn btn-primary btn-lg">Start Discovery →</Link>
          <Link href="/" className="btn btn-secondary btn-lg">View Demo Personas</Link>
        </div>
      </div>
    );
  }

  const archetype = getPersonalityArchetype(profile.personality);
  const allMatches = matchCareers(profile);
  const topMatches = allMatches.slice(0, 3);
  const p = profile.personality || { introvert: 50, analytical: 50, structured: 50, collaborative: 50 };

  return (
    <div className="page container" id="results-page">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <div className="badge-tag">Discovery Summary</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.25rem)', fontWeight: 400, margin: 'var(--space-xs) 0' }}>
            Here's what we know about you{profile.name ? `, ${profile.name}` : ''}.
          </h1>
          <p style={{ color: 'var(--color-warm-gray)', fontSize: '1.05rem', maxWidth: 620 }}>
            Take a moment to review your answers. You can edit any section below, reset and start over, or dive straight into your personalized career matches.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setShowResetDialog(true)}
          >
            🔄 Reset
          </button>
          <Link href="/recommendations" className="btn btn-primary">
            Explore Matches ({allMatches.length}) →
          </Link>
        </div>
      </div>

      {/* Personality Archetype Banner */}
      <div className="summary-hero-card">
        <span className="summary-hero-emoji">{archetype.emoji}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-amber-light)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
            Your Personality Archetype
          </div>
          <h2 className="summary-hero-archetype">{archetype.name}</h2>
          <p className="summary-hero-desc">{archetype.desc}</p>
        </div>
      </div>

      {/* 4 Structured Dimension Cards with "Edit this section" buttons */}
      <div className="summary-sections-grid">
        {/* Section 1: How You Work */}
        <div className="summary-card">
          <div className="summary-card-header">
            <h3 className="summary-card-title">⚙️ How You Work</h3>
            <button 
              className="btn-edit-section" 
              onClick={() => router.push('/discover?step=1')}
            >
              Edit this section ✎
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', flex: 1 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-warm-gray)', marginBottom: '0.2rem' }}>
                <span>Focused Solo ({100 - p.introvert}%)</span>
                <span>Collaboration ({p.introvert}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-cream-deeper)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.introvert}%`, background: 'var(--color-forest)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-warm-gray)', marginBottom: '0.2rem' }}>
                <span>Analytical Logic ({100 - p.analytical}%)</span>
                <span>Creative Intuition ({p.analytical}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-cream-deeper)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.analytical}%`, background: 'var(--color-forest)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-warm-gray)', marginBottom: '0.2rem' }}>
                <span>Structured Process ({100 - p.structured}%)</span>
                <span>Adaptability ({p.structured}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-cream-deeper)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.structured}%`, background: 'var(--color-forest)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-warm-gray)', marginBottom: '0.2rem' }}>
                <span>Deep Ownership ({100 - p.collaborative}%)</span>
                <span>Team Co-Creation ({p.collaborative}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-cream-deeper)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.collaborative}%`, background: 'var(--color-forest)', borderRadius: 'var(--radius-full)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Interests & Domains */}
        <div className="summary-card">
          <div className="summary-card-header">
            <h3 className="summary-card-title">🌟 Interests & Domains ({profile.interests?.length || 0})</h3>
            <button 
              className="btn-edit-section" 
              onClick={() => router.push('/discover?step=2')}
            >
              Edit this section ✎
            </button>
          </div>
          <div className="summary-tags-wrap">
            {profile.interests?.map(i => (
              <span key={i} className="summary-tag">{i}</span>
            ))}
          </div>
        </div>

        {/* Section 3: Skills & Strengths */}
        <div className="summary-card">
          <div className="summary-card-header">
            <h3 className="summary-card-title">💪 Capabilities & Strengths ({profile.skills?.length || 0})</h3>
            <button 
              className="btn-edit-section" 
              onClick={() => router.push('/discover?step=3')}
            >
              Edit this section ✎
            </button>
          </div>
          <div className="summary-tags-wrap">
            {profile.skills?.map(s => (
              <span key={s} className="summary-tag">{s}</span>
            ))}
          </div>
        </div>

        {/* Section 4: Values & Setting */}
        <div className="summary-card">
          <div className="summary-card-header">
            <h3 className="summary-card-title">🧭 Values & Environment</h3>
            <button 
              className="btn-edit-section" 
              onClick={() => router.push('/discover?step=4')}
            >
              Edit this section ✎
            </button>
          </div>
          <div style={{ marginBottom: 'var(--space-sm)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)', marginBottom: '0.25rem' }}>Work Setting:</div>
            <span className="summary-tag" style={{ background: 'var(--color-forest-tint)', color: 'var(--color-forest)', fontWeight: 600 }}>
              {profile.environment || 'No preference'}
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)', marginBottom: '0.25rem' }}>Core Priorities:</div>
          <div className="summary-tags-wrap">
            {profile.values?.map(v => (
              <span key={v} className="summary-tag">{v}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Match Preview Section */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-lg)' }}>
          <div>
            <h3 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 400 }}>Your Top Matches Preview</h3>
            <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.925rem' }}>Here is a first look at the careers most compatible with your profile.</p>
          </div>
          <Link href="/recommendations" style={{ color: 'var(--color-forest)', fontSize: '0.9rem', fontWeight: 600 }}>
            See all {allMatches.length} recommendations →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
          {topMatches.map(r => (
            <div 
              key={r.career.id}
              className="card card-hover" 
              style={{ cursor: 'pointer' }} 
              onClick={() => router.push(`/career/${r.career.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                <span className="badge-tag" style={{ fontSize: '0.7rem' }}>{r.career.field}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-forest)', fontSize: '1.15rem' }}>{r.score}% Match</span>
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0.35rem 0 0.2rem' }}>{r.career.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-warm-gray)', marginBottom: 'var(--space-md)' }}>{r.career.tagline}</p>
              
              <div style={{ fontSize: '0.825rem', color: 'var(--color-forest)', background: 'var(--color-forest-tint)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xs)' }}>
                ✓ {r.matchReasons[0] || 'Strong alignment with your profile.'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--color-amber)', background: 'var(--color-amber-tint)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)' }}>
                ⚡ {r.gapWarnings[0] || 'Check required qualifications and environment.'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="summary-cta-bar">
        <div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.2rem' }}>Looks good to you?</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-warm-gray)' }}>Explore detailed match breakdowns, why each career fits, and tradeoffs to consider.</p>
        </div>
        <Link href="/recommendations" className="btn btn-primary btn-lg">
          Show My Recommendations →
        </Link>
      </div>
    </div>
  );
}
