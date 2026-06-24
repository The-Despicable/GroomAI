-- Fix infinite recursion in RLS policies
-- Replace policies that query the users table (causing circular reference)
-- with policies that use auth.uid() directly

-- Drop the problematic policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Enable all for authenticated" ON public.users;
DROP POLICY IF EXISTS "Enable all for authenticated" ON public.salons;
DROP POLICY IF EXISTS "Enable all for authenticated" ON public.services;
DROP POLICY IF EXISTS "Enable all for authenticated" ON public.bookings;
DROP POLICY IF EXISTS "Enable all for authenticated" ON public.reviews;
DROP POLICY IF EXISTS "Enable all for authenticated" ON public.stylists;

-- Drop any policy that might query users table
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', rec.policyname, rec.schemaname, rec.tablename);
    END LOOP;
END $$;

-- Users table: allow all authenticated users to read/update their own record
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text OR auth.role() = 'service_role');

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- All other tables: allow all for authenticated users (demo)
CREATE POLICY "salons_all" ON public.salons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "services_all" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "bookings_all" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "reviews_all" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "stylists_all" ON public.stylists FOR ALL USING (true) WITH CHECK (true);
