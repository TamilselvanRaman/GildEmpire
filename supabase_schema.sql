-- Supabase Schema Setup for InfinityGram Gold Scheme Portal

-- 1. Create Profiles Table linked to Auth Users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT,
  member_id TEXT NOT NULL UNIQUE,
  account_status TEXT DEFAULT 'Pending Verification',
  deposit_status TEXT DEFAULT 'Pending Verification',
  reward_status TEXT DEFAULT 'Active in Group Pool',
  slot_number INT DEFAULT 0,
  joined_date TEXT,
  referral_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Deposits Table
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 5000,
  payment_method TEXT NOT NULL,
  reference_id TEXT NOT NULL UNIQUE,
  proof_url TEXT,
  status TEXT DEFAULT 'Under Review',
  transaction_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Referrals Table (5% Commission Bonus Tracking)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer_code TEXT,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_name TEXT NOT NULL,
  referred_member_id TEXT NOT NULL,
  deposit_status TEXT DEFAULT 'Not Started',
  bonus_amount NUMERIC DEFAULT 250, -- 5% of ₹5,000 scheme deposit = ₹250
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- 5. RLS Security Policies
CREATE POLICY "Allow individual read access profiles" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual update access profiles" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual insert access profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow individual read access deposits" ON public.deposits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual insert access deposits" ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow read access referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);
CREATE POLICY "Allow insert access referrals" ON public.referrals FOR INSERT WITH CHECK (true);

