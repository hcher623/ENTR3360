/**
 * Career Detail Page — Deep Dive & Fit Analysis
 * In-depth career profile with:
 * - High-res hero visual & sector tag
 * - Personalized fit & watch-outs analysis (if profile exists)
 * - Required skills vs User profile skills gap visualizer
 * - "A Day in the Life" narrative
 * - Education & career entry pathways
 * - Honest pros and cons
 * - Back navigation to recommendations and dashboard
 */

import { getCareerById, CAREERS } from '../data/careers.js';
import { matchCareer } from '../engine/matcher.js';
import { getProfile, getBookmarks, toggleBookmark, showToast } from '../app.js';

export function renderCareerDetail(app, params) {
  const careerId = params?.[0];
  const career = getCareerById(careerId);

  if (!career) {
    app.innerHTML = `
      <div class="page container-narrow" style="text-align:center; padding-top: var(--space-3xl);">
        <h2 class="font-display" style="font-size:2rem; margin-bottom:var(--space-sm);">Career Not Found</h2>
        <p style="color:var(--color-warm-gray); margin-bottom:var(--space-lg);">We couldn't find the career path you were looking for.</p>
        <a href="#/recommendations" class="btn btn-primary">Back to Recommendations</a>
      </div>
    `;
    return;
  }

  const profile = getProfile();
  const matchResult = profile ? matchCareer(career, profile) : null;
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.includes(career.id);

  // Related careers in same field
  const relatedCareers = CAREERS.filter(c => c.id !== career.id && c.field === career.field).slice(0, 3);

  app.innerHTML = `
    <div class="page container" id="career-detail-page">
      <!-- Breadcrumb / Back button -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-md);">
        <a href="#/recommendations" class="btn btn-ghost btn-sm" style="margin-left: -var(--space-xs);">
          ← Back to Recommendations
        </a>
        <button class="btn btn-secondary btn-sm" id="detail-bookmark-btn">
          ${isBookmarked ? '★ Saved in Bookmarks' : '☆ Save Career'}
        </button>
      </div>

      <!-- Hero Visual Section -->
      <div class="career-hero">
        <img src="${career.imageUrl}" alt="${career.title} environment" class="career-hero-img" loading="lazy">
        <div class="career-hero-overlay">
          <div>
            <span class="rec-field-chip" style="background:${career.fieldColor || '#1E4030'};">
              ${career.field}
            </span>
          </div>
          <h1 class="career-hero-title">${career.title}</h1>
          <div class="career-hero-tagline">${career.tagline}</div>
        </div>
      </div>

      <!-- Detail Grid Layout -->
      <div class="career-detail-grid">
        <!-- Main Column -->
        <div>
          <!-- Personalized Fit Panel (if user has profile) -->
          ${matchResult ? `
            <div class="card" style="margin-bottom:var(--space-2xl); border-color:var(--color-forest); background:var(--color-white); box-shadow:var(--shadow-md);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-md); flex-wrap:wrap; gap:var(--space-sm);">
                <div>
                  <div style="font-family:var(--font-mono); font-size:0.75rem; text-transform:uppercase; color:var(--color-forest); letter-spacing:0.06em;">
                    Your Personalized Fit Analysis
                  </div>
                  <h3 style="font-size:1.35rem; font-weight:600; color:var(--color-near-black);">
                    Compatibility Score: ${matchResult.score}%
                  </h3>
                </div>
                <div class="badge-tag" style="background:var(--color-forest-tint); color:var(--color-forest); font-weight:600;">
                  Strong Affinity
                </div>
              </div>

              <!-- 4 Pillars Meter -->
              <div class="four-pillars" style="margin-top:0;">
                <div class="pillar-item">
                  <div class="pillar-label">
                    <span>Personality</span>
                    <strong>${matchResult.personalityScore}%</strong>
                  </div>
                  <div class="pillar-bar-bg">
                    <div class="pillar-bar-fill" style="width:${matchResult.personalityScore}%;"></div>
                  </div>
                </div>
                <div class="pillar-item">
                  <div class="pillar-label">
                    <span>Interests</span>
                    <strong>${matchResult.interestScore}%</strong>
                  </div>
                  <div class="pillar-bar-bg">
                    <div class="pillar-bar-fill" style="width:${matchResult.interestScore}%;"></div>
                  </div>
                </div>
                <div class="pillar-item">
                  <div class="pillar-label">
                    <span>Skills</span>
                    <strong>${matchResult.skillsScore}%</strong>
                  </div>
                  <div class="pillar-bar-bg">
                    <div class="pillar-bar-fill" style="width:${matchResult.skillsScore}%;"></div>
                  </div>
                </div>
                <div class="pillar-item">
                  <div class="pillar-label">
                    <span>Values</span>
                    <strong>${matchResult.valuesScore}%</strong>
                  </div>
                  <div class="pillar-bar-bg">
                    <div class="pillar-bar-fill" style="width:${matchResult.valuesScore}%;"></div>
                  </div>
                </div>
              </div>

              <!-- Dual Why It Fits & Tradeoffs -->
              <div class="fit-analysis-grid">
                <div class="fit-box">
                  <div class="fit-box-title">
                    <span>✓</span>
                    <span>Why this fits who you are</span>
                  </div>
                  <ul class="analysis-list">
                    ${matchResult.matchReasons.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                </div>

                <div class="tradeoff-box">
                  <div class="tradeoff-box-title">
                    <span>⚡</span>
                    <span>Tradeoffs & watch-outs</span>
                  </div>
                  <ul class="analysis-list">
                    ${matchResult.gapWarnings.map(w => `<li>${w}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          ` : `
            <div class="card" style="margin-bottom:var(--space-2xl); background:var(--color-cream-dark); text-align:center; padding:var(--space-xl);">
              <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:var(--space-xs);">Want to see how this fits you?</h3>
              <p style="color:var(--color-warm-gray); font-size:0.9rem; margin-bottom:var(--space-md);">Complete your 5-minute discovery profile to unlock personalized fit breakdown.</p>
              <a href="#/discover" class="btn btn-primary btn-sm">Build Profile →</a>
            </div>
          `}

          <!-- Overview & Day in the Life -->
          <div class="detail-section">
            <h2 class="detail-section-title">
              <span>📖</span>
              <span>About the Role</span>
            </h2>
            <div class="card" style="line-height:1.7; color:var(--color-near-black); font-size:1rem; margin-bottom:var(--space-lg);">
              <p style="margin-bottom:var(--space-md);">${career.description}</p>
              
              <h4 style="font-size:1.05rem; font-weight:600; margin-bottom:0.35rem; color:var(--color-forest);">
                ☀️ A Day in the Life
              </h4>
              <p style="color:var(--color-warm-gray); line-height:1.65;">
                ${career.dayInLife}
              </p>
            </div>
          </div>

          <!-- Skills Gap Visualizer -->
          <div class="detail-section">
            <h2 class="detail-section-title">
              <span>⚡</span>
              <span>Required Skills & Readiness</span>
            </h2>
            <div class="card">
              <p style="font-size:0.875rem; color:var(--color-warm-gray); margin-bottom:var(--space-lg);">
                ${profile ? 'Comparison of core competencies required for this role against your current profile strengths:' : 'Key capabilities practitioners rely on daily:'}
              </p>

              ${career.requiredSkills.map(skill => {
                const userHas = profile?.skills?.includes(skill);
                const pct = userHas ? 90 : 35;
                return `
                  <div class="skill-gap-row">
                    <div class="skill-gap-header">
                      <span style="font-weight:500;">${skill}</span>
                      <span class="${userHas ? 'skill-status-match' : 'skill-status-gap'}">
                        ${userHas ? '✓ In your profile' : 'Growth area'}
                      </span>
                    </div>
                    <div class="skill-track">
                      <div class="${userHas ? 'skill-fill-match' : 'skill-fill-gap'}" style="width:${pct}%;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Pros and Cons -->
          <div class="detail-section">
            <h2 class="detail-section-title">
              <span>⚖️</span>
              <span>The Realistic Balance</span>
            </h2>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-md);">
              <div class="fit-box">
                <div class="fit-box-title">
                  <span>👍</span>
                  <span>Advantages & Upsides</span>
                </div>
                <ul class="analysis-list">
                  ${career.pros.map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>

              <div class="tradeoff-box">
                <div class="tradeoff-box-title">
                  <span>⚠️</span>
                  <span>Known Challenges & Friction</span>
                </div>
                <ul class="analysis-list">
                  ${career.cons.map(c => `<li>${c}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <!-- Education & Entry Pathways -->
          <div class="detail-section">
            <h2 class="detail-section-title">
              <span>🚀</span>
              <span>How People Enter This Field</span>
            </h2>
            <div class="card">
              <div style="font-size:0.925rem; margin-bottom:var(--space-md); color:var(--color-near-black);">
                <strong>Education Baseline:</strong> ${career.education}
              </div>
              <h4 style="font-size:0.95rem; font-weight:600; margin-bottom:var(--space-sm); color:var(--color-warm-gray);">
                Common Career Pathways:
              </h4>
              <ul class="analysis-list">
                ${career.pathways.map(path => `<li>${path}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div>
          <!-- Quick Facts Card -->
          <div class="card" style="margin-bottom:var(--space-lg); position:sticky; top:calc(var(--nav-h) + var(--space-lg));">
            <h3 style="font-size:1.15rem; font-weight:600; margin-bottom:var(--space-md);">
              Quick Facts
            </h3>

            <div style="display:flex; flex-direction:column; gap:var(--space-md); font-size:0.9rem;">
              <div>
                <span style="color:var(--color-warm-gray); display:block; font-size:0.775rem;">Median Salary</span>
                <strong style="font-size:1.25rem; color:var(--color-forest);">$${(career.salary.median / 1000).toFixed(0)}k / year</strong>
                <span style="color:var(--color-warm-gray-light); font-size:0.8rem; display:block;">Range: $${(career.salary.low / 1000).toFixed(0)}k–$${(career.salary.high / 1000).toFixed(0)}k</span>
              </div>

              <div style="border-top:1px solid var(--color-border); padding-top:var(--space-sm);">
                <span style="color:var(--color-warm-gray); display:block; font-size:0.775rem;">Growth Outlook</span>
                <strong style="color:var(--color-near-black); font-size:1.05rem;">+${career.growthPct}% (${career.growth})</strong>
              </div>

              <div style="border-top:1px solid var(--color-border); padding-top:var(--space-sm);">
                <span style="color:var(--color-warm-gray); display:block; font-size:0.775rem;">Work Environments</span>
                <strong>${career.environments.join(', ')}</strong>
              </div>

              <div style="border-top:1px solid var(--color-border); padding-top:var(--space-sm);">
                <span style="color:var(--color-warm-gray); display:block; font-size:0.775rem;">Sector / Field</span>
                <strong>${career.field}</strong>
              </div>
            </div>

            <!-- Related Careers in Sector -->
            ${relatedCareers.length > 0 ? `
              <div style="border-top:1px solid var(--color-border); padding-top:var(--space-md); margin-top:var(--space-md);">
                <span style="color:var(--color-warm-gray); display:block; font-size:0.8rem; font-weight:600; margin-bottom:var(--space-xs);">
                  Related in ${career.field}:
                </span>
                <div style="display:flex; flex-direction:column; gap:var(--space-xs);">
                  ${relatedCareers.map(rel => `
                    <a href="#/career/${rel.id}" style="font-size:0.85rem; color:var(--color-forest); font-weight:500;">
                      → ${rel.title}
                    </a>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div style="margin-top:var(--space-lg); border-top:1px solid var(--color-border); padding-top:var(--space-md);">
              <a href="#/dashboard" class="btn btn-secondary btn-sm" style="width:100%; text-align:center;">
                Compare in Dashboard ⚖️
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bookmark toggle
  const bookmarkBtn = app.querySelector('#detail-bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const isSaved = toggleBookmark(career.id);
      bookmarkBtn.textContent = isSaved ? '★ Saved in Bookmarks' : '☆ Save Career';
      showToast(isSaved ? 'Career saved to your bookmarks!' : 'Removed from bookmarks');
    });
  }
}
