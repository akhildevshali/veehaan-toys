
-- =====================================================
-- Banner Click Action + Product Collections
-- =====================================================

-- 1. Collection master table
CREATE TABLE IF NOT EXISTS banner_product_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Untitled Collection',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Products inside each collection
CREATE TABLE IF NOT EXISTS banner_product_collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL
    REFERENCES banner_product_collections(id)
    ON DELETE CASCADE,
  product_id uuid NOT NULL
    REFERENCES products(id)
    ON DELETE CASCADE,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE(collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_banner_collection_items_collection
ON banner_product_collection_items(collection_id);

CREATE INDEX IF NOT EXISTS idx_banner_collection_items_product
ON banner_product_collection_items(product_id);

-- =====================================================
-- 3. HOME BANNERS
-- =====================================================

ALTER TABLE banners
ADD COLUMN IF NOT EXISTS click_action text NOT NULL DEFAULT 'link';

ALTER TABLE banners
ADD COLUMN IF NOT EXISTS collection_id uuid
REFERENCES banner_product_collections(id)
ON DELETE SET NULL;

-- =====================================================
-- 4. PROMO BANNERS
-- =====================================================

ALTER TABLE home_promo_banners
ADD COLUMN IF NOT EXISTS click_action text NOT NULL DEFAULT 'link';

ALTER TABLE home_promo_banners
ADD COLUMN IF NOT EXISTS collection_id uuid
REFERENCES banner_product_collections(id)
ON DELETE SET NULL;

-- =====================================================
-- 5. SHOP BY CATEGORY
-- =====================================================

ALTER TABLE shop_categories
ADD COLUMN IF NOT EXISTS click_action text NOT NULL DEFAULT 'link';

ALTER TABLE shop_categories
ADD COLUMN IF NOT EXISTS collection_id uuid
REFERENCES banner_product_collections(id)
ON DELETE SET NULL;

-- =====================================================
-- 6. CHECK CONSTRAINTS
-- =====================================================

DO $$
BEGIN

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'banners_click_action_check'
  ) THEN
    ALTER TABLE banners
    ADD CONSTRAINT banners_click_action_check
    CHECK (click_action IN ('link', 'bulk_sku'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'promo_click_action_check'
  ) THEN
    ALTER TABLE home_promo_banners
    ADD CONSTRAINT promo_click_action_check
    CHECK (click_action IN ('link', 'bulk_sku'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'shop_category_click_action_check'
  ) THEN
    ALTER TABLE shop_categories
    ADD CONSTRAINT shop_category_click_action_check
    CHECK (click_action IN ('link', 'bulk_sku'));
  END IF;

END $$;

-- =====================================================
-- 7. RLS
-- Same public policy style as existing storefront tables
-- =====================================================

ALTER TABLE banner_product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_product_collection_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view banner collections"
ON banner_product_collections;

CREATE POLICY "Anyone can view banner collections"
ON banner_product_collections
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can insert banner collections"
ON banner_product_collections;

CREATE POLICY "Anyone can insert banner collections"
ON banner_product_collections
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update banner collections"
ON banner_product_collections;

CREATE POLICY "Anyone can update banner collections"
ON banner_product_collections
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete banner collections"
ON banner_product_collections;

CREATE POLICY "Anyone can delete banner collections"
ON banner_product_collections
FOR DELETE
TO anon, authenticated
USING (true);


DROP POLICY IF EXISTS "Anyone can view banner collection items"
ON banner_product_collection_items;

CREATE POLICY "Anyone can view banner collection items"
ON banner_product_collection_items
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can insert banner collection items"
ON banner_product_collection_items;

CREATE POLICY "Anyone can insert banner collection items"
ON banner_product_collection_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update banner collection items"
ON banner_product_collection_items;

CREATE POLICY "Anyone can update banner collection items"
ON banner_product_collection_items
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete banner collection items"
ON banner_product_collection_items;

CREATE POLICY "Anyone can delete banner collection items"
ON banner_product_collection_items
FOR DELETE
TO anon, authenticated
USING (true);