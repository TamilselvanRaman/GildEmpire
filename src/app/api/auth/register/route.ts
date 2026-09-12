import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../../lib/supabaseClient';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, mobile, password, referralCode, idDocumentBase64, idDocumentName } = body;

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

    const dbClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? supabaseAdmin : supabase;

    // 1. Upload Legal ID Document to Supabase Storage bucket if base64 provided
    if (idDocumentBase64) {
      try {
        const matches = idDocumentBase64.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const ext = idDocumentName ? idDocumentName.split('.').pop() : 'png';
          const filePath = `kyc/${memberId}_${Date.now()}.${ext}`;

          const { data: uploadData, error: uploadErr } = await dbClient.storage
            .from('id_documents')
            .upload(filePath, buffer, {
              contentType,
              upsert: true,
            });

          if (!uploadErr && uploadData) {
            const { data: urlData } = dbClient.storage.from('id_documents').getPublicUrl(filePath);
            if (urlData?.publicUrl) {
              idDocumentUrl = urlData.publicUrl;
            }
          }
        }
      } catch (storageErr) {
        console.warn('Supabase Storage Upload Notice:', storageErr);
      }
    }

    // 2. Attempt Supabase Auth Registration
    try {
      let authData: any = null;
      let authError: any = null;

      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
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
        });
        authData = data;
        authError = error;
      } else {
        const { data, error } = await supabase.auth.signUp({
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
        authData = data;
        authError = error;
      }

      if (authError) {
        console.warn('Supabase Auth Notice:', authError.message);
      }

      if (authData?.user?.id) {
        userId = authData.user.id;
      }
    } catch (authErr: any) {
      console.warn('Supabase Auth Exception:', authErr?.message || authErr);
    }

    // 3. Insert User Profile into Supabase profiles table
    try {
      const { error: insertErr } = await dbClient.from('profiles').insert([
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
          id_document_url: idDocumentUrl,
        },
      ]);

      if (insertErr) {
        console.warn('Supabase DB Insert Error:', insertErr.message);
      }

      if (referralCode) {
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
