/*
  # Add unique constraint to username in profiles table

  1. Changes
    - Add unique constraint to username column in profiles table
    - This ensures no two users can have the same username

  2. Security
    - Maintain existing RLS policies
*/

-- Add unique constraint to username if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_username_unique'
  ) THEN
    -- First, update any duplicate usernames
    WITH duplicates AS (
      SELECT username, ROW_NUMBER() OVER (PARTITION BY username ORDER BY created_at) as rn
      FROM profiles 
      WHERE username IS NOT NULL
    )
    UPDATE profiles 
    SET username = username || '-' || substr(id::text, 1, 4)
    FROM duplicates 
    WHERE profiles.username = duplicates.username 
    AND duplicates.rn > 1;
    
    -- Now add the unique constraint
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
  END IF;
END $$;