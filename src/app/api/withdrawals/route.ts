import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const memberId = searchParams.get('memberId');

    const withdrawalsRef = collection(db, 'withdrawals');
    let q;
    if (memberId) {
      q = query(withdrawalsRef, where('memberId', '==', memberId.trim().toUpperCase()));
    } else if (userId) {
      q = query(withdrawalsRef, where('userId', '==', userId));
    }

    const snapshot = q ? await getDocs(q) : await getDocs(withdrawalsRef);
    const withdrawals: any[] = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      withdrawals.push({
        id: docSnap.id,
        ...data,
      });
    });

    return NextResponse.json({
      success: true,
      withdrawals,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch withdrawal records' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, withdrawalId, userId, memberId, memberName, amount, payoutMethod, upiId, bankAccount, ifscCode, status, adminNotes } = body;

    // Handle Admin Review Action (Approve / Reject)
    if (action === 'review' && withdrawalId) {
      const docRef = doc(db, 'withdrawals', withdrawalId);
      await updateDoc(docRef, {
        status: status || 'Approved',
        adminNotes: adminNotes || '',
        processedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        updatedAt: serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        message: `Withdrawal ${withdrawalId} status updated to ${status}.`,
      }, { status: 200 });
    }

    // Handle New Withdrawal Request Submission
    if (!memberId || !amount || amount < 500) {
      return NextResponse.json(
        { success: false, error: 'Minimum withdrawal amount is ₹500 and member details are required.' },
        { status: 400 }
      );
    }

    const newWithdrawalDoc = await addDoc(collection(db, 'withdrawals'), {
      userId: userId || null,
      memberId: memberId.trim().toUpperCase(),
      memberName: memberName || 'Member User',
      amount: Number(amount),
      payoutMethod: payoutMethod || 'UPI',
      upiId: upiId || '',
      bankAccount: bankAccount || '',
      ifscCode: ifscCode || '',
      status: 'Pending',
      requestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully.',
      withdrawal: {
        id: newWithdrawalDoc.id,
        userId,
        memberId,
        memberName,
        amount: Number(amount),
        payoutMethod,
        upiId,
        bankAccount,
        ifscCode,
        status: 'Pending',
        requestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process withdrawal request' },
      { status: 500 }
    );
  }
}
