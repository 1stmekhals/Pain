/*
  # Add star names and sky system
  
  1. Changes
    - Add star_name column to stars table (unique constraint)
    - Add sky_type column to stars table (general or user-specific)
    - Add indexes for better performance
    - Update RLS policies for sky system
  
  2. Security
    - Maintain existing RLS policies
    - Add policies for sky-specific access
*/

-- Add star_name column with unique constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stars' AND column_name = 'star_name'
  ) THEN
    ALTER TABLE stars ADD COLUMN star_name text;
  END IF;
END $$;

-- Add sky_type column (general or user-specific)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stars' AND column_name = 'sky_type'
  ) THEN
    ALTER TABLE stars ADD COLUMN sky_type text DEFAULT 'general' CHECK (sky_type IN ('general', 'user'));
  END IF;
END $$;

-- Make star_name required and unique
ALTER TABLE stars ALTER COLUMN star_name SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS stars_star_name_unique ON stars (star_name);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS stars_sky_type_idx ON stars (sky_type);
CREATE INDEX IF NOT EXISTS stars_profile_id_sky_type_idx ON stars (profile_id, sky_type);

-- Update existing stars to have default values
UPDATE stars SET 
  star_name = 'Star ' || substr(id::text, 1, 8),
  sky_type = 'general'
WHERE star_name IS NULL OR sky_type IS NULL;

-- Add policy for general sky access
CREATE POLICY "Anyone can read general sky stars"
  ON stars
  FOR SELECT
  TO public
  USING (sky_type = 'general');

-- Add policy for user sky access
CREATE POLICY "Anyone can read user sky stars"
  ON stars
  FOR SELECT
  TO public
  USING (sky_type = 'user');