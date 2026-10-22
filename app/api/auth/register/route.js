import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hitnwhinhzrqzabdiyyx.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdG53aGluaHpycXphYmRpeXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI2MTAzMSwiZXhwIjoyMTA1ODM3MDMxfQ.MoHmIiIDwhhzToNZfs3hM8c4G9Tomew2V7UGs6hAkoY';

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
    const { data, error } = await adminClient.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: { name: displayName }
    });

    if (error) {
      if (error.message.includes('already exists') || error.message.includes('registered')) {
        return NextResponse.json({ 
          error: 'An account with this email already exists. Please switch to Sign In.' 
        }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
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
