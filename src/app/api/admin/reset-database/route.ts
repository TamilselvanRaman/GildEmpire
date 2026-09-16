import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const dbClient = supabaseAdmin;

    if (!dbClient) {
      return NextResponse.json(
        { success: false, error: 'Supabase Admin Client unavailable' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { confirmKey } = body;

    // Optional confirmation protection
    if (confirmKey !== 'WIPE_ALL_DATA_CONFIRM') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid confirmation key. Pass { confirmKey: "WIPE_ALL_DATA_CONFIRM" } to wipe all data.' 
        },
        { status: 400 }
      );
    }

    const deletionResults: Record<string, any> = {};

    // 1. Delete all records from public.deposits
    const { error: depositsErr } = await dbClient.from('deposits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    deletionResults.deposits = depositsErr ? depositsErr.message : 'Cleared';

    // 2. Delete all records from public.referrals
    const { error: referralsErr } = await dbClient.from('referrals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    deletionResults.referrals = referralsErr ? referralsErr.message : 'Cleared';

    // 3. Delete all records from public.audit_logs
    const { error: auditErr } = await dbClient.from('audit_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    deletionResults.audit_logs = auditErr ? auditErr.message : 'Cleared';

    // 4. Delete all records from public.profiles
    const { error: profilesErr } = await dbClient.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    deletionResults.profiles = profilesErr ? profilesErr.message : 'Cleared';

    // 5. Delete storage files in 'id_documents' bucket if any
    try {
      const { data: files } = await dbClient.storage.from('id_documents').list();
      if (files && files.length > 0) {
        const filePaths = files.map((f) => f.name);
        await dbClient.storage.from('id_documents').remove(filePaths);
        deletionResults.storageFiles = `Deleted ${filePaths.length} files`;
      } else {
        deletionResults.storageFiles = 'No files to delete';
      }
    } catch (stErr: any) {
      deletionResults.storageFiles = stErr.message;
    }

    // 6. Delete all Auth Users using Supabase Admin Auth API
    try {
      const { data: authData } = await dbClient.auth.admin.listUsers();
      if (authData?.users && authData.users.length > 0) {
        let deletedCount = 0;
        for (const user of authData.users) {
          await dbClient.auth.admin.deleteUser(user.id);
          deletedCount++;
        }
        deletionResults.authUsers = `Deleted ${deletedCount} authentication users`;
      } else {
        deletionResults.authUsers = 'No authentication users found';
      }
    } catch (authErr: any) {
      deletionResults.authUsers = authErr.message;
    }

    return NextResponse.json({
      success: true,
      message: 'All database data, auth users, and storage files have been wiped successfully.',
      details: deletionResults,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to wipe database data' },
      { status: 500 }
    );
  }
}
