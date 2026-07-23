'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common'
import { useT } from '@/lib/i18n/language-context'
import { IconRing, IconCertificate, IconGift, IconLocation } from '@/components/icons'
import type { ComponentType } from 'react'

const DASH_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  ring: IconRing,
  certificate: IconCertificate,
  gift: IconGift,
  location: IconLocation,
}

// ── Dashboard ──────────────────────────────────────────────
export function DashboardHeading() {
  const t = useT()
  return (
    <div>
      <h1 className="font-headline text-3xl text-foreground">{t('admin.dashboard')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('admin.overview')}</p>
    </div>
  )
}

export function DashboardCards({
  cards,
}: {
  cards: { labelKey: 'admin.productsCount'|'admin.pendingOrders'|'admin.customRequests'|'admin.messages'; hintKey: 'admin.manageCatalogue'|'admin.awaitingConfirm'|'admin.newBespoke'|'admin.newContacts'; href: string; value: number; iconKey: string }[]
}) {
  const t = useT()
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = DASH_ICONS[c.iconKey] ?? IconRing
        return (
          <Link key={c.labelKey} href={c.href} className="surface-card rounded-xl p-5 transition-colors hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-primary"><Icon className="h-6 w-6" /></span>
              <span className="font-headline text-3xl text-foreground">{c.value}</span>
            </div>
            <p className="mt-3 font-medium text-foreground">{t(c.labelKey)}</p>
            <p className="text-xs text-muted-foreground">{t(c.hintKey)}</p>
          </Link>
        )
      })}
    </div>
  )
}

// ── Products list ──────────────────────────────────────────
export function ProductsHeading({ count }: { count: number }) {
  const t = useT()
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-headline text-3xl text-foreground">{t('admin.productsNav')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{count} {t('admin.inCatalogue')}</p>
      </div>
      <Button asChild><Link href="/admin/products/new">{t('admin.addProduct')}</Link></Button>
    </div>
  )
}

export function ProductsEmpty() {
  const t = useT()
  return (
    <div className="mt-8">
      <EmptyState
        icon={<IconRing className="h-10 w-10" />}
        title={t('admin.noProducts')}
        description={t('admin.noProductsDesc')}
        action={<Button asChild><Link href="/admin/products/new">{t('admin.addFirst')}</Link></Button>}
      />
    </div>
  )
}

export function ProductsTableHead() {
  const t = useT()
  return (
    <tr>
      <th className="px-4 py-3">{t('admin.colProduct')}</th>
      <th className="px-4 py-3">{t('admin.colPrice')}</th>
      <th className="px-4 py-3">{t('admin.colStatus')}</th>
      <th className="px-4 py-3 text-right">{t('admin.colActions')}</th>
    </tr>
  )
}

export function ProductStatus({ isActive, isFeatured }: { isActive: boolean; isFeatured: boolean }) {
  const t = useT()
  return (
    <div className="flex gap-1.5">
      {isActive ? (
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">{t('admin.active')}</span>
      ) : (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t('admin.hidden')}</span>
      )}
      {isFeatured ? <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">{t('admin.featured')}</span> : null}
    </div>
  )
}

export function EditText() {
  const t = useT()
  return <>{t('admin.edit')}</>
}

// ── Orders ────────────────────────────────────────────────
export function OrdersHeading({ count }: { count: number }) {
  const t = useT()
  return (
    <div>
      <h1 className="font-headline text-3xl text-foreground">{t('admin.ordersNav')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{count} {t('admin.ordersCount')}</p>
    </div>
  )
}

export function OrdersEmpty() {
  const t = useT()
  return (
    <div className="mt-8">
      <EmptyState
        icon={<IconRing className="h-10 w-10" />}
        title={t('admin.noOrders')}
        description={t('admin.noOrdersDesc')}
      />
    </div>
  )
}
