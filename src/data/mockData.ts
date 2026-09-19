import { 
  UserProfile, 
  DepositRecord, 
  GroupDetails, 
  DailyGoldWinner, 
  ReferralItem, 
  NotificationItem, 
  AuditLogItem, 
  AdminUser, 
  SystemSettingsConfig 
} from '../types';

export const currentUserMock: UserProfile = {
  id: '',
  memberId: '',
  fullName: '',
  email: '',
  mobile: '',
  avatar: '',
  registrationDate: '',
  accountStatus: 'Pending Verification',
  emailVerified: false,
  referralId: '',
  referredBy: '',
  depositStatus: 'Not Started',
  groupId: '',
  slotNumber: 0,
  slotsOwned: 0,
  assignedSlots: [],
  rewardStatus: 'In Selection Pool',
};

export const depositHistoryMock: DepositRecord[] = [];

// Helper to generate 50 clean slots without sample data
export const generateBatchSlots = (filledCount: number = 0, prefix: string = 'LOP-') => {
  return Array.from({ length: 50 }, (_, index) => {
    const slotNo = index + 1;
    const isOccupied = index < filledCount;

    return {
      slotNumber: slotNo,
      memberId: isOccupied ? `${prefix}${String(slotNo).padStart(6, '0')}` : 'Unassigned',
      memberName: isOccupied ? `Member #${slotNo}` : `Available Slot #${slotNo}`,
      status: isOccupied ? ('Occupied' as const) : ('Available' as const),
      joinedDate: isOccupied ? '12 Sep 2026' : '-',
      wonDay: undefined,
      wonDate: undefined,
    };
  });
};

// Dynamic 50-Member Group Allocator: Fills 50 members per group and dynamically creates new groups as user base expands
export const buildDynamicGroupsFromUsers = (users: any[]): GroupDetails[] => {
  const usersList = Array.isArray(users) ? users : [];

  const maxGroupNumFromUsers = usersList.reduce((max, u) => {
    if (u.group && u.group.startsWith('GROUP-')) {
      const num = parseInt(u.group.replace('GROUP-', ''), 10);
      return Math.max(max, isNaN(num) ? 0 : num);
    }
    return max;
  }, 5);

  const requiredGroupsCount = Math.max(5, maxGroupNumFromUsers);
  const groups: GroupDetails[] = [];

  for (let gIndex = 0; gIndex < requiredGroupsCount; gIndex++) {
    const groupId = `GROUP-${String(gIndex + 1).padStart(3, '0')}`;
    const letterCode = String.fromCharCode(65 + (gIndex % 26));
    const groupName = `InfinityGram 50 Gold Club - Batch ${letterCode}`;
    
    const slots = Array.from({ length: 50 }, (_, slotIdx) => ({
      slotNumber: slotIdx + 1,
      memberId: '—',
      memberName: '—',
      status: 'Available' as const,
      joinedDate: '-',
      wonDay: undefined,
      wonDate: undefined,
    }));

    groups.push({
      groupId,
      groupName,
      status: 'empty',
      createdDate: '01 Aug 2026',
      totalMembers: 0,
      currentCycleDay: 0,
      totalGoldDistributedGrams: 0,
      activePoolCount: 0,
      scheduledTime: 'Awaiting Members',
      startDate: '',
      slots,
    });
  }

  const eligibleUsers = usersList.filter(
    u => u.deposit === 'Verified' || u.depositStatus === 'Verified' || (u.group && u.group.startsWith('GROUP-') && u.slot && u.slot !== 'Not Assigned Yet' && u.slot !== '-')
  );

  eligibleUsers.forEach((u) => {
    let targetGroupId = u.group && u.group.startsWith('GROUP-') ? u.group : 'GROUP-001';
    let targetGroup = groups.find(g => g.groupId === targetGroupId);
    if (!targetGroup) {
      targetGroup = groups[0];
    }

    let rawSlotNum = 0;
    if (u.slot) {
      const clean = String(u.slot).replace(/[^0-9]/g, '');
      rawSlotNum = parseInt(clean, 10) || 0;
    }

    let targetSlotIndex = -1;
    if (rawSlotNum >= 1 && rawSlotNum <= 50) {
      targetSlotIndex = rawSlotNum - 1;
    } else {
      targetSlotIndex = targetGroup.slots.findIndex(s => s.status === 'Available');
    }

    if (targetSlotIndex >= 0 && targetSlotIndex < 50) {
      targetGroup.slots[targetSlotIndex] = {
        slotNumber: targetSlotIndex + 1,
        memberId: u.memberId || u.id || `LOP-${String(targetSlotIndex + 1).padStart(6, '0')}`,
        memberName: u.name || u.email || `Member #${targetSlotIndex + 1}`,
        status: 'Occupied' as const,
        joinedDate: u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        wonDay: undefined,
        wonDate: undefined,
      };
    }
  });

  groups.forEach((grp, gIndex) => {
    const filledSlots = grp.slots.filter(s => s.status === 'Occupied');
    grp.totalMembers = filledSlots.length;
    grp.activePoolCount = grp.totalMembers;
    grp.currentCycleDay = grp.totalMembers > 0 ? Math.min(15, grp.totalMembers) : 0;
    grp.scheduledTime = grp.totalMembers > 0 ? '07:00 AM IST' : 'Awaiting Members';
    grp.startDate = grp.totalMembers > 0 ? '2026-08-14' : '';

    if (grp.totalMembers === 50) {
      grp.status = 'full';
    } else if (grp.totalMembers > 0) {
      grp.status = 'active';
    } else if (gIndex === 0 || (gIndex > 0 && groups[gIndex - 1]?.totalMembers > 0)) {
      grp.status = 'recruiting';
    } else {
      grp.status = 'empty';
    }
  });

  return groups;
};

export const currentGroupMock: GroupDetails = buildDynamicGroupsFromUsers([])[0];

export const allGroupsMock: GroupDetails[] = buildDynamicGroupsFromUsers([]);

export const pastGoldWinnersMock: DailyGoldWinner[] = [];

export const referralsMock: ReferralItem[] = [];

export const notificationsMock: NotificationItem[] = [];

export const auditLogsMock: AuditLogItem[] = [];

export const adminUsersMock: AdminUser[] = [];

export const systemSettingsMock: SystemSettingsConfig = {
  groupCapacity: 50,
  goldPrizeGramsPerDay: 1,
  depositAmountINR: 10000,
  autoDailySpinTime: '07:00 IST',
  allowManualSpinTrigger: true,
  maintenanceMode: false,
  requireDepositVerification: true,
};
