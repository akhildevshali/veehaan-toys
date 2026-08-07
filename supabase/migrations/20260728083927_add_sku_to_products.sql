/*
# Add SKU column to products table

1. Modified Tables
- `products`
  - Added `sku` (text, nullable, unique) — a Stock Keeping Unit identifier for each product.
    When bulk-uploading products, rows with an SKU that already exists in the database
    will UPDATE the existing product (overwriting only the fields provided in the upload).
    Rows with a new SKU (or no SKU) will INSERT a new product.
  - Added a unique index on `sku` to enforce uniqueness and support fast lookups during upsert.

2. No security changes — existing RLS policies on products remain unchanged.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sku'
  ) THEN
    ALTER TABLE products ADD COLUMN sku text;
  END IF;
END $$;

-- Drop and recreate the unique index to ensure it exists and is idempotent
DROP INDEX IF EXISTS products_sku_idx;
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_idx ON products (sku) WHERE sku IS NOT NULL;
