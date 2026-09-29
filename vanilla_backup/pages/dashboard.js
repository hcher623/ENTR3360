/**
 * Page 5: Interactive Career Explorer & Side-by-Side Comparison Tool
 * Directly implements user feedback:
 * - Interactive search, field filters, and sorting
 * - Compare Mode: Select 2 or 3 careers to compare side-by-side
 * - Comprehensive side-by-side comparison table including fit and trade-offs
 * - Access to saved bookmarks
 * - Quick edit answers and reset profile
 */

import { CAREERS, SECTORS, getCareerById } from '../data/careers.js';
import { matchCareers } from '../engine/matcher.js';
import { getProfile, getBookmarks, toggleBookmark, showToast, showResetModal } from '../app.js';

export function renderDashboard(app) {
  const profile = getProfile();
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

  let searchQuery = '';
  let activeField = 'all';
  let activeSort = 'score';
  let compareIds = [];
  let isCompareMode = false;
  let showOnlyBookmarks = false;

  function renderView() {
    let filtered = [...allResults];
    const bookmarks = getBookmarks();

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

    app.innerHTML = `
      <div class="page container" id="dashboard-page">
        <!-- Dashboard Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: var(--space-md);">
          <div>
            <div class="badge-tag">Interactive Explorer & Comparison Hub</div>
            <h1 class="font-display" style="font-size: clamp(2.4rem, 4vw, 3.25rem); font-weight: 400; margin: var(--space-xs) 0;">
              ${profile ? `${profile.name || 'Your'} Career Landscape` : 'Explore All Careers'}
            </h1>
            <p style="color: var(--color-warm-gray); font-size: 1.05rem; max-width: 650px;">
              ${profile 
                ? 'Search, filter, or select 2 to 3 careers to compare side-by-side. Tweak answers or reset anytime.' 
                : 'Browse all 15 careers or complete your discovery profile to see personalized compatibility scores.'}
            </p>
          </div>

          <div style="display: flex; gap: var(--space-sm); align-items: center; flex-wrap: wrap;">
            <button class="btn ${isCompareMode ? 'btn-primary' : 'btn-secondary'}" id="toggle-compare-mode-btn">
              ⚖️ ${isCompareMode ? `Comparing (${compareIds.length}/3)` : 'Compare mode'}
            </button>
            <a href="#/discover" class="btn btn-secondary btn-sm">
              ✎ Edit answers
            </a>
            <button class="btn btn-ghost btn-sm" id="dash-reset-btn" title="Reset profile">
              🔄 Reset
            </button>
          </div>
        </div>

        <!-- Side-by-Side Comparison Box (If in compare mode and at least 2 selected) -->
        ${isCompareMode && comparedCareers.length >= 2 ? `
          <div style="margin-bottom: var(--space-2xl); background: var(--color-cream-dark); border: 2px solid var(--color-forest); border-radius: var(--radius-2xl); padding: var(--space-xl);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
              <div>
                <h3 class="font-display" style="font-size: 1.6rem; color: var(--color-near-black);">
                  Side-by-Side Career Comparison
                </h3>
                <p style="font-size: 0.875rem; color: var(--color-warm-gray);">
                  Comparing ${comparedCareers.length} careers directly across criteria, required skills, and fit.
                </p>
              </div>
              <button class="btn btn-ghost btn-sm" id="clear-compare-btn" style="color: var(--color-danger);">
                Clear comparison
              </button>
            </div>

            <!-- Comparison Table -->
            <div class="compare-table-container">
              <table class="compare-table">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    ${comparedCareers.map(c => `
                      <td>
                        <div class="compare-career-header">${c.career.title}</div>
                        <span class="rec-field-chip" style="background: ${c.career.fieldColor};">${c.career.field}</span>
                      </td>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${profile ? `
                    <tr>
                      <th>Match Score</th>
                      ${comparedCareers.map(c => `
                        <td>
                          <strong style="font-size: 1.3rem; color: var(--color-forest);">${c.score}%</strong>
                          <div style="font-size: 0.75rem; color: var(--color-warm-gray);">Personality: ${c.personalityScore}% | Skills: ${c.skillsScore}%</div>
                        </td>
                      `).join('')}
                    </tr>
                  ` : ''}

                  <tr>
                    <th>Median Salary</th>
                    ${comparedCareers.map(c => `
                      <td>
                        <strong>$${(c.career.salary.median / 1000).toFixed(0)}k / year</strong>
                        <div style="font-size: 0.8rem; color: var(--color-warm-gray);">$${(c.career.salary.low / 1000).toFixed(0)}k – $${(c.career.salary.high / 1000).toFixed(0)}k</div>
                      </td>
                    `).join('')}
                  </tr>

                  <tr>
                    <th>Growth Outlook</th>
                    ${comparedCareers.map(c => `
                      <td>
                        <strong style="color: var(--color-forest);">+${c.career.growthPct}%</strong>
                        <span style="font-size: 0.85rem; color: var(--color-warm-gray);">(${c.career.growth})</span>
                      </td>
                    `).join('')}
                  </tr>

                  <tr>
                    <th>Work Setting</th>
                    ${comparedCareers.map(c => `
                      <td>${c.career.environments.join(', ')}</td>
                    `).join('')}
                  </tr>

                  <tr>
                    <th>Required Skills</th>
                    ${comparedCareers.map(c => `
                      <td>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                          ${c.career.requiredSkills.map(s => {
                            const hasSkill = profile?.skills?.includes(s);
                            return `
                              <span style="font-size: 0.75rem; padding: 2px 7px; border-radius: 12px; background: ${hasSkill ? 'var(--color-forest-tint)' : 'var(--color-cream-dark)'}; color: ${hasSkill ? 'var(--color-forest)' : 'var(--color-warm-gray)'}; font-weight: ${hasSkill ? '600' : '400'};">
                                ${hasSkill ? '✓ ' : ''}${s}
                              </span>
                            `;
                          }).join('')}
                        </div>
                      </td>
                    `).join('')}
                  </tr>

                  ${profile ? `
                    <tr>
                      <th>Why It Fits</th>
                      ${comparedCareers.map(c => `
                        <td style="font-size: 0.85rem; color: var(--color-forest);">
                          ${c.matchReasons[0] || 'General profile alignment.'}
                        </td>
                      `).join('')}
                    </tr>

                    <tr>
                      <th>Tradeoff / Watch-Out</th>
                      ${comparedCareers.map(c => `
                        <td style="font-size: 0.85rem; color: var(--color-amber);">
                          ${c.gapWarnings[0] || 'Check specific qualifications.'}
                        </td>
                      `).join('')}
                    </tr>
                  ` : ''}

                  <tr>
                    <th>Action</th>
                    ${comparedCareers.map(c => `
                      <td>
                        <a href="#/career/${c.career.id}" class="btn btn-secondary btn-sm" style="font-weight: 600;">
                          View Full Deep Dive →
                        </a>
                      </td>
                    `).join('')}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ` : isCompareMode ? `
          <div style="margin-bottom: var(--space-xl); background: var(--color-forest-tint); border: 1px dashed var(--color-forest); border-radius: var(--radius-xl); padding: var(--space-lg); text-align: center;">
            <p style="font-weight: 600; color: var(--color-forest); margin-bottom: 0.2rem;">
              Compare Mode Active (${compareIds.length}/3 selected)
            </p>
            <p style="font-size: 0.875rem; color: var(--color-warm-gray);">
              Click the "Select to Compare" checkboxes on any 2 or 3 career cards below to view the side-by-side comparison matrix.
            </p>
          </div>
        ` : ''}

        <!-- Filter & Search Bar -->
        <div style="background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: var(--space-lg); margin-bottom: var(--space-xl);">
          <div style="display: grid; grid-template-columns: 1.5fr 1fr auto; gap: var(--space-md); align-items: center;">
            <!-- Search input -->
            <div>
              <input type="text" id="dash-search-input" class="form-input" 
                     placeholder="Search by career, skill, or keyword..." 
                     value="${searchQuery}">
            </div>

            <!-- Field filter -->
            <div>
              <select id="dash-field-select" class="form-input">
                <option value="all" ${activeField === 'all' ? 'selected' : ''}>All Fields (${CAREERS.length})</option>
                ${SECTORS.map(s => `
                  <option value="${s.id}" ${activeField === s.id ? 'selected' : ''}>${s.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Sort -->
            <div style="display: flex; gap: var(--space-xs);">
              <select id="dash-sort-select" class="form-input">
                <option value="score" ${activeSort === 'score' ? 'selected' : ''}>Highest Match</option>
                <option value="salary" ${activeSort === 'salary' ? 'selected' : ''}>Median Salary</option>
                <option value="growth" ${activeSort === 'growth' ? 'selected' : ''}>Growth Rate</option>
                <option value="alpha" ${activeSort === 'alpha' ? 'selected' : ''}>Alphabetical</option>
              </select>

              <button class="btn ${showOnlyBookmarks ? 'btn-primary' : 'btn-secondary'} btn-sm" id="toggle-bookmarks-filter" title="Filter bookmarked careers">
                ★ ${bookmarks.length}
              </button>
            </div>
          </div>
        </div>

        <!-- Career Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-lg);">
          ${filtered.length > 0 ? filtered.map(r => {
            const c = r.career;
            const isCompared = compareIds.includes(c.id);
            const isBookmarked = bookmarks.includes(c.id);

            return `
              <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between; border-color: ${isCompared ? 'var(--color-forest)' : 'var(--color-border)'}; box-shadow: ${isCompared ? '0 0 0 2px var(--color-forest)' : 'none'};">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xs);">
                    <span class="rec-field-chip" style="background: ${c.fieldColor}; font-size: 0.7rem;">
                      ${c.field}
                    </span>

                    ${profile ? `
                      <span style="font-weight: 700; color: var(--color-forest); font-size: 1.1rem;">
                        ${r.score}%
                      </span>
                    ` : ''}
                  </div>

                  <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem;">
                    <a href="#/career/${c.id}" style="color: var(--color-near-black); hover:text-decoration: underline;">
                      ${c.title}
                    </a>
                  </h3>
                  <div style="font-size: 0.85rem; color: var(--color-warm-gray); margin-bottom: var(--space-md); line-height: 1.45;">
                    ${c.tagline}
                  </div>

                  <!-- Quick Stats -->
                  <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--color-warm-gray); background: var(--color-cream-dark); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
                    <span>💰 $${(c.salary.median / 1000).toFixed(0)}k/yr</span>
                    <span>📈 +${c.growthPct}%</span>
                    <span>🏢 ${c.environments[0]}</span>
                  </div>

                  <!-- Tradeoff snippet -->
                  ${profile ? `
                    <div style="font-size: 0.8rem; color: var(--color-amber); background: var(--color-amber-tint); padding: 0.4rem 0.6rem; border-radius: var(--radius-md); margin-bottom: var(--space-md); line-height: 1.4;">
                      ⚡ ${r.gapWarnings[0] || 'Check required qualifications.'}
                    </div>
                  ` : ''}
                </div>

                <!-- Card Footer Actions -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: var(--space-md); margin-top: var(--space-sm);">
                  <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.825rem; cursor: pointer; color: var(--color-warm-gray);">
                    <input type="checkbox" class="compare-checkbox" data-id="${c.id}" ${isCompared ? 'checked' : ''}>
                    <span>Compare</span>
                  </label>

                  <div style="display: flex; gap: var(--space-2xs);">
                    <button class="btn btn-ghost btn-sm card-bookmark-btn" data-id="${c.id}" title="Save career">
                      ${isBookmarked ? '★' : '☆'}
                    </button>
                    <a href="#/career/${c.id}" class="btn btn-secondary btn-sm" style="font-weight: 500;">
                      View Details →
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="card" style="grid-column: 1 / -1; text-align: center; padding: var(--space-3xl);">
              <p style="color: var(--color-warm-gray); margin-bottom: var(--space-md);">No careers matched your search or filters.</p>
              <button class="btn btn-secondary" id="dash-clear-filters-btn">Clear search & filters</button>
            </div>
          `}
        </div>
      </div>
    `;

    bindDashboardEvents();
  }

  function bindDashboardEvents() {
    // Search input
    const searchInput = app.querySelector('#dash-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderView();
      });
    }

    // Field select
    const fieldSelect = app.querySelector('#dash-field-select');
    if (fieldSelect) {
      fieldSelect.addEventListener('change', (e) => {
        activeField = e.target.value;
        renderView();
      });
    }

    // Sort select
    const sortSelect = app.querySelector('#dash-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        activeSort = e.target.value;
        renderView();
      });
    }

    // Bookmarks toggle
    const bookmarksBtn = app.querySelector('#toggle-bookmarks-filter');
    if (bookmarksBtn) {
      bookmarksBtn.addEventListener('click', () => {
        showOnlyBookmarks = !showOnlyBookmarks;
        renderView();
      });
    }

    // Compare mode toggle
    const compareModeBtn = app.querySelector('#toggle-compare-mode-btn');
    if (compareModeBtn) {
      compareModeBtn.addEventListener('click', () => {
        isCompareMode = !isCompareMode;
        renderView();
      });
    }

    // Clear comparison
    const clearCompareBtn = app.querySelector('#clear-compare-btn');
    if (clearCompareBtn) {
      clearCompareBtn.addEventListener('click', () => {
        compareIds = [];
        renderView();
      });
    }

    // Compare checkboxes
    app.querySelectorAll('.compare-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const cid = cb.getAttribute('data-id');
        if (e.target.checked) {
          if (compareIds.length >= 3) {
            showToast('You can compare up to 3 careers at once.', 'info');
            e.target.checked = false;
            return;
          }
          compareIds.push(cid);
          isCompareMode = true;
        } else {
          compareIds = compareIds.filter(id => id !== cid);
        }
        renderView();
      });
    });

    // Bookmark buttons
    app.querySelectorAll('.card-bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-id');
        const isSaved = toggleBookmark(cid);
        btn.textContent = isSaved ? '★' : '☆';
        showToast(isSaved ? 'Saved to bookmarks!' : 'Removed from bookmarks');
      });
    });

    // Reset button
    const resetBtn = app.querySelector('#dash-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        showResetModal(() => {
          window.location.hash = '#/';
        });
      });
    }

    // Clear filters button
    const clearFiltersBtn = app.querySelector('#dash-clear-filters-btn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        searchQuery = '';
        activeField = 'all';
        showOnlyBookmarks = false;
        renderView();
      });
    }
  }

  renderView();
}
