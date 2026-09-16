import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const rawRefCode = searchParams.get('referralCode');
    const memberId = searchParams.get('memberId');

    const cleanCode = rawRefCode ? rawRefCode.trim().toUpperCase() : null;
    const cleanMemberId = memberId ? memberId.trim().toUpperCase() : null;
    const numPart = (cleanCode?.replace(/\D/g, '') || cleanMemberId?.replace(/\D/g, '') || '');

    const dbClient = supabaseAdmin || supabase;

    // Code candidate strings to search for
    const codeCandidates = [
      cleanCode,
      cleanCode ? cleanCode.replace(/^REF-/i, '') : null,
      cleanMemberId,
      numPart ? `REF-${numPart}` : null,
      numPart ? `LOP-${numPart}` : null,
      numPart || null,
    ].filter(Boolean) as string[];

    let dbReferrals: any[] = [];

    // 1. Fetch from referrals table
    try {
      let query = dbClient.from('referrals').select('*');
      if (codeCandidates.length > 0 && userId) {
        const orClause = [...codeCandidates.map(c => `referrer_code.ilike.${c}`), `referrer_id.eq.${userId}`].join(',');
        query = query.or(orClause);
      } else if (codeCandidates.length > 0) {
        const orClause = codeCandidates.map(c => `referrer_code.ilike.${c}`).join(',');
        query = query.or(orClause);
      } else if (userId) {
        query = query.eq('referrer_id', userId);
      }
      const { data } = await query;
      if (data) dbReferrals = data;
    } catch (e) {}

    // 2. Fetch from profiles table for registered users who entered any of these referral_codes
    let profileReferrals: any[] = [];
    if (codeCandidates.length > 0) {
      try {
        const orClause = codeCandidates.map(c => `referral_code.ilike.${c}`).join(',');
        const { data: pData } = await dbClient
          .from('profiles')
          .select('*')
          .or(orClause);
        if (pData) profileReferrals = pData;
      } catch (e) {}
    }

    // Combine and format referrals list
    const combinedMap = new Map<string, any>();

    dbReferrals.forEach((r: any) => {
      const key = r.referred_member_id || r.referred_user_id || r.id;
      const isVerified = r.deposit_status === 'Verified';
      combinedMap.set(key, {
        id: r.id || `ref_${Date.now()}`,
        referredName: r.referred_name || 'Referred Member',
        referredMemberId: r.referred_member_id || 'LOP-MEMBER',
        joinedDate: r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN'),
        depositStatus: r.deposit_status || 'Not Started',
        eligibility: isVerified ? 'Eligible' : 'Pending Verification',
        bonusEarnedAmount: isVerified ? (r.bonus_amount || 500) : 0,
      });
    });

    profileReferrals.forEach((p: any) => {
      const key = p.member_id || p.id;
      if (!combinedMap.has(key)) {
        const isVerified = p.deposit_status === 'Verified';
        combinedMap.set(key, {
          id: p.id || `ref_p_${Date.now()}`,
          referredName: p.full_name || p.email?.split('@')[0] || 'Referred Member',
          referredMemberId: p.member_id || 'LOP-MEMBER',
          joinedDate: p.joined_date || new Date(p.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          depositStatus: p.deposit_status || 'Not Started',
          eligibility: isVerified ? 'Eligible' : 'Pending Verification',
          bonusEarnedAmount: isVerified ? 500 : 0,
        });
      }
    });

    const referralList = Array.from(combinedMap.values());

    const totalBonusEarned = referralList
      .filter((r: any) => r.depositStatus === 'Verified')
      .reduce((sum: number, r: any) => sum + (r.bonusEarnedAmount || 500), 0);

    return NextResponse.json({
      success: true,
      referrals: referralList,
      totalReferrals: referralList.length,
      verifiedCount: referralList.filter((r: any) => r.depositStatus === 'Verified').length,
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

    const dbClient = supabaseAdmin || supabase;
    const cleanCode = referrerCode ? referrerCode.trim().toUpperCase() : null;

    const { data: newReferral, error } = await dbClient
      .from('referrals')
      .insert([
        {
          referrer_id: referrerId || null,
          referrer_code: cleanCode,
          referred_user_id: referredUserId,
          referred_name: referredName,
          referred_member_id: referredMemberId,
          deposit_status: 'Not Started',
          bonus_amount: 500, // 5% of ₹10,000 = ₹500
        },
      ])
      .select()
      .single();

    if (error && !error.message.includes('relation "referrals" does not exist')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Referral tracking link created successfully (5% referral bonus queued upon deposit verification).',
      referral: newReferral || {
        id: `ref_${Date.now()}`,
        referrerId,
        referredName,
        referredMemberId,
        depositStatus: 'Not Started',
        bonusAmount: 500,
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to record referral' },
      { status: 500 }
    );
  }
}
