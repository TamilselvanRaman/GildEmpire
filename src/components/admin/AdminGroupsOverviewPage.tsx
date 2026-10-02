'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClockTimePicker } from '../common/ClockTimePicker';
import { 
  Users, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  ChevronRight, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Play, 
  Eye, 
  X,
  Lock,
  Edit3,
  Trash2,
  Save,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminGroupsOverviewPage = () => {
  const { allGroups, setSelectedBatchId, setCurrentView, updateGroupSchedule, fetchDbGroups } = useApp();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [targetBatchId, setTargetBatchId] = useState('GROUP-001');
  const [startDateInput, setStartDateInput] = useState('');
  const [scheduledTimeInput, setScheduledTimeInput] = useState('');
  const [newBatchName, setNewBatchName] = useState('');

  // Edit Group Form State
  const [editBatchId, setEditBatchId] = useState('');
  const [editBatchName, setEditBatchName] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editScheduledTime, setEditScheduledTime] = useState('');
  const [editStatus, setEditStatus] = useState<string>('recruiting');

  // Delete Group State
  const [deleteTargetGroup, setDeleteTargetGroup] = useState<{ id: string; name: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenScheduleModal = (groupId: string) => {
    const grp = allGroups.find(g => g.groupId === groupId);
    if (!grp) return;
    
    setTargetBatchId(groupId);
    setStartDateInput(grp.startDate || new Date().toISOString().split('T')[0]);
    setScheduledTimeInput(grp.scheduledTime || '');
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async () => {
    if (!startDateInput) {
      alert('Please select a valid event start date.');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateGroupSchedule(targetBatchId, startDateInput, scheduledTimeInput);
      setShowScheduleModal(false);
      alert(`✅ Success: Schedule updated for ${targetBatchId} and stored in database!`);
      if (typeof fetchDbGroups === 'function') await fetchDbGroups();
    } catch (e: any) {
      alert(`Error updating schedule: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal for a Group
  const handleOpenEditModal = (grp: any) => {
    setEditBatchId(grp.groupId);
    setEditBatchName(grp.groupName || '');
    setEditStartDate(grp.startDate || '');
    setEditScheduledTime(grp.scheduledTime || '');
    setEditStatus(grp.status || 'recruiting');
    setShowEditModal(true);
  };

  // Save Full Group Edits (Name, Schedule, Status)
  const handleSaveEditGroup = async () => {
    if (!editBatchName.trim()) {
      alert('Please enter a valid batch title.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'edit_group',
          groupId: editBatchId,
          groupName: editBatchName.trim(),
          startDate: editStartDate,
          scheduledTime: editScheduledTime,
          status: editStatus,
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        alert(`✅ Success! Batch ${editBatchId} updated in database.`);
        if (typeof fetchDbGroups === 'function') await fetchDbGroups();
      } else {
        alert(`Error updating batch: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Network error updating batch: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (grp: any) => {
    setDeleteTargetGroup({
      id: grp.groupId,
      name: grp.groupName || grp.groupId,
    });
    setShowDeleteModal(true);
  };

  // Execute Batch Deletion
  const handleConfirmDeleteGroup = async () => {
    if (!deleteTargetGroup) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_group',
          groupId: deleteTargetGroup.id,
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowDeleteModal(false);
        setDeleteTargetGroup(null);
        alert(`🗑️ Batch ${deleteTargetGroup.id} successfully deleted from database.`);
        if (typeof fetchDbGroups === 'function') await fetchDbGroups();
      } else {
        alert(`Error deleting batch: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Network error deleting batch: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewGroupSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_group',
          groupName: newBatchName || undefined,
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewBatchName('');
        alert(`🎉 Success! ${data.message}`);
        if (typeof fetchDbGroups === 'function') await fetchDbGroups();
      } else {
        alert(`Error creating batch: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Network error creating batch: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics across all dynamic batches
  const totalBatches = allGroups.length;
  const totalEnrolledMembers = allGroups.reduce((acc, g) => acc + (g.filledMembers || g.totalMembers || 0), 0);
  const activeBatchesCount = allGroups.filter(g => g.status === 'active' || g.status === 'live').length;
  const readyBatchesCount = allGroups.filter(g => (g.filledMembers || g.totalMembers) >= 50 && g.status !== 'active' && g.status !== 'live').length;

  return (
    <div className="space-y-6 pb-20 text-slate-900">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0B1E39] via-[#162D4A] to-[#0B1E39] p-6 sm:p-8 rounded-[2rem] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Database Synced Batches</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            50-Member Groups Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Monitor and administer all 50-member gold club batches. Each batch runs an independent 50-day cycle distributing 1g 916 gold daily to verified participants.
          </p>
        </div>

        <button
          onClick={() => {
            setNewBatchName('');
            setShowCreateModal(true);
          }}
          className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-amber-500/20 hover:scale-105 cursor-pointer flex items-center justify-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ CREATE NEW 50-MEMBER BATCH</span>
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Batches</span>
          <p className="text-2xl font-black text-[#0B1E39] font-mono">{activeBatchesCount}</p>
          <p className="text-[10px] text-emerald-600 font-bold">● Running 50-Day Cycles</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ready to Start</span>
          <p className="text-2xl font-black text-[#0B1E39] font-mono">{readyBatchesCount}</p>
          <p className="text-[10px] text-amber-600 font-bold">● 50/50 Slots Full</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Members</span>
          <p className="text-2xl font-black text-emerald-700 font-mono">{totalEnrolledMembers}</p>
          <p className="text-[10px] text-slate-500 font-bold">Across {totalBatches} Groups</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Batches</span>
          <p className="text-2xl font-black text-[#0B1E39] font-mono">{totalBatches}</p>
          <p className="text-[10px] text-amber-600 font-bold">50 Slots / Batch</p>
        </div>
      </div>

      {/* GROUPS LIST CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allGroups.map((g) => {
          const filled = g.filledMembers || g.totalMembers || 0;
          const percent = Math.min(100, Math.round((filled / 50) * 100));
          const isFull = filled >= 50;
          const isLive = g.status === 'active' || g.status === 'live' || (g.currentCycleDay && g.currentCycleDay > 0);

          return (
            <div
              key={g.groupId}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all p-6 space-y-5 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                
                {/* CARD HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-50 text-amber-900 border border-amber-300 text-xs font-mono font-black px-3 py-1 rounded-full">
                      {g.groupId}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                      isLive 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : isFull 
                          ? 'bg-teal-50 text-teal-700 border-teal-300'
                          : 'bg-blue-50 text-blue-700 border-blue-300'
                    }`}>
                      {isLive ? `Live (Day ${g.currentCycleDay || 1}/50)` : isFull ? 'Ready to Start' : `Recruiting (${filled}/50)`}
                    </span>
                  </div>

                  {/* QUICK TOP EDIT & DELETE BUTTONS */}
                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(g)}
                      title="Edit Batch Details"
                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg border border-transparent hover:border-amber-200 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(g)}
                      title="Delete Batch"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* GROUP TITLE */}
                <div>
                  <h3 className="text-xl font-black text-[#0B1E39] leading-snug">
                    {g.groupName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ₹10,000 / Slot • 50 Slots Max Capacity
                  </p>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">Member Fill Rate</span>
                    <span className="font-mono text-[#0B1E39] font-black">{filled} / 50 ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* SCHEDULE INFORMATION */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Start Date:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800">{g.startDate || 'Pending Setup'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Draw Time:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {g.scheduledTime && !g.scheduledTime.includes('Pending') && !g.scheduledTime.includes('Awaiting') && g.scheduledTime.trim() !== ''
                        ? g.scheduledTime
                        : '07:00 AM IST'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedBatchId(g.groupId);
                      setCurrentView('admin-slots');
                    }}
                    className="w-1/2 bg-slate-100 hover:bg-slate-200 text-[#0B1E39] font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Slots Grid</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedBatchId(g.groupId);
                      setCurrentView('admin-rewards');
                    }}
                    className="w-1/2 bg-[#0B1E39] hover:bg-[#122B4E] text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reward Program</span>
                  </button>
                </div>

                {/* EDIT BATCH & SCHEDULE BUTTON */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(g)}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Edit Batch & Schedule</span>
                  </button>

                  <button
                    onClick={() => handleOpenDeleteModal(g)}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✏️ COMPREHENSIVE EDIT BATCH MODAL */}
      <AnimatePresence>
        {showEditModal && (
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black">
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Edit Batch Configuration</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">Modify {editBatchId}</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Update batch name, schedule timing, and operational status in database.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {/* Batch Title */}
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Batch Group Title
                  </label>
                  <input
                    type="text"
                    value={editBatchName}
                    onChange={(e) => setEditBatchName(e.target.value)}
                    placeholder="e.g. InfinityGram 50 Gold Club - Batch A"
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Event Official Start Date */}
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Event Start Date
                  </label>
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Daily Draw Scheduled Time */}
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Daily Draw Time
                  </label>
                  <input
                    type="text"
                    value={editScheduledTime}
                    onChange={(e) => setEditScheduledTime(e.target.value)}
                    placeholder="e.g. 07:00 AM IST"
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Batch Status */}
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Batch Operational Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="recruiting">Recruiting (Members Joining)</option>
                    <option value="ready">Ready to Start (Slots Full)</option>
                    <option value="active">Active / Live (50-Day Cycle In Progress)</option>
                    <option value="completed">Completed (50 Days Concluded)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleSaveEditGroup}
                  className="w-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗑️ DELETE BATCH CONFIRMATION MODAL */}
      <AnimatePresence>
        {showDeleteModal && deleteTargetGroup && (
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-6 sm:p-8 border border-red-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center border border-red-200">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">Delete {deleteTargetGroup.id}?</h2>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Are you sure you want to permanently delete <strong className="text-slate-900">{deleteTargetGroup.name}</strong> ({deleteTargetGroup.id}) from the database? This action will remove its 50 slots and unassign any associated allocations.
                </p>
              </div>

              <div className="bg-red-50 p-3.5 rounded-2xl border border-red-200 text-xs text-red-800 font-bold space-y-1">
                <p className="flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Warning: This cannot be undone.</span>
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmDeleteGroup}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-2xl text-xs transition-all shadow-lg shadow-red-600/20 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Deleting...' : 'Confirm Delete'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📅 SCHEDULE CONFIGURATION MODAL */}
      <AnimatePresence>
        {showScheduleModal && (
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowScheduleModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Configure Schedule</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">Set Event Start & Draw Time</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Set the start date and daily draw time for <span className="font-mono text-amber-700 font-bold">{targetBatchId}</span>. This saves directly to the database and syncs across all pages.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Event Official Start Date
                  </label>
                  <input
                    type="date"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <ClockTimePicker
                  label="Daily Draw Scheduled Time"
                  value={scheduledTimeInput || '07:00 AM IST'}
                  onChange={(formatted) => setScheduledTimeInput(formatted)}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleSaveSchedule}
                  className="w-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : 'Save Schedule'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ➕ CREATE NEW 50-MEMBER BATCH GROUP MODAL */}
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
              className="bg-white max-w-md w-full rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative text-left"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black">
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  <span>New Group Expansion</span>
                </div>
                <h2 className="text-2xl font-black text-[#0B1E39]">Create New 50-Member Batch</h2>
                <p className="text-xs text-slate-600 font-medium">
                  Initialize a brand new 50-slot group batch. Once created, users can register and purchase slots in this batch.
                </p>
              </div>

              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Assigned Batch ID:</span>
                  <span className="font-mono text-amber-800 font-black">GROUP-{String(allGroups.length + 1).padStart(3, '0')}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>Slot Capacity:</span>
                  <span className="font-mono text-[#0B1E39] font-black">50 Open Slots (₹10,000 / Slot)</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block">
                    Group Batch Title
                  </label>
                  <input
                    type="text"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    placeholder="e.g. InfinityGram 50 Gold Club - Batch B"
                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleCreateNewGroupSubmit}
                  className="w-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-amber-950 font-black py-3.5 rounded-2xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSubmitting ? 'Creating...' : 'Create Batch'}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
