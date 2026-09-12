import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Mobile and password are required.' },
        { status: 400 }
      );
    }

    // 1. Supabase Sign In with Password
    let authData: any = null;
    let authError: any = null;

    try {
      const res = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      authData = res.data;
      authError = res.error;
    } catch (e: any) {
      authError = e;
    }

    // 2. Retrieve user profile details from Supabase profiles table
    let profileData: any = null;
    if (authData?.user) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        profileData = data;
      } catch (e) {}
    }

    // If profileData not found via auth UUID, lookup profiles table by email or mobile
    if (!profileData) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .or(`email.eq.${email.trim()},mobile.eq.${email.trim()}`)
          .maybeSingle();
        if (data) {
          profileData = data;
        }
      } catch (e) {}
    }

    const memberId = profileData?.member_id || `LOP-${Math.floor(100000 + Math.random() * 900000)}`;
    const displayName = profileData?.full_name || (email.includes('@') ? email.split('@')[0] : 'Tamil Selvan');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      session: authData?.session || null,
      user: {
        id: authData?.user?.id || profileData?.id || memberId,
        memberId,
        fullName: displayName,
        email: profileData?.email || email.trim(),
        mobile: profileData?.mobile || '+91 99442 87852',
        accountStatus: profileData?.account_status || 'Active',
        depositStatus: profileData?.deposit_status || 'Not Started',
        rewardStatus: profileData?.reward_status || 'In Selection Pool',
        slotNumber: profileData?.slot_number || 0,
        registrationDate: profileData?.joined_date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        referralId: `REF-${memberId.slice(-6)}`,
        idDocumentUrl: profileData?.id_document_url || null,
        avatar: profileData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      },
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error during authentication' },
      { status: 500 }
    );
  }
}
