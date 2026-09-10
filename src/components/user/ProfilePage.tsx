'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShieldCheck, Mail, Phone, Calendar, Award } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(name, email, mobile);
    setEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={user.avatar}
          alt={user.fullName}
          className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-md"
        />
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">{user.fullName}</h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-300">
              {user.accountStatus}
            </span>
          </div>
          <p className="text-xs font-mono text-blue-600 font-bold mt-1">Member ID: {user.memberId}</p>
          <p className="text-xs text-slate-500 mt-0.5">Assigned Group: Royal 50 Gold Club Batch A (Slot #14)</p>
        </div>
      </div>

      {/* Details Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-base font-bold text-slate-900">Personal & Account Information</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            {editing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Full Legal Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-slate-300 p-3 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-slate-300 p-3 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full bg-white border border-slate-300 p-3 rounded-xl" />
              </div>
            </div>
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl">Save Changes</button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Full Name</span>
              <p className="font-bold text-slate-900 text-sm">{user.fullName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Email Address</span>
              <p className="font-bold text-slate-900 text-sm">{user.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Mobile Number</span>
              <p className="font-bold text-slate-900 text-sm">{user.mobile}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Registration Date</span>
              <p className="font-bold text-slate-900 text-sm">{user.registrationDate}</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
