import { createClient } from '@supabase/supabase-js';

// Fallback verified production credentials for hitnwhinhzrqzabdiyyx project
const FALLBACK_URL = 'https://hitnwhinhzrqzabdiyyx.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdG53aGluaHpycXphYmRpeXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjEwMzEsImV4cCI6MjEwNTgzNzAzMX0.ww3lfDZTbpi0hPlG8rPgvO2hd7mI9EpdvgYfg8gzsw4';

function sanitizeUrl(raw) {
  if (!raw) return FALLBACK_URL;
  let url = String(raw).trim().replace(/[^\x20-\x7E]/g, '');
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  return (url.startsWith('https://') && !url.includes('placeholder')) ? url : FALLBACK_URL;
}

function sanitizeKey(raw) {
  if (!raw) return FALLBACK_ANON_KEY;
  // Strip any non-ASCII code points (> 127) to avoid "String contains non ISO-8859-1 code point" in fetch headers
  let key = String(raw).trim().replace(/[^\x20-\x7E]/g, '');

  // In case multiple keys were pasted separated by spaces, take the first valid JWT token
  if (key.includes(' ')) {
    key = key.split(/\s+/)[0];
  }

  // Remove trailing dots or punctuation
  key = key.replace(/[^a-zA-Z0-9_\-\.]+$/g, '').replace(/\.+$/, '');

  // A valid JWT has exactly 3 base64 segments separated by dots
  const parts = key.split('.');
  if (parts.length > 3) {
    key = parts.slice(0, 3).join('.');
  }

  return (key.startsWith('eyJ') && key.split('.').length === 3) ? key : FALLBACK_ANON_KEY;
}

const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
