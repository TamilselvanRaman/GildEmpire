import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { sendPreDrawNotificationEmail, getAppBaseUrl } from '../../../../lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { batchId = 'GROUP-001', batchName = 'InfinityGram 50 Gold Club', scheduledTime = '07:00 AM IST' } = body;

    // 1. Fetch all Firestore users
    const usersSnap = await getDocs(collection(db, 'users'));
    const allUsers: any[] = [];
    usersSnap.forEach(docSnap => {
      allUsers.push({ id: docSnap.id, ...docSnap.data() });
    });

    // 2. Identify real users who hold a slot in this specific batch
    const isRealUserInBatch = (u: any) => {
      // Exclude simulated/bot accounts
      if (u.isSimulated === true || u.userType === 'simulated') return false;
      if (typeof u.role === 'string' && u.role.toLowerCase() === 'bot') return false;
      if (typeof u.name === 'string' && u.name.toUpperCase().includes('BOT')) return false;
      if (typeof u.email === 'string' && u.email.endsWith('@infinitygram.net')) return false;
      if (!u.email || !u.email.includes('@')) return false;

      // Check if user is assigned to this batch
      if (u.groupId === batchId || u.group === batchId) return true;
      if (Array.isArray(u.allocatedSlots) && u.allocatedSlots.some((s: any) => (s.groupId === batchId || s.group === batchId))) {
        return true;
      }
      return false;
    };

    let targetRecipients = allUsers.filter(isRealUserInBatch);

    // If no real user is specifically assigned to this batch, include all real registered users so they receive the event alert
    if (targetRecipients.length === 0) {
      targetRecipients = allUsers.filter(u => {
        if (u.isSimulated === true || u.userType === 'simulated') return false;
        if (typeof u.email === 'string' && u.email.endsWith('@infinitygram.net')) return false;
        return Boolean(u.email && u.email.includes('@'));
      });
    }

    const origin = getAppBaseUrl();
    const directRewardUrl = `${origin}/rewards?batch=${encodeURIComponent(batchId)}`;

    const dispatchResults: Array<{ email: string; name: string; success: boolean; error?: string }> = [];

    for (const member of targetRecipients) {
      const email = member.email?.trim().toLowerCase();
      const name = member.name || member.fullName || 'Member';

      if (!email) continue;

      try {
        const result = await sendPreDrawNotificationEmail({
          email,
          name,
          batchName,
          batchId,
          scheduledTime,
          directRewardUrl,
        });

        dispatchResults.push({
          email,
          name,
          success: result.success,
          error: result.error,
        });
      } catch (err: any) {
        dispatchResults.push({
          email,
          name,
          success: false,
          error: err?.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      batchId,
      batchName,
      scheduledTime,
      totalRealMembers: targetRecipients.length,
      dispatchedCount: dispatchResults.filter(r => r.success).length,
      directRewardUrl,
      recipients: dispatchResults,
    }, { status: 200 });

  } catch (error: any) {
    console.error('[Send Pre-Draw Email API] Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch pre-draw email notifications' },
      { status: 500 }
    );
  }
}
