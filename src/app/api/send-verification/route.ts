import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase, supabaseAdmin } from '../../../lib/supabaseClient';
import { sendVerificationEmail } from '../../../lib/resend';

// Helper to create resilient verification token with embedded email fallback
export function createVerificationToken(email: string): string {
  const randomHex = crypto.randomBytes(16).toString('hex');
  const emailHex = Buffer.from(email.trim().toLowerCase()).toString('hex');
  return `${randomHex}_${emailHex}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const dbClient = supabaseAdmin || supabase;

    // Create resilient 32-byte hex token with embedded email fallback
    const token = createVerificationToken(cleanEmail);
    const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    // Persist verification token in user's profile if columns exist
    try {
      await dbClient
        .from('profiles')
        .update({
          verification_token: token,
          verification_token_expires_at: tokenExpiresAt,
        })
        .eq('email', cleanEmail);
    } catch (dbErr) {
      console.warn('[Send Verification API] DB Token Notice:', dbErr);
    }

    // Trigger Resend email dispatch
    const emailResult = await sendVerificationEmail({
      email: cleanEmail,
      name: name || 'Member',
      token,
    });

    return NextResponse.json({
      success: true,
      message: 'Verification email processed successfully.',
      mocked: emailResult.mocked || false,
      verificationUrl: emailResult.verificationUrl,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Send Verification API] Unhandled Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error processing verification request' },
      { status: 500 }
    );
  }
}
