import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../../lib/supabaseClient';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, mobile, password, referralCode, deliveryAddress, address } = body;
    const userAddress = deliveryAddress || address || '';

    if (!email || !password || !fullName || !mobile) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, mobile number, and password are required.' },
        { status: 400 }
      );
    }

    const memberId = `LOP-${Math.floor(100000 + Math.random() * 900000)}`;
    let userId = crypto.randomUUID(); // Valid UUID for Database Record
    const joinedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    let idDocumentUrl: string | null = null;

    const dbClient = supabaseAdmin || supabase;

    // 0. Check for existing duplicate email or mobile number in public.profiles table
    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    try {
      const { data: existingUsers } = await dbClient
        .from('profiles')
        .select('email, mobile');

      if (Array.isArray(existingUsers)) {
        for (const u of existingUsers) {
          if (u.email?.toLowerCase() === cleanEmail) {
            return NextResponse.json(
              { success: false, error: '❌ Email Already Registered: An account with this email address already exists. Please log in.' },
              { status: 400 }
            );
          }
          if (u.mobile === cleanMobile) {
            return NextResponse.json(
              { success: false, error: '❌ Mobile Number Already Registered: This mobile number is already linked to an existing member.' },
              { status: 400 }
            );
          }
        }
      }
    } catch (checkErr) {
      console.warn('Duplicate check notice:', checkErr);
    }

    // 1. Attempt Supabase Auth Registration
    try {
      let authData: any = null;
      let authError: any = null;

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: email.trim(),
        password,
        email_confirm: true,
        user_metadata: {
          fullName,
          mobile,
          memberId,
          idDocumentUrl,
        },
      }).catch(() => ({ data: null, error: null }));

      authData = data;
      authError = error;

      if (!authData?.user) {
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              fullName,
              mobile,
              memberId,
              idDocumentUrl,
            },
          },
        });
        if (signUpData?.user) {
          authData = signUpData;
        }
      }

      if (authData?.user?.id) {
        userId = authData.user.id;
      }
    } catch (authErr: any) {
      console.warn('Supabase Auth Exception:', authErr?.message || authErr);
    }

    // 3. Insert User Profile into Supabase profiles table
    try {
      const profileRecord = {
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
        id_document_url: idDocumentUrl,
        address: userAddress,
      };

      let { error: insertErr } = await dbClient.from('profiles').insert([profileRecord]);

      if (insertErr) {
        console.warn('Primary DB Insert Notice, retrying with fallback client:', insertErr.message);
        const { error: fallbackErr } = await supabase.from('profiles').insert([profileRecord]);
        if (fallbackErr) {
          console.error('Fallback DB Insert Error:', fallbackErr.message);
        }
      }

      if (referralCode) {
        try {
          await dbClient.from('referrals').insert([
            {
              referrer_code: referralCode,
              referred_user_id: userId,
              referred_name: fullName,
              referred_member_id: memberId,
              deposit_status: 'Not Started',
              bonus_amount: 500,
            },
          ]);
        } catch (refErr) {}
      }
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
        address: userAddress,
        accountStatus: 'Active',
        depositStatus: 'Not Started',
        rewardStatus: 'In Selection Pool',
        slotNumber: 0,
        registrationDate: joinedDate,
        referralId: referralCode || `REF-${memberId.slice(-6)}`,
        idDocumentUrl,
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
