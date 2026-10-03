import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';

import { ensureRecruitingBatchExists } from '../groups/route';

function sanitizeForFirestore(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned;
  }
  return obj;
}

const simulatedNames = [
  'Anitha Murugan', 'Venkatesh Raman', 'Meena Kumari', 'Pravin Kumar', 
  'Senthil Nathan', 'Deepa Lakshmi', 'Ganesh Kumar', 'Kavitha Sundaram',
  'Ramesh Babu', 'Shalini Devi', 'Vijay Anand', 'Priya Dharshini',
  'Karthik Raja', 'Revathi Sekar', 'Saravanan Perumal', 'Divya Bharathi',
  'Manikandan K', 'Nandhini R', 'Arun Prakash', 'Gayathri M',
  'Ashok Kumar', 'Sowmya N', 'Balaji Prasad', 'Malini S',
  'Dinesh Karthik', 'Suganya P', 'Aravind Swamy', 'Bhavani K',
  'Gopinath V', 'Hemalatha T', 'Ilango K', 'Jayashree N',
  'Krishnan M', 'Latha R', 'Mohan Raj', 'Nirmala S',
  'Pradeep V', 'Radhika K', 'Sathish Kumar', 'Uma Maheshwari',
  'Vikram Seth', 'Yamuna K', 'Zahir Hussain', 'Chitra S',
  'Elango M', 'Farooq Ahmed', 'Gita Raman', 'Hari Haran'
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, groupId = 'GROUP-001', slotNumber, identifier, email, memberId, fullName, name, mobile } = body;
    const targetGroupId = (groupId || 'GROUP-001').toUpperCase();

    const groupRef = doc(db, 'groups', targetGroupId);
    const groupSnap = await getDoc(groupRef);

    let groupData = groupSnap.exists() ? groupSnap.data() : null;
    let slots = Array.isArray(groupData?.slots) && groupData.slots.length === 50
      ? [...groupData.slots]
      : Array.from({ length: 50 }, (_, i) => ({
          slotNumber: i + 1,
          memberId: '—',
          memberName: '—',
          status: 'Available',
          joinedDate: '-',
          wonDay: null,
          wonDate: null,
          depositStatus: 'Not Started'
        }));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // 1. AUTOFILL SLOTS FOR BATCH
    if (action === 'autofill') {
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      const existingUsers: any[] = [];
      usersSnap.forEach(d => existingUsers.push({ id: d.id, ...d.data() }));

      const isBot = (u: any) => {
        if (u.isSimulated === true || u.userType === 'simulated') return true;
        if (typeof u.role === 'string' && u.role.toLowerCase() === 'bot') return true;
        if (typeof u.name === 'string' && u.name.toUpperCase().includes('BOT')) return true;
        if (typeof u.fullName === 'string' && u.fullName.toUpperCase().includes('BOT')) return true;
        if (typeof u.email === 'string' && (u.email.endsWith('@infinitygram.net') || u.email.includes('bot'))) return true;
        return false;
      };

      const existingBots = existingUsers.filter(isBot);
      let botIdx = 0;
      let filledCount = 0;

      for (let i = 0; i < 50; i++) {
        const slot = slots[i];
        if (slot.status === 'Available' || slot.memberId === '—' || !slot.memberId) {
          let botName = '';
          let botMemberId = '';
          let botEmail = '';
          let botMobile = '';
          let botDocId = '';

          if (botIdx < existingBots.length) {
            const b = existingBots[botIdx];
            botName = b.name || b.fullName || `Member #${i + 1}`;
            botMemberId = b.memberId || `LOP-${String(100000 + i + 1).padStart(6, '0')}`;
            botEmail = b.email || `bot${i + 1}@infinitygram.net`;
            botMobile = b.mobile || `+91 ${Math.floor(60000 + Math.random() * 39999)} ${Math.floor(10000 + Math.random() * 89999)}`;
            botDocId = b.id;
          } else {
            const rawName = simulatedNames[(i) % simulatedNames.length];
            botName = rawName;
            botMemberId = `LOP-${Math.floor(100000 + Math.random() * 900000)}`;
            botEmail = `${rawName.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(10 + Math.random() * 90)}@gmail.com`;
            botMobile = `+91 ${Math.floor(60000 + Math.random() * 39999)} ${Math.floor(10000 + Math.random() * 89999)}`;
            
            const newBotRef = doc(collection(db, 'users'));
            botDocId = newBotRef.id;
            await setDoc(newBotRef, sanitizeForFirestore({
              uid: botDocId,
              fullName: botName,
              name: botName,
              email: botEmail,
              mobile: botMobile,
              memberId: botMemberId,
              accountStatus: 'Active',
              depositStatus: 'Verified',
              rewardStatus: 'In Selection Pool',
              group: targetGroupId,
              groupId: targetGroupId,
              slotNumber: i + 1,
              allocatedSlots: [{
                group: targetGroupId,
                groupId: targetGroupId,
                slotNumber: i + 1,
                slot: `#${i + 1}`,
                joinedDate: dateStr,
                depositStatus: 'Verified',
              }],
              assignedSlots: [i + 1],
              isSimulated: true,
              userType: 'simulated',
              joinedDate: dateStr,
              emailVerified: true,
              createdAt: serverTimestamp(),
            }));
          }

          slots[i] = {
            slotNumber: i + 1,
            memberId: botMemberId,
            memberName: botName,
            status: 'Occupied',
            joinedDate: dateStr,
            wonDay: null,
            wonDate: null,
            depositStatus: 'Verified',
          };

          botIdx++;
          filledCount++;
        }
      }

      const occupiedCount = slots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
      const wonCount = slots.filter(s => s.status === 'Won 1g Gold').length;

      const updatedGroup = {
        groupId: targetGroupId,
        groupName: groupData?.groupName || `InfinityGram 50 Gold Club - ${targetGroupId}`,
        status: wonCount > 0 ? 'active' : (occupiedCount >= 50 ? 'ready' : (groupData?.status || 'recruiting')),
        createdDate: groupData?.createdDate || dateStr,
        totalMembers: occupiedCount,
        filledMembers: occupiedCount,
        currentCycleDay: groupData?.currentCycleDay || 0,
        totalGoldDistributedGrams: wonCount,
        activePoolCount: Math.max(0, occupiedCount - wonCount),
        scheduledTime: groupData?.scheduledTime || '07:00 AM IST',
        startDate: groupData?.startDate || '',
        slots: slots,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(groupRef, sanitizeForFirestore(updatedGroup));

      // Auto-create next batch (e.g. GROUP-003) if this batch is now full/active
      await ensureRecruitingBatchExists();

      return NextResponse.json({
        success: true,
        message: `Successfully auto-filled ${filledCount} slots in ${targetGroupId}! Group is now 50/50 Full. Next recruiting batch is ready.`,
        group: updatedGroup,
      }, { status: 200 });
    }

    // 2. ASSIGN INDIVIDUAL SLOT
    if (action === 'assign_slot') {
      const slotIdx = Number(slotNumber) - 1;
      if (slotIdx < 0 || slotIdx >= 50) {
        return NextResponse.json({ success: false, error: 'Invalid slot number (1-50 required)' }, { status: 400 });
      }

      const resolvedName = fullName || name || email || `Member #${slotNumber}`;
      const resolvedMemberId = memberId || `LOP-${Math.floor(100000 + Math.random() * 900000)}`;

      slots[slotIdx] = {
        slotNumber: Number(slotNumber),
        memberId: resolvedMemberId,
        memberName: resolvedName,
        status: 'Occupied',
        joinedDate: dateStr,
        wonDay: null,
        wonDate: null,
        depositStatus: 'Verified',
      };

      const occupiedCount = slots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
      const wonCount = slots.filter(s => s.status === 'Won 1g Gold').length;

      const updatedGroup = {
        groupId: targetGroupId,
        groupName: groupData?.groupName || `InfinityGram 50 Gold Club - ${targetGroupId}`,
        status: wonCount > 0 ? 'active' : (occupiedCount >= 50 ? 'ready' : (groupData?.status || 'recruiting')),
        createdDate: groupData?.createdDate || dateStr,
        totalMembers: occupiedCount,
        filledMembers: occupiedCount,
        currentCycleDay: groupData?.currentCycleDay || 0,
        totalGoldDistributedGrams: wonCount,
        activePoolCount: Math.max(0, occupiedCount - wonCount),
        scheduledTime: groupData?.scheduledTime || '07:00 AM IST',
        startDate: groupData?.startDate || '',
        slots: slots,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(groupRef, sanitizeForFirestore(updatedGroup));

      // Auto-create next batch if this batch is now 50/50 full
      if (occupiedCount >= 50) {
        await ensureRecruitingBatchExists();
      }

      return NextResponse.json({
        success: true,
        message: `Slot #${slotNumber} assigned to ${resolvedName} in ${targetGroupId}.`,
        group: updatedGroup,
      }, { status: 200 });
    }

    // 3. UNASSIGN INDIVIDUAL SLOT
    if (action === 'unassign_slot') {
      const slotIdx = Number(slotNumber) - 1;
      if (slotIdx < 0 || slotIdx >= 50) {
        return NextResponse.json({ success: false, error: 'Invalid slot number (1-50 required)' }, { status: 400 });
      }

      slots[slotIdx] = {
        slotNumber: Number(slotNumber),
        memberId: '—',
        memberName: '—',
        status: 'Available',
        joinedDate: '-',
        wonDay: null,
        wonDate: null,
        depositStatus: 'Not Started',
      };

      const occupiedCount = slots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
      const wonCount = slots.filter(s => s.status === 'Won 1g Gold').length;

      const updatedGroup = {
        groupId: targetGroupId,
        groupName: groupData?.groupName || `InfinityGram 50 Gold Club - ${targetGroupId}`,
        status: wonCount > 0 ? 'active' : (occupiedCount >= 50 ? 'ready' : 'recruiting'),
        createdDate: groupData?.createdDate || dateStr,
        totalMembers: occupiedCount,
        filledMembers: occupiedCount,
        currentCycleDay: groupData?.currentCycleDay || 0,
        totalGoldDistributedGrams: wonCount,
        activePoolCount: Math.max(0, occupiedCount - wonCount),
        scheduledTime: groupData?.scheduledTime || '07:00 AM IST',
        startDate: groupData?.startDate || '',
        slots: slots,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(groupRef, sanitizeForFirestore(updatedGroup));

      return NextResponse.json({
        success: true,
        message: `Slot #${slotNumber} unassigned in ${targetGroupId}.`,
        group: updatedGroup,
      }, { status: 200 });
    }

    // 4. RESET WINNER STATUS BACK TO "IN SELECTION POOL"
    if (action === 'reset_winner_status') {
      const slotIdx = Number(slotNumber) - 1;
      if (slotIdx < 0 || slotIdx >= 50) {
        return NextResponse.json({ success: false, error: 'Invalid slot number (1-50 required)' }, { status: 400 });
      }

      const existingSlot = slots[slotIdx];
      slots[slotIdx] = {
        ...existingSlot,
        status: 'Occupied',
        wonDay: null,
        wonDate: null,
      };

      // 1. Remove any winner entries from Firestore 'winners' collection
      try {
        const winnersRef = collection(db, 'winners');
        const snap = await getDocs(winnersRef);
        for (const docSnap of snap.docs) {
          const w = docSnap.data();
          const wBatch = (w.batchId || w.group || w.groupId || '').toUpperCase();
          if (wBatch === targetGroupId && (Number(w.slotNumber) === Number(slotNumber) || (w.winnerMemberId && existingSlot.memberId && w.winnerMemberId === existingSlot.memberId))) {
            await deleteDoc(doc(db, 'winners', docSnap.id));
          }
        }
      } catch (e) {
        console.warn('Could not delete winners document:', e);
      }

      // 2. Update user profile rewardStatus in 'users' collection
      try {
        const usersRef = collection(db, 'users');
        const uSnap = await getDocs(usersRef);
        for (const uDoc of uSnap.docs) {
          const u = uDoc.data();
          const uGroup = (u.group || u.groupId || '').toUpperCase();
          const isMatch = (uGroup === targetGroupId || !uGroup) && (
            (existingSlot.memberId && u.memberId === existingSlot.memberId) ||
            (existingSlot.memberName && (u.name === existingSlot.memberName || u.fullName === existingSlot.memberName)) ||
            (u.slotNumber && Number(u.slotNumber) === Number(slotNumber))
          );

          if (isMatch) {
            await updateDoc(doc(db, 'users', uDoc.id), sanitizeForFirestore({
              rewardStatus: 'In Selection Pool',
              status: 'Active',
              wonDay: null,
              wonDate: null,
              wonBatch: null,
              wonReward: null,
            }));
          }
        }
      } catch (e) {
        console.warn('Could not update user reward status:', e);
      }

      const occupiedCount = slots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
      const wonCount = slots.filter(s => s.status === 'Won 1g Gold').length;

      const updatedGroup = {
        groupId: targetGroupId,
        groupName: groupData?.groupName || `InfinityGram 50 Gold Club - ${targetGroupId}`,
        status: groupData?.status || 'recruiting',
        createdDate: groupData?.createdDate || dateStr,
        totalMembers: occupiedCount,
        filledMembers: occupiedCount,
        currentCycleDay: Math.max(0, wonCount),
        totalGoldDistributedGrams: wonCount,
        activePoolCount: Math.max(0, occupiedCount - wonCount),
        scheduledTime: groupData?.scheduledTime || '07:00 AM IST',
        startDate: groupData?.startDate || '',
        slots: slots,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(groupRef, sanitizeForFirestore(updatedGroup));

      return NextResponse.json({
        success: true,
        message: `Slot #${slotNumber} (${existingSlot.memberName || 'Member'}) reset to "In Selection Pool" successfully!`,
        group: updatedGroup,
      }, { status: 200 });
    }

    return NextResponse.json({ success: false, error: 'Unrecognized slot action' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in /api/admin/slots:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to process slot action' }, { status: 500 });
  }
}
