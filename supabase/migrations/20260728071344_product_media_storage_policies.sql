CREATE POLICY "public_read_product_media" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-media');

CREATE POLICY "authenticated_upload_product_media" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'product-media');

CREATE POLICY "authenticated_update_product_media" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'product-media') WITH CHECK (bucket_id = 'product-media');

CREATE POLICY "authenticated_delete_product_media" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'product-media');
