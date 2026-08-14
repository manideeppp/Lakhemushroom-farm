-- ============================================================================
-- Lakhe Mushroom Farm — Supabase Schema
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL editor once per project.
-- Creates: profiles, products, training_courses, training_modules,
--          training_progress, orders, order_items, offline_bookings,
--          queries, gallery_items, testimonials + storage bucket.
-- Includes: triggers, functions, RLS policies.
-- ============================================================================

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
