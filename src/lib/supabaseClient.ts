import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slzqficyybupffmqqhuq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsenFmaWN5eWJ1cGZmbXFxaHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMjgyMjEsImV4cCI6MjEwNDcwNDIyMX0.TzZ6CUrXOK0xGYTTmX9757WbX15Ht6lY7o7sXV61U_0';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || supabaseAnonKey;

// Standard Client (Browser / Public)
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Admin Client (Server-side API routes bypassing RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storageKey: 'sb-admin-auth-token',
    },
  }
);

