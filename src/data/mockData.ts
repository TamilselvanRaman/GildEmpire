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
  memberId: 'LOP-000014',
  fullName: 'Rajesh Kumar Sharma',
  email: 'rajesh.sharma@gildempire.in',
  mobile: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  registrationDate: '12 Aug 2026',
  accountStatus: 'Active',
  referralId: 'REF-RAJESH89',
  referredBy: 'REF-AMIT99',
  depositStatus: 'Verified',
  groupId: 'GROUP-001',
  slotNumber: 14,
  rewardStatus: 'In Selection Pool',
};

export const depositHistoryMock: DepositRecord[] = [
  {
    id: 'dep_501',
    referenceId: 'UPI-982341209384',
    memberId: 'LOP-000014',
    memberName: 'Rajesh Kumar Sharma',
    amount: 10000,
    paymentMethod: 'UPI',
    transactionDate: '14 Aug 2026, 11:30 AM',
    status: 'Verified',
    verifiedDate: '14 Aug 2026, 02:15 PM',
    reviewerNotes: 'UPI UTR verified with HDFC Bank gateway. Assigned Slot #14 in GROUP-001.',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'dep_502',
    referenceId: 'IMPS-773829102938',
    memberId: 'LOP-000002',
    memberName: 'Priya Sundaram',
    amount: 10000,
    paymentMethod: 'Bank Transfer (NEFT/IMPS)',
    transactionDate: '15 Aug 2026, 09:45 AM',
    status: 'Verified',
    verifiedDate: '15 Aug 2026, 10:30 AM',
    reviewerNotes: 'IMPS reference matched.',
  },
  {
    id: 'dep_503',
    referenceId: 'UPI-449302910294',
    memberId: 'LOP-000045',
    memberName: 'Vikramaditya Singh',
    amount: 10000,
    paymentMethod: 'UPI',
    transactionDate: '10 Sep 2026, 04:20 PM',
    status: 'Pending',
    reviewerNotes: 'Awaiting Bank UTR Reconciliation.',
  },
  {
    id: 'dep_504',
    referenceId: 'UPI-119283746501',
    memberId: 'LOP-000048',
    memberName: 'Ananya Deshmukh',
    amount: 10000,
    paymentMethod: 'UPI',
    transactionDate: '09 Sep 2026, 06:10 PM',
    status: 'Rejected',
    reviewerNotes: 'Incorrect UTR number provided. Screenshot illegible.',
  }
];

// Helper to generate slots for specific count
export const generateBatchSlots = (filledCount: number, prefix: string = 'LOP-') => {
  const indianNames = [
    'Aarav Patel', 'Priya Sundaram', 'Vikramaditya Singh', 'Ananya Deshmukh', 'Kavita Menon',
    'Rohan Verma', 'Siddharth Joshi', 'Meera Nambiar', 'Amitabh Roy', 'Deepika Padukone',
    'Suresh Raina', 'Zaheer Khan', 'Sneha Reddy', 'Rajesh Kumar Sharma', 'Pooja Hegde',
    'Karthik Raja', 'Bhavna Sharma', 'Nitin Gadkari', 'Divya Spandana', 'Gautam Gambhir',
    'Tarun Gogoi', 'Harish Rawat', 'Venkatesh Prasad', 'Lakshmi Narayanan', 'Manish Sisodia',
    'Nandini Murthy', 'Om Prakash', 'Payal Ghosh', 'Raghav Chadha', 'Swati Maliwal',
    'Tanmay Bhat', 'Urvashi Rautela', 'Varun Dhawan', 'Yamini Krishnamurthy', 'Zoya Akhtar',
    'Ashish Nehra', 'Bhuvneshwar Kumar', 'Chetan Sharma', 'Dinesh Karthik', 'Eshwarappa',
    'Farhan Akhtar', 'Giri Babu', 'Harbhajan Singh', 'Irfan Pathan', 'Jasprit Bumrah',
    'Kedar Jadhav', 'Lokesh Rahul', 'Mohammad Shami', 'Navdeep Saini', 'Prithvi Shaw'
  ];

  return Array.from({ length: 50 }, (_, index) => {
    const slotNo = index + 1;
    const isOccupied = slotNo <= filledCount;
    const name = isOccupied ? (indianNames[index] || `Member #${slotNo}`) : '';
    const memberId = isOccupied ? `${prefix}${String(slotNo).padStart(6, '0')}` : '';

    return {
      slotNumber: slotNo,
      memberId: memberId,
      memberName: name,
      status: (slotNo === 1 && filledCount === 50 && prefix === 'LOP-') 
        ? ('Won 1g Gold' as const) 
        : isOccupied 
          ? ('Occupied' as const) 
          : ('Available' as const),
      joinedDate: isOccupied ? '12 Aug 2026' : undefined,
      wonDay: (slotNo === 1 && filledCount === 50 && prefix === 'LOP-') ? 1 : undefined,
      wonDate: (slotNo === 1 && filledCount === 50 && prefix === 'LOP-') ? '14 Aug 2026' : undefined,
    };
  });
};

export const currentGroupMock: GroupDetails = {
  groupId: 'GROUP-001',
  groupName: 'GildEmpire 50 Gold Club - Batch A',
  status: 'active',
  createdDate: '01 Aug 2026',
  totalMembers: 50,
  currentCycleDay: 2,
  totalGoldDistributedGrams: 1,
  activePoolCount: 49,
  scheduledTime: '07:00 AM IST',
  startDate: '2026-08-14',
  slots: generateBatchSlots(50, 'LOP-'),
};

export const allGroupsMock: GroupDetails[] = [
  currentGroupMock,
  {
    groupId: 'GROUP-002',
    groupName: 'GildEmpire 50 Gold Club - Batch B',
    status: 'full',
    createdDate: '05 Aug 2026',
    totalMembers: 50,
    currentCycleDay: 0,
    totalGoldDistributedGrams: 0,
    activePoolCount: 50,
    scheduledTime: 'Awaiting Admin Schedule',
    startDate: '',
    slots: generateBatchSlots(50, 'LOPB-'),
  },
  {
    groupId: 'GROUP-003',
    groupName: 'GildEmpire 50 Gold Club - Batch C',
    status: 'recruiting',
    createdDate: '10 Aug 2026',
    totalMembers: 40,
    currentCycleDay: 0,
    totalGoldDistributedGrams: 0,
    activePoolCount: 40,
    scheduledTime: '10 Open Slots Remaining',
    startDate: '',
    slots: generateBatchSlots(40, 'LOPC-'),
  },
  {
    groupId: 'GROUP-004',
    groupName: 'GildEmpire 50 Gold Club - Batch D',
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
    groupName: 'GildEmpire 50 Gold Club - Batch E',
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

export const pastGoldWinnersMock: DailyGoldWinner[] = [
  {
    dayNumber: 1,
    date: '14 Aug 2026',
    winnerMemberId: 'LOP-000001',
    winnerName: 'Aarav Patel',
    prizeDescription: '1 Gram 24K Gold Coin',
    dispatchStatus: 'Verified & Shipped',
    trackingNumber: 'BLUEDART-IND-9948201',
    auditHash: '0x8f9a2b1e410c9a87d65e21b44a',
  }
];

export const referralsMock: ReferralItem[] = [
  {
    id: 'ref_1',
    referredName: 'Suresh Raina',
    referredMemberId: 'LOP-000011',
    joinedDate: '18 Aug 2026',
    depositStatus: 'Verified',
    eligibility: 'Eligible',
  },
  {
    id: 'ref_2',
    referredName: 'Meera Nambiar',
    referredMemberId: 'LOP-000008',
    joinedDate: '22 Aug 2026',
    depositStatus: 'Verified',
    eligibility: 'Eligible',
  },
  {
    id: 'ref_3',
    referredName: 'Gautam Gambhir',
    referredMemberId: 'LOP-000020',
    joinedDate: '01 Sep 2026',
    depositStatus: 'Pending',
    eligibility: 'Pending Deposit',
  },
  {
    id: 'ref_4',
    referredName: 'Zaheer Khan',
    referredMemberId: 'LOP-000012',
    joinedDate: '05 Sep 2026',
    depositStatus: 'Not Started',
    eligibility: 'Pending Deposit',
  }
];

export const notificationsMock: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Day 1 Gold Reward Awarded',
    description: 'Day 1 selection completed. Member #LOP-000001 (Aarav Patel) won 1 Gram 24K Gold!',
    category: 'Reward',
    timestamp: 'Yesterday, 07:05 AM',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'Deposit Verified',
    description: 'Your ₹10,000 membership deposit reference #UPI-982341209384 has been verified by Admin.',
    category: 'Deposit',
    timestamp: '14 Aug 2026, 02:15 PM',
    read: true,
  },
  {
    id: 'notif_3',
    title: 'Added to GROUP-001',
    description: 'You have been assigned Slot #14 in GildEmpire 50 Gold Club - Batch A.',
    category: 'Group',
    timestamp: '14 Aug 2026, 02:20 PM',
    read: true,
  },
  {
    id: 'notif_4',
    title: 'New Referral Registration',
    description: 'Suresh Raina registered using your referral code REF-RAJESH89.',
    category: 'Referral',
    timestamp: '18 Aug 2026, 11:00 AM',
    read: true,
  }
];

export const auditLogsMock: AuditLogItem[] = [
  {
    id: 'audit_901',
    timestamp: '10 Sep 2026, 07:00:02 IST',
    actor: 'admin.op@gildempire.in',
    role: 'Operations',
    action: 'EXECUTED_DAILY_GOLD_SELECTION',
    module: 'Rewards',
    recordId: 'GROUP-001-DAY1',
    previousStatus: 'Pool size: 50',
    newStatus: 'Winner: LOP-000001 | Pool size: 49',
    ipAddress: '103.21.124.89',
  },
  {
    id: 'audit_902',
    timestamp: '10 Sep 2026, 15:45:10 IST',
    actor: 'admin.verify@gildempire.in',
    role: 'Reviewer',
    action: 'VERIFIED_MEMBER_DEPOSIT',
    module: 'Deposits',
    recordId: 'dep_501',
    previousStatus: 'Pending',
    newStatus: 'Verified (₹10,000)',
    ipAddress: '49.207.181.12',
  },
  {
    id: 'audit_903',
    timestamp: '09 Sep 2026, 11:20:00 IST',
    actor: 'superadmin@gildempire.in',
    role: 'Super Admin',
    action: 'UPDATED_SYSTEM_BUSINESS_RULES',
    module: 'System Settings',
    recordId: 'SYS_CFG_01',
    previousStatus: 'Deposit INR: 5000',
    newStatus: 'Deposit INR: 10000 (Verified Lock)',
    ipAddress: '115.240.99.34',
  }
];

export const adminUsersMock: AdminUser[] = [
  {
    id: 'adm_1',
    name: 'Vikram Roy',
    email: 'superadmin@gildempire.in',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Today, 08:30 PM',
  },
  {
    id: 'adm_2',
    name: 'Ananya Sen',
    email: 'admin.op@gildempire.in',
    role: 'Operations',
    status: 'Active',
    lastLogin: 'Today, 06:15 PM',
  },
  {
    id: 'adm_3',
    name: 'Karthik Raja',
    email: 'admin.verify@gildempire.in',
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
