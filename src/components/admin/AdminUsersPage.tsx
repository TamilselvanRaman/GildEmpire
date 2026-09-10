'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, Download, Filter, ShieldCheck, MoreVertical } from 'lucide-react';

export const AdminUsersPage = () => {
  const { user, setCurrentView } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const usersList = [
    { id: 'usr_101', memberId: 'MB-8924', name: 'Rajesh Kumar Sharma', mobile: '+91 98765 43210', email: 'rajesh@example.com', regDate: '12 Aug 2026', deposit: 'Verified', group: 'GRP-50-GOLD-01', slot: 14, status: 'Active' },
    { id: 'usr_102', memberId: 'MB-4029', name: 'Priya Sundaram', mobile: '+91 98765 11223', email: 'priya@example.com', regDate: '15 Aug 2026', deposit: 'Verified', group: 'GRP-50-GOLD-01', slot: 2, status: 'Active' },
    { id: 'usr_103', memberId: 'MB-7712', name: 'Vikramaditya Singh', mobile: '+91 98765 44332', email: 'vikram@example.com', regDate: '10 Sep 2026', deposit: 'Pending', group: 'Unassigned', slot: '-', status: 'Pending Verification' },
    { id: 'usr_104', memberId: 'MB-1092', name: 'Ananya Deshmukh', mobile: '+91 98765 99887', email: 'ananya@example.com', regDate: '09 Sep 2026', deposit: 'Rejected', group: 'Unassigned', slot: '-', status: 'Deactivated' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Master Member Directory</span>
          </h1>
          <p className="text-xs text-slate-500">Filter, search, export, and audit 50-member group participants.</p>
        </div>

        <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Name, Member ID, Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-xs text-slate-900 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-slate-500">Status:</span>
          {['All', 'Active', 'Pending Verification', 'Deactivated'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3.5">Member ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Deposit</th>
                <th className="p-3.5">Assigned Group</th>
                <th className="p-3.5">Slot #</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {usersList.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-bold text-blue-600">{u.memberId}</td>
                  <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3.5 text-slate-600">
                    <p>{u.mobile}</p>
                    <p className="text-[10px] text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.deposit === 'Verified' ? 'bg-emerald-100 text-emerald-800' : u.deposit === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {u.deposit}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-700">{u.group}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">{u.slot}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setCurrentView('admin-user-detail')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-lg text-[11px]"
                    >
                      Audit Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
