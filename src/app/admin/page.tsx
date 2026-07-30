import { getAdminStats } from '@/lib/data/admin'
import { DashboardHeading, DashboardCards } from '@/components/admin/admin-copy'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  // Serializable icon KEYS (not components) — resolved inside the client component.
  const cards = [
    { labelKey: 'admin.productsCount' as const, hintKey: 'admin.manageCatalogue' as const, href: '/admin/products', value: stats.products, iconKey: 'ring' as const },
    { labelKey: 'admin.pendingOrders' as const, hintKey: 'admin.awaitingConfirm' as const, href: '/admin/orders', value: stats.pendingOrders, iconKey: 'location' as const },
    { labelKey: 'admin.customRequests' as const, hintKey: 'admin.newBespoke' as const, href: '/admin/custom-designs', value: stats.newCustomDesigns, iconKey: 'gift' as const },
    { labelKey: 'admin.messages' as const, hintKey: 'admin.newContacts' as const, href: '/admin/messages', value: stats.newContacts, iconKey: 'certificate' as const },
  ]

  return (
    <div>
      <DashboardHeading />
      <DashboardCards cards={cards} />
    </div>
  )
}
