
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedCarousel } from "@/components/products/FeaturedCarousel";
import { featuredProducts } from "@/lib/placeholder-data";
import { Diamond } from "lucide-react";
import ClientHeroSection from "../components/ClientHeroSection";
import GoldbarVideo from "../components/GoldbarVideo";

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
      <ClientHeroSection />

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
            <div className="rounded-lg overflow-hidden shadow-2xl transform hover:scale-100 transition-transform duration-500 animate-fade-in-up flex items-center justify-center bg-black p-4" style={{aspectRatio: '6/7', minHeight: '400px'}}>
              <GoldbarVideo />
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">A Legacy of Pure Brilliance</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our story began in the vibrant heart of Multan’s Sarafa Bazar, where my father, at just 17, started his journey by selling gold nose pins. With unwavering dedication, he transformed a humble stall into a name trusted by generations. His hands shaped not just gold, but a legacy of honesty, artistry, and family pride.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Today, Al-Wahab Jewellers stands as a symbol of Pakistani tradition and excellence. We blend the timeless skills of our forefathers with modern design, offering jewellery that celebrates every milestone of your life. Every piece is a promise: pure gold, genuine gemstones, and the spirit of Multan’s golden bazars.
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
           <div className="max-w-3xl mx-auto flex flex-col items-center">
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
