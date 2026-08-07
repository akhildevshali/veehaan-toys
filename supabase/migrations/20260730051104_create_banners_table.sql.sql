/*
# Create banners table for homepage hero slider

1. New Table
- `banners`
  - id (uuid, primary key)
  - title (text, not null) — main heading shown on the slide
  - subtitle (text) — supporting text under the title
  - button_text (text) — CTA button label
  - button_link (text) — CTA button URL (internal route like /shop)
  - image_url (text) — optional uploaded background image
  - background_color (text) — CSS color/gradient used when no image is set
  - display_order (integer, default 0) — controls slide ordering (lower = first)
  - is_active (boolean, default true) — inactive banners are hidden from the slider
  - created_at (timestamptz)
  - updated_at (timestamptz)

2. Indexes
- idx_banners_display_order on (display_order) — for ordered slider queries
- idx_banners_active on (is_active) — for filtering active banners

3. Security
- RLS enabled on banners.
- This is a no-auth storefront using the anon key, so policies use
  TO anon, authenticated with permissive USING (true) / WITH CHECK (true)
  because the data is intentionally shared/public.
*/

CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  button_text text,
  button_link text,
  image_url text,
  background_color text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners (display_order);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners (is_active);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view banners" ON banners;
CREATE POLICY "Anyone can view banners"
  ON banners FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can insert banners" ON banners;
CREATE POLICY "Anyone can insert banners"
  ON banners FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update banners" ON banners;
CREATE POLICY "Anyone can update banners"
  ON banners FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete banners" ON banners;
CREATE POLICY "Anyone can delete banners"
  ON banners FOR DELETE TO anon, authenticated USING (true);
