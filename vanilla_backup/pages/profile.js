/**
 * Profile Builder Page — Myrimaven
 * Multi-step wizard: Personality → Interests → Skills → Preferences & Goals
 */

export function renderProfile(app) {
  let currentStep = 0;
  const totalSteps = 4;

  // Load existing profile or start fresh
  let profile = {
    personalities: [],
    interests: [],
    skills: [],
    strengths: [],
    preferences: {
      workStyle: '',
      workEnvironment: [],
      stressTolerance: '',
      creativityImportance: '',
      socialPreference: '',
    },
    goals: {
      salaryExpectation: '',
      growthImportance: '',
      autonomyImportance: '',
    },
  };

  const existingProfile = localStorage.getItem('myrimaven_profile');
  if (existingProfile) {
    try {
      const parsed = JSON.parse(existingProfile);
      profile = { ...profile, ...parsed };
    } catch (e) { /* ignore */ }
  }

  // ── Step Definitions ───────────────────────────────
  const PERSONALITY_OPTIONS = [
    { id: 'analytical-thinker', icon: '🧠', label: 'Analytical Thinker', desc: 'Logic-driven, methodical, loves solving puzzles' },
    { id: 'creative-mind', icon: '🎨', label: 'Creative Mind', desc: 'Imaginative, expressive, sees possibilities everywhere' },
    { id: 'natural-leader', icon: '👑', label: 'Natural Leader', desc: 'Confident, strategic, energized by guiding others' },
    { id: 'empathetic-helper', icon: '💛', label: 'Empathetic Helper', desc: 'Compassionate, patient, deeply attuned to others' },
    { id: 'adventurous-explorer', icon: '🌎', label: 'Adventurous Explorer', desc: 'Curious, adaptable, thrives on new experiences' },
    { id: 'detail-perfectionist', icon: '🔬', label: 'Detail Perfectionist', desc: 'Meticulous, thorough, nothing escapes notice' },
    { id: 'big-picture-visionary', icon: '🔭', label: 'Big-Picture Visionary', desc: 'Strategic, forward-thinking, sees the whole system' },
    { id: 'calm-mediator', icon: '☮️', label: 'Calm Mediator', desc: 'Diplomatic, balanced, brings people together' },
  ];

  const INTEREST_OPTIONS = [
    { id: 'technology', icon: '💻', label: 'Technology', desc: 'Software, AI, gadgets, digital innovation' },
    { id: 'healthcare', icon: '🏥', label: 'Healthcare', desc: 'Medicine, wellness, patient care' },
    { id: 'business', icon: '📊', label: 'Business & Finance', desc: 'Strategy, markets, entrepreneurship' },
    { id: 'arts', icon: '🎨', label: 'Arts & Design', desc: 'Visual arts, music, creative expression' },
    { id: 'science', icon: '🔬', label: 'Science & Research', desc: 'Discovery, experiments, knowledge' },
    { id: 'social-impact', icon: '🌍', label: 'Social Impact', desc: 'Community, advocacy, making a difference' },
    { id: 'environment', icon: '🌱', label: 'Environment', desc: 'Sustainability, nature, conservation' },
    { id: 'psychology', icon: '🧩', label: 'Psychology', desc: 'Human behavior, mental health, cognition' },
    { id: 'law', icon: '⚖️', label: 'Law & Policy', desc: 'Justice, regulation, governance' },
    { id: 'sports', icon: '⚽', label: 'Sports & Fitness', desc: 'Athletics, physical performance' },
    { id: 'mathematics', icon: '📐', label: 'Mathematics', desc: 'Numbers, patterns, abstract reasoning' },
    { id: 'media', icon: '📱', label: 'Media & Content', desc: 'Storytelling, journalism, social media' },
  ];

  const SKILL_OPTIONS = [
    { id: 'technical', icon: '⚙️', label: 'Technical', desc: 'Programming, data, engineering' },
    { id: 'communication', icon: '💬', label: 'Communication', desc: 'Writing, speaking, persuading' },
    { id: 'analytical', icon: '📈', label: 'Analytical', desc: 'Research, critical thinking, statistics' },
    { id: 'creative', icon: '✨', label: 'Creative', desc: 'Design, art, spatial thinking' },
    { id: 'leadership', icon: '🎯', label: 'Leadership', desc: 'Strategy, management, organizing' },
    { id: 'interpersonal', icon: '🤝', label: 'Interpersonal', desc: 'Empathy, teamwork, emotional intelligence' },
  ];

  function render() {
    app.innerHTML = `
      <div class="page profile-builder">
        <div class="profile-header">
          <h1 class="heading-2">Build your <span class="text-gradient">profile</span></h1>
          <p class="text-secondary mt-sm">Tell us about yourself so we can find career paths that genuinely fit.</p>
        </div>

        <!-- Progress Indicator -->
        <div class="profile-progress">
          ${['Personality', 'Interests', 'Skills', 'Preferences'].map((label, i) => `
            <div class="progress-step">
              <div class="progress-dot ${i < currentStep ? 'completed' : ''} ${i === currentStep ? 'active' : ''}">
                ${i < currentStep ? '✓' : i + 1}
              </div>
              <span class="progress-label ${i === currentStep ? 'active' : ''}">${label}</span>
              ${i < totalSteps - 1 ? `<div class="progress-line ${i < currentStep ? 'filled' : ''}"></div>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Step Content -->
        <div id="step-content">
          ${renderStep()}
        </div>

        <!-- Actions -->
        <div class="profile-actions">
          <button class="btn btn-ghost" id="back-btn" ${currentStep === 0 ? 'style="visibility: hidden;"' : ''}>
            ← Back
          </button>
          <div class="flex gap-sm">
            ${currentStep === totalSteps - 1 ? `
              <button class="btn btn-primary btn-lg" id="submit-btn">
                🚀 See My Recommendations
              </button>
            ` : `
              <button class="btn btn-primary" id="next-btn">
                Continue →
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    attachEvents();
  }

  function renderStep() {
    switch (currentStep) {
      case 0: return renderPersonalityStep();
      case 1: return renderInterestsStep();
      case 2: return renderSkillsStep();
      case 3: return renderPreferencesStep();
      default: return '';
    }
  }

  function renderPersonalityStep() {
    return `
      <div class="profile-step">
        <h2 class="profile-step-title">What describes you best?</h2>
        <p class="profile-step-desc">Select 2–3 personality types that resonate most. There are no wrong answers.</p>
        <div class="selection-grid">
          ${PERSONALITY_OPTIONS.map(opt => `
            <div class="selection-item ${profile.personalities.includes(opt.id) ? 'selected' : ''}"
                 data-type="personality" data-id="${opt.id}">
              <span class="item-icon">${opt.icon}</span>
              <span class="item-label">${opt.label}</span>
              <span class="item-desc">${opt.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderInterestsStep() {
    return `
      <div class="profile-step">
        <h2 class="profile-step-title">What are you drawn to?</h2>
        <p class="profile-step-desc">Pick 2–4 areas that genuinely interest you — not just what sounds practical.</p>
        <div class="selection-grid">
          ${INTEREST_OPTIONS.map(opt => `
            <div class="selection-item ${profile.interests.includes(opt.id) ? 'selected' : ''}"
                 data-type="interest" data-id="${opt.id}">
              <span class="item-icon">${opt.icon}</span>
              <span class="item-label">${opt.label}</span>
              <span class="item-desc">${opt.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderSkillsStep() {
    return `
      <div class="profile-step">
        <h2 class="profile-step-title">Where do your strengths lie?</h2>
        <p class="profile-step-desc">Select skill categories where you feel confident or are actively developing.</p>
        <div class="selection-grid" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
          ${SKILL_OPTIONS.map(opt => `
            <div class="selection-item ${profile.skills.includes(opt.id) ? 'selected' : ''}"
                 data-type="skill" data-id="${opt.id}">
              <span class="item-icon">${opt.icon}</span>
              <span class="item-label">${opt.label}</span>
              <span class="item-desc">${opt.desc}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderPreferencesStep() {
    return `
      <div class="profile-step">
        <h2 class="profile-step-title">Your ideal work life</h2>
        <p class="profile-step-desc">Tell us about your preferences and career goals so we can fine-tune your matches.</p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl);">
          <div>
            <div class="form-group">
              <label class="form-label">Work Style</label>
              <select class="form-select" id="pref-workstyle">
                <option value="">Select...</option>
                <option value="independent" ${profile.preferences.workStyle === 'independent' ? 'selected' : ''}>Independent — I work best solo</option>
                <option value="collaborative" ${profile.preferences.workStyle === 'collaborative' ? 'selected' : ''}>Collaborative — I thrive in teams</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Stress Tolerance</label>
              <select class="form-select" id="pref-stress">
                <option value="">Select...</option>
                <option value="low" ${profile.preferences.stressTolerance === 'low' ? 'selected' : ''}>Low — I prefer calm environments</option>
                <option value="moderate" ${profile.preferences.stressTolerance === 'moderate' ? 'selected' : ''}>Moderate — Some pressure is fine</option>
                <option value="high" ${profile.preferences.stressTolerance === 'high' ? 'selected' : ''}>High — I perform well under pressure</option>
                <option value="very-high" ${profile.preferences.stressTolerance === 'very-high' ? 'selected' : ''}>Very High — I thrive in chaos</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">How Important is Creativity?</label>
              <select class="form-select" id="pref-creativity">
                <option value="">Select...</option>
                <option value="low" ${profile.preferences.creativityImportance === 'low' ? 'selected' : ''}>Not very — I prefer structured tasks</option>
                <option value="moderate" ${profile.preferences.creativityImportance === 'moderate' ? 'selected' : ''}>Somewhat — Mix of both</option>
                <option value="high" ${profile.preferences.creativityImportance === 'high' ? 'selected' : ''}>Very — I need creative expression</option>
                <option value="very-high" ${profile.preferences.creativityImportance === 'very-high' ? 'selected' : ''}>Essential — Creativity defines me</option>
              </select>
            </div>
          </div>

          <div>
            <div class="form-group">
              <label class="form-label">Social Interaction Level</label>
              <select class="form-select" id="pref-social">
                <option value="">Select...</option>
                <option value="low" ${profile.preferences.socialPreference === 'low' ? 'selected' : ''}>Low — I prefer working alone</option>
                <option value="moderate" ${profile.preferences.socialPreference === 'moderate' ? 'selected' : ''}>Moderate — Some interaction</option>
                <option value="high" ${profile.preferences.socialPreference === 'high' ? 'selected' : ''}>High — I love working with people</option>
                <option value="very-high" ${profile.preferences.socialPreference === 'very-high' ? 'selected' : ''}>Very High — People are everything</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Salary Expectation</label>
              <select class="form-select" id="goal-salary">
                <option value="">Select...</option>
                <option value="under-50k" ${profile.goals.salaryExpectation === 'under-50k' ? 'selected' : ''}>Under $50K — Passion over pay</option>
                <option value="50k-75k" ${profile.goals.salaryExpectation === '50k-75k' ? 'selected' : ''}>$50K – $75K — Comfortable</option>
                <option value="75k-100k" ${profile.goals.salaryExpectation === '75k-100k' ? 'selected' : ''}>$75K – $100K — Above average</option>
                <option value="100k-150k" ${profile.goals.salaryExpectation === '100k-150k' ? 'selected' : ''}>$100K – $150K — High earner</option>
                <option value="150k-plus" ${profile.goals.salaryExpectation === '150k-plus' ? 'selected' : ''}>$150K+ — Top tier</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Career Growth Priority</label>
              <select class="form-select" id="goal-growth">
                <option value="">Select...</option>
                <option value="low" ${profile.goals.growthImportance === 'low' ? 'selected' : ''}>Not critical — Stability matters more</option>
                <option value="moderate" ${profile.goals.growthImportance === 'moderate' ? 'selected' : ''}>Nice to have — Not a dealbreaker</option>
                <option value="high" ${profile.goals.growthImportance === 'high' ? 'selected' : ''}>Very important — I want rapid growth</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Autonomy Importance</label>
              <select class="form-select" id="goal-autonomy">
                <option value="">Select...</option>
                <option value="low" ${profile.goals.autonomyImportance === 'low' ? 'selected' : ''}>Low — I prefer guidance</option>
                <option value="moderate" ${profile.goals.autonomyImportance === 'moderate' ? 'selected' : ''}>Moderate — Some freedom</option>
                <option value="high" ${profile.goals.autonomyImportance === 'high' ? 'selected' : ''}>High — I want independence</option>
                <option value="very-high" ${profile.goals.autonomyImportance === 'very-high' ? 'selected' : ''}>Very High — I need full control</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-group mt-lg">
          <label class="form-label">Work Environment (select all that appeal)</label>
          <div class="flex flex-wrap gap-sm">
            ${['remote', 'office', 'hybrid', 'freelance', 'field', 'clinic', 'lab', 'studio'].map(env => `
              <span class="tag tag-lg ${(profile.preferences.workEnvironment || []).includes(env) ? 'selected' : ''}"
                    data-type="environment" data-id="${env}">
                ${env.charAt(0).toUpperCase() + env.slice(1)}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    // Selection items (personality, interests, skills)
    document.querySelectorAll('.selection-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const id = item.getAttribute('data-id');

        if (type === 'personality') {
          toggleArrayItem(profile.personalities, id);
        } else if (type === 'interest') {
          toggleArrayItem(profile.interests, id);
        } else if (type === 'skill') {
          toggleArrayItem(profile.skills, id);
        }

        item.classList.toggle('selected');
      });
    });

    // Environment tags
    document.querySelectorAll('[data-type="environment"]').forEach(tag => {
      tag.addEventListener('click', () => {
        const id = tag.getAttribute('data-id');
        if (!profile.preferences.workEnvironment) profile.preferences.workEnvironment = [];
        toggleArrayItem(profile.preferences.workEnvironment, id);
        tag.classList.toggle('selected');
      });
    });

    // Select dropdowns (preferences step)
    const selects = {
      'pref-workstyle': (v) => profile.preferences.workStyle = v,
      'pref-stress': (v) => profile.preferences.stressTolerance = v,
      'pref-creativity': (v) => profile.preferences.creativityImportance = v,
      'pref-social': (v) => profile.preferences.socialPreference = v,
      'goal-salary': (v) => profile.goals.salaryExpectation = v,
      'goal-growth': (v) => profile.goals.growthImportance = v,
      'goal-autonomy': (v) => profile.goals.autonomyImportance = v,
    };

    Object.entries(selects).forEach(([id, setter]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => setter(el.value));
    });

    // Navigation buttons
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');

    if (backBtn) backBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        saveProfile();
        render();
      }
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (validateStep()) {
        currentStep++;
        saveProfile();
        render();
      }
    });

    if (submitBtn) submitBtn.addEventListener('click', () => {
      if (validateStep()) {
        saveProfile();
        localStorage.removeItem('myrimaven_persona_name');
        window.location.hash = '#/recommendations';
      }
    });
  }

  function validateStep() {
    switch (currentStep) {
      case 0:
        if (profile.personalities.length === 0) {
          showValidation('Please select at least one personality type.');
          return false;
        }
        return true;
      case 1:
        if (profile.interests.length === 0) {
          showValidation('Please select at least one interest area.');
          return false;
        }
        return true;
      case 2:
        if (profile.skills.length === 0) {
          showValidation('Please select at least one skill category.');
          return false;
        }
        return true;
      case 3:
        return true; // Preferences are optional
      default:
        return true;
    }
  }

  function showValidation(msg) {
    const existing = document.querySelector('.validation-msg');
    if (existing) existing.remove();

    const stepContent = document.getElementById('step-content');
    const msgEl = document.createElement('div');
    msgEl.className = 'validation-msg';
    msgEl.style.cssText = `
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      font-size: var(--font-sm);
      margin-top: var(--space-md);
      animation: fadeInUp 0.3s ease;
    `;
    msgEl.textContent = msg;
    stepContent.appendChild(msgEl);

    setTimeout(() => msgEl.remove(), 3000);
  }

  function toggleArrayItem(arr, item) {
    const idx = arr.indexOf(item);
    if (idx === -1) arr.push(item);
    else arr.splice(idx, 1);
  }

  function saveProfile() {
    localStorage.setItem('myrimaven_profile', JSON.stringify(profile));
  }

  render();
}
