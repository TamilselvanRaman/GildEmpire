'use me';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X, Sun, Moon, Sparkles, ChevronDown } from 'lucide-react';

interface ClockTimePickerProps {
  value: string;
  onChange: (formattedValue: string, timeOnly: string, amPm: 'AM' | 'PM') => void;
  includeIst?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ClockTimePicker: React.FC<ClockTimePickerProps> = ({
  value = '07:00 AM IST',
  onChange,
  includeIst = true,
  label,
  placeholder = 'e.g. 07:00 AM IST',
  className = '',
  disabled = false,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse input string
  const parseTimeString = (raw: string) => {
    let clean = (raw || '').replace(/IST/i, '').trim();
    const isPm = /PM/i.test(clean);
    const isAm = /AM/i.test(clean);
    clean = clean.replace(/AM|PM/gi, '').trim();

    let [hStr, mStr] = clean.split(':');
    let h = parseInt(hStr || '7', 10);
    let m = parseInt(mStr || '0', 10);

    if (isNaN(h) || h < 1 || h > 12) h = 7;
    if (isNaN(m) || m < 0 || m > 59) m = 0;

    const ampm: 'AM' | 'PM' = isPm ? 'PM' : 'AM';
    return {
      hour: h,
      minute: m,
      ampm,
      hasIst: /IST/i.test(raw) || includeIst,
    };
  };

  const parsed = parseTimeString(value);
  const [selectedHour, setSelectedHour] = useState<number>(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState<number>(parsed.minute);
  const [selectedAmPm, setSelectedAmPm] = useState<'AM' | 'PM'>(parsed.ampm);
  const [hasIst, setHasIst] = useState<boolean>(parsed.hasIst);
  const [pickerTab, setPickerTab] = useState<'hours' | 'minutes'>('hours');

  // Keep internal state in sync with prop value when modal opens or prop changes
  useEffect(() => {
    const p = parseTimeString(value);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedAmPm(p.ampm);
    setHasIst(p.hasIst);
  }, [value]);

  // Format state to string
  const getFormattedValue = (h: number, m: number, ap: 'AM' | 'PM', ist: boolean) => {
    const hStr = h.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    const base = `${hStr}:${mStr} ${ap}`;
    return ist ? `${base} IST` : base;
  };

  const getTimeOnly = (h: number, m: number) => {
    const hStr = h.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    return `${hStr}:${mStr}`;
  };

  const handleApply = (
    h = selectedHour,
    m = selectedMinute,
    ap = selectedAmPm,
    ist = hasIst
  ) => {
    const formatted = getFormattedValue(h, m, ap, ist);
    const timeOnly = getTimeOnly(h, m);
    onChange(formatted, timeOnly, ap);
  };

  const handleSelectHour = (h: number) => {
    setSelectedHour(h);
    handleApply(h, selectedMinute, selectedAmPm, hasIst);
    setPickerTab('minutes');
  };

  const handleSelectMinute = (m: number) => {
    setSelectedMinute(m);
    handleApply(selectedHour, m, selectedAmPm, hasIst);
  };

  const handleToggleAmPm = (ap: 'AM' | 'PM') => {
    setSelectedAmPm(ap);
    handleApply(selectedHour, selectedMinute, ap, hasIst);
  };

  const handleToggleIst = () => {
    const nextIst = !hasIst;
    setHasIst(nextIst);
    handleApply(selectedHour, selectedMinute, selectedAmPm, nextIst);
  };

  // Preset quick times
  const presets = [
    { label: '07:00 AM (Default)', h: 7, m: 0, ap: 'AM' as const },
    { label: '08:00 AM', h: 8, m: 0, ap: 'AM' as const },
    { label: '09:00 AM', h: 9, m: 0, ap: 'AM' as const },
    { label: '06:00 PM', h: 6, m: 0, ap: 'PM' as const },
    { label: '07:00 PM', h: 7, m: 0, ap: 'PM' as const },
    { label: '08:00 PM', h: 8, m: 0, ap: 'PM' as const },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Calculate clock hand angles
  const hourAngle = ((selectedHour % 12) + selectedMinute / 60) * 30; // 360 deg / 12 hours
  const minuteAngle = selectedMinute * 6; // 360 deg / 60 mins

  const hoursList = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutesList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      {label && (
        <label className="font-black text-[#0B1E39] uppercase text-[10px] tracking-wider block mb-1.5">
          {label}
        </label>
      )}

      {/* INPUT CONTAINER WITH CLOCK TRIGGER BUTTON */}
      <div className="relative flex items-center group">
        <input
          type="text"
          value={value}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          placeholder={placeholder}
          className="w-full bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-200 focus:border-amber-500 text-slate-900 font-bold p-3.5 pr-12 rounded-2xl cursor-pointer transition-all shadow-xs text-xs sm:text-sm select-none"
        />

        {/* CLOCK ICON BUTTON (MATCHING USER RED CIRCLE) */}
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) setIsOpen(!isOpen);
          }}
          title="Click to select draw time"
          className="absolute right-2 p-2 text-amber-600 hover:text-amber-700 bg-amber-100/70 hover:bg-amber-200/90 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center group-hover:scale-105"
        >
          <Clock className="w-5 h-5 animate-pulse text-amber-700" />
        </button>
      </div>

      {/* INTERACTIVE CLOCK PICKER POPOVER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 mt-2 right-0 left-0 sm:left-auto sm:w-80 bg-white rounded-3xl border-2 border-amber-300 shadow-2xl p-4 text-slate-800 space-y-4"
            style={{ filter: 'drop-shadow(0 20px 30px rgba(11,30,57,0.25))' }}
          >
            {/* HEADER DISPLAY & AM/PM TOGGLE */}
            <div className="bg-gradient-to-br from-[#0B1E39] to-[#122A4E] text-white p-3.5 rounded-2xl shadow-inner flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 block">
                    Selected Time
                  </span>
                  <div className="font-mono font-black text-lg tracking-tight leading-none text-white">
                    {selectedHour.toString().padStart(2, '0')}:
                    {selectedMinute.toString().padStart(2, '0')}{' '}
                    <span className="text-amber-400 text-xs">{selectedAmPm}</span>
                  </div>
                </div>
              </div>

              {/* AM / PM PILLS */}
              <div className="flex bg-white/10 p-1 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => handleToggleAmPm('AM')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                    selectedAmPm === 'AM'
                      ? 'bg-amber-400 text-amber-950 shadow-md scale-105'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>AM</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAmPm('PM')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                    selectedAmPm === 'PM'
                      ? 'bg-amber-400 text-amber-950 shadow-md scale-105'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>PM</span>
                </button>
              </div>
            </div>

            {/* TAB SELECTOR: HOURS VS MINUTES */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPickerTab('hours')}
                  className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    pickerTab === 'hours'
                      ? 'bg-white text-[#0B1E39] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Hour ({selectedHour})
                </button>
                <button
                  type="button"
                  onClick={() => setPickerTab('minutes')}
                  className={`px-3 py-1 rounded-lg font-extrabold transition-all cursor-pointer ${
                    pickerTab === 'minutes'
                      ? 'bg-white text-[#0B1E39] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Minute ({selectedMinute.toString().padStart(2, '0')})
                </button>
              </div>

              {includeIst && (
                <button
                  type="button"
                  onClick={handleToggleIst}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase cursor-pointer border transition-all ${
                    hasIst
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  + IST
                </button>
              )}
            </div>

            {/* VISUAL CLOCK DIAL & SELECTION GRID */}
            <div className="relative">
              {pickerTab === 'hours' ? (
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 text-center">
                    Select Hour
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {hoursList.map((h) => {
                      const isSelected = selectedHour === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleSelectHour(h)}
                          className={`py-2 rounded-xl font-extrabold text-xs font-mono transition-all cursor-pointer flex items-center justify-center border ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 border-amber-500 font-black shadow-md scale-105'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                          }`}
                        >
                          {h.toString().padStart(2, '0')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 text-center">
                    Select Minute
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {minutesList.map((m) => {
                      const isSelected = selectedMinute === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleSelectMinute(m)}
                          className={`py-2 rounded-xl font-extrabold text-xs font-mono transition-all cursor-pointer flex items-center justify-center border ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 border-amber-500 font-black shadow-md scale-105'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                          }`}
                        >
                          :{m.toString().padStart(2, '0')}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* PRESET QUICK TIME CHIPS */}
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Quick Selection Presets</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedHour(p.h);
                      setSelectedMinute(p.m);
                      setSelectedAmPm(p.ap);
                      handleApply(p.h, p.m, p.ap, hasIst);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold font-mono transition-all cursor-pointer border ${
                      selectedHour === p.h && selectedMinute === p.m && selectedAmPm === p.ap
                        ? 'bg-[#0B1E39] text-amber-400 border-[#0B1E39]'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* FOOTER CONFIRM BUTTON */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Auto-saved
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
