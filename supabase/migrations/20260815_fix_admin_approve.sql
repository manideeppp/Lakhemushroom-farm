-- Fix admin approve flow: sync portal password + fix SQL parameter shadowing.
-- Run in Supabase SQL Editor after 20260814_admin_portal_rpc.sql (or standalone).

create table if not exists public.admin_portal_config (
  id int primary key default 1 check (id = 1),
  portal_secret text not null default 'lakhe-admin-2026'
);

insert into public.admin_portal_config (id, portal_secret)
values (1, 'lakhe-admin-2026')
on conflict (id) do nothing;

-- Sync password from /admin login (matches VITE_ADMIN_PASSWORD on Vercel).
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

create or replace function public.admin_update_order_status(
  portal_secret text,
  order_id uuid,
  new_status text,
  admin_notes text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_order_id uuid := order_id;
begin
  perform public.assert_portal_secret(portal_secret);
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

grant execute on function public.admin_publish_portal_secret(text) to anon, authenticated;
