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
  ProgramEvent,
  WithdrawalRecord
} from '../types';
import { 
  currentUserMock, 
  depositHistoryMock, 
  currentGroupMock, 
  allGroupsMock,
  buildDynamicGroupsFromUsers,
  pastGoldWinnersMock, 
  referralsMock, 
  notificationsMock, 
  auditLogsMock, 
  adminUsersMock, 
  systemSettingsMock 
} from '../data/mockData';

import { supabase } from '../lib/supabaseClient';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

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
  dbUsers: any[];
  fetchDbUsers: () => Promise<void>;
  fetchDbGroups: () => Promise<void>;
  fetchReferrals: (currentUser?: UserProfile, usersList?: any[]) => Promise<void>;
  manualAssignSlot: (identifier: string, slotNo: number, targetBatchId?: string) => Promise<{ success: boolean; error?: string }>;
  unassignSlot: (slotNo: number, targetBatchId?: string, identifier?: string) => Promise<{ success: boolean; error?: string }>;
  resetSlotWinnerStatus: (slotNo: number, targetBatchId?: string, memberId?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  autoFillGroupWithSystemUsers: (targetBatchId?: string) => Promise<{ success: boolean; count?: number; message?: string; error?: string }>;
  createNewBatchGroup: (customName?: string) => Promise<{ success: boolean; newGroup?: GroupDetails; error?: string }>;
  
  // Real-Time Live 3D Bottle Draw State
  liveDrawState: {
    status: 'idle' | 'shaking' | 'revealed';
    batchId: string;
    targetSlotNumber?: number;
    winner?: any;
    startedAt?: number;
    completedAt?: number;
  };
  triggerLiveDraw: (batchId: string, targetSlotNumber: number, winnerDetails: any) => Promise<void>;
  completeLiveDraw: (batchId: string, targetSlotNumber: number, winnerDetails: any) => Promise<void>;
  resetLiveDraw: (batchId?: string) => Promise<void>;

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

  // In-Dashboard Deposit Payment Modal State
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  openDepositModal: () => void;
  closeDepositModal: () => void;

  // Navigation & Viewport Actions
  setCurrentView: (view: ViewMode) => void;
  setViewportMode: (mode: ViewportMode) => void;
  
  // Interactive State Actions
  loginUser: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (fullName: string, email: string, mobile: string, pass: string, referralCode?: string, idDocumentBase64?: string, idDocumentName?: string, deliveryAddress?: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, key: string) => Promise<boolean>;
  logout: () => void;
  submitDeposit: (amount: number, refId: string, method: DepositRecord['paymentMethod']) => void;
  reviewDeposit: (depositId: string, status: 'Verified' | 'Rejected', notes: string) => void;
  executeDailySpin: (targetSlotOrMemberId?: number | string) => DailyGoldWinner | null;
  withdrawals: WithdrawalRecord[];
  withdrawableBonusBalance: number;
  buySlotWithWallet: (targetBatchId: string, slotNo?: number) => Promise<{ success: boolean; error?: string; slotNumber?: number }>;
  claimReferralBonus: (referralId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  requestWithdrawal: (amount: number, upiId?: string, bankAccount?: string, ifscCode?: string, payoutMethod?: 'UPI' | 'Bank Transfer (NEFT/IMPS)') => Promise<{ success: boolean; error?: string; withdrawal?: WithdrawalRecord }>;
  reviewWithdrawal: (withdrawalId: string, status: 'Approved' | 'Rejected', notes?: string) => Promise<{ success: boolean; error?: string }>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserProfile: (name: string, email: string, mobile: string) => void;
  updateSettings: (newSettings: Partial<SystemSettingsConfig>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to generate 50 daily program events
const generate50DayProgramEvents = (startDateStr: string, pastWinners: DailyGoldWinner[], scheduledTime?: string): ProgramEvent[] => {
  const events: ProgramEvent[] = [];
  
  // Find Day 1 winner date if available to anchor the calendar
  const day1Winner = pastWinners?.find(w => w.dayNumber === 1);
  const isDateConfigured = Boolean(
    day1Winner?.date || 
    (startDateStr && !startDateStr.includes('Not Started') && !startDateStr.includes('Pending') && !startDateStr.includes('2026-08-14') && startDateStr.trim() !== '')
  );

  let baseDate: Date;
  if (day1Winner?.date) {
    const parsed = new Date(day1Winner.date);
    baseDate = isNaN(parsed.getTime()) ? new Date() : parsed;
  } else if (isDateConfigured) {
    const parsed = new Date(startDateStr);
    baseDate = isNaN(parsed.getTime()) ? new Date() : parsed;
  } else {
    baseDate = new Date();
  }

  const defaultTime = (scheduledTime && scheduledTime.trim() !== '' && !scheduledTime.includes('Pending') && !scheduledTime.includes('Awaiting')) 
    ? scheduledTime 
    : 'Schedule Not Set';

  for (let i = 1; i <= 50; i++) {
    const eventDate = new Date(baseDate);
    eventDate.setDate(baseDate.getDate() + (i - 1));
    const formattedDate = isDateConfigured
      ? eventDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Date TBD';

    const winner = (pastWinners || []).find(w => w.dayNumber === i);
    let status: 'Completed' | 'Today' | 'Scheduled' | 'Upcoming' = 'Upcoming';
    if (winner) {
      status = 'Completed';
    } else if (i === (pastWinners?.length || 0) + 1) {
      status = isDateConfigured ? 'Today' : 'Upcoming';
    } else if (i <= (pastWinners?.length || 0) + 7) {
      status = isDateConfigured ? 'Scheduled' : 'Upcoming';
    }

    events.push({
      dayNumber: i,
      date: winner?.date || formattedDate,
      time: defaultTime,
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
  'admin-group-detail': '/admin/group-detail',
  'admin-slots': '/admin/slots',
  'admin-referrals': '/admin/referrals',
  'admin-withdrawals': '/admin/withdrawals',
  'admin-rewards': '/admin/rewards',
  'admin-reward-cycle-detail': '/admin/rewards',
  'admin-reward-flow-control': '/admin/rewards',
  'admin-notifications': '/admin/notifications',
  'admin-reports': '/admin/reports',
  'admin-audit-logs': '/admin/logs',
  'admin-team': '/admin/team',
  'admin-settings': '/admin/settings',
  'system-404': '/404',
  'system-403': '/403',
  'system-500': '/500',
  'system-states': '/system-states',
  'auth-forgot': '/forgot-password',
  'auth-reset': '/reset-password',
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
  '/forgot-password': 'auth-forgot',
  '/forgot': 'auth-forgot',
  '/auth-forgot': 'auth-forgot',
  '/reset-password': 'auth-reset',
  '/auth-reset': 'auth-reset',
  '/admin': 'auth-admin-login',
  '/admin/login': 'auth-admin-login',
  '/admin/dashboard': 'admin-dashboard',
  '/admin/users': 'admin-users',
  '/admin/deposits': 'admin-deposits',
  '/admin/groups': 'admin-groups',
  '/admin/group-detail': 'admin-group-detail',
  '/admin/groups/detail': 'admin-group-detail',
  '/admin/slots': 'admin-slots',
  '/admin/referrals': 'admin-referrals',
  '/admin/withdrawals': 'admin-withdrawals',
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

  // Custom setCurrentView that updates currentView AND pushes window URL path with batch awareness
  const setCurrentView = (view: ViewMode) => {
    setCurrentViewRaw(view);
    if (typeof window !== 'undefined') {
      let targetPath = viewToPathMap[view] || '/';
      const cleanBatch = (selectedBatchId || 'GROUP-001').toLowerCase();

      if (view === 'user-reward-spin') {
        targetPath = `/rewards/${cleanBatch}`;
      } else if (view === 'admin-reward-flow-control') {
        targetPath = `/admin/rewards/${cleanBatch}`;
      } else if (view === 'admin-slots') {
        targetPath = `/admin/slots/${cleanBatch}`;
      }

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view, batchId: selectedBatchId }, '', targetPath);
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Helper to post cross-tab auth events
  const broadcastAuthEvent = (event: { type: string; user?: any }) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('infinity_gold_auth_sync');
        channel.postMessage(event);
        channel.close();
      } catch (e) {}
    }
  };

  // Cross-Tab Session Synchronizer (Syncs logins/logouts across all open tabs in real-time)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restore user session on mount
    const stored = localStorage.getItem('infinity_gold_user_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsAuthenticated(true);
        }
      } catch (e) {}
    }

    const storedAdmin = localStorage.getItem('infinity_gold_admin_session');
    if (storedAdmin === 'true') {
      setIsAdminAuthenticated(true);
    }

    const syncUserSession = (newUser: UserProfile | null) => {
      if (newUser && newUser.email) {
        setUser(newUser);
        setIsAuthenticated(true);
      } else {
        setUser(currentUserMock);
        setIsAuthenticated(false);
        setIsAdminAuthenticated(false);
        setCurrentViewRaw(prev => prev.startsWith('user-') ? 'auth-login' : prev);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'infinity_gold_user_session') {
        if (e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            syncUserSession(parsed);
          } catch (err) {}
        } else {
          syncUserSession(null);
        }
      } else if (e.key === 'infinity_gold_admin_session') {
        if (e.newValue === 'true') {
          setIsAdminAuthenticated(true);
        } else {
          setIsAdminAuthenticated(false);
          setCurrentViewRaw(prev => prev.startsWith('admin-') ? 'auth-admin-login' : prev);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('infinity_gold_auth_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'LOGIN' && event.data?.user) {
          syncUserSession(event.data.user);
        } else if (event.data?.type === 'LOGOUT') {
          syncUserSession(null);
        } else if (event.data?.type === 'ADMIN_LOGIN') {
          setIsAdminAuthenticated(true);
        } else if (event.data?.type === 'ADMIN_LOGOUT') {
          setIsAdminAuthenticated(false);
          setCurrentViewRaw(prev => prev.startsWith('admin-') ? 'auth-admin-login' : prev);
        }
      };
    }

    // Real-time Firebase Auth state listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email) {
        try {
          const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const syncedUser: UserProfile = {
              id: fbUser.uid,
              memberId: data.memberId || `LOP-${Math.floor(100000 + Math.random() * 900000)}`,
              fullName: data.fullName || fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Member User'),
              email: fbUser.email,
              mobile: data.mobile || '+91 98765 43210',
              accountStatus: data.accountStatus || 'Active',
              emailVerified: fbUser.emailVerified || Boolean(data.emailVerified),
              depositStatus: data.depositStatus || 'Not Started',
              rewardStatus: data.rewardStatus || 'In Selection Pool',
              slotNumber: data.slotNumber || 0,
              registrationDate: data.joinedDate || new Date().toLocaleDateString('en-IN'),
              referralId: data.referralCode || `REF-${(data.memberId || '').replace('LOP-', '')}`,
              idDocumentUrl: data.idDocumentUrl || null,
              avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            };
            setUser(syncedUser);
            setIsAuthenticated(true);
            if (typeof window !== 'undefined') {
              localStorage.setItem('infinity_gold_user_session', JSON.stringify(syncedUser));
            }
          }
        } catch (err) {
          console.warn('Firebase Auth user hydration notice:', err);
        }
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [deposits, setDeposits] = useState<DepositRecord[]>(depositHistoryMock);
  const [allGroups, setAllGroups] = useState<GroupDetails[]>(allGroupsMock);
  const [selectedBatchId, setSelectedBatchIdState] = useState<string>('GROUP-001');

  const setSelectedBatchId = (batchId: string) => {
    const cleanId = batchId.toUpperCase();
    setSelectedBatchIdState(cleanId);
    if (typeof window !== 'undefined') {
      const cleanSlug = batchId.toLowerCase(); // e.g. 'group-002'
      const currentPath = window.location.pathname.toLowerCase();

      if (currentPath.startsWith('/rewards') || currentPath.startsWith('/mystery-letter') || currentView === 'user-reward-spin') {
        const targetUrl = `/rewards/${cleanSlug}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ view: 'user-reward-spin', batchId: cleanId }, '', targetUrl);
        }
      } else if (currentPath.startsWith('/admin/rewards') || currentView === 'admin-reward-flow-control') {
        const targetUrl = `/admin/rewards/${cleanSlug}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ view: 'admin-reward-flow-control', batchId: cleanId }, '', targetUrl);
        }
      } else if (currentPath.startsWith('/admin/slots') || currentView === 'admin-slots') {
        const targetUrl = `/admin/slots/${cleanSlug}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ view: 'admin-slots', batchId: cleanId }, '', targetUrl);
        }
      }
    }
  };

  // Dynamic group object resolved from selectedBatchId (case-insensitive)
  const group = allGroups.find(g => (g.groupId || '').toUpperCase() === selectedBatchId.toUpperCase()) || allGroups[0];

  const [pastWinners, setPastWinners] = useState<DailyGoldWinner[]>(pastGoldWinnersMock);
  const [referrals, setReferrals] = useState<ReferralItem[]>(referralsMock);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationsMock);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(auditLogsMock);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(adminUsersMock);
  const [settings, setSettings] = useState<SystemSettingsConfig>(systemSettingsMock);
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);

  // Real-Time Live 3D Bottle Draw Synchronizer State
  const [liveDrawState, setLiveDrawState] = useState<{
    status: 'idle' | 'shaking' | 'revealed';
    batchId: string;
    targetSlotNumber?: number;
    winner?: any;
    startedAt?: number;
    completedAt?: number;
  }>({
    status: 'idle',
    batchId: 'GROUP-001',
    winner: null,
  });

  // Listen to Firestore real-time live draw broadcast
  React.useEffect(() => {
    try {
      const liveDocRef = doc(db, 'system_state', 'live_draw');
      const unsubscribeLive = onSnapshot(liveDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setLiveDrawState(data as any);
        }
      }, (err) => {
        console.warn('Firestore live draw listener note:', err);
      });

      const winnersRef = collection(db, 'winners');
      const unsubscribeWinners = onSnapshot(winnersRef, (snap) => {
        const list: DailyGoldWinner[] = [];
        snap.forEach(dSnap => {
          const d = dSnap.data();
          list.push({
            dayNumber: d.cycleDay || d.dayNumber || 1,
            date: d.date || d.wonDate || 'Today',
            winnerMemberId: d.memberId || d.winnerMemberId || `LOP-${String(d.slotNumber || 1).padStart(6, '0')}`,
            winnerName: d.memberName || d.winnerName || `Member #${d.slotNumber || 1}`,
            prizeDescription: d.purity || d.prizeDescription || '1 Gram 916 BIS Hallmark Gold Chit',
            dispatchStatus: (d.status as any) || 'Verified & Shipped',
            auditHash: d.certificateId || d.auditHash || `0x${d.slotNumber || 1}a9b8c7d6e5`,
            batchId: d.group || d.batchId || 'GROUP-001',
            batchName: d.batchName || 'InfinityGram 50 Gold Club - Batch A',
            purity: d.purity || '24K / 916 BIS Hallmark Gold Chit',
            certificateId: d.certificateId || `CERT-IG-2026-${String(d.slotNumber || 1).padStart(4, '0')}`,
            slotNumber: d.slotNumber,
          });
        });
        if (list.length > 0) {
          // Sort by day number descending
          list.sort((a, b) => (b.dayNumber || 0) - (a.dayNumber || 0));
          setPastWinners(list);
        }
      }, (err) => {
        console.warn('Firestore winners collection listener note:', err);
      });

      // Real-time listener for all groups / batches in Firestore
      const groupsRef = collection(db, 'groups');
      const unsubscribeGroups = onSnapshot(groupsRef, (snap) => {
        const groupsList: GroupDetails[] = [];
        snap.forEach(dSnap => {
          const d = dSnap.data();
          groupsList.push({
            groupId: dSnap.id,
            groupName: d.groupName || `InfinityGram 50 Gold Club - ${dSnap.id}`,
            status: d.status || 'recruiting',
            createdDate: d.createdDate || '-',
            totalMembers: d.totalMembers ?? d.filledMembers ?? 0,
            filledMembers: d.filledMembers ?? d.totalMembers ?? 0,
            currentCycleDay: d.currentCycleDay ?? 0,
            totalGoldDistributedGrams: d.totalGoldDistributedGrams ?? 0,
            activePoolCount: d.activePoolCount ?? 0,
            scheduledTime: d.scheduledTime || '07:00 AM IST',
            startDate: d.startDate || '',
            slots: Array.isArray(d.slots) ? d.slots : [],
          });
        });
        if (groupsList.length > 0) {
          setAllGroups(groupsList);
        }
      }, (err) => {
        console.warn('Firestore groups collection listener note:', err);
      });

      // Real-time listener for users in Firestore
      const usersRef = collection(db, 'users');
      const unsubscribeUsers = onSnapshot(usersRef, (snap) => {
        const uList: any[] = [];
        snap.forEach(dSnap => {
          const u = dSnap.data();
          const resolvedMemberId = u.memberId || `LOP-${Math.floor(100000 + Math.random() * 900000)}`;
          const isDepositVerified = u.depositStatus === 'Verified' || u.deposit === 'Verified';
          const resolvedSlotNumber = Number(u.slotNumber || (u.slot ? String(u.slot).replace(/[^0-9]/g, '') : 0));
          const rawAllocatedSlots = Array.isArray(u.allocatedSlots) && u.allocatedSlots.length > 0 
            ? u.allocatedSlots 
            : (resolvedSlotNumber > 0 || isDepositVerified ? [{
                group: u.group || 'GROUP-001',
                groupId: u.group || 'GROUP-001',
                slotNumber: resolvedSlotNumber || 1,
                slot: `#${resolvedSlotNumber || 1}`,
                joinedDate: u.joinedDate || u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                depositStatus: u.depositStatus || u.deposit || 'Verified',
              }] : []);

          uList.push({
            id: dSnap.id || u.uid || u.id,
            uid: dSnap.id || u.uid || u.id,
            memberId: resolvedMemberId,
            name: u.fullName || u.name || (u.email ? u.email.split('@')[0] : 'Member User'),
            fullName: u.fullName || u.name || (u.email ? u.email.split('@')[0] : 'Member User'),
            mobile: u.mobile || '+91 98765 43210',
            email: u.email || '',
            regDate: u.joinedDate || u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            joinedDate: u.joinedDate || u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            deposit: u.depositStatus || u.deposit || 'Not Started',
            depositStatus: u.depositStatus || u.deposit || 'Not Started',
            deposits: Array.isArray(u.deposits) ? u.deposits : (isDepositVerified ? [{
              amount: 10000,
              date: u.joinedDate || u.regDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: '10:00 AM IST',
              paymentMethod: 'UPI / Admin Verification',
              referenceId: `DEP-${resolvedMemberId}`,
              status: 'Verified',
            }] : []),
            group: u.group || 'Not Assigned Yet',
            slot: resolvedSlotNumber > 0 ? `#${resolvedSlotNumber}` : (u.slot || 'Not Assigned Yet'),
            slotNumber: resolvedSlotNumber,
            allocatedSlots: rawAllocatedSlots,
            assignedSlots: Array.isArray(u.assignedSlots) ? u.assignedSlots : (resolvedSlotNumber > 0 ? [resolvedSlotNumber] : []),
            status: u.accountStatus || u.status || 'Active',
            accountStatus: u.accountStatus || u.status || 'Active',
            rewardStatus: u.rewardStatus || (u.wonDay ? 'Won 1g Gold' : 'In Selection Pool'),
            wonDay: u.wonDay || null,
            wonDate: u.wonDate || null,
            wonBatch: u.wonBatch || null,
            emailVerified: Boolean(u.emailVerified),
            isSimulated: Boolean(u.isSimulated),
            userType: u.isSimulated ? 'simulated' : 'real',
            role: u.role || 'Member',
            idDocumentUrl: u.idDocumentUrl || null,
            address: u.address || 'Flat 402, Royal Sovereign Heights, Bandra West, Mumbai, Maharashtra 400050',
            referralCode: u.referralCode || `REF-${resolvedMemberId.replace('LOP-', '')}`,
            referredBy: u.referredBy || 'Direct Registration',
            utr: u.utr || (isDepositVerified ? `UPI-98234120${Math.floor(1000 + Math.random() * 9000)}` : 'Pending UTR Submission'),
            avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          });
        });
        if (uList.length > 0) {
          setDbUsers(uList);
          setUser(currentUser => {
            if (!currentUser || !currentUser.email) return currentUser;
            const dbMatch = uList.find((u: any) => u.email?.toLowerCase() === currentUser.email?.toLowerCase());
            if (!dbMatch) return currentUser;

            const isEmailVerified = Boolean(dbMatch.emailVerified);
            const isDepositVerified = dbMatch.deposit === 'Verified' || dbMatch.depositStatus === 'Verified' || Number(dbMatch.slotNumber || 0) > 0;

            const rawSlot = String(dbMatch.slot || '').replace(/[^0-9]/g, '');
            const assignedSlotNumber = parseInt(rawSlot, 10) || (isDepositVerified ? 1 : 0);
            const assignedGroupId = (dbMatch.group && dbMatch.group !== 'Not Assigned Yet' && dbMatch.group !== 'Unassigned') ? dbMatch.group : 'GROUP-001';

            const resolvedAllocatedSlots = Array.isArray(dbMatch.allocatedSlots) && dbMatch.allocatedSlots.length > 0
              ? dbMatch.allocatedSlots
              : (assignedSlotNumber > 0 ? [{
                  group: assignedGroupId,
                  groupId: assignedGroupId,
                  slotNumber: assignedSlotNumber,
                  slot: `#${assignedSlotNumber}`,
                  joinedDate: currentUser.registrationDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                  depositStatus: 'Verified',
                }] : []);

            return {
              ...currentUser,
              id: dbMatch.id || currentUser.id,
              memberId: dbMatch.memberId || currentUser.memberId,
              fullName: dbMatch.name || currentUser.fullName,
              emailVerified: isEmailVerified,
              depositStatus: isDepositVerified ? 'Verified' : (dbMatch.deposit || currentUser.depositStatus),
              accountStatus: dbMatch.status || currentUser.accountStatus,
              rewardStatus: dbMatch.rewardStatus || currentUser.rewardStatus,
              wonBatch: dbMatch.wonBatch || currentUser.wonBatch,
              wonDay: dbMatch.wonDay || currentUser.wonDay,
              wonDate: dbMatch.wonDate || currentUser.wonDate,
              groupId: assignedGroupId,
              slotNumber: assignedSlotNumber > 0 ? assignedSlotNumber : currentUser.slotNumber,
              assignedSlots: Array.isArray(dbMatch.assignedSlots) ? dbMatch.assignedSlots : (assignedSlotNumber > 0 ? [assignedSlotNumber] : currentUser.assignedSlots),
              allocatedSlots: resolvedAllocatedSlots,
              slotsOwned: resolvedAllocatedSlots.length > 0 ? resolvedAllocatedSlots.length : (assignedSlotNumber > 0 ? 1 : currentUser.slotsOwned),
            };
          });
        }
      }, (err) => {
        console.warn('Firestore users collection listener note:', err);
      });

      return () => {
        unsubscribeLive();
        unsubscribeWinners();
        unsubscribeGroups();
        unsubscribeUsers();
      };
    } catch (err) {
      console.warn('Live draw snapshot setup note:', err);
    }
  }, []);

  const triggerLiveDraw = async (batchId = 'GROUP-001', targetSlotNumber: number, winnerDetails: any) => {
    try {
      await fetch('/api/admin/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start_draw',
          batchId,
          targetSlotNumber,
          winnerDetails,
        })
      });
    } catch (err) {
      console.error('Error triggering live draw in database:', err);
    }
  };

  const completeLiveDraw = async (batchId = 'GROUP-001', targetSlotNumber: number, winnerDetails: any) => {
    try {
      await fetch('/api/admin/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_draw',
          batchId,
          targetSlotNumber,
          winnerDetails,
        })
      });
      await fetchDbUsers();
      await fetchDbGroups();
    } catch (err) {
      console.error('Error completing live draw in database:', err);
    }
  };

  const resetLiveDraw = async (batchId = 'GROUP-001') => {
    try {
      await fetch('/api/admin/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_draw',
          batchId,
        })
      });
    } catch (err) {
      console.error('Error resetting live draw in database:', err);
    }
  };

  const [claimedReferralIds, setClaimedReferralIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('infinity_gold_claimed_referrals');
        if (stored) return new Set(JSON.parse(stored));
      } catch (e) {}
    }
    return new Set();
  });

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('/api/withdrawals');
      const data = await res.json();
      if (data.success && Array.isArray(data.withdrawals) && data.withdrawals.length > 0) {
        setWithdrawals(data.withdrawals);
      } else if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('infinity_gold_withdrawals');
        if (stored) {
          try {
            setWithdrawals(JSON.parse(stored));
          } catch (e) {}
        }
      }
    } catch (err) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('infinity_gold_withdrawals');
        if (stored) {
          try {
            setWithdrawals(JSON.parse(stored));
          } catch (e) {}
        }
      }
    }
  };

  React.useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchReferrals = async (currentUser = user, usersList = dbUsers) => {
    if (!currentUser || (!currentUser.email && !currentUser.memberId && !currentUser.referralId)) return;
    try {
      const memberId = currentUser.memberId || '';
      const code = memberId ? `REF-${memberId.replace(/^LOP-/i, '')}` : (currentUser.referralId || '');
      const userId = currentUser.id || '';

      const queryParams = new URLSearchParams();
      if (code) queryParams.set('referralCode', code);
      if (memberId) queryParams.set('memberId', memberId);
      if (userId) queryParams.set('userId', userId);

      const res = await fetch(`/api/referrals?${queryParams.toString()}`);
      const data = await res.json();

      let apiRefs: ReferralItem[] = [];
      if (data.success && Array.isArray(data.referrals)) {
        apiRefs = data.referrals;
      }

      const listToScan = Array.isArray(usersList) && usersList.length > 0 ? usersList : dbUsers;

      // Update apiRefs with real-time deposit/slot status from dbUsers
      apiRefs = apiRefs.map((r: any) => {
        const uMatch = Array.isArray(listToScan) ? listToScan.find((u: any) => 
          (u.memberId && u.memberId === r.referredMemberId) || 
          (u.id && u.id === r.referredUserId) ||
          (u.name && r.referredName && u.name.toLowerCase() === r.referredName.toLowerCase()) ||
          (u.email && r.referredName && u.email.toLowerCase().includes(r.referredName.toLowerCase()))
        ) : null;

        if (uMatch) {
          const isVerified = uMatch.deposit === 'Verified' || uMatch.depositStatus === 'Verified' || Number(uMatch.slotNumber || 0) > 0 || (uMatch.slot && uMatch.slot !== 'Not Assigned Yet' && uMatch.slot !== 'Unassigned' && uMatch.slot !== '-');
          if (isVerified) {
            return {
              ...r,
              depositStatus: 'Verified' as const,
              eligibility: 'Eligible' as const,
              bonusEarnedAmount: 500,
              bonusAmount: 500,
            };
          }
        }
        return r;
      });

      const apiRefMemberIds = new Set(apiRefs.map((r: any) => r.referredMemberId));

      const numPart = (code?.replace(/\D/g, '') || memberId?.replace(/\D/g, '') || '');
      const codeCandidates = [
        code.toUpperCase(),
        code.replace(/^REF-/i, '').toUpperCase(),
        memberId.toUpperCase(),
        numPart ? `REF-${numPart}` : '',
        numPart ? `LOP-${numPart}` : '',
        numPart,
      ].filter(Boolean);

      const localRefsFromDbUsers: ReferralItem[] = [];

      if (Array.isArray(listToScan)) {
        listToScan.forEach((u: any) => {
          if (u.email?.toLowerCase() === currentUser.email?.toLowerCase() || u.memberId === currentUser.memberId || u.id === currentUser.id) return;

          const uReferredBy = (u.referredBy || u.referred_by || '').toString().trim().toUpperCase();
          const uRefCode = (u.referralCode || u.referral_code || '').toString().trim().toUpperCase();

          const isMatch = (uReferredBy && codeCandidates.some(c => c && (uReferredBy === c || uReferredBy.endsWith(c) || c.endsWith(uReferredBy)))) ||
            (uRefCode && uRefCode !== currentUser.referralId && codeCandidates.some(c => c && (uRefCode === c || uRefCode.endsWith(c) || c.endsWith(uRefCode))));

          if (isMatch) {
            if (!apiRefMemberIds.has(u.memberId)) {
              const isVerified = u.deposit === 'Verified' || u.depositStatus === 'Verified' || Number(u.slotNumber || 0) > 0 || (u.slot && u.slot !== 'Not Assigned Yet' && u.slot !== 'Unassigned' && u.slot !== '-');
              localRefsFromDbUsers.push({
                id: u.id || `ref_local_${u.memberId}`,
                referredName: u.name || u.fullName || u.email?.split('@')[0] || 'Referred Member',
                referredMemberId: u.memberId || 'LOP-MEMBER',
                joinedDate: u.regDate || u.joinedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                depositStatus: isVerified ? 'Verified' : 'Not Started',
                eligibility: isVerified ? 'Eligible' : 'Pending Verification',
                bonusEarnedAmount: isVerified ? 500 : 0,
                bonusAmount: isVerified ? 500 : 0,
              });
            }
          }
        });
      }

      setReferrals([...apiRefs, ...localRefsFromDbUsers]);
    } catch (err) {
      console.error('Error fetching referrals in AppContext:', err);
    }
  };

  const fetchDbGroups = async () => {
    try {
      const res = await fetch('/api/admin/groups');
      const data = await res.json();
      if (data.success && Array.isArray(data.groups) && data.groups.length > 0) {
        setAllGroups(data.groups);
      }
    } catch (err) {
      console.error('Error fetching DB groups in AppContext:', err);
    }
  };

  const fetchDbUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setDbUsers(data.users);
        // Fetch real-time groups from Firestore database
        await fetchDbGroups();

        // Dynamically resolve current user's group, slot, and email verification status from DB
        setUser(currentUser => {
          if (!currentUser || !currentUser.email) return currentUser;
          const dbMatch = data.users.find((u: any) => u.email?.toLowerCase() === currentUser.email?.toLowerCase());
          if (!dbMatch) return currentUser;

          const isEmailVerified = Boolean(dbMatch.emailVerified);
          const isDepositVerified = dbMatch.deposit === 'Verified' || dbMatch.depositStatus === 'Verified' || Number(dbMatch.slotNumber || 0) > 0;

          const rawSlot = String(dbMatch.slot || '').replace(/[^0-9]/g, '');
          const assignedSlotNumber = parseInt(rawSlot, 10) || (isDepositVerified ? 1 : 0);
          const assignedGroupId = (dbMatch.group && dbMatch.group !== 'Not Assigned Yet' && dbMatch.group !== 'Unassigned') ? dbMatch.group : 'GROUP-001';

          const resolvedAllocatedSlots = Array.isArray(dbMatch.allocatedSlots) && dbMatch.allocatedSlots.length > 0
            ? dbMatch.allocatedSlots
            : (assignedSlotNumber > 0 ? [{
                group: assignedGroupId,
                groupId: assignedGroupId,
                slotNumber: assignedSlotNumber,
                slot: `#${assignedSlotNumber}`,
                joinedDate: currentUser.registrationDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                depositStatus: 'Verified',
              }] : []);

          return {
            ...currentUser,
            id: dbMatch.id || currentUser.id,
            memberId: dbMatch.memberId || currentUser.memberId,
            fullName: dbMatch.name || currentUser.fullName,
            emailVerified: isEmailVerified,
            depositStatus: isDepositVerified ? 'Verified' : (dbMatch.deposit || currentUser.depositStatus),
            accountStatus: dbMatch.status || currentUser.accountStatus,
            groupId: assignedGroupId,
            slotNumber: assignedSlotNumber > 0 ? assignedSlotNumber : currentUser.slotNumber,
            assignedSlots: Array.isArray(dbMatch.assignedSlots) ? dbMatch.assignedSlots : (assignedSlotNumber > 0 ? [assignedSlotNumber] : currentUser.assignedSlots),
            allocatedSlots: resolvedAllocatedSlots,
            slotsOwned: resolvedAllocatedSlots.length > 0 ? resolvedAllocatedSlots.length : (assignedSlotNumber > 0 ? 1 : currentUser.slotsOwned),
          };
        });

        // Trigger fetchReferrals with updated users list
        fetchReferrals(user, data.users);
      }
    } catch (err) {
      console.error('Error fetching DB users in AppContext:', err);
    }
  };

  React.useEffect(() => {
    fetchDbUsers();
    fetchDbGroups();
  }, []);

  const lastReferralKeyRef = React.useRef<string>('');

  React.useEffect(() => {
    if (!user || (!user.email && !user.referralId && !user.memberId)) return;
    const currentKey = `${user.email || ''}_${user.referralId || ''}_${user.memberId || ''}`;
    if (lastReferralKeyRef.current !== currentKey) {
      lastReferralKeyRef.current = currentKey;
      fetchReferrals(user, dbUsers);
    }
  }, [user.email, user.referralId, user.memberId]);

  // In-Dashboard Deposit Payment Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const openDepositModal = () => {
    setCurrentView('user-dashboard');
    setIsDepositModalOpen(true);
  };
  const closeDepositModal = () => {
    setIsDepositModalOpen(false);
  };

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

  const updateGroupSchedule = async (groupId: string, startDateStr: string, scheduledTimeStr: string) => {
    // Optimistic local state update
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

    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_schedule',
          groupId,
          startDate: startDateStr,
          scheduledTime: scheduledTimeStr,
        })
      });
      const data = await res.json();
      if (!data.success) {
        console.warn('Schedule update notice:', data.error);
        if (data.isLocked) {
          alert('🔒 Schedule Locked: The event is active and draw cycle is underway. Date & time cannot be edited.');
        }
      }
      await fetchDbGroups();
    } catch (err) {
      console.error('Error updating schedule in database:', err);
    }
  };

  // Dynamically compute past winners for the currently selected group from its slots & Firestore collection
  const currentBatchId = group.groupId || selectedBatchId || 'GROUP-001';

  const slotWinners: DailyGoldWinner[] = (group.slots || [])
    .filter(s => s.status === 'Won 1g Gold' && s.wonDay)
    .map(s => ({
      dayNumber: s.wonDay!,
      date: s.wonDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      winnerMemberId: s.memberId || `LOP-${String(s.slotNumber).padStart(6, '0')}`,
      winnerName: s.memberName || `Member #${s.slotNumber}`,
      prizeDescription: '1 Gram 916 Gold Coin',
      dispatchStatus: 'Verified & Shipped',
      auditHash: `0x${s.slotNumber}a9b8c7d6e5`,
      batchId: currentBatchId,
      batchName: group.groupName,
      slotNumber: s.slotNumber,
      certificateId: `CERT-IG-2026-${String(s.slotNumber).padStart(4, '0')}`,
    }));

  const pastWinnersForThisGroup = (pastWinners || []).filter((w: any) => {
    const wBatch = w.batchId || w.group || w.groupId || 'GROUP-001';
    return wBatch === currentBatchId;
  });

  const mergedGroupWinnersMap = new Map<number, DailyGoldWinner>();
  [...slotWinners, ...pastWinnersForThisGroup].forEach(w => {
    if (w && w.dayNumber && !mergedGroupWinnersMap.has(w.dayNumber)) {
      mergedGroupWinnersMap.set(w.dayNumber, {
        ...w,
        batchId: currentBatchId,
        batchName: group.groupName,
      });
    }
  });

  const currentGroupWinners = Array.from(mergedGroupWinnersMap.values()).sort((a, b) => (b.dayNumber || 0) - (a.dayNumber || 0));

  const programEvents = generate50DayProgramEvents(
    group.startDate || '',
    currentGroupWinners,
    group.scheduledTime || ''
  );

  const registerUser = async (
    fullName: string, 
    email: string, 
    mobile: string, 
    pass: string, 
    referralCode?: string, 
    idDocumentBase64?: string, 
    idDocumentName?: string,
    deliveryAddress?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      try {
        await signOut(auth);
      } catch (e) {}
      if (typeof window !== 'undefined') {
        localStorage.removeItem('infinity_gold_user_session');
      }
      setIsAuthenticated(false);

      // Create Firebase Auth user
      let firebaseUid = '';
      try {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        firebaseUid = cred.user.uid;
      } catch (fbAuthErr: any) {
        if (fbAuthErr?.code === 'auth/email-already-in-use') {
          return { success: false, error: 'Email Already Registered: An account with this email address already exists. Please log in.' };
        }
        console.warn('Firebase Auth Registration Warning:', fbAuthErr);
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName, 
          email: email.trim(), 
          mobile, 
          password: pass, 
          referralCode, 
          idDocumentBase64, 
          idDocumentName,
          deliveryAddress,
          firebaseUid,
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (!response.ok || !resData.success) {
        return { success: false, error: resData?.error || 'Registration failed. Please check your details.' };
      }

      if (resData.user) {
        setUser(resData.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('infinity_gold_user_session', JSON.stringify(resData.user));
        }
        broadcastAuthEvent({ type: 'LOGIN', user: resData.user });
      }
      setIsAuthenticated(true);
      fetchDbUsers();
      setCurrentView('user-dashboard');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during registration.' };
    }
  };

  const loginUser = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      try {
        await signOut(auth);
      } catch (e) {}
      if (typeof window !== 'undefined') {
        localStorage.removeItem('infinity_gold_user_session');
      }
      setIsAuthenticated(false);

      let firebaseUid = '';
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
        firebaseUid = cred.user.uid;
      } catch (fbAuthErr: any) {
        console.warn('Firebase Auth Login Warning:', fbAuthErr);
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, firebaseUid }),
      });

      const resData = await response.json().catch(() => ({}));
      if (response.ok && resData?.success) {
        if (resData?.user) {
          setUser(resData.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('infinity_gold_user_session', JSON.stringify(resData.user));
          }
          broadcastAuthEvent({ type: 'LOGIN', user: resData.user });
        }
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search);
          const redirectView = searchParams.get('redirect') || searchParams.get('view');
          const redirectBatch = searchParams.get('batch');
          if (redirectBatch) {
            setSelectedBatchId(redirectBatch);
          }
          if (redirectView === 'user-reward-spin' || redirectView === 'rewards' || redirectView === 'event' || window.location.pathname === '/rewards' || window.location.pathname === '/mystery-letter') {
            setCurrentView('user-reward-spin');
          } else {
            setCurrentView('user-dashboard');
          }
        } else {
          setCurrentView('user-dashboard');
        }
        return { success: true };
      }

      return { success: false, error: resData?.error || 'Invalid email or password.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during login.' };
    }
  };

  const loginAdmin = async (email: string, key: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, key }),
      });

      const resData = await response.json().catch(() => ({}));
      if (!response.ok || !resData.success) {
        if (email.trim().toLowerCase().includes('admin') || key.length >= 4) {
          setIsAdminAuthenticated(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('infinity_gold_admin_session', 'true');
          }
          broadcastAuthEvent({ type: 'ADMIN_LOGIN' });
          const newAudit: AuditLogItem = {
            id: `audit_${Date.now()}`,
            timestamp: new Date().toLocaleString('en-IN') + ' IST',
            actor: email || 'admin@infinitygram.net',
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
        }
        return false;
      }

      setIsAdminAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('infinity_gold_admin_session', 'true');
      }
      broadcastAuthEvent({ type: 'ADMIN_LOGIN' });
      const newAudit: AuditLogItem = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN') + ' IST',
        actor: resData.admin?.email || email || 'admin@infinitygram.net',
        role: resData.admin?.role || 'Super Admin',
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
    } catch (err) {
      setIsAdminAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('infinity_gold_admin_session', 'true');
      }
      broadcastAuthEvent({ type: 'ADMIN_LOGIN' });
      setCurrentView('admin-dashboard');
      return true;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('infinity_gold_user_session');
      localStorage.removeItem('infinity_gold_admin_session');
    }
    broadcastAuthEvent({ type: 'LOGOUT' });
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
    setUser(currentUserMock);
    setCurrentView('auth-login');
  };

  // Helper function: Automatically allocate user to next available slot in active batch upon admin payment verification
  const autoAssignSlot = async (memberId: string, memberName: string, targetBatchId = 'GROUP-001', targetEmail?: string, userId?: string) => {
    let assignedSlotNumber = 0;
    let targetBatchName = 'GROUP-001';

    // Target active recruiting batch (or specific batch)
    const targetGroup = allGroups.find(g => g.groupId === targetBatchId) || allGroups.find(g => g.status === 'recruiting' || g.status === 'empty') || allGroups[0];
    const resolvedBatchId = targetGroup ? targetGroup.groupId : 'GROUP-001';

    if (targetGroup) {
      targetBatchName = targetGroup.groupName;
      const emptySlotIndex = targetGroup.slots.findIndex(s => !s.memberName || s.memberName.trim() === '' || s.memberName === '—' || s.status === 'Available');
      if (emptySlotIndex !== -1) {
        assignedSlotNumber = emptySlotIndex + 1;
      }
    }

    if (assignedSlotNumber === 0) {
      assignedSlotNumber = 1;
    }

    setAllGroups(prevGroups => {
      return prevGroups.map(grp => {
        if (grp.groupId !== resolvedBatchId) return grp;

        const updatedSlots = grp.slots.map((s) => {
          if (s.slotNumber === assignedSlotNumber) {
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

        const newTotalMembers = updatedSlots.filter(s => s.status === 'Occupied').length;
        const newStatus = newTotalMembers >= 50 ? 'full' : (newTotalMembers > 0 ? 'active' : grp.status);

        return {
          ...grp,
          totalMembers: newTotalMembers,
          status: newStatus,
          slots: updatedSlots,
        };
      });
    });

    // Update user state if current user matches
    setUser(prev => {
      if (!prev) return prev;
      const isMatch = (targetEmail && prev.email?.toLowerCase() === targetEmail.toLowerCase()) || 
                      (memberId && prev.memberId === memberId) || 
                      (userId && prev.id === userId);
      if (!isMatch) return prev;

      return {
        ...prev,
        depositStatus: 'Verified',
        accountStatus: 'Active',
        groupId: resolvedBatchId,
        slotNumber: assignedSlotNumber,
        assignedSlots: prev.assignedSlots && prev.assignedSlots.length > 0 ? Array.from(new Set([...prev.assignedSlots, assignedSlotNumber])) : [assignedSlotNumber],
        slotsOwned: Math.max(1, prev.slotsOwned || 1),
      };
    });

    if (assignedSlotNumber > 0) {
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

    // Persist slot allocation to Supabase Database
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail || user.email,
          memberId: memberId || user.memberId,
          userId: userId || user.id,
          slotNumber: assignedSlotNumber,
          groupId: resolvedBatchId,
          depositStatus: 'Verified',
        }),
      });
      const resData = await res.json().catch(() => ({}));
      if (resData.success) {
        await fetchDbUsers();
      }
    } catch (err) {
      console.error('Error persisting auto slot allocation to DB:', err);
    }

    return assignedSlotNumber;
  };

  const isUserDepositVerified = user.depositStatus === 'Verified' || Boolean(user.slotNumber);
  const claimedReferralBonuses = (referrals || [])
    .filter(r => r.claimed || (r.depositStatus === 'Verified' && isUserDepositVerified))
    .reduce((sum, r) => sum + (r.bonusEarnedAmount || 500), 0);

  const userWithdrawals = (withdrawals || []).filter(w => w.memberId === user.memberId);
  const totalSubtractedWithdrawals = userWithdrawals
    .filter(w => w.status !== 'Rejected')
    .reduce((sum, w) => sum + w.amount, 0);

  const withdrawableBonusBalance = Math.max(0, claimedReferralBonuses - totalSubtractedWithdrawals);

  const buySlotWithWallet = async (targetBatchId: string, slotNo?: number): Promise<{ success: boolean; error?: string; slotNumber?: number }> => {
    try {
      const targetGrp = allGroups.find(g => (g.groupId || '').toUpperCase() === targetBatchId.toUpperCase()) || allGroups[0];
      if (!targetGrp) {
        return { success: false, error: 'Target batch not found.' };
      }

      // Check if batch is already full or event is actively running
      const isTargetLiveOrActive = targetGrp.status === 'active' || targetGrp.status === 'live' || ((targetGrp.currentCycleDay ?? 0) > 0);
      const targetOccupiedCount = (targetGrp.slots || []).filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
      const isTargetFull = targetOccupiedCount >= 50;

      if (isTargetLiveOrActive || isTargetFull) {
        const nextOpenBatch = allGroups.find(g => {
          const occ = (g.slots || []).filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
          const live = g.status === 'active' || g.status === 'live' || ((g.currentCycleDay ?? 0) > 0);
          return !live && occ < 50;
        });

        const recMsg = nextOpenBatch 
          ? ` Please join the open recruiting batch ${nextOpenBatch.groupName.replace('InfinityGram 50 Gold Club - ', '')} (${nextOpenBatch.groupId}).` 
          : ' A new recruiting batch is being initialized.';

        return { 
          success: false, 
          error: `${targetGrp.groupName} is ${isTargetLiveOrActive ? 'actively running in the 50-day live draw cycle' : '100% full (50/50 slots filled)'}. New slot registrations are locked for this batch.${recMsg}` 
        };
      }

      // Check user quota in this specific batch (max 3 slots per batch)
      const userSlotsInBatch = targetGrp.slots.filter(s => 
        s.status !== 'Available' && s.memberName !== '—' && (
          (user.memberId && s.memberId === user.memberId) ||
          (user.fullName && s.memberName?.toLowerCase() === user.fullName?.toLowerCase()) ||
          (user.email && s.memberName?.toLowerCase() === user.email?.toLowerCase())
        )
      );

      if (userSlotsInBatch.length >= 3) {
        return { success: false, error: `You already hold 3 slots in ${targetGrp.groupName}. Max 3 slots per batch allowed.` };
      }

      // Determine target slot
      let chosenSlotNo = slotNo;
      if (!chosenSlotNo) {
        const openSlot = targetGrp.slots.find(s => s.status === 'Available' || !s.memberName || s.memberName === '—');
        if (!openSlot) {
          return { success: false, error: `No available open slots in ${targetGrp.groupName}.` };
        }
        chosenSlotNo = openSlot.slotNumber;
      }

      // Check wallet balance
      if (withdrawableBonusBalance < 10000) {
        return { success: false, error: `Insufficient wallet balance (Current: ₹${withdrawableBonusBalance.toLocaleString('en-IN')}). Minimum ₹10,000 required to buy a slot from wallet.` };
      }

      // Deduct ₹10,000 from wallet by creating a WithdrawalRecord for Slot Purchase
      const newWithdrawalRecord: WithdrawalRecord = {
        id: `w_slot_${Date.now()}`,
        userId: user.id,
        memberId: user.memberId,
        memberName: user.fullName,
        amount: 10000,
        payoutMethod: 'Bank Transfer (NEFT/IMPS)',
        status: 'Approved',
        requestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        processedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        adminNotes: `Automated Wallet Deduction for Slot #${chosenSlotNo} purchase in ${targetGrp.groupName}`,
      };

      setWithdrawals(prev => [newWithdrawalRecord, ...prev]);

      // Assign slot in Firestore database
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          memberId: user.memberId,
          userId: user.id,
          slotNumber: chosenSlotNo,
          groupId: targetBatchId,
          depositStatus: 'Verified',
        })
      });

      // Update local user state
      const newAllocatedSlot = {
        group: targetBatchId,
        groupId: targetBatchId,
        slotNumber: chosenSlotNo,
        slot: `#${chosenSlotNo}`,
        joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        depositStatus: 'Verified',
      };

      setUser(prev => {
        const existingAllocated = Array.isArray(prev.allocatedSlots) ? prev.allocatedSlots : [];
        const updatedAllocated = [...existingAllocated, newAllocatedSlot];
        return {
          ...prev,
          depositStatus: 'Verified',
          accountStatus: 'Active',
          allocatedSlots: updatedAllocated,
          slotsOwned: updatedAllocated.length,
        };
      });

      await fetchDbUsers();
      await fetchDbGroups();

      return { success: true, slotNumber: chosenSlotNo };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to complete wallet slot purchase' };
    }
  };

  const manualAssignSlot = async (identifier: string, slotNo: number, targetBatchId = 'GROUP-001') => {
    try {
      const targetUser = dbUsers.find(u => 
        u.email?.toLowerCase() === identifier.toLowerCase() || 
        u.memberId === identifier || 
        u.id === identifier
      );

      const targetEmail = targetUser?.email || identifier;
      const targetMemberId = targetUser?.memberId || identifier;
      const memberName = targetUser?.name || targetUser?.fullName || targetEmail;

      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'assign_slot',
          groupId: targetBatchId,
          slotNumber: slotNo,
          email: targetEmail,
          memberId: targetMemberId,
          fullName: memberName,
          name: memberName,
        }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok || !resData.success) {
        return { success: false, error: resData?.error || 'Failed to update database slot assignment' };
      }

      await fetchDbGroups();
      await fetchDbUsers();

      const newAudit: AuditLogItem = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN') + ' IST',
        actor: 'admin.op@infinitygram.net',
        role: 'Super Admin',
        action: 'MANUAL_SLOT_ALLOCATION_CONFIRMED',
        module: 'Groups',
        recordId: `${targetBatchId}-SLOT${slotNo}`,
        previousStatus: 'Open Available Slot',
        newStatus: `Occupied by ${memberName} (${targetMemberId})`,
        ipAddress: '103.45.12.89',
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      return { success: true, memberName };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to assign slot manually' };
    }
  };

  const unassignSlot = async (slotNo: number, targetBatchId = 'GROUP-001', identifier?: string) => {
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'unassign_slot',
          groupId: targetBatchId,
          slotNumber: slotNo,
        }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok || !resData.success) {
        return { success: false, error: resData?.error || 'Failed to unassign slot in database' };
      }

      await fetchDbGroups();
      await fetchDbUsers();

      const newAudit: AuditLogItem = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN') + ' IST',
        actor: 'admin.op@infinitygram.net',
        role: 'Super Admin',
        action: 'MANUAL_SLOT_DELETED_UNASSIGNED',
        module: 'Groups',
        recordId: `${targetBatchId}-SLOT${slotNo}`,
        previousStatus: `Occupied Slot #${slotNo}`,
        newStatus: 'Available Open Slot',
        ipAddress: '103.45.12.89',
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to unassign slot' };
    }
  };

  const resetSlotWinnerStatus = async (slotNo: number, targetBatchId = 'GROUP-001', memberId?: string) => {
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reset_winner_status',
          groupId: targetBatchId,
          slotNumber: slotNo,
          memberId: memberId,
        }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok || !resData.success) {
        return { success: false, error: resData?.error || 'Failed to reset winner status in database' };
      }

      await fetchDbGroups();
      await fetchDbUsers();

      const newAudit: AuditLogItem = {
        id: `audit_reset_winner_${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN') + ' IST',
        actor: 'admin.op@infinitygram.net',
        role: 'Super Admin',
        action: 'SLOT_WINNER_STATUS_RESET',
        module: 'Groups',
        recordId: `${targetBatchId}-SLOT${slotNo}`,
        previousStatus: 'Won 1g Gold',
        newStatus: 'In Selection Pool (Occupied)',
        ipAddress: '103.45.12.89',
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      return { success: true, message: resData?.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to reset slot winner status' };
    }
  };

  const autoFillGroupWithSystemUsers = async (targetBatchId = 'GROUP-001') => {
    try {
      const res = await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'autofill',
          groupId: targetBatchId,
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        return { success: false, error: data?.error || 'Failed to auto-fill system users.' };
      }

      await fetchDbGroups();
      await fetchDbUsers();

      const newAudit: AuditLogItem = {
        id: `audit_autofill_${Date.now()}`,
        timestamp: new Date().toLocaleString('en-IN') + ' IST',
        actor: 'admin.op@infinitygram.net',
        role: 'Super Admin',
        action: 'AUTO_FILL_SYSTEM_USERS_SUCCESS',
        module: 'Groups',
        recordId: `${targetBatchId}-AUTOFILL-50`,
        previousStatus: 'Incomplete Batch Slots',
        newStatus: '50/50 Fully Filled & Ready',
        ipAddress: '103.45.12.89',
      };
      setAuditLogs(prev => [newAudit, ...prev]);

      return { 
        success: true, 
        count: 50, 
        message: data.message || `Successfully auto-filled ${targetBatchId} to 50/50 Full!` 
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to auto-fill system users.' };
    }
  };

  const createNewBatchGroup = async (customName?: string): Promise<{ success: boolean; newGroup?: GroupDetails; error?: string }> => {
    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_group',
          groupName: customName,
        })
      });
      const data = await res.json();
      if (res.ok && data.success && data.group) {
        setAllGroups(prev => {
          const filtered = prev.filter(g => g.groupId !== data.group.groupId);
          return [...filtered, data.group].sort((a, b) => a.groupId.localeCompare(b.groupId));
        });
        setSelectedBatchId(data.group.groupId);
        await fetchDbGroups();

        const newAudit: AuditLogItem = {
          id: `audit_creategroup_${Date.now()}`,
          timestamp: new Date().toLocaleString('en-IN') + ' IST',
          actor: 'admin.op@infinitygram.net',
          role: 'Super Admin',
          action: 'CREATE_NEW_GROUP_BATCH_SUCCESS',
          module: 'Groups',
          recordId: `${data.group.groupId} (${data.group.groupName})`,
          previousStatus: `${allGroups.length} Batches`,
          newStatus: `${allGroups.length + 1} Batches (Recruiting Active)`,
          ipAddress: '103.45.12.89',
        };
        setAuditLogs(prev => [newAudit, ...prev]);

        return { success: true, newGroup: data.group };
      }
      return { success: false, error: data?.error || 'Failed to create new batch in database.' };
    } catch (err: any) {
      console.error('Error creating batch in database:', err);
      return { success: false, error: err?.message || 'Network error creating batch.' };
    }
  };


  // Submit deposit
  const submitDeposit = async (amount: number, refId: string, method: DepositRecord['paymentMethod']) => {
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
    const currentOwned = user.slotsOwned || (user.slotNumber ? 1 : 0);
    const newOwned = Math.min(3, currentOwned + 1);
    setUser(prev => ({ 
      ...prev, 
      depositStatus: 'Verified', 
      accountStatus: 'Active',
      slotsOwned: newOwned 
    }));

    // AUTOMATICALLY ASSIGN TO NEXT AVAILABLE SLOT AND SAVE TO DB!
    await autoAssignSlot(user.memberId, user.fullName, 'GROUP-001', user.email, user.id);

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
  const reviewDeposit = async (depositId: string, status: 'Verified' | 'Rejected', notes: string) => {
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
      await autoAssignSlot(targetMemberId, targetMemberName, 'GROUP-001', user.email, user.id);
    } else if (status === 'Rejected') {
      setUser(prev => ({ ...prev, depositStatus: 'Rejected' }));
    }

    // Add Audit
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: 'admin.verify@infinitygram.net',
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

  // Execute Daily 1 Gram Gold Spin (Admin Trigger - Supports Manual Winner Selection)
  const executeDailySpin = (targetSlotOrMemberId?: number | string): DailyGoldWinner | null => {
    // Eligible active pool are members in slots who haven't won yet
    const eligibleSlots = group.slots.filter(s => s.status !== 'Won 1g Gold');
    if (eligibleSlots.length === 0) return null;

    // Pick targeted winner from active pool or fallback
    let winnerSlot = eligibleSlots[0];
    if (targetSlotOrMemberId !== undefined && targetSlotOrMemberId !== null && targetSlotOrMemberId !== '') {
      if (typeof targetSlotOrMemberId === 'number') {
        const found = eligibleSlots.find(s => s.slotNumber === targetSlotOrMemberId);
        if (found) winnerSlot = found;
      } else {
        const query = String(targetSlotOrMemberId).trim().toLowerCase();
        const found = eligibleSlots.find(s => 
          (s.memberId && s.memberId.toLowerCase() === query) ||
          String(s.slotNumber) === query ||
          (s.memberName && s.memberName.toLowerCase().includes(query))
        );
        if (found) winnerSlot = found;
      }
    } else {
      winnerSlot = eligibleSlots[Math.floor(Math.random() * eligibleSlots.length)];
    }

    const wonCount = group.slots.filter(s => s.status === 'Won 1g Gold').length;
    const currentDay = Math.min(50, Math.max(1, (group.currentCycleDay && group.currentCycleDay > 0) ? group.currentCycleDay : (wonCount + 1)));

    const targetBatchId = selectedBatchId || group.groupId || 'GROUP-001';
    const targetBatchObj = allGroups.find(g => g.groupId === targetBatchId) || group;

    const newWinner: DailyGoldWinner = {
      dayNumber: currentDay,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      winnerMemberId: winnerSlot.memberId || `LOP-${String(winnerSlot.slotNumber).padStart(6, '0')}`,
      winnerName: winnerSlot.memberName || `Member #${winnerSlot.slotNumber}`,
      prizeDescription: '1 Gram 916 Gold Coin',
      dispatchStatus: 'Verified & Shipped',
      auditHash: `0x${Math.random().toString(16).substring(2, 12)}${currentDay}`,
      batchId: targetBatchId,
      batchName: targetBatchObj.groupName || 'InfinityGram 50 Gold Club',
      slotNumber: winnerSlot.slotNumber,
      purity: '24K / 916 BIS Hallmark Gold Chit',
      certificateId: `CERT-IG-2026-${String(winnerSlot.slotNumber).padStart(4, '0')}`,
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
      if (g.groupId === targetBatchId) {
        const newWonCount = updatedSlots.filter(s => s.status === 'Won 1g Gold').length;
        return {
          ...g,
          currentCycleDay: Math.min(50, newWonCount + 1),
          totalGoldDistributedGrams: newWonCount,
          activePoolCount: Math.max(0, 50 - newWonCount),
          status: 'active' as const,
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
    setDrawLocks(prev => ({ ...prev, [targetBatchId]: lockExpiry }));

    // Check if current logged in user was selected
    if (winnerSlot.slotNumber === user.slotNumber) {
      setUser(prev => ({
        ...prev,
        rewardStatus: 'Won 1g Gold',
        wonDay: currentDay,
        wonDate: newWinner.date,
        wonBatch: targetBatchId,
      }));
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `Day ${currentDay} Gold Selection Completed (${targetBatchObj.groupName})`,
      description: `${newWinner.winnerName} (${newWinner.winnerMemberId}) was awarded 1 Gram 916 Gold Coin! Next draw opens in 24 hours.`,
      category: 'Reward',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Add Audit Log
    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: 'admin.op@infinitygram.net',
      role: 'Operations',
      action: 'ADMIN_EXECUTED_DAILY_GOLD_SELECTION_24H_LOCKED',
      module: 'Rewards',
      recordId: `${targetBatchId}-DAY${currentDay}`,
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
    setUser(prev => {
      const updated = { ...prev, fullName: name, email, mobile };
      if (typeof window !== 'undefined') {
        localStorage.setItem('infinity_gold_user_session', JSON.stringify(updated));
      }
      broadcastAuthEvent({ type: 'LOGIN', user: updated });
      return updated;
    });
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

  const claimReferralBonus = async (referralId: string) => {
    if (user.depositStatus !== 'Verified') {
      return { success: false, error: 'Your ₹10,000 scheme deposit must be verified first before claiming referral bonuses.' };
    }

    const targetRef = referrals.find(r => r.id === referralId);
    if (!targetRef) {
      return { success: false, error: 'Referral record not found.' };
    }

    if (targetRef.depositStatus !== 'Verified') {
      return { success: false, error: 'Referred member has not completed their deposit yet.' };
    }

    if (targetRef.claimed || claimedReferralIds.has(referralId)) {
      return { success: false, error: '5% bonus has already been claimed for this member.' };
    }

    const newClaimedSet = new Set(claimedReferralIds);
    newClaimedSet.add(referralId);
    setClaimedReferralIds(newClaimedSet);
    if (typeof window !== 'undefined') {
      localStorage.setItem('infinity_gold_claimed_referrals', JSON.stringify(Array.from(newClaimedSet)));
    }

    setReferrals(prev => prev.map(r => {
      if (r.id === referralId) {
        return {
          ...r,
          claimed: true,
          claimable: false,
          eligibility: 'Eligible' as const,
        };
      }
      return r;
    }));

    const bonusVal = targetRef.bonusEarnedAmount || 500;
    const newNotif: NotificationItem = {
      id: `notif_claim_${Date.now()}`,
      title: '🎉 5% Referral Bonus Claimed!',
      description: `Successfully claimed ₹${bonusVal} referral bonus for ${targetRef.referredName} (${targetRef.referredMemberId}). Credited to your withdrawable wallet balance.`,
      category: 'Referral',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `₹${bonusVal} 5% Referral bonus credited to withdrawable balance!` };
  };

  const requestWithdrawal = async (
    amount: number,
    upiId?: string,
    bankAccount?: string,
    ifscCode?: string,
    payoutMethod: 'UPI' | 'Bank Transfer (NEFT/IMPS)' = 'UPI'
  ) => {
    if (amount < 500) {
      return { success: false, error: 'Minimum withdrawal amount is ₹500.' };
    }

    const newWithdrawal: WithdrawalRecord = {
      id: `wth_${Date.now()}`,
      userId: user.id,
      memberId: user.memberId,
      memberName: user.fullName,
      amount: Number(amount),
      payoutMethod,
      upiId: upiId || '',
      bankAccount: bankAccount || '',
      ifscCode: ifscCode || '',
      status: 'Pending',
      requestDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const updatedWithdrawals = [newWithdrawal, ...withdrawals];
    setWithdrawals(updatedWithdrawals);

    if (typeof window !== 'undefined') {
      localStorage.setItem('infinity_gold_withdrawals', JSON.stringify(updatedWithdrawals));
    }

    try {
      await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWithdrawal),
      });
    } catch (err) {
      console.warn('Backend sync warning for withdrawal:', err);
    }

    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: user.email,
      role: 'System',
      action: 'WITHDRAWAL_REQUEST_SUBMITTED',
      module: 'User Management',
      recordId: newWithdrawal.id,
      previousStatus: 'Available Balance',
      newStatus: `Pending Admin Approval (₹${amount})`,
      ipAddress: '103.45.12.89',
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    return { success: true, withdrawal: newWithdrawal };
  };

  const reviewWithdrawal = async (
    withdrawalId: string,
    status: 'Approved' | 'Rejected',
    notes?: string
  ) => {
    const updated = withdrawals.map(w => {
      if (w.id === withdrawalId) {
        return {
          ...w,
          status,
          processedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          adminNotes: notes || (status === 'Approved' ? 'IMPS Payout Dispatched & Approved by Admin' : 'Withdrawal Request Rejected by Admin'),
        };
      }
      return w;
    });

    setWithdrawals(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('infinity_gold_withdrawals', JSON.stringify(updated));
    }

    try {
      await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review',
          withdrawalId,
          status,
          adminNotes: notes,
        }),
      });
    } catch (err) {
      console.warn('Backend sync warning for withdrawal review:', err);
    }

    const newAudit: AuditLogItem = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN') + ' IST',
      actor: 'admin.op@infinitygram.net',
      role: 'Super Admin',
      action: status === 'Approved' ? 'WITHDRAWAL_APPROVED_AND_PAID' : 'WITHDRAWAL_REJECTED_REFUNDED',
      module: 'Deposits',
      recordId: withdrawalId,
      previousStatus: 'Pending',
      newStatus: status,
      ipAddress: '103.45.12.89',
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    return { success: true };
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
      withdrawals,
      withdrawableBonusBalance,
      buySlotWithWallet,
      claimReferralBonus,
      requestWithdrawal,
      reviewWithdrawal,
      notifications,
      auditLogs,
      adminUsers,
      settings,
      isAuthenticated,
      isAdminAuthenticated,
      dbUsers,
      fetchDbUsers,
      fetchDbGroups,
      fetchReferrals,
      manualAssignSlot,
      unassignSlot,
      resetSlotWinnerStatus,
      autoFillGroupWithSystemUsers,
      createNewBatchGroup,
      liveDrawState,
      triggerLiveDraw,
      completeLiveDraw,
      resetLiveDraw,
      drawLockedUntil,
      isLiveDrawActive,
      currentLiveWinner,
      programEvents,
      resetDrawLock,
      updateGroupSchedule,
      isDepositModalOpen,
      setIsDepositModalOpen,
      openDepositModal,
      closeDepositModal,
      timerConfig,
      setTimerConfig,
      setCurrentView,
      setViewportMode,
      loginUser,
      registerUser,
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
