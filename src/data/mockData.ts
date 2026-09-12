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
  memberId: 'LOP-000001',
  fullName: 'Navin Kumar',
  email: 'navin@infinitygram.net',
  mobile: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  registrationDate: '12 Sep 2026',
  accountStatus: 'Pending Verification',
  referralId: 'REF-NAVIN01',
  referredBy: '',
  depositStatus: 'Not Started',
  groupId: '',
  slotNumber: 0,
  rewardStatus: 'Pending Group Formation',
};

export const depositHistoryMock: DepositRecord[] = [];

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
      status: isOccupied 
        ? ('Occupied' as const) 
        : ('Available' as const),
      joinedDate: isOccupied ? '12 Aug 2026' : undefined,
    };
  });
};

export const currentGroupMock: GroupDetails = {
  groupId: 'GROUP-001',
  groupName: 'InfinityGram 50 Gold Club - Batch A',
  status: 'active',
  createdDate: '01 Aug 2026',
  totalMembers: 0,
  currentCycleDay: 0,
  totalGoldDistributedGrams: 0,
  activePoolCount: 0,
  scheduledTime: '07:00 AM IST',
  startDate: '2026-08-14',
  slots: generateBatchSlots(0, 'LOP-'),
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
