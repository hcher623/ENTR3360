/**
 * Page 2: Discovery Profile Builder (Onboarding)
 * Key changes addressing user feedback:
 * - Does NOT feel like a test: dual-ended sliders with positive poles, warm tone
 * - Live personality archetype preview updates dynamically as sliders move
 * - Users can go back and change any answer (via step tabs or Back buttons)
 * - Directly supports jumping to steps via ?step=X from "Edit this section"
 * - In-page Reset button with confirmation modal
 */

import { INTERESTS, SKILLS, VALUES, ENVIRONMENTS } from '../data/careers.js';
import { getPersonalityArchetype } from '../engine/matcher.js';
import { getProfile, saveProfile, showToast, showResetModal } from '../app.js';

const TOTAL_STEPS = 4;

export function renderDiscover(app, queryString = '') {
  // Check if step parameter requested (e.g. ?step=2 from Edit button)
  let initialStep = 1;
  if (queryString) {
    const match = queryString.match(/step=(\d+)/);
    if (match) {
      initialStep = Math.min(TOTAL_STEPS, Math.max(1, parseInt(match[1], 10)));
    }
  }

  // Load existing profile or default state
  let profile = getProfile() || {
    name: '',
    personality: {
      introvert: 50,
      analytical: 50,
      structured: 50,
      collaborative: 50
    },
    interests: [],
    skills: [],
    values: [],
    environment: 'No preference'
  };

  // Ensure all nested fields exist
  if (!profile.personality) {
    profile.personality = { introvert: 50, analytical: 50, structured: 50, collaborative: 50 };
  }
  if (!Array.isArray(profile.interests)) profile.interests = [];
  if (!Array.isArray(profile.skills)) profile.skills = [];
  if (!Array.isArray(profile.values)) profile.values = [];
  if (!profile.environment) profile.environment = 'No preference';

  let currentStep = initialStep;

  function renderCurrentStep() {
    // Calculate progress percentage
    const progressPct = (currentStep / TOTAL_STEPS) * 100;
    const archetype = getPersonalityArchetype(profile.personality);

    const stepMetadata = [
      {
        num: 1,
        label: 'About you',
        title: profile.name ? `Welcome back, ${profile.name}! How do you work?` : `First, let's get to know you.`,
        desc: 'There are no right or wrong answers. Drag each slider toward the description that feels most like you in your element.'
      },
      {
        num: 2,
        label: 'Interests',
        title: `What genuinely sparks your curiosity${profile.name ? `, ${profile.name}` : ''}?`,
        desc: 'Choose the domains and subjects that pull you in. Breadth here gives you richer, more varied options.'
      },
      {
        num: 3,
        label: 'Skills',
        title: 'Where do your strengths live?',
        desc: 'Include abilities you naturally rely on, as well as capabilities you are actively developing.'
      },
      {
        num: 4,
        label: 'Values & Setting',
        title: 'What makes work feel genuinely meaningful?',
        desc: 'Select the priorities you need in a career to feel happy and fulfilled long-term.'
      }
    ];

    const currentMeta = stepMetadata[currentStep - 1];

    app.innerHTML = `
      <div class="page discover-page">
        <!-- Progress Bar -->
        <div class="wizard-progress-bar">
          <div class="wizard-progress-fill" style="width: ${progressPct}%;"></div>
        </div>

        <div class="container-narrow">
          <!-- Wizard Header -->
          <div class="wizard-header">
            <div class="wizard-steps-nav">
              ${stepMetadata.map((s, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;
                return `
                  <button class="wizard-step-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                          data-step="${stepNum}">
                    <span>${isCompleted ? '✓' : stepNum}</span>
                    <span class="step-tab-label">${s.label}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <button class="btn btn-ghost btn-sm" id="step-reset-btn" title="Reset your answers">
              🔄 Reset
            </button>
          </div>

          <!-- Step Title & Desc -->
          <div style="margin-bottom: var(--space-xl);">
            <div class="step-badge-indicator">Step ${currentStep} of ${TOTAL_STEPS} — ${currentMeta.label}</div>
            <h1 class="step-title">${currentMeta.title}</h1>
            <p class="step-desc">${currentMeta.desc}</p>
          </div>

          <!-- Step Dynamic Content Body -->
          <div id="step-body">
            ${renderStepBody(currentStep, profile, archetype)}
          </div>

          <!-- Wizard Footer Controls -->
          <div class="wizard-footer">
            <div>
              ${currentStep > 1 ? `
                <button class="btn btn-secondary" id="wizard-prev-btn">
                  ← Back
                </button>
              ` : `
                <a href="#/" class="btn btn-ghost">
                  ← Back to Home
                </a>
              `}
            </div>

            <div>
              <button class="btn btn-primary btn-lg" id="wizard-next-btn">
                ${currentStep === TOTAL_STEPS ? 'Review Profile Summary →' : 'Continue →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    bindStepEvents();
  }

  function renderStepBody(step, prof, archetype) {
    if (step === 1) {
      return `
        <!-- Name Input -->
        <div style="margin-bottom: var(--space-xl);">
          <label style="display:block; font-size:0.95rem; font-weight:600; margin-bottom:var(--space-xs);" for="user-name-input">
            What is your first name or preferred nickname?
          </label>
          <input type="text" id="user-name-input" class="form-input" 
                 placeholder="e.g. Alex, Sam, Taylor" 
                 value="${prof.name || ''}" maxlength="40">
        </div>

        <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:var(--space-md); color:var(--color-near-black);">
          How you naturally work:
        </h3>

        <!-- Slider 1: Introvert / Extrovert -->
        <div class="slider-group">
          <div class="slider-header">
            <span class="slider-label">Work Environment Focus</span>
            <span class="slider-hint">Focus ↔ Collaboration</span>
          </div>
          <div class="slider-track-wrap">
            <input type="range" min="0" max="100" class="slider-input" id="slider-introvert" value="${prof.personality.introvert}">
          </div>
          <div class="slider-poles">
            <span class="slider-pole-left ${prof.personality.introvert < 40 ? 'active' : ''}">Focused, independent deep-work</span>
            <span class="slider-pole-right ${prof.personality.introvert > 60 ? 'active' : ''}">Collaborative, energized around people</span>
          </div>
        </div>

        <!-- Slider 2: Analytical / Creative -->
        <div class="slider-group">
          <div class="slider-header">
            <span class="slider-label">Thinking Orientation</span>
            <span class="slider-hint">Analysis ↔ Creative Vision</span>
          </div>
          <div class="slider-track-wrap">
            <input type="range" min="0" max="100" class="slider-input" id="slider-analytical" value="${prof.personality.analytical}">
          </div>
          <div class="slider-poles">
            <span class="slider-pole-left ${prof.personality.analytical < 40 ? 'active' : ''}">Data, structured logic & evidence</span>
            <span class="slider-pole-right ${prof.personality.analytical > 60 ? 'active' : ''}">Creative intuition, storytelling & ideas</span>
          </div>
        </div>

        <!-- Slider 3: Structured / Flexible -->
        <div class="slider-group">
          <div class="slider-header">
            <span class="slider-label">Structure & Process</span>
            <span class="slider-hint">Process ↔ Adaptability</span>
          </div>
          <div class="slider-track-wrap">
            <input type="range" min="0" max="100" class="slider-input" id="slider-structured" value="${prof.personality.structured}">
          </div>
          <div class="slider-poles">
            <span class="slider-pole-left ${prof.personality.structured < 40 ? 'active' : ''}">Clear roadmaps, consistency & plans</span>
            <span class="slider-pole-right ${prof.personality.structured > 60 ? 'active' : ''}">Spontaneity, rapid pivots & fluidity</span>
          </div>
        </div>

        <!-- Slider 4: Solo / Team -->
        <div class="slider-group">
          <div class="slider-header">
            <span class="slider-label">Problem Ownership</span>
            <span class="slider-hint">Individual ↔ Cross-Functional</span>
          </div>
          <div class="slider-track-wrap">
            <input type="range" min="0" max="100" class="slider-input" id="slider-collaborative" value="${prof.personality.collaborative}">
          </div>
          <div class="slider-poles">
            <span class="slider-pole-left ${prof.personality.collaborative < 40 ? 'active' : ''}">Own a problem end-to-end</span>
            <span class="slider-pole-right ${prof.personality.collaborative > 60 ? 'active' : ''}">Co-create with multidisciplinary teams</span>
          </div>
        </div>

        <!-- Dynamic Live Archetype Preview Box -->
        <div class="archetype-live-preview" id="live-archetype-box">
          <span class="archetype-emoji">${archetype.emoji}</span>
          <div>
            <div style="font-family:var(--font-mono); font-size:0.75rem; text-transform:uppercase; color:var(--color-amber-light); letter-spacing:0.06em;">
              Emerging Working Style
            </div>
            <div class="archetype-title">${archetype.name}</div>
            <div class="archetype-desc">${archetype.desc}</div>
          </div>
        </div>
      `;
    }

    if (step === 2) {
      return `
        <div style="margin-bottom: var(--space-md); display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-size:0.95rem; font-weight:600;">Explore your interest domains</span>
          <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--color-forest);" id="interest-count">
            ${prof.interests.length} selected (aim for 3 or more)
          </span>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
          ${INTERESTS.map(interest => {
            const isSelected = prof.interests.includes(interest);
            return `
              <div class="tag-chip ${isSelected ? 'selected' : ''}" data-type="interest" data-value="${interest}">
                <span class="chip-check">✓</span>
                <span>${interest}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (step === 3) {
      return `
        <div style="margin-bottom: var(--space-md); display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-size:0.95rem; font-weight:600;">Capabilities & Natural Talents</span>
          <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--color-forest);" id="skill-count">
            ${prof.skills.length} selected (aim for 3 or more)
          </span>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
          ${SKILLS.map(skill => {
            const isSelected = prof.skills.includes(skill);
            return `
              <div class="tag-chip ${isSelected ? 'selected' : ''}" data-type="skill" data-value="${skill}">
                <span class="chip-check">✓</span>
                <span>${skill}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (step === 4) {
      return `
        <!-- Work Setting Preference -->
        <div style="margin-bottom: var(--space-2xl);">
          <label style="display:block; font-size:0.95rem; font-weight:600; margin-bottom:var(--space-sm);">
            Preferred Work Setting:
          </label>
          <div style="display:flex; flex-wrap:wrap; gap:var(--space-sm);">
            ${ENVIRONMENTS.map(env => `
              <div class="tag-chip ${prof.environment === env ? 'selected' : ''}" data-type="env" data-value="${env}">
                <span class="chip-check">✓</span>
                <span>${env}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Career Values -->
        <div>
          <div style="margin-bottom: var(--space-md); display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size:0.95rem; font-weight:600;">Core Values & Professional Priorities</span>
            <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--color-forest);" id="value-count">
              ${prof.values.length} selected
            </span>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm);">
            ${VALUES.map(val => {
              const isSelected = prof.values.includes(val);
              return `
                <div class="tag-chip ${isSelected ? 'selected' : ''}" data-type="value" data-value="${val}">
                  <span class="chip-check">✓</span>
                  <span>${val}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    return '';
  }

  function bindStepEvents() {
    // Step Tabs clicking (allows moving back and forward anytime)
    app.querySelectorAll('.wizard-step-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        saveCurrentStepInputs();
        currentStep = parseInt(tab.getAttribute('data-step'), 10);
        renderCurrentStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Reset button
    const resetBtn = app.querySelector('#step-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        showResetModal(() => {
          window.location.hash = '#/discover';
        });
      });
    }

    // Previous Button
    const prevBtn = app.querySelector('#wizard-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        saveCurrentStepInputs();
        if (currentStep > 1) {
          currentStep--;
          renderCurrentStep();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    // Next Button
    const nextBtn = app.querySelector('#wizard-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        saveCurrentStepInputs();

        // Soft validation with friendly prompts
        if (currentStep === 1) {
          if (!profile.name.trim()) {
            profile.name = 'Explorer';
          }
        } else if (currentStep === 2) {
          if (profile.interests.length === 0) {
            showToast('Please pick at least 1 or 2 interests to continue!', 'info');
            return;
          }
        } else if (currentStep === 3) {
          if (profile.skills.length === 0) {
            showToast('Please pick at least 1 or 2 skills to continue!', 'info');
            return;
          }
        }

        saveProfile(profile);

        if (currentStep < TOTAL_STEPS) {
          currentStep++;
          renderCurrentStep();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // Finished all 4 steps -> go to Profile Summary / Results!
          showToast('Profile created! Review your results summary.', 'success');
          window.location.hash = '#/results';
        }
      });
    }

    // Sliders Live Updates & Archetype Preview in Step 1
    if (currentStep === 1) {
      const nameInput = app.querySelector('#user-name-input');
      if (nameInput) {
        nameInput.addEventListener('input', (e) => {
          profile.name = e.target.value;
        });
      }

      ['introvert', 'analytical', 'structured', 'collaborative'].forEach(key => {
        const slider = app.querySelector(`#slider-${key}`);
        if (slider) {
          slider.addEventListener('input', (e) => {
            profile.personality[key] = parseInt(e.target.value, 10);
            updateLiveArchetype();
          });
        }
      });
    }

    // Tag chip selection in Steps 2, 3, 4
    app.querySelectorAll('.tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.getAttribute('data-type');
        const val = chip.getAttribute('data-value');

        if (type === 'interest') {
          toggleArrayItem(profile.interests, val);
          chip.classList.toggle('selected', profile.interests.includes(val));
          const countEl = app.querySelector('#interest-count');
          if (countEl) countEl.textContent = `${profile.interests.length} selected (aim for 3 or more)`;
        } else if (type === 'skill') {
          toggleArrayItem(profile.skills, val);
          chip.classList.toggle('selected', profile.skills.includes(val));
          const countEl = app.querySelector('#skill-count');
          if (countEl) countEl.textContent = `${profile.skills.length} selected (aim for 3 or more)`;
        } else if (type === 'value') {
          toggleArrayItem(profile.values, val);
          chip.classList.toggle('selected', profile.values.includes(val));
          const countEl = app.querySelector('#value-count');
          if (countEl) countEl.textContent = `${profile.values.length} selected`;
        } else if (type === 'env') {
          profile.environment = val;
          app.querySelectorAll('.tag-chip[data-type="env"]').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
        }

        saveProfile(profile);
      });
    });
  }

  function updateLiveArchetype() {
    const archetype = getPersonalityArchetype(profile.personality);
    const box = app.querySelector('#live-archetype-box');
    if (box) {
      box.querySelector('.archetype-emoji').textContent = archetype.emoji;
      box.querySelector('.archetype-title').textContent = archetype.name;
      box.querySelector('.archetype-desc').textContent = archetype.desc;
    }

    // Also update slider pole highlights
    const p = profile.personality;
    updatePoleClass('#slider-introvert', p.introvert < 40, p.introvert > 60);
    updatePoleClass('#slider-analytical', p.analytical < 40, p.analytical > 60);
    updatePoleClass('#slider-structured', p.structured < 40, p.structured > 60);
    updatePoleClass('#slider-collaborative', p.collaborative < 40, p.collaborative > 60);
  }

  function updatePoleClass(sliderId, isLeftActive, isRightActive) {
    const parent = app.querySelector(sliderId)?.closest('.slider-group');
    if (!parent) return;
    parent.querySelector('.slider-pole-left')?.classList.toggle('active', isLeftActive);
    parent.querySelector('.slider-pole-right')?.classList.toggle('active', isRightActive);
  }

  function toggleArrayItem(arr, item) {
    const idx = arr.indexOf(item);
    if (idx === -1) arr.push(item);
    else arr.splice(idx, 1);
  }

  function saveCurrentStepInputs() {
    if (currentStep === 1) {
      const nameInput = app.querySelector('#user-name-input');
      if (nameInput) profile.name = nameInput.value.trim();
    }
    saveProfile(profile);
  }

  // Initial render
  renderCurrentStep();
}
