import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
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

    // 1. Check Firestore 'users' collection
    let profileName = 'Member';
    let isAlreadyVerified = false;

    try {
      const usersRef = collection(db, 'users');
      const snap = await getDocs(query(usersRef, where('email', '==', cleanEmail)));
      if (!snap.empty) {
        const userDoc = snap.docs[0];
        const data = userDoc.data();
        profileName = data.fullName || data.name || cleanEmail.split('@')[0];
        if (data.emailVerified === true) {
          isAlreadyVerified = true;
        }
      }
    } catch (e) {
      console.warn('[Resend Verification API] Firestore check notice:', e);
    }

    if (isAlreadyVerified) {
      return NextResponse.json(
        { success: true, message: 'This email address is already verified. Your account is active.' },
        { status: 200 }
      );
    }

    // Generate token
    const token = createVerificationToken(cleanEmail);

    // Save token to Firestore
    try {
      const usersRef = collection(db, 'users');
      const snap = await getDocs(query(usersRef, where('email', '==', cleanEmail)));
      if (!snap.empty) {
        await updateDoc(doc(db, 'users', snap.docs[0].id), {
          verificationToken: token,
        });
      }
    } catch (e) {
      console.warn('[Resend Verification API] Firestore token update notice:', e);
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
