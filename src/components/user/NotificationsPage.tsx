'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Filter } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filter, setFilter] = useState<string>('All');

  const filteredNotifications = notifications.filter(n => filter === 'All' || n.category === filter);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500">Real-time alerts for deposit verifications, daily gold reward selections, and group updates.</p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0"
        >
          <CheckCheck className="w-4 h-4 text-emerald-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 bg-white p-3 rounded-xl border border-slate-200">
        {['All', 'Account', 'Deposit', 'Group', 'Reward', 'Referral'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredNotifications.map(n => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
              !n.read ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-slate-200'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                  {n.category}
                </span>
                <h4 className={`text-xs font-bold ${!n.read ? 'text-blue-950 font-extrabold' : 'text-slate-900'}`}>{n.title}</h4>
                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{n.description}</p>
              <p className="text-[10px] text-slate-400 font-mono">{n.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
