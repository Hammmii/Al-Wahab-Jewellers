-- ============================================================================
-- Al-Wahab Jewellers — seed: real products using the local /public images.
-- Run AFTER 0001_init.sql. Image paths starting with "/" are served from the
-- app's /public folder (Ring1.jpg, Ring2.jpg, Necklace.jpg).
-- Prices are in PKR — adjust to the shop's real rates anytime via the admin.
-- ============================================================================

-- Categories (slugs must match the storefront fallback: rings/necklaces/...)
insert into public.categories (name, slug, position) values
  ('Rings', 'rings', 0),
  ('Necklaces', 'necklaces', 1),
  ('Bracelets', 'bracelets', 2),
  ('Earrings', 'earrings', 3)
on conflict (slug) do nothing;

-- ---- Product 1: Eternal Flame Ring (Ring1.jpg) ----
insert into public.products (name, slug, category_id, description, metal_type, is_featured, is_active)
select 'Eternal Flame Ring', 'eternal-flame-ring', c.id,
  'A solitaire statement ring, hand-finished in pure gold with a sculpted flame band. Designed to be worn every day and passed on for generations.',
  'Yellow Gold', true, true
from public.categories c where c.slug = 'rings';

insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '22k', 9.5, 350000, 5
from public.products p where p.slug = 'eternal-flame-ring';
insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '24k', 11.0, 450000, 3
from public.products p where p.slug = 'eternal-flame-ring';

insert into public.product_images (product_id, storage_path, alt_text, position, is_primary)
select p.id, '/Ring1.jpg', 'Eternal Flame Ring in gold', 0, true
from public.products p where p.slug = 'eternal-flame-ring';

-- ---- Product 2: Sultanate Signet Ring (Ring2.jpg) ----
insert into public.products (name, slug, category_id, description, metal_type, is_featured, is_active)
select 'Sultanate Signet Ring', 'sultanate-signet-ring', c.id,
  'A bold heritage signet ring with a faceted face, crafted by hand in the Multani tradition. A timeless statement for him or her.',
  'Yellow Gold', true, true
from public.categories c where c.slug = 'rings';

insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '22k', 14.0, 520000, 4
from public.products p where p.slug = 'sultanate-signet-ring';
insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '21k', 13.0, 480000, 6
from public.products p where p.slug = 'sultanate-signet-ring';

insert into public.product_images (product_id, storage_path, alt_text, position, is_primary)
select p.id, '/Ring2.jpg', 'Sultanate Signet Ring', 0, true
from public.products p where p.slug = 'sultanate-signet-ring';

-- ---- Product 3: Multani Heritage Necklace (Necklace.jpg) ----
insert into public.products (name, slug, category_id, description, metal_type, is_featured, is_active)
select 'Multani Heritage Necklace', 'multani-heritage-necklace', c.id,
  'A hand-crafted gold necklace inspired by the bridal sets of Multan. Each link is finished by hand for a piece worthy of your most important occasions.',
  'Yellow Gold', true, true
from public.categories c where c.slug = 'necklaces';

insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '22k', 65.0, 1850000, 2
from public.products p where p.slug = 'multani-heritage-necklace';
insert into public.product_variants (product_id, metal_purity, weight_grams, price, stock)
select p.id, '21k', 60.0, 1700000, 3
from public.products p where p.slug = 'multani-heritage-necklace';

insert into public.product_images (product_id, storage_path, alt_text, position, is_primary)
select p.id, '/Necklace.jpg', 'Multani Heritage Necklace', 0, true
from public.products p where p.slug = 'multani-heritage-necklace';

-- ============================================================================
-- Done. The storefront will now show these three pieces (and more as you add
-- them via the admin). Prices/weights are starting values — edit freely.
-- ============================================================================
