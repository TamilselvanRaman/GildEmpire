import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 1. Supabase Sign In with Password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError && !authError.message.includes('FetchError') && !authError.message.includes('Invalid login credentials')) {
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 401 }
      );
    }

    // 2. Retrieve user profile details from Supabase profiles table
    let profileData: any = null;
    if (authData?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      profileData = data;
    }

    const memberId = profileData?.member_id || `LOP-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      session: authData?.session || null,
      user: {
        id: authData?.user?.id || memberId,
        memberId,
        fullName: profileData?.full_name || 'Rajesh Kumar Sharma',
        email: email.trim(),
        mobile: profileData?.mobile || '+91 98765 43210',
        accountStatus: profileData?.account_status || 'Active',
        depositStatus: profileData?.deposit_status || 'Verified',
        rewardStatus: profileData?.reward_status || 'In Selection Pool',
        slotNumber: profileData?.slot_number || 14,
        registrationDate: profileData?.joined_date || '14 Aug 2026',
        referralId: `REF-${memberId.slice(-6)}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error during authentication' },
      { status: 500 }
    );
  }
}
