'use client';

import React, { useState } from 'react';

export default function CourseDisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside 
      className="course-disclaimer-banner" 
      role="complementary" 
      aria-label="Course Prototype Disclaimer"
    >
      <div className="course-disclaimer-inner">
        <div className="course-disclaimer-content">
          <span className="course-disclaimer-badge">Academic Prototype</span>
          <span className="course-disclaimer-text">
            <strong>ENTR 3360 Entrepreneurship Course:</strong> This web application is a student learning prototype built for class evaluation. It is not an official commercial product or company service.
          </span>
        </div>
        <button 
          className="course-disclaimer-close" 
          onClick={() => setDismissed(true)}
          aria-label="Dismiss disclaimer"
          title="Dismiss disclaimer"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
