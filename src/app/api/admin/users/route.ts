import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../../lib/supabaseClient';

export async function GET() {
  try {
    const dbClient = process.env.SUPABASE_SERVICE_ROLE_KEY ? supabaseAdmin : supabase;
    
    // Fetch all registered users from public.profiles table
    const { data: profiles, error } = await dbClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error && !error.message.includes('relation "profiles" does not exist')) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    const formattedUsers = (profiles && profiles.length > 0) ? profiles.map((p: any, idx: number) => ({
      id: p.id || `usr_${idx + 1}`,
      memberId: p.member_id || `LOP-${501928 + idx}`,
      name: p.full_name || 'Member User',
      mobile: p.mobile || '+91 99442 87852',
      email: p.email,
      regDate: p.joined_date || new Date(p.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      deposit: p.deposit_status || 'Verified',
      group: p.slot_number ? `GROUP-001` : 'GROUP-001',
      slot: p.slot_number ? `#${p.slot_number}` : `#${idx + 1}`,
      status: p.account_status || 'Active',
      role: 'Member',
      idDocumentUrl: p.id_document_url || null,
      avatar: p.avatar || `https://images.unsplash.com/photo-${1534528741775 + idx}?auto=format&fit=crop&q=80&w=250`,
    })) : [];

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      totalUsers: formattedUsers.length,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch registered users' },
      { status: 500 }
    );
  }
}
