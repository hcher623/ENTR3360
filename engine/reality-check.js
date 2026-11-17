// Reality Check is a deterministic advisory layer; it never changes match scores or ranking.

function environmentFits(preferred, typicalEnvironments) {
  if (!preferred || preferred === 'No preference') return true;
  if (preferred === 'Remote' || preferred === 'Hybrid') {
    return typicalEnvironments.includes(preferred);
  }
  if (preferred === 'In-person') {
    return typicalEnvironments.some(environment => !['Remote', 'Hybrid'].includes(environment));
  }
  return typicalEnvironments.includes(preferred);
}

export function getRealityCheck(matchResult, profile) {
  if (!matchResult?.career || !profile) return null;

  const career = matchResult.career;
  const requiredSkills = Array.isArray(career.requiredSkills) ? career.requiredSkills : [];
  const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const missingSkills = requiredSkills.filter(skill => !profileSkills.includes(skill));
  const matchedSkills = requiredSkills.filter(skill => profileSkills.includes(skill));
  const typicalEnvironments = Array.isArray(career.environments) ? career.environments : [];
  const preferredEnvironment = profile.environment || 'No preference';
  const environmentMismatch = !environmentFits(preferredEnvironment, typicalEnvironments);
  const warnings = [];
  const nextSteps = [];

  if (missingSkills.length) {
    warnings.push({
      type: 'skills',
      title: 'Skills to build',
      detail: `Your profile does not yet list ${missingSkills.slice(0, 4).join(', ')}${missingSkills.length > 4 ? ` and ${missingSkills.length - 4} more` : ''}. These are development areas, not a measure of your potential.`
    });
    nextSteps.push(`Pick one skill to practice first${missingSkills.length > 1 ? `—start with ${missingSkills[0]}` : ''}—through a short course, project, or volunteer assignment.`);
  }

  if (career.education) {
    warnings.push({
      type: 'education',
      title: 'Education & entry path',
      detail: career.education
    });
    nextSteps.push('Compare this pathway with your current education and experience; your profile does not include those details, so this is a point to verify, not a claimed gap.');
  }

  if (environmentMismatch) {
    warnings.push({
      type: 'environment',
      title: 'Work-setting mismatch',
      detail: `You prefer ${preferredEnvironment}; listed settings for this career are ${typicalEnvironments.length ? typicalEnvironments.join(', ') : 'not specified'}.`
    });
    nextSteps.push(`Check current postings for ${preferredEnvironment.toLowerCase()} options and ask employers how often this role requires another setting.`);
  }

  const tradeoffs = Array.isArray(career.cons) ? career.cons : [];
  if (tradeoffs.length) {
    warnings.push({
      type: 'tradeoff',
      title: 'Trade-offs to weigh',
      detail: tradeoffs.slice(0, 2).join(' ')
    });
    nextSteps.push(`Think through whether ${tradeoffs[0].charAt(0).toLowerCase()}${tradeoffs[0].slice(1)} is a trade-off you could accept day to day.`);
  }

  if (!nextSteps.length) {
    nextSteps.push('Review a few current job postings and speak with someone in the field to validate your readiness and expectations.');
  } else {
    nextSteps.push('Review three current job postings to compare real requirements with this overview.');
  }

  const readinessScore = requiredSkills.length
    ? Math.round((matchedSkills.length / requiredSkills.length) * 70 + (matchResult.score * 0.30))
    : matchResult.score;
  let readinessLabel = 'Explore further';
  if (readinessScore >= 80) readinessLabel = 'Strong starting position';
  else if (readinessScore >= 65) readinessLabel = 'Promising with preparation';
  else if (readinessScore >= 50) readinessLabel = 'Build a preparation plan';

  return {
    careerId: career.id,
    careerTitle: career.title,
    readinessScore: Math.min(100, Math.max(0, readinessScore)),
    readinessLabel,
    matchedSkills,
    missingSkills,
    environmentMismatch,
    preferredEnvironment,
    typicalEnvironments,
    education: career.education || '',
    warnings,
    nextSteps: nextSteps.slice(0, 4)
  };
}
