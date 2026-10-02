/*
# Create storage bucket for pickup request photos

1. Purpose
   A public storage bucket to hold photos uploaded by users when submitting waste collection requests.
   Photos help the collection team assess waste volume and type before dispatching.

2. Storage
   - Bucket name: `pickup-photos`
   - Public bucket: yes (so photo URLs are accessible by the admin dashboard)

3. Policies
   - INSERT: allow anon + authenticated to upload photos (public form).
   - SELECT: allow public read (anon + authenticated) so both the form preview and admin dashboard can display photos.
   - UPDATE/DELETE: authenticated only (admin management).
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('pickup-photos', 'pickup-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to upload photos
DROP POLICY IF EXISTS "anon_upload_pickup_photos" ON storage.objects;
CREATE POLICY "anon_upload_pickup_photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'pickup-photos');

-- Allow public to read photos
DROP POLICY IF EXISTS "public_read_pickup_photos" ON storage.objects;
CREATE POLICY "public_read_pickup_photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'pickup-photos');

-- Allow authenticated (admin) to update/delete
DROP POLICY IF EXISTS "auth_update_pickup_photos" ON storage.objects;
CREATE POLICY "auth_update_pickup_photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'pickup-photos') WITH CHECK (bucket_id = 'pickup-photos');

DROP POLICY IF EXISTS "auth_delete_pickup_photos" ON storage.objects;
CREATE POLICY "auth_delete_pickup_photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'pickup-photos');