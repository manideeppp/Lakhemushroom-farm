-- Quick fix: seed sample coupon + fix admin coupon save.
-- Run in Supabase SQL Editor if coupons fail to apply or save.

create or replace function public.admin_upsert_coupon(
  portal_secret text,
  coupon jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  row public.coupons%rowtype;
begin
  perform public.assert_portal_secret(portal_secret);

  cid := nullif(trim(coupon->>'id'), '')::uuid;

  if cid is not null and exists (select 1 from public.coupons c where c.id = cid) then
    update public.coupons set
      code = upper(trim(coupon->>'code')),
      description = coupon->>'description',
      discount_type = coupon->>'discount_type',
      discount_value = (coupon->>'discount_value')::numeric,
      min_subtotal = coalesce((coupon->>'min_subtotal')::numeric, 0),
      max_uses = nullif(coupon->>'max_uses', '')::integer,
      is_active = coalesce((coupon->>'is_active')::boolean, true),
      expires_at = nullif(coupon->>'expires_at', '')::timestamptz
    where id = cid
    returning * into row;
  else
    insert into public.coupons (
      code, description, discount_type, discount_value, min_subtotal,
      max_uses, is_active, expires_at
    )
    values (
      upper(trim(coupon->>'code')),
      coupon->>'description',
      coupon->>'discount_type',
      (coupon->>'discount_value')::numeric,
      coalesce((coupon->>'min_subtotal')::numeric, 0),
      nullif(coupon->>'max_uses', '')::integer,
      coalesce((coupon->>'is_active')::boolean, true),
      nullif(coupon->>'expires_at', '')::timestamptz
    )
    returning * into row;
  end if;

  return to_jsonb(row);
end;
$$;

insert into public.coupons (
  code, description, discount_type, discount_value, min_subtotal, is_active
)
values (
  'WELCOME10',
  '10% off your order',
  'percent',
  10,
  100,
  true
)
on conflict (code) do nothing;
