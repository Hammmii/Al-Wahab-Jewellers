'use client'

import Link from 'next/link'
import { Container, Section, SectionHeading } from '@/components/common'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal'
import GoldRateDisplay from '@/components/GoldRateDisplay'
import { useT } from '@/lib/i18n/language-context'

const STEPS = [
  { n: '01', titleKey: 'custom.s1Title' as const, bodyKey: 'custom.s1Body' as const },
  { n: '02', titleKey: 'custom.s2Title' as const, bodyKey: 'custom.s2Body' as const },
  { n: '03', titleKey: 'custom.s3Title' as const, bodyKey: 'custom.s3Body' as const },
  { n: '04', titleKey: 'custom.s4Title' as const, bodyKey: 'custom.s4Body' as const },
  { n: '05', titleKey: 'custom.s5Title' as const, bodyKey: 'custom.s5Body' as const },
]

export function CustomBriefHeading() {
  const t = useT()
  return <SectionHeading eyebrow="" title={t('custom.briefTitle')} subtitle={t('custom.briefSubtitle')} />
}

export function CustomHero() {
  const t = useT()
  return (
    <section className="bg-hero-pattern relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="container relative z-10 px-4 text-center">
        <Reveal y={16}>
          <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">Bespoke Atelier</span>
        </Reveal>
        <Reveal y={20} delay={0.06}>
          <h1 className="mt-4 font-headline text-4xl text-foreground md:text-6xl">{t('custom.heroTitle')}</h1>
        </Reveal>
        <Reveal delay={0.16}>
          <a
            href="#brief"
            className="mt-9 inline-flex items-center justify-center rounded-lg border border-primary/50 bg-secondary px-8 py-3 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/10"
          >
            {t('custom.begin')}
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export function CustomProcess() {
  const t = useT()
  return (
    <Section>
      <SectionHeading eyebrow={t('custom.processEyebrow')} title={t('custom.processTitle')} subtitle={t('custom.processSub')} />
      <Stagger className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
        {STEPS.map((s) => (
          <StaggerItem key={s.n}>
            <div className="surface-card lift h-full rounded-xl p-6">
              <span className="font-headline text-3xl text-primary/70">{s.n}</span>
              <h3 className="mt-3 font-medium text-foreground">{t(s.titleKey)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(s.bodyKey)}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}

export function CustomPricing() {
  const t = useT()
  return (
    <Section className="bg-card/30">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <SectionHeading align="left" eyebrow={t('custom.priceEyebrow')} title={t('custom.priceTitle')} />
            <p className="mt-5 leading-relaxed text-muted-foreground">{t('custom.priceBody')}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="surface-card rounded-xl p-6">
              <GoldRateDisplay variant="default" />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

export function CustomFaq() {
  const t = useT()
  const faqs = [
    { qKey: 'custom.q1' as const, aKey: 'custom.a1' as const },
    { qKey: 'custom.q2' as const, aKey: 'custom.a2' as const },
    { qKey: 'custom.q3' as const, aKey: 'custom.a3' as const },
    { qKey: 'custom.q4' as const, aKey: 'custom.a4' as const },
  ]
  return (
    <Section className="bg-card/30">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow={t('custom.faqEyebrow')} title={t('custom.faqTitle')} />
        <div className="mt-10 space-y-3">
          {faqs.map((item) => (
            <details key={item.qKey} className="surface-card group rounded-xl p-5">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                {t(item.qKey)}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(item.aKey)}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          {t('custom.faqConsult')}{' '}
          <Link href="/contact" className="link-underline text-primary">{t('custom.faqConsultCta')}</Link>
        </p>
      </Container>
    </Section>
  )
}
