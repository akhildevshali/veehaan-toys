DROP POLICY IF EXISTS "authenticated_upload_product_media" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_update_product_media" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_delete_product_media" ON storage.objects;

CREATE POLICY "upload_product_media" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'product-media');

CREATE POLICY "update_product_media" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'product-media') WITH CHECK (bucket_id = 'product-media');

CREATE POLICY "delete_product_media" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'product-media');
