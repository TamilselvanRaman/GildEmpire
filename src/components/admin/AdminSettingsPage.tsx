'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sliders, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { settings, updateSettings } = useApp();
  const [capacity, setCapacity] = useState(settings.groupCapacity);
  const [goldGrams, setGoldGrams] = useState(settings.goldPrizeGramsPerDay);
  const [depositAmount, setDepositAmount] = useState(settings.depositAmountINR);
  const [spinTime, setSpinTime] = useState(settings.autoDailySpinTime);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      groupCapacity: Number(capacity),
      goldPrizeGramsPerDay: Number(goldGrams),
      depositAmountINR: Number(depositAmount),
      autoDailySpinTime: spinTime,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-600" />
            <span>System Business Rules & Configuration</span>
          </h1>
          <p className="text-slate-500 mt-1">Configurable operational settings for 50-member groups and daily gold selection timing.</p>
        </div>

        {saved && (
          <span className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Core Group & Gold Rules</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Group Capacity (Fixed Members)</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Gold Prize per Day (Grams)</label>
            <input
              type="number"
              value={goldGrams}
              onChange={(e) => setGoldGrams(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Membership Deposit Amount (₹ INR)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Automated Daily Spin Schedule</label>
            <input
              type="text"
              value={spinTime}
              onChange={(e) => setSpinTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl font-mono font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-md transition-all flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save System Business Rules</span>
        </button>
      </form>

    </div>
  );
};
