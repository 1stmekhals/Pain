/*
  # Add anonymous option for stars

  1. Changes
    - Add is_anonymous column to stars table
    - Update existing stars to have is_anonymous = false by default
    - No destructive changes to existing data
*/

-- Add is_anonymous column to stars table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stars' AND column_name = 'is_anonymous'
  ) THEN
    ALTER TABLE stars ADD COLUMN is_anonymous boolean DEFAULT false;
  END IF;
END $$;

-- Update existing stars to have is_anonymous = false
UPDATE stars SET is_anonymous = false WHERE is_anonymous IS NULL;

-- Make the column NOT NULL with default false
ALTER TABLE stars ALTER COLUMN is_anonymous SET NOT NULL;
ALTER TABLE stars ALTER COLUMN is_anonymous SET DEFAULT false;