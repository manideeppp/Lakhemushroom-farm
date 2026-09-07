-- Public bucket for admin-uploaded product, gallery, and training images.
-- Included in supabase/setup_all.sql — use this patch only on existing projects
-- that were set up before site-media was added to the main setup file.

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "site media: public read" on storage.objects;
create policy "site media: public read"
  on storage.objects for select
  using (bucket_id = 'site-media');

drop policy if exists "site media: upload" on storage.objects;
create policy "site media: upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'site-media');
