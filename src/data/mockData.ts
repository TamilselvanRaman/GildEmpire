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
  id: 'usr_101',
  memberId: 'LOP-635880',
  fullName: 'Tamilselvan R',
  email: 'tamilselvan@infinitygram.net',
  mobile: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  registrationDate: '12 Sep 2026',
  accountStatus: 'Active',
  referralId: 'REF-635880',
  referredBy: '',
  depositStatus: 'Verified',
  groupId: 'GROUP-001',
  slotNumber: 1,
  slotsOwned: 1,
  assignedSlots: [1],
  rewardStatus: 'In Selection Pool',
};

export const depositHistoryMock: DepositRecord[] = [];

// Helper to generate 50 clean slots without sample data
export const generateBatchSlots = (filledCount: number = 1, prefix: string = 'LOP-') => {
  return Array.from({ length: 50 }, (_, index) => {
    const slotNo = index + 1;
    const isFirstSlot = slotNo === 1;

    return {
      slotNumber: slotNo,
      memberId: isFirstSlot ? 'LOP-635880' : 'Unassigned',
      memberName: isFirstSlot ? 'Tamilselvan R' : `Available Slot #${slotNo}`,
      status: isFirstSlot ? ('Occupied' as const) : ('Available' as const),
      joinedDate: isFirstSlot ? '12 Sep 2026' : '-',
      wonDay: undefined,
      wonDate: undefined,
    };
  });
};

export const currentGroupMock: GroupDetails = {
  groupId: 'GROUP-001',
  groupName: 'InfinityGram 50 Gold Club - Batch A',
  status: 'active',
  createdDate: '01 Aug 2026',
  totalMembers: 50,
  currentCycleDay: 15,
  totalGoldDistributedGrams: 14,
  activePoolCount: 36,
  scheduledTime: '07:00 AM IST',
  startDate: '2026-08-14',
  slots: generateBatchSlots(50, 'LOP-'),
};

export const allGroupsMock: GroupDetails[] = [
  currentGroupMock,
  {
    groupId: 'GROUP-002',
    groupName: 'InfinityGram 50 Gold Club - Batch B',
    status: 'recruiting',
    createdDate: '05 Aug 2026',
    totalMembers: 0,
    currentCycleDay: 0,
    totalGoldDistributedGrams: 0,
    activePoolCount: 0,
    scheduledTime: 'Awaiting Members',
    startDate: '',
    slots: generateBatchSlots(0, 'LOPB-'),
  },
  {
    groupId: 'GROUP-003',
    groupName: 'InfinityGram 50 Gold Club - Batch C',
    status: 'recruiting',
    createdDate: '10 Aug 2026',
    totalMembers: 0,
    currentCycleDay: 0,
    totalGoldDistributedGrams: 0,
    activePoolCount: 0,
    scheduledTime: 'Awaiting Members',
    startDate: '',
    slots: generateBatchSlots(0, 'LOPC-'),
  },
  {
    groupId: 'GROUP-004',
    groupName: 'InfinityGram 50 Gold Club - Batch D',
    status: 'empty',
    createdDate: '15 Aug 2026',
    totalMembers: 0,
    currentCycleDay: 0,
    totalGoldDistributedGrams: 0,
    activePoolCount: 0,
    scheduledTime: 'Reserve Batch Queue',
    startDate: '',
    slots: generateBatchSlots(0, 'LOPD-'),
  },
  {
    groupId: 'GROUP-005',
    groupName: 'InfinityGram 50 Gold Club - Batch E',
    status: 'empty',
    createdDate: '20 Aug 2026',
    totalMembers: 0,
    currentCycleDay: 0,
    totalGoldDistributedGrams: 0,
    activePoolCount: 0,
    scheduledTime: 'Reserve Batch Queue',
    startDate: '',
    slots: generateBatchSlots(0, 'LOPE-'),
  },
];

export const pastGoldWinnersMock: DailyGoldWinner[] = [];

export const referralsMock: ReferralItem[] = [];

export const notificationsMock: NotificationItem[] = [];

export const auditLogsMock: AuditLogItem[] = [];

export const adminUsersMock: AdminUser[] = [
  {
    id: 'adm_1',
    name: 'Vikram Roy',
    email: 'superadmin@infinitygram.in',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Today, 08:30 PM',
  },
  {
    id: 'adm_2',
    name: 'Ananya Sen',
    email: 'admin.op@infinitygram.in',
    role: 'Operations',
    status: 'Active',
    lastLogin: 'Today, 06:15 PM',
  },
  {
    id: 'adm_3',
    name: 'Karthik Raja',
    email: 'admin.verify@infinitygram.in',
    role: 'Reviewer',
    status: 'Active',
    lastLogin: 'Yesterday, 04:00 PM',
  }
];

export const systemSettingsMock: SystemSettingsConfig = {
  groupCapacity: 50,
  goldPrizeGramsPerDay: 1,
  depositAmountINR: 10000,
  autoDailySpinTime: '07:00 IST',
  allowManualSpinTrigger: true,
  maintenanceMode: false,
  requireDepositVerification: true,
};
