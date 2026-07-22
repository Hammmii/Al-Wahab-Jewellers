# Al-Wahab Jewellers — Project Constitution

> A real luxury jewellery business in **Multan Sarafa Bazar, Shop #2**, Pakistan.
> Rebuilding from a non-functional vibecoded shell into a world-class premium web app.

## The business (facts only — never invent)
- **Owner:** the user's father. **Location:** Multan Sarafa Bazar, Shop #2.
- **Market:** Pakistan → **all prices in PKR (rupees)**.
- **Brand wordmark:** "الوہاب جیولرز" (Noto Nastaliq Urdu).
- Brand details not yet confirmed (founder's name, founding year, real phone/email/WhatsApp) are PLACEHOLDERS until the user supplies them. Do not write unconfirmed brand copy.

## Approved tech stack
- **Next.js 15** App Router · **TypeScript** (strict) · **Tailwind** · **shadcn/Radix** UI
- **Supabase** — Postgres + Auth + Storage + RLS (the single source of truth)
- **Zustand** — client state (cart, wishlist, UI)
- **Lenis + Motion + GSAP** — premium feel (smooth scroll, micro-interactions, cinematic hero)
- **Resend + React Email** — transactional email
- **Fonts:** Cormorant Garamond (display) · Inter (body) · Noto Nastaliq Urdu (wordmark)
- **Payments:** **COD + bank transfer only** (Stripe is not available to PK businesses). No card processor.
- **Gold rates:** auto spot-price API (baseline) **+ admin override** with the real Sarafa rate.

## Hard rules (non-negotiable)
1. **NO FAKE DATA.** Every customer-facing number must be real, sourced, or admin-entered. No randomized gold rates, no hardcoded ratings, no fabricated press logos / testimonials / stock counts / "X people viewing". If it isn't real, omit it.
2. **Money in PKR**, stored as integer or `numeric` — never as float.
3. **RLS on every Supabase table.** Never trust the client. The service-role key is server-only and never prefixed `NEXT_PUBLIC_`.
4. **Accessibility (WCAG AA):** real alt text, keyboard-operable, sufficient contrast (check gold-on-dark).
5. **Performance:** `next/image` always with `sizes`; `priority` only on the LCP image; keep client components minimal.
6. **Validate on both sides:** one zod schema, reused on client (react-hook-form) and server (route / server action).
7. Match the surrounding code's style, naming, and comment density.

## Model routing (per the user)
- **Critical / thinking work** — architecture, Supabase schema & RLS design, security, performance tradeoffs, hard debugging, planning — → **delegate to the `architect` subagent** (`glm-5.2`, deep reasoning). Do not make big calls in the fast loop.
- **Pre-commit quality gate** — → run the **`code-reviewer`** subagent (`glm-5.2`) before any commit/PR.
- **Routine coding** — scaffolding, mechanical edits, wiring — → main loop (`glm-5-turbo`, medium effort); the user sets the main model via `/model`.

## How we work
- Plan non-trivial work before building. Track it with the task list.
- Branch off `main`; one logical change per commit; never commit secrets.
- Verify honestly: run `typecheck` / `build` / tests and report real results — never claim success without evidence.
- **Quality gate before launch:** flip `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` back to `false` in `next.config.ts` once the codebase is clean.

## Target file structure
```
src/lib/supabase/      server, browser, middleware clients
src/lib/stores/        zustand stores (cart, wishlist, ui)
src/lib/validations/   zod schemas shared client/server
src/lib/email/         resend + react-email templates
src/lib/               data access, types, utils, metadata
src/app/               routes (App Router) + api/
src/components/        ui (shadcn), layout, products, admin, …
supabase/migrations/   SQL migrations (source of truth for schema)
```

## Subagents
- **`architect`** — glm-5.2 — the hard calls (architecture/schema/security/bugs). Invoke before big decisions.
- **`code-reviewer`** — glm-5.2 — strict pre-commit review (correctness, security/RLS, no-fake-data, a11y, simplification).

## Memory
Durable project facts live in the memory directory — e.g. `no-fake-data`, `brand-story`, `rebuild-plan`, `tech-stack`, `known-issues`. Consult them; they capture decisions and constraints not visible in the code.
