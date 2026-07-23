'use client'

import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/common'
import { Reveal } from '@/components/motion/reveal'
import GoldbarVideo from '@/components/GoldbarVideo'
import { useT } from '@/lib/i18n/language-context'
import Link from 'next/link'

export function HeritageSection() {
  const t = useT()
  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
      <Reveal>
        <div
          className="overflow-hidden rounded-xl border border-border bg-black"
          style={{ aspectRatio: '6 / 7', minHeight: 320 }}
        >
          <GoldbarVideo />
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <SectionHeading align="left" eyebrow={t('heritage.eyebrow')} title={t('section.heritage')} />
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>{t('heritage.p1')}</p>
          <p>{t('heritage.p2')}</p>
        </div>
        <Button
          asChild
          variant="outline"
          className="mt-8 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
        >
          <Link href="/about">{t('heritage.cta')}</Link>
        </Button>
      </Reveal>
    </div>
  )
}
