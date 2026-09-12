-- Supabase Full Schema & Storage Setup for InfinityGram Gold Scheme Portal

-- 1. Create Profiles Table (Independent UUID or Auth User ID)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT,
  member_id TEXT NOT NULL UNIQUE,
  account_status TEXT DEFAULT 'Active',
  deposit_status TEXT DEFAULT 'Not Started',
  reward_status TEXT DEFAULT 'In Selection Pool',
  slot_number INT DEFAULT 0,
  joined_date TEXT,
  referral_code TEXT,
  id_document_url TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Deposits Table (₹10,000 Minimum Deposit)
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 10000,
  payment_method TEXT NOT NULL,
  reference_id TEXT NOT NULL UNIQUE,
  proof_url TEXT,
  status TEXT DEFAULT 'Pending',
  transaction_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Referrals Table (5% Commission Bonus Tracking = ₹500 on ₹10,000 Deposit)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID,
  referrer_code TEXT,
  referred_user_id UUID,
  referred_name TEXT NOT NULL,
  referred_member_id TEXT NOT NULL,
  deposit_status TEXT DEFAULT 'Not Started',
  bonus_amount NUMERIC DEFAULT 500, -- 5% of ₹10,000 scheme deposit = ₹500
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Audit Logs Table (Enterprise Security & SOC-2 Audit Stream)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor TEXT NOT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  record_id TEXT,
  previous_status TEXT,
  new_status TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS Security Policies
CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read deposits" ON public.deposits FOR SELECT USING (true);
CREATE POLICY "Allow public insert deposits" ON public.deposits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update deposits" ON public.deposits FOR UPDATE USING (true);

CREATE POLICY "Allow public read referrals" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Allow public insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- 7. Supabase Storage Bucket Setup for Legal Documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('id_documents', 'id_documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access ID Documents" ON storage.objects FOR SELECT USING (bucket_id = 'id_documents');
CREATE POLICY "Public Upload ID Documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'id_documents');
