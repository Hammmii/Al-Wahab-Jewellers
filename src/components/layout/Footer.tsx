'use client'

import Link from 'next/link'
import { Container } from '@/components/common'
import { IconLocation } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'
import { siteConfig } from '@/lib/site'
import type { TKey } from '@/lib/i18n/translations'

const NAV: { href: string; labelKey: TKey }[] = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/collections', labelKey: 'nav.collections' },
  { href: '/custom-design', labelKey: 'nav.customDesign' },
  { href: '/virtual-try-on', labelKey: 'nav.tryOn' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/contact', labelKey: 'nav.contact' },
]

export function Footer() {
  const t = useT()
  const phone = siteConfig.phone
  const phoneDisplay = phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')

  return (
    <footer className="border-t border-border bg-card/40">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark className="h-9 w-9" />
              <span className="font-headline text-xl font-semibold text-primary">Al-Wahab</span>
              <span className="font-urdu text-2xl text-gold-shimmer">الوَہاب جیولرز</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-headline text-sm uppercase tracking-luxury text-primary/80">{t('footer.explore')}</h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h3 className="font-headline text-sm uppercase tracking-luxury text-primary/80">{t('footer.visit')}</h3>
            <div className="mt-4 flex items-start gap-3 text-sm text-muted-foreground">
              <IconLocation className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p>{siteConfig.address.street}</p>
                <p>{siteConfig.address.city}, {siteConfig.address.country}</p>
                <p className="mt-2">
                  <a href={`tel:+92${phone.slice(1)}`} className="text-primary hover:underline">
                    {phoneDisplay}
                  </a>
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground/70">
              {t('footer.enquire')}{' '}
              <Link href="/contact" className="underline hover:text-primary">{t('nav.contact')}</Link>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Al-Wahab Jewellers. {t('footer.rights')}</p>
          <Link href="/admin/login" className="text-muted-foreground/50 underline-offset-2 hover:text-primary hover:underline">
            {t('admin.portal')}
          </Link>
        </div>
      </Container>
    </footer>
  )
}

function BrandMark({ className }: { className?: string }) {
  return (
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
}
