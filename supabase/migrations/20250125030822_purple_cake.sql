/*
  # Create stars table and setup security

  1. New Tables
    - `stars`
      - `id` (uuid, primary key)
      - `message` (text, required)
      - `x` (float, required) - x position percentage
      - `y` (float, required) - y position percentage
      - `size` (float, required) - star size multiplier
      - `brightness` (float, required) - star brightness multiplier
      - `user_id` (uuid, required) - references auth.users
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on stars table
    - Add policies for:
      - Anyone can read stars
      - Authenticated users can create their own stars
      - Users can only update/delete their own stars
*/

-- Create stars table
CREATE TABLE stars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  x float NOT NULL,
  y float NOT NULL,
  size float NOT NULL,
  brightness float NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read stars"
  ON stars
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own stars"
  ON stars
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stars"
  ON stars
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stars"
  ON stars
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);