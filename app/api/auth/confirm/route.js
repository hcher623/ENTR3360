import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hitnwhinhzrqzabdiyyx.supabase.co';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdG53aGluaHpycXphYmRpeXl4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI2MTAzMSwiZXhwIjoyMTA1ODM3MDMxfQ.MoHmIiIDwhhzToNZfs3hM8c4G9Tomew2V7UGs6hAkoY';

const adminClient = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const { data: list } = await adminClient.auth.admin.listUsers();
    const existing = list?.users?.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());

    if (existing) {
      await adminClient.auth.admin.updateUserById(existing.id, { email_confirm: true });
      return NextResponse.json({ success: true, confirmed: true });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
