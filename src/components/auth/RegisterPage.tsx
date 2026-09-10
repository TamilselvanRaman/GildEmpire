'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, ShieldCheck, Check, ArrowRight, Lock, Users, Sparkles, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegisterPage = () => {
  const { setCurrentView } = useApp();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  // Inline OTP state
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);

  // Handle password strength
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  // Timer countdown for resend OTP
  React.useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (showOtpSection && resendTimer > 0) {
      timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [showOtpSection, resendTimer]);

  const handleProceedClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtpSection) {
      setShowOtpSection(true);
      setOtpDigits(['8', '4', '9', '2', '0', '1']);
    } else {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setCurrentView('user-dashboard');
      }, 900);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
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
        className="max-w-5xl w-full max-h-[94vh] bg-white rounded-[2.2rem] border border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(11,30,57,0.14)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-auto"
      >
        
        {/* LEFT SIDE: Business Content Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0B1E39] via-[#0F284B] to-[#0A192F] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[70px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[70px] pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            {/* Brand Logo Header */}
            <div 
              onClick={() => setCurrentView('public-landing')} 
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-amber-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Award className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
                  GildEmpire
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

        {/* RIGHT SIDE: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-white overflow-y-auto max-h-full">
          
          {/* Header & Step */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1E39] tracking-tight">
                Create Member Account
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {showOtpSection 
                  ? 'Step 2 of 2: Enter 2FA Security Code' 
                  : 'Step 1 of 2: Personal Identity & KYC Details'}
              </p>
            </div>

            <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border transition-all flex items-center space-x-1.5 ${
              showOtpSection 
                ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                : 'text-[#2563EB] bg-[#EEF4FF] border-blue-100/90'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${showOtpSection ? 'bg-emerald-500' : 'bg-blue-600'} animate-pulse`}></span>
              <span>{showOtpSection ? 'STEP 2 OF 2' : 'STEP 1 OF 2'}</span>
            </span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleProceedClick} className="space-y-3.5 text-xs font-medium">
            
            {/* Full Legal Name */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>FULL LEGAL NAME (AS PER ID)</span>
              </label>
              <input
                type="text"
                required
                disabled={showOtpSection}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Kumar Sharma"
                className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
              />
            </div>

            {/* Mobile & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>MOBILE (OTP VERIFIED)</span>
                </label>
                <input
                  type="tel"
                  required
                  disabled={showOtpSection}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>EMAIL ADDRESS</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={showOtpSection}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@gildempire.in"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Legal ID Document Dropzone */}
            <div>
              <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>LEGAL ID DOCUMENT (AADHAAR / PAN / DRIVING LICENSE)</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-20 sm:h-22 bg-[#F8FAFC] border-2 border-dashed border-slate-300 rounded-xl p-2 transition-all group ${
                  showOtpSection ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50/40 hover:border-[#2563EB]'
                }`}>
                  <div className="flex flex-col items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#2563EB] mb-1 group-hover:scale-110 transition-transform" />
                    <p className="mb-0.5 text-[11px] text-slate-600 font-medium">
                      <span className="font-extrabold text-[#2563EB]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[9px] text-slate-400 font-semibold">
                      PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>
                  <input type="file" disabled={showOtpSection} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </div>
            </div>

            {/* Password & Referral Code Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>ACCOUNT PASSWORD</span>
                </label>
                <input
                  type="password"
                  required
                  disabled={showOtpSection}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#334155] uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>REFERRAL CODE (OPTIONAL)</span>
                </label>
                <input
                  type="text"
                  disabled={showOtpSection}
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="E.G. REF-AMIT99"
                  className="w-full bg-[#F8FAFC] border border-slate-200 text-[#0B1E39] font-mono font-semibold py-2.5 px-3.5 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 uppercase text-xs disabled:opacity-75 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start space-x-2.5 pt-1">
              <input 
                type="checkbox" 
                required 
                disabled={showOtpSection}
                className="mt-0.5 rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer w-4 h-4" 
              />
              <span className="text-[11px] text-slate-500 leading-tight font-medium">
                I agree to the <button type="button" onClick={() => setCurrentView('public-terms')} className="text-[#2563EB] font-extrabold hover:underline">Terms & Conditions</button> and confirm that I am an Indian resident aged 18+.
              </span>
            </div>

            {/* INLINE OTP VERIFICATION BOX */}
            {showOtpSection && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-slate-50 border-2 border-[#2563EB]/40 rounded-xl p-4 shadow-sm my-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-md bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                      <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black text-[#0B1E39] uppercase tracking-wider">
                        ENTER 6-DIGIT OTP CODE
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOtpSection(false)}
                    className="text-[10px] font-extrabold text-[#2563EB] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded-md border border-blue-100"
                  >
                    Edit Form
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="py-1">
                  <div className="flex items-center justify-center gap-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-9 h-11 text-center text-lg font-black bg-white border border-slate-200 rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 outline-none font-mono text-[#0B1E39] shadow-sm transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend & Status Footer */}
                <div className="flex items-center justify-between text-[10px] pt-2 text-slate-500 font-semibold border-t border-blue-100/60 mt-1">
                  <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Instant Verification</span>
                  </span>

                  <div>
                    {resendTimer > 0 ? (
                      <span>Resend in <span className="font-mono font-bold text-[#0B1E39]">00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</span></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setResendTimer(45);
                          setOtpDigits(['8', '4', '9', '2', '0', '1']);
                        }}
                        className="text-[#2563EB] font-extrabold hover:underline cursor-pointer"
                      >
                        Resend Code Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-[#2563EB] via-blue-600 to-[#1D4ED8] hover:from-blue-600 hover:to-blue-800 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-[0_10px_25px_-5px_rgba(37,99,235,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer mt-4 disabled:opacity-80"
            >
              {isVerifying ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>VERIFYING OTP & CREATING ACCOUNT...</span>
                </div>
              ) : showOtpSection ? (
                <div className="flex items-center space-x-2">
                  <span>VERIFY & COMPLETE REGISTRATION</span>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>PROCEED TO OTP VERIFICATION</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>SSL Secured</span>
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
