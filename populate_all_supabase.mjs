import { createClient } from '@supabase/supabase-js';
import { CAREERS } from './data/careers.js';

import fs from 'fs';

// Read from .env.local if available
let envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && v.length) {
      const val = v.join('=').trim();
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') envUrl = val;
      if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY') envKey = val;
    }
  }
}

const SUPABASE_URL = envUrl || 'https://hitnwhinhzrqzabdiyyx.supabase.co';
const SERVICE_KEY = envKey;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const sampleUsers = [
  { email: 'reviewer@careercompass.edu', password: 'Reviewer2026!Demo', name: 'Course Reviewer', status: 'complete' },
  { email: 'priya.patel@careercompass.edu', password: 'StudentPass2026!', name: 'Priya Patel', status: 'complete' },
  { email: 'marcus.chen@careercompass.edu', password: 'StudentPass2026!', name: 'Marcus Chen', status: 'complete' },
  { email: 'leah.ross@careercompass.edu', password: 'StudentPass2026!', name: 'Leah Ross', status: 'complete' },
  { email: 'jordan.brooks@careercompass.edu', password: 'StudentPass2026!', name: 'Jordan Brooks', status: 'complete' },
  { email: 'elena.rostova@careercompass.edu', password: 'StudentPass2026!', name: 'Elena Rostova', status: 'in_progress' },
  { email: 'samir.mansoor@careercompass.edu', password: 'StudentPass2026!', name: 'Samir Al-Mansoor', status: 'complete' },
  { email: 'maya.lin@careercompass.edu', password: 'StudentPass2026!', name: 'Maya Lin', status: 'complete' },
  { email: 'devon.king@careercompass.edu', password: 'StudentPass2026!', name: 'Devon King', status: 'complete' },
  { email: 'alex.morales@careercompass.edu', password: 'StudentPass2026!', name: 'Alex Morales', status: 'complete' }
];

async function run() {
  console.log('=== POPULATING ALL SUPABASE TABLES ===\n');

  // 1. POPULATE career_paths (15 records)
  console.log('1. Populating career_paths...');
  const careerPaths = CAREERS.map(c => ({
    id: c.id,
    title: c.title,
    category: c.field,
    description: c.description,
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    income_low: c.salary?.low || 65000,
    income_high: c.salary?.high || 140000,
    outlook: c.growth === 'high' ? `High growth (+${c.growthPct || 15}%)` : 'Steady growth',
    skills: c.requiredSkills || ['Critical Thinking', 'Problem-Solving'],
    success_signals: c.pros || ['Strong market demand', 'High autonomy'],
    failure_risks: c.cons || ['High deadline pressure', 'Evolving tech requirements']
  }));

  const { error: cpErr } = await supabase.from('career_paths').upsert(careerPaths, { onConflict: 'id' });
  if (cpErr) console.error('Error career_paths:', cpErr);
  else console.log(`✓ career_paths: successfully seeded ${careerPaths.length} careers.`);

  // 2. CREATE USERS & PROFILES
  console.log('\n2. Creating authenticated users and profiles...');
  const userIds = [];
  for (const u of sampleUsers) {
    let uid;
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name }
    });
    if (error) {
      if (error.message.includes('already exists')) {
        // Fetch existing user ID
        const { data: list } = await supabase.auth.admin.listUsers();
        const existing = list?.users?.find(x => x.email === u.email);
        if (existing) uid = existing.id;
      }
    } else {
      uid = data.user.id;
    }

    if (uid) {
      userIds.push(uid);
      await supabase.from('profiles').upsert({
        id: uid,
        display_name: u.name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        onboarding_status: u.status,
        current_step: 4
      }, { onConflict: 'id' });
    }
  }
  console.log(`✓ profiles: ${userIds.length} user profiles active.`);

  // 3. POPULATE questionnaire_responses (4 keys: energy, strengths, values, environment)
  console.log('\n3. Populating questionnaire_responses...');
  const qResponses = [];
  const keys = ['energy', 'strengths', 'values', 'environment'];
  for (const uid of userIds) {
    for (const k of keys) {
      qResponses.push({
        user_id: uid,
        question_key: k,
        selected_options: k === 'strengths'
          ? ['Empathy & Active Listening', 'Critical Thinking', 'Research & Investigation']
          : k === 'values'
          ? ['Making a Real Impact', 'Intellectual Challenge', 'Work-Life Balance']
          : k === 'environment'
          ? ['Hybrid', 'Remote']
          : ['Collaborative analysis', 'Structured deep work'],
        energy_score: Math.floor(Math.random() * 4) + 6
      });
    }
  }
  const { error: qrErr } = await supabase.from('questionnaire_responses').insert(qResponses);
  if (qrErr) console.error('Error questionnaire_responses:', qrErr);
  else console.log(`✓ questionnaire_responses: seeded ${qResponses.length} responses.`);

  // 4. POPULATE saved_careers (15-20 records)
  console.log('\n4. Populating saved_careers...');
  const { data: allPaths } = await supabase.from('career_paths').select('id');
  const pathIds = (allPaths || []).map(p => p.id);

  const savedList = [];
  for (let i = 0; i < userIds.length; i++) {
    const uid = userIds[i];
    const c1 = pathIds[i % pathIds.length];
    const c2 = pathIds[(i + 3) % pathIds.length];
    savedList.push({ user_id: uid, career_id: c1 });
    if (c2 !== c1) savedList.push({ user_id: uid, career_id: c2 });
  }
  const { error: scErr } = await supabase.from('saved_careers').upsert(savedList, { onConflict: 'user_id,career_id' });
  if (scErr) console.error('Error saved_careers:', scErr);
  else console.log(`✓ saved_careers: seeded ${savedList.length} bookmarked careers.`);

  // 5. POPULATE career_matches (20 records)
  console.log('\n5. Populating career_matches...');
  const matchesList = [];
  for (let i = 0; i < userIds.length; i++) {
    const uid = userIds[i];
    const c1 = pathIds[(i * 2) % pathIds.length];
    const c2 = pathIds[(i * 2 + 1) % pathIds.length];
    matchesList.push({
      user_id: uid,
      career_id: c1,
      fit_score: 94 - (i % 6),
      rank: 1,
      generated_summary: 'Outstanding alignment across research capabilities, analytical depth, and mission.'
    });
    matchesList.push({
      user_id: uid,
      career_id: c2,
      fit_score: 86 - (i % 6),
      rank: 2,
      generated_summary: 'Strong skill overlap with growth potential in public communication and stakeholder synthesis.'
    });
  }
  const { data: matchRows, error: cmErr } = await supabase.from('career_matches').insert(matchesList).select('id');
  if (cmErr) console.error('Error career_matches:', cmErr);
  else console.log(`✓ career_matches: seeded ${matchRows.length} matches.`);

  // 6. POPULATE match_reasons (40 records)
  if (matchRows && matchRows.length > 0) {
    console.log('\n6. Populating match_reasons...');
    const reasons = [];
    for (const m of matchRows) {
      reasons.push({
        match_id: m.id,
        reason_type: 'fit',
        reason: 'Your preference for evidence-based decision making matches how practitioners operate daily.'
      });
      reasons.push({
        match_id: m.id,
        reason_type: 'stretch',
        reason: 'Requires continuous comfort with evolving tooling and cross-functional ambiguity.'
      });
    }
    const { error: mrErr } = await supabase.from('match_reasons').insert(reasons);
    if (mrErr) console.error('Error match_reasons:', mrErr);
    else console.log(`✓ match_reasons: seeded ${reasons.length} reasons.`);
  }

  // FINAL VERIFICATION COUNT
  console.log('\n=== FINAL VERIFICATION ACROSS ALL TABLES ===');
  const allTables = ['career_paths', 'profiles', 'questionnaire_responses', 'saved_careers', 'career_matches', 'match_reasons'];
  for (const t of allTables) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`Table '${t}': ${count} rows`);
  }
}

run();
