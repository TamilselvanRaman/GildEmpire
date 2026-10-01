import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

export async function GET() {
  try {
    const liveDocRef = doc(db, 'system_state', 'live_draw');
    const liveSnap = await getDoc(liveDocRef);

    if (liveSnap.exists()) {
      return NextResponse.json({
        success: true,
        liveDraw: liveSnap.data(),
      });
    }

    return NextResponse.json({
      success: true,
      liveDraw: {
        status: 'idle',
        batchId: 'GROUP-001',
        winner: null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch live draw state' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      action = 'start_draw', 
      batchId = 'GROUP-001', 
      targetSlotNumber, 
      winnerDetails 
    } = body;

    const liveDocRef = doc(db, 'system_state', 'live_draw');

    if (action === 'start_draw') {
      const drawPayload = {
        batchId,
        status: 'shaking',
        targetSlotNumber: targetSlotNumber || 1,
        winner: winnerDetails || null,
        startedAt: Date.now(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(liveDocRef, drawPayload);

      return NextResponse.json({
        success: true,
        message: 'Live 3D bottle draw triggered',
        liveDraw: drawPayload,
      });
    }

    if (action === 'complete_draw') {
      const cycleDay = winnerDetails?.cycleDay || winnerDetails?.dayNumber || 1;
      const wonDateStr = winnerDetails?.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const targetSlot = targetSlotNumber || winnerDetails?.slotNumber || 1;

      const completedPayload = {
        batchId,
        status: 'revealed',
        targetSlotNumber: targetSlot,
        winner: {
          ...winnerDetails,
          cycleDay,
          dayNumber: cycleDay,
          date: wonDateStr,
        },
        completedAt: Date.now(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(liveDocRef, completedPayload);

      // 1. Save winner record in 'winners' collection in Firestore
      try {
        const winnersRef = collection(db, 'winners');
        await addDoc(winnersRef, {
          ...winnerDetails,
          batchId,
          slotNumber: targetSlot,
          cycleDay,
          dayNumber: cycleDay,
          wonAt: new Date().toISOString(),
          date: wonDateStr,
          status: 'Verified & Shipped',
        });
      } catch (wErr) {
        console.error('Error recording in winners collection:', wErr);
      }

      // 2. Update user record in 'users' collection in Firestore
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        usersSnap.forEach(async (uDoc) => {
          const uData = uDoc.data();
          const matchesMemberId = winnerDetails?.memberId && uData.memberId === winnerDetails.memberId;
          const matchesEmail = winnerDetails?.email && uData.email === winnerDetails.email;
          const matchesSlot = (uData.groupId === batchId || uData.group === batchId) && Number(uData.slotNumber) === Number(targetSlot);

          if (matchesMemberId || matchesEmail || matchesSlot) {
            await updateDoc(doc(db, 'users', uDoc.id), {
              rewardStatus: 'Won 1g Gold',
              wonDay: cycleDay,
              wonDate: wonDateStr,
              wonBatch: batchId,
              status: 'Won 1g Gold',
            });
          }
        });
      } catch (uErr) {
        console.error('Error updating winner user document:', uErr);
      }

      // 3. Update group document in 'groups' collection in Firestore
      try {
        const groupDocRef = doc(db, 'groups', batchId);
        const groupSnap = await getDoc(groupDocRef);
        if (groupSnap.exists()) {
          const gData = groupSnap.data();
          const slots = Array.isArray(gData.slots) ? [...gData.slots] : [];
          const slotIdx = slots.findIndex(s => s.slotNumber === targetSlot);
          if (slotIdx >= 0) {
            slots[slotIdx] = {
              ...slots[slotIdx],
              status: 'Won 1g Gold',
              wonDay: cycleDay,
              wonDate: wonDateStr,
            };
          }
          const wonCount = slots.filter(s => s.status === 'Won 1g Gold').length;
          await updateDoc(groupDocRef, {
            slots,
            currentCycleDay: Math.min(50, wonCount + 1),
            totalGoldDistributedGrams: wonCount,
            status: 'active',
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (gErr) {
        console.error('Error updating group document in Firestore:', gErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Draw completed and winner revealed across database',
        liveDraw: completedPayload,
      });
    }

    if (action === 'reset_draw') {
      const resetPayload = {
        batchId,
        status: 'idle',
        winner: null,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(liveDocRef, resetPayload);

      return NextResponse.json({
        success: true,
        message: 'Live draw reset to idle',
        liveDraw: resetPayload,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process draw action' },
      { status: 500 }
    );
  }
}