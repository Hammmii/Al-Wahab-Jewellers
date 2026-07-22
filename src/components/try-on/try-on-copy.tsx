'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container, Section, SectionHeading } from '@/components/common'
import { Reveal } from '@/components/motion/reveal'
import { useT } from '@/lib/i18n/language-context'
import { IconPurity, IconCertificate, IconLocation } from '@/components/icons'

export function TryOnHero() {
  const t = useT()
  return (
    <section className="bg-hero-pattern relative flex min-h-[60vh] items-center overflow-hidden">
      <div className="container relative z-10 px-4 text-center">
        <Reveal y={16}>
          <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">{t('tryon.eyebrow')}</span>
        </Reveal>
        <Reveal y={20} delay={0.06}>
          <h1 className="mt-4 font-headline text-4xl text-foreground md:text-6xl">{t('tryon.title')}</h1>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{t('tryon.subtitle')}</p>
        </Reveal>
      </div>
    </section>
  )
}

export function TryOnHonest() {
  const t = useT()
  return (
    <Section className="bg-card/30">
      <Container className="grid gap-10 md:grid-cols-2">
        <Reveal>
          <SectionHeading align="left" eyebrow={t('tryon.honestEyebrow')} title={t('tryon.honestTitle')} />
          <p className="mt-5 leading-relaxed text-muted-foreground">{t('tryon.honestBody')}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="surface-card rounded-xl p-6">
            <h3 className="font-headline text-lg text-foreground">{t('tryon.tipsTitle')}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>· {t('tryon.tip1')}</li>
              <li>· {t('tryon.tip2')}</li>
              <li>· {t('tryon.tip3')}</li>
              <li>· {t('tryon.tip4')}</li>
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

export function TryOnRealCta() {
  const t = useT()
  return (
    <Section>
      <Container className="max-w-2xl text-center">
        <Reveal>
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary">
            <IconLocation className="h-8 w-8" />
          </span>
          <h2 className="mt-6 font-headline text-3xl text-foreground md:text-4xl">{t('tryon.realTitle')}</h2>
          <p className="mt-3 text-muted-foreground">{t('tryon.realDesc')}</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="px-8"><Link href="/contact">{t('cta.bookVisit')}</Link></Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="/collections">{t('cta.browseCollection')}</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

const TRUST_KEYS = [
  { Icon: IconPurity, titleKey: 'tryon.trust1Title' as const, bodyKey: 'tryon.trust1Body' as const },
  { Icon: IconCertificate, titleKey: 'tryon.trust2Title' as const, bodyKey: 'tryon.trust2Body' as const },
  { Icon: IconLocation, titleKey: 'tryon.trust3Title' as const, bodyKey: 'tryon.trust3Body' as const },
]

export function TryOnTrust() {
  const t = useT()
  return (
    <div className="border-y border-border bg-card/30">
      <Container className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-3">
        {TRUST_KEYS.map(({ Icon, titleKey, bodyKey }) => (
          <div key={titleKey} className="flex items-start gap-3">
            <span className="text-primary"><Icon className="h-6 w-6" /></span>
            <div>
              <p className="font-medium text-foreground">{t(titleKey)}</p>
              <p className="text-sm text-muted-foreground">{t(bodyKey)}</p>
            </div>
          </div>
        ))}
      </Container>
    </div>
  )
}

export function TryOnComposerHeading() {
  const t = useT()
  return (
    <SectionHeading
      eyebrow={t('tryon.composerEyebrow')}
      title={t('tryon.composerTitle')}
      subtitle={t('tryon.composerSub')}
    />
  )
}
