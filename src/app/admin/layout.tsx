import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminUser } from '@/lib/auth/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { AdminShell } from '@/components/admin/shell'
import { IconCertificate } from '@/components/icons'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // When Supabase isn't configured yet, show a friendly "not available" state
  // instead of a fake/mocked admin (no-fake-data rule).
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="surface-card max-w-md rounded-xl p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary">
            <IconCertificate className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-headline text-2xl text-foreground">Admin coming soon</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The management portal connects once the database is live. It uses real Supabase
            authentication — no mock logins.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    )
  }

  const user = await getAdminUser()

  // Not signed in → let the login page render.
  if (!user) {
    return <>{children}</>
  }

  // Signed in but not an admin → forbid.
  if (!user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="surface-card max-w-md rounded-xl p-8 text-center">
          <h1 className="font-headline text-2xl text-foreground">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account doesn’t have admin access.
          </p>
        </div>
      </div>
    )
  }

  // Serializable icon KEYS + translation keys (not components/functions).
  const nav = [
    { href: '/admin', labelKey: 'admin.dashboard' as const, iconKey: 'dashboard' as const },
    { href: '/admin/products', labelKey: 'admin.productsNav' as const, iconKey: 'products' as const },
    { href: '/admin/orders', labelKey: 'admin.ordersNav' as const, iconKey: 'orders' as const },
    { href: '/admin/custom-designs', labelKey: 'admin.customRequests' as const, iconKey: 'gift' as const },
    { href: '/admin/messages', labelKey: 'admin.messages' as const, iconKey: 'certificate' as const },
    { href: '/admin/gold-rates', labelKey: 'admin.goldRatesNav' as const, iconKey: 'dashboard' as const },
  ]

  return <AdminShell nav={nav} email={user.email}>{children}</AdminShell>
}
