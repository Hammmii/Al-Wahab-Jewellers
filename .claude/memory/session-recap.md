# Al-Wahab Jewellers — Session Recap & Current State

> Read this first at the start of every new session. It captures where the project stands, what was recently done, and what still needs attention.
> **Branch:** `main` is the active production branch. `rebuild/premium-storefront` is stale and should be ignored/deleted.

---

## Business facts (confirmed)

- **Business name:** Al-Wahab Jewellers (الوہاب جیولرز)
- **Owner:** Sikandar Hayat
- **Experience:** 30+ years in gold jewellery
- **Phone / WhatsApp:** 03009631161
- **Address:** Sarafa Bazar, Shop #2, Multan, Pakistan
- **Payments:** Cash on delivery (COD) and bank transfer only. No card processor. Bank account details are NOT configured yet.
- **Email:** No external email integration is required. Resend code exists but is optional; if `RESEND_API_KEY` is missing, emails are skipped and the app keeps working.

---

## Current state (as of latest review)

- **Branch:** `main`
- **Last reviewed commit:** `7059582` — fix: restore working lint script for Next.js 16
- **Framework:** Next.js 16.2.11 + React 18 + TypeScript strict + Tailwind + shadcn/ui
- **Deployment target:** Vercel (configured via `vercel.json` + Vercel MCP)
- **Database:** Supabase project `awhbswhrqsmqwyzkcsyg`
- **Gold rates:** Populated via admin gold-rate manager

---

## What works today

### Public storefront
- Homepage with hero, featured products, categories, heritage section, showcase, trust promises, CTAs.
- Collections page with category filtering.
- Product detail pages with variants, prices, images.
- Bilingual English/Urdu with RTL support and visible mobile language toggle.
- Real business info (Sikandar Hayat, phone, address) across footer, contact, and about pages.
- SEO: dynamic product metadata, default OG/Twitter image, sitemap, robots.txt.

### Cart & checkout
- Client-side Zustand cart persisted to `localStorage`.
- Checkout with COD or bank transfer.
- Bank-transfer payment-proof upload before order placement.
- Server-authoritative order creation via `public.create_order()` RPC: locks variants, checks stock, decrements stock, inserts order/items with DB prices.
- Structured error handling for insufficient stock / unavailable variants.

### Admin portal
- Admin login via Supabase Auth.
- Dashboard with stats.
- Product CRUD with Supabase Storage image upload.
- Orders list + order detail with payment-proof viewer.
- Gold-rate manager to set daily Sarafa Bazar rates.

### Other
- Custom design request wizard.
- Virtual try-on quote requests with email notifications (optional).
- Contact form.

---

## Current verification status

```
npm run typecheck  ✅
npm run lint       ✅ (eslint ., next lint removed in Next.js 16)
npm run build      ✅
```

Smoke-tested on port 9003:
- Homepage, collections, product detail render the three seed products.
- Phone and owner name render in footer, contact, and about pages.
- Gold-rates API returns real manual rates.
- `/api/orders` returns `variant_not_found` for fake IDs (checkout hardening wired).
- Admin routes redirect when unauthenticated.
- Sitemap and robots.txt render correctly.

---

## Known issues / remaining gaps

### Must fix before trusting as production
1. **Search is not exposed to users.** `searchProducts()` was improved to use `tsvector` + `pg_trgm`, but the only search UI is a magnifying-glass icon in the header that links to `/collections`. There is no search input, results page, or live search.

2. **No custom error pages.** Missing `src/app/not-found.tsx` and `src/app/error.tsx`.

3. **Stale branch.** `rebuild/premium-storefront` is behind `main` and should be deleted to avoid confusion.

### Should add soon
4. **Reviews UI.** The `reviews` table and RLS policies exist, but customers cannot view or submit reviews.

5. **Greeting-message generator.** Listed in `docs/blueprint.md` but never implemented.

6. **Path-based category URLs.** Categories use `/collections?category=rings`; `/collections/rings` would be better for SEO and UX.

7. **Security headers / CSP.** Not configured in `next.config.ts` or Vercel.

8. **Automated tests.** No test suite exists (no Jest/Vitest/Playwright).

9. **CI/CD.** No GitHub Actions workflow for `typecheck`, `lint`, `build`.

### Nice to have
10. **Performance/accessibility audit** (Lighthouse, gold-on-dark contrast, reduced-motion).
11. **Analytics wiring** (Plausible optional env exists but not wired).
12. **Migrate ESLint to flat config** (`eslint.config.mjs`) — current `.eslintrc.json` + eslint 8 works but is legacy for Next.js 16.

---

## Immediate next steps if something is broken

1. Verify `supabase/_apply_all.sql` has been run on the live Supabase project.
2. Verify an admin user exists: `select * from public.profiles where is_admin = true;`
3. Restart the production server to pick up the latest build.
4. Run `npm run typecheck && npm run lint && npm run build` after any change.

---

## Files every future agent should read first

- `AGENTS.md` — project onboarding and rules.
- `CLAUDE.md` — constitution: no fake data, RLS, PKR, etc.
- `ARCHITECTURE.md` — data flow, security model, conventions.
- This file (`/.claude/memory/session-recap.md`).
- `src/lib/site.ts` — current business facts.
- `src/lib/validations/index.ts` — shared Zod schemas.
- `supabase/_apply_all.sql` — single source-of-truth schema + seed.
