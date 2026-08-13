ALTER TABLE public.departures ADD COLUMN IF NOT EXISTS return_date date;

CREATE POLICY "trip images admin read"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'trip-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "trip images admin insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'trip-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "trip images admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'trip-images' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'trip-images' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "trip images admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'trip-images' AND public.has_role(auth.uid(), 'admin'::app_role));