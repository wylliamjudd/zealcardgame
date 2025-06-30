-- Script to give all authenticated users read-only SELECT permissions to all tables

-- Function to enable RLS and create read-only policies for all tables
CREATE OR REPLACE FUNCTION setup_read_only_access()
RETURNS void AS $$
DECLARE
  tbl_record RECORD;
BEGIN
  -- Loop through all tables in the public schema
  FOR tbl_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    -- Enable Row Level Security on the table
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl_record.table_name);
    
    -- Create a policy allowing public read access (everyone)
    -- First, drop the old policy if it exists to avoid conflict, in case this script is re-run
    EXECUTE format('DROP POLICY IF EXISTS "Authenticated users can read %I" ON %I', tbl_record.table_name, tbl_record.table_name);
    EXECUTE format('CREATE POLICY "Public can read %I" ON %I FOR SELECT USING (true)', 
                  tbl_record.table_name, tbl_record.table_name);
    
    RAISE NOTICE 'Enabled RLS and created read-only policy for table: %', tbl_record.table_name;
  END LOOP;
  
  RAISE NOTICE 'Read-only access setup complete for all tables!';
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT setup_read_only_access();

-- Drop the function after use (optional)
-- DROP FUNCTION setup_read_only_access();

-- Grant SELECT permissions to both authenticated and anonymous roles
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated, anon;

-- Ensure future tables also get the same permissions for both roles
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;

-- Note: For finer-grained control, you might want to review each policy and modify as needed
-- Some tables might need specific security rules (e.g., users should only see their own data)


-- Section: Grant public read-only access to specific class-related tables
DO $$
DECLARE
  public_tables TEXT[] := ARRAY['class', 'subclass', 'subclass_feature', 'spell_class', 'spell', 'spell_component', 'component', 'class_media', 'school'];
  tbl_name TEXT;
  policy_name_auth TEXT;
  policy_name_public TEXT;
BEGIN
  RAISE NOTICE 'Starting setup of public read access for specific tables...';
  FOREACH tbl_name IN ARRAY public_tables
  LOOP
    RAISE NOTICE 'Processing table: % for public read access.', tbl_name;

    -- Ensure RLS is enabled (might be redundant if setup_read_only_access did it, but safe)
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl_name);
    RAISE NOTICE 'Ensured RLS is enabled for public.%I.', tbl_name;

    -- Drop the authenticated-only policy if it was created by the generic function
    policy_name_auth := format('Authenticated users can read %s', tbl_name);
    EXECUTE format('DROP POLICY IF EXISTS "%s" ON public.%I', policy_name_auth, tbl_name);
    RAISE NOTICE 'Dropped policy ''%s'' if it existed on public.%I.', policy_name_auth, tbl_name;
    
    -- Create a public read policy
    policy_name_public := format('Public can read %s', tbl_name);
    EXECUTE format('CREATE POLICY "%s" ON public.%I FOR SELECT USING (true)', policy_name_public, tbl_name);
    RAISE NOTICE 'Created policy ''%s'' on public.%I.', policy_name_public, tbl_name;
  END LOOP;
  RAISE NOTICE 'Finished setup of public read access policies for specific tables.';
END $$;

-- Grant SELECT on these specific tables to the anon role
RAISE NOTICE 'Granting SELECT to anon role for specific public tables...';
GRANT SELECT ON TABLE public.class, public.subclass, public.subclass_feature, public.spell_class, public.spell, public.spell_component, public.component, public.class_media, public.school TO anon;
RAISE NOTICE 'SELECT granted to anon role for specific public tables.';

