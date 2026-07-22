import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container, Section, SectionHeading } from '@/components/common'
import { Reveal } from '@/components/motion/reveal'
import { PreviewComposer } from '@/components/try-on/preview-composer'
import { IconLocation, IconPurity, IconCertificate } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Preview Studio — Virtual Try-On',
  description:
    'Preview how a ring, necklace, bracelet, or earrings might look. An honest visualisation tool — and a real try-on in our Multan showroom.',
}

const TRUST = [
  { Icon: IconPurity, title: 'An approximation', body: 'The photo preview is a guide to scale and style, not a final fit. We’ll always say so.' },
  { Icon: IconCertificate, title: 'Private by design', body: 'Your photo is processed on your device and never uploaded anywhere.' },
  { Icon: IconLocation, title: 'Try on for real', body: 'Nothing beats seeing gold in person. Visit our Sarafa Bazar showroom to try pieces on.' },
]

export default function VirtualTryOnPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-pattern relative flex min-h-[60vh] items-center overflow-hidden">
        <div className="container relative z-10 px-4 text-center">
          <Reveal y={16}>
            <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">Preview Studio</span>
          </Reveal>
          <Reveal y={20} delay={0.06}>
            <h1 className="mt-4 font-headline text-4xl text-foreground md:text-6xl">See it before it&rsquo;s yours</h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Upload a photo and place a piece on it to gauge scale and style — an honest preview to help
              you imagine it, not a flawless AI try-on.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Honest trust strip */}
      <div className="border-y border-border bg-card/30">
        <Container className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-3">
          {TRUST.map(({ Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-primary"><Icon className="h-6 w-6" /></span>
              <div>
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      {/* The composer (Mode B: honest photo preview) */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Photo preview"
            title="Place a piece on your photo"
            subtitle="Upload a photo of your hand, wrist, or neck. Drag and resize the piece to imagine how it might look."
          />
          <div className="mt-12">
            <PreviewComposer />
          </div>
        </Container>
      </Section>

      {/* Honesty + device tips */}
      <Section className="bg-card/30">
        <Container className="grid gap-10 md:grid-cols-2">
          <Reveal>
            <SectionHeading align="left" eyebrow="How it works" title="An honest preview" />
            <p className="mt-5 leading-relaxed text-muted-foreground">
              This tool overlays a piece onto your photo so you can judge scale and style. It isn&rsquo;t a
              measurement or a final fit — lighting and angles affect the result. For the real thing,
              there&rsquo;s no substitute for our showroom.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="surface-card rounded-xl p-6">
              <h3 className="font-headline text-lg text-foreground">Tips for a better preview</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>· Take the photo in bright, even light</li>
                <li>· Photograph the body part straight-on</li>
                <li>· Best on iPhone Safari &amp; Android Chrome</li>
                <li>· Nothing is stored without your permission</li>
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Real try-on CTA */}
      <Section>
        <Container className="max-w-2xl text-center">
          <Reveal>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary">
              <IconLocation className="h-8 w-8" />
            </span>
            <h2 className="mt-6 font-headline text-3xl text-foreground md:text-4xl">Try on for real</h2>
            <p className="mt-3 text-muted-foreground">
              The best preview is the real thing. Visit us at Sarafa Bazar, Shop #2, Multan.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="gold-sweep px-8"><Link href="/contact">Book a visit</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-primary/40 text-primary hover:bg-primary/10 hover:text-primary">
                <Link href="/collections">Browse the collection</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  )
}
