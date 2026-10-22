import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CAREERS, INTERESTS, SKILLS, VALUES, ENVIRONMENTS } from './data/careers.js';
import { PERSONAS } from './data/personas.js';

const outDir = path.resolve('supabase_data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1. Expanded Personas (Total 7)
const allPersonas = [
  ...PERSONAS,
  {
    id: "jordan",
    name: "Jordan",
    role: "Environmental studies senior torn between policy & field work",
    description: "Deeply committed to climate action, loves data models, but wants to see tangible community outcomes rather than bureaucratic paperwork.",
    avatar: "🌱",
    badge: "Climate & Policy",
    profile: {
      name: "Jordan",
      personality: { introvert: 45, analytical: 20, structured: 50, collaborative: 70 },
      interests: ["Nature & Environment", "Environmental Issues", "Law & Policy", "Data & Analytics"],
      skills: ["Research & Investigation", "Data Analysis", "Project Management", "Communication"],
      values: ["Making a Real Impact", "Autonomy & Independence", "Community"],
      environment: "Hybrid"
    }
  },
  {
    id: "elena",
    name: "Elena",
    role: "Graphic designer pivoting toward high-tech product design",
    description: "Experienced in branding and typography, now transitioning into UX and human-computer interaction for accessible software platforms.",
    avatar: "🎨",
    badge: "UX & Product",
    profile: {
      name: "Elena",
      personality: { introvert: 60, analytical: 40, structured: 65, collaborative: 75 },
      interests: ["Arts & Design", "Technology", "Psychology & Behavior", "Writing & Media"],
      skills: ["Design Thinking", "Creativity", "Empathy & Active Listening", "Teamwork & Collaboration"],
      values: ["Creative Expression", "Intellectual Challenge", "Work-Life Balance"],
      environment: "Remote"
    }
  },
  {
    id: "samir",
    name: "Samir",
    role: "Economics graduate evaluating social finance vs tech analytics",
    description: "Strong quantitative instincts, passionate about economic mobility and ethical algorithms. Wants high rigor with human impact.",
    avatar: "📊",
    badge: "Analytics & Finance",
    profile: {
      name: "Samir",
      personality: { introvert: 35, analytical: 15, structured: 30, collaborative: 50 },
      interests: ["Business & Finance", "Data & Analytics", "Technology", "Social Justice"],
      skills: ["Data Analysis", "Statistics", "Critical Thinking", "Problem-Solving"],
      values: ["High Income", "Intellectual Challenge", "Making a Real Impact"],
      environment: "Hybrid"
    }
  },
  {
    id: "maya",
    name: "Maya",
    role: "Education advocate building digital learning tools",
    description: "Former high school tutor passionate about scalable educational technology, curriculum redesign, and student motivation.",
    avatar: "📚",
    badge: "EdTech & Learning",
    profile: {
      name: "Maya",
      personality: { introvert: 40, analytical: 50, structured: 55, collaborative: 80 },
      interests: ["Education & Teaching", "People & Society", "Writing & Media", "Technology"],
      skills: ["Teaching & Mentoring", "Communication", "Writing & Storytelling", "Project Management"],
      values: ["Helping Others", "Making a Real Impact", "Collaboration & Teamwork"],
      environment: "Remote"
    }
  }
];

// 2. Sample User Profiles (8 user profiles)
const sampleProfiles = [
  {
    id: "usr_001",
    user_email: "priya.patel@example.com",
    name: "Priya Patel",
    archetype_name: "Strategic Collaborator",
    personality: { introvert: 30, analytical: 25, structured: 45, collaborative: 65 },
    interests: ["Health & Medicine", "Psychology & Behavior", "People & Society"],
    skills: ["Empathy & Active Listening", "Research & Investigation", "Critical Thinking"],
    values: ["Helping Others", "Intellectual Challenge", "Making a Real Impact"],
    environment_preference: "Hybrid",
    created_at: "2026-10-01T10:00:00Z"
  },
  {
    id: "usr_002",
    user_email: "marcus.chen@example.com",
    name: "Marcus Chen",
    archetype_name: "Systematic Thinker",
    personality: { introvert: 25, analytical: 15, structured: 40, collaborative: 45 },
    interests: ["Technology", "Data & Analytics", "Social Justice"],
    skills: ["Programming", "Data Analysis", "Statistics", "Problem-Solving"],
    values: ["Intellectual Challenge", "High Income", "Innovation & Cutting-Edge Work"],
    environment_preference: "Remote",
    created_at: "2026-10-02T11:30:00Z"
  },
  {
    id: "usr_003",
    user_email: "leah.ross@example.com",
    name: "Leah Ross",
    archetype_name: "Creative Connector",
    personality: { introvert: 55, analytical: 80, structured: 70, collaborative: 60 },
    interests: ["Arts & Design", "People & Society", "Education & Teaching"],
    skills: ["Creativity", "Communication", "Design Thinking", "Writing & Storytelling"],
    values: ["Creative Expression", "Community", "Helping Others"],
    environment_preference: "Hybrid",
    created_at: "2026-10-03T09:15:00Z"
  },
  {
    id: "usr_004",
    user_email: "alex.morales@example.com",
    name: "Alex Morales",
    archetype_name: "Deep Specialist",
    personality: { introvert: 20, analytical: 15, structured: 30, collaborative: 35 },
    interests: ["Science & Research", "Environmental Issues", "Data & Analytics"],
    skills: ["Scientific Method", "Data Analysis", "Critical Thinking", "Research & Investigation"],
    values: ["Intellectual Challenge", "Autonomy & Independence", "Job Stability"],
    environment_preference: "On-site",
    created_at: "2026-10-05T14:20:00Z"
  },
  {
    id: "usr_005",
    user_email: "chloe.dupont@example.com",
    name: "Chloe Dupont",
    archetype_name: "Structured Visionary",
    personality: { introvert: 45, analytical: 35, structured: 25, collaborative: 75 },
    interests: ["Technology", "Business & Finance", "Arts & Design"],
    skills: ["Project Management", "Leadership", "Communication", "Problem-Solving"],
    values: ["Career Growth", "Making a Real Impact", "High Income"],
    environment_preference: "Hybrid",
    created_at: "2026-10-07T16:45:00Z"
  },
  {
    id: "usr_006",
    user_email: "devon.king@example.com",
    name: "Devon King",
    archetype_name: "Organized Catalyst",
    personality: { introvert: 40, analytical: 45, structured: 20, collaborative: 80 },
    interests: ["Social Justice", "Law & Policy", "People & Society"],
    skills: ["Public Speaking", "Negotiation", "Organization & Planning", "Leadership"],
    values: ["Making a Real Impact", "Helping Others", "Recognition & Status"],
    environment_preference: "Office",
    created_at: "2026-10-10T12:00:00Z"
  },
  {
    id: "usr_007",
    user_email: "taylor.brooks@example.com",
    name: "Taylor Brooks",
    archetype_name: "Independent Creative",
    personality: { introvert: 65, analytical: 70, structured: 80, collaborative: 30 },
    interests: ["Writing & Media", "Arts & Design", "Psychology & Behavior"],
    skills: ["Writing & Storytelling", "Creativity", "Research & Investigation"],
    values: ["Autonomy & Independence", "Work-Life Balance", "Creative Expression"],
    environment_preference: "Remote",
    created_at: "2026-10-12T08:30:00Z"
  },
  {
    id: "usr_008",
    user_email: "hassan.student@example.com",
    name: "Hassan Student",
    archetype_name: "Versatile Explorer",
    personality: { introvert: 50, analytical: 50, structured: 50, collaborative: 50 },
    interests: ["Technology", "Business & Finance", "Engineering", "Data & Analytics"],
    skills: ["Problem-Solving", "Project Management", "Critical Thinking", "Programming"],
    values: ["Making a Real Impact", "Career Growth", "High Income"],
    environment_preference: "Hybrid",
    created_at: "2026-10-15T11:10:00Z"
  }
];

// 3. Sample Bookmarks (14 records)
const sampleBookmarks = [
  { id: 1, user_id: "usr_001", career_id: "clinical-psychologist", created_at: "2026-10-01T10:15:00Z", notes: "Top match from pre-med pivot." },
  { id: 2, user_id: "usr_001", career_id: "public-interest-lawyer", created_at: "2026-10-01T10:20:00Z", notes: "High impact advocacy route." },
  { id: 3, user_id: "usr_001", career_id: "ux-researcher", created_at: "2026-10-01T10:25:00Z", notes: "Psychology in tech application." },
  { id: 4, user_id: "usr_002", career_id: "machine-learning-engineer", created_at: "2026-10-02T11:40:00Z", notes: "Core technical path." },
  { id: 5, user_id: "usr_002", career_id: "climate-data-scientist", created_at: "2026-10-02T11:45:00Z", notes: "Intersection of data and physical science." },
  { id: 6, user_id: "usr_002", career_id: "technical-product-manager", created_at: "2026-10-02T11:50:00Z", notes: "Cross-functional systems leadership." },
  { id: 7, user_id: "usr_003", career_id: "learning-experience-designer", created_at: "2026-10-03T09:30:00Z", notes: "Design meets human pedagogy." },
  { id: 8, user_id: "usr_003", career_id: "creative-director", created_at: "2026-10-03T09:35:00Z", notes: "Strategic creative leadership." },
  { id: 9, user_id: "usr_004", career_id: "clean-energy-engineer", created_at: "2026-10-05T14:30:00Z", notes: "Renewable infrastructure focus." },
  { id: 10, user_id: "usr_004", career_id: "environmental-policy-analyst", created_at: "2026-10-05T14:35:00Z", notes: "Regulatory impact." },
  { id: 11, user_id: "usr_005", career_id: "technical-product-manager", created_at: "2026-10-07T17:00:00Z", notes: "Strategic execution." },
  { id: 12, user_id: "usr_006", career_id: "nonprofit-program-manager", created_at: "2026-10-10T12:10:00Z", notes: "Community leadership role." },
  { id: 13, user_id: "usr_007", career_id: "data-journalist", created_at: "2026-10-12T08:45:00Z", notes: "Investigative storytelling." },
  { id: 14, user_id: "usr_008", career_id: "quantitative-analyst", created_at: "2026-10-15T11:20:00Z", notes: "Algorithmic decision-making." }
];

// Helper to escape SQL single quotes
function sqlEsc(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function sqlJson(obj) {
  if (obj === null || obj === undefined) return 'NULL';
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
}

function sqlArray(arr) {
  if (!arr || !Array.isArray(arr)) return "'{}'::text[]";
  const inner = arr.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',');
  return `'${inner}'::text[]`;
}

// Generate SQL Script
let sql = `-- ==============================================================
-- CareerCompass: Supabase Database Schema & Seed Data
-- Compatible with Supabase PostgreSQL (Standard or Extension-ready)
-- ==============================================================

-- 1. TAXONOMY TABLES
CREATE TABLE IF NOT EXISTS public.interests (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'General'
);

CREATE TABLE IF NOT EXISTS public.skills (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'Core'
);

CREATE TABLE IF NOT EXISTS public.values (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.environments (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- 2. CAREERS TABLE (15 Complete Careers)
CREATE TABLE IF NOT EXISTS public.careers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    field TEXT NOT NULL,
    field_color TEXT,
    tagline TEXT,
    description TEXT,
    salary_low INTEGER,
    salary_median INTEGER,
    salary_high INTEGER,
    growth TEXT,
    growth_pct INTEGER,
    environments TEXT[],
    education TEXT,
    personality_fit JSONB,
    related_interests TEXT[],
    required_skills TEXT[],
    aligned_values TEXT[],
    day_in_life TEXT,
    pros TEXT[],
    cons TEXT[],
    trajectory JSONB,
    qualification_tier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PERSONAS TABLE (7 Complete Personas)
CREATE TABLE IF NOT EXISTS public.personas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    avatar TEXT,
    badge TEXT,
    profile JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER PROFILES TABLE (Sample User Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    user_email TEXT,
    name TEXT NOT NULL,
    archetype_name TEXT,
    personality JSONB,
    interests TEXT[],
    skills TEXT[],
    values TEXT[],
    environment_preference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BOOKMARKS / SAVED CAREERS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    career_id TEXT NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================
-- SEED DATA: TAXONOMIES
-- ==============================================================

INSERT INTO public.environments (name) VALUES
('Office'), ('Remote'), ('Hybrid'), ('On-site / Lab')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.interests (name) VALUES
${INTERESTS.map(i => `(${sqlEsc(i)})`).join(',\n')}
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.skills (name) VALUES
${SKILLS.map(s => `(${sqlEsc(s)})`).join(',\n')}
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.values (name) VALUES
${VALUES.map(v => `(${sqlEsc(v)})`).join(',\n')}
ON CONFLICT (name) DO NOTHING;

-- ==============================================================
-- SEED DATA: CAREERS (All 15 In-Depth Careers)
-- ==============================================================

INSERT INTO public.careers (
    id, title, field, field_color, tagline, description,
    salary_low, salary_median, salary_high, growth, growth_pct,
    environments, education, personality_fit, related_interests,
    required_skills, aligned_values, day_in_life, pros, cons,
    trajectory, qualification_tier
) VALUES
${CAREERS.map(c => `(
    ${sqlEsc(c.id)},
    ${sqlEsc(c.title)},
    ${sqlEsc(c.field)},
    ${sqlEsc(c.fieldColor)},
    ${sqlEsc(c.tagline)},
    ${sqlEsc(c.description)},
    ${c.salary?.low || 0},
    ${c.salary?.median || 0},
    ${c.salary?.high || 0},
    ${sqlEsc(c.growth)},
    ${c.growthPct || 0},
    ${sqlArray(c.environments)},
    ${sqlEsc(c.education)},
    ${sqlJson(c.personalityFit)},
    ${sqlArray(c.relatedInterests)},
    ${sqlArray(c.requiredSkills)},
    ${sqlArray(c.alignedValues)},
    ${sqlEsc(c.dayInLife)},
    ${sqlArray(c.pros)},
    ${sqlArray(c.cons)},
    ${sqlJson(c.careerPath || c.trajectory)},
    ${sqlEsc(c.qualificationTier || "Bachelor's + Portfolio")}
)`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    field = EXCLUDED.field,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    salary_median = EXCLUDED.salary_median,
    growth_pct = EXCLUDED.growth_pct;

-- ==============================================================
-- SEED DATA: PERSONAS (7 Personas)
-- ==============================================================

INSERT INTO public.personas (id, name, role, description, avatar, badge, profile) VALUES
${allPersonas.map(p => `(
    ${sqlEsc(p.id)},
    ${sqlEsc(p.name)},
    ${sqlEsc(p.role)},
    ${sqlEsc(p.description)},
    ${sqlEsc(p.avatar)},
    ${sqlEsc(p.badge)},
    ${sqlJson(p.profile)}
)`).join(',\n')}
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    description = EXCLUDED.description,
    profile = EXCLUDED.profile;

-- ==============================================================
-- SEED DATA: USER PROFILES (8 Sample Users)
-- ==============================================================

INSERT INTO public.profiles (
    id, user_email, name, archetype_name, personality,
    interests, skills, values, environment_preference, created_at
) VALUES
${sampleProfiles.map(u => `(
    ${sqlEsc(u.id)},
    ${sqlEsc(u.user_email)},
    ${sqlEsc(u.name)},
    ${sqlEsc(u.archetype_name)},
    ${sqlJson(u.personality)},
    ${sqlArray(u.interests)},
    ${sqlArray(u.skills)},
    ${sqlArray(u.values)},
    ${sqlEsc(u.environment_preference)},
    ${sqlEsc(u.created_at)}
)`).join(',\n')}
ON CONFLICT (id) DO NOTHING;

-- ==============================================================
-- SEED DATA: BOOKMARKS (14 Sample Favorited Careers)
-- ==============================================================

INSERT INTO public.bookmarks (id, user_id, career_id, notes, created_at) VALUES
${sampleBookmarks.map(b => `(
    ${b.id},
    ${sqlEsc(b.user_id)},
    ${sqlEsc(b.career_id)},
    ${sqlEsc(b.notes)},
    ${sqlEsc(b.created_at)}
)`).join(',\n')}
ON CONFLICT (id) DO NOTHING;
`;

fs.writeFileSync(path.join(outDir, 'supabase_seed.sql'), sql, 'utf8');
fs.writeFileSync('supabase_seed.sql', sql, 'utf8');

// 4. Also generate CSV files for Table Editor import
function escapeCsv(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    val = JSON.stringify(val);
  }
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// careers.csv
const careersCsvRows = [
  ['id', 'title', 'field', 'tagline', 'description', 'salary_low', 'salary_median', 'salary_high', 'growth', 'growth_pct', 'environments', 'required_skills', 'related_interests', 'aligned_values'].join(',')
];
CAREERS.forEach(c => {
  careersCsvRows.push([
    escapeCsv(c.id),
    escapeCsv(c.title),
    escapeCsv(c.field),
    escapeCsv(c.tagline),
    escapeCsv(c.description),
    c.salary?.low || 0,
    c.salary?.median || 0,
    c.salary?.high || 0,
    escapeCsv(c.growth),
    c.growthPct || 0,
    escapeCsv((c.environments || []).join('; ')),
    escapeCsv((c.requiredSkills || []).join('; ')),
    escapeCsv((c.relatedInterests || []).join('; ')),
    escapeCsv((c.alignedValues || []).join('; '))
  ].join(','));
});
fs.writeFileSync(path.join(outDir, 'careers.csv'), careersCsvRows.join('\n'), 'utf8');

// personas.csv
const personasCsvRows = [
  ['id', 'name', 'role', 'badge', 'avatar', 'description', 'interests', 'skills', 'values', 'environment'].join(',')
];
allPersonas.forEach(p => {
  personasCsvRows.push([
    escapeCsv(p.id),
    escapeCsv(p.name),
    escapeCsv(p.role),
    escapeCsv(p.badge),
    escapeCsv(p.avatar),
    escapeCsv(p.description),
    escapeCsv((p.profile?.interests || []).join('; ')),
    escapeCsv((p.profile?.skills || []).join('; ')),
    escapeCsv((p.profile?.values || []).join('; ')),
    escapeCsv(p.profile?.environment || 'Hybrid')
  ].join(','));
});
fs.writeFileSync(path.join(outDir, 'personas.csv'), personasCsvRows.join('\n'), 'utf8');

// profiles.csv
const profilesCsvRows = [
  ['id', 'user_email', 'name', 'archetype_name', 'interests', 'skills', 'values', 'environment_preference', 'created_at'].join(',')
];
sampleProfiles.forEach(u => {
  profilesCsvRows.push([
    escapeCsv(u.id),
    escapeCsv(u.user_email),
    escapeCsv(u.name),
    escapeCsv(u.archetype_name),
    escapeCsv(u.interests.join('; ')),
    escapeCsv(u.skills.join('; ')),
    escapeCsv(u.values.join('; ')),
    escapeCsv(u.environment_preference),
    escapeCsv(u.created_at)
  ].join(','));
});
fs.writeFileSync(path.join(outDir, 'profiles.csv'), profilesCsvRows.join('\n'), 'utf8');

// bookmarks.csv
const bookmarksCsvRows = [
  ['id', 'user_id', 'career_id', 'notes', 'created_at'].join(',')
];
sampleBookmarks.forEach(b => {
  bookmarksCsvRows.push([
    b.id,
    escapeCsv(b.user_id),
    escapeCsv(b.career_id),
    escapeCsv(b.notes),
    escapeCsv(b.created_at)
  ].join(','));
});
fs.writeFileSync(path.join(outDir, 'bookmarks.csv'), bookmarksCsvRows.join('\n'), 'utf8');

// Taxonomies CSVs
fs.writeFileSync(path.join(outDir, 'interests.csv'), 'name\n' + INTERESTS.map(i => escapeCsv(i)).join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'skills.csv'), 'name\n' + SKILLS.map(s => escapeCsv(s)).join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'values.csv'), 'name\n' + VALUES.map(v => escapeCsv(v)).join('\n'), 'utf8');

// JSON dumps
fs.writeFileSync(path.join(outDir, 'careers.json'), JSON.stringify(CAREERS, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'personas.json'), JSON.stringify(allPersonas, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'profiles.json'), JSON.stringify(sampleProfiles, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'bookmarks.json'), JSON.stringify(sampleBookmarks, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'taxonomies.json'), JSON.stringify({ interests: INTERESTS, skills: SKILLS, values: VALUES, environments: ENVIRONMENTS }, null, 2), 'utf8');

console.log('Successfully generated Supabase seed data and CSVs in supabase_data/ and supabase_seed.sql');
