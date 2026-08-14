-- Add delivery address to orders (run in Supabase SQL editor if table already exists)
alter table public.orders
  add column if not exists delivery_address text;
