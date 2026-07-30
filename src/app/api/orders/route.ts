import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { orderSchema } from '@/lib/validations'
import { sendEmail } from '@/lib/email/send'
import { OrderConfirmationEmail } from '@/lib/email/templates/order-confirmation'
import type { OrderConfirmationItem } from '@/lib/email/templates/order-confirmation'
import type { Json } from '@/lib/types/database.types'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = orderSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ success: false, errors: result.error.format() }, { status: 400 })
  }

  const data = result.data

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'service_unavailable', message: 'Order service is unavailable.' },
      { status: 503 },
    )
  }

  const serverClient = await createClient()
  const adminClient = createAdminClient()
  if (!serverClient || !adminClient) {
    return NextResponse.json(
      { success: false, error: 'service_unavailable', message: 'Order service is unavailable.' },
      { status: 503 },
    )
  }

  // Resolve the current user so guest checkout continues to work (null = guest).
  const {
    data: { user },
  } = await serverClient.auth.getUser()
  const customerId = user?.id ?? null

  // The Postgres function expects snake_case keys inside the items JSONB.
  const rpcItems = data.items.map((item) => ({
    product_id: item.productId,
    variant_id: item.variantId,
    quantity: item.quantity,
  })) as unknown as Json

  const { data: orderId, error: rpcError } = await adminClient.rpc('create_order', {
    p_payment_method: data.paymentMethod,
    p_customer_name: data.customerName,
    p_phone: data.phone,
    p_address: data.address as Json,
    p_items: rpcItems,
    p_customer_id: customerId,
    p_email: data.email || null,
    p_notes: data.notes ?? null,
    p_payment_proof_path: data.paymentProofPath ?? null,
    p_payment_status: 'unpaid',
  })

  if (rpcError) {
    const msg = rpcError.message ?? ''
    if (msg.includes('variant_not_found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'variant_not_found',
          message: 'One or more selected items are no longer available. Please refresh your cart.',
        },
        { status: 400 },
      )
    }
    if (msg.includes('insufficient_stock')) {
      const productName = msg.split('|')[1]?.trim() ?? 'an item'
      return NextResponse.json(
        {
          success: false,
          error: 'insufficient_stock',
          message: `Not enough stock for ${productName}. Please reduce the quantity and try again.`,
        },
        { status: 400 },
      )
    }

    console.error('[orders] create_order failed', rpcError)
    return NextResponse.json(
      { success: false, error: 'order_failed', message: 'Unable to place order. Please try again.' },
      { status: 500 },
    )
  }

  const orderNumber = String(orderId).slice(0, 8).toUpperCase()

  // Fetch the authoritative order and its items for the confirmation emails.
  // We fetch items separately to avoid relying on PostgREST's schema-cache
  // knowing the orders -> order_items relationship.
  const [{ data: orderRow, error: orderError }, { data: itemsRows, error: itemsError }] =
    await Promise.all([
      adminClient.from('orders').select('total').eq('id', orderId).single(),
      adminClient.from('order_items').select('name_snapshot, quantity, line_total').eq('order_id', orderId),
    ])

  if (orderError) console.error('[orders] failed to fetch created order total', orderError)
  if (itemsError) console.error('[orders] failed to fetch created order items', itemsError)

  const rawItems = itemsRows ?? []
  const emailItems: OrderConfirmationItem[] = rawItems.map((item) => ({
    name: item.name_snapshot,
    quantity: item.quantity,
    lineTotal: Number(item.line_total),
  }))
  const total = Number(orderRow?.total ?? 0)

  // Email the customer a confirmation (no-op until RESEND_API_KEY is set).
  if (data.email && emailItems.length > 0) {
    await sendEmail({
      to: data.email,
      subject: `Order confirmed — ${orderNumber}`,
      react: OrderConfirmationEmail({
        customerName: data.customerName,
        orderNumber,
        items: emailItems,
        total,
        paymentMethod: data.paymentMethod,
      }),
    })
  }

  // Notify the shop.
  if (emailItems.length > 0) {
    await sendEmail({
      to: process.env.NOTIFY_EMAIL ?? 'owner@alwahabjewellers.com',
      subject: `New order ${orderNumber} — ${data.customerName}`,
      react: OrderConfirmationEmail({
        customerName: data.customerName,
        orderNumber,
        items: emailItems,
        total,
        paymentMethod: data.paymentMethod,
      }),
    })
  }

  return NextResponse.json({ success: true, orderNumber }, { status: 201 })
}
