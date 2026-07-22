'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n/language-context'
import type { TKey } from '@/lib/i18n/translations'
import type { ComponentType } from 'react'

interface CategoryCardProps {
  href: string
  nameKey: TKey
  descKey: TKey
  Icon: ComponentType<{ className?: string }>
  className?: string
}

/**
 * Premium, reusable category card.
 * Tall, with a faceted gold gradient backdrop, a large watermark icon,
 * a refined gold frame, and a hover reveal ("Shop now"). Reused across
 * the site wherever categories are shown.
 */
export function CategoryCard({ href, nameKey, descKey, Icon, className }: CategoryCardProps) {
  const t = useT()

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-500 hover:border-primary/50',
        'hover:-translate-y-1 hover:shadow-premium-lg',
        className,
      )}
    >
      {/* Faceted gold radial backdrop */}
      <span
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, hsl(var(--primary) / 0.18) 0%, transparent 55%)',
        }}
      />

      {/* Large watermark icon */}
      <span className="pointer-events-none absolute -right-4 -top-3 text-primary/10 transition-all duration-500 group-hover:text-primary/20 group-hover:scale-110">
        <Icon className="h-32 w-32" />
      </span>

      {/* Fine gold corner accents (the brand facet motif) */}
      <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l border-t border-primary/30 transition-all duration-500 group-hover:border-primary/60" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b border-r border-primary/30 transition-all duration-500 group-hover:border-primary/60" />

      {/* Text block */}
      <div className="relative z-10">
        <h3 className="font-headline text-2xl text-foreground">{t(nameKey)}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t(descKey)}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-luxury text-primary opacity-0 transition-all duration-500 group-hover:opacity-100">
          {t('cat.shopNow')} <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
