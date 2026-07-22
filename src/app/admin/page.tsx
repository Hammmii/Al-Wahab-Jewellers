import Link from 'next/link'
import { getAdminStats } from '@/lib/data/admin'
import { IconRing, IconCertificate, IconGift, IconLocation } from '@/components/icons'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    { label: 'Products', value: stats.products, href: '/admin/products', Icon: IconRing, hint: 'Manage catalogue' },
    { label: 'Pending orders', value: stats.pendingOrders, href: '/admin/orders', Icon: IconLocation, hint: 'Awaiting confirmation' },
    { label: 'Custom requests', value: stats.newCustomDesigns, href: '/admin', Icon: IconGift, hint: 'New bespoke enquiries' },
    { label: 'Messages', value: stats.newContacts, href: '/admin', Icon: IconCertificate, hint: 'New contact submissions' },
  ]

  return (
    <div>
      <h1 className="font-headline text-3xl text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">An overview of your store.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, Icon, hint }) => (
          <Link
            key={label}
            href={href}
            className="surface-card rounded-xl p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <span className="font-headline text-3xl text-foreground">{value}</span>
            </div>
            <p className="mt-3 font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
