'use client'

import { useState, type ComponentType } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { IconCertificate, IconRing, IconLocation, IconGift } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'
import type { TKey } from '@/lib/i18n/translations'

/** Serializable icon key (safe to pass across the server→client boundary). */
export type AdminIconKey = 'dashboard' | 'products' | 'orders' | 'gift' | 'certificate'

const ICONS: Record<AdminIconKey, ComponentType<{ className?: string }>> = {
  dashboard: IconCertificate,
  products: IconRing,
  orders: IconLocation,
  gift: IconGift,
  certificate: IconCertificate,
}

interface NavItem {
  href: string
  labelKey: TKey
  iconKey: AdminIconKey
}

export function AdminShell({
  nav,
  email,
  children,
}: {
  nav: NavItem[]
  email: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useT()

  const signOut = async () => {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const SidebarContent = (
    <>
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-headline text-lg font-semibold text-primary">Al-Wahab</span>
          <span className="text-xs text-muted-foreground">{t('admin.portal')}</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ href, labelKey, iconKey }) => {
          const Icon = ICONS[iconKey]
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              {t(labelKey)}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-3">
        <p className="truncate px-3 pb-2 text-xs text-muted-foreground">{email}</p>
        <button
          type="button"
          onClick={signOut}
          className="w-full rounded-md px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          {t('admin.signOut')}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-background md:flex">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <Link href="/admin" className="font-headline text-lg text-primary">Al-Wahab Admin</Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="text-sm text-muted-foreground"
        >
          {t('admin.menu')}
        </button>
      </div>
      {mobileOpen ? (
        <div className="flex flex-col border-b border-border bg-background px-3 py-2 md:hidden">
          {nav.map(({ href, labelKey, iconKey }) => {
            const Icon = ICONS[iconKey]
            return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground"
            >
              <Icon className="h-5 w-5" /> {t(labelKey)}
            </Link>
            )
          })}
          <button
            type="button"
            onClick={signOut}
            className="mt-1 rounded-md px-3 py-2 text-left text-sm text-destructive"
          >
            {t('admin.signOut')}
          </button>
        </div>
      ) : null}

      <main className="p-6 md:ml-64 md:p-8">{children}</main>
    </div>
  )
}
