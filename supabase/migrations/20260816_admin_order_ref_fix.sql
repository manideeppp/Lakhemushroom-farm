-- Fix admin order approve: update by order_ref (LMF-00100) instead of uuid.
-- Run in Supabase SQL Editor if approve does not change order status.

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

grant execute on function public.admin_update_order_status(text, text, text, text) to anon, authenticated;
