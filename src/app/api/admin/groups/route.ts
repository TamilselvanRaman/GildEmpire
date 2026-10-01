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
} from 'firebase/firestore';

// Helper to remove any undefined fields before saving to Firestore
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

// Helper to automatically create the next batch (e.g. GROUP-003 / Batch C) when all current batches are full or active
export async function ensureRecruitingBatchExists(currentGroupsList?: any[]) {
  try {
    let groups = currentGroupsList;
    if (!groups) {
      const groupsRef = collection(db, 'groups');
      const groupsSnap = await getDocs(groupsRef);
      groups = [];
      groupsSnap.forEach(d => groups!.push({ id: d.id, groupId: d.id, ...d.data() }));
    }

    // Check if there is an open recruiting batch with available slots (< 50 members)
    const hasOpenRecruitingBatch = groups.some(g => {
      const isLiveOrActive = g.status === 'active' || g.status === 'live' || ((g.currentCycleDay ?? 0) > 0);
      const occupied = Array.isArray(g.slots) 
        ? g.slots.filter((s: any) => s.status === 'Occupied' || s.status === 'Won 1g Gold').length 
        : (g.filledMembers ?? g.totalMembers ?? 0);
      return !isLiveOrActive && occupied < 50 && (g.status === 'recruiting' || !g.status);
    });

    if (!hasOpenRecruitingBatch && groups.length > 0) {
      const existingGroupIds = groups.map(g => (g.groupId || g.id || '').toUpperCase());
      let nextNumber = 1;
      while (existingGroupIds.includes(`GROUP-${String(nextNumber).padStart(3, '0')}`)) {
        nextNumber++;
      }

      const newGroupId = `GROUP-${String(nextNumber).padStart(3, '0')}`;
      const batchLetter = String.fromCharCode(65 + ((nextNumber - 1) % 26));
      const resolvedGroupName = `InfinityGram 50 Gold Club - Batch ${batchLetter}`;

      const newSlots = Array.from({ length: 50 }, (_, i) => ({
        slotNumber: i + 1,
        memberId: '—',
        memberName: '—',
        status: 'Available',
        joinedDate: '-',
        wonDay: null,
        wonDate: null,
        depositStatus: 'Not Started'
      }));

      const newGroupData = {
        groupId: newGroupId,
        groupName: resolvedGroupName,
        status: 'recruiting',
        createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        totalMembers: 0,
        filledMembers: 0,
        currentCycleDay: 0,
        totalGoldDistributedGrams: 0,
        activePoolCount: 0,
        scheduledTime: '07:00 AM IST',
        startDate: '',
        slots: newSlots,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'groups', newGroupId), sanitizeForFirestore(newGroupData));
      return newGroupData;
    }
    return null;
  } catch (e) {
    console.error('Error in ensureRecruitingBatchExists:', e);
    return null;
  }
}

export async function GET() {
  try {
    const groupsRef = collection(db, 'groups');
    const groupsSnap = await getDocs(groupsRef);
    
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);
    const usersList: any[] = [];
    usersSnap.forEach(d => {
      usersList.push({ id: d.id, ...d.data() });
    });

    const winnersRef = collection(db, 'winners');
    const winnersSnap = await getDocs(winnersRef);
    const winnersList: any[] = [];
    winnersSnap.forEach(d => {
      winnersList.push({ id: d.id, ...d.data() });
    });

    let groups: any[] = [];

    if (groupsSnap.empty) {
      // Bootstrap Batch A (GROUP-001) ONLY in Firestore with existing users preserved
      const defaultGroupId = 'GROUP-001';
      const defaultSlots = Array.from({ length: 50 }, (_, i) => {
        const slotNumber = i + 1;
        return {
          slotNumber,
          memberId: '—',
          memberName: '—',
          status: 'Available',
          joinedDate: '-',
          wonDay: null,
          wonDate: null,
          depositStatus: 'Not Started'
        };
      });

      // Populate Batch A slots with existing users in GROUP-001
      usersList.forEach(u => {
        const userGroup = u.group || u.groupId || 'GROUP-001';
        if (userGroup === 'GROUP-001') {
          const rawSlot = u.slotNumber || (u.slot ? parseInt(String(u.slot).replace(/[^0-9]/g, ''), 10) : 0);
          if (rawSlot >= 1 && rawSlot <= 50) {
            const matchingWinner = winnersList.find(w => 
              (w.batchId === defaultGroupId || !w.batchId) &&
              (
                (w.slotNumber && Number(w.slotNumber) === rawSlot) ||
                (w.memberId && u.memberId && w.memberId === u.memberId) ||
                (w.winnerMemberId && u.memberId && w.winnerMemberId === u.memberId)
              )
            );
            const isUserWon = u.rewardStatus === 'Won 1g Gold' || u.status === 'Won 1g Gold' || Boolean(u.wonDay) || Boolean(matchingWinner);
            const wonDay = u.wonDay || matchingWinner?.cycleDay || matchingWinner?.dayNumber || null;
            const wonDate = u.wonDate || matchingWinner?.date || matchingWinner?.wonDate || null;

            defaultSlots[rawSlot - 1] = {
              slotNumber: rawSlot,
              memberId: u.memberId || u.id || `LOP-${String(rawSlot).padStart(6, '0')}`,
              memberName: u.fullName || u.name || u.email || `Member #${rawSlot}`,
              status: isUserWon ? 'Won 1g Gold' : ((u.depositStatus === 'Verified' || u.deposit === 'Verified') ? 'Occupied' : 'Pending Deposit'),
              joinedDate: u.joinedDate || u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              wonDay,
              wonDate,
              depositStatus: u.depositStatus || u.deposit || 'Verified',
            };
          }
        }
      });

      const filledSlots = defaultSlots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
      const wonSlotsCount = defaultSlots.filter(s => s.status === 'Won 1g Gold').length;
      const initialBatchA = {
        groupId: defaultGroupId,
        groupName: 'InfinityGram 50 Gold Club - Batch A',
        status: wonSlotsCount > 0 ? 'active' : (filledSlots >= 50 ? 'ready' : 'recruiting'),
        createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        totalMembers: filledSlots,
        filledMembers: filledSlots,
        currentCycleDay: wonSlotsCount > 0 ? Math.min(50, wonSlotsCount + 1) : 0,
        totalGoldDistributedGrams: wonSlotsCount,
        activePoolCount: Math.max(0, filledSlots - wonSlotsCount),
        scheduledTime: '07:00 AM IST',
        startDate: '',
        slots: defaultSlots,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'groups', defaultGroupId), sanitizeForFirestore(initialBatchA));
      groups = [initialBatchA];
    } else {
      groupsSnap.forEach(docSnap => {
        const data = docSnap.data();
        groups.push({
          id: docSnap.id,
          groupId: docSnap.id,
          ...data,
        });
      });

      // Synchronize slot occupancy in each group with current Firestore users & winners
      groups.forEach(grp => {
        const groupUsers = usersList.filter(u => (u.group === grp.groupId || u.groupId === grp.groupId));
        let grpSlots = Array.isArray(grp.slots) && grp.slots.length === 50 ? [...grp.slots] : Array.from({ length: 50 }, (_, i) => ({
          slotNumber: i + 1,
          memberId: '—',
          memberName: '—',
          status: 'Available',
          joinedDate: '-',
          wonDay: null,
          wonDate: null,
          depositStatus: 'Not Started'
        }));

        groupUsers.forEach((u: any) => {
          const rawSlot = u.slotNumber || (u.slot ? parseInt(String(u.slot).replace(/[^0-9]/g, ''), 10) : 0);
          if (rawSlot >= 1 && rawSlot <= 50) {
            const existingSlot = grpSlots[rawSlot - 1];
            const matchingWinner = winnersList.find(w => 
              (w.batchId === grp.groupId || !w.batchId || w.batchId === grp.id) &&
              (
                (w.slotNumber && Number(w.slotNumber) === rawSlot) ||
                (w.memberId && u.memberId && w.memberId === u.memberId) ||
                (w.winnerMemberId && u.memberId && w.winnerMemberId === u.memberId) ||
                (w.winnerName && u.name && w.winnerName.toLowerCase() === u.name.toLowerCase()) ||
                (w.winnerName && u.fullName && w.winnerName.toLowerCase() === u.fullName.toLowerCase())
              )
            );

            const isUserWon = existingSlot?.status === 'Won 1g Gold' || 
              u.rewardStatus === 'Won 1g Gold' || 
              u.status === 'Won 1g Gold' || 
              Boolean(u.wonDay) || 
              Boolean(matchingWinner);

            const wonDay = existingSlot?.wonDay || u.wonDay || matchingWinner?.cycleDay || matchingWinner?.dayNumber || null;
            const wonDate = existingSlot?.wonDate || u.wonDate || matchingWinner?.date || matchingWinner?.wonDate || null;

            grpSlots[rawSlot - 1] = {
              ...existingSlot,
              slotNumber: rawSlot,
              memberId: u.memberId || u.id || existingSlot?.memberId || '—',
              memberName: u.fullName || u.name || u.email || existingSlot?.memberName || '—',
              status: isUserWon ? 'Won 1g Gold' : ((u.depositStatus === 'Verified' || u.deposit === 'Verified') ? 'Occupied' : 'Pending Deposit'),
              joinedDate: u.joinedDate || u.regDate || existingSlot?.joinedDate || '-',
              wonDay,
              wonDate,
              depositStatus: u.depositStatus || u.deposit || existingSlot?.depositStatus || 'Verified',
            };
          }
        });

        // Also check if any winner in winnersList maps to this group but wasn't caught by groupUsers
        winnersList.forEach((w: any) => {
          if (w.batchId === grp.groupId || !w.batchId) {
            const slotNo = Number(w.slotNumber || 0);
            if (slotNo >= 1 && slotNo <= 50) {
              const currentSlot = grpSlots[slotNo - 1];
              grpSlots[slotNo - 1] = {
                ...currentSlot,
                slotNumber: slotNo,
                memberId: currentSlot.memberId !== '—' ? currentSlot.memberId : (w.memberId || w.winnerMemberId || `LOP-${String(slotNo).padStart(6, '0')}`),
                memberName: currentSlot.memberName !== '—' ? currentSlot.memberName : (w.memberName || w.winnerName || `Member #${slotNo}`),
                status: 'Won 1g Gold',
                wonDay: w.cycleDay || w.dayNumber || currentSlot.wonDay || 1,
                wonDate: w.date || w.wonDate || currentSlot.wonDate || 'Today',
                depositStatus: 'Verified',
              };
            }
          }
        });

        grp.slots = grpSlots;
        const occupiedCount = grpSlots.filter((s: any) => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
        const wonCount = grpSlots.filter((s: any) => s.status === 'Won 1g Gold').length;
        grp.totalMembers = occupiedCount;
        grp.filledMembers = occupiedCount;
        grp.totalGoldDistributedGrams = wonCount;
        grp.activePoolCount = Math.max(0, occupiedCount - wonCount);
        if (wonCount > 0) {
          grp.currentCycleDay = Math.min(50, wonCount + 1);
          grp.status = 'active';
        }
      });

      // Auto-check if all existing batches are full/active and auto-create next batch if needed
      const hasOpenRecruiting = groups.some(g => {
        const isLiveOrActive = g.status === 'active' || g.status === 'live' || ((g.currentCycleDay ?? 0) > 0);
        const occupied = Array.isArray(g.slots) ? g.slots.filter((s: any) => s.status === 'Occupied' || s.status === 'Won 1g Gold').length : g.filledMembers;
        return !isLiveOrActive && occupied < 50;
      });

      if (!hasOpenRecruiting && groups.length > 0) {
        const newBatch = await ensureRecruitingBatchExists(groups);
        if (newBatch) {
          groups.push(newBatch);
        }
      }

      // Sort sequentially by groupId (GROUP-001, GROUP-002, etc.)
      groups.sort((a, b) => a.groupId.localeCompare(b.groupId));
    }

    return NextResponse.json({
      success: true,
      groups,
      totalGroups: groups.length,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in GET /api/admin/groups:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch groups from Firestore' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = 'create_group', groupName, groupId: customGroupId, startDate, scheduledTime } = body;

    // 1. UPDATE SCHEDULE ACTION (With strict locking rule after start)
    if (action === 'update_schedule') {
      const targetGroupId = customGroupId || body.groupId || 'GROUP-001';
      const groupRef = doc(db, 'groups', targetGroupId);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const isLiveOrActive = groupData.status === 'active' || groupData.status === 'live' || (groupData.currentCycleDay && groupData.currentCycleDay > 0);
        
        // Locking check: Once event starts, do NOT allow editing
        if (isLiveOrActive) {
          return NextResponse.json({
            success: false,
            error: 'Event schedule is locked. Once the 50-day draw cycle has started, start date and time cannot be modified.',
            isLocked: true,
          }, { status: 400 });
        }

        const updates: any = {};
        if (startDate !== undefined) updates.startDate = startDate;
        if (scheduledTime !== undefined) updates.scheduledTime = scheduledTime;
        if (groupData.status === 'recruiting' && (groupData.totalMembers >= 50 || groupData.filledMembers >= 50)) {
          updates.status = 'ready';
        }

        await updateDoc(groupRef, sanitizeForFirestore(updates));
        await ensureRecruitingBatchExists();

        return NextResponse.json({
          success: true,
          message: `Schedule for ${targetGroupId} successfully updated and stored in database.`,
          updatedFields: updates,
        }, { status: 200 });
      } else {
        return NextResponse.json({
          success: false,
          error: `Group ${targetGroupId} not found in database.`,
        }, { status: 404 });
      }
    }

    // START 50-DAY EVENT ACTION (Triggered when 50/50 is full to set date & time and start cycle)
    if (action === 'start_event') {
      const targetGroupId = customGroupId || body.groupId;
      if (!targetGroupId) {
        return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
      }
      const groupRef = doc(db, 'groups', targetGroupId);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        return NextResponse.json({ success: false, error: `Group ${targetGroupId} not found in database.` }, { status: 404 });
      }

      const updates: any = {
        status: 'active',
        currentCycleDay: 1,
      };
      if (startDate !== undefined) updates.startDate = startDate;
      if (scheduledTime !== undefined) updates.scheduledTime = scheduledTime;

      await updateDoc(groupRef, sanitizeForFirestore(updates));
      
      // Auto-create next batch if all batches are now full/active
      await ensureRecruitingBatchExists();

      return NextResponse.json({
        success: true,
        message: `🎉 50-Day Event cycle successfully started for ${targetGroupId}! Status is now LIVE (Day 1/50).`,
        updatedFields: updates,
      }, { status: 200 });
    }

    // 3. EDIT GROUP (Name, Schedule, Status)
    if (action === 'edit_group') {
      const targetGroupId = customGroupId || body.groupId;
      if (!targetGroupId) {
        return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
      }
      const groupRef = doc(db, 'groups', targetGroupId);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        return NextResponse.json({ success: false, error: `Group ${targetGroupId} not found in database.` }, { status: 404 });
      }

      const updates: any = {};
      if (groupName !== undefined && groupName.trim()) updates.groupName = groupName.trim();
      if (startDate !== undefined) updates.startDate = startDate;
      if (scheduledTime !== undefined) updates.scheduledTime = scheduledTime;
      if (body.status !== undefined) updates.status = body.status;

      await updateDoc(groupRef, sanitizeForFirestore(updates));

      return NextResponse.json({
        success: true,
        message: `Group ${targetGroupId} updated successfully in database.`,
        updatedFields: updates,
      }, { status: 200 });
    }

    // 4. DELETE GROUP ACTION
    if (action === 'delete_group') {
      const targetGroupId = customGroupId || body.groupId;
      if (!targetGroupId) {
        return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
      }

      const groupRef = doc(db, 'groups', targetGroupId);
      await deleteDoc(groupRef);

      // Clean up any users that had this group assigned
      try {
        const usersRef = collection(db, 'users');
        const usersSnap = await getDocs(usersRef);
        for (const uDoc of usersSnap.docs) {
          const uData = uDoc.data();
          let needsUpdate = false;
          const uUpdates: any = {};
          
          if (uData.group === targetGroupId || uData.groupId === targetGroupId) {
            uUpdates.group = 'Unassigned';
            uUpdates.groupId = 'Unassigned';
            needsUpdate = true;
          }

          if (Array.isArray(uData.allocatedSlots)) {
            const filteredAllocations = uData.allocatedSlots.filter((a: any) => a.group !== targetGroupId && a.groupId !== targetGroupId);
            if (filteredAllocations.length !== uData.allocatedSlots.length) {
              uUpdates.allocatedSlots = filteredAllocations;
              uUpdates.slotsOwned = filteredAllocations.length;
              needsUpdate = true;
            }
          }

          if (needsUpdate) {
            await updateDoc(doc(db, 'users', uDoc.id), sanitizeForFirestore(uUpdates));
          }
        }
      } catch (userCleanErr) {
        console.warn('Note cleaning up user group assignments on group delete:', userCleanErr);
      }

      return NextResponse.json({
        success: true,
        message: `Group ${targetGroupId} successfully deleted from database.`,
      }, { status: 200 });
    }

    // 2. CREATE NEW 50-MEMBER BATCH ACTION
    const groupsRef = collection(db, 'groups');
    const groupsSnap = await getDocs(groupsRef);
    
    // Determine next sequential group ID and Batch Letter (e.g. GROUP-002 -> Batch B)
    const existingGroupIds: string[] = [];
    groupsSnap.forEach(d => existingGroupIds.push(d.id));

    let nextNumber = 1;
    while (existingGroupIds.includes(`GROUP-${String(nextNumber).padStart(3, '0')}`)) {
      nextNumber++;
    }

    const newGroupId = customGroupId || `GROUP-${String(nextNumber).padStart(3, '0')}`;
    const batchLetter = String.fromCharCode(65 + ((nextNumber - 1) % 26));
    const resolvedGroupName = groupName || `InfinityGram 50 Gold Club - Batch ${batchLetter}`;

    const newSlots = Array.from({ length: 50 }, (_, i) => ({
      slotNumber: i + 1,
      memberId: '—',
      memberName: '—',
      status: 'Available',
      joinedDate: '-',
      wonDay: null,
      wonDate: null,
      depositStatus: 'Not Started'
    }));

    const newGroupData = {
      groupId: newGroupId,
      groupName: resolvedGroupName,
      status: 'recruiting',
      createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalMembers: 0,
      filledMembers: 0,
      currentCycleDay: 0,
      totalGoldDistributedGrams: 0,
      activePoolCount: 0,
      scheduledTime: '07:00 AM IST',
      startDate: '',
      slots: newSlots,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'groups', newGroupId), sanitizeForFirestore(newGroupData));

    return NextResponse.json({
      success: true,
      message: `Batch ${batchLetter} (${newGroupId}) created successfully in database.`,
      group: newGroupData,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in POST /api/admin/groups:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process group action in database' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let groupId = searchParams.get('groupId') || searchParams.get('id');
    if (!groupId) {
      try {
        const body = await request.json();
        groupId = body.groupId || body.id;
      } catch (e) {}
    }

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required for deletion' }, { status: 400 });
    }

    const groupRef = doc(db, 'groups', groupId);
    await deleteDoc(groupRef);

    return NextResponse.json({
      success: true,
      message: `Group ${groupId} successfully deleted from database.`,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/groups:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete group from database' },
      { status: 500 }
    );
  }
}
