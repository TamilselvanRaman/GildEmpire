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
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminUsersPage = () => {
  const { setCurrentView } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserModal, setSelectedUserModal] = useState<any>(null);

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

  const initialUsersList = [
    { id: 'usr_101', memberId: 'MB-8924', name: 'Rajesh Kumar Sharma', mobile: '+91 98765 43210', email: 'rajesh@example.com', regDate: '12 Aug 2026', deposit: 'Verified', group: 'GROUP-001', slot: '14', status: 'Active', role: 'Member' },
    { id: 'usr_102', memberId: 'MB-4029', name: 'Priya Sundaram', mobile: '+91 98765 11223', email: 'priya@example.com', regDate: '15 Aug 2026', deposit: 'Verified', group: 'GROUP-001', slot: '2', status: 'Active', role: 'Member' },
    { id: 'usr_103', memberId: 'MB-7712', name: 'Vikramaditya Singh', mobile: '+91 98765 44332', email: 'vikram@example.com', regDate: '10 Sep 2026', deposit: 'Pending', group: 'GROUP-003', slot: '41', status: 'Pending Verification', role: 'Member' },
    { id: 'usr_104', memberId: 'MB-1092', name: 'Ananya Deshmukh', mobile: '+91 98765 99887', email: 'ananya@example.com', regDate: '09 Sep 2026', deposit: 'Rejected', group: 'Unassigned', slot: '-', status: 'Deactivated', role: 'Member' },
    { id: 'adm_201', memberId: 'ADM-001', name: 'Vikram Roy', mobile: '+91 98765 00001', email: 'superadmin@infinitygram.in', regDate: '01 Aug 2026', deposit: 'Verified', group: 'ALL GROUPS', slot: 'ADMIN', status: 'Active', role: 'Super Admin' },
    { id: 'adm_202', memberId: 'ADM-002', name: 'Ananya Sen', mobile: '+91 98765 00002', email: 'admin.op@infinitygram.in', regDate: '05 Aug 2026', deposit: 'Verified', group: 'ALL GROUPS', slot: 'STAFF', status: 'Active', role: 'Operations' },
    { id: 'adm_203', memberId: 'ADM-003', name: 'Karthik Raja', mobile: '+91 98765 00003', email: 'admin.verify@infinitygram.in', regDate: '10 Aug 2026', deposit: 'Verified', group: 'VERIFY DESK', slot: 'STAFF', status: 'Active', role: 'Reviewer' },
  ];

  const [usersList, setUsersList] = useState(initialUsersList);

  const filteredUsers = usersList.filter(u => {
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Admins' ? u.role !== 'Member' :
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
          <p className="text-3xl font-black text-[#0B1E39] font-mono">140 Members</p>
          <span className="text-slate-500 font-semibold">Across 5 Group Batches</span>
        </div>

        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200/90 space-y-2">
          <span className="text-emerald-900 font-extrabold uppercase tracking-wider text-[10px]">Verified Depositors</span>
          <p className="text-3xl font-black text-emerald-700 font-mono">140 Members</p>
          <span className="text-emerald-800 font-extrabold">₹10,000 Deposit Verified</span>
        </div>

        <div className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200/90 space-y-2">
          <span className="text-amber-900 font-extrabold uppercase tracking-wider text-[10px]">Sub-Admins & Roles</span>
          <p className="text-3xl font-black text-amber-800 font-mono">3 Staff Users</p>
          <span className="text-amber-900 font-bold">Super Admin • Operations • Reviewer</span>
        </div>

        <div className="bg-blue-50/80 p-6 rounded-3xl border border-blue-200/90 space-y-2">
          <span className="text-blue-900 font-extrabold uppercase tracking-wider text-[10px]">Pending Verification</span>
          <p className="text-3xl font-black text-[#2F6FED] font-mono">1 In Queue</p>
          <span className="text-blue-900 font-bold">Awaiting Bank UTR Review</span>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center space-x-1.5 bg-slate-100/90 p-1.5 rounded-2xl w-full md:w-auto text-xs font-extrabold">
          {['All', 'Active', 'Admins', 'Pending Verification', 'Deactivated'].map((tab) => (
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
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredUsers.map((u) => {
                const isAdmin = u.role !== 'Member';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-black text-[#2F6FED]">
                      {u.memberId}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                          isAdmin 
                            ? 'bg-amber-100 text-amber-950 border border-amber-300' 
                            : 'bg-blue-50 text-[#2F6FED]'
                        }`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0B1E39] text-xs">
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        u.deposit === 'Verified' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : u.deposit === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {u.deposit === 'Verified' ? '₹10,000 Verified' : u.deposit}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-700">
                      {u.group} {u.slot !== '-' && u.slot !== 'STAFF' && u.slot !== 'ADMIN' ? `(Slot #${u.slot})` : ''}
                    </td>

                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedUserModal(u)}
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

      {/* MEMBER / USER AUDIT MODAL */}
      <AnimatePresence>
        {selectedUserModal && (
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
              className="bg-white max-w-lg w-full rounded-[2.5rem] p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setSelectedUserModal(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B1E39] to-[#2F6FED] text-white flex items-center justify-center font-black text-xl shadow-lg">
                  {selectedUserModal.name.charAt(0)}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase">
                    {selectedUserModal.role}
                  </span>
                  <h3 className="text-xl font-black text-[#0B1E39] mt-1">
                    {selectedUserModal.name}
                  </h3>
                  <p className="text-xs font-mono font-extrabold text-[#2F6FED]">
                    ID: {selectedUserModal.memberId}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Account Role:</span>
                  <span className="font-black text-[#0B1E39]">{selectedUserModal.role}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Assigned Group:</span>
                  <span className="font-bold text-slate-800">{selectedUserModal.group}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Deposit Requirement:</span>
                  <span className="font-mono text-emerald-700 font-black">{selectedUserModal.deposit}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Email Address:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedUserModal.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Mobile Contact:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedUserModal.mobile}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 font-medium">Registration Date:</span>
                  <span className="font-semibold text-slate-800">{selectedUserModal.regDate}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserModal(null)}
                className="w-full bg-[#0B1E39] hover:bg-[#152D50] text-white font-extrabold py-4 rounded-2xl shadow-xl text-xs uppercase tracking-wider cursor-pointer transition-all border border-amber-400/40"
              >
                Close Audit Profile Window
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
