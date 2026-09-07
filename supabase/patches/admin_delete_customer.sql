-- Admin delete customer (no orders). Run in Supabase SQL Editor after setup_all.sql.

create or replace function public.admin_delete_customer(portal_secret text, customer_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.assert_portal_secret(portal_secret);

  if not exists (select 1 from public.profiles p where p.id = customer_id) then
    raise exception 'Customer not found.';
  end if;

  if exists (select 1 from public.orders o where o.user_id = customer_id) then
    raise exception 'Customer has orders. Delete their orders first.';
  end if;

  delete from auth.users where id = customer_id;
end;
$$;

grant execute on function public.admin_delete_customer(text, uuid) to anon, authenticated;
