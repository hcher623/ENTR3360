/**
 * Page 1: Landing / Problem Story & Demo Personas
 * Tells the Myrimaven story clearly within 60 seconds:
 * - What it is and who it is for
 * - How it differs from generic quizzes and personality tests
 * - 3 interactive test personas (Priya, Marcus, Leah) for immediate validation
 */

import { PERSONAS } from '../data/personas.js';
import { getProfile, saveProfile, showToast } from '../app.js';

export function renderLanding(app) {
  const profile = getProfile();
  const hasProfile = !!profile;

  app.innerHTML = `
    <div class="page" id="landing-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-grid">
          <div>
            <div class="badge-tag">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--color-forest);"></span>
              Career Discovery Platform
            </div>

            <h1 class="hero-headline">
              Discover the career that fits <em class="text-gradient">who you actually are.</em>
            </h1>

            <p class="hero-subtitle">
              Not a quiz. Not a list of generic job titles. Myrimaven builds a holistic picture of who you are — your work style, your skills, your values — and surfaces careers where people like you find genuine fulfillment, with honest explanations of why.
            </p>

            <div class="hero-actions">
              ${hasProfile ? `
                <button class="btn btn-primary btn-lg" id="hero-cta-results">
                  See my results →
                </button>
                <button class="btn btn-secondary btn-lg" id="hero-cta-profile">
                  Review my profile
                </button>
              ` : `
                <button class="btn btn-primary btn-lg" id="hero-cta-start">
                  Start your profile →
                </button>
                <button class="btn btn-secondary btn-lg" id="hero-cta-demo">
                  👀 Try a demo profile
                </button>
              `}
            </div>
          </div>

          <!-- Hero Preview Card (Interactive sample match) -->
          <div>
            <div class="hero-preview-card">
              <div class="preview-header">
                <div>
                  <span class="preview-field-badge">Design & Technology</span>
                  <h3 class="preview-title" style="margin-top: 0.35rem;">UX Researcher</h3>
                  <div class="preview-tagline">Translate human behavior into better products.</div>
                </div>
                <div class="score-badge-circle" title="91% Compatibility Match">
                  <span class="score-badge-val">91%</span>
                  <span class="score-badge-lbl">Match</span>
                </div>
              </div>

              <!-- Why it fits preview -->
              <div class="preview-reason-box">
                <div class="preview-reason-label">✓ Why it fits you</div>
                <div>Your high empathy and analytical curiosity directly match user synthesis.</div>
              </div>

              <!-- Tradeoff preview (answering feedback requirement) -->
              <div class="preview-tradeoff-box">
                <div class="preview-tradeoff-label">⚡ Tradeoff to know</div>
                <div>Stakeholders don't always act on research recommendations.</div>
              </div>

              <div style="margin-top: var(--space-md); display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-warm-gray);">
                <span>💰 $75k–$155k</span>
                <span>📈 High Growth (+19%)</span>
                <span>🏢 Hybrid / Remote</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Three Core Differentiators -->
      <section class="container">
        <div class="badge-tag" style="margin: 0 auto var(--space-xs); display: table;">What Makes Us Different</div>
        <h2 class="section-headline">Different from anything you've taken before</h2>
        <p class="section-sub">Traditional career tests force you into rigid boxes and tell you what jobs exist. Myrimaven explains fit honestly.</p>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Recommendations that explain themselves</h3>
            <p class="feature-desc">We don't just assign an acronym or job title. We unpack the exact traits and strengths that align with the day-to-day reality of each career.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Honest about friction & tradeoffs</h3>
            <p class="feature-desc">Every career has downsides. We flag watch-outs — high burnout, skill gaps, or culture mismatches — so you make eyes-open decisions.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3 class="feature-title">You stay in complete control</h3>
            <p class="feature-desc">Go back and tweak any answer, adjust your salary goals, or reset anytime. It's an exploratory sandbox, never a locked test.</p>
          </div>
        </div>
      </section>

      <!-- Demo Personas Section -->
      <section class="container" id="personas-section">
        <div class="badge-tag" style="margin: 0 auto var(--space-xs); display: table;">Live Evidence</div>
        <h2 class="section-headline">Three people. Three very different paths.</h2>
        <p class="section-sub">Load a demo profile and watch how Myrimaven responds to a specific person — not a generic template.</p>

        <div class="personas-grid">
          ${PERSONAS.map(p => `
            <div class="persona-card" data-persona-id="${p.id}" tabindex="0" role="button" aria-label="Load demo profile for ${p.name}">
              <div class="persona-top">
                <span class="persona-avatar">${p.avatar}</span>
                <span class="persona-badge">${p.badge}</span>
              </div>
              <h3 class="persona-name">${p.name}</h3>
              <div class="persona-role">${p.role}</div>
              <p class="persona-desc">${p.description}</p>
              <div class="persona-action">
                <span>Explore as ${p.name}</span>
                <span>→</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- How it Works (4 Steps) -->
      <section class="container">
        <div class="badge-tag" style="margin: 0 auto var(--space-xs); display: table;">The Journey</div>
        <h2 class="section-headline">Four steps, complete picture</h2>
        <p class="section-sub">Takes about 5 minutes. No timer, no wrong answers, and fully editable anytime.</p>

        <div class="steps-horizontal">
          <div class="step-box">
            <div class="step-number-tag">01</div>
            <h4 class="step-box-title">About You</h4>
            <p class="step-box-desc">Four dual-pole sliders capturing how you naturally work, collaborate, and think.</p>
          </div>
          <div class="step-box">
            <div class="step-number-tag">02</div>
            <h4 class="step-box-title">Interests</h4>
            <p class="step-box-desc">Select the intellectual and creative domains that genuinely energize your curiosity.</p>
          </div>
          <div class="step-box">
            <div class="step-number-tag">03</div>
            <h4 class="step-box-title">Skills & Strengths</h4>
            <p class="step-box-desc">Highlight capabilities you have — including areas you are excited to develop.</p>
          </div>
          <div class="step-box">
            <div class="step-number-tag">04</div>
            <h4 class="step-box-title">Values & Setting</h4>
            <p class="step-box-desc">What matters most in your day-to-day life: autonomy, impact, balance, or growth.</p>
          </div>
        </div>
      </section>

      <!-- Bottom Call to Action -->
      <section class="container" style="text-align: center; padding-top: var(--space-3xl); padding-bottom: var(--space-3xl);">
        <h2 class="section-headline">Ready to find where you belong?</h2>
        <p class="section-sub">Build your profile in 5 minutes. No account or email required.</p>
        <div style="margin-top: var(--space-lg);">
          <button class="btn btn-primary btn-lg" id="bottom-cta-start">
            Start Your Discovery Journey →
          </button>
        </div>
      </section>
    </div>
  `;

  // ── Event Handlers ─────────────────────────────────────
  const startBtn = app.querySelector('#hero-cta-start');
  if (startBtn) startBtn.addEventListener('click', () => { window.location.hash = '#/discover'; });

  const bottomStart = app.querySelector('#bottom-cta-start');
  if (bottomStart) bottomStart.addEventListener('click', () => { window.location.hash = '#/discover'; });

  const resultsBtn = app.querySelector('#hero-cta-results');
  if (resultsBtn) resultsBtn.addEventListener('click', () => { window.location.hash = '#/recommendations'; });

  const profileBtn = app.querySelector('#hero-cta-profile');
  if (profileBtn) profileBtn.addEventListener('click', () => { window.location.hash = '#/results'; });

  const demoScrollBtn = app.querySelector('#hero-cta-demo');
  if (demoScrollBtn) {
    demoScrollBtn.addEventListener('click', () => {
      app.querySelector('#personas-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Persona card 1-click test drive
  app.querySelectorAll('.persona-card').forEach(card => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-persona-id');
      const persona = PERSONAS.find(p => p.id === pid);
      if (persona) {
        saveProfile(persona.profile);
        showToast(`Loaded ${persona.name}'s profile!`, 'success');
        window.location.hash = '#/results';
      }
    });
  });
}
