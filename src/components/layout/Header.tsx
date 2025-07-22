
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/collections", label: "Collections" },
  { href: "/custom-design", label: "Create Your Design" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

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

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
          <span className="font-bold font-headline text-2xl text-primary">
            Al-Wahab
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                   <Link href="/" className="flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                    <Logo />
                    <span className="font-bold font-headline text-2xl text-primary">Al-Wahab</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4 p-4 mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
