/*
# Add USD price column to products

1. Purpose
- The store currently stores only one price (INR). We want to show prices in both
  Indian Rupees and US Dollars, and allow bulk upload of both via Excel.
- This adds a nullable `price_usd` column so existing products keep working.

2. Tables affected
- `products` — add `price_usd` (numeric, nullable). No data is lost; existing rows
  get NULL which the app treats as "no USD price set".

3. Security
- No policy changes needed; existing permissive CRUD policies cover the new column.
*/

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS price_usd numeric;
