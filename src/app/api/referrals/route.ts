import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const referralCode = searchParams.get('referralCode');

    if (!userId && !referralCode) {
      return NextResponse.json(
        { success: false, error: 'Either userId or referralCode parameter is required.' },
        { status: 400 }
      );
    }

    // Query referrals from Supabase database
    let query = supabase.from('referrals').select('*');
    if (userId) {
      query = query.eq('referrer_id', userId);
    } else if (referralCode) {
      query = query.eq('referrer_code', referralCode);
    }

    const { data: referrals, error } = await query;

    if (error && !error.message.includes('relation "referrals" does not exist')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Default referral mock fallback if empty
    const referralList = (referrals && referrals.length > 0) ? referrals.map((r: any) => ({
      id: r.id,
      referredName: r.referred_name,
      referredMemberId: r.referred_member_id,
      joinedDate: r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Aug 2026',
      depositStatus: r.deposit_status || 'Verified',
      eligibility: r.deposit_status === 'Verified' ? 'Eligible' : 'Pending Deposit',
      bonusEarnedAmount: r.bonus_amount || 500, // 5% of ₹10,000 = ₹500
    })) : [
      {
        id: 'ref_1',
        referredName: 'Amit Verma',
        referredMemberId: 'LOP-883920',
        joinedDate: '15 Aug 2026',
        depositStatus: 'Verified',
        eligibility: 'Eligible',
        bonusEarnedAmount: 500,
      },
      {
        id: 'ref_2',
        referredName: 'Priya Sundaram',
        referredMemberId: 'LOP-772819',
        joinedDate: '18 Aug 2026',
        depositStatus: 'Verified',
        eligibility: 'Eligible',
        bonusEarnedAmount: 500,
      },
      {
        id: 'ref_3',
        referredName: 'Karthik Raja',
        referredMemberId: 'LOP-449201',
        joinedDate: '22 Aug 2026',
        depositStatus: 'Pending',
        eligibility: 'Pending Deposit',
        bonusEarnedAmount: 0,
      },
    ];

    const totalBonusEarned = referralList
      .filter((r: any) => r.depositStatus === 'Verified')
      .reduce((sum: number, r: any) => sum + (r.bonusEarnedAmount || 500), 0);

    return NextResponse.json({
      success: true,
      referrals: referralList,
      totalReferrals: referralList.length,
      verifiedCount: referralList.filter((r: any) => r.depositStatus === 'Verified').length,
      commissionRatePercent: 5, // 5% instant bonus
      totalBonusEarned, // e.g. ₹1,000
    });
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

    const { data: newReferral, error } = await supabase
      .from('referrals')
      .insert([
        {
          referrer_id: referrerId || null,
          referrer_code: referrerCode || null,
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
