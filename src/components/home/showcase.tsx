'use client'

import Image from 'next/image'
import { Reveal } from '@/components/motion/reveal'

/**
 * Premium cinematic showcase section using the showcase.jpg image.
 * Full-bleed image with a subtle parallax zoom on scroll, overlaid
 * with a gold-accented brand statement. Feels like a Cartier editorial.
 */
export function Showcase() {
  return (
    <section className="relative overflow-hidden border-y border-border">
      {/* Full-bleed image with slow zoom */}
      <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
        <Image
          src="/showcase.jpg"
          alt="Al-Wahab Jewellers — handcrafted gold"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-[3000ms] ease-out hover:scale-105"
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
      </div>

      {/* Overlay content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container px-4">
          <div className="max-w-xl">
            <Reveal y={20}>
              <span className="text-xs font-medium uppercase tracking-luxury text-primary/90">
                Al-Wahab Jewellers
              </span>
            </Reveal>
            <Reveal y={24} delay={0.08}>
              <h2 className="mt-3 font-headline text-3xl leading-tight text-foreground drop-shadow-lg md:text-5xl lg:text-6xl">
                Gold that tells<br />your story
              </h2>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-md text-base text-muted-foreground drop-shadow md:text-lg">
                Handcrafted in Multan&rsquo;s Sarafa Bazar, each piece carries generations
                of skill and the weight of pure gold.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <span className="gold-rule mt-8 block w-24" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
