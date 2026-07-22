'use client'

import { Reveal } from '@/components/motion/reveal'
import GoldParticles from '@/components/GoldParticles'

export function Hero() {
  return (
    <section className="bg-hero-pattern relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      <GoldParticles />
      <div className="container relative z-10 px-4 text-center">
        <Reveal y={16}>
          <p className="font-urdu text-5xl text-gold-shimmer md:text-7xl lg:text-8xl">
            الوَہاب جیولرز
          </p>
        </Reveal>

        <Reveal y={20} delay={0.08}>
          <h1 className="font-headline text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Al-Wahab Jewellers
          </h1>
        </Reveal>

        <Reveal delay={0.18}>
          <span className="gold-rule mx-auto mt-8 block w-24" />
        </Reveal>
      </div>
    </section>
  )
}
