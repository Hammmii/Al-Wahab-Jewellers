'use client'

import Link from 'next/link'
import { Reveal } from '@/components/motion/reveal'
import GoldRateDisplay from '@/components/GoldRateDisplay'
import { useT } from '@/lib/i18n/language-context'

/**
 * Hero CTA band — two premium call-to-action buttons + live gold rate.
 *
 * The buttons are crafted bespoke (no shadcn Button) so we can control
 * every gradient, glow, and motion detail to match a world-class
 * luxury aesthetic. Every style is Tailwind or inline CSS only.
 */
export function HeroActions() {
  const t = useT()

  return (
    <section className="border-b border-border bg-card/30">
      <div className="container relative z-10 flex flex-col items-center gap-10 py-14 text-center md:py-16">
        <Reveal y={16} delay={0.05}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* ── Primary CTA: rich gold gradient fill ─────────────── */}
            <Link
              href="/collections"
              className={
                'group relative inline-flex items-center justify-center ' +
                'rounded-full px-10 py-4 text-[15px] font-medium ' +
                'tracking-[0.14em] uppercase ' +
                'transition-all duration-500 ' +
                'hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 ' +
                'focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
                'active:scale-[0.98]'
              }
              style={{
                background:
                  'linear-gradient(135deg, #8B6914 0%, #C9A84C 25%, #E8D48B 50%, #C9A84C 75%, #8B6914 100%)',
                color: '#1a1207',
                boxShadow:
                  'inset 0 1px 1px rgba(255,255,255,0.25), ' +
                  'inset 0 -1px 1px rgba(0,0,0,0.15), ' +
                  '0 4px 20px -4px rgba(201,168,76,0.45), ' +
                  '0 0 0 1px rgba(201,168,76,0.25)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background =
                  'linear-gradient(135deg, #A07B1A 0%, #D4B85E 25%, #F2E6A8 50%, #D4B85E 75%, #A07B1A 100%)'
                el.style.boxShadow =
                  'inset 0 1px 1px rgba(255,255,255,0.35), ' +
                  'inset 0 -1px 1px rgba(0,0,0,0.12), ' +
                  '0 8px 32px -4px rgba(201,168,76,0.55), ' +
                  '0 0 0 1px rgba(201,168,76,0.35)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background =
                  'linear-gradient(135deg, #8B6914 0%, #C9A84C 25%, #E8D48B 50%, #C9A84C 75%, #8B6914 100%)'
                el.style.boxShadow =
                  'inset 0 1px 1px rgba(255,255,255,0.25), ' +
                  'inset 0 -1px 1px rgba(0,0,0,0.15), ' +
                  '0 4px 20px -4px rgba(201,168,76,0.45), ' +
                  '0 0 0 1px rgba(201,168,76,0.25)'
              }}
            >
              {/* Subtle top-edge highlight */}
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-t-full opacity-60"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.4) 50%, transparent 90%)',
                }}
                aria-hidden="true"
              />
              {t('cta.explore')}
            </Link>

            {/* ── Secondary CTA: gold outline with sweep fill ──────── */}
            <Link
              href="/custom-design"
              className={
                'gold-sweep group relative inline-flex items-center justify-center ' +
                'overflow-hidden rounded-full px-10 py-4 text-[15px] font-medium ' +
                'tracking-[0.14em] uppercase ' +
                'border border-primary/40 text-primary/90 ' +
                'bg-transparent ' +
                'transition-all duration-500 ' +
                'hover:scale-[1.04] ' +
                'hover:border-primary/70 hover:text-primary ' +
                'focus-visible:outline-none focus-visible:ring-2 ' +
                'focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
                'active:scale-[0.98]'
              }
            >
              {/* Hover fill: subtle gold tint that fades in */}
              <span
                className={
                  'pointer-events-none absolute inset-0 rounded-full ' +
                  'bg-gradient-to-br from-primary/0 to-primary/0 ' +
                  'transition-all duration-500 group-hover:from-primary/15 group-hover:to-primary/8'
                }
                aria-hidden="true"
              />
              {/* Top-edge highlight (outline echo of the primary) */}
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-t-full opacity-0 transition-opacity duration-500 group-hover:opacity-50"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 10%, rgba(201,168,76,0.35) 50%, transparent 90%)',
                }}
                aria-hidden="true"
              />
              <span className="relative z-10">{t('cta.bespoke')}</span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <GoldRateDisplay variant="hero" />
        </Reveal>
      </div>
    </section>
  )
}
