-- Política de leitura pública para imagens do bucket trip-images
CREATE POLICY "Public read trip-images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'trip-images');

-- Política de escrita exclusiva para administradores no bucket trip-images
CREATE POLICY "Admin write trip-images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'trip-images'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'trip-images'
  AND public.has_role(auth.uid(), 'admin')
);