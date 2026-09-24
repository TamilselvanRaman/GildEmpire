import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore';

export async function GET() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const formattedUsers: any[] = [];
    
    snapshot.forEach((docSnap) => {
      const u = docSnap.data();
      const resolvedMemberId = u.memberId || `LOP-${Math.floor(100000 + Math.random() * 900000)}`;
      
      formattedUsers.push({
        id: docSnap.id || u.uid,
        memberId: resolvedMemberId,
        name: u.fullName || (u.email ? u.email.split('@')[0] : 'Member User'),
        mobile: u.mobile || '+91 98765 43210',
        email: u.email || '',
        regDate: u.joinedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        deposit: u.depositStatus || 'Not Started',
        group: u.group || 'Not Assigned Yet',
        slot: u.slotNumber ? `#${u.slotNumber}` : 'Not Assigned Yet',
        status: u.accountStatus || 'Active',
        emailVerified: Boolean(u.emailVerified),
        role: u.role || 'Member',
        idDocumentUrl: u.idDocumentUrl || null,
        address: u.address || 'Flat 402, Royal Sovereign Heights, Bandra West, Mumbai, Maharashtra 400050',
        referralCode: u.referralCode || `REF-${resolvedMemberId.replace('LOP-', '')}`,
        referredBy: u.referredBy || 'Direct Registration',
        utr: u.utr || (u.depositStatus === 'Verified' ? `UPI-98234120${Math.floor(1000 + Math.random() * 9000)}` : 'Pending UTR Submission'),
        avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      });
    });

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      memberId, 
      userId, 
      depositStatus = 'Verified', 
      slotNumber, 
      groupId = 'GROUP-001',
      action,
      emailVerified 
    } = body;

    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanMemberId = memberId ? memberId.trim() : null;

    // Find doc ID in Firestore
    let docIdToUpdate: string | null = userId || null;

    if (!docIdToUpdate && (cleanEmail || cleanMemberId)) {
      const usersRef = collection(db, 'users');
      const q = cleanEmail 
        ? query(usersRef, where('email', '==', cleanEmail))
        : query(usersRef, where('memberId', '==', cleanMemberId));
      
      const snap = await getDocs(q);
      if (!snap.empty) {
        docIdToUpdate = snap.docs[0].id;
      }
    }

    if (!docIdToUpdate) {
      return NextResponse.json(
        { success: false, error: 'User document not found in Firestore.' },
        { status: 404 }
      );
    }

    const userDocRef = doc(db, 'users', docIdToUpdate);

    if (action === 'verify_email' || emailVerified === true) {
      await updateDoc(userDocRef, { emailVerified: true });
      return NextResponse.json({
        success: true,
        message: 'User email verified successfully.',
      }, { status: 200 });
    }

    if (action === 'unassign_slot' || action === 'delete_slot') {
      await updateDoc(userDocRef, {
        slotNumber: 0,
        group: 'Not Assigned Yet',
        depositStatus: 'Not Started',
      });
      return NextResponse.json({
        success: true,
        message: 'Slot assignment removed successfully.',
      }, { status: 200 });
    }

    const parsedSlot = typeof slotNumber === 'number'
      ? slotNumber
      : (parseInt(String(slotNumber || '').replace(/[^0-9]/g, ''), 10) || 0);

    const updateFields: any = {
      depositStatus: depositStatus || 'Verified',
      accountStatus: 'Active',
      slotNumber: parsedSlot,
      group: groupId || 'GROUP-001',
    };

    if (emailVerified !== undefined) {
      updateFields.emailVerified = Boolean(emailVerified);
    }

    await updateDoc(userDocRef, updateFields);

    return NextResponse.json({
      success: true,
      message: `User deposit status updated to ${depositStatus || 'Verified'} and assigned to slot #${parsedSlot || 1} in ${groupId || 'GROUP-001'}.`,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update user in Firestore' },
      { status: 500 }
    );
  }
}
