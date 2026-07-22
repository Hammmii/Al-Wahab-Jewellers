import type { Metadata } from 'next'
import { Container, Section, SectionHeading } from '@/components/common'
import { Reveal } from '@/components/motion/reveal'
import { IconCertificate, IconPurity, IconLocation, IconGift } from '@/components/icons'

export const metadata: Metadata = {
  title: 'About — Al-Wahab Jewellers',
  description:
    'A family-run gold atelier in Multan’s Sarafa Bazar. Genuine gold, hand-finished jewellery, and honest craftsmanship.',
}

const VALUES = [
  {
    Icon: IconPurity,
    title: 'Honest Metal',
    body: 'Every piece is genuine gold, weighed and purity-stamped to standard — never plated, never short.',
  },
  {
    Icon: IconCertificate,
    title: 'Authenticated',
    body: 'Each purchase comes with a certificate of authenticity, so you know exactly what you’re buying.',
  },
  {
    Icon: IconGift,
    title: 'Made by Hand',
    body: 'We finish every piece by hand in our workshop, blending traditional craft with considered design.',
  },
  {
    Icon: IconLocation,
    title: 'Rooted in Multan',
    body: 'We’re proudly based in Sarafa Bazar (Shop #2), the historic heart of the city’s gold trade.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-hero-pattern text-center">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">
            Our Story
          </span>
          <h1 className="mt-3 font-headline text-4xl text-foreground md:text-6xl">
            A Family of Goldsmiths
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Al-Wahab Jewellers is a family-run atelier in Multan&rsquo;s Sarafa Bazar — where
            Pakistan&rsquo;s goldsmithing tradition has been passed down for generations.
          </p>
        </Reveal>
      </Section>

      {/* Story */}
      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <Reveal>
            <SectionHeading align="left" eyebrow="What we do" title="Gold, honestly made" />
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                We work only in genuine gold — weighing and hallmarking every piece to standard,
                and finishing each one by hand. The result is jewellery meant to be worn, loved,
                and inherited.
              </p>
              <p>
                From bridal sets to everyday bands to bespoke commissions, our promise stays the
                same: honest metal, honest weight, and workmanship that lasts.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface-card rounded-2xl p-8 md:p-10">
              <span className="font-urdu text-4xl text-gold-shimmer">الوَہاب جیولرز</span>
              <p className="mt-4 font-headline text-2xl text-foreground">Al-Wahab Jewellers</p>
              <p className="mt-1 text-muted-foreground">Sarafa Bazar, Shop #2, Multan</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Values */}
      <Section className="bg-card/30">
        <SectionHeading eyebrow="What we stand for" title="Our Promise" />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="surface-card flex h-full flex-col gap-4 rounded-xl p-6">
                <span className="text-primary">
                  <Icon className="h-8 w-8" />
                </span>
                <h3 className="font-headline text-lg text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
