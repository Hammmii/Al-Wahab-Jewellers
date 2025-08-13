"use client";
import GoldParticles from "./GoldParticles";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoldRateDisplay from "./GoldRateDisplay";

export default function ClientHeroSection() {
  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] w-full flex flex-col items-center justify-center text-center text-white overflow-visible sparkle-bg">
      <GoldParticles />
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="z-20 relative max-w-5xl p-4 flex flex-col items-center animate-fade-in-up" style={{flex: 1, justifyContent: 'center'}}>
        <h1
          className="font-urdu text-gold-shimmer w-full px-4 py-8 break-words text-center"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 6rem)',
            lineHeight: 1.2,
            overflow: 'visible',
            whiteSpace: 'normal',
            marginBottom: '0.2em',
            marginTop: '0.5em',
            textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
          }}
        >
          الوَہاب جیولرز
        </h1>
        <div className="mt-4 space-y-4">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary">Finest Gold Jewellery Since 1985</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">Crafting timeless treasures with unmatched quality and artistry</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/collections">Explore Collections</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/custom-design">Create Custom Design</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}