'use client'

import { Container, Section, SectionHeading } from '@/components/common'
import { Reveal } from '@/components/motion/reveal'
import { useT } from '@/lib/i18n/language-context'
import { siteConfig } from '@/lib/site'
import { digitsOnly, formatPhoneDisplay } from '@/lib/format'
import { IconCertificate, IconPurity, IconGift, IconLocation } from '@/components/icons'

export function AboutHero() {
  const t = useT()
  return (
    <Section className="bg-hero-pattern text-center">
      <Reveal>
        <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">{t('about.eyebrow')}</span>
        <h1 className="mt-3 font-headline text-4xl text-foreground md:text-6xl">{t('about.title')}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{t('about.intro')}</p>
      </Reveal>
    </Section>
  )
}

export function AboutStory() {
  const t = useT()
  return (
    <Section>
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <Reveal>
          <SectionHeading align="left" eyebrow={t('about.storyEyebrow')} title={t('about.storyTitle')} />
          <p className="mt-6 leading-relaxed text-muted-foreground">{t('about.storyP1')}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="surface-card rounded-2xl p-8 md:p-10">
            <span className="font-urdu text-4xl text-gold-shimmer">الوَہاب جیولرز</span>
            <p className="mt-4 font-headline text-2xl text-foreground">Al-Wahab Jewellers</p>
            <p className="mt-1 text-muted-foreground">{siteConfig.address.street}, {siteConfig.address.city}</p>
            <div className="mt-6 space-y-1 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">Led by</p>
              <p className="font-headline text-lg text-foreground">{siteConfig.owner.name}</p>
              <p className="text-sm text-muted-foreground">{siteConfig.owner.experience} in gold jewellery</p>
              <div className="mt-3 space-y-1">
                {siteConfig.contacts.map((contact) => (
                  <p key={contact.phone} className="text-sm">
                    <a href={`tel:+${digitsOnly(contact.phone)}`} className="text-primary hover:underline">
                      {formatPhoneDisplay(contact.phone)}
                    </a>
                    <span className="ml-1 text-xs text-muted-foreground">{contact.name}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

const VALUE_KEYS = [
  { Icon: IconPurity, titleKey: 'about.v1Title' as const, bodyKey: 'about.v1Body' as const },
  { Icon: IconCertificate, titleKey: 'about.v2Title' as const, bodyKey: 'about.v2Body' as const },
  { Icon: IconGift, titleKey: 'about.v3Title' as const, bodyKey: 'about.v3Body' as const },
  { Icon: IconLocation, titleKey: 'about.v4Title' as const, bodyKey: 'about.v4Body' as const },
]

export function AboutValues() {
  const t = useT()
  return (
    <Section className="bg-card/30">
      <SectionHeading eyebrow={t('about.valuesEyebrow')} title={t('about.valuesTitle')} />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_KEYS.map(({ Icon, titleKey, bodyKey }, i) => (
          <Reveal key={titleKey} delay={i * 0.05}>
            <div className="surface-card lift edge-glow flex h-full flex-col gap-4 rounded-xl p-6">
              <span className="text-primary"><Icon className="h-8 w-8" /></span>
              <h3 className="font-headline text-lg text-foreground">{t(titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(bodyKey)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
