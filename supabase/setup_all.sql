-- =============================================================================
-- Lakhe Mushroom Farm — COMPLETE Supabase setup (run this ONE file)
-- =============================================================================
-- Paste into Supabase → SQL Editor → Run.
-- Includes: schema, RLS, storage, admin portal RPCs, sample seed data.
-- Safe to re-run on an existing project (IF NOT EXISTS / CREATE OR REPLACE).
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
  category text not null check (category in ('farm','cultivation','training','team','clients')),
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

alter table public.orders add column if not exists delivery_address text;

-- ==============================================================
-- Row Level Security
-- ==============================================================

-- profiles
alter table public.profiles enable row level security;
create policy "profiles: self read" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles: admin read" on public.profiles
  for select using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.is_admin)
  );
create policy "profiles: admin update" on public.profiles
  for update using (
    exists (select 1 from public.profiles p
            where p.id = auth.uid() and p.is_admin)
  );

-- products (public read, admin write)
alter table public.products enable row level security;
create policy "products: public read" on public.products
  for select using (is_published or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));
create policy "products: admin write" on public.products
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- training_courses
alter table public.training_courses enable row level security;
create policy "training_courses: public read" on public.training_courses
  for select using (is_published or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_admin
  ));
create policy "training_courses: admin write" on public.training_courses
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
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
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );
create policy "training_modules: admin write" on public.training_modules
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- training_progress
alter table public.training_progress enable row level security;
create policy "training_progress: self all" on public.training_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "training_progress: admin read" on public.training_progress
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
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
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
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
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- offline_bookings
alter table public.offline_bookings enable row level security;
create policy "bookings: self read" on public.offline_bookings
  for select using (auth.uid() = user_id);
create policy "bookings: public insert" on public.offline_bookings
  for insert with check (true);
create policy "bookings: admin all" on public.offline_bookings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- queries
alter table public.queries enable row level security;
create policy "queries: self read" on public.queries
  for select using (auth.uid() = user_id);
create policy "queries: public insert" on public.queries
  for insert with check (true);
create policy "queries: admin all" on public.queries
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- gallery + testimonials (public read, admin write)
alter table public.gallery_items enable row level security;
create policy "gallery: public read" on public.gallery_items
  for select using (true);
create policy "gallery: admin write" on public.gallery_items
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

alter table public.testimonials enable row level security;
create policy "testimonials: public read" on public.testimonials
  for select using (is_published);
create policy "testimonials: admin write" on public.testimonials
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ==============================================================
-- Storage bucket for payment screenshots
-- ==============================================================
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;

create policy "screenshots: self upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'payment-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "screenshots: self read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'payment-screenshots'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
    )
  );

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

insert into public.training_courses (slug, title, format, price, duration, image, short_description, description, features, outcomes)
values
  ('a-z-mushroom-farming-online','A–Z Mushroom Farming Online Training','online',1500,'12 hours · Self-paced',
   'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1600&q=70',
   'Everything you need to start growing mushrooms — from spawn to sale.',
   'A complete online program covering biology, substrate prep, spawn making, cultivation, harvesting, packaging, marketing and business planning.',
   array['10+ recorded video modules','Downloadable PDFs & checklists','Lifetime access','Certificate of completion'],
   array['Set up a small mushroom unit at home','Prepare your own spawn','Sell fresh, dry & value-added products']),

  ('weekend-farm-immersion','Weekend Farm Immersion','offline',3000,'2 days',
   'https://images.unsplash.com/photo-1615398265937-71bc7a9c8dfe?auto=format&fit=crop&w=1600&q=70',
   'A hands-on two-day session at our farm — see, touch and try every step.',
   'Small batch of 10. Includes farm meals, printed workbook and starter spawn kit.',
   array['Hands-on farm sessions','Meals included','Starter spawn kit','Small batch of 10'],
   array['Practice substrate & spawn prep','See real fruiting rooms','Take home a working setup']),

  ('advanced-cultivation-bootcamp','Advanced Cultivation Bootcamp','hybrid',4500,'4 weeks',
   'https://images.unsplash.com/photo-1601300961833-e6f635e6f4f6?auto=format&fit=crop&w=1600&q=70',
   'Deep-dive program combining online modules with an on-farm assessment.',
   'Includes weekly live Q&A, business toolkit, and a one-day on-farm evaluation.',
   array['Live weekly Q&A','On-farm assessment day','Business toolkit','Priority support'],
   array['Plan a commercial unit','Optimise yield and margins','Access to founder mentoring'])
on conflict (slug) do nothing;

-- Modules for online course
with c as (select id from public.training_courses where slug = 'a-z-mushroom-farming-online')
insert into public.training_modules (course_id, title, description, duration_minutes, "order")
select c.id, m.title, m.description, m.duration, m.ord from c,
(values
  ('Welcome & Introduction','Overview of the course, mushroom varieties, and the business potential.',25,1),
  ('Biology of Oyster Mushrooms','Life cycle, growth conditions, and common terms.',40,2),
  ('Substrate Preparation','Straw, sawdust and paper substrates. Pasteurisation methods.',55,3),
  ('Spawn Production','Sterile technique, grain spawn, and quality checks.',60,4),
  ('Inoculation & Incubation','Bag prep, spawning ratios, and incubation environment.',50,5),
  ('Fruiting & Harvesting','Fruiting room setup, humidity, harvesting cycles.',45,6),
  ('Post-harvest & Value Addition','Packaging, drying, powders and ready-to-eat products.',50,7),
  ('Marketing & Business Setup','Positioning, retail, wholesale, licenses and subsidies.',60,8)
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
  ('image','training','https://images.unsplash.com/photo-1524178232363-1ba1f8b83d0b?auto=format&fit=crop&w=1600&q=70','Weekend immersion in session',4),
  ('image','team','https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=70','Our farm team',5),
  ('image','clients','https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=70','International cohort visit',6)
on conflict do nothing;

-- Admin uses /admin with portal password (no is_admin profile update needed).