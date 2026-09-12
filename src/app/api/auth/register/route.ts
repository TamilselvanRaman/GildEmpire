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

    const dbClient = supabaseAdmin || supabase;

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
          } else if (uploadErr) {
            // Fallback upload using standard client
            const { data: uploadData2 } = await supabase.storage
              .from('id_documents')
              .upload(filePath, buffer, { contentType, upsert: true });
            if (uploadData2) {
              const { data: urlData } = supabase.storage.from('id_documents').getPublicUrl(filePath);
              if (urlData?.publicUrl) {
                idDocumentUrl = urlData.publicUrl;
              }
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
