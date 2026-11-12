'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: 'var(--radius-md)',
  border: '1.5px solid var(--color-border)',
  fontSize: '0.9rem'
};

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const [loading, setLoading] = useState(true);
  const [canReset, setCanReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const isRecoveryUrl = hashParams.get('type') === 'recovery';

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY' && session) {
        setCanReset(true);
        setLoading(false);
      }
    });

    // The client processes the recovery URL and stores a short-lived session.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (isRecoveryUrl && session) setCanReset(true);
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      const result = await updatePassword(newPassword);
      if (result?.error) {
        setError(result.error);
      } else {
        setCanReset(false);
        setMessage('Your password has been updated. You can now return to CareerCompass.');
      }
    } catch (err) {
      setError(err.message || 'Unable to update your password. Please request a new reset link.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page container-narrow" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <div className="card" style={{ maxWidth: 440, margin: '0 auto' }}>
        <h1 className="font-display" style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>Set New Password</h1>

        {loading ? (
          <p role="status" style={{ color: 'var(--color-warm-gray)' }}>Verifying your password reset link…</p>
        ) : canReset ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div>
              <label htmlFor="new-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                className="input-field"
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-near-black)' }}>
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter the password again"
                autoComplete="new-password"
                required
                className="input-field"
                style={inputStyle}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
              {saving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        ) : (
          <div>
            <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.6 }}>
              This password reset link is invalid or has expired. Return to the app and request a new one.
            </p>
            <Link href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 'var(--space-sm)' }}>
              Return to CareerCompass
            </Link>
          </div>
        )}

        {(message || error) && (
          <div
            role={error ? 'alert' : 'status'}
            style={{
              marginTop: 'var(--space-md)',
              borderRadius: 'var(--radius-md)',
              background: error ? 'var(--color-danger-tint)' : 'var(--color-forest-tint)',
              color: error ? 'var(--color-danger)' : 'var(--color-forest)',
              border: `1px solid ${error ? 'rgba(220, 38, 38, 0.25)' : 'rgba(30, 64, 48, 0.2)'}`,
              padding: '0.75rem',
              fontSize: '0.875rem'
            }}
          >
            {error || message}
          </div>
        )}

        {message && (
          <Link href="/" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: 'var(--space-sm)' }}>
            Continue to CareerCompass
          </Link>
        )}
      </div>
    </div>
  );
}
