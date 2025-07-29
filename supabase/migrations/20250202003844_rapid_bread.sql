/*
  # Grant admin privileges to existing user

  1. Changes
    - Update existing user's role to admin for background music management
    - No destructive changes, only adding privileges
*/

-- Create a custom role for admins if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'admin'
  ) THEN
    CREATE ROLE admin;
  END IF;
END $$;

-- Grant necessary permissions to the admin role
GRANT ALL ON background_music TO admin;

-- Add the user to the admin role
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = '1st.mekhlas@gmail.com'
  ) THEN
    GRANT admin TO authenticated;
  END IF;
END $$;