/*
  # Add specific admin user
  
  1. Actions
    - Add '1st.mekhlas@gmail.com' as an admin user
*/

-- Add the specific admin user
SELECT add_admin('1st.mekhlas@gmail.com');

-- Verify admin was added
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = '1st.mekhlas@gmail.com'
  ) THEN
    RAISE EXCEPTION 'Failed to add admin user';
  END IF;
END $$;