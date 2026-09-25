'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Search, 
  Download, 
  PlusCircle, 
  ShieldCheck, 
  Shield, 
  UserPlus, 
  CheckCircle2, 
  Eye, 
  X, 
  Check, 
  Sparkles, 
  Key, 
  Lock,
  Mail,
  Phone,
  UserCheck,
  Building,
  Sliders,
  Wallet,
  Layers,
  FileText,
  ExternalLink,
  Clock,
  Maximize2,
  FileCheck,
  Upload,
  ArrowLeft,
  CreditCard,
  Network,
  BadgeCheck,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUsersPage = () => {
  const { setCurrentView, dbUsers, fetchDbUsers } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserModal, setSelectedUserModal] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'kyc' | 'logs' | 'scheme'>('info');
  const [kycVerifiedStatus, setKycVerifiedStatus] = useState<Record<string, boolean>>({});
  const [uploadingKyc, setUploadingKyc] = useState(false);

  const handleManualVerifyEmail = async (u: any) => {
    if (!u) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: u.id,
          email: u.email,
          memberId: u.memberId,
          action: 'verify_email',
          emailVerified: true,
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const updatedUser = { ...u, emailVerified: true };
        setUsersList(prev => prev.map(item => (item.id === u.id || item.email === u.email) ? updatedUser : item));
        if (selectedUserModal && (selectedUserModal.id === u.id || selectedUserModal.email === u.email)) {
          setSelectedUserModal(updatedUser);
        }
        alert(`✅ Email address for ${u.name || u.email} has been manually verified by Admin!`);
        fetchDbUsers();
      } else {
        alert(`❌ Failed to verify email: ${data?.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`❌ Network error while verifying email: ${err?.message || err}`);
    }
  };

  const handleVerifyUserDeposit = async (u: any) => {
    if (!u) return;
    try {
      const targetGroupId = (u.group && u.group !== 'Not Assigned Yet' && u.group !== 'Unassigned') ? u.group : 'GROUP-001';
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: u.id,
          email: u.email,
          memberId: u.memberId,
          depositStatus: 'Verified',
          groupId: targetGroupId,
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const updatedUser = { 
          ...u, 
          deposit: 'Verified', 
          depositStatus: 'Verified', 
          status: 'Active',
          group: targetGroupId
        };
        setUsersList(prev => prev.map(item => (item.id === u.id || item.memberId === u.memberId || item.email === u.email) ? updatedUser : item));
        if (selectedUserModal && (selectedUserModal.id === u.id || selectedUserModal.memberId === u.memberId)) {
          setSelectedUserModal(updatedUser);
        }
        alert(`🎉 Deposit for ${u.name || u.memberId} (₹10,000) has been VERIFIED by Admin!\nAssigned to group ${targetGroupId}.`);
        await fetchDbUsers();
      } else {
        alert(`❌ Failed to verify deposit: ${data?.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`❌ Network error while verifying deposit: ${err?.message || err}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUserModal) return;

    setUploadingKyc(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      const updatedUser = {
        ...selectedUserModal,
        idDocumentUrl: base64Data,
      };
      setSelectedUserModal(updatedUser);
      setUsersList(prev => prev.map(u => u.id === selectedUserModal.id ? updatedUser : u));

      try {
        await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: selectedUserModal.id,
            email: selectedUserModal.email,
            idDocumentUrl: base64Data,
          })
        });
      } catch (err) {}

      setUploadingKyc(false);
    };
    reader.readAsDataURL(file);
  };

  // New Admin / User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Operations' | 'Reviewer' | 'Auditor' | 'Member'>('Operations');
  const [userType, setUserType] = useState<'admin' | 'member'>('admin');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Granular Access Permissions Checkbox State
  const [accessDeposit, setAccessDeposit] = useState(true);
  const [accessGroups, setAccessGroups] = useState(true);
  const [accessDraw, setAccessDraw] = useState(true);
  const [accessSettings, setAccessSettings] = useState(false);

  const [usersList, setUsersList] = useState<any[]>([]);

  React.useEffect(() => {
    if (dbUsers && dbUsers.length > 0) {
      const members = dbUsers.filter(u => u.role === 'Member');
      setUsersList(members);

      // Auto-select user ONLY if URL path matches a specific user ID (/user/:id or /admin/users/:id)
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path === '/admin/users' || path === '/admin/users/') {
          setSelectedUserModal(null);
        } else if (path.startsWith('/user/') || path.startsWith('/admin/users/')) {
          const pathSegments = path.split('/').filter(Boolean);
          const lastSeg = pathSegments[pathSegments.length - 1];
          if (lastSeg && lastSeg !== 'users' && lastSeg !== 'user') {
            const found = members.find(u => 
              u.memberId === lastSeg || 
              u.id === lastSeg || 
              u.email === lastSeg
            );
            if (found) {
              setSelectedUserModal(found);
            } else {
              setSelectedUserModal(null);
            }
          } else {
            setSelectedUserModal(null);
          }
        }
      }
    }
  }, [dbUsers]);

  const openUserDetail = (u: any) => {
    setSelectedUserModal(u);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/user/${u.memberId || u.id}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const closeUserDetail = () => {
    setSelectedUserModal(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/admin/users');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const filteredUsers = usersList.filter(u => {
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Admins' ? u.role !== 'Member' :
      statusFilter === 'Email Verified' ? u.emailVerified === true :
      statusFilter === 'Email Unverified' ? !u.emailVerified :
      u.status === statusFilter;

    const matchesSearch = 
      !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.memberId.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search);

    return matchesStatus && matchesSearch;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    const newId = `usr_${Date.now()}`;
    const newMemberId = userType === 'admin' ? `ADM-${Math.floor(100 + Math.random() * 900)}` : `MB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = {
      id: newId,
      memberId: newMemberId,
      name: newFullName,
      mobile: newMobile || '+91 98765 12345',
      email: newEmail,
      regDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      deposit: userType === 'admin' ? 'Verified' : 'Pending',
      group: userType === 'admin' ? 'ALL GROUPS' : 'GROUP-003',
      slot: userType === 'admin' ? 'STAFF' : '42',
      status: 'Active',
      role: userType === 'admin' ? newRole : 'Member',
    };

    setUsersList([newUser, ...usersList]);
    setCreatedSuccess(true);

    setTimeout(() => {
      setCreatedSuccess(false);
      setShowCreateModal(false);
      setNewFullName('');
      setNewEmail('');
      setNewMobile('');
    }, 1200);
  };

  // If a specific user is selected (e.g. /user/:id view), render ONLY the Dedicated Full-Page View
  if (selectedUserModal) {
    const rawSlot = String(selectedUserModal.slot || '').replace(/^#+/, '').trim();
    const cleanSlotDisplay = (rawSlot && rawSlot !== '-' && rawSlot !== 'STAFF' && rawSlot !== 'ADMIN' && rawSlot !== '0' && rawSlot !== 'undefined' && rawSlot !== '' && rawSlot !== 'Not Assigned Yet')
      ? `Slot #${rawSlot}`
      : 'Not Assigned Yet';

    const displayGroup = (selectedUserModal.group && selectedUserModal.group !== 'Not Assigned Yet' && selectedUserModal.group !== 'Unassigned')
      ? selectedUserModal.group
      : 'Not Assigned Yet';

    const validAvatar = (selectedUserModal.avatar && typeof selectedUserModal.avatar === 'string' && (selectedUserModal.avatar.startsWith('http') || selectedUserModal.avatar.startsWith('data:'))) 
      ? selectedUserModal.avatar 
      : null;
    const nameInitial = selectedUserModal.name ? selectedUserModal.name.charAt(0).toUpperCase() : 'U';

    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
        
        {/* Top Bar Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={closeUserDetail}
            className="bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs flex items-center space-x-2 shadow-lg cursor-pointer transition-all border border-amber-400/40 hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Return to Master User Roster</span>
          </button>
        </div>

        {/* Sovereign Executive Full-Width Banner Header */}
        <div className="bg-gradient-to-r from-[#081E26] via-[#0D3B43] to-[#081E26] text-white p-8 sm:p-10 rounded-[2.5rem] border border-[#E1A238]/40 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E1A238]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00C2B8]/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-5">
              <div className="relative">
                {validAvatar ? (
                  <img 
                    src={validAvatar} 
                    alt={selectedUserModal.name} 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E1A238] shadow-xl bg-[#081E26]" 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00C2B8] via-[#0D3B43] to-[#081E26] text-[#F2C868] flex items-center justify-center font-black text-4xl shadow-xl border-2 border-[#E1A238] uppercase">
                    {nameInitial}
                  </div>
                )}
                <span className="w-5 h-5 rounded-full bg-[#00C2B8] border-2 border-[#081E26] absolute -bottom-1 -right-1"></span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-[#081E26] bg-[#F2C868] border border-amber-300 px-3.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedUserModal.role}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#00C2B8] bg-[#00C2B8]/10 border border-[#00C2B8]/30 px-3 py-1 rounded-full uppercase">
                    {selectedUserModal.status || 'Active'}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full uppercase">
                    {selectedUserModal.deposit === 'Verified' ? '₹10,000 Scheme Verified' : selectedUserModal.deposit}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight pt-1">
                  {selectedUserModal.name}
                </h1>
                
                <p className="text-xs font-mono font-extrabold text-[#00C2B8] flex flex-wrap items-center gap-2">
                  <span>Member ID: <strong className="text-[#F2C868]">{selectedUserModal.memberId}</strong></span>
                  <span>&bull;</span>
                  <span>Ref Code: <strong className="text-white">{selectedUserModal.referralCode || `REF-${(selectedUserModal.memberId || '898859').replace('LOP-', '')}`}</strong></span>
                  <span>&bull;</span>
                  <span>Referred By: <strong className="text-purple-300">{selectedUserModal.referredBy || 'Direct Registration'}</strong></span>
                  <span>&bull;</span>
                  <span>Group: <strong className="text-white">{displayGroup}</strong></span>
                  <span>&bull;</span>
                  <span>Slot Position: <strong className="text-[#F2C868]">{cleanSlotDisplay}</strong></span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {selectedUserModal.idDocumentUrl && (
                <a 
                  href={selectedUserModal.idDocumentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#00C2B8] hover:bg-[#00a8a0] text-[#081E26] font-black px-6 py-4 rounded-2xl text-xs flex items-center space-x-2 transition-all shadow-lg cursor-pointer"
                >
                  <ExternalLink className="w-4.5 h-4.5" />
                  <span>Inspect Full Size Image</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Section Anchor Navigation */}
          <div className="flex items-center space-x-3 pt-6 border-t border-[#0D3B43] overflow-x-auto scrollbar-none relative z-10">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              SINGLE PAGE MASTER VIEW:
            </span>
            <a
              href="#sec-overview"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#00C2B8]/20 text-[#00C2B8] border border-[#00C2B8]/40 hover:bg-[#00C2B8] hover:text-[#081E26] transition-all cursor-pointer whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>1. Legal Profile</span>
            </a>

            <a
              href="#sec-address"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0D3B43]/80 text-slate-200 hover:text-white hover:bg-[#0D3B43] transition-all cursor-pointer whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>2. Delivery Address</span>
            </a>

            <a
              href="#sec-referrals"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0D3B43]/80 text-slate-200 hover:text-white hover:bg-[#0D3B43] transition-all cursor-pointer whitespace-nowrap"
            >
              <Network className="w-4 h-4 text-purple-400" />
              <span>3. Referral Info</span>
            </a>

            <a
              href="#sec-scheme"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0D3B43]/80 text-slate-200 hover:text-white hover:bg-[#0D3B43] transition-all cursor-pointer whitespace-nowrap"
            >
              <Wallet className="w-4 h-4 text-[#F2C868]" />
              <span>4. Scheme Position</span>
            </a>

            <a
              href="#sec-logs"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0D3B43]/80 text-slate-200 hover:text-white hover:bg-[#0D3B43] transition-all cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-4 h-4 text-blue-400" />
              <span>5. Audit Trail</span>
            </a>
          </div>
        </div>

        {/* Full Single Page Cards Stack */}
        <div className="space-y-8">
          
          {/* 1. Member Legal Overview Card */}
          <div id="sec-overview" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2F6FED] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B1E39]">1. Member Legal Profile & Contact Details</h3>
                <p className="text-xs text-slate-500">Verified participant identity record in Supabase profiles database.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Legal Name</span>
                <p className="text-base font-extrabold text-[#0B1E39]">{selectedUserModal.name}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Member ID Code</span>
                <p className="text-base font-mono font-black text-[#2F6FED]">{selectedUserModal.memberId}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address & Verification</span>
                <p className="text-sm font-mono font-bold text-slate-800 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedUserModal.email}</span>
                </p>
                <div className="pt-1">
                  {selectedUserModal.emailVerified ? (
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-black inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Email Verified</span>
                    </span>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 w-fit">
                        <Mail className="w-4 h-4 text-amber-600" />
                        <span>Pending Email Verification</span>
                      </span>
                      <button
                        onClick={() => handleManualVerifyEmail(selectedUserModal)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-md transition-all w-fit"
                      >
                        <BadgeCheck className="w-4 h-4 text-emerald-200" />
                        <span>Verify Email Manually</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mobile Contact Number</span>
                <p className="text-sm font-mono font-bold text-slate-800 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{selectedUserModal.mobile}</span>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Assigned Batch Group</span>
                <p className="text-sm font-extrabold text-slate-900">{displayGroup}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Registration Date</span>
                <p className="text-sm font-bold text-slate-800">{selectedUserModal.regDate}</p>
              </div>
            </div>
          </div>

          {/* 2. Delivery & Shipping Address Card */}
          <div id="sec-address" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B1E39]">2. Delivery & Shipping Address</h3>
                <p className="text-xs text-slate-500">Member residential shipping address for 916 gold reward coin dispatch.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Shipping / Delivery Address</span>
              <p className="text-sm font-semibold text-[#0B1E39] leading-relaxed">
                {selectedUserModal.address || 'Flat 402, Royal Sovereign Heights, Bandra West, Mumbai, Maharashtra 400050'}
              </p>
            </div>
          </div>

          {/* 3. Referral Hierarchy & Network Card */}
          <div id="sec-referrals" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Network className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B1E39]">3. Referral Hierarchy & Sponsor Network</h3>
                <p className="text-xs text-slate-500">Sponsor lineage and referral code mapping for group enrollment.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Referred By / Sponsor</span>
                <p className="text-sm font-extrabold text-purple-900">{selectedUserModal.referredBy || 'Primary Sponsor (Direct Registration)'}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Personal Referral Code</span>
                <p className="text-base font-mono font-black text-[#2F6FED]">{selectedUserModal.referralCode || `REF-${(selectedUserModal.memberId || '898859').replace('LOP-', '')}`}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Network Group Privilege</span>
                <span className="text-xs font-bold text-purple-800 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full inline-block mt-1">
                  Active Member Downline Node
                </span>
              </div>
            </div>
          </div>

          {/* 4. 50-Slot Scheme Position Card */}
          <div id="sec-scheme" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B1E39]">4. 50-Slot Scheme Status & Deposit Position</h3>
                <p className="text-xs text-slate-500">Live allocation details for the 50-member 1g gold reward cycle.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Group</span>
                <p className="text-base font-extrabold text-[#0B1E39] mt-1">{displayGroup}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Slot Number Position</span>
                <p className="text-base font-mono font-black text-[#2F6FED] mt-1">{cleanSlotDisplay}</p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scheme Deposit Status</span>
                <div className="flex flex-col items-start gap-2 mt-2">
                  <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full inline-block ${
                    selectedUserModal.deposit === 'Verified'
                      ? 'text-emerald-700 bg-emerald-100 border border-emerald-300'
                      : 'text-amber-800 bg-amber-100 border border-amber-300'
                  }`}>
                    {selectedUserModal.deposit === 'Verified' ? '₹10,000 Verified' : selectedUserModal.deposit}
                  </span>
                  {selectedUserModal.deposit !== 'Verified' && (
                    <button
                      onClick={() => handleVerifyUserDeposit(selectedUserModal)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Verify ₹10,000 Scheme Deposit Now</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gold Draw Eligibility</span>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full inline-block mt-2">
                  Active Pool Candidate
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment UTR / Transaction Hash</span>
                <p className="text-sm font-mono font-black text-slate-800 mt-0.5">{selectedUserModal.utr || 'UPI-982341209811'}</p>
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                UPI Instant Bank Settlement
              </span>
            </div>
          </div>

          {/* 5. Audit Log & Activity Stream Card */}
          <div id="sec-logs" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0B1E39]">5. Audit Log & Activity Stream Timeline</h3>
                <p className="text-xs text-slate-500">Historical cryptographic audit entries logged for this user.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-black text-slate-900">Registration Complete & Profile Synchronized</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Joined Date: {selectedUserModal.regDate} &bull; Assigned Member ID: {selectedUserModal.memberId}</p>
                </div>
              </div>

              {selectedUserModal.idDocumentUrl && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs font-black text-slate-900">Legal ID Document Image Stored & Active in Supabase Storage</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Bucket: `id_documents/kyc/` &bull; Verified Public URL Active</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start space-x-4">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-xs font-black text-slate-900">50-Slot Pool Assignment</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Assigned to Group {selectedUserModal.group || 'GROUP-001'} &bull; 1g Gold Reward Selection Pool</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Return Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={closeUserDetail}
            className="bg-[#0B1E39] hover:bg-[#152D50] text-white font-black py-4 px-10 rounded-2xl text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xl border border-amber-400/40"
          >
            CLOSE EXECUTIVE AUDIT DETAILS & RETURN TO ROSTER
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans select-none">
      
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#0F284B] to-[#15345E] text-white p-6 sm:p-8 rounded-3xl border border-[#1A3860] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Master User Roster & Role Access Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            User & Sub-Admin Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            Manage 50-member group participants, assign Sub-Admin access roles, configure verification privileges, and export audit rosters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          {/* Create New User / Sub-Admin Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 px-6 rounded-2xl shadow-xl text-xs uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create New Sub-Admin / User</span>
          </button>
        </div>
      </div>

      {/* Corporate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">Total Enrolled Members</span>
          <p className="text-3xl font-black text-[#0B1E39] font-mono">{usersList.filter(u => u.role === 'Member').length} Members</p>
          <span className="text-slate-500 font-semibold">Across Active Group Batches</span>
        </div>

        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/90 space-y-2">
          <span className="text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">Verified Depositors</span>
          <p className="text-3xl font-black text-emerald-700 font-mono">{usersList.filter(u => u.deposit === 'Verified' && u.role === 'Member').length} Members</p>
          <span className="text-emerald-800 font-extrabold">₹10,000 Scheme Verified</span>
        </div>

        <div className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200/90 space-y-2">
          <span className="text-amber-900 font-extrabold uppercase tracking-wider text-[10px]">Sub-Admins & Roles</span>
          <p className="text-3xl font-black text-amber-800 font-mono">{usersList.filter(u => u.role !== 'Member').length} Staff Users</p>
          <span className="text-amber-900 font-bold">Super Admin • Operations • Reviewer</span>
        </div>

        <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/90 space-y-2">
          <span className="text-blue-900 font-extrabold uppercase tracking-wider text-[10px]">Pending Verification</span>
          <p className="text-3xl font-black text-[#2F6FED] font-mono">{usersList.filter(u => u.status === 'Pending Verification').length} In Queue</p>
          <span className="text-blue-900 font-bold">Awaiting Bank UTR Review</span>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center space-x-1.5 bg-slate-100/90 p-1.5 rounded-2xl w-full md:w-auto text-xs font-extrabold">
          {['All', 'Active', 'Admins', 'Email Verified', 'Email Unverified', 'Pending Verification', 'Deactivated'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                statusFilter === tab 
                  ? 'bg-[#0B1E39] text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Member ID, name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2F6FED]"
          />
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold font-sans tracking-wider">
              <tr>
                <th className="p-4">User ID / Code</th>
                <th className="p-4">Full Name Profile</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Role Access</th>
                <th className="p-4">Deposit Requirement</th>
                <th className="p-4">Assigned Group</th>
                <th className="p-4">Email Status</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((u) => {
                const isAdmin = u.role !== 'Member';
                const userInitial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
                const tableRawSlot = String(u.slot || '').replace(/^#+/, '').trim();
                const isNumericSlot = /^\d+$/.test(tableRawSlot);
                const tableSlotDisplay = (isNumericSlot && tableRawSlot !== '0') 
                  ? `(Slot #${tableRawSlot})` 
                  : '';

                return (
                  <tr 
                    key={u.id} 
                    onClick={() => openUserDetail(u)}
                    className="hover:bg-blue-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-mono font-black text-[#2F6FED] group-hover:underline">
                      {u.memberId}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm uppercase shrink-0 border ${
                          isAdmin 
                            ? 'bg-amber-100 text-amber-950 border-amber-300' 
                            : 'bg-gradient-to-br from-[#00C2B8] to-[#0B1E39] text-[#F2C868] border-[#E1A238]/60 shadow-sm'
                        }`}>
                          {userInitial}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0B1E39] text-xs group-hover:text-[#2F6FED] transition-colors">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Joined {u.regDate}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-mono text-slate-800 font-semibold">{u.mobile}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{u.email}</p>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'Super Admin' 
                          ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                          : u.role === 'Operations'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : u.role === 'Reviewer'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.deposit === 'Verified' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : u.deposit === 'Pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {u.deposit === 'Verified' ? '₹10,000 Verified' : u.deposit}
                        </span>
                        {u.deposit !== 'Verified' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyUserDeposit(u);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-2 py-0.5 rounded-lg text-[9px] cursor-pointer shadow-xs transition-all flex items-center space-x-1"
                            title="Verify ₹10,000 Deposit"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                            <span>Verify ₹10k Deposit</span>
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-700">
                      {u.group} {tableSlotDisplay}
                    </td>

                    <td className="p-4">
                      {u.emailVerified ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <div className="flex flex-col items-start gap-1">
                          <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-amber-600" />
                            <span>Unverified</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleManualVerifyEmail(u);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-2 py-0.5 rounded-lg text-[9px] cursor-pointer shadow-xs transition-all flex items-center space-x-1"
                            title="Verify Email Manually"
                          >
                            <BadgeCheck className="w-3 h-3 text-emerald-200" />
                            <span>Verify Email</span>
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openUserDetail(u);
                        }}
                        className="text-xs font-bold text-[#2F6FED] hover:underline inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Audit Profile</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ CREATE NEW SUB-ADMIN / USER MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white max-w-xl w-full rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                  <UserPlus className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Role & Access Configurator
                  </span>
                  <h3 className="text-xl font-black text-[#0B1E39] mt-1">Create New Sub-Admin or Member</h3>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-medium">
                
                {/* Account Type Selector */}
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`py-2.5 rounded-xl font-black transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      userType === 'admin' ? 'bg-[#0B1E39] text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Sub-Admin / Staff User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('member')}
                    className={`py-2.5 rounded-xl font-black transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      userType === 'member' ? 'bg-[#0B1E39] text-white shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Group Member User</span>
                  </button>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-[#0B1E39] font-extrabold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sen"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                  />
                </div>

                {/* Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#0B1E39] font-extrabold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@infinitygram.in"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0B1E39] font-extrabold mb-1">Mobile Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                    />
                  </div>
                </div>

                {/* Role Selection (If Sub-Admin) */}
                {userType === 'admin' && (
                  <div>
                    <label className="block text-[#0B1E39] font-extrabold mb-1">Select Access Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3.5 rounded-2xl font-bold focus:outline-none focus:border-[#2F6FED]"
                    >
                      <option value="Super Admin">👑 Super Admin (Full Control Vault Access)</option>
                      <option value="Operations">⚙️ Sub-Admin — Operations Lead (Group & Daily Spin Control)</option>
                      <option value="Reviewer">🔍 Sub-Admin — Reviewer Agent (Deposit & UTR Verification)</option>
                      <option value="Auditor">📊 Auditor (Read-Only Roster & Report Access)</option>
                    </select>
                  </div>
                )}

                {/* Granular Permissions Checklist */}
                {userType === 'admin' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-black text-[#0B1E39] block text-xs mb-2">Granular Module Privileges:</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessDeposit}
                          onChange={(e) => setAccessDeposit(e.target.checked)}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span className="font-bold text-slate-700">Deposit UTR Verification</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessGroups}
                          onChange={(e) => setAccessGroups(e.target.checked)}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span className="font-bold text-slate-700">Group & Slot Control</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessDraw}
                          onChange={(e) => setAccessDraw(e.target.checked)}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span className="font-bold text-slate-700">Daily Gold Spin Trigger</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={accessSettings}
                          onChange={(e) => setAccessSettings(e.target.checked)}
                          className="w-4 h-4 accent-amber-500 rounded"
                        />
                        <span className="font-bold text-slate-700">System Rules & Configuration</span>
                      </label>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-4 rounded-2xl shadow-xl text-xs uppercase tracking-wider cursor-pointer transition-all border border-amber-400/40 flex items-center justify-center space-x-2"
                >
                  {createdSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>User Created & Privileges Granted!</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-amber-400" />
                      <span>Create User & Grant Role Access</span>
                    </>
                  )}
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
