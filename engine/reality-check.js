// Reality Check is an advisory layer over the deterministic CareerCompass matcher.
// It does not alter compatibility scores or ranking.

export function getRealityCheck(matchResult, profile) {
  if (!matchResult?.career || !profile) return null;

  const career = matchResult.career;
  const careerSkills = Array.isArray(career.requiredSkills) ? career.requiredSkills : [];
  const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const missingSkills = careerSkills.filter(skill => !profileSkills.includes(skill));
  const matchedSkills = careerSkills.filter(skill => profileSkills.includes(skill));

  const environmentMismatch = Boolean(
    profile.environment
    && profile.environment !== 'No preference'
    && Array.isArray(career.environments)
    && !career.environments.includes(profile.environment)
  );

  const warnings = [];
  const nextSteps = [];

  if (missingSkills.length > 0) {
    warnings.push({
      type: 'skills',
      title: 'Skills to develop',
      detail: `Build strength in ${missingSkills.slice(0, 4).join(', ')}${missingSkills.length > 4 ? ` and ${missingSkills.length - 4} more` : ''}.`
    });
    nextSteps.push(`Start with ${missingSkills[0]}: find one beginner course or small portfolio exercise that demonstrates it.`);
  }

  if (career.education) {
    warnings.push({
      type: 'education',
      title: 'Education & credentials',
      detail: career.education
    });
    nextSteps.push(`Use the education baseline above to map whether you need a degree, certificate, portfolio, internship, or licensure.`);
  }

  if (environmentMismatch) {
    warnings.push({
      type: 'environment',
      title: 'Work-setting mismatch',
      detail: `Your preferred setting is ${profile.environment}, while this career is typically found in ${career.environments.join(', ')}.`
    });
    nextSteps.push(`Look specifically for ${profile.environment.toLowerCase()} openings or ask employers whether this role can be adapted to that setting.`);
  }

  if (Array.isArray(career.cons) && career.cons.length > 0) {
    warnings.push({
      type: 'tradeoff',
      title: 'Realistic trade-off',
      detail: career.cons.join(' ')
    });
  }

  if (nextSteps.length === 0) {
    nextSteps.push('Talk with someone working in this field and review three real job postings to verify your readiness.');
  } else {
    nextSteps.push('Review three real job postings and compare their requirements with this readiness assessment.');
  }

  const readinessScore = careerSkills.length === 0
    ? matchResult.score
    : Math.round(((matchedSkills.length / careerSkills.length) * 70) + (matchResult.score * 0.30));

  let readinessLabel = 'Explore further';
  if (readinessScore >= 80) readinessLabel = 'Strong starting position';
  else if (readinessScore >= 65) readinessLabel = 'Promising with preparation';
  else if (readinessScore >= 50) readinessLabel = 'Needs focused preparation';

  return {
    careerId: career.id,
    careerTitle: career.title,
    readinessScore: Math.min(100, Math.max(0, readinessScore)),
    readinessLabel,
    matchedSkills,
    missingSkills,
    environmentMismatch,
    preferredEnvironment: profile.environment || 'No preference',
    typicalEnvironments: Array.isArray(career.environments) ? career.environments : [],
    education: career.education || '',
    warnings,
    nextSteps: nextSteps.slice(0, 4)
  };
}

export function getRealityChecks(profile) {
  if (!profile) return [];

  // Importing in the matching module would create a circular dependency, so callers
  // provide match results and the top result is handled by getRealityCheck.
  return [];
}
