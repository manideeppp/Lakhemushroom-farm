-- Admin portal RPCs for products, gallery, and training.
-- Run once in Supabase SQL Editor (password-only /admin cannot pass RLS writes).

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

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------

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

-- ---------------------------------------------------------------------------
-- Training courses
-- ---------------------------------------------------------------------------

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
