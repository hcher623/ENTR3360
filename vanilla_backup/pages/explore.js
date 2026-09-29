/**
 * Explore Page — Myrimaven v2
 * Full career recommendations with filter, sort, bookmarks.
 * KEY CHANGES (from feedback):
 * - Users understand why a recommendation may NOT fit them (concerns shown prominently)
 * - More interactive and engaging (animated cards, filter chips)
 * - Ability to go back and change answers (edit profile button)
 */

import { matchCareers } from '../engine/matcher.js';
import { SECTORS } from '../data/careers.js';
import { getProfile, getBookmarks, toggleBookmark, showToast } from '../app.js';

export function renderExplore(app) {
  const profile = getProfile();
  if (!profile) {
    app.innerHTML = `
      <div class="page">
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No profile found</h3>
          <p>Complete your discovery journey first to see personalized career recommendations.</p>
          <button class="btn btn-primary" onclick="window.location.hash='#/discover'">Start Discovery</button>
        </div>
      </div>
    `;
    return;
  }

  const personaName = localStorage.getItem('myrimaven_persona_name');

  // Show processing animation first
  showProcessing(app, () => {
    const results = matchCareers(profile);
    renderResultsList(app, results, profile, personaName);
  });
}

function showProcessing(app, callback) {
  app.innerHTML = `
    <div class="processing-overlay" id="processing-overlay">
      <div class="processing-orb"></div>
      <div class="processing-text">Analyzing your profile...</div>
      <div class="processing-steps">
        <div class="processing-step" id="ps-1">Mapping personality traits</div>
        <div class="processing-step" id="ps-2">Cross-referencing skill alignments</div>
        <div class="processing-step" id="ps-3">Evaluating career compatibility</div>
        <div class="processing-step" id="ps-4">Generating personalized insights</div>
      </div>
    </div>
  `;

  const steps = ['ps-1', 'ps-2', 'ps-3', 'ps-4'];
  let i = 0;

  const interval = setInterval(() => {
    if (i > 0) {
      const prev = document.getElementById(steps[i - 1]);
      if (prev) prev.classList.replace('active', 'done');
    }
    if (i < steps.length) {
      const curr = document.getElementById(steps[i]);
      if (curr) curr.classList.add('active');
      i++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        const overlay = document.getElementById('processing-overlay');
        if (overlay) {
          overlay.style.transition = 'opacity 0.5s ease';
          overlay.style.opacity = '0';
          setTimeout(callback, 500);
        }
      }, 400);
    }
  }, 500);
}

function renderResultsList(app, results, profile, personaName) {
  let filterSector = 'all';
  let sortBy = 'score';

  function render() {
    let filtered = results;
    if (filterSector !== 'all') {
      filtered = results.filter(r => r.career.sector === filterSector);
    }

    if (sortBy === 'salary') {
      filtered = [...filtered].sort((a, b) => {
        const avgA = (a.career.salaryRange.min + a.career.salaryRange.max) / 2;
        const avgB = (b.career.salaryRange.min + b.career.salaryRange.max) / 2;
        return avgB - avgA;
      });
    } else if (sortBy === 'growth') {
      const growthOrder = { 'Very High': 4, 'High': 3, 'Moderate': 2, 'Variable': 1 };
      filtered = [...filtered].sort((a, b) =>
        (growthOrder[b.career.growthOutlook] || 0) - (growthOrder[a.career.growthOutlook] || 0)
      );
    }

    const topResults = filtered.slice(0, 12);

    app.innerHTML = `
      <div class="page explore-page container">
        <div class="explore-header">
          <h1>Your Career <span class="text-gradient">Matches</span></h1>
          <p class="text-secondary mt-sm">
            ${personaName
              ? `Showing results for <strong style="color: var(--accent-teal);">${personaName}</strong>'s profile`
              : 'Based on your unique profile — careers ranked by how well they fit who you are'}
          </p>
        </div>

        <!-- Controls -->
        <div class="explore-controls">
          <div class="filter-tags">
            <span class="tag tag-lg ${filterSector === 'all' ? 'selected' : ''}" data-filter="all">All Sectors</span>
            ${Object.values(SECTORS).map(s => `
              <span class="tag tag-lg ${filterSector === s.id ? 'selected' : ''}" data-filter="${s.id}">
                ${s.icon} ${s.name}
              </span>
            `).join('')}
          </div>
          <div class="flex gap-sm items-center">
            <span style="font-size: var(--font-xs); color: var(--text-tertiary);">Sort:</span>
            <select class="form-select" id="sort-select" style="width: auto; padding: var(--space-sm) var(--space-lg) var(--space-sm) var(--space-md); font-size: var(--font-sm);">
              <option value="score" ${sortBy === 'score' ? 'selected' : ''}>Best Match</option>
              <option value="salary" ${sortBy === 'salary' ? 'selected' : ''}>Highest Salary</option>
              <option value="growth" ${sortBy === 'growth' ? 'selected' : ''}>Best Growth</option>
            </select>
          </div>
        </div>

        <!-- Results -->
        <div class="rec-grid" id="results-list">
          ${topResults.map((result, index) => renderRecCard(result, index)).join('')}
        </div>

        ${filtered.length === 0 ? `
          <div class="empty-state" style="min-height: 30vh;">
            <div class="empty-icon">🔎</div>
            <h3>No matches in this sector</h3>
            <p>Try a different filter or view all sectors.</p>
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="flex justify-center gap-md mt-2xl" style="padding-bottom: var(--space-3xl); flex-wrap: wrap;">
          <button class="btn btn-ghost" id="edit-btn">✏️ Change My Answers</button>
          <button class="btn btn-secondary" id="summary-btn">📋 View My Summary</button>
          <button class="btn btn-primary" id="dashboard-btn">📊 Dashboard</button>
        </div>
      </div>
    `;

    // Store results for dashboard
    localStorage.setItem('myrimaven_results', JSON.stringify(results.slice(0, 15)));

    // Event listeners
    document.querySelectorAll('[data-filter]').forEach(tag => {
      tag.addEventListener('click', () => {
        filterSector = tag.getAttribute('data-filter');
        render();
      });
    });

    document.getElementById('sort-select').addEventListener('change', (e) => {
      sortBy = e.target.value;
      render();
    });

    document.querySelectorAll('.rec-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking bookmark
        if (e.target.closest('.bookmark-btn')) return;
        const careerId = card.getAttribute('data-career-id');
        window.location.hash = `#/career/${careerId}`;
      });
    });

    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const careerId = btn.getAttribute('data-career-id');
        const isNowBookmarked = toggleBookmark(careerId);
        btn.classList.toggle('active', isNowBookmarked);
        btn.textContent = isNowBookmarked ? '★' : '☆';
        showToast(isNowBookmarked ? 'Career saved!' : 'Removed from saved', 'success');
      });
    });

    document.getElementById('edit-btn').addEventListener('click', () => {
      window.location.hash = '#/discover';
    });

    document.getElementById('summary-btn').addEventListener('click', () => {
      window.location.hash = '#/results';
    });

    document.getElementById('dashboard-btn').addEventListener('click', () => {
      window.location.hash = '#/dashboard';
    });

    // Animate cards in staggered
    document.querySelectorAll('.rec-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }

  render();
}

function renderRecCard(result, index) {
  const { career, score, explanation } = result;
  const sector = SECTORS[career.sector.toUpperCase()] || {};
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.includes(career.id);
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score / 100) * circumference;

  // Determine how many concerns to show (more prominent per feedback)
  const hasConcerns = explanation.concerns[0] !== 'No significant concerns based on your current profile.';

  return `
    <div class="card card-glow rec-card" data-career-id="${career.id}">
      <div class="rec-score">
        <div class="score-circle">
          <svg viewBox="0 0 80 80">
            <defs>
              <linearGradient id="scoreGradient-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#14b8a6" />
                <stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle class="score-bg" cx="40" cy="40" r="34" />
            <circle class="score-fg" cx="40" cy="40" r="34"
              stroke="url(#scoreGradient-${index})"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}" />
          </svg>
          <span class="score-value">${score}%</span>
        </div>
      </div>

      <div class="rec-content">
        <div class="flex items-center gap-sm mb-sm" style="flex-wrap: wrap;">
          <span class="sector-badge" data-sector="${career.sector}">${sector.icon || ''} ${sector.name || career.sector}</span>
          <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-career-id="${career.id}" title="Save this career">
            ${isBookmarked ? '★' : '☆'}
          </button>
        </div>
        <h3 class="rec-title">${career.title}</h3>
        <p class="rec-description">${career.description}</p>

        <div class="rec-reasons">
          ${explanation.reasons.slice(0, 2).map(r => `
            <div class="rec-reason">
              <span class="reason-icon" style="color: var(--success);">✓</span>
              <span>${r}</span>
            </div>
          `).join('')}
          ${hasConcerns ? explanation.concerns.slice(0, 1).map(c => `
            <div class="rec-concern">
              <span class="reason-icon" style="color: var(--warning);">⚠</span>
              <span>${c}</span>
            </div>
          `).join('') : ''}
        </div>

        <div class="rec-meta">
          <span class="rec-meta-item">💰 $${(career.salaryRange.min/1000).toFixed(0)}K–$${(career.salaryRange.max/1000).toFixed(0)}K</span>
          <span class="rec-meta-item">📈 ${career.growthOutlook} growth</span>
          <span class="rec-meta-item">🏢 ${career.workEnvironment.slice(0, 2).join(', ')}</span>
        </div>
      </div>
    </div>
  `;
}
