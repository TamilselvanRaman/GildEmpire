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
  memberId: 'MB-8924',
  fullName: 'Rajesh Kumar Sharma',
  email: 'rajesh.sharma@gildempire.in',
  mobile: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  registrationDate: '12 Aug 2026',
  accountStatus: 'Active',
  referralId: 'REF-RAJESH89',
  referredBy: 'REF-AMIT99',
  depositStatus: 'Verified',
  groupId: 'GRP-50-GOLD-01',
  slotNumber: 14,
  rewardStatus: 'In Selection Pool',
};

export const depositHistoryMock: DepositRecord[] = [
  {
    id: 'dep_501',
    referenceId: 'UPI-982341209384',
    memberId: 'MB-8924',
    memberName: 'Rajesh Kumar Sharma',
    amount: 5000,
    paymentMethod: 'UPI',
    transactionDate: '14 Aug 2026, 11:30 AM',
    status: 'Verified',
    verifiedDate: '14 Aug 2026, 02:15 PM',
    reviewerNotes: 'UPI UTR verified with HDFC Bank gateway.',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'dep_502',
    referenceId: 'IMPS-773829102938',
    memberId: 'MB-4029',
    memberName: 'Priya Sundaram',
    amount: 5000,
    paymentMethod: 'Bank Transfer (NEFT/IMPS)',
    transactionDate: '15 Aug 2026, 09:45 AM',
    status: 'Verified',
    verifiedDate: '15 Aug 2026, 10:30 AM',
    reviewerNotes: 'IMPS reference matched.',
  },
  {
    id: 'dep_503',
    referenceId: 'UPI-449302910294',
    memberId: 'MB-7712',
    memberName: 'Vikramaditya Singh',
    amount: 5000,
    paymentMethod: 'UPI',
    transactionDate: '10 Sep 2026, 04:20 PM',
    status: 'Pending',
    reviewerNotes: 'Awaiting Bank UTR Reconciliation.',
  },
  {
    id: 'dep_504',
    referenceId: 'UPI-119283746501',
    memberId: 'MB-1092',
    memberName: 'Ananya Deshmukh',
    amount: 5000,
    paymentMethod: 'UPI',
    transactionDate: '09 Sep 2026, 06:10 PM',
    status: 'Rejected',
    reviewerNotes: 'Incorrect UTR number provided. Screenshot illegible.',
  }
];

// Generate exact 50 slots for the 50-member group
const generate50Slots = () => {
  const indianNames = [
    'Aarav Patel', 'Priya Sundaram', 'Vikramaditya Singh', 'Ananya Deshmukh', 'Kavita Menon',
    'Rohan Verma', 'Sanjay Dutt', 'Deepika Padukone', 'Amitabh Bachchan', 'Sunil Gavaskar',
    'Sachin Tendulkar', 'Rahul Dravid', 'Rajesh Kumar Sharma', 'Sneha Reddy', 'Manoj Bajpayee',
    'Neha Kakkar', 'Karan Johar', 'Shreya Ghoshal', 'Arjun Kapoor', 'Pooja Hegde',
    'Siddharth Malhotra', 'Kiara Advani', 'Rishabh Pant', 'Hardik Pandya', 'Jasprit Bumrah',
    'Ravindra Jadeja', 'Shikhar Dhawan', 'Kalyani Priyadarshan', 'Nivetha Thomas', 'Dulquer Salmaan',
    'Fahadh Faasil', 'Prithviraj Sukumaran', 'Suriya Sivakumar', 'Jyothika Saravanan', 'Trisha Krishnan',
    'Mahesh Babu', 'Nandamuri Balakrishna', 'Vijay Deverakonda', 'Rashmika Mandanna', 'Samantha Ruth',
    'Nani Ghanta', 'Keerthy Suresh', 'Allu Arjun', 'Ram Charan', 'Jr NTR',
    'Prabhas Raju', 'Anushka Shetty', 'Tamannaah Bhatia', 'Rana Daggubati', 'Naga Chaitanya'
  ];

  return Array.from({ length: 50 }, (_, index) => {
    const slotNo = index + 1;
    const name = indianNames[index];
    const isCurrentMember = slotNo === 14;
    // Slots 1 to 14 have won 1g Gold on Days 1 to 14
    const hasWon = slotNo <= 14;

    return {
      slotNumber: slotNo,
      memberId: `MB-${1000 + slotNo}`,
      memberName: name,
      status: hasWon 
        ? 'Won 1g Gold' 
        : isCurrentMember 
          ? 'Current Member' 
          : 'Occupied',
      joinedDate: `12 Aug 2026`,
      wonDay: hasWon ? slotNo : undefined,
      wonDate: hasWon ? `${slotNo} Aug 2026` : undefined,
    } as const;
  });
};

export const currentGroupMock: GroupDetails = {
  groupId: 'GRP-50-GOLD-01',
  groupName: 'GildEmpire 50 Gold Club - Batch A',
  status: 'Active 50-Day Cycle',
  createdDate: '01 Aug 2026',
  totalMembers: 50,
  currentCycleDay: 15, // Currently on Day 15 of 50
  totalGoldDistributedGrams: 14, // 14 Grams Gold given to Days 1-14 winners
  activePoolCount: 36, // 50 - 14 = 36 members remaining in active spin pool
  slots: generate50Slots(),
};

export const pastGoldWinnersMock: DailyGoldWinner[] = Array.from({ length: 14 }, (_, i) => {
  const day = i + 1;
  return {
    dayNumber: day,
    date: `${day} Aug 2026`,
    winnerMemberId: `MB-${1000 + day}`,
    winnerName: currentGroupMock.slots[i].memberName || `Member #${day}`,
    prizeDescription: '1 Gram 24K Gold Coin',
    dispatchStatus: day <= 10 ? 'Verified & Shipped' : 'Processing',
    trackingNumber: day <= 10 ? `BLUEDART-IND-994820${day}` : undefined,
    auditHash: `0x8f9a2b${day}e410c9a87d65e21b44a`,
  };
});

export const referralsMock: ReferralItem[] = [
  {
    id: 'ref_1',
    referredName: 'Suresh Raina',
    referredMemberId: 'MB-9901',
    joinedDate: '18 Aug 2026',
    depositStatus: 'Verified',
    eligibility: 'Eligible',
  },
  {
    id: 'ref_2',
    referredName: 'Meera Nambiar',
    referredMemberId: 'MB-9902',
    joinedDate: '22 Aug 2026',
    depositStatus: 'Verified',
    eligibility: 'Eligible',
  },
  {
    id: 'ref_3',
    referredName: 'Gautam Gambhir',
    referredMemberId: 'MB-9903',
    joinedDate: '01 Sep 2026',
    depositStatus: 'Pending',
    eligibility: 'Pending Deposit',
  },
  {
    id: 'ref_4',
    referredName: 'Zaheer Khan',
    referredMemberId: 'MB-9904',
    joinedDate: '05 Sep 2026',
    depositStatus: 'Not Started',
    eligibility: 'Pending Deposit',
  }
];

export const notificationsMock: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Day 14 Gold Reward Awarded',
    description: 'Day 14 selection completed. Member #MB-1014 (Sneha Reddy) won 1 Gram 24K Gold!',
    category: 'Reward',
    timestamp: 'Today, 06:05 PM',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'Deposit Verified',
    description: 'Your ₹5,000 membership deposit reference #UPI-982341209384 has been verified by Admin.',
    category: 'Deposit',
    timestamp: '14 Aug 2026, 02:15 PM',
    read: true,
  },
  {
    id: 'notif_3',
    title: 'Added to 50-Member Group',
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
    timestamp: '10 Sep 2026, 18:00:02 IST',
    actor: 'admin.op@gildempire.in',
    role: 'Operations',
    action: 'EXECUTED_DAILY_GOLD_SELECTION',
    module: 'Rewards',
    recordId: 'GRP-50-GOLD-01-DAY14',
    previousStatus: 'Pool size: 37',
    newStatus: 'Winner: MB-1014 | Pool size: 36',
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
    newStatus: 'Verified',
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
    newStatus: 'Deposit INR: 5000 (Verified Lock)',
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
  depositAmountINR: 5000,
  autoDailySpinTime: '18:00 IST',
  allowManualSpinTrigger: true,
  maintenanceMode: false,
  requireDepositVerification: true,
};
