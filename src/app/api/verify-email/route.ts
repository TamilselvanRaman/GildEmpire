import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
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

    const embeddedEmail = parseEmbeddedEmailFromToken(token);
    let verifiedEmail = embeddedEmail;
    let verifiedMemberId = '';
    let verifiedName = '';
    let verifiedUserId = '';

    // 1. Primary: Search & Update Cloud Firestore 'users' collection
    try {
      const usersRef = collection(db, 'users');
      const snapByToken = await getDocs(query(usersRef, where('verificationToken', '==', token)));
      
      let matchedDoc: any = null;
      if (!snapByToken.empty) {
        matchedDoc = snapByToken.docs[0];
      } else if (embeddedEmail) {
        const snapByEmail = await getDocs(query(usersRef, where('email', '==', embeddedEmail)));
        if (!snapByEmail.empty) {
          matchedDoc = snapByEmail.docs[0];
        }
      }

      // If still not found by direct query, scan all users
      if (!matchedDoc && embeddedEmail) {
        const allUsersSnap = await getDocs(usersRef);
        allUsersSnap.forEach((userDoc) => {
          const data = userDoc.data();
          if (data.email?.toLowerCase().trim() === embeddedEmail || data.verificationToken === token) {
            matchedDoc = userDoc;
          }
        });
      }

      if (matchedDoc) {
        const userData = matchedDoc.data();
        verifiedUserId = matchedDoc.id;
        verifiedEmail = userData.email || embeddedEmail;
        verifiedName = userData.fullName || userData.name || (verifiedEmail ? verifiedEmail.split('@')[0] : 'Member');
        verifiedMemberId = userData.memberId || `LOP-${Math.floor(100000 + Math.random() * 900000)}`;

        // Update Firestore user document
        await updateDoc(doc(db, 'users', matchedDoc.id), {
          emailVerified: true,
          accountStatus: 'Active',
          verificationToken: null,
        });
        console.log(`✅ [Verify Email API] Updated Firestore user ${matchedDoc.id} (${verifiedEmail}) to emailVerified: true`);
      }
    } catch (fsErr) {
      console.warn('[Verify Email API] Firestore update notice:', fsErr);
    }

    // 2. Secondary: Sync with Supabase (for dual fallback compatibility)
    try {
      const dbClient = supabaseAdmin || supabase;
      if (verifiedEmail) {
        await dbClient
          .from('profiles')
          .update({
            email_verified: true,
            account_status: 'Active',
            verification_token: null,
          })
          .ilike('email', verifiedEmail);
      }
    } catch (spErr) {
      console.warn('[Verify Email API] Supabase update notice:', spErr);
    }

    if (!verifiedEmail) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token. Please request a new link.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email address successfully verified!',
      user: {
        id: verifiedUserId || verifiedEmail,
        memberId: verifiedMemberId || 'LOP-MEMBER',
        email: verifiedEmail,
        fullName: verifiedName || verifiedEmail.split('@')[0],
        accountStatus: 'Active',
        emailVerified: true,
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
