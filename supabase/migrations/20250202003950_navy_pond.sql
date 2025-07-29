/*
  # Fix admin access for background music management
  
  1. Changes
    - Update the background music policies to use email check directly
    - Simplify the admin check logic
    - No role-based permissions (using simpler approach)
*/

-- Drop existing policies for background_music
DROP POLICY IF EXISTS "Admins can manage background music" ON background_music;

-- Create new simplified policy
CREATE POLICY "Admin can manage background music"
ON background_music
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' = '1st.mekhlas@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = '1st.mekhlas@gmail.com');