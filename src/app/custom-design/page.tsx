import type { Metadata } from 'next'
import Link from 'next/link'
import { Container, Section, SectionHeading } from '@/components/common'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal'
import { BriefWizard } from '@/components/custom-design/brief-wizard'
import GoldRateDisplay from '@/components/GoldRateDisplay'

export const metadata: Metadata = {
  title: 'Bespoke — Custom Gold Design',
  description:
    'Commission a one-of-a-kind piece of gold jewellery, made by hand to your vision by our craftsmen in Multan’s Sarafa Bazar.',
}

const PROMISES = [
  { stat: 'Hand-made', label: 'Never mass-produced' },
  { stat: '4–8 weeks', label: 'From sketch to delivery' },
  { stat: 'Approved', label: 'By you at every stage' },
]

const STEPS = [
  { n: '01', title: 'Brief & Consultation', body: 'You share your vision; we listen, advise, and refine the idea together.' },
  { n: '02', title: 'Design Sketch / CAD', body: 'We create a drawing or 3D model for your approval before anything is made.' },
  { n: '03', title: 'Wax Model & Final Quote', body: 'A wax preview and a transparent, final price — both approved by you.' },
  { n: '04', title: 'Hand-crafting', body: 'Our goldsmiths cast, finish, and set stones entirely by hand.' },
  { n: '05', title: 'Delivery / Collection', body: 'Collect it from our showroom, or have it delivered to your door.' },
]

const FAQ = [
  { q: 'How is the price decided?', a: 'Transparently: today’s Multan gold rate × weight + making charges + any stones. You approve the final quote at the wax stage before any metal is poured.' },
  { q: 'Can I use my own gold or stones?', a: 'Yes. You can exchange old jewellery toward your piece, or set stones you already own. We’ll weigh and value them honestly.' },
  { q: 'Is there an advance?', a: 'Typically a 25–30% advance to begin, with the balance on delivery. It’s fully refundable up to the wax approval stage.' },
  { q: 'Is my design confidential?', a: 'Always. Your design is yours — we will not reproduce it for anyone else.' },
]

export default function CustomDesignPage() {
  return (
    <>
      {/* Cinematic hero — no form */}
      <section className="bg-hero-pattern relative flex min-h-[70vh] items-center overflow-hidden">
        <div className="container relative z-10 px-4 text-center">
          <Reveal y={16}>
            <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">Bespoke Atelier</span>
          </Reveal>
          <Reveal y={20} delay={0.06}>
            <h1 className="mt-4 font-headline text-4xl text-foreground md:text-6xl">
              Bring us your vision.<br />We&rsquo;ll cast it in gold.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <a
              href="#brief"
              className="gold-sweep mt-9 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              Begin your commission
            </a>
          </Reveal>
        </div>
      </section>

      {/* Promise strip */}
      <div className="border-y border-border bg-card/30">
        <Container className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-3">
          {PROMISES.map((p) => (
            <div key={p.label} className="text-center">
              <p className="font-headline text-2xl text-primary">{p.stat}</p>
              <p className="text-sm text-muted-foreground">{p.label}</p>
            </div>
          ))}
        </Container>
      </div>

      {/* Process */}
      <Section>
        <SectionHeading eyebrow="How it works" title="The commission" subtitle="Five stages, each with your approval. Nothing is poured in gold until you say yes." />
        <Stagger className="mt-12 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <div className="surface-card lift h-full rounded-xl p-6">
                <span className="font-headline text-3xl text-primary/70">{s.n}</span>
                <h3 className="mt-3 font-medium text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Pricing honesty */}
      <Section className="bg-card/30">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <Reveal>
              <SectionHeading align="left" eyebrow="Transparent pricing" title="No hidden kapaat" />
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Final price = today&rsquo;s Multan gold rate × weight + making charges + any stones. You see and
                approve the full quote at the wax stage — before any metal is poured.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>· Live, daily Multan gold rates (shown below)</li>
                <li>· Honest weight, hallmarked to standard</li>
                <li>· Making charges stated plainly, up front</li>
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="surface-card rounded-xl p-6">
                <GoldRateDisplay variant="default" />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Brief wizard */}
      <Section id="brief">
        <Container>
          <SectionHeading eyebrow="Your brief" title="Tell us what you envision" subtitle="A few quick steps. Save anytime — your draft stays put." />
          <div className="mt-12">
            <BriefWizard />
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-card/30">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Good to know" title="Questions" />
          <div className="mt-10 space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="surface-card group rounded-xl p-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                  {item.q}
                  <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Prefer to talk?{' '}
            <Link href="/contact" className="link-underline text-primary">Book a consultation</Link>.
          </p>
        </Container>
      </Section>
    </>
  )
}
