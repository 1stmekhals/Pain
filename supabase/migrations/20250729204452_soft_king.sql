/*
  # Fix admin user management with secure function
  
  1. Changes
    - Remove problematic admin_user_view
    - Add secure get_admin_users function
    - Only admin users can access user data
*/

-- Drop the problematic view if it exists
DROP VIEW IF EXISTS admin_user_view;

-- Revoke any existing grants
REVOKE ALL ON admin_user_view FROM authenticated;

-- Create secure function for admin user management
CREATE OR REPLACE FUNCTION get_admin_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  username text,
  display_name text,
  created_at timestamptz,
  is_profile_complete boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the executing user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = auth.jwt() ->> 'email'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Return user data
  RETURN QUERY
  SELECT
    au.id as user_id,
    au.email,
    p.first_name,
    p.last_name,
    p.username,
    p.display_name,
    p.created_at,
    p.is_profile_complete
  FROM auth.users au
  LEFT JOIN profiles p ON au.id = p.id
  WHERE au.email != '1st.mekhlas@gmail.com'; -- Exclude the main admin
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_admin_users() TO authenticated;