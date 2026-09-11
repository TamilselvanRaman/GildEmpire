'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, Download } from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6 font-sans">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#0B1E39] flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Immutable Enterprise Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Cryptographic audit log trail recording all admin actions, deposit approvals, and daily gold selection events.</p>
        </div>

        <button className="bg-[#0B1E39] hover:bg-[#152D50] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-2 cursor-pointer transition-all">
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-black font-sans">
              <tr>
                <th className="p-4">Log Timestamp</th>
                <th className="p-4">Actor (Admin / System)</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action Code</th>
                <th className="p-4">Module</th>
                <th className="p-4">Previous → New State</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-slate-500">{log.timestamp}</td>
                  <td className="p-4 font-extrabold text-[#0B1E39] font-sans">{log.actor}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 border border-slate-200 text-[#0B1E39] font-sans px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-4 font-black text-amber-700">{log.action}</td>
                  <td className="p-4 font-sans font-semibold text-slate-700">{log.module}</td>
                  <td className="p-4 text-slate-700">
                    <span>{log.previousStatus}</span> <span className="text-slate-400 font-bold">→</span> <span className="font-extrabold text-emerald-600">{log.newStatus}</span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
