import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container, Section, SectionHeading } from '@/components/common'
import { Reveal } from '@/components/motion/reveal'
import GoldbarVideo from '@/components/GoldbarVideo'
import { Hero } from '@/components/home/hero'
import { HeroActions } from '@/components/home/hero-actions'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CategoryCard, type CategoryIconKey } from '@/components/home/category-card'
import { CategoriesHeading } from '@/components/home/categories-copy'
import {
  IconCertificate,
  IconGift,
  IconLocation,
  IconPurity,
  IconShipping,
} from '@/components/icons'

const CATEGORIES: { slug: string; nameKey: 'cat.rings'|'cat.necklaces'|'cat.bracelets'|'cat.earrings'; descKey: 'cat.ringsDesc'|'cat.necklacesDesc'|'cat.braceletsDesc'|'cat.earringsDesc'; icon: CategoryIconKey }[] = [
  { slug: 'rings', nameKey: 'cat.rings', descKey: 'cat.ringsDesc', icon: 'rings' },
  { slug: 'necklaces', nameKey: 'cat.necklaces', descKey: 'cat.necklacesDesc', icon: 'necklaces' },
  { slug: 'bracelets', nameKey: 'cat.bracelets', descKey: 'cat.braceletsDesc', icon: 'bracelets' },
  { slug: 'earrings', nameKey: 'cat.earrings', descKey: 'cat.earringsDesc', icon: 'earrings' },
]

const PROMISES = [
  { Icon: IconPurity, title: 'Pure Gold', body: 'Genuine gold, weighed and stamped to standard.' },
  { Icon: IconCertificate, title: 'Certificate Included', body: 'Every piece comes with a certificate of authenticity.' },
  { Icon: IconShipping, title: 'COD & Bank Transfer', body: 'Pay cash on delivery or by bank transfer.' },
  { Icon: IconGift, title: 'Custom Design', body: 'Get a one of a kind piece made just for you.' },
]

export default function Home() {
  return (
    <>
      <Hero />

      {/* CTAs, live gold rate, and core trust facts (kept together, not floating) */}
      <HeroActions />

      <FeaturedProducts />

      {/* Shop by category */}
      <Section className="bg-card/30">
        <CategoriesHeading />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {CATEGORIES.map(({ slug, nameKey, descKey, icon }) => (
            <Reveal key={slug}>
              <CategoryCard
                href={`/collections?category=${slug}`}
                nameKey={nameKey}
                descKey={descKey}
                icon={icon}
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Heritage */}
      <Section>
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
            <SectionHeading align="left" eyebrow="Our Story" title="A Family of Goldsmiths" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Al-Wahab Jewellers is a family shop in Multan&apos;s{' '}
                <strong className="text-foreground">Sarafa Bazar (Shop 2)</strong>, the gold market
                where fine craftsmanship has been passed down for generations.
              </p>
              <p>
                We use only genuine gold. Every piece is weighed, stamped, and finished by hand. Our
                promise is simple: honest metal, honest weight, and work that lasts a lifetime.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-8 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/about">Read our story</Link>
            </Button>
          </Reveal>
        </div>
      </Section>

      {/* The promise */}
      <Section className="bg-card/30">
        <SectionHeading eyebrow="The Promise" title="Why choose Al-Wahab" />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {PROMISES.map(({ Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="surface-card lift edge-glow flex h-full flex-col gap-3 rounded-xl p-5 md:p-6">
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

      {/* Bespoke CTA */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-background px-6 py-12 text-center md:px-12 md:py-14">
            <span className="gold-rule mx-auto mb-8 block w-24" />
            <h2 className="font-headline text-2xl text-foreground md:text-4xl">
              Make something one of a kind
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Share your idea with us. We will craft a piece that is entirely yours.
            </p>
            <Button asChild size="lg" className="gold-sweep mt-8">
              <Link href="/custom-design">Start a Custom Design</Link>
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* Showroom CTA */}
      <Section className="bg-card/30">
        <Container className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary md:h-16 md:w-16">
            <IconLocation className="h-7 w-7 md:h-8 md:w-8" />
          </span>
          <h2 className="mt-5 font-headline text-2xl text-foreground md:text-4xl">Visit Our Showroom</h2>
          <p className="mt-3 text-muted-foreground">Sarafa Bazar, Shop 2, Multan, Pakistan</p>
          <Button asChild size="lg" className="mt-7">
            <Link href="/contact">Get Directions and Contact</Link>
          </Button>
        </Container>
      </Section>
    </>
  )
}
