/*
  # Add admin star management capabilities
  
  1. Changes
    - Add RLS policy for admin users to manage all stars
    - No destructive changes to existing data
*/

-- Add policy for admin users to manage all stars
CREATE POLICY "Admins can manage all stars"
  ON stars
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );