'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PERSONAS } from '../data/personas.js';
import { useProfile } from './context/ProfileContext';

export default function HomePage() {
  const router = useRouter();
  const { profile, saveProfile, showToast } = useProfile();
  const hasProfile = !!profile;

  const handleSelectPersona = (persona) => {
    saveProfile(persona.profile);
    showToast(`Loaded ${persona.name}'s profile!`, 'success');
    router.push('/results');
  };

  const scrollToPersonas = () => {
    document.getElementById('personas-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page" id="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          <div>
            <div className="badge-tag">
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--color-forest)' }}></span>
              Career Discovery Platform
            </div>

            <h1 className="hero-headline">
              Discover the career that fits <em className="text-gradient">who you actually are.</em>
            </h1>

            <p className="hero-subtitle">
              Not a quiz. Not a list of generic job titles. Myrimaven builds a holistic picture of who you are — your work style, your skills, your values — and surfaces careers where people like you find genuine fulfillment, with honest explanations of why.
            </p>

            <div className="hero-actions">
              {hasProfile ? (
                <>
                  <Link href="/recommendations" className="btn btn-primary btn-lg">
                    See my results →
                  </Link>
                  <Link href="/results" className="btn btn-secondary btn-lg">
                    Review my profile
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/discover" className="btn btn-primary btn-lg">
                    Start your profile →
                  </Link>
                  <button onClick={scrollToPersonas} className="btn btn-secondary btn-lg">
                    👀 Try a demo profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Hero Preview Card */}
          <div>
            <div className="hero-preview-card">
              <div className="preview-header">
                <div>
                  <span className="preview-field-badge">Design & Technology</span>
                  <h3 className="preview-title" style={{ marginTop: '0.35rem' }}>UX Researcher</h3>
                  <div className="preview-tagline">Translate human behavior into better products.</div>
                </div>
                <div className="score-badge-circle" title="91% Compatibility Match">
                  <span className="score-badge-val">91%</span>
                  <span className="score-badge-lbl">Match</span>
                </div>
              </div>

              {/* Why it fits preview */}
              <div className="preview-reason-box">
                <div className="preview-reason-label">✓ Why it fits you</div>
                <div>Your high empathy and analytical curiosity directly match user synthesis.</div>
              </div>

              {/* Tradeoff preview */}
              <div className="preview-tradeoff-box">
                <div className="preview-tradeoff-label">⚡ Tradeoff to know</div>
                <div>Stakeholders don't always act on research recommendations.</div>
              </div>

              <div style={{ marginTop: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>
                <span>💰 $75k–$155k</span>
                <span>📈 High Growth (+19%)</span>
                <span>🏢 Hybrid / Remote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Core Differentiators */}
      <section className="container">
        <div className="badge-tag" style={{ margin: '0 auto var(--space-xs)', display: 'table' }}>What Makes Us Different</div>
        <h2 className="section-headline">Different from anything you've taken before</h2>
        <p className="section-sub">Traditional career tests force you into rigid boxes and tell you what jobs exist. Myrimaven explains fit honestly.</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Recommendations that explain themselves</h3>
            <p className="feature-desc">We don't just assign an acronym or job title. We unpack the exact traits and strengths that align with the day-to-day reality of each career.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Honest about friction & tradeoffs</h3>
            <p className="feature-desc">Every career has downsides. We flag watch-outs — high burnout, skill gaps, or culture mismatches — so you make eyes-open decisions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3 className="feature-title">You stay in complete control</h3>
            <p className="feature-desc">Go back and tweak any answer, adjust your salary goals, or reset anytime. It's an exploratory sandbox, never a locked test.</p>
          </div>
        </div>
      </section>

      {/* Demo Personas Section */}
      <section className="container" id="personas-section">
        <div className="badge-tag" style={{ margin: '0 auto var(--space-xs)', display: 'table' }}>Live Evidence</div>
        <h2 className="section-headline">Three people. Three very different paths.</h2>
        <p className="section-sub">Load a demo profile and watch how Myrimaven responds to a specific person — not a generic template.</p>

        <div className="personas-grid">
          {PERSONAS.map(p => (
            <div 
              key={p.id}
              className="persona-card" 
              onClick={() => handleSelectPersona(p)}
              tabIndex={0} 
              role="button" 
              aria-label={`Load demo profile for ${p.name}`}
            >
              <div className="persona-top">
                <span className="persona-avatar">{p.avatar}</span>
                <span className="persona-badge">{p.badge}</span>
              </div>
              <h3 className="persona-name">{p.name}</h3>
              <div className="persona-role">{p.role}</div>
              <p className="persona-desc">{p.description}</p>
              <div className="persona-action">
                <span>Explore as {p.name}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works (4 Steps) */}
      <section className="container">
        <div className="badge-tag" style={{ margin: '0 auto var(--space-xs)', display: 'table' }}>The Journey</div>
        <h2 className="section-headline">Four steps, complete picture</h2>
        <p className="section-sub">Takes about 5 minutes. No timer, no wrong answers, and fully editable anytime.</p>

        <div className="steps-horizontal">
          <div className="step-box">
            <div className="step-number-tag">01</div>
            <h4 className="step-box-title">About You</h4>
            <p className="step-box-desc">Four dual-pole sliders capturing how you naturally work, collaborate, and think.</p>
          </div>
          <div className="step-box">
            <div className="step-number-tag">02</div>
            <h4 className="step-box-title">Interests</h4>
            <p className="step-box-desc">Select the intellectual and creative domains that genuinely energize your curiosity.</p>
          </div>
          <div className="step-box">
            <div className="step-number-tag">03</div>
            <h4 className="step-box-title">Skills & Strengths</h4>
            <p className="step-box-desc">Highlight capabilities you have — including areas you are excited to develop.</p>
          </div>
          <div className="step-box">
            <div className="step-number-tag">04</div>
            <h4 className="step-box-title">Values & Setting</h4>
            <p className="step-box-desc">What matters most in your day-to-day life: autonomy, impact, balance, or growth.</p>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="container" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <h2 className="section-headline">Ready to find where you belong?</h2>
        <p className="section-sub">Build your profile in 5 minutes. No account or email required.</p>
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Link href="/discover" className="btn btn-primary btn-lg">
            Start Your Discovery Journey →
          </Link>
        </div>
      </section>
    </div>
  );
}
