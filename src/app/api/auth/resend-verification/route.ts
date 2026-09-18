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
    const { data: profile } = await dbClient
      .from('profiles')
      .select('id, full_name, email, email_verified')
      .eq('email', cleanEmail)
      .single();

    if (profile?.email_verified) {
      return NextResponse.json(
        { success: true, message: 'This email address is already verified. You can log in.' },
        { status: 200 }
      );
    }

    // Generate resilient token with 30-min expiry
    const token = createVerificationToken(cleanEmail);
    const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    if (profile?.id) {
      try {
        await dbClient
          .from('profiles')
          .update({
            verification_token: token,
            verification_token_expires_at: tokenExpiresAt,
          })
          .eq('id', profile.id);
      } catch (e) {
        console.warn('[Resend Verification API] Token column update notice:', e);
      }
    }

    // Dispatch email
    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: profile?.full_name || 'Member',
      token,
    });

    return NextResponse.json({
      success: true,
      message: 'A new verification link has been sent to your email address.',
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
