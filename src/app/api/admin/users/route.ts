import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../../lib/supabaseClient';

export async function GET() {
  try {
    const dbClient = supabaseAdmin || supabase;
    
    // 1. Fetch profiles table records
    let profiles: any[] = [];
    try {
      const { data } = await dbClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) profiles = data;
    } catch (e) {}

    // 2. Fetch auth.users records using admin API
    let authUsers: any[] = [];
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
      if (authData?.users) {
        authUsers = authData.users;
      }
    } catch (authErr) {}

    const profileList = profiles || [];
    const profileMap = new Map<string, any>();

    profileList.forEach((p: any) => {
      if (p.email) profileMap.set(p.email.toLowerCase(), p);
      if (p.id) profileMap.set(p.id, p);
    });

    const userMap = new Map<string, any>();

    // Process Auth Users first
    authUsers.forEach((u: any, idx: number) => {
      const emailKey = u.email ? u.email.toLowerCase() : '';
      const meta = u.user_metadata || {};
      const p = profileMap.get(emailKey) || profileMap.get(u.id) || {};

      const candidateName = meta.fullName || meta.full_name || meta.name || (p.full_name && p.full_name !== 'Original User' ? p.full_name : null) || (u.email ? u.email.split('@')[0] : 'Member User');

      const userObj = {
        id: u.id,
        memberId: p.member_id || meta.memberId || `LOP-${501928 + idx}`,
        name: candidateName,
        mobile: p.mobile || meta.mobile || '+91 98765 43210',
        email: u.email || p.email || 'user@infinitygram.in',
        regDate: p.joined_date || new Date(u.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        deposit: p.deposit_status || 'Verified',
        group: 'GROUP-001',
        slot: `#${idx + 1}`,
        status: p.account_status || 'Active',
        role: 'Member',
        idDocumentUrl: p.id_document_url || meta.idDocumentUrl || null,
        avatar: p.avatar || `https://images.unsplash.com/photo-${1534528741775 + (idx % 10)}?auto=format&fit=crop&q=80&w=250`,
      };

      userMap.set(emailKey || u.id, userObj);
    });

    // Add any remaining Profile records not in authUsers
    profileList.forEach((p: any, idx: number) => {
      const emailKey = p.email ? p.email.toLowerCase() : p.id;
      if (!userMap.has(emailKey)) {
        userMap.set(emailKey, {
          id: p.id || `usr_${idx + 1}`,
          memberId: p.member_id || `LOP-${501928 + idx}`,
          name: (p.full_name && p.full_name !== 'Original User') ? p.full_name : (p.email ? p.email.split('@')[0] : 'Member User'),
          mobile: p.mobile || '+91 98765 43210',
          email: p.email,
          regDate: p.joined_date || new Date(p.created_at || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          deposit: p.deposit_status || 'Verified',
          group: 'GROUP-001',
          slot: `#${idx + 1}`,
          status: p.account_status || 'Active',
          role: 'Member',
          idDocumentUrl: p.id_document_url || null,
          avatar: p.avatar || `https://images.unsplash.com/photo-${1534528741775 + (idx % 10)}?auto=format&fit=crop&q=80&w=250`,
        });
      }
    });

    const formattedUsers = Array.from(userMap.values());

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
