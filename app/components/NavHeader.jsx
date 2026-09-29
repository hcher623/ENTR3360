'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProfile } from '../context/ProfileContext';

export default function NavHeader() {
  const pathname = usePathname();
  const { profile, setShowResetDialog } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'Summary', href: '/results' },
    { label: 'Recommendations', href: '/recommendations' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
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
  );
}
