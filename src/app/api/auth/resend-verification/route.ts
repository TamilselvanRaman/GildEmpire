import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, supabaseAdmin } from '../../../../lib/supabaseClient';
import { sendVerificationEmail } from '../../../../lib/resend';
import { createVerificationToken } from '../../send-verification/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const dbClient = supabaseAdmin || supabase;

    // Retrieve user profile
    let profileName = 'Member';
    let isAlreadyVerified = false;
    let userId = null;

    try {
      const { data: profiles } = await dbClient
        .from('profiles')
        .select('id, full_name, email, email_verified')
        .eq('email', cleanEmail);

      if (Array.isArray(profiles) && profiles.length > 0) {
        const p = profiles[0];
        userId = p.id;
        profileName = p.full_name || 'Member';
        if (p.email_verified) {
          isAlreadyVerified = true;
        }
      }
    } catch (e) {
      console.warn('[Resend Verification API] Profile lookup notice:', e);
    }

    if (isAlreadyVerified) {
      return NextResponse.json(
        { success: true, message: 'This email address is already verified. Your account is active.' },
        { status: 200 }
      );
    }

    // Generate resilient token with 30-min expiry
    const token = createVerificationToken(cleanEmail);
    const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    if (userId) {
      try {
        await dbClient
          .from('profiles')
          .update({
            verification_token: token,
            verification_token_expires_at: tokenExpiresAt,
          })
          .eq('id', userId);
      } catch (e) {
        console.warn('[Resend Verification API] Token column update notice:', e);
      }
    }

    // Dispatch email via Resend
    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: profileName,
      token,
    });

    return NextResponse.json({
      success: true,
      message: emailResult.sandboxFallback 
        ? `Resend Sandbox Mode: Verification link generated and sent to admin inbox (infinitygram916@gmail.com).`
        : `A new verification link has been sent to ${cleanEmail}.`,
      mocked: emailResult.mocked || false,
      verificationUrl: emailResult.verificationUrl,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Resend Verification API] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error re-sending verification email' },
      { status: 500 }
    );
  }
}
