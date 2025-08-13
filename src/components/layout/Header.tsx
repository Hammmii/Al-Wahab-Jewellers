
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
  { href: "/virtual-try-on", label: "Virtual Try-On" },
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
        d="M50,2.5L78.5,21.5L97.5,50L78.5,78.5L50,97.5L21.5,78.5L2.5,50L21.5,21.5L50,2.5Z"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        fill="transparent"
      />
      <text x="28" y="62" fontFamily="serif" fontSize="38" fill="hsl(var(--primary))">AW</text>
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
          <span className="font-urdu text-3xl text-gold-shimmer ml-2" style={{lineHeight: '1.2', overflow: 'visible'}}>
            الوَہاب جیولرز
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
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                   <Link href="/" className="flex items-center space-x-2" onClick={() => setIsSheetOpen(false)}>
                    <Logo />
                    <span className="font-bold font-headline text-2xl text-primary">Al-Wahab</span>
                    <span className="font-urdu text-3xl text-gold-shimmer ml-2" style={{lineHeight: '1.2', overflow: 'visible'}}>
                      الوَہاب جیولرز
                    </span>
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
