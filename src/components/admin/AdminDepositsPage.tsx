'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, ShieldCheck, Check, X, Eye } from 'lucide-react';

export const AdminDepositsPage = () => {
  const { deposits, reviewDeposit, setCurrentView } = useApp();

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <span>Deposit Management & Verification Queue</span>
          </h1>
          <p className="text-xs text-slate-500">Reconcile membership ₹5,000 deposits against bank UTR statements.</p>
        </div>

        <button
          onClick={() => setCurrentView('admin-deposit-review')}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs"
        >
          Open Split-Screen Reviewer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
            <tr>
              <th className="p-3.5">Deposit ID</th>
              <th className="p-3.5">Member Name</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Method</th>
              <th className="p-3.5">UTR Reference</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {deposits.map(dep => (
              <tr key={dep.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono text-slate-500">{dep.id}</td>
                <td className="p-3.5 font-bold text-slate-900">{dep.memberName} ({dep.memberId})</td>
                <td className="p-3.5 font-bold text-slate-900">₹{dep.amount.toLocaleString('en-IN')}</td>
                <td className="p-3.5 text-slate-600">{dep.paymentMethod}</td>
                <td className="p-3.5 font-mono font-bold text-blue-600">{dep.referenceId}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    dep.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : dep.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {dep.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  {dep.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => reviewDeposit(dep.id, 'Verified', 'Approved by Admin Desk')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-[11px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewDeposit(dep.id, 'Rejected', 'Invalid UTR reference')}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1 rounded-lg text-[11px]"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
