import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { orderSchema } from '@/lib/validations'
import { sendEmail } from '@/lib/email/send'
import { OrderConfirmationEmail } from '@/lib/email/templates/order-confirmation'
import type { OrderConfirmationItem } from '@/lib/email/templates/order-confirmation'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = orderSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ success: false, errors: result.error.format() }, { status: 400 })
  }

  const data = result.data
  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  // Persist when Supabase + service-role key are available.
  let orderNumber: string | null = null
  const supabase = isSupabaseConfigured() ? createAdminClient() : null

  if (supabase) {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        status: 'pending',
        payment_method: data.paymentMethod,
        payment_status: 'unpaid',
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        subtotal,
        total: subtotal,
        notes: data.notes ?? null,
      })
      .select('id')
      .single()

    if (!error && order) {
      const orderId = (order as { id: string }).id
      orderNumber = orderId.slice(0, 8).toUpperCase()
      await supabase.from('order_items').insert(
        data.items.map((i) => ({
          order_id: orderId,
          product_id: i.productId,
          variant_id: i.variantId,
          name_snapshot: i.name,
          price_snapshot: i.price,
          quantity: i.quantity,
          line_total: i.price * i.quantity,
        })),
      )
    }
  } else {
    console.info('[orders] Supabase not configured — order not persisted')
  }

  orderNumber = orderNumber ?? `AW-${Date.now().toString().slice(-6)}`

  // Email the customer a confirmation (no-op until RESEND_API_KEY is set).
  if (data.email) {
    const emailItems: OrderConfirmationItem[] = data.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      lineTotal: i.price * i.quantity,
    }))
    await sendEmail({
      to: data.email,
      subject: `Order confirmed — ${orderNumber}`,
      react: OrderConfirmationEmail({
        customerName: data.customerName,
        orderNumber,
        items: emailItems,
        total: subtotal,
        paymentMethod: data.paymentMethod,
      }),
    })
  }

  // Notify the shop.
  await sendEmail({
    to: process.env.NOTIFY_EMAIL ?? 'owner@alwahabjewellers.com',
    subject: `New order ${orderNumber} — ${data.customerName}`,
    react: OrderConfirmationEmail({
      customerName: data.customerName,
      orderNumber,
      items: data.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        lineTotal: i.price * i.quantity,
      })),
      total: subtotal,
      paymentMethod: data.paymentMethod,
    }),
  })

  return NextResponse.json({ success: true, orderNumber }, { status: 201 })
}
