import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { formatPKR, formatDate } from '@/lib/format'
import { OrdersHeading, OrdersEmpty } from '@/components/admin/admin-copy'

interface OrderRow {
  id: string
  status: string
  payment_method: string
  customer_name: string
  total: number
  created_at: string
}

async function getOrders(): Promise<OrderRow[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, payment_method, customer_name, total, created_at')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error || !data) return []
  return data as OrderRow[]
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div>
      <OrdersHeading count={orders.length} />

      {orders.length === 0 ? (
        <OrdersEmpty />
      ) : (
        <div className="surface-card mt-6 overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {String(o.id).slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-foreground">{o.customer_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.payment_method === 'cod' ? 'COD' : 'Bank'}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{o.status}</td>
                  <td className="px-4 py-3 text-foreground">{formatPKR(o.total)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
