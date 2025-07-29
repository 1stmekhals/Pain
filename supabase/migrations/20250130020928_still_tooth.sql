/*
  # Add background music table

  1. New Tables
    - `background_music`
      - `id` (uuid, primary key)
      - `url` (text, not null) - URL to the music file
      - `title` (text, not null) - Title of the music
      - `is_active` (boolean) - Whether this music is currently playing
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `background_music` table
    - Add policies for read/write access
*/

CREATE TABLE background_music (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  title text NOT NULL,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE background_music ENABLE ROW LEVEL SECURITY;

-- Anyone can read the active background music
CREATE POLICY "Anyone can read background music"
  ON background_music
  FOR SELECT
  TO public
  USING (true);

-- Only admins can manage background music
CREATE POLICY "Admins can manage background music"
  ON background_music
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@example.com'
  ));