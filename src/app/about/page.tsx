import Image from "next/image";
import { Gem, Target, Eye } from "lucide-react";

export const metadata = {
  title: "About Us - Al-Wahab Jewellers",
  description: "Learn about the legacy, mission, and vision of Al-Wahab Jewellers, a name synonymous with trust and craftsmanship in gold jewellery.",
};

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="relative py-24 md:py-32 bg-card sparkle-bg">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src="https://placehold.co/1920x800"
          alt="Al-Wahab Jewellers workshop"
          fill
          objectFit="cover"
          className="z-0"
          data-ai-hint="goldsmith workshop"
        />
        <div className="container mx-auto px-4 relative z-20 text-center text-white">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-gold-shimmer">A Legacy Forged in Gold</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-stone-300">
            For over three generations, Al-Wahab Jewellers has been a hallmark of purity, artistry, and trust in the heart of Pakistan's cultural capital, Lahore.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Our Story: The Goldsmith's Heritage</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Founded by the visionary artisan, Sheikh Abdul Wahab, our journey began in the bustling lanes of old Lahore. With a passion for perfection and an unwavering commitment to quality, he laid the foundation for a legacy that would be cherished for generations.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Today, we carry forward that torch of excellence. We blend time-honored, traditional techniques passed down through our family with contemporary designs to create jewellery that is not just an accessory, but a work of art. Each piece from Al-Wahab Jewellers is a testament to our rich heritage and a promise of everlasting beauty.
              </p>
            </div>
             <div className="rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-fade-in-up" style={{animationDelay: '200ms'}}>
              <Image 
                src="https://placehold.co/600x700"
                alt="Founder of Al-Wahab Jewellers"
                width={600}
                height={700}
                className="w-full h-auto"
                data-ai-hint="portrait wise old man"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Our Philosophy</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Our principles are as pure as the gold we craft.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-border/40 rounded-lg animate-fade-in-up" style={{animationDelay: '200ms'}}>
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Gem className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-semibold text-primary">Our Mission</h3>
              <p className="mt-2 text-muted-foreground">
                To craft exquisite jewellery that becomes a part of our customers' most cherished moments, upholding the highest standards of purity, design, and customer service.
              </p>
            </div>
            <div className="p-8 border border-border/40 rounded-lg animate-fade-in-up" style={{animationDelay: '400ms'}}>
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-semibold text-primary">Our Vision</h3>
              <p className="mt-2 text-muted-foreground">
                To be Pakistan's most trusted and sought-after name in gold jewellery, celebrated for our innovative designs, traditional craftsmanship, and unwavering integrity.
              </p>
            </div>
            <div className="p-8 border border-border/40 rounded-lg animate-fade-in-up" style={{animationDelay: '600ms'}}>
              <div className="p-4 bg-primary/10 rounded-full inline-block mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-semibold text-primary">Our Promise</h3>
              <p className="mt-2 text-muted-foreground">
                We guarantee the purity of our gold and the authenticity of our gemstones. Every piece is a commitment to quality that you can trust for a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
