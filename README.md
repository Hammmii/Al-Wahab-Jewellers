# Al-Wahab Jewellers

> A premium Next.js 15 storefront for **Al-Wahab Jewellers**, a family-run gold shop in **Multan Sarafa Bazar, Shop #2**, Pakistan.
> Led by **Sikandar Hayat**, with 30+ years of experience in gold jewellery.

## Live contact

- **Phone / WhatsApp:** [0300 9631161](tel:+923009631161)
- **Address:** Sarafa Bazar, Shop #2, Multan, Pakistan

## What this app does

- Public luxury storefront: hero, featured products, category browsing, product detail pages.
- Live gold rates display (admin-set; no fabricated numbers).
- Cart + secure checkout: COD and bank transfer with payment-proof upload.
- Custom design request wizard.
- Virtual try-on quote requests.
- Admin portal: product CRUD, orders dashboard, order detail with payment-proof viewer.
- Bilingual English + Urdu with RTL support.

## Tech stack

- **Framework:** Next.js 15 App Router + TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Postgres, Auth, Storage, RLS)
- **State:** Zustand (cart, wishlist, UI)
- **Email:** Resend + React Email templates (optional — app works without email config)
- **Payments:** Cash on delivery (COD) + bank transfer only

## Quick start

```bash
# Install dependencies
npm install

# Copy environment template and fill in real Supabase keys
cp .env.example .env.local

# Start dev server (Turbopack, port 9002)
npm run dev
```

## Supabase setup — run this once

Open the Supabase SQL Editor and run the entire contents of:

```
supabase/_apply_all.sql
```

This single script:
1. Resets the public schema cleanly.
2. Creates all tables, enums, indexes, RLS policies, and storage buckets.
3. Adds the atomic `create_order()` function for checkout hardening.
4. Seeds three real products using the images in `/public`.

After running it, create an admin user:

1. Sign up a user in Supabase Auth.
2. Run:
   ```sql
   update public.profiles set is_admin = true where id = '<user-uuid>';
   ```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://awhbswhrqsmqwyzkcsyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NEXT_PUBLIC_SITE_URL=http://localhost:9002
NEXT_PUBLIC_SITE_NAME=Al-Wahab Jewellers
```

Email is **optional**. If `RESEND_API_KEY` is missing, order/custom-design/try-on notifications are logged and skipped — the app keeps working.

## Build commands

```bash
npm run typecheck   # TypeScript strict check
npm run lint        # ESLint
npm run build       # Production build
npm run start       # Start production server on port 9002
```

## Recent changes

- Fixed invisible homepage hero headline (content was behind the GoldParticles canvas).
- Fixed checkout form validation so the form only validates collected fields; items are merged from the cart.
- Completed end-to-end checkout test: COD order creates successfully and redirects to `/checkout/success`.
- Added `Abdullah Sikandar` and `Abdul Wahab` contacts to the Footer alongside `Sikandar Hayat`.
- Made motion wrappers degrade gracefully so content stays visible even if JS/intersection observers fail.
- Added working site-wide search in the header and on the collections page (full-text + trigram backed).
- Added custom bilingual 404 (`not-found.tsx`) and error boundary (`error.tsx`) pages.
- Cleaned up the stale `rebuild/premium-storefront` branch.
- Hardened checkout with server-authoritative prices, stock checks, and atomic order creation via Postgres RPC.
- Added bank-transfer payment-proof upload and admin order-detail viewer.
- Improved product search to use existing full-text (`tsvector`) and trigram indexes.
- Added SEO metadata and Open Graph images.
- Added virtual-try-on email notifications.
- Wired real business info: Sikandar Hayat, 30+ years, phone 0300 9631161.

## Supabase one-shot setup

If you see `ERROR: 42883: function public.is_admin() does not exist`, it means a policy was created before the helper function existed. Run the **entire** contents of `supabase/_apply_all.sql` in the Supabase SQL Editor as a single query. It creates a stub `is_admin()` first, then replaces it after tables exist, so policies compile safely.

## Project structure

```
src/
  app/              # Next.js routes + API handlers
  components/       # UI components (shadcn + custom)
  lib/
    data/           # Typed Supabase queries
    supabase/       # Client, server, admin, middleware clients
    validations/    # Shared Zod schemas
    email/          # Resend wrapper + React Email templates
  context/          # Gold rate provider
  middleware.ts     # Auth session refresh + /admin guard
supabase/
  migrations/       # Versioned SQL (source of truth)
  _apply_all.sql    # One-shot schema + seed script
```

## Rules we follow

- **No fake data.** Every customer-facing number, rate, review, and stock count is real or admin-entered.
- **RLS on every table.** Service-role key is server-only and never `NEXT_PUBLIC_`.
- **Money in PKR** as `numeric(12,2)` — never float.
- Server Components by default; Client Components only for browser interactivity.
