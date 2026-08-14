-- =============================================================================
-- Lakhe Mushroom Farm — Admin portal setup (run ONCE after schema.sql)
-- =============================================================================
-- schema.sql creates tables + RLS. This file adds:
--   • delivery_address on orders
--   • Password-only /admin portal functions (approve/reject orders, etc.)
--
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- Default admin password: lakhe-admin-2026 (must match VITE_ADMIN_PASSWORD)
-- =============================================================================

-- Delivery address for checkout
alter table public.orders
  add column if not exists delivery_address text;

-- Portal password store (synced when you sign in at /admin)
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
