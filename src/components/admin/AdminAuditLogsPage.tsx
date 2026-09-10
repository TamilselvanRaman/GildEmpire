'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck2, ShieldCheck, Download, Filter } from 'lucide-react';

export const AdminAuditLogsPage = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-amber-600" />
            <span>Immutable Enterprise Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500">Cryptographic audit log trail recording all admin actions, deposit approvals, and daily gold selection events.</p>
        </div>

        <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5">
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold font-sans">
              <tr>
                <th className="p-3.5">Log Timestamp</th>
                <th className="p-3.5">Actor (Admin / System)</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Previous $\rightarrow$ New State</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3.5 text-slate-500">{log.timestamp}</td>
                  <td className="p-3.5 font-bold text-slate-900 font-sans">{log.actor}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-800 font-sans px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-amber-700">{log.action}</td>
                  <td className="p-3.5 font-sans font-medium text-slate-600">{log.module}</td>
                  <td className="p-3.5 text-slate-700">
                    <span>{log.previousStatus}</span> $\rightarrow$ <span className="font-bold text-emerald-600">{log.newStatus}</span>
                  </td>
                  <td className="p-3.5 text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
