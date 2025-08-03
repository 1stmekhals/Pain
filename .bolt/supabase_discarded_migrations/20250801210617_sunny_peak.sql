/*
  # Add star_name column to stars table

  1. Changes
    - Add `star_name` column to `stars` table
    - Make star_name NOT NULL with unique constraint
    - Update existing stars with generated names
    - Add index for performance

  2. Security
    - Maintain existing RLS policies
*/

-- Add star_name column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stars' AND column_name = 'star_name'
  ) THEN
    ALTER TABLE stars ADD COLUMN star_name text;
  END IF;
END $$;

-- Update existing stars with generated names
UPDATE stars 
SET star_name = 'Star-' || substr(id::text, 1, 8)
WHERE star_name IS NULL;

-- Make star_name NOT NULL and add unique constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stars' AND column_name = 'star_name' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE stars ALTER COLUMN star_name SET NOT NULL;
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'stars' AND constraint_name = 'stars_star_name_unique'
  ) THEN
    ALTER TABLE stars ADD CONSTRAINT stars_star_name_unique UNIQUE (star_name);
  END IF;
END $$;

-- Add index for performance
CREATE INDEX IF NOT EXISTS stars_star_name_idx ON stars (star_name);