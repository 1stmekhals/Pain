/*
  # Update existing stars to general sky

  1. Updates
    - Set all existing stars without sky_type to 'general'
    - Ensures all stars are visible in the general sky by default

  2. Notes
    - This migration ensures backward compatibility
    - All existing stars will be visible to everyone
*/

-- Update all existing stars to have sky_type = 'general' if they don't have one
UPDATE stars 
SET sky_type = 'general' 
WHERE sky_type IS NULL OR sky_type = '';

-- Ensure the column has a proper default
ALTER TABLE stars ALTER COLUMN sky_type SET DEFAULT 'general';