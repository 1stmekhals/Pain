/*
  # Add sky_type column to stars table

  1. New Columns
    - `sky_type` (text) - Determines if star belongs to 'general' or 'user' sky
  
  2. Data Migration
    - Set all existing stars to 'general' sky type
  
  3. Constraints
    - Add check constraint to ensure sky_type is either 'general' or 'user'
    - Set default value to 'general'
  
  4. Indexes
    - Add index for efficient sky filtering
*/

-- Add sky_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stars' AND column_name = 'sky_type'
  ) THEN
    ALTER TABLE stars ADD COLUMN sky_type text DEFAULT 'general';
  END IF;
END $$;

-- Update existing stars to have general sky type
UPDATE stars SET sky_type = 'general' WHERE sky_type IS NULL;

-- Make sky_type NOT NULL
ALTER TABLE stars ALTER COLUMN sky_type SET NOT NULL;

-- Add check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'stars' AND constraint_name = 'stars_sky_type_check'
  ) THEN
    ALTER TABLE stars ADD CONSTRAINT stars_sky_type_check 
    CHECK (sky_type IN ('general', 'user'));
  END IF;
END $$;

-- Add index for efficient filtering
CREATE INDEX IF NOT EXISTS stars_sky_type_idx ON stars(sky_type);
CREATE INDEX IF NOT EXISTS stars_profile_id_sky_type_idx ON stars(profile_id, sky_type);