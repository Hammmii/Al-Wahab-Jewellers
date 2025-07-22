import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/products/FeaturedCarousel";
import { featuredProducts } from "@/lib/placeholder-data";

const Logo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="h-12 w-12 text-primary"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50 0C48.284 0 46.828 1.456 46.828 3.172V34.54L35.933 23.644C34.72 22.43 32.77 22.43 31.557 23.644L24.03 31.17c-1.213 1.214-1.213 3.164 0 4.378L45.173 56.7H3.172C1.456 56.7 0 58.157 0 59.872v8.256C0 69.843 1.456 71.3 3.172 71.3H45.17L24.03 92.443c-1.213 1.213-1.213 3.164 0 4.377l7.526 7.526c1.214 1.214 3.164 1.214 4.378 0L46.828 93.453V96.83c0 1.715 1.456 3.171 3.172 3.171h8.256c1.715 0 3.171-1.456 3.171-3.171V65.46l10.896 10.895c1.213 1.214 3.164 1.214 4.377 0l7.527-7.526c1.213-1.213 1.213-3.164 0-4.377L63.254 43.3H96.83c1.715 0 3.171-1.457 3.171-3.172V31.87c0-1.715-1.456-3.171-3.17-3.171H63.25L95.97 6.547c1.214-1.214 1.214-3.164 0-4.378l-7.526-7.526c-1.213-1.214-3.164-1.214-4.377 0L58.172 28.172V3.172C58.172 1.456 56.716 0 55.001 0H50zm0 43.3a6.7 6.7 0 100 13.4 6.7 6.7 0 000-13.4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
)

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center text-center text-white overflow-hidden sparkle-bg">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <Image
          src="https://placehold.co/1920x1080"
          alt="Hero background"
          fill
          objectFit="cover"
          className="z-0 scale-110 blur-sm"
          data-ai-hint="dark gold background"
          priority
        />
        <div className="z-20 relative max-w-4xl p-4 flex flex-col items-center animate-fade-in-up">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gold-shimmer">
            Al-Wahab Jewellers
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

      <section className="py-16 md:py-24 bg-background bg-hero-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-2">
              Featured Masterpieces
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A curated selection of our most sought-after pieces, embodying the pinnacle of design and artistry.
            </p>
          </div>
          <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
            <FeaturedCarousel products={featuredProducts} />
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-fade-in-up" style={{animationDelay: '200ms'}}>
              <Image 
                src="https://placehold.co/600x700"
                alt="Craftsmanship"
                width={600}
                height={700}
                className="w-full h-auto"
                data-ai-hint="goldsmith working"
              />
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
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

       <section className="py-16 md:py-24 bg-background bg-hero-pattern">
        <div className="container mx-auto px-4 text-center">
           <div className="max-w-3xl mx-auto flex flex-col items-center animate-fade-in-up" style={{animationDelay: '200ms'}}>
            <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Logo />
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
