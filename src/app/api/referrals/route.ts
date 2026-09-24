import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, query, where, serverTimestamp } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const rawRefCode = searchParams.get('referralCode');
    const memberId = searchParams.get('memberId');

    const cleanCode = rawRefCode ? rawRefCode.trim().toUpperCase() : null;
    const cleanMemberId = memberId ? memberId.trim().toUpperCase() : null;

    const referralsRef = collection(db, 'referrals');
    const usersRef = collection(db, 'users');

    const referralList: any[] = [];
    const referralMap = new Map<string, any>();

    // 1. Fetch from referrals collection in Firestore
    if (cleanCode) {
      const qRef = query(referralsRef, where('referrerCode', '==', cleanCode));
      const snapRef = await getDocs(qRef);
      snapRef.forEach(docSnap => {
        const r = docSnap.data();
        const key = r.referredMemberId || r.referredUserId || docSnap.id;
        const isVerified = r.depositStatus === 'Verified';
        referralMap.set(key, {
          id: docSnap.id,
          referredName: r.referredName || 'Referred Member',
          referredMemberId: r.referredMemberId || 'LOP-MEMBER',
          joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          depositStatus: r.depositStatus || 'Not Started',
          eligibility: isVerified ? 'Eligible' : 'Pending Verification',
          bonusEarnedAmount: isVerified ? (r.bonusAmount || 500) : 0,
        });
      });
    }

    // 2. Fetch users who have referredBy matching cleanCode or cleanMemberId
    if (cleanCode || cleanMemberId) {
      const allUsersSnap = await getDocs(usersRef);
      allUsersSnap.forEach(docSnap => {
        const u = docSnap.data();
        const uReferredBy = (u.referredBy || '').toString().trim().toUpperCase();
        
        const isMatch = (cleanCode && uReferredBy === cleanCode) || 
                        (cleanMemberId && uReferredBy.includes(cleanMemberId));
        
        const isSelf = (userId && u.uid === userId) || (cleanMemberId && u.memberId === cleanMemberId);

        if (isMatch && !isSelf) {
          const key = u.memberId || docSnap.id;
          if (!referralMap.has(key)) {
            const isVerified = u.depositStatus === 'Verified';
            referralMap.set(key, {
              id: docSnap.id,
              referredName: u.fullName || u.email?.split('@')[0] || 'Referred Member',
              referredMemberId: u.memberId || 'LOP-MEMBER',
              joinedDate: u.joinedDate || new Date().toLocaleDateString('en-IN'),
              depositStatus: u.depositStatus || 'Not Started',
              eligibility: isVerified ? 'Eligible' : 'Pending Verification',
              bonusEarnedAmount: isVerified ? 500 : 0,
            });
          }
        }
      });
    }

    const referrals = Array.from(referralMap.values());
    const totalBonusEarned = referrals
      .filter((r: any) => r.depositStatus === 'Verified')
      .reduce((sum: number, r: any) => sum + (r.bonusEarnedAmount || 500), 0);

    return NextResponse.json({
      success: true,
      referrals,
      totalReferrals: referrals.length,
      verifiedCount: referrals.filter((r: any) => r.depositStatus === 'Verified').length,
      commissionRatePercent: 5,
      totalBonusEarned,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch referral records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referrerId, referrerCode, referredUserId, referredName, referredMemberId } = body;

    if (!referredUserId || !referredName || !referredMemberId) {
      return NextResponse.json(
        { success: false, error: 'Referred user details are required.' },
        { status: 400 }
      );
    }

    const cleanCode = referrerCode ? referrerCode.trim().toUpperCase() : null;

    const docRef = await addDoc(collection(db, 'referrals'), {
      referrerId: referrerId || null,
      referrerCode: cleanCode,
      referredUserId,
      referredName,
      referredMemberId,
      depositStatus: 'Not Started',
      bonusAmount: 500,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: 'Referral tracking link created successfully in Firebase.',
      referral: {
        id: docRef.id,
        referrerId,
        referredName,
        referredMemberId,
        depositStatus: 'Not Started',
        bonusAmount: 500,
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to record referral in Firebase' },
      { status: 500 }
    );
  }
}
