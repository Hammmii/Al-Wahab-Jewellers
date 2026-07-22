# Al-Wahab Jewellers — Architecture

> World-class, RLS-first architecture for a Next.js 15 App Router + Supabase luxury
> jewellery store. Validated against 2026 best practices (official Supabase + Next.js docs).

## Core principles
1. **Server Components by default.** Data is fetched on the server, directly from
   Supabase, and rendered as HTML. Client Components exist only where interactivity
   requires them (cart drawer, image zoom, forms). This maximises SEO, perf, and security.
2. **RLS is the primary authorization layer.** Every table has Row Level Security
   enabled explicitly in SQL (raw migrations do **not** auto-enable it). Policies are
   deny-by-default. The browser never receives data it isn't allowed to see — even if a
   route is misconfigured.
3. **Three Supabase clients** (`@supabase/ssr`): `client.ts` (browser), `server.ts`
   (RSCs / Route Handlers / Server Actions), `middleware.ts` (session refresh + route
   guard). Plus `admin.ts` (service-role, **bypasses RLS, server-only**).
4. **Money in PKR as `numeric`**, never float. Prices, rates, totals — all `numeric(12,2)`.
5. **No fake data.** Gold rates come from a real source + admin override; reviews from
   verified buyers; nothing is randomized or hardcoded for show. (See CLAUDE.md.)

## Request → data flow
```
Browser
  → Next.js Edge Middleware (refresh Supabase session, guard /admin)
  → Server Component / Route Handler
    → src/lib/data/* (typed queries)
      → supabase server client (anon key + RLS, scoped to the user's JWT)
        → Postgres (RLS enforces row visibility)
  → HTML streamed to the browser (Suspense for slow sections)
```
Mutations go through **Server Actions** or **Route Handlers**, which revalidate the
relevant paths. The client never writes directly to privileged tables.

## Security model
- **`is_admin()`** — a `SECURITY DEFINER` SQL function reading `profiles.is_admin`; used
  in admin RLS policies so the check can't be spoofed client-side.
- **`is_verified_buyer(product_id)`** — `SECURITY DEFINER`; only customers with a
  non-cancelled order containing that product may review it.
- **`SECURITY DEFINER` is essential** for any policy that reads another table — otherwise
  RLS recurses or hides the rows the check needs.
- **Service-role key** (`SUPABASE_SERVICE_ROLE_KEY`) bypasses **all** RLS. It lives only in
  `admin.ts`, is never `NEXT_PUBLIC_`, and is used solely for trusted server work
  (webhooks, scheduled jobs, admin operations behind `is_admin()`).
- **Index every column an RLS policy filters on** (`customer_id`, `product_id`, `order_id`)
  — policy performance depends on it.

## Client state
- **Zustand** for genuinely client-only state: cart, wishlist, UI (drawer open/closed).
  Persisted to `localStorage` so guest carts survive refresh. The server stays the source
  of truth for everything that must be authoritative (orders, prices, stock).
- Cart/wishlist are **not** authorised state — they become real only at checkout, where the
  server re-validates prices and stock before creating the order.

## Folder structure
```
src/
  app/                  routes (App Router) + api/ + middleware
  components/
    ui/                 shadcn/Radix primitives (re-skinned to the brand)
    layout/             Header, Footer, providers
    products/           ProductCard, gallery, zoom
    admin/              admin-only UI
  lib/
    supabase/           client, server, admin, middleware
    data/               typed data-access queries (the "repository" layer)
    stores/             zustand stores (cart, wishlist, ui)
    validations/        zod schemas — shared client + server
    email/              resend + react-email templates
    types.ts            generated DB types + domain types
    utils.ts, metadata.ts
supabase/
  migrations/           versioned SQL (source of truth for schema)
  config.toml
```

## Background jobs (Supabase Edge Functions / scheduled)
- **Gold-rate ingestion** — a scheduled function fetches the international spot price +
  USD→PKR, computes per-Tola/10g/gram for each karat, and inserts an `auto` row into
  `gold_rates`. The shop's manual `manual` row always wins precedence (see the
  `current_gold_rates` view). This keeps the on-site rate real without fabricating it.
- **Notifications** — order/custom-design/contact submissions trigger Resend emails to the
  shop and a confirmation to the customer.

## Performance
- `next/image` with explicit `sizes` everywhere; `priority` only on the LCP hero.
- Streaming via `<Suspense>` for below-the-fold sections (featured carousel, reviews).
- Catalogue pages use ISR (`revalidate`) since product data changes infrequently.
- Edge middleware for auth (cheap, global).
- GIN indexes on the products `tsvector` + `pg_trgm` for fast/fuzzy search.

## Type safety
- DB types generated from the live schema: `supabase gen types typescript … > src/lib/types/db.ts`.
- Input validation via **zod** schemas in `lib/validations/`, reused by react-hook-form
  (client) and Route Handlers / Server Actions (server) — single source of truth.

## Testing RLS
- RLS policies are tested in isolation (pgTAP or Supabase's test helpers), impersonating
  anon / authenticated-customer / admin roles, before any policy ships.
