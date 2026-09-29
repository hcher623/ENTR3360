/**
 * Page 4: Personalized Career Recommendations
 * Directly implements user feedback:
 * - Clear Match Scores with 4-pillar compatibility breakdown
 * - Prominent "Why it fits you" (personalized match reasons)
 * - Prominent "Tradeoffs & Watch-Outs / Why it may not fit you" (fulfilling project feedback)
 * - Ability to edit answers anytime ("Edit answers" button)
 * - Ability to reset profile anytime
 * - Interactive filtering by field and sorting by match, salary, or growth
 * - Bookmarking capability and deep-dive links
 */

import { matchCareers } from '../engine/matcher.js';
import { SECTORS } from '../data/careers.js';
import { getProfile, getBookmarks, toggleBookmark, showToast, showResetModal } from '../app.js';

export function renderRecommendations(app) {
  const profile = getProfile();

  if (!profile || (!profile.interests?.length && !profile.skills?.length)) {
    app.innerHTML = `
      <div class="page container-narrow" style="text-align: center; padding-top: var(--space-3xl);">
        <div style="font-size: 3rem; margin-bottom: var(--space-md);">🎯</div>
        <h2 class="font-display" style="font-size: 2.25rem; margin-bottom: var(--space-xs);">No recommendations yet</h2>
        <p style="color: var(--color-warm-gray); margin-bottom: var(--space-xl);">
          We need a completed discovery profile to analyze your traits and match you with suitable careers.
        </p>
        <div style="display: flex; gap: var(--space-md); justify-content: center;">
          <a href="#/discover" class="btn btn-primary btn-lg">Build Your Profile →</a>
          <a href="#/" class="btn btn-secondary btn-lg">Try a Demo Persona</a>
        </div>
      </div>
    `;
    return;
  }

  const allMatches = matchCareers(profile);
  let activeFilter = 'all';
  let activeSort = 'score';

  function renderList() {
    let filtered = [...allMatches];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(r => {
        const sectorSlug = r.career.field.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return sectorSlug === activeFilter || r.career.field === activeFilter;
      });
    }

    if (activeSort === 'salary') {
      filtered.sort((a, b) => b.career.salary.median - a.career.salary.median);
    } else if (activeSort === 'growth') {
      filtered.sort((a, b) => b.career.growthPct - a.career.growthPct);
    } else {
      filtered.sort((a, b) => b.score - a.score);
    }

    const bookmarks = getBookmarks();

    app.innerHTML = `
      <div class="page" id="recommendations-page">
        <!-- Hero Banner -->
        <div class="recs-banner">
          <div class="recs-banner-inner">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--space-md);">
              <div>
                <div style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--color-amber-light); letter-spacing: 0.08em; margin-bottom: 0.25rem;">
                  Personalized Analysis
                </div>
                <h1 class="recs-banner-title">
                  ${profile.name ? `${profile.name}'s` : 'Your'} Career Matches
                </h1>
                <p class="recs-banner-sub">
                  Built specifically from your traits, skills, and values. Each recommendation below details exactly why it fits you — and honestly flags where the friction or trade-offs might be.
                </p>
              </div>

              <!-- Quick Action Buttons -->
              <div style="display: flex; gap: var(--space-sm); align-items: center; margin-top: var(--space-xs);">
                <a href="#/discover" class="btn btn-secondary btn-sm" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.25);">
                  ✎ Edit answers
                </a>
                <a href="#/results" class="btn btn-secondary btn-sm" style="background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.25);">
                  📋 Profile summary
                </a>
                <a href="#/dashboard" class="btn btn-primary btn-sm" style="background: var(--color-cream); color: var(--color-near-black); border-color: transparent;">
                  Compare all →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="container" style="padding-top: 0;">
          <!-- Controls: Filters & Sort -->
          <div class="recs-controls">
            <div class="filter-pills">
              <button class="filter-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">
                All Fields (${allMatches.length})
              </button>
              ${SECTORS.map(s => {
                const count = allMatches.filter(r => r.career.field === s.name).length;
                if (count === 0) return '';
                return `
                  <button class="filter-pill ${activeFilter === s.id || activeFilter === s.name ? 'active' : ''}" 
                          data-filter="${s.id}">
                    ${s.name} (${count})
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Sort dropdown -->
            <div style="display: flex; align-items: center; gap: var(--space-xs);">
              <span style="font-size: 0.825rem; color: var(--color-warm-gray);">Sort by:</span>
              <select id="sort-select" class="form-input" style="padding: 0.4rem 0.8rem; width: auto; font-size: 0.85rem;">
                <option value="score" ${activeSort === 'score' ? 'selected' : ''}>Highest Match</option>
                <option value="salary" ${activeSort === 'salary' ? 'selected' : ''}>Median Salary</option>
                <option value="growth" ${activeSort === 'growth' ? 'selected' : ''}>Job Growth Rate</option>
              </select>
            </div>
          </div>

          <!-- Recommendations List -->
          <div id="recs-list">
            ${filtered.length > 0 ? filtered.map((match, idx) => {
              const c = match.career;
              const isBookmarked = bookmarks.includes(c.id);

              return `
                <div class="rec-card" data-career-id="${c.id}">
                  <!-- Card Header -->
                  <div class="rec-card-header">
                    <div>
                      <span class="rec-field-chip" style="background: ${c.fieldColor || '#1E4030'};">
                        ${c.field}
                      </span>
                      <h2 class="rec-title">${c.title}</h2>
                      <div class="rec-tagline">${c.tagline}</div>
                    </div>

                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                      <!-- Bookmark button -->
                      <button class="btn btn-ghost btn-sm bookmark-btn" data-id="${c.id}" title="${isBookmarked ? 'Remove bookmark' : 'Save career'}">
                        ${isBookmarked ? '★ Saved' : '☆ Save'}
                      </button>

                      <!-- Score Meter -->
                      <div class="rec-score-meter" title="Overall compatibility score">
                        <span class="rec-score-num">${match.score}%</span>
                        <span class="rec-score-label">Fit Score</span>
                      </div>
                    </div>
                  </div>

                  <!-- Description -->
                  <p style="font-size: 0.925rem; color: var(--color-warm-gray); line-height: 1.6; margin-bottom: var(--space-md);">
                    ${c.description}
                  </p>

                  <!-- 4-Pillar Compatibility Breakdown -->
                  <div class="four-pillars">
                    <div class="pillar-item">
                      <div class="pillar-label">
                        <span>Personality</span>
                        <strong>${match.personalityScore}%</strong>
                      </div>
                      <div class="pillar-bar-bg">
                        <div class="pillar-bar-fill" style="width: ${match.personalityScore}%;"></div>
                      </div>
                    </div>

                    <div class="pillar-item">
                      <div class="pillar-label">
                        <span>Interests</span>
                        <strong>${match.interestScore}%</strong>
                      </div>
                      <div class="pillar-bar-bg">
                        <div class="pillar-bar-fill" style="width: ${match.interestScore}%;"></div>
                      </div>
                    </div>

                    <div class="pillar-item">
                      <div class="pillar-label">
                        <span>Skills</span>
                        <strong>${match.skillsScore}%</strong>
                      </div>
                      <div class="pillar-bar-bg">
                        <div class="pillar-bar-fill" style="width: ${match.skillsScore}%;"></div>
                      </div>
                    </div>

                    <div class="pillar-item">
                      <div class="pillar-label">
                        <span>Values</span>
                        <strong>${match.valuesScore}%</strong>
                      </div>
                      <div class="pillar-bar-bg">
                        <div class="pillar-bar-fill" style="width: ${match.valuesScore}%;"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Dual Fit Analysis Grid (Why it fits & Tradeoffs) -->
                  <div class="fit-analysis-grid">
                    <!-- Why It Fits -->
                    <div class="fit-box">
                      <div class="fit-box-title">
                        <span>✓</span>
                        <span>Why this career fits you</span>
                      </div>
                      <ul class="analysis-list">
                        ${match.matchReasons.map(r => `<li>${r}</li>`).join('')}
                      </ul>
                    </div>

                    <!-- Tradeoffs / Why It May Not Fit -->
                    <div class="tradeoff-box">
                      <div class="tradeoff-box-title">
                        <span>⚡</span>
                        <span>Tradeoffs & watch-outs</span>
                      </div>
                      <ul class="analysis-list">
                        ${match.gapWarnings.map(w => `<li>${w}</li>`).join('')}
                      </ul>
                    </div>
                  </div>

                  <!-- Stats Row & Deep Dive Link -->
                  <div class="rec-stats-row">
                    <div class="rec-stat-items">
                      <div class="rec-stat-item">
                        <span>Salary:</span>
                        <strong>$${(c.salary.low / 1000).toFixed(0)}k – $${(c.salary.high / 1000).toFixed(0)}k</strong>
                        <small style="color:var(--color-warm-gray-light);">(med: $${(c.salary.median / 1000).toFixed(0)}k)</small>
                      </div>

                      <div class="rec-stat-item">
                        <span>Growth:</span>
                        <strong>+${c.growthPct}% (${c.growth})</strong>
                      </div>

                      <div class="rec-stat-item">
                        <span>Work Setting:</span>
                        <strong>${c.environments.join(', ')}</strong>
                      </div>
                    </div>

                    <a href="#/career/${c.id}" class="btn btn-secondary btn-sm" style="font-weight: 600; color: var(--color-forest);">
                      Deep dive into ${c.title} →
                    </a>
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="card" style="text-align: center; padding: var(--space-3xl);">
                <p style="color: var(--color-warm-gray); margin-bottom: var(--space-md);">No careers found in this field for your current filter.</p>
                <button class="btn btn-secondary" onclick="renderRecommendations(document.getElementById('app'))">Reset filters</button>
              </div>
            `}
          </div>

          <!-- Bottom Explore / Compare Teaser -->
          <div style="background: var(--color-cream-dark); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: var(--space-xl); margin-top: var(--space-2xl); text-align: center;">
            <h3 class="font-display" style="font-size: 1.5rem; margin-bottom: var(--space-xs);">Want to compare careers side-by-side?</h3>
            <p style="color: var(--color-warm-gray); font-size: 0.95rem; margin-bottom: var(--space-lg); max-width: 600px; margin-left: auto; margin-right: auto;">
              Open our Interactive Dashboard to compare 2 to 3 careers simultaneously across salaries, daily routines, and skills gaps.
            </p>
            <a href="#/dashboard" class="btn btn-primary">
              Open Interactive Comparison Dashboard →
            </a>
          </div>
        </div>
      </div>
    `;

    bindControls();
  }

  function bindControls() {
    // Filter pills
    app.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        activeFilter = pill.getAttribute('data-filter');
        renderList();
      });
    });

    // Sort select
    const sortSelect = app.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        activeSort = e.target.value;
        renderList();
      });
    }

    // Bookmark toggles
    app.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-id');
        const isNowBookmarked = toggleBookmark(cid);
        btn.textContent = isNowBookmarked ? '★ Saved' : '☆ Save';
        showToast(isNowBookmarked ? 'Career saved to your bookmarks!' : 'Removed from bookmarks');
      });
    });
  }

  renderList();
}
