'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function NavHeader() {
  const pathname = usePathname();
  const { profile, setShowResetDialog } = useProfile();
  const { user, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'Summary', href: '/results' },
    { label: 'Recommendations', href: '/recommendations' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <nav className="main-nav" id="main-nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" aria-label="Myrimaven Home">
            <span className="logo-mark">🧭</span>
            <span className="logo-text">myrimaven</span>
          </Link>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="nav-actions">
            {profile && (
              <button
                className="nav-reset-btn visible"
                onClick={() => setShowResetDialog(true)}
                title="Reset all data and start fresh"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                <span>Reset</span>
              </button>
            )}

            {/* Auth area */}
            {isAuthenticated ? (
              <div className="nav-user-wrap">
                <button
                  id="nav-user-avatar"
                  className="nav-avatar-btn"
                  onClick={() => setShowUserMenu((v) => !v)}
                  aria-label="User menu"
                  title={user.name}
                >
                  <span className="nav-avatar-initials">{initials}</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="nav-user-backdrop"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="nav-user-menu" role="menu">
                      <div className="nav-user-info">
                        <span className="nav-user-name">{user.name}</span>
                        <span className="nav-user-email">{user.email}</span>
                      </div>
                      <hr className="nav-user-divider" />
                      <button
                        id="nav-signout-btn"
                        className="nav-user-action"
                        role="menuitem"
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                id="nav-login-btn"
                className="nav-login-btn"
                onClick={() => setShowAuthModal(true)}
              >
                Sign in
              </button>
            )}

            <button
              className="nav-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
