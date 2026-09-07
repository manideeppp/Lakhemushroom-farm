-- =============================================================================
-- Lakhe Mushroom Farm — COMPLETE Supabase setup (run this ONE file)
-- =============================================================================
-- Paste into Supabase → SQL Editor → Run.
-- Includes: schema, RLS, storage, admin portal RPCs, training fix, sample seed.
-- Safe to re-run (IF NOT EXISTS / CREATE OR REPLACE).
--
-- Coupons: run supabase/patches/coupons_and_delete_order.sql separately.
--
-- Admin login: https://your-site/admin — password lakhe-admin-2026
-- (must match VITE_ADMIN_PASSWORD on Vercel)
-- =============================================================================

-- --------- extensions ------------------------------------------------------
create extension if not exists "pgcrypto";

-- --------- helpers ---------------------------------------------------------

-- Auto-updated updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Order reference generator: LMF-00001, LMF-00002 ...
create sequence if not exists order_ref_seq start 100;
create or replace function public.gen_order_ref()
returns text language sql as $$
  select 'LMF-' || lpad(nextval('order_ref_seq')::text, 5, '0');
$$;

create sequence if not exists booking_ref_seq start 100;
create or replace function public.gen_booking_ref()
returns text language sql as $$
  select 'BKG-' || lpad(nextval('booking_ref_seq')::text, 5, '0');
$$;

-- ==============================================================
-- profiles
-- ==============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  address text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.tg_set_updated_at();

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger security definer language plpgsql as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================
-- products
-- ==============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (category in ('spawn','fresh','dry','powder','ready-to-eat')),
  short_description text,
  description text,
  price numeric(10,2) not null default 0,
  unit text,
  images text[] not null default '{}',
  badges text[] not null default '{}',
  stock integer not null default 0,
  rating numeric(2,1) default 4.8,
  highlights text[] default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.tg_set_updated_at();

-- ==============================================================
-- training courses & modules
-- ==============================================================
create table if not exists public.training_courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  format text not null check (format in ('online','offline','hybrid')),
  price numeric(10,2) not null default 0,
  duration text,
  image text,
  short_description text,
  description text,
  features text[] default '{}',
  outcomes text[] default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists set_training_courses_updated_at on public.training_courses;
create trigger set_training_courses_updated_at
  before update on public.training_courses
  for each row execute function public.tg_set_updated_at();

create table if not exists public.training_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.training_courses(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  duration_minutes integer,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.training_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.training_courses(id) on delete cascade,
  module_id uuid not null references public.training_modules(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- ==============================================================
-- orders & order_items
-- ==============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text not null unique default public.gen_order_ref(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  delivery_address text,
  subtotal numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pending_verification'
    check (status in ('pending_verification','approved','rejected','cancelled')),
  payment_method text not null default 'upi',
  upi_txn_id text,
  payment_screenshot_url text,
  admin_notes text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.tg_set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_type text not null check (item_type in ('product','training')),
  product_id uuid references public.products(id),
  course_id uuid references public.training_courses(id),
  name text not null,
  unit_price numeric(10,2) not null default 0,
  qty integer not null default 1,
  status text not null default 'pending'
    check (status in ('pending','processing','delivered','access_pending','access_granted','rejected')),
  image text,
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- ==============================================================
-- offline bookings
-- ==============================================================
create table if not exists public.offline_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique default public.gen_booking_ref(),
  user_id uuid references auth.users(id) on delete set null,
  course_id uuid references public.training_courses(id),
  course_title text not null,
  name text not null,
  phone text not null,
  email text,
  preferred_date date not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending','confirmed','rejected','cancelled')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists set_offline_bookings_updated_at on public.offline_bookings;
create trigger set_offline_bookings_updated_at
  before update on public.offline_bookings
  for each row execute function public.tg_set_updated_at();

-- ==============================================================
-- customer queries
-- ==============================================================
create table if not exists public.queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new'
    check (status in ('new','in_progress','closed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists set_queries_updated_at on public.queries;
create trigger set_queries_updated_at
  before update on public.queries
  for each row execute function public.tg_set_updated_at();

-- ==============================================================
-- gallery + testimonials (admin managed)
-- ==============================================================
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('image','video')),
  category text not null check (category in ('farm','cultivation','journey','others')),
  media_url text not null,
  thumbnail_url text,
  caption text,
  "order" integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  role text,
  avatar text,
  rating integer not null default 5,
  quote text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);


-- --------- re-run helpers (policies + triggers) ----------------------------
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
drop policy if exists "site media: public read" on storage.objects;
drop policy if exists "site media: upload" on storage.objects;

alter table public.orders add column if not exists delivery_address text;

-- Avoid infinite recursion: policies must not query profiles directly.
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

-- ==============================================================
-- Row Level Security
-- ==============================================================

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

-- products (public read, admin write)
alter table public.products enable row level security;
create policy "products: public read" on public.products
  for select using (is_published or public.is_admin_user());
create policy "products: admin write" on public.products
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

-- training_courses
alter table public.training_courses enable row level security;
create policy "training_courses: public read" on public.training_courses
  for select using (is_published or public.is_admin_user());
create policy "training_courses: admin write" on public.training_courses
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

-- training_modules — visible to enrolled users (approved order with matching course) or admins
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
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

-- training_progress
alter table public.training_progress enable row level security;
create policy "training_progress: self all" on public.training_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "training_progress: admin read" on public.training_progress
  for select using (
    public.is_admin_user()
  );

-- orders
alter table public.orders enable row level security;
create policy "orders: self read" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders: self insert" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders: self update pending" on public.orders
  for update using (auth.uid() = user_id and status = 'pending_verification');
create policy "orders: admin all" on public.orders
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

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
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

-- offline_bookings
alter table public.offline_bookings enable row level security;
create policy "bookings: self read" on public.offline_bookings
  for select using (auth.uid() = user_id);
create policy "bookings: public insert" on public.offline_bookings
  for insert with check (true);
create policy "bookings: admin all" on public.offline_bookings
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

-- queries
alter table public.queries enable row level security;
create policy "queries: self read" on public.queries
  for select using (auth.uid() = user_id);
create policy "queries: public insert" on public.queries
  for insert with check (true);
create policy "queries: admin all" on public.queries
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

-- gallery + testimonials (public read, admin write)
alter table public.gallery_items enable row level security;
create policy "gallery: public read" on public.gallery_items
  for select using (true);
create policy "gallery: admin write" on public.gallery_items
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

alter table public.testimonials enable row level security;
create policy "testimonials: public read" on public.testimonials
  for select using (is_published);
create policy "testimonials: admin write" on public.testimonials
  for all using (
    public.is_admin_user()
  ) with check (
    public.is_admin_user()
  );

-- ==============================================================
-- Storage bucket for payment screenshots
-- ==============================================================
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

-- ==============================================================
-- Storage bucket for admin site media (products, gallery, training)
-- ==============================================================
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

create policy "site media: public read"
  on storage.objects for select
  using (bucket_id = 'site-media');

create policy "site media: upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'site-media');

-- ==============================================================
-- Admin portal (password-only /admin)
-- ==============================================================

create table if not exists public.admin_portal_config (
  id int primary key default 1 check (id = 1),
  portal_secret text not null default 'lakhe-admin-2026'
);

insert into public.admin_portal_config (id, portal_secret)
values (1, 'lakhe-admin-2026')
on conflict (id) do nothing;

create or replace function public.admin_publish_portal_secret(portal_secret text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if portal_secret is null or length(portal_secret) < 4 then
    raise exception 'invalid secret' using errcode = '42501';
  end if;
  insert into public.admin_portal_config (id, portal_secret)
  values (1, portal_secret)
  on conflict (id) do update set portal_secret = excluded.portal_secret;
end;
$$;

create or replace function public.assert_portal_secret(portal_secret text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  expected text;
begin
  select c.portal_secret into expected from public.admin_portal_config c where c.id = 1;
  if expected is null then
    expected := 'lakhe-admin-2026';
  end if;
  if portal_secret is distinct from expected then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.admin_list_orders(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (
      select jsonb_agg(
        to_jsonb(o) || jsonb_build_object(
          'items',
          coalesce(
            (
              select jsonb_agg(to_jsonb(oi) order by oi.created_at)
              from public.order_items oi
              where oi.order_id = o.id
            ),
            '[]'::jsonb
          )
        )
        order by o.created_at desc
      )
      from public.orders o
    ),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.admin_get_order(portal_secret text, order_ref text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  o public.orders%rowtype;
begin
  perform public.assert_portal_secret(portal_secret);
  select * into o from public.orders where orders.order_ref = admin_get_order.order_ref;
  if not found then
    return null;
  end if;
  return to_jsonb(o) || jsonb_build_object(
    'items',
    coalesce(
      (
        select jsonb_agg(to_jsonb(oi) order by oi.created_at)
        from public.order_items oi
        where oi.order_id = o.id
      ),
      '[]'::jsonb
    )
  );
end;
$$;

drop function if exists public.admin_update_order_status(text, uuid, text, text);

create or replace function public.admin_update_order_status(
  portal_secret text,
  order_ref text,
  new_status text,
  admin_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_order_id uuid;
begin
  perform public.assert_portal_secret(portal_secret);

  select o.id into target_order_id
  from public.orders o
  where o.order_ref = admin_update_order_status.order_ref;

  if target_order_id is null then
    raise exception 'order not found: %', order_ref using errcode = 'P0002';
  end if;

  update public.orders
  set
    status = new_status,
    admin_notes = admin_update_order_status.admin_notes,
    approved_at = case when new_status = 'approved' then now() else approved_at end,
    updated_at = now()
  where id = target_order_id;

  if new_status = 'approved' then
    update public.order_items
    set status = 'processing'
    where order_items.order_id = target_order_id and item_type = 'product';
    update public.order_items
    set status = 'access_granted'
    where order_items.order_id = target_order_id and item_type = 'training';
  elsif new_status = 'rejected' then
    update public.order_items
    set status = 'rejected'
    where order_items.order_id = target_order_id;
  end if;
end;
$$;

create or replace function public.admin_update_order_item_status(
  portal_secret text,
  item_id uuid,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  update public.order_items
  set status = new_status
  where id = item_id;
end;
$$;

create or replace function public.admin_list_bookings(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (select jsonb_agg(to_jsonb(b) order by b.created_at desc) from public.offline_bookings b),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.admin_update_booking_status(
  portal_secret text,
  booking_id uuid,
  new_status text,
  admin_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  update public.offline_bookings
  set status = new_status, admin_notes = admin_update_booking_status.admin_notes
  where id = booking_id;
end;
$$;

create or replace function public.admin_list_queries(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (select jsonb_agg(to_jsonb(q) order by q.created_at desc) from public.queries q),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.admin_update_query_status(
  portal_secret text,
  query_id uuid,
  new_status text,
  admin_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  update public.queries
  set status = new_status, admin_notes = admin_update_query_status.admin_notes
  where id = query_id;
end;
$$;

create or replace function public.admin_list_profiles(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (select jsonb_agg(to_jsonb(p) order by p.created_at desc) from public.profiles p),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.jsonb_text_array(j jsonb)
returns text[]
language sql
immutable
as $$
  select case
    when j is null or j = 'null'::jsonb then '{}'::text[]
    when jsonb_typeof(j) = 'array' then array(select jsonb_array_elements_text(j))
    else '{}'::text[]
  end;
$$;

create or replace function public.admin_list_products(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (select jsonb_agg(to_jsonb(p) order by p.created_at desc) from public.products p),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.admin_upsert_product(
  portal_secret text,
  product jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  pid uuid;
  row public.products%rowtype;
begin
  perform public.assert_portal_secret(portal_secret);

  begin
    pid := nullif(trim(product->>'id'), '')::uuid;
  exception when invalid_text_representation then
    pid := null;
  end;

  if pid is not null and exists (select 1 from public.products p where p.id = pid) then
    update public.products set
      slug = trim(product->>'slug'),
      name = trim(product->>'name'),
      category = product->>'category',
      short_description = coalesce(product->>'short_description', ''),
      description = coalesce(product->>'description', ''),
      price = coalesce((product->>'price')::numeric, 0),
      unit = product->>'unit',
      images = public.jsonb_text_array(product->'images'),
      badges = public.jsonb_text_array(product->'badges'),
      stock = coalesce((product->>'stock')::integer, 0),
      rating = coalesce((product->>'rating')::numeric, 4.8),
      highlights = public.jsonb_text_array(product->'highlights'),
      is_published = coalesce((product->>'is_published')::boolean, true),
      updated_at = now()
    where id = pid
    returning * into row;
  else
    insert into public.products (
      slug, name, category, short_description, description, price, unit,
      images, badges, stock, rating, highlights, is_published
    )
    values (
      trim(product->>'slug'),
      trim(product->>'name'),
      product->>'category',
      coalesce(product->>'short_description', ''),
      coalesce(product->>'description', ''),
      coalesce((product->>'price')::numeric, 0),
      product->>'unit',
      public.jsonb_text_array(product->'images'),
      public.jsonb_text_array(product->'badges'),
      coalesce((product->>'stock')::integer, 0),
      coalesce((product->>'rating')::numeric, 4.8),
      public.jsonb_text_array(product->'highlights'),
      coalesce((product->>'is_published')::boolean, true)
    )
    returning * into row;
  end if;

  return to_jsonb(row);
end;
$$;

create or replace function public.admin_delete_product(portal_secret text, product_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  delete from public.products where id = product_id;
end;
$$;

create or replace function public.admin_list_gallery(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (
      select jsonb_agg(to_jsonb(g) order by g."order", g.created_at)
      from public.gallery_items g
    ),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.admin_upsert_gallery_item(
  portal_secret text,
  item jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  gid uuid;
  row public.gallery_items%rowtype;
begin
  perform public.assert_portal_secret(portal_secret);

  begin
    gid := nullif(trim(item->>'id'), '')::uuid;
  exception when invalid_text_representation then
    gid := null;
  end;

  if gid is not null and exists (select 1 from public.gallery_items g where g.id = gid) then
    update public.gallery_items set
      type = item->>'type',
      category = item->>'category',
      media_url = trim(item->>'media_url'),
      thumbnail_url = nullif(item->>'thumbnail_url', ''),
      caption = nullif(item->>'caption', ''),
      "order" = coalesce((item->>'order')::integer, 0)
    where id = gid
    returning * into row;
  else
    insert into public.gallery_items (
      type, category, media_url, thumbnail_url, caption, "order"
    )
    values (
      item->>'type',
      item->>'category',
      trim(item->>'media_url'),
      nullif(item->>'thumbnail_url', ''),
      nullif(item->>'caption', ''),
      coalesce((item->>'order')::integer, 0)
    )
    returning * into row;
  end if;

  return to_jsonb(row);
end;
$$;

create or replace function public.admin_delete_gallery_item(portal_secret text, item_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  delete from public.gallery_items where id = item_id;
end;
$$;

create or replace function public.admin_list_training(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (
      select jsonb_agg(to_jsonb(t) order by t.created_at desc)
      from public.training_courses t
    ),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.admin_upsert_training(
  portal_secret text,
  course jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  row public.training_courses%rowtype;
begin
  perform public.assert_portal_secret(portal_secret);

  begin
    cid := nullif(trim(course->>'id'), '')::uuid;
  exception when invalid_text_representation then
    cid := null;
  end;

  if cid is not null and exists (select 1 from public.training_courses t where t.id = cid) then
    update public.training_courses set
      slug = trim(course->>'slug'),
      title = trim(course->>'title'),
      format = course->>'format',
      price = coalesce((course->>'price')::numeric, 0),
      duration = coalesce(course->>'duration', ''),
      image = coalesce(course->>'image', ''),
      short_description = coalesce(course->>'short_description', ''),
      description = coalesce(course->>'description', ''),
      features = public.jsonb_text_array(course->'features'),
      outcomes = public.jsonb_text_array(course->'outcomes'),
      is_published = coalesce((course->>'is_published')::boolean, true),
      updated_at = now()
    where id = cid
    returning * into row;
  else
    insert into public.training_courses (
      slug, title, format, price, duration, image,
      short_description, description, features, outcomes, is_published
    )
    values (
      trim(course->>'slug'),
      trim(course->>'title'),
      course->>'format',
      coalesce((course->>'price')::numeric, 0),
      coalesce(course->>'duration', ''),
      coalesce(course->>'image', ''),
      coalesce(course->>'short_description', ''),
      coalesce(course->>'description', ''),
      public.jsonb_text_array(course->'features'),
      public.jsonb_text_array(course->'outcomes'),
      coalesce((course->>'is_published')::boolean, true)
    )
    returning * into row;
  end if;

  return to_jsonb(row);
end;
$$;

grant execute on function public.jsonb_text_array(jsonb) to anon, authenticated;
grant execute on function public.admin_list_products(text) to anon, authenticated;
grant execute on function public.admin_upsert_product(text, jsonb) to anon, authenticated;
grant execute on function public.admin_delete_product(text, uuid) to anon, authenticated;
grant execute on function public.admin_list_gallery(text) to anon, authenticated;
grant execute on function public.admin_upsert_gallery_item(text, jsonb) to anon, authenticated;
grant execute on function public.admin_delete_gallery_item(text, uuid) to anon, authenticated;
grant execute on function public.admin_list_training(text) to anon, authenticated;
grant execute on function public.admin_upsert_training(text, jsonb) to anon, authenticated;
grant execute on function public.admin_publish_portal_secret(text) to anon, authenticated;
grant execute on function public.assert_portal_secret(text) to anon, authenticated;
grant execute on function public.admin_list_orders(text) to anon, authenticated;
grant execute on function public.admin_get_order(text, text) to anon, authenticated;
grant execute on function public.admin_update_order_status(text, text, text, text) to anon, authenticated;
grant execute on function public.admin_update_order_item_status(text, uuid, text) to anon, authenticated;
grant execute on function public.admin_list_bookings(text) to anon, authenticated;
grant execute on function public.admin_update_booking_status(text, uuid, text, text) to anon, authenticated;
grant execute on function public.admin_list_queries(text) to anon, authenticated;
grant execute on function public.admin_update_query_status(text, uuid, text, text) to anon, authenticated;
grant execute on function public.admin_list_profiles(text) to anon, authenticated;

-- ==============================================================
-- Seed data (optional sample content)
-- ==============================================================


insert into public.products (slug, name, category, short_description, description, price, unit, images, badges, stock, rating, highlights)
values
  ('oyster-mushroom-spawn','Oyster Mushroom Spawn','spawn',
   'Vigorous, contamination-free spawn grown from mother cultures on our farm.',
   'Our oyster spawn is produced in sterile conditions using high-quality mother cultures selected for yield and flavour. Each 500g bag is freshly prepared, packed in food-grade material and shipped with care instructions.',
   150,'500g bag',
   array['https://images.unsplash.com/photo-1568900122085-3c05f8bd57e5?auto=format&fit=crop&w=1200&q=70'],
   array['fresh','best-seller'],120,4.8,
   array['Sterile lab-grade spawn','80–90% biological efficiency','Beginner-friendly']),

  ('fresh-oyster-mushroom','Fresh Oyster Mushroom','fresh',
   'Hand-harvested fresh oyster mushrooms delivered within 24 hours.',
   'Grown on pasteurised straw substrate and hand-picked at the peak of freshness.',
   180,'500g pack',
   array['https://images.unsplash.com/photo-1611574474461-46f3f36fbb90?auto=format&fit=crop&w=1200&q=70'],
   array['fresh','natural'],40,4.9,
   array['Harvested-to-door in 24 hrs','No pesticides','Rich in protein']),

  ('dry-oyster-mushroom','Dry Oyster Mushroom','dry',
   'Sun-dried oyster mushrooms with intense umami — long shelf life.',
   'Slowly dried to preserve aroma and nutrition.',
   400,'100g pouch',
   array['https://images.unsplash.com/photo-1611746872915-64559a1a7488?auto=format&fit=crop&w=1200&q=70'],
   array['natural','premium'],80,4.7,
   array['12 month shelf life','No preservatives','Concentrated flavour']),

  ('mushroom-powder','Mushroom Powder','powder',
   'Nutrient-dense oyster mushroom powder for daily wellness.',
   'Cold-milled from our dried mushrooms.',
   300,'150g jar',
   array['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=70'],
   array['premium','natural'],60,4.8,
   array['Single-ingredient','Vegan & gluten-free','Immunity support']),

  ('ready-to-eat-oyster','Ready-to-Eat Oyster Mushroom','ready-to-eat',
   'Chef-crafted, mildly spiced oyster mushroom pack. Just heat & serve.',
   'Cooked in small batches with cold-pressed oils and mild Indian spices.',
   280,'250g pack',
   array['https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=1200&q=70'],
   array['ready-to-eat','best-seller'],30,4.9,
   array['No preservatives','High protein','Ready in 3 minutes'])
on conflict (slug) do nothing;

-- Hide legacy demo programmes on the public site; ensure only online & offline are live
update public.training_courses
set is_published = false
where slug not in ('online-training', 'offline-training');

insert into public.training_courses (slug, title, format, price, duration, image, short_description, description, features, outcomes, is_published)
values
  ('online-training','Online Mushroom Training','online',3000,'Self-paced · video modules',
   '',
   'Full mushroom farming programme with recorded videos — learn spawn to sale from Lakhe farm.',
   'Complete online mushroom cultivation programme. After payment verification, Tatya Lakhe shares recorded video lessons covering information planning, raw materials, cultivation, crop management, packing and marketing.',
   array['Importance of information & farm planning','Raw material samples & substrate preparation','Practical cultivation training','Crop management & fruiting room care','Packing & post-harvest handling','Marketing & sales guidance','Recorded video modules provided'],
   array['Plan and set up a small mushroom unit','Prepare substrates and manage spawn','Harvest, pack and market your produce'],
   true),

  ('offline-training','Offline Mushroom Training','offline',10000,'2 days · at Lakhe farm',
   '',
   'Two-day hands-on training at our farm — see, practice and learn every step on site.',
   'Intensive two-day programme at Lakhe Mushroom Farm. Hands-on practice through spawn handling, substrate prep, crop management, harvesting, packing and marketing with Tatya Lakhe.',
   array['Importance of information & farm planning','Raw material samples & substrate preparation','Hands-on cultivation training','Crop management & fruiting room care','Packing & post-harvest handling','Marketing & sales guidance','Farm meals & printed workbook'],
   array['Experience every step on a working farm','Build confidence for your own unit','Network with fellow growers'],
   true)
on conflict (slug) do update set
  title = excluded.title,
  format = excluded.format,
  price = excluded.price,
  duration = excluded.duration,
  image = excluded.image,
  short_description = excluded.short_description,
  description = excluded.description,
  features = excluded.features,
  outcomes = excluded.outcomes,
  is_published = true;

-- Gallery categories: farm, cultivation, journey, others
alter table public.gallery_items drop constraint if exists gallery_items_category_check;
update public.gallery_items set category = 'journey' where category in ('training', 'team');
update public.gallery_items set category = 'others' where category = 'clients';
alter table public.gallery_items add constraint gallery_items_category_check
  check (category in ('farm','cultivation','journey','others'));

-- Remove legacy training programmes from admin & public
update public.order_items
set course_id = null
where course_id in (
  select id from public.training_courses
  where slug in (
    'weekend-farm-immersion',
    'advanced-cultivation-bootcamp',
    'a-z-mushroom-farming-online'
  )
);
update public.offline_bookings
set course_id = null
where course_id in (
  select id from public.training_courses
  where slug in (
    'weekend-farm-immersion',
    'advanced-cultivation-bootcamp',
    'a-z-mushroom-farming-online'
  )
);
delete from public.training_modules
where course_id in (
  select id from public.training_courses
  where slug in (
    'weekend-farm-immersion',
    'advanced-cultivation-bootcamp',
    'a-z-mushroom-farming-online'
  )
);
delete from public.training_courses
where slug in (
  'weekend-farm-immersion',
  'advanced-cultivation-bootcamp',
  'a-z-mushroom-farming-online'
);

-- Modules for online course
with c as (select id from public.training_courses where slug = 'online-training')
insert into public.training_modules (course_id, title, description, duration_minutes, "order")
select c.id, m.title, m.description, m.duration, m.ord from c,
(values
  ('Information & Planning','Why proper information and planning matter before you start.',30,1),
  ('Raw Material Samples','Substrate types, spawn quality and material selection.',45,2),
  ('Cultivation Training','Inoculation, incubation and fruiting room setup.',55,3),
  ('Crop Management','Daily care, humidity, pest control and harvesting cycles.',50,4),
  ('Packing','Post-harvest handling, grading and packaging.',40,5),
  ('Marketing','Pricing, retail, wholesale and customer outreach.',45,6)
) as m(title, description, duration, ord)
on conflict do nothing;

insert into public.testimonials (name, location, role, rating, quote) values
  ('Priya Sharma','Pune','Home cultivator',5,'The A–Z online training was incredibly thorough. I set up my first cultivation shelf in three weekends and had my first harvest a month later.'),
  ('Ravi Menon','Kochi','Small farmer',5,'The team walked us through everything — from substrate to selling. My mushroom unit is now paying for itself every month.'),
  ('Anaïs Petit','Lyon, France','International client',5,'A rare combination of premium products and genuine expertise. The powder is now part of my daily wellness routine.'),
  ('Mahesh Yadav','Nashik','Weekend workshop attendee',5,'The offline workshop felt personal and honest. No shortcuts, no upsells — just real practice.')
on conflict do nothing;

insert into public.gallery_items (type, category, media_url, caption, "order") values
  ('image','farm','https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1600&q=70','Our main growing shed',1),
  ('image','cultivation','https://images.unsplash.com/photo-1568900122085-3c05f8bd57e5?auto=format&fit=crop&w=1600&q=70','Oyster mushrooms at peak fruiting',2),
  ('image','cultivation','https://images.unsplash.com/photo-1611574474461-46f3f36fbb90?auto=format&fit=crop&w=1600&q=70','Freshly harvested clusters',3),
  ('image','journey','https://images.unsplash.com/photo-1524178232363-1ba1f8b83d0b?auto=format&fit=crop&w=1600&q=70','Training on the farm',4),
  ('image','farm','https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=70','Our farm team',5),
  ('image','others','https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=70','International cohort visit',6)
on conflict do nothing;

-- Admin uses /admin with portal password (no is_admin profile update needed).