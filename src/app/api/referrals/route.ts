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

    // Fetch all users to check real-time depositStatus from users collection
    const allUsersSnap = await getDocs(usersRef);
    const userDepositMap = new Map<string, any>();
    allUsersSnap.forEach(uDoc => {
      const data = uDoc.data();
      const mId = (data.memberId || '').toString().trim().toUpperCase();
      const uId = uDoc.id;
      const isVerified = data.depositStatus === 'Verified' || data.deposit === 'Verified' || Number(data.slotNumber || 0) > 0 || (data.slot && data.slot !== 'Not Assigned Yet' && data.slot !== 'Unassigned' && data.slot !== '-');
      if (mId) userDepositMap.set(mId, { isVerified, data });
      if (uId) userDepositMap.set(uId, { isVerified, data });
    });

    const referralMap = new Map<string, any>();

    const numPart = (cleanCode?.replace(/\D/g, '') || cleanMemberId?.replace(/\D/g, '') || '');
    const codeCandidates = [
      cleanCode,
      cleanMemberId,
      numPart ? `REF-${numPart}` : '',
      numPart ? `LOP-${numPart}` : '',
      numPart,
    ].filter(Boolean) as string[];

    // 1. Fetch from referrals collection in Firestore
    if (codeCandidates.length > 0) {
      const snapRef = await getDocs(referralsRef);
      snapRef.forEach(docSnap => {
        const r = docSnap.data();
        const refCode = (r.referrerCode || '').toString().trim().toUpperCase();
        const refMemberId = (r.referrerId || r.referrerMemberId || '').toString().trim().toUpperCase();
        
        const isMatch = codeCandidates.some(c => c && (refCode === c || refMemberId === c || refCode.endsWith(c) || c.endsWith(refCode)));
        
        if (isMatch) {
          const key = r.referredMemberId || r.referredUserId || docSnap.id;
          const userMatch = userDepositMap.get((r.referredMemberId || '').toString().toUpperCase()) || userDepositMap.get(r.referredUserId);
          const isVerified = userMatch ? userMatch.isVerified : (r.depositStatus === 'Verified');

          referralMap.set(key, {
            id: docSnap.id,
            referredName: r.referredName || userMatch?.data?.fullName || userMatch?.data?.name || 'Referred Member',
            referredMemberId: r.referredMemberId || 'LOP-MEMBER',
            joinedDate: r.createdAt ? new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '25 Sept 2026',
            depositStatus: isVerified ? 'Verified' : 'Not Started',
            eligibility: isVerified ? 'Eligible' : 'Pending Verification',
            bonusEarnedAmount: isVerified ? 500 : 0,
            bonusAmount: isVerified ? 500 : 0,
          });
        }
      });
    }

    // 2. Fetch users who have referredBy matching cleanCode or cleanMemberId
    if (codeCandidates.length > 0) {
      allUsersSnap.forEach(docSnap => {
        const u = docSnap.data();
        const uReferredBy = (u.referredBy || '').toString().trim().toUpperCase();

        const isMatch = uReferredBy && codeCandidates.some(c => c && (uReferredBy === c || uReferredBy.endsWith(c) || c.endsWith(uReferredBy)));
        const isSelf = (userId && u.uid === userId) || (cleanMemberId && u.memberId?.toUpperCase() === cleanMemberId);

        if (isMatch && !isSelf) {
          const key = u.memberId || docSnap.id;
          const isVerified = u.depositStatus === 'Verified' || u.deposit === 'Verified' || Number(u.slotNumber || 0) > 0 || (u.slot && u.slot !== 'Not Assigned Yet' && u.slot !== 'Unassigned' && u.slot !== '-');

          if (!referralMap.has(key) || (isVerified && referralMap.get(key)?.depositStatus !== 'Verified')) {
            referralMap.set(key, {
              id: docSnap.id,
              referredName: u.fullName || u.name || u.email?.split('@')[0] || 'Referred Member',
              referredMemberId: u.memberId || 'LOP-MEMBER',
              joinedDate: u.joinedDate || u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              depositStatus: isVerified ? 'Verified' : 'Not Started',
              eligibility: isVerified ? 'Eligible' : 'Pending Verification',
              bonusEarnedAmount: isVerified ? 500 : 0,
              bonusAmount: isVerified ? 500 : 0,
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
      bonusAmount: 0,
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
        bonusAmount: 0,
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to record referral in Firebase' },
      { status: 500 }
    );
  }
}
