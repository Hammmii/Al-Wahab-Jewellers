# Al-Wahab Jewellers — Agent Guide

> A Next.js 15 luxury jewellery storefront for a real family-run gold shop in Multan’s Sarafa Bazar (Shop #2), Pakistan. This file is the onboarding doc for AI coding agents. Read it first.

## Project overview

- **Name:** Al-Wahab Jewellers (brand wordmark: الوہاب جیولرز)
- **Domain:** Luxury gold jewellery e-commerce + bespoke commissions.
- **Market:** Pakistan — all prices are in Pakistani Rupees (PKR).
- **Payments:** Cash on delivery (COD) and bank transfer only. No card processor (Stripe is unavailable to PK businesses).
- **Language:** Bilingual English + Urdu, with full RTL support for Urdu.
- **Architecture:** Next.js 15 App Router + TypeScript (strict) + Tailwind CSS + shadcn/ui, backed by Supabase (Postgres, Auth, Storage, Row Level Security).
- **Key quality rule:** **NO FAKE DATA.** Every customer-facing number, rate, review, and stock count must be real, sourced, or admin-entered. Do not randomize, hardcode, or fabricate anything shown to users.

### What the app does today

- Public storefront: hero, featured products, category browsing, product detail pages, live gold rates, about, contact.
- Cart + checkout: client-side Zustand cart persisted to `localStorage`; checkout posts to `/api/orders` and persists to Supabase.
- Custom design requests: multi-step wizard persisted to Supabase and emailed to the shop.
- Admin portal (behind `/admin`): product CRUD, orders dashboard, dashboard stats. Protected by Supabase auth + `profiles.is_admin`.
- Gold rates: displayed from Supabase `current_gold_rates` view; manual admin rate overrides an auto-fetched baseline.
- Virtual try-on: a quote-request page exists but the full Replicate-based pipeline is not yet wired.

## Technology stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15.3.3 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3.4 + `tailwindcss-animate` |
| UI primitives | shadcn/ui (Radix-based) in `src/components/ui` |
| Icons | Lucide React |
| Fonts | Bodoni Moda (display), Jost (body), Gulzar + Noto Naskh Arabic (Urdu) |
| Backend / DB | Supabase (Postgres + Auth + Storage) |
| Auth session | `@supabase/ssr` cookie-based SSR |
| Client state | Zustand (cart, wishlist, UI) |
| Animations | Lenis (smooth scroll), Motion, GSAP |
| Forms | `react-hook-form` + `@hookform/resolvers` + shared Zod schemas |
| Email | Resend + React Email templates |
| Validation | Zod |
| Charts | Recharts (admin) |
| 3D viewer | `@google/model-viewer` |

## Project structure

```
├── src/
│   ├── app/                    # Next.js App Router routes + API route handlers
│   │   ├── api/                # /api/contact, /api/custom-design, /api/gold-rates, /api/orders, /api/virtual-try-on
│   │   ├── admin/              # Admin portal pages + product actions
│   │   ├── collections/        # Catalogue + product detail
│   │   ├── (public pages)/     # cart, checkout, about, contact, custom-design, virtual-try-on, wishlist
│   │   ├── globals.css         # Design tokens + premium utilities
│   │   ├── layout.tsx          # Root layout, fonts, providers
│   │   ├── page.tsx            # Homepage
│   │   ├── robots.ts           # robots.txt
│   │   └── sitemap.ts          # sitemap.xml
│   ├── components/
│   │   ├── ui/                 # shadcn components (re-skinned to brand)
│   │   ├── common/             # Container, Section, Price, EmptyState, etc.
│   │   ├── layout/             # Header, Footer
│   │   ├── home/               # Hero, featured products, category cards
│   │   ├── products/           # ProductCard, gallery, detail, zoom
│   │   ├── collections/        # Catalogue UI
│   │   ├── cart/               # Cart + checkout success
│   │   ├── contact/            # Contact form + sidebar
│   │   ├── custom-design/      # Custom design wizard
│   │   ├── admin/              # Admin shell + product form
│   │   ├── motion/             # Reveal / Stagger wrappers
│   │   ├── loading/            # Intro loader
│   │   ├── providers/          # SmoothScrollProvider
│   │   ├── seo/                # JSON-LD components
│   │   ├── i18n/               # Language toggle
│   │   └── icons.tsx           # Custom SVG icon set
│   ├── context/
│   │   └── GoldRateContext.tsx # Client gold-rate provider
│   ├── hooks/                  # use-mobile, use-toast
│   ├── lib/
│   │   ├── supabase/           # client, server, admin, middleware, configured
│   │   ├── data/               # Typed data-access layer ("repository")
│   │   ├── stores/             # Zustand stores (cart, wishlist, ui, safe-storage)
│   │   ├── validations/        # Shared Zod schemas
│   │   ├── email/              # Resend wrapper + React Email templates
│   │   ├── i18n/               # Language cookie, context, translations
│   │   ├── auth/admin.ts       # getAdminUser helper
│   │   ├── domain.ts           # CamelCase domain types
│   │   ├── format.ts           # PKR formatting, dates, weight
│   │   ├── gold-rates.ts       # Gold-rate types + pure helpers
│   │   ├── site.ts             # Central site config
│   │   ├── storage.ts          # Image URL resolver
│   │   ├── submissions.ts      # Contact/custom-design persistence
│   │   ├── utils.ts            # cn(), etc.
│   │   └── types/database.types.ts # Generated Supabase DB types
│   ├── middleware.ts           # Thin wrapper around Supabase session refresh + /admin guard
│   └── types/model-viewer.d.ts # Model-viewer types
├── supabase/
│   ├── migrations/             # Versioned SQL schema (source of truth)
│   │   ├── 0001_init.sql       # Full schema + RLS + storage policies
│   │   └── 0002_seed_products.sql # Real seed products using /public images
│   └── _apply_all.sql          # Combined apply script
├── public/                     # Static assets + seeded product images
├── docs/blueprint.md           # Original feature brief (legacy)
├── ARCHITECTURE.md             # Architecture deep-dive
├── CLAUDE.md                   # Project constitution + subagent rules
├── next.config.ts              # Next.js config (quality-gate flags currently ON)
├── tailwind.config.ts          # Brand theme (gold ramp, fonts, animations)
├── components.json             # shadcn configuration
├── apphosting.yaml             # Firebase App Hosting config
└── .mcp.json                   # Supabase MCP server config
```

## Build and run commands

```bash
# Install dependencies
npm install

# Start the dev server (Turbopack, port 9002)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type check (no emit)
npm run typecheck

# Lint
npm run lint
```

The dev server runs on `http://localhost:9002` (see `package.json` script). The build currently has two temporary quality-gate flags enabled in `next.config.ts`:

- `typescript.ignoreBuildErrors: true`
- `eslint.ignoreDuringBuilds: true`

These are explicitly labeled as temporary in `next.config.ts` and **must be flipped back to `false` before launch** once the codebase is type-clean and lint-clean.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. Never commit `.env*` files.

Required for Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never prefix with `NEXT_PUBLIC_`)

Site / email:

- `NEXT_PUBLIC_SITE_URL` (default `http://localhost:9002`)
- `NEXT_PUBLIC_SITE_NAME`
- `RESEND_API_KEY` (server-only)
- `MAIL_FROM`
- `NOTIFY_EMAIL`

Gold-rate baseline (optional; admin can always override):

- `GOLD_API_PROVIDER`, `GOLD_API_KEY`

The app is designed to degrade gracefully: if Supabase is not configured, public pages still render and most forms email the shop instead of persisting.

## Code style guidelines

- **TypeScript strict mode is on.** Avoid `any`. Prefer explicit types.
- **Server Components by default.** Only make a component a Client Component (`'use client'`) when it needs browser interactivity (forms, cart drawer, animations, zoom).
- **Path alias:** use `@/*` for `src/*`.
- **Naming:**
  - React components: PascalCase files + exports.
  - Server actions: `*Action` suffix (e.g. `createProductAction`).
  - Data-access functions: `get*`, `adminGet*`.
  - Stores: `useCart`, `useWishlist`, `useUI`.
  - DB columns: `snake_case`. Domain types: `camelCase`.
- **Money:** store and compute in PKR as integer/numeric. Never use float for money. Display via `formatPKR()` or `formatPKRCompact()`.
- **Comments:** match the surrounding file’s comment density. Use block headers (`// ─── Section ───`) for grouping in library modules.
- **Tailwind:** use theme tokens (`primary`, `muted-foreground`, `border`) rather than hardcoded colors. Brand gold is `gold-400` / `primary`.
- **Accessibility:** real `alt` text, keyboard-operable controls, sufficient contrast (check gold-on-dark), respect `prefers-reduced-motion`.
- **No fake data.** Do not hardcode ratings, stock counts, testimonials, press logos, gold rates, or viewer counts.

## Data flow and architecture

1. Browser request hits Edge middleware (`src/middleware.ts`) → refreshes Supabase session and guards `/admin`.
2. Next.js renders a Server Component or Route Handler.
3. Data layer (`src/lib/data/*`) uses the server Supabase client (`src/lib/supabase/server.ts`).
4. Postgres enforces Row Level Security (RLS) per the signed-in user’s JWT.
5. HTML is streamed; `<Suspense>` is used for below-the-fold sections.

Mutations go through Route Handlers (`src/app/api/*`) or Server Actions (`src/app/admin/products/actions.ts`), never direct client writes to privileged tables.

### Supabase clients

- `src/lib/supabase/client.ts` — browser client, bound by RLS.
- `src/lib/supabase/server.ts` — server client for RSCs / Route Handlers / Server Actions, bound by RLS.
- `src/lib/supabase/middleware.ts` — session refresh in Edge middleware.
- `src/lib/supabase/admin.ts` — service-role client that **bypasses RLS**; server-only and never exposed to the client.

### Security model

- RLS is enabled explicitly on every table in `supabase/migrations/0001_init.sql`.
- Policies are deny-by-default.
- `public.is_admin()` and `public.is_verified_buyer(product_id)` are `SECURITY DEFINER` functions so RLS checks cannot be spoofed.
- Admin authorization uses `profiles.is_admin`.
- Reviews can only be created by verified buyers (non-cancelled order containing that product).
- Service-role key is used only for trusted server work (webhooks, admin ops, stats).

## Database

The schema lives in `supabase/migrations/0001_init.sql`. Key tables:

- `profiles` (1:1 with `auth.users`)
- `categories`, `collections`
- `products`, `product_variants`, `product_images`
- `gold_rates` + `current_gold_rates` view
- `orders`, `order_items`
- `custom_design_requests`
- `contact_submissions`
- `reviews`
- Storage buckets: `product-images` (public), `custom-designs` (private)

Apply migrations with `supabase db push` or run the SQL in the Supabase SQL editor. After schema changes, regenerate types:

```bash
supabase gen types typescript --project-id <ref> > src/lib/types/database.types.ts
```

Seed products (real local images) are in `supabase/migrations/0002_seed_products.sql`.

## Testing instructions

There is **no automated test suite** in this repo currently (no Jest, Vitest, Playwright, or Cypress configured). Quality is enforced through:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Manual code review (see subagents below)

Before claiming a change is complete, run `typecheck` and `build` and report the actual output. Do not claim success without evidence.

### RLS testing

RLS policies should be tested in isolation by impersonating anon / authenticated customer / admin roles before shipping. The project mentions pgTAP or Supabase test helpers as the preferred approach, but no test files exist yet.

## Deployment

- Primary target is **Firebase App Hosting** (`apphosting.yaml`).
- `maxInstances: 1` is set in `apphosting.yaml`; tune as traffic grows.
- The project also has `.idx/` configuration for Project IDX development.
- No GitHub Actions or CI pipelines are configured yet.

## Subagents

Two Claude subagents are defined in `.claude/agents/`:

- **`architect`** (`glm-5.2`) — invoke for architecture, schema/RLS design, security, performance tradeoffs, and hard debugging.
- **`code-reviewer`** (`glm-5.2`) — run as a pre-commit/PR gate for correctness, security, no-fake-data, accessibility, and simplification.

Use them for non-trivial decisions and before shipping code.

## Working conventions

- Plan non-trivial work before building. Track with the task list.
- Branch off `main`; one logical change per commit; never commit secrets.
- Match existing code style, naming, and comment density.
- Validate inputs with Zod on both client and server; reuse schemas from `src/lib/validations/`.
- Use `next/image` with explicit `sizes`; use `priority` only for the LCP image.
- Keep client components minimal.
- Product images: paths starting with `/` are served from `/public`; otherwise treated as Supabase Storage keys.

## Key files to know

- `src/lib/site.ts` — site metadata and brand facts.
- `src/lib/validations/index.ts` — shared Zod schemas.
- `src/lib/domain.ts` — camelCase domain types.
- `src/lib/format.ts` — PKR formatting helpers.
- `src/lib/data/products.ts` — public product queries.
- `src/lib/data/admin-products.ts` — admin product queries (service-role).
- `src/lib/supabase/*` — all Supabase clients.
- `src/middleware.ts` — auth session refresh + admin route guard.
- `next.config.ts` — build quality-gate flags.
- `tailwind.config.ts` + `src/app/globals.css` — brand theme.

## Security checklist for changes

- [ ] Every new Supabase table has `enable row level security` and explicit policies.
- [ ] Service-role key (`SUPABASE_SERVICE_ROLE_KEY`) is never exposed to the client or prefixed `NEXT_PUBLIC_`.
- [ ] Admin routes check `profiles.is_admin` (RLS + server-side auth).
- [ ] User input is validated with Zod before use.
- [ ] No secrets are logged or rendered.
- [ ] No fake data is surfaced to customers.
