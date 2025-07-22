import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";

const Logo = () => (
     <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="h-8 w-8 text-primary"
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

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo />
              <span className="font-bold font-headline text-3xl text-primary">
                Al-Wahab
              </span>
            </Link>
            <p className="text-muted-foreground text-center md:text-left text-sm">
              Crafting timeless treasures for generations.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/collections" className="text-muted-foreground hover:text-primary transition-colors">Collections</Link></li>
              <li><Link href="/custom-design" className="text-muted-foreground hover:text-primary transition-colors">Create Your Design</Link></li>
              <li><Link href="/virtual-try-on" className="text-muted-foreground hover:text-primary transition-colors">Virtual Try-On</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary mb-4">Contact Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>123 Gold Street, Lahore, Pakistan</li>
              <li>+92 300 1234567</li>
              <li>contact@alwahabjewellers.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold text-primary mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Al-Wahab Jewellers. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
