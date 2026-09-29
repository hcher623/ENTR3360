/**
 * Myrimaven — Application Controller
 * Handles SPA routing, global state, persistence, and reset flows.
 */

import { renderLanding } from './pages/landing.js';
import { renderDiscover } from './pages/discover.js';
import { renderResults } from './pages/results.js';
import { renderRecommendations } from './pages/recommendations.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCareerDetail } from './pages/career-detail.js';

// ── Storage Keys ─────────────────────────────────────────
const STORAGE_KEYS = {
  PROFILE: 'myrimaven_profile',
  BOOKMARKS: 'myrimaven_bookmarks',
  COMPARE: 'myrimaven_compare'
};

// ── State Getters & Setters ──────────────────────────────
export function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  updateResetNavVisibility();
}

export function clearProfile() {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.COMPARE);
  updateResetNavVisibility();
}

export function getBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(careerId) {
  const current = getBookmarks();
  const idx = current.indexOf(careerId);
  if (idx === -1) {
    current.push(careerId);
  } else {
    current.splice(idx, 1);
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(current));
  return current.includes(careerId);
}

// ── Global Toast ─────────────────────────────────────────
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// ── Global Reset Confirmation Modal ──────────────────────
export function showResetModal(onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
      <div class="modal-icon">🔄</div>
      <h3 id="reset-modal-title">Start fresh?</h3>
      <p>This will clear your current answers and saved preferences so you can build a new profile whenever you're ready.</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="modal-cancel">Keep my data</button>
        <button class="btn btn-danger" id="modal-confirm">Clear & Reset</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('#modal-cancel').addEventListener('click', close);
  overlay.querySelector('#modal-confirm').addEventListener('click', () => {
    clearProfile();
    close();
    showToast('Profile reset successfully. Ready for a new start!', 'success');
    if (onConfirm) onConfirm();
    else window.location.hash = '#/';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

// ── Navigation Bar Helpers ───────────────────────────────
function updateResetNavVisibility() {
  const btn = document.getElementById('nav-reset-btn');
  if (!btn) return;
  const hasProfile = !!getProfile();
  btn.classList.toggle('visible', hasProfile);
}

function updateActiveNav(route) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkRoute = link.getAttribute('data-route');
    link.classList.toggle('active', linkRoute === route);
  });
}

// ── SPA Router ───────────────────────────────────────────
function resolveRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const [pathWithQuery, ...extra] = hash.split('/').filter(Boolean);
  
  // Extract path and query params (e.g. #/discover?step=2)
  let path = pathWithQuery || '';
  let queryString = '';
  if (path.includes('?')) {
    const parts = path.split('?');
    path = parts[0];
    queryString = parts[1];
  }
  const route = '/' + path;
  const params = extra;

  const app = document.getElementById('app');
  if (!app) return;

  updateActiveNav(route);
  updateResetNavVisibility();

  switch (route) {
    case '/':
      renderLanding(app);
      break;
    case '/discover':
    case '/onboarding':
      renderDiscover(app, queryString);
      break;
    case '/results':
    case '/profile-summary':
      renderResults(app);
      break;
    case '/recommendations':
    case '/explore':
      renderRecommendations(app);
      break;
    case '/dashboard':
      renderDashboard(app);
      break;
    case '/career':
      renderCareerDetail(app, params);
      break;
    default:
      renderLanding(app);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Application Initialization ───────────────────────────
function initApp() {
  window.addEventListener('hashchange', resolveRoute);
  window.addEventListener('load', resolveRoute);

  // Reset button in navbar
  const resetBtn = document.getElementById('nav-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => showResetModal());
  }

  // Mobile menu toggle
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        navLinks.classList.remove('open');
      }
    });
  }

  updateResetNavVisibility();
}

if (typeof window !== 'undefined') {
  initApp();
}
