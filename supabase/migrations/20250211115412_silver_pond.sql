/*
  # Update stars table to reference profiles

  1. Changes
    - Create profiles for existing users
    - Add foreign key relationship between stars and profiles tables
    - Update RLS policies
*/

-- First, create profiles for existing users who have stars
INSERT INTO profiles (id, username, display_name, hide_display_name)
SELECT DISTINCT s.user_id,
       'user_' || substr(s.user_id::text, 1, 8),  -- Generate a default username
       'Anonymous User',                           -- Default display name
       false                                      -- Default hide_display_name value
FROM stars s
LEFT JOIN profiles p ON s.user_id = p.id
WHERE p.id IS NULL;

-- Now we can safely rename and update the foreign key
ALTER TABLE stars 
RENAME COLUMN user_id TO profile_id;

-- Update the foreign key to reference profiles
ALTER TABLE stars 
DROP CONSTRAINT stars_user_id_fkey,
ADD CONSTRAINT stars_profile_id_fkey 
  FOREIGN KEY (profile_id) 
  REFERENCES profiles(id);

-- Update RLS policies to use profile_id
DROP POLICY IF EXISTS "Users can create their own stars" ON stars;
DROP POLICY IF EXISTS "Users can update their own stars" ON stars;
DROP POLICY IF EXISTS "Users can delete their own stars" ON stars;

CREATE POLICY "Users can create their own stars"
  ON stars
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own stars"
  ON stars
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own stars"
  ON stars
  FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id);