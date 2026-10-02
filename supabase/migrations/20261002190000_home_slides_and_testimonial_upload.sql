-- Individual title and description for each home carousel image.
alter table public.site_settings
  add column if not exists hero_slides jsonb not null default '[]'::jsonb;

-- Public comment photos can be uploaded only into the testimonial folder.
drop policy if exists "Public can upload testimonial photos" on storage.objects;
create policy "Public can upload testimonial photos"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'trip-images'
  and (storage.foldername(name))[1] = 'depoimento'
);
