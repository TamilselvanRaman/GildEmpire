'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Lock, 
  Users, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  Upload, 
  X, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Phone,
  Mail,
  CheckCircle2,
  ChevronLeft,
  BadgeCheck,
  UserCheck,
  FileCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const { setCurrentView, registerUser, dbUsers = [] } = useApp();

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Auto-fill referral code from URL search params (e.g. ?ref=REF-635880)
  const [isAutoFilledRef, setIsAutoFilledRef] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const urlRef = searchParams.get('ref') || searchParams.get('referral') || searchParams.get('code');
      if (urlRef) {
        const cleanRef = urlRef.trim().toUpperCase();
        setReferralCode(cleanRef);
        setIsAutoFilledRef(true);
      }
    }
  }, []);

  // Eye Toggle States for Show/Hide Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback States
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload State
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Duplicate Email & Mobile Check Flags
  const cleanEmail = email.trim().toLowerCase();
  const cleanMobile = mobile.replace(/\D/g, '');

  const registeredEmailsList = [
    'tamilselvan@infinitygram.net',
    'navin@infinitygram.net',
    'ceittamilselvanr26@gmail.com',
    'rajesh@gmail.com',
    ...(Array.isArray(dbUsers) ? dbUsers.map(u => u.email?.toLowerCase()).filter(Boolean) : [])
  ];

  const registeredMobilesList = [
    '9876543210',
    ...(Array.isArray(dbUsers) ? dbUsers.map(u => u.mobile).filter(Boolean) : [])
  ];

  const isEmailTaken = cleanEmail.length > 3 && registeredEmailsList.includes(cleanEmail);
  const isMobileTaken = cleanMobile.length === 10 && registeredMobilesList.includes(cleanMobile);

  // Mobile input handler (Only allow 10 numeric digits)
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setMobile(numericValue);
      if (errorMessage) {
        setErrorMessage('');
      }
    }
  };

  // File Change Handler
  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit. Please select a smaller image or document.');
      return;
    }
    setErrorMessage('');
    setIdDocument(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Drag and Drop Handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setIdDocument(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Canvas Image Compression Helper Function (Compresses heavy photos to lightweight ~150KB JPEG)
  const compressImageFile = (file: File, maxWidth = 1024, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultStr = event.target?.result as string;
        if (!resultStr) {
          resolve('');
          return;
        }
        if (file.type === 'application/pdf' || !file.type.startsWith('image/')) {
          resolve(resultStr);
          return;
        }

        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
          } else {
            resolve(resultStr);
          }
        };
        img.onerror = () => {
          resolve(resultStr);
        };
        img.src = resultStr;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Form Registration Submit Handler with All Type & Duplicate Checks
  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Check 1: Full Name
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full legal name as shown on your official ID.');
      return;
    }

    // Check 2: Mobile Number (10 digits only & Duplicate Check)
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
      return;
    }

    if (isMobileTaken) {
      setErrorMessage(`❌ Mobile Number Already Registered: This mobile number (${cleanMobile}) is already linked to an existing member account. Please log in or use another number.`);
      return;
    }

    // Check 3: Email Address Format & Duplicate Check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailPattern.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (isEmailTaken) {
      setErrorMessage(`❌ Email Already Registered: An account with this email address (${cleanEmail}) already exists. Please log in instead.`);
      return;
    }

    // Check 4: Legal ID Document Upload Check
    if (!idDocument) {
      setErrorMessage('Please upload your Legal ID Document (Aadhaar / PAN / Driving License) to proceed.');
      return;
    }

    // Check 5: Password Length
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // Check 6: Confirm Password Match Check
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match! Please verify your confirm password field.');
      return;
    }

    // Check 7: Terms and Conditions Agreement
    if (!agreedToTerms) {
      setErrorMessage('You must accept the Terms & Conditions to complete your registration.');
      return;
    }

    try {
      setIsSubmitting(true);
      let idDocumentBase64: string | undefined = undefined;
      if (idDocument) {
        idDocumentBase64 = await compressImageFile(idDocument);
      }

      const res = await registerUser(
        fullName.trim(), 
        email.trim(), 
        cleanMobile, 
        password, 
        referralCode, 
        idDocumentBase64, 
        idDocument?.name
      );
      setIsSubmitting(false);

      if (res && res.success) {
        setCurrentView('user-dashboard');
      } else {
        setErrorMessage(res?.error || 'Registration failed. Please check your details.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#061526] text-slate-800 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 font-sans relative flex items-center justify-center overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Dynamic Background Glow Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl w-full bg-white rounded-2xl sm:rounded-[2.2rem] border border-slate-200/90 shadow-[0_30px_70px_-15px_rgba(2,12,27,0.4)] grid grid-cols-1 lg:grid-cols-12 relative z-10 overflow-hidden my-auto"
      >
        
        {/* LEFT SIDE: Executive Corporate Panel (Desktop visible, stacked on tablet) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0B1E39] via-[#0D264A] to-[#081528] text-white p-7 sm:p-9 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#00C2B8]/15 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Brand Header */}
            <div className="flex items-center justify-between">
              <div 
                onClick={() => setCurrentView('public-landing')} 
                className="flex items-center space-x-3 cursor-pointer group select-none"
              >
                <img 
                  src="/logo.png" 
                  alt="InfinityGram Official Logo" 
                  className="h-10 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(0,194,184,0.45)] group-hover:scale-105 transition-transform duration-300 shrink-0" 
                />
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-[#00C2B8] transition-colors">
                    Infinity<span className="text-[#00C2B8]">Gram</span>
                  </h3>
                  <p className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-widest">SOVEREIGN MEMBER PORTAL</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('public-landing')}
                className="text-xs text-slate-300 hover:text-white font-bold flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer border border-white/10"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>JOIN NEXT 50-MEMBER GROUP</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Secure Your Slot in the 50-Day 1g Gold Cycle
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Create your verified member account to participate in daily 1 Gram 916 Gold rewards with transparent 50-member group progression.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 pt-1 text-xs font-semibold text-slate-200">
              <div className="flex items-center space-x-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Strict 50-Member Group Allocation</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>1 Gram 916 Gold Coin Daily</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>5% Instant Wallet Referral Bonus</span>
              </div>
            </div>

            {/* EXECUTIVE 3-STEP MEMBER ACTIVATION WORKFLOW CARD */}
            <div className="mt-4 bg-gradient-to-br from-[#081E26] via-[#0D3B43] to-[#081E26] border border-[#00C2B8]/40 p-4 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#0D3B43] gap-2">
                <span className="flex items-center space-x-2 text-xs font-black text-[#00C2B8] uppercase tracking-wider min-w-0">
                  <BadgeCheck className="w-4 h-4 text-[#00C2B8] shrink-0" />
                  <span className="truncate">3-Step Activation</span>
                </span>
                <span className="text-[9.5px] font-extrabold text-[#F2C868] bg-[#E1A238]/20 border border-[#E1A238]/40 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                  ⏱ 24h Admin KYC Review
                </span>
              </div>

              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center space-x-3 bg-[#081E26]/90 p-2.5 rounded-xl border border-[#00C2B8]/30">
                  <div className="w-5 h-5 rounded-lg bg-[#00C2B8] text-[#081E26] font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-xs">Register Account & Upload ID</p>
                    <p className="text-[10px] text-slate-300">Name, Mobile, Email, PAN & Aadhaar</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-[#081E26]/90 p-2.5 rounded-xl border border-[#E1A238]/40">
                  <div className="w-5 h-5 rounded-lg bg-[#E1A238] text-[#081E26] font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#F2C868] text-xs">24-Hour Admin KYC Review</p>
                    <p className="text-[10px] text-slate-300">Document review & email dispatch</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-[#081E26]/90 p-2.5 rounded-xl border border-emerald-400/40">
                  <div className="w-5 h-5 rounded-lg bg-emerald-400 text-[#081E26] font-black text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-emerald-300 text-xs">Deposit & Buy Group Slot</p>
                    <p className="text-[10px] text-slate-300">₹10,000 deposit unlocks 50-member slot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-slate-300 flex items-center justify-between font-medium relative z-10 mt-6">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>256-Bit Cryptographic SSL</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v2.4 Sovereign</span>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Registration Form */}
        <div className="col-span-12 lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-between bg-white min-w-0">
          
          {/* Header Bar */}
          <div>
            {/* Mobile Header Brand Bar */}
            <div className="flex lg:hidden items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setCurrentView('public-landing')}
              >
                <img src="/logo.png" alt="InfinityGram Logo" className="h-7 w-auto object-contain" />
                <span className="text-lg font-black tracking-tight text-[#0B1E39]">
                  Infinity<span className="text-[#00C2B8]">Gram</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('public-landing')}
                className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1E39] tracking-tight">
                  Create Member Account
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Personal Identity & Mandatory KYC Verification
                </p>
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all flex items-center space-x-1.5 text-[#2563EB] bg-[#EEF4FF] border-blue-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span>REGISTRATION</span>
              </span>
            </div>
          </div>

          {/* Validation Error Alert Banner */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 bg-rose-50 border border-rose-200/90 text-rose-700 p-3.5 rounded-xl text-xs flex items-center space-x-2.5 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
              <span className="font-semibold leading-relaxed">{errorMessage}</span>
            </motion.div>
          )}

          {/* Form Controls */}
          <form onSubmit={handleRegister} className="space-y-4 text-xs font-medium mt-4">
            
            {/* SECTION 1: PERSONAL DETAILS */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Personal & Contact Info</span>
                <div className="flex-1 h-px bg-slate-100 ml-2"></div>
              </div>

              {/* 1. Full Legal Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>FULL LEGAL NAME (AS PER ID)</span>
                  </span>
                  {fullName.trim().length >= 2 && (
                    <span className="text-emerald-600 font-bold flex items-center space-x-0.5 text-[10px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Valid</span>
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. Rajesh Kumar Sharma"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs shadow-2xs"
                />
              </div>

              {/* 2. Mobile & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mobile Number */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>MOBILE NUMBER</span>
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${mobile.length === 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {mobile.length}/10 {mobile.length === 10 && '✓'}
                    </span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="10 Digits e.g. 9876543210"
                    className={`w-full bg-[#F8FAFC] border text-[#0B1E39] font-mono font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs shadow-2xs ${
                      mobile.length === 10 ? 'border-emerald-500/80 bg-emerald-50/20' : 'border-slate-200 focus:border-[#2563EB]'
                    }`}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>EMAIL ADDRESS</span>
                    </span>
                    {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center space-x-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Valid</span>
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. rajesh@gmail.com"
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: KYC & GOVERNMENT IDENTIFICATION */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Government KYC Verification</span>
                <div className="flex-1 h-px bg-slate-100 ml-2"></div>
              </div>

              {/* Identity Credentials (PAN Card & Aadhaar Number) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* PAN Card Number */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>PAN CARD NUMBER</span>
                    </span>
                    {panNumber.trim().length === 10 && (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center space-x-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Valid PAN</span>
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={panNumber}
                    onChange={(e) => {
                      setPanNumber(e.target.value.toUpperCase());
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. ABCDE1234F"
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-mono font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs uppercase shadow-2xs"
                  />
                </div>

                {/* Aadhaar Number */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>AADHAAR NUMBER (12 DIGITS)</span>
                    </span>
                    {aadhaarNumber.replace(/\D/g, '').length === 12 && (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center space-x-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Valid 12-Digit</span>
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => {
                      setAadhaarNumber(e.target.value.replace(/\D/g, ''));
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g. 1234 5678 9012"
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-mono font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs shadow-2xs"
                  />
                </div>
              </div>

              {/* Legal ID Document Upload Dropzone */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>LEGAL ID DOCUMENT (AADHAAR / PAN / DRIVING LICENSE)</span>
                  </span>
                  {idDocument && (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                      <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                      <span>Attached</span>
                    </span>
                  )}
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                {!idDocument ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full py-4 border-2 border-dashed rounded-xl px-3 transition-all group cursor-pointer ${
                      isDragging
                        ? 'bg-blue-50 border-blue-500 scale-[1.01]'
                        : 'bg-[#F8FAFC] border-slate-300 hover:bg-blue-50/50 hover:border-[#2563EB]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100/80 text-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xs">
                        <Upload className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] text-slate-700 font-medium">
                          <span className="font-extrabold text-[#2563EB] underline">Click to upload</span> or drag and drop document
                        </p>
                        <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5">
                          PNG, JPG, WEBP or PDF (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-[#F8FAFC] border-2 border-emerald-500/40 rounded-xl p-3 flex items-center justify-between space-x-3 shadow-xs">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {previewUrl ? (
                        <div className="relative shrink-0">
                          <img
                            src={previewUrl}
                            alt="ID Document Preview"
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-xs bg-white"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}

                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">
                            {idDocument.name}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase shrink-0">
                            Uploaded
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                          Size: {formatFileSize(idDocument.size)} &bull; {idDocument.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Change file"
                        className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1 text-[10px] font-extrabold border border-slate-200 bg-white cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Change</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        title="Remove file"
                        className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: SECURITY & REFERRAL */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Security & Referral</span>
                <div className="flex-1 h-px bg-slate-100 ml-2"></div>
              </div>

              {/* Password & Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password Field */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>ACCOUNT PASSWORD</span>
                    </span>
                    {password.length >= 6 && (
                      <span className="text-emerald-600 font-bold text-[10px]">Min 6 Chars ✓</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Min 6 characters"
                      className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 pl-3.5 pr-10 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md"
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>CONFIRM PASSWORD</span>
                    </span>
                    {confirmPassword.length > 0 && password === confirmPassword && (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center space-x-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Matched</span>
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Re-enter password"
                      className={`w-full bg-[#F8FAFC] border text-[#0B1E39] font-semibold py-2.5 pl-3.5 pr-10 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs shadow-2xs ${
                        confirmPassword.length > 0 && password !== confirmPassword
                          ? 'border-rose-400 bg-rose-50/20'
                          : confirmPassword.length > 0 && password === confirmPassword
                          ? 'border-emerald-500/80 bg-emerald-50/20'
                          : 'border-slate-200 focus:border-[#2563EB]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md"
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>REFERRAL CODE (OPTIONAL)</span>
                  </span>
                  {isAutoFilledRef && (
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Auto-filled from Link
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="E.G. REF-AMIT99"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-mono font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 uppercase text-xs shadow-2xs"
                />
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start space-x-2.5 pt-2">
              <input 
                type="checkbox" 
                id="termsCheckbox"
                checked={agreedToTerms} 
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer w-4 h-4" 
              />
              <label htmlFor="termsCheckbox" className="text-[11px] text-slate-600 leading-snug font-medium cursor-pointer select-none">
                I agree to the <button type="button" onClick={() => setCurrentView('public-terms')} className="text-[#2563EB] font-extrabold hover:underline">Terms & Conditions</button> and confirm that I am an Indian resident aged 18+.
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              type="button"
              onClick={() => handleRegister()}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#0F399E] hover:from-blue-600 hover:to-blue-900 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-[0_12px_28px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_32px_-5px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-4 disabled:opacity-80 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>CREATING MEMBER ACCOUNT...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>COMPLETE REGISTRATION & OPEN DASHBOARD</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </button>

          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-slate-500 font-medium pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>256-Bit SSL Encrypted</span>
            </span>

            <div>
              Already registered?{' '}
              <button onClick={() => setCurrentView('auth-login')} className="text-[#2563EB] font-bold hover:underline cursor-pointer">
                Login here
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
