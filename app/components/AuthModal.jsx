'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
  const { signIn, signUp, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setAuthError(null);
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result =
      mode === 'signup'
        ? await signUp(fields)
        : await signIn(fields);
    setLoading(false);
    if (result.success) onClose();
  };

  const switchMode = () => {
    setAuthError(null);
    setFields({ name: '', email: '', password: '' });
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
  };

  return (
    <div className="modal-overlay" id="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="auth-modal-header">
          <span className="auth-modal-icon">🧭</span>
          <h2 id="auth-modal-title" className="auth-modal-title">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="auth-modal-subtitle">
            {mode === 'signin'
              ? 'Sign in to continue your career journey.'
              : 'Join Myrimaven and discover careers built for you.'}
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jordan Lee"
                value={fields.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={fields.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {authError && (
            <p className="auth-error" role="alert">
              {authError}
            </p>
          )}

          <button
            id={mode === 'signin' ? 'auth-signin-btn' : 'auth-signup-btn'}
            type="submit"
            className="btn btn-primary btn-auth-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : mode === 'signin'
              ? 'Sign in'
              : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-modal-footer">
          <p>
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button id="auth-mode-toggle" className="auth-link-btn" onClick={switchMode}>
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Close */}
        <button
          id="auth-modal-close"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
