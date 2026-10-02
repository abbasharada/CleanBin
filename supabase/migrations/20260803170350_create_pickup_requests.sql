/*
# Create pickup_requests table for Kano Cleanup

1. Purpose
   Stores waste collection requests submitted by residents, businesses, and institutions in Kano State.
   This is a single-tenant MVP (no user accounts) — anyone can submit a request from the public form.
   Admin access to the dashboard is protected by Supabase Auth (email/password), separate from this table.

2. New Tables
   - `pickup_requests`
     - `id` (uuid, primary key)
     - `full_name` (text, not null) — name of the person requesting pickup
     - `phone_number` (text, not null) — contact phone
     - `address` (text, not null) — pickup address
     - `lga` (text, not null) — Local Government Area in Kano State
     - `waste_type` (text, not null) — household, commercial, community, construction, emergency
     - `waste_quantity` (text, not null) — estimated volume (small/medium/large or description)
     - `preferred_date` (date) — preferred collection date
     - `preferred_time` (text) — preferred collection time window
     - `photo_url` (text) — URL to uploaded photo in Supabase Storage (optional)
     - `notes` (text) — additional notes (optional)
     - `status` (text, not null, default 'pending') — pending, confirmed, assigned, on_the_way, completed
     - `assigned_worker` (text) — worker assigned by admin (optional)
     - `price` (numeric) — quoted price (optional, admin-set)
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())

3. Indexes
   - `idx_pickup_requests_status` on `status` for dashboard filtering
   - `idx_pickup_requests_created_at` on `created_at` for chronological ordering
   - `idx_pickup_requests_lga` on `lga` for area-based filtering

4. Security
   - Enable RLS on `pickup_requests`.
   - INSERT: allow anon + authenticated (public form submission).
   - SELECT/UPDATE/DELETE: authenticated only (admin dashboard).
     The admin signs in via Supabase Auth; once authenticated they can view, update status,
     assign workers, and delete requests. Anon users can only submit new requests — they
     cannot read or modify existing ones.
*/

CREATE TABLE IF NOT EXISTS pickup_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  lga text NOT NULL,
  waste_type text NOT NULL,
  waste_quantity text NOT NULL,
  preferred_date date,
  preferred_time text,
  photo_url text,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  assigned_worker text,
  price numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON pickup_requests (status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_created_at ON pickup_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_lga ON pickup_requests (lga);

-- INSERT: public can submit requests
DROP POLICY IF EXISTS "anon_insert_pickup_requests" ON pickup_requests;
CREATE POLICY "anon_insert_pickup_requests" ON pickup_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- SELECT: only authenticated (admin) can view requests
DROP POLICY IF EXISTS "auth_select_pickup_requests" ON pickup_requests;
CREATE POLICY "auth_select_pickup_requests" ON pickup_requests
  FOR SELECT TO authenticated
  USING (true);

-- UPDATE: only authenticated (admin) can update requests
DROP POLICY IF EXISTS "auth_update_pickup_requests" ON pickup_requests;
CREATE POLICY "auth_update_pickup_requests" ON pickup_requests
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

-- DELETE: only authenticated (admin) can delete requests
DROP POLICY IF EXISTS "auth_delete_pickup_requests" ON pickup_requests;
CREATE POLICY "auth_delete_pickick_requests" ON pickup_requests
  FOR DELETE TO authenticated
  USING (true);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pickup_requests_updated_at ON pickup_requests;
CREATE TRIGGER trg_pickup_requests_updated_at
  BEFORE UPDATE ON pickup_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();