'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProfile } from '../context/ProfileContext';
import { matchCareers } from '../../engine/matcher.js';
import { SECTORS } from '../../data/careers.js';

export default function RecommendationsPage() {
  const { profile, bookmarks, toggleBookmark, isLoaded } = useProfile();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('score');

  if (!isLoaded) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        Loading recommendations...
      </div>
    );
  }

  if (!profile || (!profile.interests?.length && !profile.skills?.length)) {
    return (
      <div className="page container-narrow" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎯</div>
        <h2 className="font-display" style={{ fontSize: '2.25rem', marginBottom: 'var(--space-xs)' }}>No recommendations yet</h2>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: 'var(--space-xl)' }}>
          We need a completed discovery profile to analyze your traits and match you with suitable careers.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
          <Link href="/discover" className="btn btn-primary btn-lg">Build Your Profile →</Link>
          <Link href="/" className="btn btn-secondary btn-lg">Try a Demo Persona</Link>
        </div>
      </div>
    );
  }

  const allMatches = matchCareers(profile);

  let filtered = [...allMatches];

  if (activeFilter !== 'all') {
    filtered = filtered.filter(r => {
      const slug = r.career.field.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return slug === activeFilter || r.career.field === activeFilter;
    });
  }

  if (activeSort === 'salary') {
    filtered.sort((a, b) => b.career.salary.median - a.career.salary.median);
  } else if (activeSort === 'growth') {
    filtered.sort((a, b) => b.career.growthPct - a.career.growthPct);
  } else {
    filtered.sort((a, b) => b.score - a.score);
  }

  return (
    <div className="page" id="recommendations-page">
      {/* Hero Banner */}
      <div className="recs-banner">
        <div className="recs-banner-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-amber-light)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                Personalized Analysis
              </div>
              <h1 className="recs-banner-title">
                {profile.name ? `${profile.name}'s` : 'Your'} Career Matches
              </h1>
              <p className="recs-banner-sub">
                Built specifically from your traits, skills, and values. Each recommendation below details exactly why it fits you — and honestly flags where the friction or trade-offs might be.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', marginTop: 'var(--space-xs)' }}>
              <Link href="/discover" className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
                ✎ Edit answers
              </Link>
              <Link href="/results" className="btn btn-secondary btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
                📋 Profile summary
              </Link>
              <Link href="/dashboard" className="btn btn-primary btn-sm" style={{ background: 'var(--color-cream)', color: 'var(--color-near-black)', borderColor: 'transparent' }}>
                Compare all →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 0 }}>
        {/* Controls: Filters & Sort */}
        <div className="recs-controls">
          <div className="filter-pills">
            <button
              className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Fields ({allMatches.length})
            </button>
            {SECTORS.map(s => {
              const count = allMatches.filter(r => r.career.field === s.name).length;
              if (count === 0) return null;
              return (
                <button
                  key={s.id}
                  className={`filter-pill ${activeFilter === s.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(s.id)}
                >
                  {s.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-warm-gray)' }}>Sort by:</span>
            <select
              id="sort-select"
              className="form-input"
              style={{ padding: '0.4rem 0.8rem', width: 'auto', fontSize: '0.85rem' }}
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
            >
              <option value="score">Highest Match</option>
              <option value="salary">Median Salary</option>
              <option value="growth">Job Growth Rate</option>
            </select>
          </div>
        </div>

        {/* Recommendations List */}
        <div id="recs-list">
          {filtered.length > 0 ? (
            filtered.map((match) => {
              const c = match.career;
              const isBookmarked = bookmarks.includes(c.id);

              return (
                <div key={c.id} className="rec-card" data-career-id={c.id}>
                  {/* Card Header */}
                  <div className="rec-card-header">
                    <div>
                      <span className="rec-field-chip" style={{ background: c.fieldColor || '#1E4030' }}>
                        {c.field}
                      </span>
                      <h2 className="rec-title">{c.title}</h2>
                      <div className="rec-tagline">{c.tagline}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      {/* Bookmark button */}
                      <button
                        className="btn btn-ghost btn-sm bookmark-btn"
                        onClick={() => toggleBookmark(c.id)}
                        title={isBookmarked ? 'Remove bookmark' : 'Save career'}
                      >
                        {isBookmarked ? '★ Saved' : '☆ Save'}
                      </button>

                      {/* Score Meter */}
                      <div className="rec-score-meter" title="Overall compatibility score">
                        <span className="rec-score-num">{match.score}%</span>
                        <span className="rec-score-label">Fit Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.925rem', color: 'var(--color-warm-gray)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
                    {c.description}
                  </p>

                  {/* 4-Pillar Compatibility Breakdown */}
                  <div className="four-pillars">
                    <div className="pillar-item">
                      <div className="pillar-label">
                        <span>Personality</span>
                        <strong>{match.personalityScore}%</strong>
                      </div>
                      <div className="pillar-bar-bg">
                        <div className="pillar-bar-fill" style={{ width: `${match.personalityScore}%` }}></div>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-label">
                        <span>Interests</span>
                        <strong>{match.interestScore}%</strong>
                      </div>
                      <div className="pillar-bar-bg">
                        <div className="pillar-bar-fill" style={{ width: `${match.interestScore}%` }}></div>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-label">
                        <span>Skills</span>
                        <strong>{match.skillsScore}%</strong>
                      </div>
                      <div className="pillar-bar-bg">
                        <div className="pillar-bar-fill" style={{ width: `${match.skillsScore}%` }}></div>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-label">
                        <span>Values</span>
                        <strong>{match.valuesScore}%</strong>
                      </div>
                      <div className="pillar-bar-bg">
                        <div className="pillar-bar-fill" style={{ width: `${match.valuesScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Fit Analysis Grid (Why it fits & Tradeoffs) */}
                  <div className="fit-analysis-grid">
                    {/* Why It Fits */}
                    <div className="fit-box">
                      <div className="fit-box-title">
                        <span>✓</span>
                        <span>Why this career fits you</span>
                      </div>
                      <ul className="analysis-list">
                        {match.matchReasons.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>

                    {/* Tradeoffs / Why It May Not Fit */}
                    <div className="tradeoff-box">
                      <div className="tradeoff-box-title">
                        <span>⚡</span>
                        <span>Tradeoffs & watch-outs</span>
                      </div>
                      <ul className="analysis-list">
                        {match.gapWarnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Stats Row & Deep Dive Link */}
                  <div className="rec-stats-row">
                    <div className="rec-stat-items">
                      <div className="rec-stat-item">
                        <span>Salary:</span>
                        <strong>${(c.salary.low / 1000).toFixed(0)}k – ${(c.salary.high / 1000).toFixed(0)}k</strong>
                        <small style={{ color: 'var(--color-warm-gray-light)', marginLeft: 4 }}>(med: ${(c.salary.median / 1000).toFixed(0)}k)</small>
                      </div>

                      <div className="rec-stat-item">
                        <span>Growth:</span>
                        <strong>+{c.growthPct}% ({c.growth})</strong>
                      </div>

                      <div className="rec-stat-item">
                        <span>Work Setting:</span>
                        <strong>{c.environments.join(', ')}</strong>
                      </div>
                    </div>

                    <Link href={`/career/${c.id}`} className="btn btn-secondary btn-sm" style={{ fontWeight: 600, color: 'var(--color-forest)' }}>
                      Deep dive into {c.title} →
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
              <p style={{ color: 'var(--color-warm-gray)', marginBottom: 'var(--space-md)' }}>No careers found in this field for your current filter.</p>
              <button className="btn btn-secondary" onClick={() => setActiveFilter('all')}>Reset filters</button>
            </div>
          )}
        </div>

        {/* Bottom Explore / Compare Teaser */}
        <div style={{ background: 'var(--color-cream-dark)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
          <h3 className="font-display" style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>Want to compare careers side-by-side?</h3>
          <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.95rem', marginBottom: 'var(--space-lg)', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Open our Interactive Dashboard to compare 2 to 3 careers simultaneously across salaries, daily routines, and skills gaps.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Open Interactive Comparison Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
