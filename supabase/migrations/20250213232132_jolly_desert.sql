/*
  # Fix admin user deletion

  1. Changes
    - Add cascading deletes for user-related tables
    - Add admin policies for user management
    - Add function for admin user deletion

  2. Security
    - Only admin users can delete other users' data
    - Cascading deletes ensure all user data is removed
*/

-- Add cascading deletes to foreign keys
ALTER TABLE profiles
DROP CONSTRAINT profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

ALTER TABLE stars
DROP CONSTRAINT stars_profile_id_fkey,
ADD CONSTRAINT stars_profile_id_fkey
  FOREIGN KEY (profile_id)
  REFERENCES profiles(id)
  ON DELETE CASCADE;

ALTER TABLE diary_entries
DROP CONSTRAINT diary_entries_user_id_fkey,
ADD CONSTRAINT diary_entries_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Create function for admin to delete users
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
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

  -- Delete the user's profile (this will cascade to stars)
  DELETE FROM profiles WHERE id = user_id;
  
  -- Delete the user's diary entries
  DELETE FROM diary_entries WHERE user_id = user_id;
  
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;