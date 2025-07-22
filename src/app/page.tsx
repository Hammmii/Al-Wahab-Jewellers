
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/products/FeaturedCarousel";
import { featuredProducts } from "@/lib/placeholder-data";
import { Diamond } from "lucide-react";

const Logo = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="h-12 w-12 text-primary"
      fill="currentColor"
    >
      <path
        d="M50,2.5L78.5,21.5L97.5,50L78.5,78.5L50,97.5L21.5,78.5L2.5,50L21.5,21.5L50,2.5Z"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        fill="transparent"
      />
      <text x="28" y="62" fontFamily="serif" fontSize="38" fill="hsl(var(--primary))">AW</text>
    </svg>
)

const BrandLogo = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
    <p className="text-2xl font-bold font-headline text-muted-foreground">{name}</p>
  </div>
);


export default function Home() {
  return (
    <div className="flex flex-col bg-hero-pattern">
      <section className="relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center text-center text-white overflow-hidden sparkle-bg">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <Image
          src="https://storage.googleapis.com/aif-stg-testing-public-file-upload/users/20133658/1721758414451-image.jpeg"
          alt="Hero background"
          fill
          style={{objectFit: "cover"}}
          className="z-0 scale-110 blur-sm"
          data-ai-hint="gold necklace"
          priority
        />
        <div className="z-20 relative max-w-5xl p-4 flex flex-col items-center animate-fade-in-up">
          <h1 className="font-urdu text-7xl md:text-8xl lg:text-9xl font-bold text-gold-shimmer">
            الوہاب جیولرز
          </h1>
          <p className="mt-4 font-headline text-2xl md:text-3xl text-stone-300/90 tracking-wider">Al-Wahab Jewellers</p>
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

      <section className="py-16 md:py-24">
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
      
      <section className="py-16 md:py-24 bg-card/50">
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

      <section className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4 animate-fade-in-up">As Featured In</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{animationDelay: '200ms'}}>
            Recognized for our commitment to excellence and design innovation.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center animate-fade-in-up" style={{animationDelay: '400ms'}}>
            <BrandLogo name="VOGUE" />
            <BrandLogo name="Forbes" />
            <BrandLogo name="HELLO!" />
            <BrandLogo name="BRIDES" />
          </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-card/50">
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
