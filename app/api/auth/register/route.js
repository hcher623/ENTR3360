import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://hitnwhinhzrqzabdiyyx.supabase.co';
const FALLBACK_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdG53aGluaHpycXphYmRpeXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI2MTAzMSwiZXhwIjoyMTA1ODM3MDMxfQ.MoHmIiIDwhhzToNZfs3hM8c4G9Tomew2V7UGs6hAkoY';

function cleanString(str, fallback) {
  if (!str) return fallback;
  let s = String(str).trim().replace(/[^\x20-\x7E]/g, '');
  if (s.includes(' ')) s = s.split(/\s+/)[0];
  s = s.replace(/\.+$/, '');
  const parts = s.split('.');
  if (parts.length > 3) s = parts.slice(0, 3).join('.');
  return s || fallback;
}

const supabaseUrl = cleanString(process.env.NEXT_PUBLIC_SUPABASE_URL, FALLBACK_URL).replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const serviceKey = cleanString(process.env.SUPABASE_SERVICE_ROLE_KEY, FALLBACK_SERVICE_KEY);

const adminClient = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = (name || cleanEmail.split('@')[0]).trim();

    // 1. Create user with email_confirm: true (bypasses email confirmation completely)
    let { data, error } = await adminClient.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: { name: displayName }
    });

    if (error) {
      if (error.message.toLowerCase().includes('already exists') || error.message.toLowerCase().includes('registered')) {
        // If account already exists, seamlessly update password to what they just entered
        const { data: list } = await adminClient.auth.admin.listUsers();
        const existing = list?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
        if (existing) {
          const updateRes = await adminClient.auth.admin.updateUserById(existing.id, {
            password: password,
            email_confirm: true,
            user_metadata: { name: displayName }
          });
          data = { user: updateRes.data?.user || existing };
          error = null;
        } else {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    // 2. Ensure profile row exists in public.profiles
    if (data?.user?.id) {
      await adminClient.from('profiles').upsert({
        id: data.user.id,
        display_name: displayName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        onboarding_status: 'complete',
        current_step: 4
      }, { onConflict: 'id' });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: err.message || 'Server error creating account' }, { status: 500 });
  }
}
