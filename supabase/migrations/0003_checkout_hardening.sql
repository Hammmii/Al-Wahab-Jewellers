-- ============================================================================
-- Migration 0003 — Checkout hardening
-- - Server-authoritative order creation via create_order()
-- - Payment proof storage for bank transfers
-- ============================================================================

-- Add payment proof path to orders (bank transfer receipts)
alter table public.orders
  add column if not exists payment_proof_path text;

-- ============================================================================
-- create_order(): atomically lock variants, check stock, decrement stock,
-- insert order + order_items with DB-authoritative prices and product names.
-- Returns the new order id.
-- Raises:
--   variant_not_found  — an item references a variant that does not exist
--   insufficient_stock — stock is lower than requested quantity
-- ============================================================================
create or replace function public.create_order(
  p_payment_method    payment_method,
  p_customer_name     text,
  p_phone             text,
  p_address           jsonb,
  p_items             jsonb,
  p_customer_id       uuid    default null,
  p_email             text    default null,
  p_notes             text    default null,
  p_payment_proof_path text   default null,
  p_payment_status    payment_status default 'unpaid'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id      uuid;
  v_subtotal      numeric(12,2) := 0;
  v_total         numeric(12,2) := 0;
  v_variant_ids   uuid[];
  item            jsonb;
  v_variant       record;
  v_product_name  text;
  v_line_total    numeric(12,2);
begin
  -- Extract variant ids so we can lock them in one statement.
  select array_agg((x->>'variant_id')::uuid)
  into v_variant_ids
  from jsonb_array_elements(p_items) as x;

  -- Lock all referenced variants for the duration of the transaction.
  create temp table temp_locked_variants on commit drop as
    select id, product_id, price, stock
    from public.product_variants
    where id = any(v_variant_ids)
    for update;

  -- First pass: validate existence + stock and compute the total.
  for item in select * from jsonb_array_elements(p_items) loop
    select * into v_variant
    from temp_locked_variants
    where id = (item->>'variant_id')::uuid;

    if v_variant is null then
      raise exception 'variant_not_found' using errcode = 'P0001';
    end if;

    if v_variant.stock < (item->>'quantity')::int then
      select p.name into v_product_name
      from public.products p
      where p.id = v_variant.product_id;

      raise exception 'insufficient_stock|%', v_product_name using errcode = 'P0001';
    end if;

    v_line_total := v_variant.price * (item->>'quantity')::int;
    v_subtotal   := v_subtotal + v_line_total;
  end loop;

  v_total := v_subtotal;

  -- Insert the order with the DB-computed total.
  insert into public.orders (
    customer_id,
    status,
    payment_method,
    payment_status,
    customer_name,
    phone,
    email,
    address,
    subtotal,
    total,
    notes,
    payment_proof_path
  ) values (
    p_customer_id,
    'pending',
    p_payment_method,
    p_payment_status,
    p_customer_name,
    p_phone,
    p_email,
    p_address,
    v_subtotal,
    v_total,
    p_notes,
    p_payment_proof_path
  ) returning id into v_order_id;

  -- Insert order items using authoritative prices and product names.
  for item in select * from jsonb_array_elements(p_items) loop
    select * into v_variant
    from temp_locked_variants
    where id = (item->>'variant_id')::uuid;

    select p.name into v_product_name
    from public.products p
    where p.id = v_variant.product_id;

    v_line_total := v_variant.price * (item->>'quantity')::int;

    insert into public.order_items (
      order_id,
      product_id,
      variant_id,
      name_snapshot,
      price_snapshot,
      quantity,
      line_total
    ) values (
      v_order_id,
      v_variant.product_id,
      v_variant.id,
      v_product_name,
      v_variant.price,
      (item->>'quantity')::int,
      v_line_total
    );
  end loop;

  -- Decrement stock now that the order is safely written.
  for item in select * from jsonb_array_elements(p_items) loop
    update public.product_variants
    set stock = stock - (item->>'quantity')::int
    where id = (item->>'variant_id')::uuid;
  end loop;

  return v_order_id;
end;
$$;

-- ============================================================================
-- Storage: private payment-proofs bucket for bank transfer receipts
-- ============================================================================
insert into storage.buckets (id, name, public)
  values ('payment-proofs', 'payment-proofs', false)
  on conflict (id) do nothing;

-- Admins can do everything in the bucket.
create policy "payment-proofs: admin read"
  on storage.objects for select to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin());

create policy "payment-proofs: admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'payment-proofs' and public.is_admin());

create policy "payment-proofs: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin())
  with check (bucket_id = 'payment-proofs' and public.is_admin());

create policy "payment-proofs: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin());

-- The uploader (authenticated customer) can read their own proof.
create policy "payment-proofs: owner read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'payment-proofs'
    and public.is_admin() = false
    and auth.uid()::text = split_part(name, '/', 1)
  );
