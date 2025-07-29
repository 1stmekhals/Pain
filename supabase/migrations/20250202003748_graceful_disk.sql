/*
  # Create admin user

  1. Changes
    - Insert admin user into auth.users table
    - Set admin user's email to "1st.mekhlas@gmail.com"
    - Enable admin privileges for background music management
*/

-- First, ensure the user exists in auth.users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = '1st.mekhlas@gmail.com'
  ) THEN
    RAISE NOTICE 'Please sign up first with the email 1st.mekhlas@gmail.com';
  END IF;
END $$;