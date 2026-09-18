import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../lib/supabaseClient';

function parseEmbeddedEmailFromToken(token: string): string | null {
  try {
    const parts = token.split('_');
    if (parts.length >= 2) {
      const hexStr = parts.slice(1).join('_');
      const decoded = Buffer.from(hexStr, 'hex').toString('utf8');
      if (decoded && decoded.includes('@')) {
        return decoded.trim().toLowerCase();
      }
    }
  } catch (e) {}
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required.' },
        { status: 400 }
      );
    }

    const dbClient = supabaseAdmin || supabase;
    const embeddedEmail = parseEmbeddedEmailFromToken(token);

    let profile: any = null;

    // 1. First attempt: Query profile matching verification_token column
    try {
      const { data, error } = await dbClient
        .from('profiles')
        .select('*')
        .eq('verification_token', token);

      if (!error && Array.isArray(data) && data.length > 0) {
        profile = data[0];
      }
    } catch (e) {
      console.warn('[Verify Email API] verification_token query notice:', e);
    }

    // 2. Second attempt: Fallback to embedded email decoded from token
    if (!profile && embeddedEmail) {
      try {
        const { data: emailMatches, error: emailErr } = await dbClient
          .from('profiles')
          .select('*')
          .eq('email', embeddedEmail);

        if (!emailErr && Array.isArray(emailMatches) && emailMatches.length > 0) {
          profile = emailMatches[0];
        }
      } catch (e) {
        console.warn('[Verify Email API] Email fallback query notice:', e);
      }
    }

    // 3. Third attempt: Fallback query all profiles if RLS/Client issue occurs
    if (!profile && embeddedEmail) {
      try {
        const { data: allProfiles } = await supabase.from('profiles').select('*');
        if (Array.isArray(allProfiles)) {
          profile = allProfiles.find((p: any) => p.email?.toLowerCase() === embeddedEmail);
        }
      } catch (e) {}
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token. Please request a new link.' },
        { status: 400 }
      );
    }

    // Check token expiration if timestamp present
    if (profile.verification_token_expires_at) {
      const expiresAt = new Date(profile.verification_token_expires_at).getTime();
      if (Date.now() > expiresAt) {
        return NextResponse.json(
          { success: false, error: 'Verification link has expired (30 min limit). Please request a new email link below.' },
          { status: 400 }
        );
      }
    }

    // Update profile record setting email_verified = true
    try {
      const { error: upErr } = await dbClient
        .from('profiles')
        .update({
          email_verified: true,
          verification_token: null,
          verification_token_expires_at: null,
        })
        .eq('id', profile.id);

      if (upErr) {
        await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', profile.id);
      }
    } catch (updateErr: any) {
      console.warn('[Verify Email API] DB update notice:', updateErr?.message || updateErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Email address successfully verified!',
      user: {
        email: profile.email,
        fullName: profile.full_name,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Verify Email API] Unhandled Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error verifying email' },
      { status: 500 }
    );
  }
}
