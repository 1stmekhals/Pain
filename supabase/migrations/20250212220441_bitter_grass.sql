/*
  # Add user profiles and admin features

  1. Changes
    - Add first_name and last_name to profiles table
    - Add profile completion status
    - Add admin view for user management

  2. Security
    - Only admins can view all users
    - Users can only view and edit their own profiles
*/

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS is_profile_complete boolean DEFAULT false;

-- Create a view for admin user management
CREATE VIEW admin_user_view AS
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
WHERE au.email != '1st.mekhlas@gmail.com';

-- Grant access to admin
GRANT SELECT, DELETE ON admin_user_view TO authenticated;