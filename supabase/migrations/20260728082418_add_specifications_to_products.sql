/*
# Add specifications column to products table

1. Modified Tables
- `products`
  - Added `specifications` (text[], default empty array) — stores up to 6 key specification
    bullet points for a product (e.g. "Age: 5-12 years", "Battery: 1200mAh", etc.)
    This replaces the short_description field in the UI; short_description is kept for
    backward compatibility but is no longer shown on the product page.

2. No security changes — existing RLS policies on products remain unchanged.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'specifications'
  ) THEN
    ALTER TABLE products ADD COLUMN specifications text[] NOT NULL DEFAULT '{}';
  END IF;
END $$;
