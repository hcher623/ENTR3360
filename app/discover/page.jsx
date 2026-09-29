'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { INTERESTS, SKILLS, VALUES, ENVIRONMENTS } from '../../data/careers.js';
import { getPersonalityArchetype } from '../../engine/matcher.js';
import { useProfile } from '../context/ProfileContext';

const TOTAL_STEPS = 4;

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, saveProfile, showToast, setShowResetDialog } = useProfile();

  const stepParam = searchParams.get('step');
  const initialStep = stepParam ? Math.min(TOTAL_STEPS, Math.max(1, parseInt(stepParam, 10))) : 1;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    name: '',
    personality: { introvert: 50, analytical: 50, structured: 50, collaborative: 50 },
    interests: [],
    skills: [],
    values: [],
    environment: 'No preference'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        personality: profile.personality || { introvert: 50, analytical: 50, structured: 50, collaborative: 50 },
        interests: Array.isArray(profile.interests) ? [...profile.interests] : [],
        skills: Array.isArray(profile.skills) ? [...profile.skills] : [],
        values: Array.isArray(profile.values) ? [...profile.values] : [],
        environment: profile.environment || 'No preference'
      });
    }
  }, [profile]);

  useEffect(() => {
    if (stepParam) {
      const s = parseInt(stepParam, 10);
      if (s >= 1 && s <= TOTAL_STEPS) setCurrentStep(s);
    }
  }, [stepParam]);

  const archetype = getPersonalityArchetype(formData.personality);
  const progressPct = (currentStep / TOTAL_STEPS) * 100;

  const stepMetadata = [
    {
      num: 1,
      label: 'About you',
      title: formData.name ? `Welcome back, ${formData.name}! How do you work?` : `First, let's get to know you.`,
      desc: 'There are no right or wrong answers. Drag each slider toward the description that feels most like you in your element.'
    },
    {
      num: 2,
      label: 'Interests',
      title: `What genuinely sparks your curiosity${formData.name ? `, ${formData.name}` : ''}?`,
      desc: 'Choose the domains and subjects that pull you in. Breadth here gives you richer, more varied options.'
    },
    {
      num: 3,
      label: 'Skills',
      title: 'Where do your strengths live?',
      desc: 'Include abilities you naturally rely on, as well as capabilities you are actively developing.'
    },
    {
      num: 4,
      label: 'Values & Setting',
      title: 'What makes work feel genuinely meaningful?',
      desc: 'Select the priorities you need in a career to feel happy and fulfilled long-term.'
    }
  ];

  const currentMeta = stepMetadata[currentStep - 1];

  const handleSliderChange = (key, val) => {
    const updated = {
      ...formData,
      personality: {
        ...formData.personality,
        [key]: parseInt(val, 10)
      }
    };
    setFormData(updated);
    saveProfile(updated);
  };

  const toggleArrayItem = (field, item) => {
    const arr = [...formData[field]];
    const idx = arr.indexOf(item);
    if (idx === -1) arr.push(item);
    else arr.splice(idx, 1);

    const updated = { ...formData, [field]: arr };
    setFormData(updated);
    saveProfile(updated);
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.name.trim()) {
      formData.name = 'Explorer';
    }

    if (currentStep === 2 && formData.interests.length === 0) {
      showToast('Please select at least 1 or 2 interests to continue!', 'info');
      return;
    }

    if (currentStep === 3 && formData.skills.length === 0) {
      showToast('Please select at least 1 or 2 skills to continue!', 'info');
      return;
    }

    saveProfile(formData);

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Profile created! Review your results summary.', 'success');
      router.push('/results');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const p = formData.personality;

  return (
    <div className="page discover-page">
      {/* Progress Bar */}
      <div className="wizard-progress-bar">
        <div className="wizard-progress-fill" style={{ width: `${progressPct}%` }}></div>
      </div>

      <div className="container-narrow">
        {/* Wizard Header */}
        <div className="wizard-header">
          <div className="wizard-steps-nav">
            {stepMetadata.map((s, idx) => {
              const stepNum = idx + 1;
              const isCompleted = stepNum < currentStep;
              const isActive = stepNum === currentStep;
              return (
                <button
                  key={s.label}
                  className={`wizard-step-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => {
                    saveProfile(formData);
                    setCurrentStep(stepNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>{isCompleted ? '✓' : stepNum}</span>
                  <span className="step-tab-label">{s.label}</span>
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowResetDialog(true)}
            title="Reset your answers"
          >
            🔄 Reset
          </button>
        </div>

        {/* Step Title & Desc */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="step-badge-indicator">
            Step {currentStep} of {TOTAL_STEPS} — {currentMeta.label}
          </div>
          <h1 className="step-title">{currentMeta.title}</h1>
          <p className="step-desc">{currentMeta.desc}</p>
        </div>

        {/* Step Body */}
        <div id="step-body">
          {currentStep === 1 && (
            <>
              {/* Name Input */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-xs)' }} htmlFor="user-name-input">
                  What is your first name or preferred nickname?
                </label>
                <input
                  type="text"
                  id="user-name-input"
                  className="form-input"
                  placeholder="e.g. Alex, Sam, Taylor"
                  value={formData.name}
                  onChange={(e) => {
                    const updated = { ...formData, name: e.target.value };
                    setFormData(updated);
                    saveProfile(updated);
                  }}
                  maxLength={40}
                />
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--color-near-black)' }}>
                How you naturally work:
              </h3>

              {/* Slider 1: Introvert / Extrovert */}
              <div className="slider-group">
                <div className="slider-header">
                  <span className="slider-label">Work Environment Focus</span>
                  <span className="slider-hint">Focus ↔ Collaboration</span>
                </div>
                <div className="slider-track-wrap">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="slider-input"
                    value={p.introvert}
                    onChange={(e) => handleSliderChange('introvert', e.target.value)}
                  />
                </div>
                <div className="slider-poles">
                  <span className={`slider-pole-left ${p.introvert < 40 ? 'active' : ''}`}>Focused, independent deep-work</span>
                  <span className={`slider-pole-right ${p.introvert > 60 ? 'active' : ''}`}>Collaborative, energized around people</span>
                </div>
              </div>

              {/* Slider 2: Analytical / Creative */}
              <div className="slider-group">
                <div className="slider-header">
                  <span className="slider-label">Thinking Orientation</span>
                  <span className="slider-hint">Analysis ↔ Creative Vision</span>
                </div>
                <div className="slider-track-wrap">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="slider-input"
                    value={p.analytical}
                    onChange={(e) => handleSliderChange('analytical', e.target.value)}
                  />
                </div>
                <div className="slider-poles">
                  <span className={`slider-pole-left ${p.analytical < 40 ? 'active' : ''}`}>Data, structured logic & evidence</span>
                  <span className={`slider-pole-right ${p.analytical > 60 ? 'active' : ''}`}>Creative intuition, storytelling & ideas</span>
                </div>
              </div>

              {/* Slider 3: Structured / Flexible */}
              <div className="slider-group">
                <div className="slider-header">
                  <span className="slider-label">Structure & Process</span>
                  <span className="slider-hint">Process ↔ Adaptability</span>
                </div>
                <div className="slider-track-wrap">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="slider-input"
                    value={p.structured}
                    onChange={(e) => handleSliderChange('structured', e.target.value)}
                  />
                </div>
                <div className="slider-poles">
                  <span className={`slider-pole-left ${p.structured < 40 ? 'active' : ''}`}>Clear roadmaps, consistency & plans</span>
                  <span className={`slider-pole-right ${p.structured > 60 ? 'active' : ''}`}>Spontaneity, rapid pivots & fluidity</span>
                </div>
              </div>

              {/* Slider 4: Solo / Team */}
              <div className="slider-group">
                <div className="slider-header">
                  <span className="slider-label">Problem Ownership</span>
                  <span className="slider-hint">Individual ↔ Cross-Functional</span>
                </div>
                <div className="slider-track-wrap">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="slider-input"
                    value={p.collaborative}
                    onChange={(e) => handleSliderChange('collaborative', e.target.value)}
                  />
                </div>
                <div className="slider-poles">
                  <span className={`slider-pole-left ${p.collaborative < 40 ? 'active' : ''}`}>Own a problem end-to-end</span>
                  <span className={`slider-pole-right ${p.collaborative > 60 ? 'active' : ''}`}>Co-create with multidisciplinary teams</span>
                </div>
              </div>

              {/* Dynamic Live Archetype Preview Box */}
              <div className="archetype-live-preview">
                <span className="archetype-emoji">{archetype.emoji}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-amber-light)', letterSpacing: '0.06em' }}>
                    Emerging Working Style
                  </div>
                  <div className="archetype-title">{archetype.name}</div>
                  <div className="archetype-desc">{archetype.desc}</div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Explore your interest domains</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-forest)' }}>
                  {formData.interests.length} selected (aim for 3 or more)
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {INTERESTS.map(interest => {
                  const isSelected = formData.interests.includes(interest);
                  return (
                    <div
                      key={interest}
                      className={`tag-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleArrayItem('interests', interest)}
                    >
                      <span className="chip-check">✓</span>
                      <span>{interest}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Capabilities & Natural Talents</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-forest)' }}>
                  {formData.skills.length} selected (aim for 3 or more)
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {SKILLS.map(skill => {
                  const isSelected = formData.skills.includes(skill);
                  return (
                    <div
                      key={skill}
                      className={`tag-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleArrayItem('skills', skill)}
                    >
                      <span className="chip-check">✓</span>
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div style={{ marginBottom: 'var(--space-2xl)' }}>
                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                  Preferred Work Setting:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {ENVIRONMENTS.map(env => (
                    <div
                      key={env}
                      className={`tag-chip ${formData.environment === env ? 'selected' : ''}`}
                      onClick={() => {
                        const updated = { ...formData, environment: env };
                        setFormData(updated);
                        saveProfile(updated);
                      }}
                    >
                      <span className="chip-check">✓</span>
                      <span>{env}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ marginBottom: 'var(--space-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Core Values & Professional Priorities</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-forest)' }}>
                    {formData.values.length} selected
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {VALUES.map(val => {
                    const isSelected = formData.values.includes(val);
                    return (
                      <div
                        key={val}
                        className={`tag-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleArrayItem('values', val)}
                      >
                        <span className="chip-check">✓</span>
                        <span>{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="wizard-footer">
          <div>
            {currentStep > 1 ? (
              <button className="btn btn-secondary" onClick={handlePrev}>
                ← Back
              </button>
            ) : (
              <Link href="/" className="btn btn-ghost">
                ← Back to Home
              </Link>
            )}
          </div>

          <div>
            <button className="btn btn-primary btn-lg" onClick={handleNext}>
              {currentStep === TOTAL_STEPS ? 'Review Profile Summary →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="container" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>Loading discovery profile...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
