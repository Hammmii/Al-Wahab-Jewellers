'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import GoldRateDisplay from '@/components/GoldRateDisplay'
import { useT } from '@/lib/i18n/language-context'
import { IconPurity, IconShipping } from '@/components/icons'

/**
 * Action band under the hero: primary CTAs, the live gold rate, and the two
 * core trust facts (genuine gold · COD & bank). Kept together so nothing floats
 * loose in the middle of the page.
 */
export function HeroActions() {
  const t = useT()

  return (
    <section className="border-b border-border bg-card/30">
      <div className="container relative z-10 flex flex-col items-center gap-10 py-14 text-center md:py-16">
        <Reveal y={12}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gold-sweep px-8">
              <Link href="/collections">{t('cta.explore')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/custom-design">{t('cta.bespoke')}</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <GoldRateDisplay variant="hero" />
        </Reveal>

        {/* Trust facts (clean, no middots) */}
        <Reveal delay={0.16}>
          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground sm:flex-row sm:gap-8">
            <span className="inline-flex items-center gap-2">
              <IconPurity className="h-5 w-5 text-primary" /> {t('trust.hallmarked')}
            </span>
            <span className="inline-flex items-center gap-2">
              <IconShipping className="h-5 w-5 text-primary" /> {t('trust.payment')}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
