import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required.' },
        { status: 400 }
      );
    }

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return NextResponse.json({
        success: true,
        profile: null,
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: userDocSnap.id,
        ...userDocSnap.data(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve profile from Firebase' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, fullName, mobile, address } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required for profile updates.' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (fullName) updates.fullName = fullName;
    if (mobile) updates.mobile = mobile;
    if (address) updates.address = address;

    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updates);

    const updatedSnap = await getDoc(userDocRef);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully in Firebase',
      profile: {
        id: updatedSnap.id,
        ...updatedSnap.data(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update profile in Firebase' },
      { status: 500 }
    );
  }
}
