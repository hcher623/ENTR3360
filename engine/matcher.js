/**
 * Myrimaven Matching Engine & Fit Analysis
 * Differentiated scoring and dual-sided explanations:
 * - Why a career fits the user
 * - Tradeoffs & watch-outs: Why it may NOT fit (answering key feedback)
 */

import { CAREERS, getCareerById } from '../data/careers.js';

function clamp(val) {
  return Math.max(0, Math.min(1, val));
}

function scoreDimension(val, range) {
  const [min, max] = range;
  if (val >= min && val <= max) return 1;
  return clamp(val < min ? 1 - (min - val) / 45 : 1 - (val - max) / 45);
}

export function scorePersonality(personality, fit) {
  if (!personality || !fit) return 0.5;
  const scores = [
    scoreDimension(personality.introvert ?? 50, fit.introvert),
    scoreDimension(personality.analytical ?? 50, fit.analytical),
    scoreDimension(personality.structured ?? 50, fit.structured),
    scoreDimension(personality.collaborative ?? 50, fit.collaborative),
  ];
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

export function matchCareer(career, profile) {
  if (!profile) return null;

  const personalityScore = scorePersonality(profile.personality, career.personalityFit);

  const matchedInterests = (career.relatedInterests || []).filter(i => (profile.interests || []).includes(i));
  const interestScore = career.relatedInterests?.length > 0 
    ? matchedInterests.length / career.relatedInterests.length 
    : 0;

  const matchedSkills = (career.requiredSkills || []).filter(s => (profile.skills || []).includes(s));
  const skillsScore = career.requiredSkills?.length > 0 
    ? matchedSkills.length / career.requiredSkills.length 
    : 0;

  const matchedValues = (career.alignedValues || []).filter(v => (profile.values || []).includes(v));
  const valuesScore = career.alignedValues?.length > 0 
    ? matchedValues.length / career.alignedValues.length 
    : 0;

  // Environment bonus
  let envBonus = 0;
  if (profile.environment && profile.environment !== 'No preference') {
    if (career.environments?.includes(profile.environment)) {
      envBonus = 0.05;
    }
  }

  const rawScore = personalityScore * 0.35 + interestScore * 0.30 + skillsScore * 0.25 + valuesScore * 0.10 + envBonus;
  const score = Math.min(99, Math.max(38, Math.round(rawScore * 100)));

  // Generate personalized match reasons (Why it fits)
  const matchReasons = [];
  const gapWarnings = [];

  // Personality explanations
  if (personalityScore >= 0.75) {
    const p = profile.personality || {};
    if (p.introvert < 40 && career.personalityFit?.introvert[0] < 40) {
      matchReasons.push('Your preference for independent, focused work aligns with how this role is structured.');
    }
    if (p.introvert > 60 && career.personalityFit?.introvert[1] > 60) {
      matchReasons.push('Your natural energy when working with people translates directly into this collaborative field.');
    }
    if (p.analytical < 40 && career.personalityFit?.analytical[0] < 40) {
      matchReasons.push('Your analytical thinking style matches the evidence-based nature of this work.');
    }
    if (p.analytical > 60 && career.personalityFit?.analytical[1] > 60) {
      matchReasons.push('Your creative orientation and intuition are genuine strengths in this field.');
    }
    if (p.collaborative > 60 && career.personalityFit?.collaborative[1] > 60) {
      matchReasons.push('Your collaborative approach fits how this career operates day-to-day.');
    }
    if (p.structured < 40 && career.personalityFit?.structured[0] < 40) {
      matchReasons.push('Your preference for structured process maps well onto this work environment.');
    }
  } else if (personalityScore < 0.55) {
    gapWarnings.push('Your working style differs from the typical pattern for this career — it can still work, but expect more friction.');
  }

  // Interest explanations
  if (matchedInterests.length >= 3) {
    matchReasons.push(`Your interests in ${matchedInterests.slice(0, 2).join(' and ')} are core to this field.`);
  } else if (matchedInterests.length === 2) {
    matchReasons.push(`Your interest in ${matchedInterests[0]} connects directly to what practitioners do in this role.`);
  } else if (matchedInterests.length === 1) {
    matchReasons.push(`Your interest in ${matchedInterests[0]} provides a solid foothold here.`);
  }

  if (interestScore < 0.35 && career.relatedInterests?.length >= 3) {
    const unlisted = career.relatedInterests.filter(i => !(profile.interests || []).includes(i)).slice(0, 2);
    gapWarnings.push(`This field draws heavily on ${unlisted.join(' and ')}, which aren't among your current listed interests.`);
  }

  // Skills explanations
  if (matchedSkills.length >= 3) {
    matchReasons.push(`You already bring essential skills — ${matchedSkills.slice(0, 2).join(' and ')} — that practitioners rely on.`);
  } else if (matchedSkills.length >= 1) {
    matchReasons.push(`Your ${matchedSkills[0]} skill gives you a real foundation to build from.`);
  }

  if (skillsScore < 0.4 && career.requiredSkills?.length >= 3) {
    const missing = career.requiredSkills.filter(s => !(profile.skills || []).includes(s)).slice(0, 2);
    gapWarnings.push(`You'd need to develop skills in ${missing.join(' and ')} to be fully competitive.`);
  }

  // Values explanations
  if (matchedValues.length >= 2) {
    matchReasons.push(`What you value most — ${matchedValues.slice(0, 2).join(' and ')} — is what this career is recognized for offering.`);
  } else if (matchedValues.length === 1) {
    matchReasons.push(`Your priority on "${matchedValues[0]}" aligns with what practitioners report finding in this field.`);
  }

  // Environment checks
  if (profile.environment && profile.environment !== 'No preference' && !career.environments?.includes(profile.environment)) {
    gapWarnings.push(`This role is not typically offered in your preferred setting (${profile.environment}).`);
  }

  // Specific role reality trade-off
  if (career.cons && career.cons.length > 0) {
    gapWarnings.push(`Role trade-off: ${career.cons[0]}`);
  }

  if (matchReasons.length === 0) {
    matchReasons.push('This career has general alignment with your profile that could be worth exploring further.');
  }

  return {
    career,
    score,
    personalityScore: Math.round(personalityScore * 100),
    interestScore: Math.round(interestScore * 100),
    skillsScore: Math.round(skillsScore * 100),
    valuesScore: Math.round(valuesScore * 100),
    matchedInterests,
    matchedSkills,
    matchedValues,
    matchReasons,
    gapWarnings
  };
}

export function matchCareers(profile) {
  if (!profile) return [];
  return CAREERS
    .map(career => matchCareer(career, profile))
    .sort((a, b) => b.score - a.score);
}

export function getPersonalityArchetype(personality) {
  if (!personality) {
    return {
      name: 'Versatile Explorer',
      emoji: '🧭',
      desc: 'You have an adaptable, well-rounded approach to work and collaboration.'
    };
  }

  const isIntroverted = (personality.introvert ?? 50) < 40;
  const isAnalytical = (personality.analytical ?? 50) < 40;
  const isStructured = (personality.structured ?? 50) < 40;
  const isCollaborative = (personality.collaborative ?? 50) > 60;
  const isCreative = (personality.analytical ?? 50) > 60;
  const isFlexible = (personality.structured ?? 50) > 60;

  if (isAnalytical && isStructured && !isCollaborative) {
    return {
      name: 'Systematic Thinker',
      emoji: '⚙️',
      desc: 'You thrive with deep focus, clear processes, and well-defined problems. Roles that reward precision, method, and rigor are where you naturally excel.'
    };
  }
  if (isCreative && isCollaborative && isFlexible) {
    return {
      name: 'Creative Connector',
      emoji: '✦',
      desc: 'You bring originality to group work and adapt naturally as ideas evolve. You are often the person who makes complex projects feel human and imaginative.'
    };
  }
  if (isAnalytical && isCollaborative) {
    return {
      name: 'Strategic Collaborator',
      emoji: '◎',
      desc: 'You translate rigorous thinking into group action — a rare combination that works exceptionally well in leadership, product, and cross-functional roles.'
    };
  }
  if (isCreative && !isCollaborative && isFlexible) {
    return {
      name: 'Independent Creative',
      emoji: '◈',
      desc: 'You do your best work with autonomy and open-ended space. Rigid structure can feel limiting — you need room to experiment and think differently.'
    };
  }
  if (isStructured && isCollaborative) {
    return {
      name: 'Organized Catalyst',
      emoji: '▲',
      desc: 'You build systems that help groups work better. You are often the anchor person others rely on to bring clarity, process, and order to ambiguity.'
    };
  }
  if (isIntroverted && isAnalytical && isStructured) {
    return {
      name: 'Deep Specialist',
      emoji: '◉',
      desc: 'You go deeper into problems than most people have the patience for. Specialized technical, research, and investigative careers suit you best.'
    };
  }
  if (isCreative && isStructured) {
    return {
      name: 'Structured Visionary',
      emoji: '◆',
      desc: 'You conceive bold new ideas and actually build the roadmap to execute them — a powerful profile in design, product, and innovation roles.'
    };
  }
  return {
    name: 'Versatile Generalist',
    emoji: '○',
    desc: 'You adapt fluidly across work environments and collaboration styles. This versatility is a genuine asset in modern, cross-disciplinary careers.'
  };
}

export { getCareerById };
