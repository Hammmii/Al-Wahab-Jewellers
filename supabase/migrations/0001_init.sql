-- ============================================================================
-- Al-Wahab Jewellers — initial schema (migration 0001)
-- Stack: Supabase (Postgres + Auth + Storage). Money in PKR as numeric.
-- Security: RLS enabled EXPLICITLY on every table (raw SQL does not auto-enable it),
--           deny-by-default. The service_role key bypasses RLS and is SERVER-ONLY.
-- No seed/fake data — per the project's no-fake-data rule.
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists pg_trgm;   -- fuzzy search
-- (pgcrypto / gen_random_uuid() is available by default in Supabase)

-- Enums ----------------------------------------------------------------------
create type metal_purity      as enum ('24k', '22k', '21k', '18k', 'silver');
create type karat_type        as enum ('24k', '22k', '21k', '18k');
create type order_status      as enum ('pending', 'confirmed', 'dispatched', 'delivered', 'cancelled');
create type payment_method    as enum ('cod', 'bank_transfer');
create type payment_status    as enum ('unpaid', 'paid', 'refunded');
create type gold_rate_source  as enum ('auto', 'manual');
create type custom_design_status as enum ('new', 'in_review', 'quoted', 'closed');
create type contact_status    as enum ('new', 'read', 'replied');

-- Reusable updated_at trigger ------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- Privileged lookups (SECURITY DEFINER — avoid RLS recursion) ----------------
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_verified_buyer(p_product_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where oi.product_id = p_product_id
      and o.customer_id = auth.uid()
      and o.status <> 'cancelled'
  );
$$;

-- ============================================================================
-- profiles (1:1 with auth.users)
-- ============================================================================
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles: read own or admin"
  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles: update own"
  on public.profiles for update using (auth.uid() = id);
-- inserts happen via the handle_new_user trigger (runs as service role)

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- categories
-- ============================================================================
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories: public read"
  on public.categories for select using (true);
create policy "categories: admin write"
  on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- collections
-- ============================================================================
create table public.collections (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);
alter table public.collections enable row level security;
create policy "collections: public read"
  on public.collections for select using (true);
create policy "collections: admin write"
  on public.collections for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- products  (colour = metal_type text; purity lives on variants)
-- ============================================================================
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  category_id   uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  description   text,
  metal_type    text,                                   -- e.g. "Yellow Gold", "White Gold", "Rose Gold"
  is_featured   boolean not null default false,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products: public read active"
  on public.products for select using (is_active or public.is_admin());
create policy "products: admin write"
  on public.products for all using (public.is_admin()) with check (public.is_admin());

-- generated full-text search column + fuzzy + lookup indexes
alter table public.products
  add column search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) stored;
create index products_search_idx     on public.products using gin (search_vector);
create index products_name_trgm_idx  on public.products using gin (name gin_trgm_ops);
create index products_slug_idx       on public.products (slug);
create index products_category_idx   on public.products (category_id);
create index products_collection_idx on public.products (collection_id);
create index products_featured_idx   on public.products (is_featured) where is_featured;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================================
-- product_variants  (purity × size × weight × price × stock)
-- ============================================================================
create table public.product_variants (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete cascade,
  metal_purity metal_purity not null,
  weight_grams numeric(10, 3),
  size         text,
  price        numeric(12, 2) not null check (price >= 0),
  sku          text,
  stock        int not null default 0 check (stock >= 0),
  created_at   timestamptz not null default now()
);
alter table public.product_variants enable row level security;
create policy "variants: public read"
  on public.product_variants for select
  using (exists (
    select 1 from public.products p
    where p.id = product_id and (p.is_active or public.is_admin())
  ));
create policy "variants: admin write"
  on public.product_variants for all
  using (public.is_admin()) with check (public.is_admin());
create index variants_product_idx on public.product_variants (product_id);

-- ============================================================================
-- product_images
-- ============================================================================
create table public.product_images (
  id           uuid primary key default gen_random_uuid(),
  product_id   uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text     text,
  position     int not null default 0,
  is_primary   boolean not null default false,
  created_at   timestamptz not null default now()
);
alter table public.product_images enable row level security;
create policy "images: public read"
  on public.product_images for select
  using (exists (
    select 1 from public.products p
    where p.id = product_id and (p.is_active or public.is_admin())
  ));
create policy "images: admin write"
  on public.product_images for all
  using (public.is_admin()) with check (public.is_admin());
create index images_product_idx on public.product_images (product_id);

-- ============================================================================
-- gold_rates  (auto baseline + manual override; current_gold_rates view)
-- ============================================================================
create table public.gold_rates (
  id            uuid primary key default gen_random_uuid(),
  karat         karat_type not null,
  rate_per_tola numeric(12, 2) not null check (rate_per_tola >= 0),
  rate_per_10g  numeric(12, 2) not null check (rate_per_10g >= 0),
  rate_per_gram numeric(12, 2) not null check (rate_per_gram >= 0),
  source        gold_rate_source not null default 'manual',
  currency      text not null default 'PKR',
  effective_at  timestamptz not null default now(),
  set_by        uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);
alter table public.gold_rates enable row level security;
create policy "gold_rates: public read"
  on public.gold_rates for select using (true);
create policy "gold_rates: admin write"
  on public.gold_rates for all using (public.is_admin()) with check (public.is_admin());
create index gold_rates_karat_time_idx on public.gold_rates (karat, effective_at desc);

-- The "current" rate per karat = latest effective_at; manual wins ties.
create or replace view public.current_gold_rates as
select distinct on (karat)
  karat, rate_per_tola, rate_per_10g, rate_per_gram, source, currency, effective_at
from public.gold_rates
order by karat, effective_at desc, (case when source = 'manual' then 1 else 0 end) desc;

-- ============================================================================
-- orders  (COD + bank transfer; no online card processor)
-- ============================================================================
create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid references public.profiles(id) on delete set null,
  status         order_status not null default 'pending',
  payment_method payment_method not null,
  payment_status payment_status not null default 'unpaid',
  customer_name  text not null,
  phone          text not null,
  email          text,
  address        jsonb not null,
  subtotal       numeric(12, 2) not null check (subtotal >= 0),
  total          numeric(12, 2) not null check (total >= 0),
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "orders: read own or admin"
  on public.orders for select using (customer_id = auth.uid() or public.is_admin());
create policy "orders: customer create own"
  on public.orders for insert with check (customer_id is null or customer_id = auth.uid());
create policy "orders: admin update"
  on public.orders for update using (public.is_admin());
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();
create index orders_customer_idx on public.orders (customer_id);
create index orders_status_idx   on public.orders (status);

-- ============================================================================
-- order_items
-- ============================================================================
create table public.order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete restrict,
  variant_id    uuid references public.product_variants(id) on delete set null,
  name_snapshot text not null,
  price_snapshot numeric(12, 2) not null check (price_snapshot >= 0),
  quantity      int not null check (quantity > 0),
  line_total    numeric(12, 2) not null check (line_total >= 0)
);
alter table public.order_items enable row level security;
create policy "order_items: read own or admin"
  on public.order_items for select using (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin())
  ));
create policy "order_items: customer create own"
  on public.order_items for insert with check (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.customer_id is null or o.customer_id = auth.uid())
  ));
create index order_items_order_idx   on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id, order_id);

-- ============================================================================
-- custom_design_requests
-- ============================================================================
create table public.custom_design_requests (
  id                   uuid primary key default gen_random_uuid(),
  customer_id          uuid references public.profiles(id) on delete set null,
  name                 text not null,
  email                text not null,
  phone                text not null,
  jewelry_type         text not null,
  gold_type            text not null,
  weight_grams         numeric(10, 3),
  budget               numeric(12, 2),
  description          text,
  inspiration_image_path text,
  status               custom_design_status not null default 'new',
  created_at           timestamptz not null default now()
);
alter table public.custom_design_requests enable row level security;
create policy "custom: read own or admin"
  on public.custom_design_requests for select
  using (customer_id = auth.uid() or public.is_admin());
create policy "custom: anyone create"
  on public.custom_design_requests for insert
  with check (customer_id is null or customer_id = auth.uid());
create policy "custom: admin update"
  on public.custom_design_requests for update using (public.is_admin());

-- ============================================================================
-- contact_submissions
-- ============================================================================
create table public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  status     contact_status not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.contact_submissions enable row level security;
create policy "contact: anyone create"
  on public.contact_submissions for insert with check (true);
create policy "contact: admin read"
  on public.contact_submissions for select using (public.is_admin());
create policy "contact: admin update"
  on public.contact_submissions for update using (public.is_admin());

-- ============================================================================
-- reviews  (verified buyers only; public sees only approved)
-- ============================================================================
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  title       text,
  body        text,
  is_approved boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table public.reviews enable row level security;
create policy "reviews: public read approved (+ own)"
  on public.reviews for select
  using (is_approved or customer_id = auth.uid() or public.is_admin());
create policy "reviews: verified buyer create"
  on public.reviews for insert
  with check (customer_id = auth.uid() and public.is_verified_buyer(product_id));
create policy "reviews: admin update"
  on public.reviews for update using (public.is_admin());
create index reviews_product_idx  on public.reviews (product_id);
create index reviews_customer_idx on public.reviews (customer_id);

-- ============================================================================
-- Storage buckets + policies
-- ============================================================================
insert into storage.buckets (id, name, public) values
  ('product-images', 'product-images', true),   -- public catalogue imagery
  ('custom-designs', 'custom-designs', false)   -- private client reference photos
on conflict (id) do nothing;

-- product-images: anyone can read; only admins can write
create policy "product-images: public read"
  on storage.objects for select using (bucket_id = 'product-images');
create policy "product-images: admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
create policy "product-images: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- custom-designs: owner (path prefix = their uid) + admin
create policy "custom-designs: owner read"
  on storage.objects for select to authenticated using (
    bucket_id = 'custom-designs'
    and (public.is_admin() or auth.uid()::text = split_part(name, '/', 1))
  );
create policy "custom-designs: owner insert"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'custom-designs'
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- ============================================================================
-- Done. Apply with:  supabase db push   (or run in the SQL editor).
-- Then generate types:  supabase gen types typescript --project-id <ref> > src/lib/types/db.ts
-- ============================================================================
