/*
# Create admin-managed tables: services, pricing_tiers, contact_messages, site_settings

1. Purpose
   Allows the admin to fully control the website content from the dashboard:
   - Services shown on the Services page
   - Pricing tiers shown on the Pricing page
   - Contact messages submitted from the Contact page
   - Site-wide settings (hero text, phone, email, address, social links)

2. New Tables
   - `services`
     - id (uuid PK)
     - title (text, not null)
     - description (text, not null)
     - icon (text, not null) — lucide icon name
     - features (text[], default '{}') — list of bullet features
     - sort_order (int, default 0)
     - is_active (boolean, default true)
     - created_at, updated_at (timestamptz)

   - `pricing_tiers`
     - id (uuid PK)
     - name (text, not null)
     - price (text, not null) — display string e.g. "₦2,000 – ₦5,000"
     - description (text, not null)
     - features (text[], default '{}')
     - icon (text, not null) — lucide icon name
     - highlight (boolean, default false)
     - sort_order (int, default 0)
     - is_active (boolean, default true)
     - created_at, updated_at (timestamptz)

   - `contact_messages`
     - id (uuid PK)
     - full_name (text, not null)
     - email (text, not null)
     - phone (text)
     - subject (text)
     - message (text, not null)
     - is_read (boolean, default false)
     - created_at (timestamptz)

   - `site_settings`
     - id (uuid PK, default fixed uuid)
     - hero_title (text)
     - hero_subtitle (text)
     - phone (text)
     - email (text)
     - address (text)
     - whatsapp_number (text)
     - facebook_url (text)
     - twitter_url (text)
     - instagram_url (text)
     - updated_at (timestamptz)

3. Security
   - services, pricing_tiers, site_settings: public read (anon + authenticated), admin write (authenticated only)
   - contact_messages: public insert (anon + authenticated), admin read/update/delete (authenticated only)

4. Notes
   - Seed data inserted for services, pricing_tiers, and site_settings based on current hardcoded values.
*/

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Home',
  features text[] DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- PRICING TIERS
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  description text NOT NULL,
  features text[] DEFAULT '{}',
  icon text NOT NULL DEFAULT 'Leaf',
  highlight boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_pricing_tiers" ON pricing_tiers;
CREATE POLICY "public_read_pricing_tiers" ON pricing_tiers FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_pricing_tiers" ON pricing_tiers;
CREATE POLICY "auth_insert_pricing_tiers" ON pricing_tiers FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_pricing_tiers" ON pricing_tiers;
CREATE POLICY "auth_update_pricing_tiers" ON pricing_tiers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_pricing_tiers" ON pricing_tiers;
CREATE POLICY "auth_delete_pricing_tiers" ON pricing_tiers FOR DELETE
  TO authenticated USING (true);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- SITE SETTINGS (single-row table)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001',
  hero_title text,
  hero_subtitle text,
  phone text,
  email text,
  address text,
  whatsapp_number text,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- SEED DATA
INSERT INTO services (title, description, icon, features, sort_order) VALUES
('Household Waste Collection', 'Removal of domestic waste from homes, compounds, and residential properties. We handle everyday household waste including food waste, packaging, and general refuse.', 'Home', ARRAY['Scheduled pickups','Single or recurring requests','All residential areas','Eco-conscious disposal'], 0),
('Commercial Waste Collection', 'Reliable waste collection for businesses, shops, offices, restaurants, and hotels. We keep your business premises clean and compliant.', 'Building2', ARRAY['Flexible scheduling','Bulk waste handling','Monthly contracts available','Professional service'], 1),
('Community Cleanup', 'Environmental sanitation and neighborhood cleaning campaigns. We partner with communities, estates, and local leaders for large-scale cleanup projects.', 'Users', ARRAY['Neighborhood-wide cleanup','Estate and market sanitation','Community partnerships','Group coordination'], 2),
('Construction Waste Removal', 'Removal of construction debris, building materials, rubble, and demolition waste from construction sites and renovation projects.', 'HardHat', ARRAY['Debris and rubble removal','Site clearance','Heavy-duty transport','Post-construction cleanup'], 3),
('Emergency Waste Collection', 'Urgent waste pickup services for situations that cannot wait. Blocked drains, sudden accumulation, or urgent sanitation needs.', 'Zap', ARRAY['Fast dispatch','Same-day service','Urgent response team','After-hours availability'], 4)
ON CONFLICT DO NOTHING;

INSERT INTO pricing_tiers (name, price, description, features, icon, highlight, sort_order) VALUES
('Small Pickup', '₦2,000 – ₦5,000', 'Perfect for homes and small waste amounts.', ARRAY['1-3 bags of waste','Household waste','Single pickup','Same-day available'], 'Leaf', false, 0),
('Medium Pickup', '₦5,000 – ₦15,000', 'Great for larger homes and small businesses.', ARRAY['4-10 bags of waste','Household or commercial','Single or scheduled pickup','Priority response'], 'Building', true, 1),
('Large Pickup', 'Custom Quote', 'For bulk waste, construction debris, or contracts.', ARRAY['10+ bags or truck load','Construction & bulk waste','Custom scheduling','Dedicated team'], 'Users', false, 2)
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (id, hero_title, hero_subtitle, phone, email, address, whatsapp_number)
VALUES ('00000000-0000-0000-0000-000000000001', 'A Cleaner Kano Starts Here', 'Professional waste collection and environmental cleanup services across Kano State.', '+234 902 333 8788', 'info@kanocleanup.com', 'Kano State, Nigeria', '2349023338788')
ON CONFLICT (id) DO NOTHING;

-- updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_services_updated_at ON services;
CREATE TRIGGER trg_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_pricing_tiers_updated_at ON pricing_tiers;
CREATE TRIGGER trg_pricing_tiers_updated_at BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON site_settings;
CREATE TRIGGER trg_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();