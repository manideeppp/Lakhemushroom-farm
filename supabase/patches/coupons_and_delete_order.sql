-- Coupons + admin delete order. Run once in Supabase SQL Editor.

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  min_subtotal numeric(10,2) not null default 0,
  max_uses integer,
  used_count integer not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists discount numeric(10,2) not null default 0;

alter table public.coupons enable row level security;
drop policy if exists "coupons: admin all" on public.coupons;
create policy "coupons: admin all" on public.coupons
  for all using (public.is_admin_user())
  with check (public.is_admin_user());

create or replace function public.validate_coupon(p_code text, p_subtotal numeric)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.coupons%rowtype;
  disc numeric;
begin
  if p_code is null or length(trim(p_code)) < 2 then
    return jsonb_build_object('valid', false, 'message', 'Enter a coupon code.');
  end if;

  select * into c
  from public.coupons
  where upper(code) = upper(trim(p_code));

  if not found then
    return jsonb_build_object('valid', false, 'message', 'Coupon not found.');
  end if;

  if not c.is_active then
    return jsonb_build_object('valid', false, 'message', 'This coupon is no longer active.');
  end if;

  if c.expires_at is not null and c.expires_at < now() then
    return jsonb_build_object('valid', false, 'message', 'This coupon has expired.');
  end if;

  if c.max_uses is not null and c.used_count >= c.max_uses then
    return jsonb_build_object('valid', false, 'message', 'This coupon has been fully used.');
  end if;

  if p_subtotal < c.min_subtotal then
    return jsonb_build_object(
      'valid', false,
      'message', 'Minimum order ' || c.min_subtotal || ' required for this coupon.'
    );
  end if;

  if c.discount_type = 'percent' then
    disc := round(p_subtotal * (c.discount_value / 100), 2);
  else
    disc := c.discount_value;
  end if;

  disc := least(disc, p_subtotal);

  return jsonb_build_object(
    'valid', true,
    'code', c.code,
    'discount_type', c.discount_type,
    'discount_value', c.discount_value,
    'discount', disc
  );
end;
$$;

create or replace function public.increment_coupon_use(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.coupons
  set used_count = used_count + 1
  where upper(code) = upper(trim(p_code));
end;
$$;

create or replace function public.admin_list_coupons(portal_secret text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  return coalesce(
    (select jsonb_agg(to_jsonb(c) order by c.created_at desc) from public.coupons c),
    '[]'::jsonb
  );
end;
$$;

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

  cid := (coupon->>'id')::uuid;

  if cid is null then
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
  else
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
  end if;

  return to_jsonb(row);
end;
$$;

create or replace function public.admin_delete_coupon(portal_secret text, coupon_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  delete from public.coupons where id = coupon_id;
end;
$$;

create or replace function public.admin_delete_order(portal_secret text, order_ref text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.assert_portal_secret(portal_secret);
  delete from public.orders where orders.order_ref = admin_delete_order.order_ref;
end;
$$;

grant execute on function public.validate_coupon(text, numeric) to anon, authenticated;
grant execute on function public.increment_coupon_use(text) to authenticated;
grant execute on function public.admin_list_coupons(text) to anon, authenticated;
grant execute on function public.admin_upsert_coupon(text, jsonb) to anon, authenticated;
grant execute on function public.admin_delete_coupon(text, uuid) to anon, authenticated;
grant execute on function public.admin_delete_order(text, text) to anon, authenticated;
