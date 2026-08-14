-- Run once in Supabase SQL Editor if checkout fails on screenshot upload.
-- Makes payment screenshots readable via public URL (required for password-only admin).

update storage.buckets
set public = true
where id = 'payment-screenshots';

insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', true)
on conflict (id) do update set public = true;

drop policy if exists "screenshots: public read" on storage.objects;
create policy "screenshots: public read"
  on storage.objects for select
  using (bucket_id = 'payment-screenshots');
