'use client';

import React, { useState, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const { setCurrentView, registerUser } = useApp();

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

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

  // Mobile input handler (Only allow 10 numeric digits)
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setMobile(numericValue);
      if (errorMessage.includes('mobile')) {
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
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
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
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      };
      img.src = url;
    });
  };

  // Form Registration Submit Handler with All Type Checks
  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Check 1: Full Name
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter your full legal name as shown on your official ID.');
      return;
    }

    // Check 2: Mobile Number (10 digits only)
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number (e.g. 9876543210).');
      return;
    }

    // Check 3: Email Address Format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailPattern.test(email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
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
        setErrorMessage(res?.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-gradient-to-br from-[#F1F5F9] via-[#E2E8F0]/70 to-[#F8FAFC] flex items-center justify-center p-3 sm:p-5 font-sans relative overflow-hidden bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/10 to-transparent blur-[130px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl w-full max-h-[95vh] bg-white rounded-[2.2rem] border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(11,30,57,0.14)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto"
      >
        
        {/* LEFT SIDE: Executive Corporate Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1E39] via-[#0F284B] to-[#0A192F] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[70px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[70px] pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Brand Logo Header */}
            <div 
              onClick={() => setCurrentView('public-landing')} 
              className="flex items-center space-x-3 cursor-pointer group select-none"
            >
              <img 
                src="/logo.png" 
                alt="InfinityGram Official Logo" 
                className="h-10 sm:h-11 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(0,194,184,0.4)] group-hover:scale-105 transition-transform duration-300 shrink-0" 
              />
              <div>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                  InfinityGram
                </h3>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">SOVEREIGN MEMBER PORTAL</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>JOIN NEXT 50-MEMBER GROUP</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Secure Your Slot in the 50-Day 1g Gold Cycle
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Create your verified member account to participate in daily 1 Gram 24K Gold rewards with transparent 50-member group progression.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-1 text-xs font-semibold text-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>Strict 50-Member Group Allocation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>1 Gram 24K Gold Coin Daily</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>5% Instant Wallet Referral Bonus</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-slate-300 flex items-center space-x-2 font-medium relative z-10 mt-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-Bit Cryptographic SSL Secured</span>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-white overflow-y-auto max-h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1E39] tracking-tight">
                Create Member Account
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Personal Identity & Mandatory KYC Verification
              </p>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 text-[#2563EB] bg-[#EEF4FF] border-blue-100/90 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span>ACCOUNT REGISTRATION</span>
            </span>
          </div>

          {/* Validation Error Alert Banner */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border border-rose-200/90 text-rose-700 p-3 rounded-xl text-xs flex items-center space-x-2.5 shadow-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
              <span className="font-semibold">{errorMessage}</span>
            </motion.div>
          )}

          {/* Form Controls */}
          <form onSubmit={handleRegister} className="space-y-3 text-xs font-medium">
            
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
                className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs"
              />
            </div>

            {/* 2. Mobile & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Mobile Number (Exactly 10 Digits) */}
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
                <div className="relative">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="10 Digits e.g. 9876543210"
                    className={`w-full bg-[#F8FAFC] border text-[#0B1E39] font-mono font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs ${
                      mobile.length === 10 ? 'border-emerald-500/80 bg-emerald-50/20' : 'border-slate-200 focus:border-[#2563EB]'
                    }`}
                  />
                </div>
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
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs"
                />
              </div>
            </div>

            {/* 3. Legal ID Document Upload Dropzone */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>LEGAL ID DOCUMENT (AADHAAR / PAN / DRIVING LICENSE)</span>
                </span>
                {idDocument && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                    <span>Document Selected</span>
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
                  className={`flex flex-col items-center justify-center w-full h-20 sm:h-22 border-2 border-dashed rounded-xl p-2 transition-all group cursor-pointer ${
                    isDragging
                      ? 'bg-blue-50 border-blue-500 scale-[1.01]'
                      : 'bg-[#F8FAFC] border-slate-300 hover:bg-blue-50/50 hover:border-[#2563EB]'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-7 h-7 rounded-full bg-blue-100/80 text-[#2563EB] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">
                      <span className="font-extrabold text-[#2563EB] underline">Click to upload</span> or drag and drop image / document
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                      PNG, JPG, WEBP or PDF (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative bg-slate-50 border-2 border-emerald-500/40 rounded-xl p-2.5 flex items-center justify-between space-x-3 shadow-sm">
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {previewUrl ? (
                      <div className="relative shrink-0">
                        <img
                          src={previewUrl}
                          alt="ID Document Preview"
                          className="w-11 h-11 object-cover rounded-lg border border-slate-200 shadow-sm bg-white"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}

                    <div className="overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[160px] sm:max-w-[200px]">
                          {idDocument.name}
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase shrink-0">
                          Uploaded
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Size: {formatFileSize(idDocument.size)} &bull; {idDocument.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold flex items-center space-x-1 mt-0.5">
                        <Eye className="w-3 h-3" />
                        <span>Preview verified & attached</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload another image or document"
                      className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-1 text-[10px] font-extrabold border border-slate-200 bg-white cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Change</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      title="Remove image / Upload different document"
                      className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                    >
                      <X className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Password & Confirm Password Row with Eye Toggle Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Account Password Field */}
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
                    className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 pl-3.5 pr-10 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs"
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
                    className={`w-full bg-[#F8FAFC] border text-[#0B1E39] font-semibold py-2.5 pl-3.5 pr-10 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs ${
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

            {/* 5. Optional Referral Code */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>REFERRAL CODE (OPTIONAL)</span>
              </label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="E.G. REF-AMIT99"
                className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-mono font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 uppercase text-xs"
              />
            </div>

            {/* 6. Terms & Conditions Checkbox */}
            <div className="flex items-start space-x-2.5 pt-1">
              <input 
                type="checkbox" 
                id="termsCheckbox"
                checked={agreedToTerms} 
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer w-4 h-4" 
              />
              <label htmlFor="termsCheckbox" className="text-[11px] text-slate-600 leading-tight font-medium cursor-pointer select-none">
                I agree to the <button type="button" onClick={() => setCurrentView('public-terms')} className="text-[#2563EB] font-extrabold hover:underline">Terms & Conditions</button> and confirm that I am an Indian resident aged 18+.
              </label>
            </div>

            {/* 7. Submit Action Button */}
            <button
              type="button"
              onClick={() => handleRegister()}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#2563EB] via-blue-600 to-[#1D4ED8] hover:from-blue-600 hover:to-blue-800 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-3 disabled:opacity-80"
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
          <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
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
