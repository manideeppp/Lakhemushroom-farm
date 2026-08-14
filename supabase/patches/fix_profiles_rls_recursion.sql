-- =============================================================================
-- FIX: "infinite recursion detected in policy for relation profiles"
-- Run once in Supabase → SQL Editor. Then retry checkout.
-- =============================================================================

create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function public.is_admin_user() to anon, authenticated;

do $$ declare r record; begin
  for r in (
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
  ) loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

drop policy if exists "screenshots: self upload" on storage.objects;
drop policy if exists "screenshots: self read" on storage.objects;
drop policy if exists "screenshots: public read" on storage.objects;

-- profiles
alter table public.profiles enable row level security;
create policy "profiles: self insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles: admin read" on public.profiles
  for select using (public.is_admin_user());
create policy "profiles: admin update" on public.profiles
  for update using (public.is_admin_user());

-- products
alter table public.products enable row level security;
create policy "products: public read" on public.products
  for select using (is_published or public.is_admin_user());
create policy "products: admin write" on public.products
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- training_courses
alter table public.training_courses enable row level security;
create policy "training_courses: public read" on public.training_courses
  for select using (is_published or public.is_admin_user());
create policy "training_courses: admin write" on public.training_courses
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- training_modules
alter table public.training_modules enable row level security;
create policy "training_modules: enrolled read" on public.training_modules
  for select using (
    exists (
      select 1
      from public.orders o
      join public.order_items oi on oi.order_id = o.id
      where o.user_id = auth.uid()
        and o.status = 'approved'
        and oi.item_type = 'training'
        and oi.status = 'access_granted'
        and oi.course_id = training_modules.course_id
    )
    or public.is_admin_user()
  );
create policy "training_modules: admin write" on public.training_modules
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- training_progress
alter table public.training_progress enable row level security;
create policy "training_progress: self all" on public.training_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "training_progress: admin read" on public.training_progress
  for select using (public.is_admin_user());

-- orders
alter table public.orders enable row level security;
create policy "orders: self read" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders: self insert" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders: self update pending" on public.orders
  for update using (auth.uid() = user_id and status = 'pending_verification');
create policy "orders: admin all" on public.orders
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- order_items
alter table public.order_items enable row level security;
create policy "order_items: self read" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );
create policy "order_items: self insert" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );
create policy "order_items: admin all" on public.order_items
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- offline_bookings
alter table public.offline_bookings enable row level security;
create policy "bookings: self read" on public.offline_bookings
  for select using (auth.uid() = user_id);
create policy "bookings: public insert" on public.offline_bookings
  for insert with check (true);
create policy "bookings: admin all" on public.offline_bookings
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- queries
alter table public.queries enable row level security;
create policy "queries: self read" on public.queries
  for select using (auth.uid() = user_id);
create policy "queries: public insert" on public.queries
  for insert with check (true);
create policy "queries: admin all" on public.queries
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- gallery + testimonials
alter table public.gallery_items enable row level security;
create policy "gallery: public read" on public.gallery_items
  for select using (true);
create policy "gallery: admin write" on public.gallery_items
  for all using (public.is_admin_user()) with check (public.is_admin_user());

alter table public.testimonials enable row level security;
create policy "testimonials: public read" on public.testimonials
  for select using (is_published);
create policy "testimonials: admin write" on public.testimonials
  for all using (public.is_admin_user()) with check (public.is_admin_user());

-- payment screenshots bucket
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', true)
on conflict (id) do update set public = true;

create policy "screenshots: self upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'payment-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "screenshots: public read"
  on storage.objects for select
  using (bucket_id = 'payment-screenshots');

create policy "screenshots: self read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'payment-screenshots'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin_user()
    )
  );
