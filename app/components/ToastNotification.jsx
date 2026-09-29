'use client';

import React from 'react';
import { useProfile } from '../context/ProfileContext';

export default function ToastNotification() {
  const { toast } = useProfile();

  if (!toast) return null;

  return (
    <div className="toast-container" aria-live="polite">
      <div className={`toast ${toast.type}`}>
        <span>{toast.type === 'success' ? '✓' : 'ℹ'}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
