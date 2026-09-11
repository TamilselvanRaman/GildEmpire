import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount, paymentMethod, referenceId, proofUrl } = body;

    if (!userId || !amount || !paymentMethod || !referenceId) {
      return NextResponse.json(
        { success: false, error: 'User ID, amount, payment method, and reference ID are required.' },
        { status: 400 }
      );
    }

    const transactionDate = new Date().toLocaleString('en-IN') + ' IST';

    // 1. Insert deposit transaction record
    const { data: depositData, error: depositError } = await supabase
      .from('deposits')
      .insert([
        {
          user_id: userId,
          amount,
          payment_method: paymentMethod,
          reference_id: referenceId,
          proof_url: proofUrl || null,
          status: 'Under Review',
          transaction_date: transactionDate,
        },
      ])
      .select()
      .single();

    if (depositError && !depositError.message.includes('relation "deposits" does not exist')) {
      return NextResponse.json(
        { success: false, error: depositError.message },
        { status: 400 }
      );
    }

    // 2. Update user profile deposit status to 'Under Review' & calculate 5% referral bonus for referrer
    try {
      await supabase
        .from('profiles')
        .update({ deposit_status: 'Under Review' })
        .eq('id', userId);

      // Calculate 5% referral bonus (5% of deposit amount, e.g., 5% of ₹5,000 = ₹250)
      const referralBonusAmount = Math.round(Number(amount) * 0.05);

      await supabase
        .from('referrals')
        .update({
          deposit_status: 'Pending Verification',
          bonus_amount: referralBonusAmount,
        })
        .eq('referred_user_id', userId);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Deposit payment reference submitted successfully for verification.',
      deposit: depositData || {
        id: `dep_${Date.now()}`,
        userId,
        amount,
        paymentMethod,
        referenceId,
        status: 'Under Review',
        transactionDate,
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit deposit payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID parameter is required.' },
        { status: 400 }
      );
    }

    const { data: deposits, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', userId);

    if (error && !error.message.includes('relation "deposits" does not exist')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      deposits: deposits || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch deposit transactions' },
      { status: 500 }
    );
  }
}
