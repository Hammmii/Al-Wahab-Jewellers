-- ============================================================================
-- Al-Wahab Jewellers — FULL RESET + SCHEMA + SEED
-- Run this in the Supabase SQL Editor. It drops any partial state from a
-- failed first run and recreates everything cleanly, then seeds real products.
-- Safe to run more than once (it resets first).
-- ============================================================================

-- ── 1. DROP everything (clean slate) ───────────────────────────────────────
drop view if exists public.current_gold_rates cascade;
drop table if exists public.reviews cascade;
drop table if exists public.contact_submissions cascade;
drop table if exists public.custom_design_requests cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.gold_rates cascade;
drop table if exists public.product_images cascade;
drop table if exists public.product_variants cascade;
drop table if exists public.products cascade;
drop table if exists public.collections cascade;
drop table if exists public.categories cascade;
drop table if exists public.profiles cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_verified_buyer(p_product_id uuid) cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.set_updated_at() cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop type if exists public.metal_purity cascade;
drop type if exists public.karat_type cascade;
drop type if exists public.order_status cascade;
drop type if exists public.payment_method cascade;
drop type if exists public.payment_status cascade;
drop type if exists public.gold_rate_source cascade;
drop type if exists public.custom_design_status cascade;
drop type if exists public.contact_status cascade;
-- Storage buckets can't be dropped via SQL (Supabase blocks direct deletes);
-- they're created below with ON CONFLICT. Policies CAN be dropped, so we do
-- that here to keep the storage section re-runnable.
drop policy if exists "product-images: public read" on storage.objects;
drop policy if exists "product-images: admin insert" on storage.objects;
drop policy if exists "product-images: admin update" on storage.objects;
drop policy if exists "product-images: admin delete" on storage.objects;
drop policy if exists "custom-designs: owner read" on storage.objects;
drop policy if exists "custom-designs: owner insert" on storage.objects;

-- ── 2. EXTENSIONS ──────────────────────────────────────────────────────────
create extension if not exists pg_trgm;

-- ── 3. ENUMS ───────────────────────────────────────────────────────────────
create type public.metal_purity         as enum ('24k', '22k', '21k', '18k', 'silver');
create type public.karat_type           as enum ('24k', '22k', '21k', '18k');
create type public.order_status         as enum ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled');
create type public.payment_method       as enum ('cod', 'bank_transfer');
create type public.payment_status       as enum ('unpaid', 'paid', 'refunded');
create type public.gold_rate_source     as enum ('auto', 'manual');
create type public.custom_design_status as enum ('new', 'in_review', 'quoted', 'closed');
create type public.contact_status       as enum ('new', 'read', 'replied');

-- ── 4. HELPER (only the trigger fn; the security fns come AFTER tables) ────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- ── 4b. SECURITY FUNCTION STUBS ────────────────────────────────────────────
-- Policies below reference these functions. PostgreSQL needs them to exist
-- at policy-creation time, so we create safe stubs here and replace them with
-- real implementations after all tables exist (section 5b).
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select false;
$$;

create or replace function public.is_verified_buyer(p_product_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select false;
$$;

-- ── 5. TABLES ──────────────────────────────────────────────────────────────

-- profiles (1:1 with auth.users)
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- profiles policies use is_admin(), defined below after all tables exist.
-- We attach them after the function is created (see section 5b).

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text not null unique,
  description text, position int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories: public read" on public.categories for select using (true);
create policy "categories: admin write" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- collections
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text not null unique,
  description text, created_at timestamptz not null default now()
);
alter table public.collections enable row level security;
create policy "collections: public read" on public.collections for select using (true);
create policy "collections: admin write" on public.collections for all
  using (public.is_admin()) with check (public.is_admin());

-- products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  description text, metal_type text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products: public read active" on public.products for select
  using (is_active or public.is_admin());
create policy "products: admin write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());
alter table public.products add column search_vector tsvector
  generated always as (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))) stored;
create index products_search_idx    on public.products using gin (search_vector);
create index products_name_trgm_idx on public.products using gin (name gin_trgm_ops);
create index products_slug_idx      on public.products (slug);
create index products_category_idx  on public.products (category_id);
create index products_featured_idx  on public.products (is_featured) where is_featured;
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- product_variants
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  metal_purity public.metal_purity not null,
  weight_grams numeric(10,3), size text,
  price numeric(12,2) not null check (price >= 0),
  sku text, stock int not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);
alter table public.product_variants enable row level security;
create policy "variants: public read" on public.product_variants for select
  using (exists (select 1 from public.products p where p.id = product_id and (p.is_active or public.is_admin())));
create policy "variants: admin write" on public.product_variants for all
  using (public.is_admin()) with check (public.is_admin());
create index variants_product_idx on public.product_variants (product_id);

-- product_images
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null, alt_text text,
  position int not null default 0, is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.product_images enable row level security;
create policy "images: public read" on public.product_images for select
  using (exists (select 1 from public.products p where p.id = product_id and (p.is_active or public.is_admin())));
create policy "images: admin write" on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());
create index images_product_idx on public.product_images (product_id);

-- gold_rates
create table public.gold_rates (
  id uuid primary key default gen_random_uuid(),
  karat public.karat_type not null,
  rate_per_tola numeric(12,2) not null check (rate_per_tola >= 0),
  rate_per_10g numeric(12,2) not null check (rate_per_10g >= 0),
  rate_per_gram numeric(12,2) not null check (rate_per_gram >= 0),
  source public.gold_rate_source not null default 'manual',
  currency text not null default 'PKR',
  effective_at timestamptz not null default now(),
  set_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.gold_rates enable row level security;
create policy "gold_rates: public read" on public.gold_rates for select using (true);
create policy "gold_rates: admin write" on public.gold_rates for all
  using (public.is_admin()) with check (public.is_admin());
create index gold_rates_karat_time_idx on public.gold_rates (karat, effective_at desc);

create or replace view public.current_gold_rates as
select distinct on (karat)
  karat, rate_per_tola, rate_per_10g, rate_per_gram, source, currency, effective_at
from public.gold_rates
order by karat, effective_at desc, (case when source = 'manual' then 1 else 0 end) desc;

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  status public.order_status not null default 'pending',
  payment_method public.payment_method not null,
  payment_status public.payment_status not null default 'unpaid',
  customer_name text not null, phone text not null, email text,
  address jsonb not null,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  total numeric(12,2) not null check (total >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "orders: read own or admin" on public.orders for select
  using (customer_id = auth.uid() or public.is_admin());
create policy "orders: customer create own" on public.orders for insert
  with check (customer_id is null or customer_id = auth.uid());
create policy "orders: admin update" on public.orders for update using (public.is_admin());
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create index orders_customer_idx on public.orders (customer_id);
create index orders_status_idx   on public.orders (status);

-- Checkout hardening: payment proof for bank transfers
alter table public.orders add column if not exists payment_proof_path text;

-- order_items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid references public.product_variants(id) on delete set null,
  name_snapshot text not null,
  price_snapshot numeric(12,2) not null check (price_snapshot >= 0),
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0)
);
alter table public.order_items enable row level security;
create policy "order_items: read own or admin" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())));
create policy "order_items: customer create own" on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id is null or o.customer_id = auth.uid())));
create index order_items_order_idx   on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id, order_id);

-- custom_design_requests
create table public.custom_design_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  name text not null, email text not null, phone text not null,
  jewelry_type text not null, gold_type text not null,
  weight_grams numeric(10,3), budget numeric(12,2),
  description text, inspiration_image_path text,
  status public.custom_design_status not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.custom_design_requests enable row level security;
create policy "custom: read own or admin" on public.custom_design_requests for select
  using (customer_id = auth.uid() or public.is_admin());
create policy "custom: anyone create" on public.custom_design_requests for insert
  with check (customer_id is null or customer_id = auth.uid());
create policy "custom: admin update" on public.custom_design_requests for update
  using (public.is_admin());

-- contact_submissions
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text,
  message text not null, status public.contact_status not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.contact_submissions enable row level security;
create policy "contact: anyone create" on public.contact_submissions for insert with check (true);
create policy "contact: admin read"    on public.contact_submissions for select using (public.is_admin());
create policy "contact: admin update"  on public.contact_submissions for update using (public.is_admin());

-- reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text, body text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "reviews: public read approved (+ own)" on public.reviews for select
  using (is_approved or customer_id = auth.uid() or public.is_admin());
create policy "reviews: verified buyer create" on public.reviews for insert
  with check (customer_id = auth.uid() and public.is_verified_buyer(product_id));
create policy "reviews: admin update" on public.reviews for update using (public.is_admin());
create index reviews_product_idx  on public.reviews (product_id);
create index reviews_customer_idx on public.reviews (customer_id);

-- ── 5b. SECURITY FUNCTIONS + DEPENDENT POLICIES ────────────────────────────
-- Replace the stubs from section 4b with real implementations now that all
-- referenced tables exist.
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_verified_buyer(p_product_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where oi.product_id = p_product_id
      and o.customer_id = auth.uid()
      and o.status <> 'cancelled'
  );
$$;

-- Now attach the profiles policies (they depend on is_admin()).
create policy "profiles: read own or admin"
  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id);

-- ── 6. STORAGE BUCKETS + POLICIES ──────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),
  ('custom-designs', 'custom-designs', false)
on conflict (id) do nothing;

create policy "product-images: public read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product-images: admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin update" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and public.is_admin());
create policy "custom-designs: owner read" on storage.objects
  for select to authenticated using (bucket_id = 'custom-designs' and (public.is_admin() or auth.uid()::text = split_part(name, '/', 1)));
create policy "custom-designs: owner insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'custom-designs' and auth.uid()::text = split_part(name, '/', 1));

-- Payment proof bucket for bank-transfer receipts (private)
insert into storage.buckets (id, name, public) values
  ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

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
create policy "payment-proofs: owner read"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'payment-proofs'
    and public.is_admin() = false
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- ============================================================================
-- 7. CHECKOUT HARDENING — atomic order creation
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
  select array_agg((x->>'variant_id')::uuid)
  into v_variant_ids
  from jsonb_array_elements(p_items) as x;

  create temp table temp_locked_variants on commit drop as
    select id, product_id, price, stock
    from public.product_variants
    where id = any(v_variant_ids)
    for update;

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

  for item in select * from jsonb_array_elements(p_items) loop
    update public.product_variants
    set stock = stock - (item->>'quantity')::int
    where id = (item->>'variant_id')::uuid;
  end loop;

  return v_order_id;
end;
$$;

-- ============================================================================
-- 8. SEED — real products using the local /public images
-- ============================================================================
insert into public.categories (name, slug, position) values
  ('Rings', 'rings', 0),
  ('Necklaces', 'necklaces', 1),
  ('Bracelets', 'bracelets', 2),
  ('Earrings', 'earrings', 3)
on conflict (slug) do nothing;

-- Eternal Flame Ring (Ring1.jpg)
insert into public.products (name, slug, category_id, description, metal_type, is_featured, is_active)
select 'Eternal Flame Ring', 'eternal-flame-ring', c.id,
  'A solitaire statement ring, hand-finished in pure gold with a sculpted flame band. Designed to be worn every day and passed on for generations.',
  'Yellow Gold', true, true
from public.categories c where c.slug = 'rings'
on conflict (slug) do nothing;

insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '22k', 9.5, 350000, 5 from public.products p where p.slug = 'eternal-flame-ring';
insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '24k', 11.0, 450000, 3 from public.products p where p.slug = 'eternal-flame-ring';

insert into public.product_images (product_id, storage_path, alt_text, position, is_primary)
select p.id, '/Ring1.jpg', 'Eternal Flame Ring in gold', 0, true
from public.products p where p.slug = 'eternal-flame-ring';

-- Sultanate Signet Ring (Ring2.jpg)
insert into public.products (name, slug, category_id, description, metal_type, is_featured, is_active)
select 'Sultanate Signet Ring', 'sultanate-signet-ring', c.id,
  'A bold heritage signet ring with a faceted face, crafted by hand in the Multani tradition. A timeless statement for him or her.',
  'Yellow Gold', true, true
from public.categories c where c.slug = 'rings'
on conflict (slug) do nothing;

insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '22k', 14.0, 520000, 4 from public.products p where p.slug = 'sultanate-signet-ring';
insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '21k', 13.0, 480000, 6 from public.products p where p.slug = 'sultanate-signet-ring';

insert into public.product_images (product_id, storage_path, alt_text, position, is_primary)
select p.id, '/Ring2.jpg', 'Sultanate Signet Ring', 0, true
from public.products p where p.slug = 'sultanate-signet-ring';

-- Multani Heritage Necklace (Necklace.jpg)
insert into public.products (name, slug, category_id, description, metal_type, is_featured, is_active)
select 'Multani Heritage Necklace', 'multani-heritage-necklace', c.id,
  'A hand-crafted gold necklace inspired by the bridal sets of Multan. Each link is finished by hand for a piece worthy of your most important occasions.',
  'Yellow Gold', true, true
from public.categories c where c.slug = 'necklaces'
on conflict (slug) do nothing;

insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '22k', 65.0, 1850000, 2 from public.products p where p.slug = 'multani-heritage-necklace';
insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '21k', 60.0, 1700000, 3 from public.products p where p.slug = 'multani-heritage-necklace';

insert into public.product_images (product_id, storage_path, alt_text, position, is_primary)
select p.id, '/Necklace.jpg', 'Multani Heritage Necklace', 0, true
from public.products p where p.slug = 'multani-heritage-necklace';

-- Done.
do $$ begin raise notice '✅ Schema + seed applied successfully.'; end $$;
