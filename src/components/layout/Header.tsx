'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useCartCount, useWishlistCount } from '@/lib/stores/use-hydrated-safe'
import { useT } from '@/lib/i18n/language-context'
import { LanguageToggle } from '@/components/i18n/language-toggle'
import {
  IconCart,
  IconHeart,
  IconSearch,
} from '@/components/icons'

// Local inline icons for menu open/close (kept minimal, on-brand line style).
const MenuIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" className={cn('icon h-6 w-6', className)}>
    <path d="M4 7 H20 M4 12 H20 M4 17 H20" />
  </svg>
)
const CloseIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" className={cn('icon h-5 w-5', className)}>
    <path d="M6 6 L18 18 M18 6 L6 18" />
  </svg>
)

const navLinks = [
  { href: '/', labelKey: 'nav.home' as const },
  { href: '/collections', labelKey: 'nav.collections' as const },
  { href: '/custom-design', labelKey: 'nav.customDesign' as const },
  { href: '/virtual-try-on', labelKey: 'nav.tryOn' as const },
  { href: '/about', labelKey: 'nav.about' as const },
  { href: '/contact', labelKey: 'nav.contact' as const },
]

const BrandMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
    <path
      d="M50,2.5 L78.5,21.5 L97.5,50 L78.5,78.5 L50,97.5 L21.5,78.5 L2.5,50 L21.5,21.5 Z"
      stroke="hsl(var(--primary))"
      strokeWidth="2.5"
    />
    <path d="M50,2.5 L50,97.5 M2.5,50 L97.5,50" stroke="hsl(var(--primary))" strokeWidth="1.25" opacity="0.5" />
    <text x="50" y="60" textAnchor="middle" fontFamily="var(--font-headline), serif" fontSize="34" fill="hsl(var(--primary))">
      AW
    </text>
  </svg>
)

function BrandLockup() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <BrandMark className="h-9 w-9" />
      <span className="font-headline text-xl font-semibold tracking-tight text-primary">
        Al-Wahab
      </span>
      <span className="font-urdu text-2xl text-gold-shimmer">الوَہاب جیولرز</span>
    </Link>
  )
}

/** Small circular count badge for cart/wishlist. */
function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()
  const t = useT()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <BrandLockup />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <LanguageToggle className="hidden sm:inline-flex" />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-primary"
          >
            <Link href="/collections" aria-label="Search collections">
              <IconSearch className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-primary"
          >
            <Link href="/wishlist" aria-label="Wishlist">
              <IconHeart className="h-5 w-5" />
              <CountBadge count={wishlistCount} />
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-primary"
          >
            <Link href="/cart" aria-label="Cart">
              <IconCart className="h-5 w-5" />
              <CountBadge count={cartCount} />
            </Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary lg:hidden"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-border bg-card p-0 sm:w-[380px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <BrandLockup />
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                    <CloseIcon />
                  </Button>
                </div>
                <nav className="mt-4 flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'rounded-md px-3 py-3 text-lg font-medium transition-colors hover:bg-secondary hover:text-primary',
                        pathname === link.href ? 'text-primary' : 'text-foreground',
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-border p-4">
                  <LanguageToggle className="w-full justify-center" />
                </div>
                <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border p-4">
                  <Button asChild variant="outline" onClick={() => setOpen(false)}>
                    <Link href="/wishlist" className="flex items-center justify-center gap-2">
                      <IconHeart className="h-5 w-5" /> {t('nav.wishlist')}
                    </Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/cart" className="flex items-center justify-center gap-2">
                      <IconCart className="h-5 w-5" /> Cart
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
