'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  ViewMode, 
  ViewportMode, 
  UserProfile, 
  DepositRecord, 
  GroupDetails, 
  DailyGoldWinner, 
  ReferralItem, 
  NotificationItem, 
  AuditLogItem, 
  AdminUser, 
  SystemSettingsConfig,
  ProgramEvent 
} from '../types';
import { 
  currentUserMock, 
  depositHistoryMock, 
  currentGroupMock, 
  allGroupsMock,
  pastGoldWinnersMock, 
  referralsMock, 
  notificationsMock, 
  auditLogsMock, 
  adminUsersMock, 
  systemSettingsMock 
} from '../data/mockData';

interface AppContextType {
  currentView: ViewMode;
  viewportMode: ViewportMode;
  user: UserProfile;
  deposits: DepositRecord[];
  group: GroupDetails;
  allGroups: GroupDetails[];
  selectedBatchId: string;
  setSelectedBatchId: (id: string) => void;
  pastWinners: DailyGoldWinner[];
  referrals: ReferralItem[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  adminUsers: AdminUser[];
  settings: SystemSettingsConfig;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  
  // Live 24-Hour Cooldown Lock & Broadcast State
  drawLockedUntil: number | null;
  isLiveDrawActive: boolean;
  currentLiveWinner: DailyGoldWinner | null;
  programEvents: ProgramEvent[];
  resetDrawLock: () => void;
  updateGroupSchedule: (groupId: string, startDate: string, scheduledTime: string) => void;

  // Live Countdown Timer State
  timerConfig: { hours: number; minutes: number; seconds: number };
  setTimerConfig: (hours: number, minutes: number, seconds: number) => void;

  // Navigation & Viewport Actions
  setCurrentView: (view: ViewMode) => void;
  setViewportMode: (mode: ViewportMode) => void;
  
  // Interactive State Actions
  loginUser: (email: string, pass: string) => Promise<boolean>;
  loginAdmin: (email: string, key: string) => Promise<boolean>;
  logout: () => void;
  submitDeposit: (amount: number, refId: string, method: DepositRecord['paymentMethod']) => void;
  reviewDeposit: (depositId: string, status: 'Verified' | 'Rejected', notes: string) => void;
  executeDailySpin: () => DailyGoldWinner | null;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserProfile: (name: string, email: string, mobile: string) => void;
  updateSettings: (newSettings: Partial<SystemSettingsConfig>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to generate 50 daily program events
const generate50DayProgramEvents = (startDateStr: string, pastWinners: DailyGoldWinner[]): ProgramEvent[] => {
  const events: ProgramEvent[] = [];
  const baseDate = new Date(startDateStr || '2026-08-14');

  for (let i = 1; i <= 50; i++) {
    const eventDate = new Date(baseDate);
    eventDate.setDate(baseDate.getDate() + (i - 1));
    const dateStr = eventDate.toISOString().split('T')[0];

    const winner = pastWinners.find(w => w.dayNumber === i);
    let status: 'Completed' | 'Today' | 'Scheduled' | 'Upcoming' = 'Upcoming';
    if (winner) {
      status = 'Completed';
    } else if (i === pastWinners.length + 1) {
      status = 'Today';
    } else if (i <= pastWinners.length + 7) {
      status = 'Scheduled';
    }

    events.push({
      dayNumber: i,
      date: dateStr,
      time: '07:00 AM IST',
      status: status,
      winnerMemberId: winner?.winnerMemberId,
      winnerName: winner?.winnerName,
      auditHash: winner?.auditHash,
    });
  }

  return events;
};

const viewToPathMap: Record<string, string> = {
  'public-landing': '/',
  'public-about': '/how-it-works',
  'public-faq': '/faq',
  'public-terms': '/terms',
  'public-privacy': '/privacy',
  'public-contact': '/contact',
  'auth-login': '/login',
  'auth-register': '/register',
  'auth-admin-login': '/admin/login',
  'user-dashboard': '/dashboard',
  'user-profile': '/profile',
  'user-edit-profile': '/profile',
  'user-wallet': '/wallet',
  'user-wallet-history': '/wallet',
  'user-deposit-overview': '/deposit',
  'user-submit-deposit': '/deposit',
  'user-deposit-history': '/deposit',
  'user-my-group': '/group',
  'user-group-details': '/group',
  'user-group-history': '/group',
  'user-rewards-overview': '/rewards',
  'user-reward-spin': '/rewards',
  'user-reward-history': '/rewards',
  'user-referral-dashboard': '/referral',
  'user-referral-details': '/referral',
  'user-notifications': '/notifications',
  'user-notification-detail': '/notifications',
  'user-settings': '/settings',
  'user-help': '/help',
  'admin-dashboard': '/admin/dashboard',
  'admin-users': '/admin/users',
  'admin-user-detail': '/admin/users',
  'admin-deposits': '/admin/deposits',
  'admin-deposit-review': '/admin/deposits',
  'admin-groups': '/admin/groups',
  'admin-group-detail': '/admin/groups',
  'admin-slots': '/admin/slots',
  'admin-referrals': '/admin/referrals',
  'admin-rewards': '/admin/rewards',
  'admin-reward-cycle-detail': '/admin/rewards',
  'admin-reward-flow-control': '/admin/rewards',
  'admin-notifications': '/admin/notifications',
  'admin-reports': '/admin/reports',
  'admin-audit-logs': '/admin/logs',
  'admin-team': '/admin/team',
  'admin-settings': '/admin/settings',
};

const pathToViewMap: Record<string, ViewMode> = {
  '/': 'public-landing',
  '/how-it-works': 'public-about',
  '/about': 'public-about',
  '/faq': 'public-faq',
  '/terms': 'public-terms',
  '/privacy': 'public-privacy',
  '/contact': 'public-contact',
  '/login': 'auth-login',
  '/register': 'auth-register',
  '/admin': 'auth-admin-login',
  '/admin/login': 'auth-admin-login',
  '/admin/dashboard': 'admin-dashboard',
  '/admin/users': 'admin-users',
  '/admin/deposits': 'admin-deposits',
  '/admin/groups': 'admin-groups',
  '/admin/slots': 'admin-slots',
  '/admin/referrals': 'admin-referrals',
  '/admin/rewards': 'admin-rewards',
  '/admin/notifications': 'admin-notifications',
  '/admin/reports': 'admin-reports',
  '/admin/logs': 'admin-audit-logs',
  '/admin/team': 'admin-team',
  '/admin/settings': 'admin-settings',
  '/dashboard': 'user-dashboard',
  '/profile': 'user-profile',
  '/wallet': 'user-wallet',
  '/deposit': 'user-deposit-overview',
  '/group': 'user-my-group',
  '/rewards': 'user-rewards-overview',
  '/referral': 'user-referral-dashboard',
  '/notifications': 'user-notifications',
  '/settings': 'user-settings',
  '/help': 'user-help',
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentViewRaw] = useState<ViewMode>('public-landing');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');

  // Custom setCurrentView that updates currentView AND pushes window URL path
  const setCurrentView = (view: ViewMode) => {
    setCurrentViewRaw(view);
    if (typeof window !== 'undefined') {
      const targetPath = viewToPathMap[view] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view }, '', targetPath);
      }
    }
  };

  // Sync initial view from browser URL on mount and handle browser back/forward buttons
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialPath = window.location.pathname;
      const matchedView = pathToViewMap[initialPath];
      if (matchedView) {
        setCurrentViewRaw(matchedView);
      }

      const handlePopState = () => {
        const path = window.location.pathname;
        const view = pathToViewMap[path] || 'public-landing';
        setCurrentViewRaw(view);
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);
  
  const [user, setUser] = useState<UserProfile>(currentUserMock);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(true);
  const [deposits, setDeposits] = useState<DepositRecord[]>(depositHistoryMock);
  const [allGroups, setAllGroups] = useState<GroupDetails[]>(allGroupsMock);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('GROUP-001');

  // Dynamic group object resolved from selectedBatchId
  const group = allGroups.find(g => g.groupId === selectedBatchId) || allGroups[0];

  const [pastWinners, setPastWinners] = useState<DailyGoldWinner[]>(pastGoldWinnersMock);
  const [referrals, setReferrals] = useState<ReferralItem[]>(referralsMock);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsMock);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(auditLogsMock);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(adminUsersMock);
  const [settings, setSettings] = useState<SystemSettingsConfig>(systemSettingsMock);

  // 24-Hour Cooldown Lock & Broadcast State
  const [drawLocks, setDrawLocks] = useState<Record<string, number>>({});
  const drawLockedUntil = drawLocks[selectedBatchId] || null;
  const [isLiveDrawActive, setIsLiveDrawActive] = useState<boolean>(false);
  const [currentLiveWinner, setCurrentLiveWinner] = useState<DailyGoldWinner | null>(null);

  const resetDrawLock = () => {
    setDrawLocks(prev => ({ ...prev, [selectedBatchId]: 0 }));
    setIsLiveDrawActive(false);
    setCurrentLiveWinner(null);
  };

  const updateGroupSchedule = (groupId: string, startDateStr: string, scheduledTimeStr: string) => {
    setAllGroups(prev => prev.map(g => {
      if (g.groupId === groupId) {
        return {
          ...g,
          startDate: startDateStr,
          scheduledTime: scheduledTimeStr,
          status: g.status === 'full' ? ('active' as const) : g.status,
        };
      }
      return g;
    }));
  };

  // Dynamically compute past winners for the currently selected group from its slots
  const currentGroupWinners: DailyGoldWinner[] = group.slots
    .filter(s => s.status === 'Won 1g Gold' && s.wonDay)
    .map(s => ({
      dayNumber: s.wonDay!,
      date: s.wonDate || '14 Aug 2026',
      winnerMemberId: s.memberId || `LOP-${String(s.slotNumber).padStart(6, '0')}`,
      winnerName: s.memberName || `Member #${s.slotNumber}`,
      prizeDescription: '1 Gram 24K Gold Coin',
      dispatchStatus: 'Verified & Shipped',
      auditHash: `0x${s.slotNumber}a9b8c7d6e5`,
    }));

  const programEvents = generate50DayProgramEvents(
    group.startDate || (group.groupId === 'GROUP-001' ? '2026-08-14' : new Date().toISOString().split('T')[0]),
    currentGroupWinners
  );

  // Auth Methods
  const loginUser = async (email: string, pass: string): Promise<boolean> => {
    setIsAuthenticated(true);
    setCurrentView('user-dashboard');
    return true;
  };

  const loginAdmin = async (email: string, key: string): Promise<boolean> => {
    setIsAdminAuthenticated(true);
    
    // Add audit entry for admin access
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: email || 'admin@gildempire.in',
      role: 'Super Admin',
      action: 'ADMIN_GATEWAY_LOGIN_SUCCESS',
      module: 'Security Vault',
      recordId: `AUTH-${Date.now().toString().slice(-6)}`,
      previousStatus: 'Unauthenticated',
      newStatus: 'Authenticated (SOC-2 Verified)',
      ipAddress: '103.45.12.89',
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    setCurrentView('admin-dashboard');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
    setCurrentView('public-landing');
  };

  // Helper function: Automatically allocate user to next available slot in active batch upon admin payment verification
  const autoAssignSlot = (memberId: string, memberName: string, targetBatchId?: string) => {
    let assignedSlotNumber = 0;
    let targetBatchName = 'Batch C';

    setAllGroups(prevGroups => {
      return prevGroups.map(grp => {
        // Target active recruiting batch (or specific batch)
        const isTargetBatch = targetBatchId ? grp.groupId === targetBatchId : (grp.status === 'recruiting' || grp.groupId === 'GROUP-003');
        if (!isTargetBatch) return grp;

        targetBatchName = grp.groupName;

        // Find first available open slot
        const emptySlotIndex = grp.slots.findIndex(s => !s.memberName || s.memberName.trim() === '' || s.status === 'Available');
        if (emptySlotIndex === -1) return grp;

        const targetSlot = grp.slots[emptySlotIndex];
        assignedSlotNumber = targetSlot.slotNumber;

        const updatedSlots = grp.slots.map((s, idx) => {
          if (idx === emptySlotIndex) {
            return {
              ...s,
              memberName: memberName,
              memberId: memberId,
              status: 'Occupied' as const,
              joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            };
          }
          return s;
        });

        const newTotalMembers = grp.totalMembers + 1;
        const newStatus = newTotalMembers >= 50 ? 'full' : grp.status;

        return {
          ...grp,
          totalMembers: newTotalMembers,
          status: newStatus,
          slots: updatedSlots,
        };
      });
    });

    if (assignedSlotNumber > 0) {
      // Add notification for automatic slot assignment
      const newNotif: NotificationItem = {
        id: `notif_slot_${Date.now()}`,
        title: `⚡ Automatic Slot Allocation Verified`,
        description: `${memberName} (${memberId}) was automatically assigned to Slot #${assignedSlotNumber} in ${targetBatchName} upon payment verification.`,
        category: 'System',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    return assignedSlotNumber;
  };

  // Submit deposit
  const submitDeposit = (amount: number, refId: string, method: DepositRecord['paymentMethod']) => {
    const newDep: DepositRecord = {
      id: `dep_${Date.now()}`,
      referenceId: refId,
      memberId: user.memberId,
      memberName: user.fullName,
      amount,
      paymentMethod: method,
      transactionDate: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Verified', // Instantly verify for seamless test flow
      reviewerNotes: `Automatically verified ₹${amount.toLocaleString('en-IN')} & allocated to open slot.`,
    };

    setDeposits(prev => [newDep, ...prev]);
    setUser(prev => ({ ...prev, depositStatus: 'Verified', accountStatus: 'Active' }));

    // AUTOMATICALLY ASSIGN TO NEXT AVAILABLE SLOT!
    autoAssignSlot(user.memberId, user.fullName);

    // Add Audit Log
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: user.email,
      role: 'System',
      action: 'AUTO_ALLOCATED_MEMBER_SLOT',
      module: 'Groups',
      recordId: newDep.id,
      previousStatus: 'Available Open Slot',
      newStatus: 'Occupied & Verified',
      ipAddress: '103.45.12.89',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Review deposit (Admin)
  const reviewDeposit = (depositId: string, status: 'Verified' | 'Rejected', notes: string) => {
    let targetMemberId = user.memberId;
    let targetMemberName = user.fullName;

    setDeposits(prev => prev.map(dep => {
      if (dep.id === depositId) {
        targetMemberId = dep.memberId;
        targetMemberName = dep.memberName;
        return {
          ...dep,
          status,
          verifiedDate: status === 'Verified' ? new Date().toLocaleString('en-IN') : undefined,
          reviewerNotes: notes,
        };
      }
      return dep;
    }));

    if (status === 'Verified') {
      setUser(prev => ({ ...prev, depositStatus: 'Verified', accountStatus: 'Active' }));
      // AUTOMATICALLY ASSIGN TO NEXT AVAILABLE SLOT ON ADMIN VERIFICATION!
      autoAssignSlot(targetMemberId, targetMemberName);
    } else if (status === 'Rejected') {
      setUser(prev => ({ ...prev, depositStatus: 'Rejected' }));
    }

    // Add Audit
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: 'admin.verify@gildempire.in',
      role: 'Reviewer',
      action: status === 'Verified' ? 'VERIFIED_AND_AUTO_ASSIGNED_SLOT' : 'REJECTED_MEMBER_DEPOSIT',
      module: 'Deposits',
      recordId: depositId,
      previousStatus: 'Pending',
      newStatus: status,
      ipAddress: '49.207.181.12',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Execute Daily 1 Gram Gold Spin (Admin-Only Trigger)
  const executeDailySpin = (): DailyGoldWinner | null => {
    // Eligible active pool are members in slots who haven't won yet
    const eligibleSlots = group.slots.filter(s => s.status !== 'Won 1g Gold');
    if (eligibleSlots.length === 0) return null;

    // Pick random winner from active pool
    const winnerSlot = eligibleSlots[Math.floor(Math.random() * eligibleSlots.length)];
    const currentDay = group.currentCycleDay;

    const newWinner: DailyGoldWinner = {
      dayNumber: currentDay,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      winnerMemberId: winnerSlot.memberId || `LOP-${String(winnerSlot.slotNumber).padStart(6, '0')}`,
      winnerName: winnerSlot.memberName || `Member #${winnerSlot.slotNumber}`,
      prizeDescription: '1 Gram 24K Gold Coin',
      dispatchStatus: 'Processing',
      auditHash: `0x${Math.random().toString(16).substring(2, 12)}${currentDay}`,
    };

    // Update group slots: mark winner slot as 'Won 1g Gold'
    const updatedSlots = group.slots.map(s => {
      if (s.slotNumber === winnerSlot.slotNumber) {
        return {
          ...s,
          status: 'Won 1g Gold' as const,
          wonDay: currentDay,
          wonDate: newWinner.date,
        };
      }
      return s;
    });

    setAllGroups(prev => prev.map(g => {
      if (g.groupId === selectedBatchId) {
        return {
          ...g,
          currentCycleDay: g.currentCycleDay + 1,
          totalGoldDistributedGrams: g.totalGoldDistributedGrams + 1,
          activePoolCount: g.activePoolCount - 1,
          slots: updatedSlots,
        };
      }
      return g;
    }));

    setPastWinners(prev => [newWinner, ...prev]);
    setCurrentLiveWinner(newWinner);
    setIsLiveDrawActive(true);

    // LOCK DRAW BUTTON FOR NEXT 24 HOURS! (24h in ms = 86,400,000)
    const lockExpiry = Date.now() + 24 * 60 * 60 * 1000;
    setDrawLocks(prev => ({ ...prev, [selectedBatchId]: lockExpiry }));

    // Check if current logged in user was selected
    if (winnerSlot.slotNumber === user.slotNumber) {
      setUser(prev => ({
        ...prev,
        rewardStatus: 'Won 1g Gold',
        wonDay: currentDay,
        wonDate: newWinner.date,
      }));
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Day ${currentDay} Gold Selection Completed`,
      description: `${newWinner.winnerName} (${newWinner.winnerMemberId}) was awarded 1 Gram 24K Gold Coin! Next draw opens in 24 hours.`,
      category: 'Reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Add Audit Log
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: 'admin.op@gildempire.in',
      role: 'Operations',
      action: 'ADMIN_EXECUTED_DAILY_GOLD_SELECTION_24H_LOCKED',
      module: 'Rewards',
      recordId: `GROUP-001-DAY${currentDay}`,
      previousStatus: `Pool size: ${eligibleSlots.length}`,
      newStatus: `Winner: ${newWinner.winnerMemberId} | Button Locked for 24 Hours`,
      ipAddress: '103.21.124.89',
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    return newWinner;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateUserProfile = (name: string, email: string, mobile: string) => {
    setUser(prev => ({ ...prev, fullName: name, email, mobile }));
  };

  const updateSettings = (newSettings: Partial<SystemSettingsConfig>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Live Countdown Timer State
  const [timerConfig, setTimerConfigState] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 4,
    seconds: 30
  });

  const setTimerConfig = (hours: number, minutes: number, seconds: number) => {
    setTimerConfigState({ hours, minutes, seconds });
  };

  return (
    <AppContext.Provider value={{
      currentView,
      viewportMode,
      user,
      deposits,
      group,
      allGroups,
      selectedBatchId,
      setSelectedBatchId,
      pastWinners,
      referrals,
      notifications,
      auditLogs,
      adminUsers,
      settings,
      isAuthenticated,
      isAdminAuthenticated,
      drawLockedUntil,
      isLiveDrawActive,
      currentLiveWinner,
      programEvents,
      resetDrawLock,
      updateGroupSchedule,
      timerConfig,
      setTimerConfig,
      setCurrentView,
      setViewportMode,
      loginUser,
      loginAdmin,
      logout,
      submitDeposit,
      reviewDeposit,
      executeDailySpin,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updateUserProfile,
      updateSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
