import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { formatPKR, formatDate } from '@/lib/format'
import { EmptyState } from '@/components/common'
import { IconLocation } from '@/components/icons'
import { OrderStatusForm } from '@/components/admin/order-status-form'

interface OrderItemRow {
  id: string
  name_snapshot: string
  price_snapshot: number
  quantity: number
  line_total: number
}

interface OrderRow {
  id: string
  status: string
  payment_method: string
  payment_status: string
  customer_name: string
  phone: string
  email: string | null
  address: {
    line1: string
    line2?: string
    city: string
    province: string
    postalCode?: string
  }
  subtotal: number
  total: number
  notes: string | null
  payment_proof_path: string | null
  created_at: string
}

async function getOrder(id: string): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (orderError || !order) {
    console.error('[admin:order] failed to fetch order', orderError)
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('id, name_snapshot, price_snapshot, quantity, line_total')
    .eq('order_id', id)
    .order('id', { ascending: true })

  if (itemsError) {
    console.error('[admin:order] failed to fetch order items', itemsError)
  }

  return { order: order as OrderRow, items: (items ?? []) as OrderItemRow[] }
}

async function getPaymentProofUrl(path: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase.storage.from('payment-proofs').createSignedUrl(path, 60 * 60)
  if (error) {
    console.error('[admin:order] failed to create signed url', error)
    return null
  }
  return data.signedUrl
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getOrder(id)
  if (!result) return notFound()

  const { order, items } = result
  const orderNumber = String(order.id).slice(0, 8).toUpperCase()
  const signedUrl = order.payment_proof_path ? await getPaymentProofUrl(order.payment_proof_path) : null

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl text-foreground">Order {orderNumber}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Back to orders</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="surface-card rounded-xl p-6 lg:col-span-2">
          <h2 className="font-headline text-xl text-foreground">Items</h2>
          {items.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={<IconLocation className="h-8 w-8" />}
                title="No items"
                description="This order has no line items."
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between py-3 text-sm">
                  <span className="text-muted-foreground">
                    {item.name_snapshot} × {item.quantity}
                  </span>
                  <span className="text-foreground">{formatPKR(item.line_total)}</span>
                </li>
              ))}
            </ul>
          )}
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatPKR(order.total)}</span>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="surface-card rounded-xl p-6">
            <h2 className="font-headline text-xl text-foreground">Customer</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="text-foreground">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="text-foreground">{order.phone}</dd>
              </div>
              {order.email ? (
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="text-foreground">{order.email}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted-foreground">Address</dt>
                <dd className="text-foreground">
                  {order.address.line1}
                  {order.address.line2 ? <>, {order.address.line2}</> : null}
                  <br />
                  {order.address.city}, {order.address.province}
                  {order.address.postalCode ? <> {order.address.postalCode}</> : null}
                </dd>
              </div>
            </dl>
          </div>

          <div className="surface-card rounded-xl p-6">
            <h2 className="font-headline text-xl text-foreground">Update status</h2>
            <div className="mt-4">
              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status}
                currentPaymentStatus={order.payment_status}
              />
            </div>
          </div>

          <div className="surface-card rounded-xl p-6">
            <h2 className="font-headline text-xl text-foreground">Payment</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Method</dt>
                <dd className="text-foreground">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                </dd>
              </div>
              {order.payment_method === 'bank_transfer' && (
                <div>
                  <dt className="text-muted-foreground">Payment proof</dt>
                  <dd className="text-foreground">
                    {signedUrl ? (
                      <a
                        href={signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View proof
                      </a>
                    ) : order.payment_proof_path ? (
                      <span className="text-muted-foreground">Unable to generate link</span>
                    ) : (
                      <span className="text-muted-foreground">Not uploaded</span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {order.notes ? (
            <div className="surface-card rounded-xl p-6">
              <h2 className="font-headline text-xl text-foreground">Notes</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{order.notes}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
