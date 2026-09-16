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
  // ONLY place members into group slots after payment & deposit verification
  const verifiedUsers = usersList.filter(u => u.deposit === 'Verified' || u.depositStatus === 'Verified');
  const requiredGroupsCount = Math.max(5, Math.ceil(verifiedUsers.length / 50) + 1);
  const groups: GroupDetails[] = [];

  for (let gIndex = 0; gIndex < requiredGroupsCount; gIndex++) {
    const groupId = `GROUP-${String(gIndex + 1).padStart(3, '0')}`;
    const letterCode = String.fromCharCode(65 + (gIndex % 26));
    const groupName = `InfinityGram 50 Gold Club - Batch ${letterCode}`;
    
    const groupUsers = verifiedUsers.slice(gIndex * 50, (gIndex + 1) * 50);
    const totalMembers = groupUsers.length;

    let status: GroupDetails['status'] = 'empty';
    if (totalMembers === 50) {
      status = 'full';
    } else if (totalMembers > 0) {
      status = 'active';
    } else if (gIndex === 0 || (gIndex > 0 && groups[gIndex - 1]?.totalMembers > 0)) {
      status = 'recruiting';
    } else {
      status = 'empty';
    }

    const slots = Array.from({ length: 50 }, (_, slotIdx) => {
      const slotNo = slotIdx + 1;
      const u = groupUsers[slotIdx];
      const letterPrefix = `LOP${letterCode}-`;

      if (u) {
        return {
          slotNumber: slotNo,
          memberId: u.memberId || `${letterPrefix}${String(slotNo).padStart(6, '0')}`,
          memberName: u.name || `Member #${slotNo}`,
          status: 'Occupied' as const,
          joinedDate: u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          wonDay: undefined,
          wonDate: undefined,
        };
      }

      return {
        slotNumber: slotNo,
        memberId: '—',
        memberName: '—',
        status: 'Available' as const,
        joinedDate: '-',
        wonDay: undefined,
        wonDate: undefined,
      };
    });

    groups.push({
      groupId,
      groupName,
      status,
      createdDate: '01 Aug 2026',
      totalMembers,
      currentCycleDay: totalMembers > 0 ? Math.min(15, totalMembers) : 0,
      totalGoldDistributedGrams: 0,
      activePoolCount: totalMembers,
      scheduledTime: totalMembers > 0 ? '07:00 AM IST' : 'Awaiting Members',
      startDate: totalMembers > 0 ? '2026-08-14' : '',
      slots,
    });
  }

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
