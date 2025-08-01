/*
  # Create admin functions for user management

  1. New Functions
    - `get_admin_users()` - Returns user data for admin panel
    - `delete_user(user_id)` - Safely deletes a user and all related data
  
  2. Security
    - Functions use SECURITY DEFINER to access auth.users
    - Grant execute permissions to authenticated users
    - Admin-only access should be enforced at application level
  
  3. Features
    - get_admin_users joins auth.users with profiles for complete user info
    - delete_user cascades deletion to all related tables
    - Proper error handling and transaction safety
*/

-- Function to get all users with their profile information for admin panel
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
    user_id uuid,
    email text,
    first_name text,
    last_name text,
    username text,
    display_name text,
    created_at timestamptz,
    is_profile_complete boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        au.id AS user_id,
        au.email::text AS email,
        p.first_name AS first_name,
        p.last_name AS last_name,
        p.username AS username,
        p.display_name AS display_name,
        au.created_at AS created_at,
        COALESCE(p.is_profile_complete, false) AS is_profile_complete
    FROM
        auth.users au
    LEFT JOIN
        public.profiles p ON au.id = p.id
    ORDER BY
        au.created_at DESC;
END;
$$;

-- Function to delete a user and all related data
CREATE OR REPLACE FUNCTION public.delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete from auth.users (this will cascade to profiles due to foreign key)
    -- The cascade will also handle stars and other related data
    DELETE FROM auth.users WHERE id = user_id;
    
    -- If the user doesn't exist, this will just complete without error
    -- which is the desired behavior for idempotent operations
END;
$$;

-- Grant execute permissions to authenticated users
-- Note: Application-level admin checks should still be enforced
GRANT EXECUTE ON FUNCTION public.get_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user(uuid) TO authenticated;