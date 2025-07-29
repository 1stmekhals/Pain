/*
  # Add admin users table and functionality
  
  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text, unique)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if a user is admin
CREATE POLICY "Anyone can check admin status"
  ON admin_users
  FOR SELECT
  TO public
  USING (true);

-- Function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add an admin
CREATE OR REPLACE FUNCTION add_admin(admin_email text)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_users (user_id, email)
  SELECT id, email
  FROM auth.users
  WHERE email = admin_email
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;