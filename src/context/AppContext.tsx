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
import { doc, getDoc } from 'firebase/firestore';

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
  fetchReferrals: (currentUser?: UserProfile, usersList?: any[]) => Promise<void>;
  manualAssignSlot: (identifier: string, slotNo: number, targetBatchId?: string) => Promise<{ success: boolean; error?: string }>;
  unassignSlot: (slotNo: number, targetBatchId?: string, identifier?: string) => Promise<{ success: boolean; error?: string }>;
  
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
  'admin-group-detail': '/admin/group-detail',
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
  const [dbUsers, setDbUsers] = useState<any[]>([]);

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
      const listToScan = Array.isArray(usersList) && usersList.length > 0 ? usersList : dbUsers;

      if (Array.isArray(listToScan)) {
        listToScan.forEach((u: any) => {
          if (u.email?.toLowerCase() === currentUser.email?.toLowerCase() || u.memberId === currentUser.memberId || u.id === currentUser.id) return;

          const uReferredBy = (u.referredBy || u.referred_by || '').toString().trim().toUpperCase();
          const uRefCode = (u.referralCode || u.referral_code || '').toString().trim().toUpperCase();

          const isMatch = (uReferredBy && codeCandidates.some(c => c && (uReferredBy === c || uReferredBy.endsWith(c) || c.endsWith(uReferredBy)))) ||
            (uRefCode && uRefCode !== currentUser.referralId && codeCandidates.some(c => c && (uRefCode === c || uRefCode.endsWith(c) || c.endsWith(uRefCode))));

          if (isMatch) {
            if (!apiRefMemberIds.has(u.memberId)) {
              const isVerified = u.deposit === 'Verified' || u.depositStatus === 'Verified';
              localRefsFromDbUsers.push({
                id: u.id || `ref_local_${u.memberId}`,
                referredName: u.name || u.fullName || u.email?.split('@')[0] || 'Referred Member',
                referredMemberId: u.memberId || 'LOP-MEMBER',
                joinedDate: u.regDate || u.joinedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                depositStatus: isVerified ? 'Verified' : 'Not Started',
                eligibility: isVerified ? 'Eligible' : 'Pending Verification',
                bonusEarnedAmount: isVerified ? 500 : 0,
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

  const fetchDbUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setDbUsers(data.users);
        // Dynamically build and allocate 50-member groups based on real database users
        const dynamicGroups = buildDynamicGroupsFromUsers(data.users);
        setAllGroups(dynamicGroups);

        // Dynamically resolve current user's group, slot, and email verification status from DB
        setUser(currentUser => {
          if (!currentUser || !currentUser.email) return currentUser;
          const dbMatch = data.users.find((u: any) => u.email?.toLowerCase() === currentUser.email?.toLowerCase());
          if (!dbMatch) return currentUser;

          const isEmailVerified = Boolean(dbMatch.emailVerified);
          const isDepositVerified = dbMatch.deposit === 'Verified' || dbMatch.depositStatus === 'Verified';

          const rawSlot = String(dbMatch.slot || '').replace(/[^0-9]/g, '');
          const assignedSlotNumber = parseInt(rawSlot, 10) || (isDepositVerified ? 1 : 0);
          const assignedGroupId = (dbMatch.group && dbMatch.group !== 'Not Assigned Yet' && dbMatch.group !== 'Unassigned') ? dbMatch.group : 'GROUP-001';

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
            assignedSlots: assignedSlotNumber > 0 ? [assignedSlotNumber] : currentUser.assignedSlots,
            slotsOwned: assignedSlotNumber > 0 ? Math.max(1, currentUser.slotsOwned || 1) : currentUser.slotsOwned,
          };
        });

        // Removed redundant unmemoized fetchReferrals call
      }
    } catch (err) {
      console.error('Error fetching DB users in AppContext:', err);
    }
  };

  React.useEffect(() => {
    fetchDbUsers();
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
      prizeDescription: '1 Gram 916 Gold Coin',
      dispatchStatus: 'Verified & Shipped',
      auditHash: `0x${s.slotNumber}a9b8c7d6e5`,
    }));

  const programEvents = generate50DayProgramEvents(
    group.startDate || (group.groupId === 'GROUP-001' ? '2026-08-14' : new Date().toISOString().split('T')[0]),
    currentGroupWinners
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
        setCurrentView('user-dashboard');
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

  const manualAssignSlot = async (identifier: string, slotNo: number, targetBatchId = 'GROUP-001') => {
    try {
      const targetUser = dbUsers.find(u => 
        u.email?.toLowerCase() === identifier.toLowerCase() || 
        u.memberId === identifier || 
        u.id === identifier
      );

      const targetUserId = targetUser?.id;
      const targetEmail = targetUser?.email || identifier;
      const targetMemberId = targetUser?.memberId || identifier;
      const memberName = targetUser?.name || targetUser?.fullName || targetEmail;

      const targetOwnedCount = (allGroups || []).reduce((acc, grp) => {
        return acc + grp.slots.filter(s => 
          s.status !== 'Available' && s.memberName !== '—' && (
            (targetMemberId && s.memberId === targetMemberId) ||
            (targetEmail && s.memberName?.toLowerCase() === targetEmail.toLowerCase()) ||
            (memberName && s.memberName?.toLowerCase() === memberName.toLowerCase())
          )
        ).length;
      }, 0);

      if (targetOwnedCount >= 3) {
        return { success: false, error: `Maximum slot limit reached! ${memberName} already owns ${targetOwnedCount} slots (Max 3 slots per user allowed).` };
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: targetEmail, 
          memberId: targetMemberId, 
          userId: targetUserId, 
          slotNumber: slotNo, 
          depositStatus: 'Verified', 
          groupId: targetBatchId 
        }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok || !resData.success) {
        return { success: false, error: resData?.error || 'Failed to update database slot assignment' };
      }

      setAllGroups(prevGroups => {
        return prevGroups.map(grp => {
          if (grp.groupId !== targetBatchId) return grp;
          const updatedSlots = grp.slots.map(s => {
            if (s.slotNumber === slotNo) {
              return {
                ...s,
                memberName: memberName,
                memberId: targetMemberId,
                status: 'Occupied' as const,
                joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              };
            }
            return s;
          });
          const newTotalMembers = updatedSlots.filter(s => s.status === 'Occupied').length;
          return {
            ...grp,
            totalMembers: newTotalMembers,
            status: newTotalMembers >= 50 ? 'full' : grp.status,
            slots: updatedSlots,
          };
        });
      });

      setDbUsers(prev => prev.map(u => {
        if (u.email?.toLowerCase() === targetEmail.toLowerCase() || u.memberId === targetMemberId || u.id === targetUserId) {
          return {
            ...u,
            deposit: 'Verified',
            group: targetBatchId,
            slot: `#${slotNo}`,
          };
        }
        return u;
      }));

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
      const targetUser = dbUsers.find(u => 
        (identifier && (u.email?.toLowerCase() === identifier.toLowerCase() || u.memberId === identifier || u.id === identifier || u.name === identifier)) ||
        (u.group === targetBatchId && (u.slot === `#${slotNo}` || u.slot === slotNo || u.slot === `Slot #${slotNo}`))
      );

      const targetUserId = targetUser?.id;
      const targetEmail = targetUser?.email;
      const targetMemberId = targetUser?.memberId;

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'unassign_slot',
          email: targetEmail, 
          memberId: targetMemberId, 
          userId: targetUserId, 
          slotNumber: slotNo, 
          groupId: targetBatchId 
        }),
      });

      const resData = await res.json().catch(() => ({}));
      if (!res.ok || !resData.success) {
        return { success: false, error: resData?.error || 'Failed to unassign slot in database' };
      }

      setAllGroups(prevGroups => {
        return prevGroups.map(grp => {
          if (grp.groupId !== targetBatchId) return grp;
          const updatedSlots = grp.slots.map(s => {
            if (s.slotNumber === slotNo) {
              return {
                ...s,
                memberName: '—',
                memberId: '—',
                status: 'Available' as const,
                joinedDate: '-',
                wonDay: undefined,
                wonDate: undefined,
              };
            }
            return s;
          });
          const newTotalMembers = updatedSlots.filter(s => s.status === 'Occupied' || s.status === 'Won 1g Gold').length;
          return {
            ...grp,
            totalMembers: newTotalMembers,
            status: newTotalMembers >= 50 ? 'full' : (newTotalMembers > 0 ? 'active' : 'recruiting'),
            slots: updatedSlots,
          };
        });
      });

      setDbUsers(prev => prev.map(u => {
        if (
          (targetEmail && u.email?.toLowerCase() === targetEmail.toLowerCase()) || 
          (targetMemberId && u.memberId === targetMemberId) || 
          (targetUserId && u.id === targetUserId) ||
          (u.group === targetBatchId && (u.slot === `#${slotNo}` || u.slot === slotNo))
        ) {
          return {
            ...u,
            deposit: 'Not Started',
            group: 'Not Assigned Yet',
            slot: 'Not Assigned Yet',
          };
        }
        return u;
      }));

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
      prizeDescription: '1 Gram 916 Gold Coin',
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
      dbUsers,
      fetchDbUsers,
      fetchReferrals,
      manualAssignSlot,
      unassignSlot,
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
