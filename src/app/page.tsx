import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/products/FeaturedCarousel";
import { featuredProducts } from "@/lib/placeholder-data";
import { Gem } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <Image
          src="https://placehold.co/1920x1080"
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          className="z-0 scale-110 blur-sm"
          data-ai-hint="dark gold background"
        />
        <div className="z-20 relative max-w-4xl p-4 flex flex-col items-center animate-fade-in-up">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="text-gold-shimmer">Al-Wahab Jewellers</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-stone-300">
            A Legacy of Purity, A Tradition of Trust. Discover exquisite craftsmanship and breathtaking designs curated for moments that matter.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-transform transform hover:scale-105">
              <Link href="/collections">Explore Collections</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary font-bold transition-transform transform hover:scale-105">
              <Link href="/contact">Visit Our Store</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-headline text-3xl md:text-4xl font-bold text-primary mb-2">
            Featured Masterpieces
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            A curated selection of our most sought-after pieces, embodying the pinnacle of design and artistry.
          </p>
          <FeaturedCarousel products={featuredProducts} />
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <Image 
                src="https://placehold.co/600x700"
                alt="Craftsmanship"
                width={600}
                height={700}
                className="w-full h-auto"
                data-ai-hint="goldsmith working"
              />
            </div>
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">A Legacy of Pure Brilliance</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                For generations, Al-Wahab Jewellers has been synonymous with trust and quality. We inherit a legacy of master goldsmiths from the heart of Pakistan, blending traditional techniques with contemporary aesthetics. Each piece is not just jewellery; it's a piece of art, a story waiting to be told.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                We are committed to providing our clients with gold of the highest purity and gemstones of exceptional quality, ensuring that every creation is a treasure to be cherished forever.
              </p>
            </div>
          </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
           <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Gem className="h-12 w-12 text-primary" />
            </div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mt-4">
              Visit Our Showroom
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the luxury and elegance of Al-Wahab Jewellers in person. Our experts are ready to assist you in finding the perfect piece for your special occasion.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-transform transform hover:scale-105">
              <Link href="/contact">
                Get Directions
              </Link>
            </Button>
           </div>
        </div>
      </section>

    </div>
  );
}
