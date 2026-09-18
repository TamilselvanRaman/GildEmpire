-- ============================================================
-- INFINITYGRAM GOLD SCHEME - COMPLETE DATA WIPE & RESET SCRIPT
-- ============================================================
-- WARNING: Running this script will PERMANENTLY DELETE:
-- 1. All User Profiles (public.profiles)
-- 2. All Deposit Records (public.deposits)
-- 3. All Referral Records (public.referrals)
-- 4. All Audit Logs (public.audit_logs)
-- 5. All Authentication Users (auth.users)
-- 6. All Uploaded Storage Files & Images (storage.objects)
-- ============================================================

-- STEP 1: WIPE ALL TABLE DATA
TRUNCATE TABLE public.deposits CASCADE;
TRUNCATE TABLE public.referrals CASCADE;
TRUNCATE TABLE public.audit_logs CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- STEP 2: DELETE ALL UPLOADED DOCUMENTS AND IMAGES FROM STORAGE
DELETE FROM storage.objects WHERE bucket_id = 'id_documents';

-- STEP 3: DELETE ALL USERS FROM SUPABASE AUTHENTICATION
DELETE FROM auth.users;

-- ============================================================
-- RE-INITIALIZE SCHEMA & POLICIES (RUN IF TABLES NEED REBUILDING)
-- ============================================================

-- Re-create profiles table if missing
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
  email_verified BOOLEAN DEFAULT false,
  verification_token TEXT,
  verification_token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_token TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_token_expires_at TIMESTAMP WITH TIME ZONE;

-- Re-create deposits table if missing
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

-- Re-create referrals table if missing
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID,
  referrer_code TEXT,
  referred_user_id UUID,
  referred_name TEXT NOT NULL,
  referred_member_id TEXT NOT NULL,
  deposit_status TEXT DEFAULT 'Not Started',
  bonus_amount NUMERIC DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Re-create audit_logs table if missing
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

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('id_documents', 'id_documents', true)
ON CONFLICT (id) DO NOTHING;
