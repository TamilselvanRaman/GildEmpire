import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, memberId, memberName, amount, paymentMethod, referenceId, proofUrl } = body;

    if (!userId || !amount || !paymentMethod || !referenceId) {
      return NextResponse.json(
        { success: false, error: 'User ID, amount, payment method, and reference ID are required.' },
        { status: 400 }
      );
    }

    const transactionDate = new Date().toLocaleString('en-IN') + ' IST';

    // 1. Insert deposit transaction into Firestore 'deposits' collection
    const depDocRef = await addDoc(collection(db, 'deposits'), {
      userId,
      memberId: memberId || 'LOP-MEMBER',
      memberName: memberName || 'Member User',
      amount: Number(amount),
      paymentMethod,
      referenceId,
      proofUrl: proofUrl || null,
      status: 'Verified',
      transactionDate,
      createdAt: serverTimestamp(),
    });

    // 2. Update user document depositStatus to 'Verified'
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        depositStatus: 'Verified',
        accountStatus: 'Active',
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Deposit payment reference submitted successfully to Firebase.',
      deposit: {
        id: depDocRef.id,
        userId,
        memberId,
        memberName,
        amount,
        paymentMethod,
        referenceId,
        status: 'Verified',
        transactionDate,
      },
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit deposit payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID parameter is required.' },
        { status: 400 }
      );
    }

    const depositsRef = collection(db, 'deposits');
    const q = query(depositsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const deposits: any[] = [];
    snapshot.forEach(docSnap => {
      deposits.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    return NextResponse.json({
      success: true,
      deposits,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch deposit transactions' },
      { status: 500 }
    );
  }
}
