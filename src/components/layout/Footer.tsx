
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
