/*
  # Storage policies for background music

  1. Storage Policies
    - Enable public access to background music bucket
    - Allow admin users to upload music files
    - Allow anyone to read music files
*/

-- Create storage policies for background-music bucket
DO $$
BEGIN
  -- Enable storage for authenticated users
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('background-music', 'background-music', true)
  ON CONFLICT (id) DO NOTHING;

  -- Allow admin users to create objects in the background-music bucket
  CREATE POLICY "Admin users can upload music"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'background-music' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

  -- Allow admin users to update objects in the background-music bucket
  CREATE POLICY "Admin users can update music"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'background-music' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

  -- Allow anyone to read objects from the background-music bucket
  CREATE POLICY "Anyone can read music"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'background-music');
END $$;