export type ViewMode = 
  | 'public-landing'
  | 'public-about'
  | 'public-faq'
  | 'public-terms'
  | 'public-privacy'
  | 'public-contact'
  | 'auth-login'
  | 'auth-register'
  | 'auth-otp'
  | 'auth-forgot'
  | 'auth-reset'
  | 'user-dashboard'
  | 'user-profile'
  | 'user-edit-profile'
  | 'user-wallet'
  | 'user-wallet-history'
  | 'user-deposit-overview'
  | 'user-submit-deposit'
  | 'user-deposit-history'
  | 'user-my-group'
  | 'user-group-details'
  | 'user-group-history'
  | 'user-rewards-overview'
  | 'user-reward-spin'
  | 'user-reward-history'
  | 'user-referral-dashboard'
  | 'user-referral-details'
  | 'user-notifications'
  | 'user-notification-detail'
  | 'user-settings'
  | 'user-help'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-user-detail'
  | 'admin-deposits'
  | 'admin-deposit-review'
  | 'admin-groups'
  | 'admin-group-detail'
  | 'admin-slots'
  | 'admin-referrals'
  | 'admin-rewards'
  | 'admin-reward-cycle-detail'
  | 'admin-reward-flow-control'
  | 'admin-notifications'
  | 'admin-reports'
  | 'admin-audit-logs'
  | 'admin-team'
  | 'admin-settings'
  | 'system-404'
  | 'system-403'
  | 'system-500'
  | 'system-states';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type PortalType = 'public' | 'auth' | 'user' | 'admin' | 'system';

export interface UserProfile {
  id: string;
  memberId: string;
  fullName: string;
  email: string;
  mobile: string;
  avatar: string;
  registrationDate: string;
  accountStatus: 'Active' | 'Pending Verification' | 'Suspended' | 'Deactivated';
  referralId: string;
  referredBy?: string;
  depositStatus: 'Not Started' | 'Submitted' | 'Under Review' | 'Verified' | 'Rejected';
  groupId?: string;
  slotNumber?: number;
  rewardStatus: 'In Selection Pool' | 'Won 1g Gold' | 'Pending Group Formation' | 'Completed';
  wonDay?: number;
  wonDate?: string;
}

export interface DepositRecord {
  id: string;
  referenceId: string;
  memberId: string;
  memberName: string;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer (NEFT/IMPS)' | 'Net Banking';
  transactionDate: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  proofUrl?: string;
  verifiedDate?: string;
  reviewerNotes?: string;
}

export interface GroupSlot {
  slotNumber: number; // 1 to 50
  memberId?: string;
  memberName?: string;
  status: 'Occupied' | 'Available' | 'Current Member' | 'Won 1g Gold';
  joinedDate?: string;
  wonDay?: number;
  wonDate?: string;
}

export interface GroupDetails {
  groupId: string;
  groupName: string;
  status: 'Recruiting' | 'Active 50-Day Cycle' | 'Completed Cycle';
  createdDate: string;
  totalMembers: number; // Max 50
  currentCycleDay: number; // 1 to 50
  totalGoldDistributedGrams: number; // e.g. 14 grams for 14 days
  activePoolCount: number; // e.g. 36 active members remaining
  slots: GroupSlot[];
}

export interface DailyGoldWinner {
  dayNumber: number; // 1 to 50
  date: string;
  winnerMemberId: string;
  winnerName: string;
  prizeDescription: '1 Gram 24K Gold Coin';
  dispatchStatus: 'Verified & Shipped' | 'Processing' | 'Pending Verification';
  trackingNumber?: string;
  auditHash: string;
}

export interface ReferralItem {
  id: string;
  referredName: string;
  referredMemberId: string;
  joinedDate: string;
  depositStatus: 'Verified' | 'Pending' | 'Not Started';
  eligibility: 'Eligible' | 'Pending Deposit';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'Account' | 'Deposit' | 'Group' | 'Reward' | 'Referral' | 'System';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: 'Super Admin' | 'Operations' | 'Reviewer' | 'System';
  action: string;
  module: 'Deposits' | 'Groups' | 'Rewards' | 'User Management' | 'System Settings';
  recordId: string;
  previousStatus?: string;
  newStatus?: string;
  ipAddress: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Operations' | 'Reviewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface SystemSettingsConfig {
  groupCapacity: number; // 50
  goldPrizeGramsPerDay: number; // 1
  depositAmountINR: number; // e.g. 1000
  autoDailySpinTime: string; // "18:00 IST"
  allowManualSpinTrigger: boolean;
  maintenanceMode: boolean;
  requireDepositVerification: boolean;
}
