import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, mobile, password, referralCode } = body;

    if (!email || !password || !fullName || !mobile) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, mobile number, and password are required.' },
        { status: 400 }
      );
    }

    const memberId = `LOP-${Math.floor(100000 + Math.random() * 900000)}`;

    // 1. Supabase Auth Registration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          fullName,
          mobile,
          memberId,
        },
      },
    });

    if (authError && !authError.message.includes('FetchError') && !authError.message.includes('NetworkError')) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 400 }
      );
    }

    const userId = authData?.user?.id || memberId;
    const joinedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // 2. Insert User Profile into Supabase profiles table
    try {
      await supabase.from('profiles').insert([
        {
          id: userId,
          full_name: fullName,
          email: email.trim(),
          mobile,
          member_id: memberId,
          referral_code: referralCode || null,
          account_status: 'Active',
          deposit_status: 'Not Started',
          reward_status: 'In Selection Pool',
          slot_number: 0,
          joined_date: joinedDate,
        },
      ]);
    } catch (dbErr) {
      console.warn('Supabase DB Insert Warning:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: userId,
        memberId,
        fullName,
        email: email.trim(),
        mobile,
        accountStatus: 'Active',
        depositStatus: 'Not Started',
        rewardStatus: 'In Selection Pool',
        slotNumber: 0,
        registrationDate: joinedDate,
        referralId: referralCode || `REF-${memberId.slice(-6)}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error during registration' },
      { status: 500 }
    );
  }
}
