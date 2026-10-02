/*
# Add customer accounts and separate administrator permissions

1. Purpose
   Converts the anonymous pickup flow into a secure two-sided CleanBin platform.
   Customers can own profiles, saved addresses, pickup requests, and notifications.
   Administrators are identified by a protected `admins` table and retain management access.

2. New Tables
   - `admins`: protected list of authorized administrator auth users.
   - `customer_profiles`: customer identity and contact details.
   - `saved_addresses`: reusable customer pickup locations.
   - `notifications`: in-app customer updates.
   - `pickup_request_events`: request status history.

3. Modified Tables
   - `pickup_requests` adds nullable `user_id`, customer-facing `request_id`, and `photos`.
   - Existing service, pricing, contact, settings, pickup, and storage policies are tightened.

4. Security
   - Customers can only read and update their own profile, addresses, pickup requests, notifications, and request history.
   - Administrators are the only authenticated users who can read all customers, update pickup requests, manage services, pricing, settings, messages, and request photos.
   - Anonymous users can no longer create pickup requests or upload pickup photos.
   - Public reads for services, pricing, settings, and existing photo viewing remain available.

5. Important Notes
   - Existing anonymous pickup records remain available to administrators and are not deleted.
   - Existing records receive a request reference but remain unassigned until matched by an administrator.
   - The existing bootstrap administrator is added to `admins` by email when present.
   - The migration is idempotent and does not remove or rename existing data.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins_view_self" ON admins;
CREATE POLICY "admins_view_self" ON admins FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE pickup_requests ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE pickup_requests ADD COLUMN IF NOT EXISTS request_id text;
ALTER TABLE pickup_requests ADD COLUMN IF NOT EXISTS photos text[] NOT NULL DEFAULT '{}';
UPDATE pickup_requests SET request_id = 'CB-' || upper(replace(id::text, '-', '')) WHERE request_id IS NULL;
ALTER TABLE pickup_requests ALTER COLUMN request_id SET DEFAULT ('CB-' || upper(replace(gen_random_uuid()::text, '-', '')));
ALTER TABLE pickup_requests ALTER COLUMN request_id SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pickup_requests_request_id ON pickup_requests (request_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_user_id ON pickup_requests (user_id);

CREATE TABLE IF NOT EXISTS customer_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  profile_photo text,
  address text NOT NULL DEFAULT '',
  lga text NOT NULL DEFAULT '',
  notification_preferences jsonb NOT NULL DEFAULT '{"in_app": true}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customers_read_own_profile" ON customer_profiles;
CREATE POLICY "customers_read_own_profile" ON customer_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins_read_profiles" ON customer_profiles;
CREATE POLICY "admins_read_profiles" ON customer_profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "customers_update_own_profile" ON customer_profiles;
CREATE POLICY "customers_update_own_profile" ON customer_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS saved_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  address_name text NOT NULL,
  address text NOT NULL,
  lga text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customers_read_own_addresses" ON saved_addresses;
CREATE POLICY "customers_read_own_addresses" ON saved_addresses FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "customers_insert_own_addresses" ON saved_addresses;
CREATE POLICY "customers_insert_own_addresses" ON saved_addresses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "customers_update_own_addresses" ON saved_addresses;
CREATE POLICY "customers_update_own_addresses" ON saved_addresses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "customers_delete_own_addresses" ON saved_addresses;
CREATE POLICY "customers_delete_own_addresses" ON saved_addresses FOR DELETE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins_read_addresses" ON saved_addresses;
CREATE POLICY "admins_read_addresses" ON saved_addresses FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'system',
  pickup_request_id uuid REFERENCES pickup_requests(id) ON DELETE CASCADE,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customers_read_own_notifications" ON notifications;
CREATE POLICY "customers_read_own_notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "customers_update_own_notifications" ON notifications;
CREATE POLICY "customers_update_own_notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS pickup_request_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_request_id uuid NOT NULL REFERENCES pickup_requests(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE pickup_request_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "customers_read_own_request_events" ON pickup_request_events;
CREATE POLICY "customers_read_own_request_events" ON pickup_request_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM pickup_requests WHERE pickup_requests.id = pickup_request_events.pickup_request_id AND pickup_requests.user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_read_request_events" ON pickup_request_events;
CREATE POLICY "admins_read_request_events" ON pickup_request_events FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "anon_insert_pickup_requests" ON pickup_requests;
DROP POLICY IF EXISTS "auth_select_pickup_requests" ON pickup_requests;
DROP POLICY IF EXISTS "auth_update_pickup_requests" ON pickup_requests;
DROP POLICY IF EXISTS "auth_delete_pickup_requests" ON pickup_requests;
DROP POLICY IF EXISTS "auth_delete_pickick_requests" ON pickup_requests;
DROP POLICY IF EXISTS "customers_insert_own_pickups" ON pickup_requests;
CREATE POLICY "customers_insert_own_pickups" ON pickup_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "customers_select_own_pickups" ON pickup_requests;
CREATE POLICY "customers_select_own_pickups" ON pickup_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admins_select_all_pickups" ON pickup_requests;
CREATE POLICY "admins_select_all_pickups" ON pickup_requests FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_update_pickups" ON pickup_requests;
CREATE POLICY "admins_update_pickups" ON pickup_requests FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "admins_delete_pickups" ON pickup_requests;
CREATE POLICY "admins_delete_pickups" ON pickup_requests FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "auth_insert_services" ON services;
DROP POLICY IF EXISTS "auth_update_services" ON services;
DROP POLICY IF EXISTS "auth_delete_services" ON services;
DROP POLICY IF EXISTS "admins_insert_services" ON services;
DROP POLICY IF EXISTS "admins_update_services" ON services;
DROP POLICY IF EXISTS "admins_delete_services" ON services;
CREATE POLICY "admins_insert_services" ON services FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
CREATE POLICY "admins_update_services" ON services FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
CREATE POLICY "admins_delete_services" ON services FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "auth_insert_pricing_tiers" ON pricing_tiers;
DROP POLICY IF EXISTS "auth_update_pricing_tiers" ON pricing_tiers;
DROP POLICY IF EXISTS "auth_delete_pricing_tiers" ON pricing_tiers;
DROP POLICY IF EXISTS "admins_insert_pricing_tiers" ON pricing_tiers;
DROP POLICY IF EXISTS "admins_update_pricing_tiers" ON pricing_tiers;
DROP POLICY IF EXISTS "admins_delete_pricing_tiers" ON pricing_tiers;
CREATE POLICY "admins_insert_pricing_tiers" ON pricing_tiers FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
CREATE POLICY "admins_update_pricing_tiers" ON pricing_tiers FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
CREATE POLICY "admins_delete_pricing_tiers" ON pricing_tiers FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "admins_select_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "admins_update_contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "admins_delete_contact_messages" ON contact_messages;
CREATE POLICY "admins_select_contact_messages" ON contact_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
CREATE POLICY "admins_update_contact_messages" ON contact_messages FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
CREATE POLICY "admins_delete_contact_messages" ON contact_messages FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
DROP POLICY IF EXISTS "admins_update_site_settings" ON site_settings;
CREATE POLICY "admins_update_site_settings" ON site_settings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

DROP POLICY IF EXISTS "anon_upload_pickup_photos" ON storage.objects;
DROP POLICY IF EXISTS "customers_upload_pickup_photos" ON storage.objects;
CREATE POLICY "customers_upload_pickup_photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'pickup-photos' AND ((storage.foldername(name))[1] = auth.uid()::text OR EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())));
DROP POLICY IF EXISTS "auth_update_pickup_photos" ON storage.objects;
DROP POLICY IF EXISTS "admins_update_pickup_photos" ON storage.objects;
CREATE POLICY "admins_update_pickup_photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'pickup-photos' AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())) WITH CHECK (bucket_id = 'pickup-photos' AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));
DROP POLICY IF EXISTS "auth_delete_pickup_photos" ON storage.objects;
DROP POLICY IF EXISTS "admins_delete_pickup_photos" ON storage.objects;
CREATE POLICY "admins_delete_pickup_photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'pickup-photos' AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_customer_profile()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.customer_profiles (user_id, full_name, phone, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), COALESCE(NEW.raw_user_meta_data ->> 'phone', ''), COALESCE(NEW.email, ''))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created_customer_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_customer_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_customer_profile();

CREATE OR REPLACE FUNCTION public.record_pickup_request_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.pickup_request_events (pickup_request_id, status, created_by) VALUES (NEW.id, NEW.status, NEW.user_id);
    IF NEW.user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type, pickup_request_id) VALUES (NEW.user_id, 'Pickup request submitted', 'Your CleanBin pickup request has been received and is pending review.', 'pickup_submitted', NEW.id);
    END IF;
  ELSIF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.pickup_request_events (pickup_request_id, status, created_by) VALUES (NEW.id, NEW.status, auth.uid());
    IF NEW.user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type, pickup_request_id) VALUES (NEW.user_id, 'Pickup status updated', 'Your pickup request is now marked as ' || replace(initcap(NEW.status), '_', ' ') || '.', 'pickup_status_changed', NEW.id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_pickup_request_event ON pickup_requests;
CREATE TRIGGER trg_pickup_request_event AFTER INSERT OR UPDATE OF status ON pickup_requests FOR EACH ROW EXECUTE FUNCTION public.record_pickup_request_event();

CREATE OR REPLACE FUNCTION public.update_customer_profile_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS trg_customer_profiles_updated_at ON customer_profiles;
CREATE TRIGGER trg_customer_profiles_updated_at BEFORE UPDATE ON customer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_customer_profile_updated_at();
DROP TRIGGER IF EXISTS trg_saved_addresses_updated_at ON saved_addresses;
CREATE TRIGGER trg_saved_addresses_updated_at BEFORE UPDATE ON saved_addresses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO admins (user_id)
SELECT id FROM auth.users WHERE email = 'admin@kanocleanup.com'
ON CONFLICT (user_id) DO NOTHING;