'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCareerById, CAREERS } from '../../../data/careers.js';
import { matchCareer } from '../../../engine/matcher.js';
import { useProfile } from '../../context/ProfileContext';

export default function CareerDetailPage() {
  const params = useParams();
  const careerId = params?.id;
  const career = getCareerById(careerId);
  const { profile, bookmarks, toggleBookmark } = useProfile();

  if (!career) {
    return (
      <div className="page container-narrow" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
        <h2 className="font-display" style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>Career Not Found</h2>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: 'var(--space-lg)' }}>We couldn't find the career path you were looking for.</p>
        <Link href="/recommendations" className="btn btn-primary">Back to Recommendations</Link>
      </div>
    );
  }

  const matchResult = profile ? matchCareer(career, profile) : null;
  const isBookmarked = bookmarks.includes(career.id);
  const relatedCareers = CAREERS.filter(c => c.id !== career.id && c.field === career.field).slice(0, 3);

  return (
    <div className="page container" id="career-detail-page">
      {/* Back nav and bookmark */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <Link href="/recommendations" className="btn btn-ghost btn-sm" style={{ marginLeft: '-var(--space-xs)' }}>
          ← Back to Recommendations
        </Link>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => toggleBookmark(career.id)}
        >
          {isBookmarked ? '★ Saved in Bookmarks' : '☆ Save Career'}
        </button>
      </div>

      {/* Hero Visual */}
      <div className="career-hero">
        <img src={career.imageUrl} alt={`${career.title} environment`} className="career-hero-img" loading="lazy" />
        <div className="career-hero-overlay">
          <div>
            <span className="rec-field-chip" style={{ background: career.fieldColor || '#1E4030' }}>
              {career.field}
            </span>
          </div>
          <h1 className="career-hero-title">{career.title}</h1>
          <div className="career-hero-tagline">{career.tagline}</div>
        </div>
      </div>

      {/* Detail Grid Layout */}
      <div className="career-detail-grid">
        {/* Main Column */}
        <div>
          {/* Personalized Fit Panel (if user has profile) */}
          {matchResult ? (
            <div className="card" style={{ marginBottom: 'var(--space-2xl)', borderColor: 'var(--color-forest)', background: 'var(--color-white)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-forest)', letterSpacing: '0.06em' }}>
                    Your Personalized Fit Analysis
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-near-black)' }}>
                    Compatibility Score: {matchResult.score}%
                  </h3>
                </div>
                <div className="badge-tag" style={{ background: 'var(--color-forest-tint)', color: 'var(--color-forest)', fontWeight: 600 }}>
                  Strong Affinity
                </div>
              </div>

              {/* 4 Pillars Meter */}
              <div className="four-pillars" style={{ marginTop: 0 }}>
                <div className="pillar-item">
                  <div className="pillar-label">
                    <span>Personality</span>
                    <strong>{matchResult.personalityScore}%</strong>
                  </div>
                  <div className="pillar-bar-bg">
                    <div className="pillar-bar-fill" style={{ width: `${matchResult.personalityScore}%` }}></div>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-label">
                    <span>Interests</span>
                    <strong>{matchResult.interestScore}%</strong>
                  </div>
                  <div className="pillar-bar-bg">
                    <div className="pillar-bar-fill" style={{ width: `${matchResult.interestScore}%` }}></div>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-label">
                    <span>Skills</span>
                    <strong>{matchResult.skillsScore}%</strong>
                  </div>
                  <div className="pillar-bar-bg">
                    <div className="pillar-bar-fill" style={{ width: `${matchResult.skillsScore}%` }}></div>
                  </div>
                </div>
                <div className="pillar-item">
                  <div className="pillar-label">
                    <span>Values</span>
                    <strong>{matchResult.valuesScore}%</strong>
                  </div>
                  <div className="pillar-bar-bg">
                    <div className="pillar-bar-fill" style={{ width: `${matchResult.valuesScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Dual Why It Fits & Tradeoffs */}
              <div className="fit-analysis-grid">
                <div className="fit-box">
                  <div className="fit-box-title">
                    <span>✓</span>
                    <span>Why this fits who you are</span>
                  </div>
                  <ul className="analysis-list">
                    {matchResult.matchReasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>

                <div className="tradeoff-box">
                  <div className="tradeoff-box-title">
                    <span>⚡</span>
                    <span>Tradeoffs & watch-outs</span>
                  </div>
                  <ul className="analysis-list">
                    {matchResult.gapWarnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: 'var(--space-2xl)', background: 'var(--color-cream-dark)', textAlign: 'center', padding: 'var(--space-xl)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>Want to see how this fits you?</h3>
              <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}>Complete your 5-minute discovery profile to unlock personalized fit breakdown.</p>
              <Link href="/discover" className="btn btn-primary btn-sm">Build Profile →</Link>
            </div>
          )}

          {/* Overview & Day in the Life */}
          <div className="detail-section">
            <h2 className="detail-section-title">
              <span>📖</span>
              <span>About the Role</span>
            </h2>
            <div className="card" style={{ lineHeight: 1.7, color: 'var(--color-near-black)', fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>
              <p style={{ marginBottom: 'var(--space-md)' }}>{career.description}</p>
              
              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--color-forest)' }}>
                ☀️ A Day in the Life
              </h4>
              <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.65 }}>
                {career.dayInLife}
              </p>
            </div>
          </div>

          {/* Skills Gap Visualizer */}
          <div className="detail-section">
            <h2 className="detail-section-title">
              <span>⚡</span>
              <span>Required Skills & Readiness</span>
            </h2>
            <div className="card">
              <p style={{ fontSize: '0.875rem', color: 'var(--color-warm-gray)', marginBottom: 'var(--space-lg)' }}>
                {profile ? 'Comparison of core competencies required for this role against your current profile strengths:' : 'Key capabilities practitioners rely on daily:'}
              </p>

              {career.requiredSkills.map(skill => {
                const userHas = profile?.skills?.includes(skill);
                const pct = userHas ? 90 : 35;
                return (
                  <div key={skill} className="skill-gap-row">
                    <div className="skill-gap-header">
                      <span style={{ fontWeight: 500 }}>{skill}</span>
                      <span className={userHas ? 'skill-status-match' : 'skill-status-gap'}>
                        {userHas ? '✓ In your profile' : 'Growth area'}
                      </span>
                    </div>
                    <div className="skill-track">
                      <div className={userHas ? 'skill-fill-match' : 'skill-fill-gap'} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="detail-section">
            <h2 className="detail-section-title">
              <span>⚖️</span>
              <span>The Realistic Balance</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="fit-box">
                <div className="fit-box-title">
                  <span>👍</span>
                  <span>Advantages & Upsides</span>
                </div>
                <ul className="analysis-list">
                  {career.pros.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>

              <div className="tradeoff-box">
                <div className="tradeoff-box-title">
                  <span>⚠️</span>
                  <span>Known Challenges & Friction</span>
                </div>
                <ul className="analysis-list">
                  {career.cons.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Education & Entry Pathways */}
          <div className="detail-section">
            <h2 className="detail-section-title">
              <span>🚀</span>
              <span>How People Enter This Field</span>
            </h2>
            <div className="card">
              <div style={{ fontSize: '0.925rem', marginBottom: 'var(--space-md)', color: 'var(--color-near-black)' }}>
                <strong>Education Baseline:</strong> {career.education}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--color-warm-gray)' }}>
                Common Career Pathways:
              </h4>
              <ul className="analysis-list">
                {career.pathways.map((path, i) => <li key={i}>{path}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div>
          {/* Quick Facts Card */}
          <div className="card" style={{ marginBottom: 'var(--space-lg)', position: 'sticky', top: 'calc(var(--nav-h) + var(--space-lg))' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
              Quick Facts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--color-warm-gray)', display: 'block', fontSize: '0.775rem' }}>Median Salary</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--color-forest)' }}>${(career.salary.median / 1000).toFixed(0)}k / year</strong>
                <span style={{ color: 'var(--color-warm-gray-light)', fontSize: '0.8rem', display: 'block' }}>Range: ${(career.salary.low / 1000).toFixed(0)}k–${(career.salary.high / 1000).toFixed(0)}k</span>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)' }}>
                <span style={{ color: 'var(--color-warm-gray)', display: 'block', fontSize: '0.775rem' }}>Growth Outlook</span>
                <strong style={{ color: 'var(--color-near-black)', fontSize: '1.05rem' }}>+{career.growthPct}% ({career.growth})</strong>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)' }}>
                <span style={{ color: 'var(--color-warm-gray)', display: 'block', fontSize: '0.775rem' }}>Work Environments</span>
                <strong>{career.environments.join(', ')}</strong>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-sm)' }}>
                <span style={{ color: 'var(--color-warm-gray)', display: 'block', fontSize: '0.775rem' }}>Sector / Field</span>
                <strong>{career.field}</strong>
              </div>
            </div>

            {/* Related Careers in Sector */}
            {relatedCareers.length > 0 && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                <span style={{ color: 'var(--color-warm-gray)', display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
                  Related in {career.field}:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  {relatedCareers.map(rel => (
                    <Link
                      key={rel.id}
                      href={`/career/${rel.id}`}
                      style={{ fontSize: '0.85rem', color: 'var(--color-forest)', fontWeight: 500 }}
                    >
                      → {rel.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
              <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                Compare in Dashboard ⚖️
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
