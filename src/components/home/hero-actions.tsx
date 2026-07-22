'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/motion/reveal'
import GoldRateDisplay from '@/components/GoldRateDisplay'
import { useT } from '@/lib/i18n/language-context'

/**
 * Action band under the hero: the two primary CTAs and the live gold rate.
 * (Trust facts removed per request — nothing floats loose here.)
 */
export function HeroActions() {
  const t = useT()

  return (
    <section className="border-b border-border bg-card/30">
      <div className="container relative z-10 flex flex-col items-center gap-10 py-14 text-center md:py-16">
        <Reveal y={12}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8">
              <Link href="/collections">{t('cta.explore')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/custom-design">{t('cta.bespoke')}</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <GoldRateDisplay variant="hero" />
        </Reveal>
      </div>
    </section>
  )
}
