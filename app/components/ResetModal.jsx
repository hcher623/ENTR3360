'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '../context/ProfileContext';

export default function ResetModal() {
  const router = useRouter();
  const { showResetDialog, setShowResetDialog, resetProfile } = useProfile();

  if (!showResetDialog) return null;

  const handleConfirm = () => {
    resetProfile();
    setShowResetDialog(false);
    router.push('/');
  };

  return (
    <div className="modal-overlay" onClick={() => setShowResetDialog(false)}>
      <div 
        className="modal" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="reset-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon">🔄</div>
        <h3 id="reset-modal-title">Start fresh?</h3>
        <p>This will clear your current answers and saved preferences so you can build a new profile whenever you're ready.</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowResetDialog(false)}>
            Keep my data
          </button>
          <button className="btn btn-danger" onClick={handleConfirm}>
            Clear & Reset
          </button>
        </div>
      </div>
    </div>
  );
}
