import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, supabaseAdmin } from '../../../../lib/supabaseClient';
import { sendPasswordResetEmail } from '../../../../lib/resend';
import { createVerificationToken } from '../../send-verification/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Mobile number or email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const dbClient = supabaseAdmin || supabase;

    // Search profile by email or mobile
    let profileName = 'Member';
    let targetEmail = cleanEmail;

    try {
      const { data: profiles } = await dbClient
        .from('profiles')
        .select('id, full_name, email, mobile')
        .or(`email.ilike.${cleanEmail},mobile.eq.${cleanEmail}`);

      if (Array.isArray(profiles) && profiles.length > 0) {
        const p = profiles[0];
        profileName = p.full_name || 'Member';
        targetEmail = p.email || cleanEmail;
      }
    } catch (e) {
      console.warn('[Forgot Password API] Profile lookup notice:', e);
    }

    // Generate 32-byte crypto token with 30-min expiry
    const token = createVerificationToken(targetEmail);
    const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    try {
      await dbClient
        .from('profiles')
        .update({
          verification_token: token,
          verification_token_expires_at: tokenExpiresAt,
        })
        .ilike('email', targetEmail);
    } catch (e) {
      console.warn('[Forgot Password API] Token column update notice:', e);
    }

    // Dispatch Password Reset email via Resend
    const emailResult = await sendPasswordResetEmail({
      email: targetEmail,
      name: profileName,
      token,
    });

    return NextResponse.json({
      success: true,
      message: emailResult.sandboxFallback 
        ? `Resend Sandbox Mode: Reset link generated and sent to admin inbox (infinitygram916@gmail.com).`
        : `Password reset instructions sent to ${targetEmail}.`,
      targetEmail,
      mocked: emailResult.mocked || false,
      resetUrl: emailResult.resetUrl,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Forgot Password API] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error dispatching password reset' },
      { status: 500 }
    );
  }
}
