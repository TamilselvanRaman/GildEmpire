import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendVerificationEmail } from '../../../../lib/resend';
import { createVerificationToken } from '../../send-verification/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, mobile, password, referralCode, deliveryAddress, address, firebaseUid } = body;
    const userAddress = deliveryAddress || address || '';

    if (!email || !fullName || !mobile) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and mobile number are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();
    const joinedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Generate unique Member ID
    const memberId = `LOP-${Math.floor(100000 + Math.random() * 900000)}`;
    const ownReferralCode = `REF-${memberId.replace('LOP-', '')}`;
    const verificationToken = createVerificationToken(cleanEmail);
    const userId = firebaseUid || `user_${Date.now()}`;

    // Create / update user document in Firestore 'users' collection
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      await setDoc(userDocRef, {
        uid: userId,
        fullName,
        email: cleanEmail,
        mobile: cleanMobile,
        memberId,
        referralCode: ownReferralCode,
        referredBy: referralCode || null,
        accountStatus: 'Active',
        depositStatus: 'Not Started',
        rewardStatus: 'In Selection Pool',
        slotNumber: 0,
        joinedDate,
        address: userAddress,
        emailVerified: false,
        verificationToken,
        createdAt: serverTimestamp(),
      });
    }

    // Save referral entry if referralCode was passed
    if (referralCode) {
      try {
        await addDoc(collection(db, 'referrals'), {
          referrerCode: referralCode,
          referredUserId: userId,
          referredName: fullName,
          referredMemberId: memberId,
          depositStatus: 'Not Started',
          bonusAmount: 500,
          createdAt: serverTimestamp(),
        });
      } catch (refErr) {
        console.warn('Firebase Referral document insert warning:', refErr);
      }
    }

    // Dispatch Verification Email via Resend directly
    let emailResult: any = null;
    try {
      emailResult = await sendVerificationEmail({
        email: cleanEmail,
        name: fullName,
        token: verificationToken,
      });
    } catch (emailErr) {
      console.warn('[Register API] Resend Verification Email Notice:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! A verification link has been sent to your email address.',
      emailSent: Boolean(emailResult?.success),
      verificationUrl: emailResult?.verificationUrl || null,
      user: {
        id: userId,
        memberId,
        fullName,
        email: cleanEmail,
        mobile: cleanMobile,
        address: userAddress,
        accountStatus: 'Active',
        emailVerified: false,
        depositStatus: 'Not Started',
        rewardStatus: 'In Selection Pool',
        slotNumber: 0,
        registrationDate: joinedDate,
        referralId: ownReferralCode,
        referredBy: referralCode || 'Direct Registration',
        idDocumentUrl: null,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error during registration' },
      { status: 500 }
    );
  }
}
