'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CAREERS, SECTORS } from '../../data/careers.js';
import { matchCareers } from '../../engine/matcher.js';
import { useProfile } from '../context/ProfileContext';

export default function DashboardPage() {
  const { profile, bookmarks, toggleBookmark, setShowResetDialog } = useProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeField, setActiveField] = useState('all');
  const [activeSort, setActiveSort] = useState('score');
  const [compareIds, setCompareIds] = useState([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  const allResults = profile ? matchCareers(profile) : CAREERS.map(c => ({
    career: c,
    score: 0,
    personalityScore: 0,
    interestScore: 0,
    skillsScore: 0,
    valuesScore: 0,
    matchReasons: ['Complete discovery to see personalized reasons.'],
    gapWarnings: ['Complete discovery to see personalized watch-outs.']
  }));

  let filtered = [...allResults];

  if (showOnlyBookmarks) {
    filtered = filtered.filter(r => bookmarks.includes(r.career.id));
  }

  if (activeField !== 'all') {
    filtered = filtered.filter(r => {
      const slug = r.career.field.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return slug === activeField || r.career.field === activeField;
    });
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(r =>
      r.career.title.toLowerCase().includes(q) ||
      r.career.field.toLowerCase().includes(q) ||
      r.career.tagline.toLowerCase().includes(q) ||
      r.career.requiredSkills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (activeSort === 'salary') {
    filtered.sort((a, b) => b.career.salary.median - a.career.salary.median);
  } else if (activeSort === 'growth') {
    filtered.sort((a, b) => b.career.growthPct - a.career.growthPct);
  } else if (activeSort === 'alpha') {
    filtered.sort((a, b) => a.career.title.localeCompare(b.career.title));
  } else if (profile) {
    filtered.sort((a, b) => b.score - a.score);
  }

  const comparedCareers = allResults.filter(r => compareIds.includes(r.career.id));

  const handleCompareToggle = (cid) => {
    if (compareIds.includes(cid)) {
      setCompareIds(compareIds.filter(id => id !== cid));
    } else {
      if (compareIds.length >= 3) {
        alert('You can compare up to 3 careers at once.');
        return;
      }
      setCompareIds([...compareIds, cid]);
      setIsCompareMode(true);
    }
  };

  return (
    <div className="page container" id="dashboard-page">
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <div className="badge-tag">Interactive Explorer & Comparison Hub</div>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.25rem)', fontWeight: 400, margin: 'var(--space-xs) 0' }}>
            {profile ? `${profile.name || 'Your'} Career Landscape` : 'Explore All Careers'}
          </h1>
          <p style={{ color: 'var(--color-warm-gray)', fontSize: '1.05rem', maxWidth: 650 }}>
            {profile 
              ? 'Search, filter, or select 2 to 3 careers to compare side-by-side. Tweak answers or reset anytime.' 
              : 'Browse all 15 careers or complete your discovery profile to see personalized compatibility scores.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={`btn ${isCompareMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setIsCompareMode(!isCompareMode)}
          >
            ⚖️ {isCompareMode ? `Comparing (${compareIds.length}/3)` : 'Compare mode'}
          </button>
          <Link href="/discover" className="btn btn-secondary btn-sm">
            ✎ Edit answers
          </Link>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowResetDialog(true)} title="Reset profile">
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Box */}
      {isCompareMode && comparedCareers.length >= 2 ? (
        <div style={{ marginBottom: 'var(--space-2xl)', background: 'var(--color-cream-dark)', border: '2px solid var(--color-forest)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <div>
              <h3 className="font-display" style={{ fontSize: '1.6rem', color: 'var(--color-near-black)' }}>
                Side-by-Side Career Comparison
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-gray)' }}>
                Comparing {comparedCareers.length} careers directly across criteria, required skills, and fit.
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setCompareIds([])} style={{ color: 'var(--color-danger)' }}>
              Clear comparison
            </button>
          </div>

          {/* Comparison Table */}
          <div className="compare-table-container">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Attribute</th>
                  {comparedCareers.map(c => (
                    <td key={c.career.id}>
                      <div className="compare-career-header">{c.career.title}</div>
                      <span className="rec-field-chip" style={{ background: c.career.fieldColor }}>{c.career.field}</span>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profile && (
                  <tr>
                    <th>Match Score</th>
                    {comparedCareers.map(c => (
                      <td key={c.career.id}>
                        <strong style={{ fontSize: '1.3rem', color: 'var(--color-forest)' }}>{c.score}%</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-warm-gray)' }}>Personality: {c.personalityScore}% | Skills: {c.skillsScore}%</div>
                      </td>
                    ))}
                  </tr>
                )}

                <tr>
                  <th>Median Salary</th>
                  {comparedCareers.map(c => (
                    <td key={c.career.id}>
                      <strong>${(c.career.salary.median / 1000).toFixed(0)}k / year</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>${(c.career.salary.low / 1000).toFixed(0)}k – ${(c.career.salary.high / 1000).toFixed(0)}k</div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <th>Growth Outlook</th>
                  {comparedCareers.map(c => (
                    <td key={c.career.id}>
                      <strong style={{ color: 'var(--color-forest)' }}>+{c.career.growthPct}%</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-warm-gray)', marginLeft: 4 }}>({c.career.growth})</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <th>Work Setting</th>
                  {comparedCareers.map(c => (
                    <td key={c.career.id}>{c.career.environments.join(', ')}</td>
                  ))}
                </tr>

                <tr>
                  <th>Required Skills</th>
                  {comparedCareers.map(c => (
                    <td key={c.career.id}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.career.requiredSkills.map(s => {
                          const hasSkill = profile?.skills?.includes(s);
                          return (
                            <span
                              key={s}
                              style={{
                                fontSize: '0.75rem',
                                padding: '2px 7px',
                                borderRadius: 12,
                                background: hasSkill ? 'var(--color-forest-tint)' : 'var(--color-cream-dark)',
                                color: hasSkill ? 'var(--color-forest)' : 'var(--color-warm-gray)',
                                fontWeight: hasSkill ? 600 : 400
                              }}
                            >
                              {hasSkill ? '✓ ' : ''}{s}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>

                {profile && (
                  <>
                    <tr>
                      <th>Why It Fits</th>
                      {comparedCareers.map(c => (
                        <td key={c.career.id} style={{ fontSize: '0.85rem', color: 'var(--color-forest)' }}>
                          {c.matchReasons[0] || 'General profile alignment.'}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <th>Tradeoff / Watch-Out</th>
                      {comparedCareers.map(c => (
                        <td key={c.career.id} style={{ fontSize: '0.85rem', color: 'var(--color-amber)' }}>
                          {c.gapWarnings[0] || 'Check specific qualifications.'}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                <tr>
                  <th>Action</th>
                  {comparedCareers.map(c => (
                    <td key={c.career.id}>
                      <Link href={`/career/${c.career.id}`} className="btn btn-secondary btn-sm" style={{ fontWeight: 600 }}>
                        View Full Deep Dive →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : isCompareMode ? (
        <div style={{ marginBottom: 'var(--space-xl)', background: 'var(--color-forest-tint)', border: '1px dashed var(--color-forest)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: 'var(--color-forest)', marginBottom: '0.2rem' }}>
            Compare Mode Active ({compareIds.length}/3 selected)
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-gray)' }}>
            Check the "Compare" box on any 2 or 3 career cards below to view the side-by-side comparison matrix.
          </p>
        </div>
      ) : null}

      {/* Filter & Search Bar */}
      <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: 'var(--space-md)', alignItems: 'center' }}>
          <div>
            <input
              type="text"
              id="dash-search-input"
              className="form-input"
              placeholder="Search by career, skill, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select
              id="dash-field-select"
              className="form-input"
              value={activeField}
              onChange={(e) => setActiveField(e.target.value)}
            >
              <option value="all">All Fields ({CAREERS.length})</option>
              {SECTORS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <select
              id="dash-sort-select"
              className="form-input"
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
            >
              <option value="score">Highest Match</option>
              <option value="salary">Median Salary</option>
              <option value="growth">Growth Rate</option>
              <option value="alpha">Alphabetical</option>
            </select>

            <button
              className={`btn ${showOnlyBookmarks ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
              title="Filter bookmarked careers"
            >
              ★ {bookmarks.length}
            </button>
          </div>
        </div>
      </div>

      {/* Career Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
        {filtered.length > 0 ? (
          filtered.map(r => {
            const c = r.career;
            const isCompared = compareIds.includes(c.id);
            const isBookmarked = bookmarks.includes(c.id);

            return (
              <div
                key={c.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: isCompared ? 'var(--color-forest)' : 'var(--color-border)',
                  boxShadow: isCompared ? '0 0 0 2px var(--color-forest)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xs)' }}>
                    <span className="rec-field-chip" style={{ background: c.fieldColor, fontSize: '0.7rem' }}>
                      {c.field}
                    </span>

                    {profile && (
                      <span style={{ fontWeight: 700, color: 'var(--color-forest)', fontSize: '1.1rem' }}>
                        {r.score}%
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <Link href={`/career/${c.id}`} style={{ color: 'var(--color-near-black)' }}>
                      {c.title}
                    </Link>
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-warm-gray)', marginBottom: 'var(--space-md)', lineHeight: 1.45 }}>
                    {c.tagline}
                  </div>

                  {/* Quick Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-warm-gray)', background: 'var(--color-cream-dark)', padding: 'var(--space-xs) var(--space-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                    <span>💰 ${(c.salary.median / 1000).toFixed(0)}k/yr</span>
                    <span>📈 +{c.growthPct}%</span>
                    <span>🏢 {c.environments[0]}</span>
                  </div>

                  {/* Tradeoff snippet */}
                  {profile && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-amber)', background: 'var(--color-amber-tint)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', lineHeight: 1.4 }}>
                      ⚡ {r.gapWarnings[0] || 'Check required qualifications.'}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', cursor: 'pointer', color: 'var(--color-warm-gray)' }}>
                    <input
                      type="checkbox"
                      className="compare-checkbox"
                      checked={isCompared}
                      onChange={() => handleCompareToggle(c.id)}
                    />
                    <span>Compare</span>
                  </label>

                  <div style={{ display: 'flex', gap: 'var(--space-2xs)' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleBookmark(c.id)}
                      title="Save career"
                    >
                      {isBookmarked ? '★' : '☆'}
                    </button>
                    <Link href={`/career/${c.id}`} className="btn btn-secondary btn-sm" style={{ fontWeight: 500 }}>
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-3xl)' }}>
            <p style={{ color: 'var(--color-warm-gray)', marginBottom: 'var(--space-md)' }}>No careers matched your search or filters.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setActiveField('all');
                setShowOnlyBookmarks(false);
              }}
            >
              Clear search & filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
