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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Security Policies
CREATE POLICY "Allow individual read access" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Allow individual update access" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Allow individual insert access" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
