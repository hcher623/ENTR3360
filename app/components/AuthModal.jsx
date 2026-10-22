'use client';

import React, { useState } from 'react';
import { useAuth, TEST_ACCOUNT } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithTestAccount, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localMsg, setLocalMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalMsg('');
    if (!email || !password) {
      setLocalMsg('Please enter both email and password.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setLocalMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    let res;
    if (mode === 'signup') {
      res = await signUp(email, password, name);
    } else {
      res = await signIn(email, password);
    }
    setLoading(false);

    if (res?.error) {
      setLocalMsg(res.error);
    } else if (res?.success) {
      onClose();
    }
  };

  const handleTestAccount = async () => {
    setLoading(true);
    const res = await signInWithTestAccount();
    setLoading(false);
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" id="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 440 }}
      >
        {/* Close Button */}
        <button
          id="auth-modal-close"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="auth-modal-header" style={{ marginBottom: 'var(--space-md)' }}>
          <span className="auth-modal-icon">🧭</span>
          <h2 id="auth-modal-title" className="auth-modal-title" style={{ fontSize: '1.6rem', margin: '0.2rem 0' }}>
            {mode === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="auth-modal-subtitle" style={{ fontSize: '0.875rem' }}>
            {mode === 'signin' 
              ? 'Sign in to access your private saved paths and personalized records.' 
              : 'Create an account to save your discoveries across sessions.'}
          </p>
        </div>

        {/* One-Click Grader / Test Account Button */}
        <div style={{ background: 'var(--color-forest-tint)', border: '1px solid rgba(30, 64, 48, 0.2)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest)', letterSpacing: '0.04em' }}>
                Course Grader / Test Account
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>
                <code>{TEST_ACCOUNT.email}</code>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleTestAccount}
              disabled={loading}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              ⚡ 1-Click Login
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'var(--color-cream-dark)', borderRadius: 'var(--radius-full)', padding: 3, marginBottom: 'var(--space-md)' }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setLocalMsg(''); }}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'signin' ? 'var(--color-white)' : 'transparent',
              fontWeight: mode === 'signin' ? 600 : 400,
              color: 'var(--color-near-black)',
              boxShadow: mode === 'signin' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setLocalMsg(''); }}
            style={{
              flex: 1,
              padding: '0.45rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'signup' ? 'var(--color-white)' : 'transparent',
              fontWeight: mode === 'signup' ? 600 : 400,
              color: 'var(--color-near-black)',
              boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {(localMsg || authError) && (
          <div style={{ background: 'var(--color-danger-tint)', border: '1px solid rgba(220, 38, 38, 0.25)', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', fontSize: '0.825rem', marginBottom: 'var(--space-sm)' }}>
            ⚠️ {localMsg || authError}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="input-field"
                style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              required
              className="input-field"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
              required
              className="input-field"
              style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-border)', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 'var(--space-xs)', padding: '0.65rem' }}
          >
            {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In →' : 'Create My Account →')}
          </button>
        </form>

        <p className="auth-modal-legal" style={{ marginTop: 'var(--space-md)', fontSize: '0.75rem', color: 'var(--color-warm-gray)' }}>
          By continuing, you agree to CareerCompass prototype evaluation terms. Sessions persist automatically across page refreshes.
        </p>
      </div>
    </div>
  );
}
