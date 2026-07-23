import { getAdminStats } from '@/lib/data/admin'
import { IconRing, IconCertificate, IconGift, IconLocation } from '@/components/icons'
import { DashboardHeading, DashboardCards } from '@/components/admin/admin-copy'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    { labelKey: 'admin.productsCount' as const, hintKey: 'admin.manageCatalogue' as const, href: '/admin/products', value: stats.products, Icon: IconRing },
    { labelKey: 'admin.pendingOrders' as const, hintKey: 'admin.awaitingConfirm' as const, href: '/admin/orders', value: stats.pendingOrders, Icon: IconLocation },
    { labelKey: 'admin.customRequests' as const, hintKey: 'admin.newBespoke' as const, href: '/admin', value: stats.newCustomDesigns, Icon: IconGift },
    { labelKey: 'admin.messages' as const, hintKey: 'admin.newContacts' as const, href: '/admin', value: stats.newContacts, Icon: IconCertificate },
  ]

  return (
    <div>
      <DashboardHeading />
      <DashboardCards cards={cards} />
    </div>
  )
}
