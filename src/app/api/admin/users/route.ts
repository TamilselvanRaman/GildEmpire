import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, query, where, arrayUnion, addDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const formattedUsers: any[] = [];
    
    snapshot.forEach((docSnap) => {
      const u = docSnap.data();
      const resolvedMemberId = u.memberId || `LOP-${Math.floor(100000 + Math.random() * 900000)}`;
      const isDepositVerified = u.depositStatus === 'Verified';
      
      formattedUsers.push({
        id: docSnap.id || u.uid,
        memberId: resolvedMemberId,
        name: u.fullName || (u.email ? u.email.split('@')[0] : 'Member User'),
        mobile: u.mobile || '+91 98765 43210',
        email: u.email || '',
        regDate: u.joinedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        deposit: u.depositStatus || 'Not Started',
        deposits: Array.isArray(u.deposits) ? u.deposits : (isDepositVerified ? [{
          amount: 10000,
          date: u.joinedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: '10:00 AM IST',
          paymentMethod: 'UPI / Admin Verification',
          referenceId: `DEP-${resolvedMemberId}`,
          status: 'Verified',
        }] : []),
        group: u.group || 'Not Assigned Yet',
        slot: u.slotNumber ? `#${u.slotNumber}` : 'Not Assigned Yet',
        status: u.accountStatus || 'Active',
        emailVerified: Boolean(u.emailVerified),
        role: u.role || 'Member',
        idDocumentUrl: u.idDocumentUrl || null,
        address: u.address || 'Flat 402, Royal Sovereign Heights, Bandra West, Mumbai, Maharashtra 400050',
        referralCode: u.referralCode || `REF-${resolvedMemberId.replace('LOP-', '')}`,
        referredBy: u.referredBy || 'Direct Registration',
        utr: u.utr || (isDepositVerified ? `UPI-98234120${Math.floor(1000 + Math.random() * 9000)}` : 'Pending UTR Submission'),
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

    const isVerifiedAction = (depositStatus === 'Verified');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const depRefId = `DEP-${cleanMemberId || docIdToUpdate || 'MB'}-${Date.now().toString().slice(-6)}`;

    const newDepositEntry = {
      amount: 10000,
      date: dateStr,
      time: timeStr,
      paymentMethod: 'UPI / Admin Verification',
      referenceId: depRefId,
      status: 'Verified',
    };

    const updateFields: any = {
      depositStatus: depositStatus || 'Verified',
      accountStatus: 'Active',
      slotNumber: parsedSlot,
      group: groupId || 'GROUP-001',
    };

    if (isVerifiedAction) {
      updateFields.deposits = arrayUnion(newDepositEntry);
    }

    if (emailVerified !== undefined) {
      updateFields.emailVerified = Boolean(emailVerified);
    }

    await updateDoc(userDocRef, updateFields);

    // If verifying deposit, update matching referral document & credit referrer bonus in Firestore
    if (isVerifiedAction) {
      try {
        const uSnap = await getDoc(userDocRef);
        const userData = uSnap.exists() ? uSnap.data() : {};
        const referredByCode = userData.referredBy || null;
        const referredMemberIdStr = userData.memberId || cleanMemberId || 'LOP-MEMBER';
        const referredNameStr = userData.fullName || cleanEmail || 'Referred Member';

        // 1. Update matching referral document in 'referrals' collection
        const referralsRef = collection(db, 'referrals');
        let qRef;
        if (cleanMemberId) {
          qRef = query(referralsRef, where('referredMemberId', '==', cleanMemberId));
        } else if (docIdToUpdate) {
          qRef = query(referralsRef, where('referredUserId', '==', docIdToUpdate));
        }
        if (qRef) {
          const refSnap = await getDocs(qRef);
          for (const rDoc of refSnap.docs) {
            await updateDoc(doc(db, 'referrals', rDoc.id), {
              depositStatus: 'Verified',
              bonusAmount: 500,
              updatedAt: serverTimestamp(),
            });
          }
        }

        // 2. Find Referrer user document by referredBy code and append referral bonus entry!
        if (referredByCode) {
          const cleanRefCode = String(referredByCode).trim().toUpperCase();
          const cleanMemberCode = cleanRefCode.replace(/^REF-/i, 'LOP-');
          const usersRef = collection(db, 'users');
          
          let qReferrer = query(usersRef, where('referralCode', '==', cleanRefCode));
          let referrerSnap = await getDocs(qReferrer);

          if (referrerSnap.empty) {
            qReferrer = query(usersRef, where('memberId', '==', cleanMemberCode));
            referrerSnap = await getDocs(qReferrer);
          }

          if (!referrerSnap.empty) {
            const referrerDoc = referrerSnap.docs[0];
            const referrerDocRef = doc(db, 'users', referrerDoc.id);

            const bonusRecord = {
              referredName: referredNameStr,
              referredMemberId: referredMemberIdStr,
              depositAmount: 10000,
              bonusAmount: 500,
              slotNumber: parsedSlot || 1,
              date: dateStr,
              time: timeStr,
              status: 'Verified',
            };

            await updateDoc(referrerDocRef, {
              referralBonuses: arrayUnion(bonusRecord),
            });
          }
        }
      } catch (rErr) {
        console.warn('Error updating referrer bonus in Firestore:', rErr);
      }

      // Add to deposits collection as well
      try {
        await addDoc(collection(db, 'deposits'), {
          userId: docIdToUpdate,
          memberId: cleanMemberId || 'LOP-MEMBER',
          memberName: cleanEmail || 'Member User',
          amount: 10000,
          paymentMethod: 'UPI / Admin Verification',
          referenceId: depRefId,
          status: 'Verified',
          transactionDate: `${dateStr} ${timeStr}`,
          createdAt: serverTimestamp(),
        });
      } catch (dErr) {
        console.warn('Error inserting into deposits collection:', dErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `User deposit status updated to ${depositStatus || 'Verified'} and assigned to slot #${parsedSlot || 1} in ${groupId || 'GROUP-001'}.`,
      depositRecord: newDepositEntry,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update user in Firestore' },
      { status: 500 }
    );
  }
}
