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
  SystemSettingsConfig 
} from '../types';
import { 
  currentUserMock, 
  depositHistoryMock, 
  currentGroupMock, 
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
  pastWinners: DailyGoldWinner[];
  referrals: ReferralItem[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  adminUsers: AdminUser[];
  settings: SystemSettingsConfig;
  
  // Navigation & Viewport Actions
  setCurrentView: (view: ViewMode) => void;
  setViewportMode: (mode: ViewportMode) => void;
  
  // Interactive State Actions
  submitDeposit: (amount: number, refId: string, method: 'UPI' | 'Bank Transfer (NEFT/IMPS)' | 'Net Banking') => void;
  reviewDeposit: (depositId: string, status: 'Verified' | 'Rejected', notes: string) => void;
  executeDailySpin: () => DailyGoldWinner | null;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserProfile: (name: string, email: string, mobile: string) => void;
  updateSettings: (newSettings: Partial<SystemSettingsConfig>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const viewToPathMap: Record<string, string> = {
  'public-landing': '/',
  'public-[#2F6FED]': '/',
  'public-about': '/how-it-works',
  'public-faq': '/faq',
  'public-terms': '/terms',
  'public-privacy': '/privacy',
  'public-contact': '/contact',
  'auth-login': '/login',
  'auth-register': '/register',
  'auth-admin-login': '/admin',
  'user-dashboard': '/dashboard',
  'user-wallet': '/wallet',
  'user-deposit-overview': '/deposit',
  'user-my-group': '/group',
  'user-rewards-overview': '/rewards',
  'user-reward-spin': '/rewards',
  'user-referral-dashboard': '/referral',
  'user-settings': '/settings',
  'user-help': '/help',
  'admin-dashboard': '/admin/dashboard',
  'admin-users': '/admin/users',
  'admin-deposits': '/admin/deposits',
  'admin-rewards': '/admin/rewards',
  'admin-[#2F6FED]': '/admin/users',
  'admin-logs': '/admin/logs',
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
  '/admin/dashboard': 'admin-dashboard',
  '/admin/users': 'admin-users',
  '/admin/deposits': 'admin-deposits',
  '/admin/rewards': 'admin-rewards',
  '/admin/logs': 'admin-logs',
  '/admin/settings': 'admin-settings',
  '/dashboard': 'user-dashboard',
  '/wallet': 'user-wallet',
  '/deposit': 'user-deposit-overview',
  '/group': 'user-my-group',
  '/rewards': 'user-rewards-overview',
  '/referral': 'user-referral-dashboard',
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
  const [deposits, setDeposits] = useState<DepositRecord[]>(depositHistoryMock);
  const [group, setGroup] = useState<GroupDetails>(currentGroupMock);
  const [pastWinners, setPastWinners] = useState<DailyGoldWinner[]>(pastGoldWinnersMock);
  const [referrals, setReferrals] = useState<ReferralItem[]>(referralsMock);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsMock);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(auditLogsMock);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(adminUsersMock);
  const [settings, setSettings] = useState<SystemSettingsConfig>(systemSettingsMock);

  // Submit deposit
  const submitDeposit = (amount: number, refId: string, method: 'UPI' | 'Bank Transfer (NEFT/IMPS)' | 'Net Banking') => {
    const newDep: DepositRecord = {
      id: `dep_${Date.now()}`,
      referenceId: refId,
      memberId: user.memberId,
      memberName: user.fullName,
      amount,
      paymentMethod: method,
      transactionDate: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
      reviewerNotes: 'Submitted by user. Awaiting admin review.',
    };
    setDeposits(prev => [newDep, ...prev]);
    setUser(prev => ({ ...prev, depositStatus: 'Under Review' }));

    // Add Audit Log
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: user.email,
      role: 'System',
      action: 'SUBMITTED_MEMBERSHIP_DEPOSIT',
      module: 'Deposits',
      recordId: newDep.id,
      previousStatus: 'Not Started',
      newStatus: 'Pending',
      ipAddress: '103.45.12.89',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Review deposit (Admin)
  const reviewDeposit = (depositId: string, status: 'Verified' | 'Rejected', notes: string) => {
    setDeposits(prev => prev.map(dep => {
      if (dep.id === depositId) {
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
    } else if (status === 'Rejected') {
      setUser(prev => ({ ...prev, depositStatus: 'Rejected' }));
    }

    // Add Audit
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: 'admin.verify@luckyone.in',
      role: 'Reviewer',
      action: status === 'Verified' ? 'VERIFIED_MEMBER_DEPOSIT' : 'REJECTED_MEMBER_DEPOSIT',
      module: 'Deposits',
      recordId: depositId,
      previousStatus: 'Pending',
      newStatus: status,
      ipAddress: '49.207.181.12',
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Execute Daily 1 Gram Gold Spin (Day X selection)
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
      winnerMemberId: winnerSlot.memberId || `MB-${1000 + winnerSlot.slotNumber}`,
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

    setGroup(prev => ({
      ...prev,
      currentCycleDay: prev.currentCycleDay + 1,
      totalGoldDistributedGrams: prev.totalGoldDistributedGrams + 1,
      activePoolCount: prev.activePoolCount - 1,
      slots: updatedSlots,
    }));

    setPastWinners(prev => [newWinner, ...prev]);

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
      description: `${newWinner.winnerName} (${newWinner.winnerMemberId}) was awarded 1 Gram 24K Gold Coin!`,
      category: 'Reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Add Audit Log
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: 'admin.op@luckyone.in',
      role: 'Operations',
      action: 'EXECUTED_DAILY_GOLD_SELECTION',
      module: 'Rewards',
      recordId: `GRP-50-GOLD-01-DAY${currentDay}`,
      previousStatus: `Pool size: ${eligibleSlots.length}`,
      newStatus: `Winner: ${newWinner.winnerMemberId} | Pool size: ${eligibleSlots.length - 1}`,
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

  return (
    <AppContext.Provider value={{
      currentView,
      viewportMode,
      user,
      deposits,
      group,
      pastWinners,
      referrals,
      notifications,
      auditLogs,
      adminUsers,
      settings,
      setCurrentView,
      setViewportMode,
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
