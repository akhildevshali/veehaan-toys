/*
# Enable writes on products and categories (single-tenant, no auth)

1. Purpose
- This is a no-auth e-commerce storefront. The frontend uses the anon key, so all
  CRUD must be permitted for the `anon` role.
- Previously only a SELECT policy existed on `products` and `categories` were locked
  down. This adds INSERT/UPDATE/DELETE for both tables so an admin screen in the app
  can manage products and categories.

2. Tables affected
- `products` — add insert/update/delete policies for anon + authenticated.
- `categories` — add select/insert/update/delete policies for anon + authenticated
  (SELECT was missing too, which would have broken the catalog filter).

3. Security notes
- The app has no sign-in screen, so `TO anon, authenticated` is required for the
  storefront to function. Data is intentionally shared/public.
- These are intentionally permissive because there is no user-ownership concept
  in this single-tenant app.
*/

-- products: keep existing SELECT, add the missing CRUD verbs
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can insert products" ON products;
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update products" ON products;
CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete products" ON products;
CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  TO anon, authenticated USING (true);

-- categories: full CRUD for anon + authenticated
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can insert categories" ON categories;
CREATE POLICY "Anyone can insert categories"
  ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update categories" ON categories;
CREATE POLICY "Anyone can update categories"
  ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete categories" ON categories;
CREATE POLICY "Anyone can delete categories"
  ON categories FOR DELETE
  TO anon, authenticated USING (true);
