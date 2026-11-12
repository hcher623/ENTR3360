'use client';

import React, { useState } from 'react';
import { useAuth, TEST_ACCOUNT } from '../context/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--color-border)',
  fontSize: '0.9rem'
};

export default function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithTestAccount, requestPasswordReset, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localMsg, setLocalMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setLocalMsg('');
    setIsSuccess(false);
    setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalMsg('');
    setIsSuccess(false);
    setAuthError(null);

    if (!email.trim()) {
      setLocalMsg('Please enter your email address.');
      return;
    }
    if (mode !== 'forgot' && !password) {
      setLocalMsg('Please enter your password.');
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setLocalMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = mode === 'forgot'
        ? await requestPasswordReset(email)
        : mode === 'signup'
          ? await signUp(email, password, name)
          : await signIn(email, password);

      if (res?.error) {
        setLocalMsg(res.error);
      } else if (mode === 'forgot' && res?.success) {
        setIsSuccess(true);
        setLocalMsg('If an account exists for that email, a password reset link is on its way. Check your inbox.');
      } else if (res?.success) {
        onClose();
      }
    } catch (err) {
      setLocalMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccount = async () => {
    setLoading(true);
    try {
      const res = await signInWithTestAccount();
      if (res?.success) onClose();
      else if (res?.error) setLocalMsg(res.error);
    } finally {
      setLoading(false);
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
        <button id="auth-modal-close" className="auth-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="auth-modal-header" style={{ marginBottom: 'var(--space-md)' }}>
          <span className="auth-modal-icon">🧭</span>
          <h2 id="auth-modal-title" className="auth-modal-title" style={{ fontSize: '1.6rem', margin: '0.2rem 0' }}>
            {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create an Account' : 'Reset Password'}
          </h2>
          <p className="auth-modal-subtitle" style={{ fontSize: '0.875rem' }}>
            {mode === 'signin'
              ? 'Sign in to access your private saved paths and personalized records.'
              : mode === 'signup'
                ? 'Create an account to save your discoveries across sessions.'
                : 'Enter your email and we’ll send you a secure password reset link.'}
          </p>
        </div>

        {mode !== 'forgot' && (
          <div style={{ background: 'var(--color-forest-tint)', border: '1px solid rgba(30, 64, 48, 0.2)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-sm) var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-forest)', letterSpacing: '0.04em' }}>
                  Course Grader / Test Account
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}><code>{TEST_ACCOUNT.email}</code></div>
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
        )}

        {mode !== 'forgot' && (
          <div style={{ display: 'flex', background: 'var(--color-cream-dark)', borderRadius: 'var(--radius-full)', padding: 3, marginBottom: 'var(--space-md)' }}>
            {['signin', 'signup'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => changeMode(tab)}
                style={{
                  flex: 1,
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: mode === tab ? 'var(--color-white)' : 'transparent',
                  fontWeight: mode === tab ? 600 : 400,
                  color: 'var(--color-near-black)',
                  boxShadow: mode === tab ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
        )}

        {(localMsg || authError) && (
          <div
            role={isSuccess ? 'status' : 'alert'}
            style={{
              background: isSuccess ? 'var(--color-forest-tint)' : 'var(--color-danger-tint)',
              border: `1px solid ${isSuccess ? 'rgba(30, 64, 48, 0.2)' : 'rgba(220, 38, 38, 0.25)'}`,
              color: isSuccess ? 'var(--color-forest)' : 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.75rem',
              fontSize: '0.825rem',
              marginBottom: 'var(--space-sm)'
            }}
          >
            {isSuccess ? '✓ ' : '⚠️ '}{localMsg || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {mode === 'signup' && (
            <div>
              <label htmlFor="auth-name" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
                Your Name
              </label>
              <input id="auth-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Morgan" className="input-field" style={inputStyle} />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              required
              autoComplete="email"
              className="input-field"
              style={inputStyle}
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label htmlFor="auth-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="input-field"
                style={inputStyle}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 'var(--space-xs)', padding: '0.65rem' }}>
            {loading ? 'Processing...' : mode === 'forgot' ? 'Send Reset Link →' : mode === 'signup' ? 'Create My Account →' : 'Sign In →'}
          </button>
        </form>

        {mode === 'signin' && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => changeMode('forgot')} style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
            Forgot password?
          </button>
        )}
        {mode === 'forgot' && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => changeMode('signin')} style={{ width: '100%', marginTop: 'var(--space-sm)' }}>
            ← Back to sign in
          </button>
        )}

        <p className="auth-modal-legal" style={{ marginTop: 'var(--space-md)', fontSize: '0.75rem', color: 'var(--color-warm-gray)' }}>
          By continuing, you agree to CareerCompass prototype evaluation terms. Sessions persist automatically across page refreshes.
        </p>
      </div>
    </div>
  );
}
