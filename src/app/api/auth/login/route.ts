import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firebaseUid } = body;

    if (!email && !firebaseUid) {
      return NextResponse.json(
        { success: false, error: 'Email or User ID required for authentication.' },
        { status: 400 }
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const usersRef = collection(db, 'users');

    // Query Firestore by UID or email or memberId
    let userDoc: any = null;

    if (firebaseUid) {
      const qUid = query(usersRef, where('uid', '==', firebaseUid));
      const snapUid = await getDocs(qUid);
      if (!snapUid.empty) {
        userDoc = snapUid.docs[0].data();
      }
    }

    if (!userDoc && cleanEmail) {
      const qEmail = query(usersRef, where('email', '==', cleanEmail));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        userDoc = snapEmail.docs[0].data();
      } else {
        // Fallback: search by memberId or mobile
        const qMember = query(usersRef, where('memberId', '==', email.trim().toUpperCase()));
        const snapMember = await getDocs(qMember);
        if (!snapMember.empty) {
          userDoc = snapMember.docs[0].data();
        }
      }
    }

    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: 'Member profile not found in Firebase database.' },
        { status: 404 }
      );
    }

    // Log Audit Event
    try {
      await addDoc(collection(db, 'audit_logs'), {
        actor: userDoc.fullName || cleanEmail,
        role: 'Member',
        action: 'FIREBASE_LOGIN_SUCCESS',
        module: 'Authentication',
        recordId: userDoc.memberId,
        previousStatus: 'Logged Out',
        newStatus: 'Active Session',
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        createdAt: serverTimestamp(),
      });
    } catch (auditErr) {}

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc.uid || userDoc.memberId,
        memberId: userDoc.memberId,
        fullName: userDoc.fullName,
        email: userDoc.email,
        mobile: userDoc.mobile || '+91 98765 43210',
        accountStatus: userDoc.accountStatus || 'Active',
        emailVerified: Boolean(userDoc.emailVerified),
        depositStatus: userDoc.depositStatus || 'Not Started',
        rewardStatus: userDoc.rewardStatus || 'In Selection Pool',
        slotNumber: userDoc.slotNumber || 0,
        registrationDate: userDoc.joinedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        referralId: userDoc.referralCode,
        idDocumentUrl: userDoc.idDocumentUrl || null,
        avatar: userDoc.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error during login' },
      { status: 500 }
    );
  }
}
