/**
 * Page 3: Results & Profile Summary
 * Directly implements user feedback:
 * - Users receive a clear, narrative summary of their results
 * - Users can go back and change their answers via "Edit this section" on each card
 * - Users can reset their information anytime
 * - Shows personality archetype, core traits, and preview of top matches
 */

import { getProfile, showResetModal } from '../app.js';
import { getPersonalityArchetype, matchCareers } from '../engine/matcher.js';

export function renderResults(app) {
  const profile = getProfile();

  if (!profile || (!profile.interests?.length && !profile.skills?.length)) {
    app.innerHTML = `
      <div class="page container-narrow" style="text-align: center; padding-top: var(--space-3xl);">
        <div style="font-size: 3rem; margin-bottom: var(--space-md);">📋</div>
        <h2 class="font-display" style="font-size: 2.25rem; margin-bottom: var(--space-xs);">No profile found yet</h2>
        <p style="color: var(--color-warm-gray); margin-bottom: var(--space-xl);">
          Complete your 4-step discovery profile first, or try one of our demo profiles to see how it works.
        </p>
        <div style="display: flex; gap: var(--space-md); justify-content: center;">
          <a href="#/discover" class="btn btn-primary btn-lg">Start Discovery →</a>
          <a href="#/" class="btn btn-secondary btn-lg">View Demo Personas</a>
        </div>
      </div>
    `;
    return;
  }

  const archetype = getPersonalityArchetype(profile.personality);
  const allMatches = matchCareers(profile);
  const topMatches = allMatches.slice(0, 3);
  const p = profile.personality || { introvert: 50, analytical: 50, structured: 50, collaborative: 50 };

  app.innerHTML = `
    <div class="page container" id="results-page">
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-2xl); flex-wrap: wrap; gap: var(--space-md);">
        <div>
          <div class="badge-tag">Discovery Summary</div>
          <h1 class="font-display" style="font-size: clamp(2.4rem, 4vw, 3.25rem); font-weight: 400; margin: var(--space-xs) 0;">
            Here's what we know about you${profile.name ? `, ${profile.name}` : ''}.
          </h1>
          <p style="color: var(--color-warm-gray); font-size: 1.05rem; max-width: 620px;">
            Take a moment to review your answers. You can edit any section below, reset and start over, or dive straight into your personalized career matches.
          </p>
        </div>

        <div style="display: flex; gap: var(--space-sm);">
          <button class="btn btn-secondary btn-sm" id="summary-reset-btn">
            🔄 Reset
          </button>
          <a href="#/recommendations" class="btn btn-primary">
            Explore Matches (${allMatches.length}) →
          </a>
        </div>
      </div>

      <!-- Personality Archetype Banner -->
      <div class="summary-hero-card">
        <span class="summary-hero-emoji">${archetype.emoji}</span>
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--color-amber-light); letter-spacing: 0.08em; margin-bottom: 0.25rem;">
            Your Personality Archetype
          </div>
          <h2 class="summary-hero-archetype">${archetype.name}</h2>
          <p class="summary-hero-desc">${archetype.desc}</p>
        </div>
      </div>

      <!-- 4 Structured Dimension Cards with "Edit this section" buttons -->
      <div class="summary-sections-grid">
        <!-- Section 1: How You Work -->
        <div class="summary-card">
          <div class="summary-card-header">
            <h3 class="summary-card-title">⚙️ How You Work</h3>
            <button class="btn-edit-section" data-step="1">
              Edit this section ✎
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-md); flex: 1;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-warm-gray); margin-bottom: 0.2rem;">
                <span>Focused Solo (${100 - p.introvert}%)</span>
                <span>Collaboration (${p.introvert}%)</span>
              </div>
              <div style="height: 6px; background: var(--color-cream-deeper); border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: ${p.introvert}%; background: var(--color-forest); border-radius: var(--radius-full);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-warm-gray); margin-bottom: 0.2rem;">
                <span>Analytical Logic (${100 - p.analytical}%)</span>
                <span>Creative Intuition (${p.analytical}%)</span>
              </div>
              <div style="height: 6px; background: var(--color-cream-deeper); border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: ${p.analytical}%; background: var(--color-forest); border-radius: var(--radius-full);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-warm-gray); margin-bottom: 0.2rem;">
                <span>Structured Process (${100 - p.structured}%)</span>
                <span>Adaptability (${p.structured}%)</span>
              </div>
              <div style="height: 6px; background: var(--color-cream-deeper); border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: ${p.structured}%; background: var(--color-forest); border-radius: var(--radius-full);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-warm-gray); margin-bottom: 0.2rem;">
                <span>Deep Ownership (${100 - p.collaborative}%)</span>
                <span>Team Co-Creation (${p.collaborative}%)</span>
              </div>
              <div style="height: 6px; background: var(--color-cream-deeper); border-radius: var(--radius-full); overflow: hidden;">
                <div style="height: 100%; width: ${p.collaborative}%; background: var(--color-forest); border-radius: var(--radius-full);"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Interests & Domains -->
        <div class="summary-card">
          <div class="summary-card-header">
            <h3 class="summary-card-title">🌟 Interests & Domains (${profile.interests?.length || 0})</h3>
            <button class="btn-edit-section" data-step="2">
              Edit this section ✎
            </button>
          </div>
          <div class="summary-tags-wrap">
            ${(profile.interests || []).map(i => `
              <span class="summary-tag">${i}</span>
            `).join('') || '<span style="color:var(--color-warm-gray); font-size:0.875rem;">None selected yet</span>'}
          </div>
        </div>

        <!-- Section 3: Skills & Strengths -->
        <div class="summary-card">
          <div class="summary-card-header">
            <h3 class="summary-card-title">💪 Capabilities & Strengths (${profile.skills?.length || 0})</h3>
            <button class="btn-edit-section" data-step="3">
              Edit this section ✎
            </button>
          </div>
          <div class="summary-tags-wrap">
            ${(profile.skills || []).map(s => `
              <span class="summary-tag">${s}</span>
            `).join('') || '<span style="color:var(--color-warm-gray); font-size:0.875rem;">None selected yet</span>'}
          </div>
        </div>

        <!-- Section 4: Values & Setting -->
        <div class="summary-card">
          <div class="summary-card-header">
            <h3 class="summary-card-title">🧭 Values & Environment</h3>
            <button class="btn-edit-section" data-step="4">
              Edit this section ✎
            </button>
          </div>
          <div style="margin-bottom: var(--space-sm);">
            <div style="font-size:0.8rem; color:var(--color-warm-gray); margin-bottom:0.25rem;">Work Setting:</div>
            <span class="summary-tag" style="background:var(--color-forest-tint); color:var(--color-forest); font-weight:600;">
              ${profile.environment || 'No preference'}
            </span>
          </div>
          <div style="font-size:0.8rem; color:var(--color-warm-gray); margin-bottom:0.25rem;">Core Priorities:</div>
          <div class="summary-tags-wrap">
            ${(profile.values || []).map(v => `
              <span class="summary-tag">${v}</span>
            `).join('') || '<span style="color:var(--color-warm-gray); font-size:0.875rem;">None selected yet</span>'}
          </div>
        </div>
      </div>

      <!-- Top 3 Match Preview Section -->
      <div style="margin-bottom: var(--space-2xl);">
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:var(--space-lg);">
          <div>
            <h3 class="font-display" style="font-size: 1.75rem; font-weight:400;">Your Top Matches Preview</h3>
            <p style="color: var(--color-warm-gray); font-size:0.925rem;">Here is a first look at the careers most compatible with your profile.</p>
          </div>
          <a href="#/recommendations" style="color:var(--color-forest); font-size:0.9rem; font-weight:600;">
            See all ${allMatches.length} recommendations →
          </a>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:var(--space-lg);">
          ${topMatches.map(r => `
            <div class="card card-hover" style="cursor:pointer;" onclick="window.location.hash='#/career/${r.career.id}'">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-xs);">
                <span class="badge-tag" style="font-size:0.7rem;">${r.career.field}</span>
                <span style="font-weight:700; color:var(--color-forest); font-size:1.15rem;">${r.score}% Match</span>
              </div>
              <h4 style="font-size:1.2rem; font-weight:600; margin: 0.35rem 0 0.2rem;">${r.career.title}</h4>
              <p style="font-size:0.85rem; color:var(--color-warm-gray); margin-bottom:var(--space-md);">${r.career.tagline}</p>
              
              <div style="font-size:0.825rem; color:var(--color-forest); background:var(--color-forest-tint); padding:0.4rem 0.6rem; border-radius:var(--radius-md); margin-bottom:var(--space-xs);">
                ✓ ${r.matchReasons[0] || 'Strong alignment with your profile.'}
              </div>
              <div style="font-size:0.825rem; color:var(--color-amber); background:var(--color-amber-tint); padding:0.4rem 0.6rem; border-radius:var(--radius-md);">
                ⚡ ${r.gapWarnings[0] || 'Check required qualifications and environment.'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <div class="summary-cta-bar">
        <div>
          <h4 style="font-size:1.15rem; font-weight:600; margin-bottom:0.2rem;">Looks good to you?</h4>
          <p style="font-size:0.9rem; color:var(--color-warm-gray);">Explore detailed match breakdowns, why each career fits, and tradeoffs to consider.</p>
        </div>
        <a href="#/recommendations" class="btn btn-primary btn-lg">
          Show My Recommendations →
        </a>
      </div>
    </div>
  `;

  // Bind "Edit this section" buttons
  app.querySelectorAll('.btn-edit-section').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      window.location.hash = `#/discover?step=${step}`;
    });
  });

  // Bind Reset button
  const resetBtn = app.querySelector('#summary-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      showResetModal(() => {
        window.location.hash = '#/';
      });
    });
  }
}
