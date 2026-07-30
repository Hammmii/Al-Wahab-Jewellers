'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminUser } from '@/lib/auth/admin'

async function requireAdmin() {
  const user = await getAdminUser()
  if (!user?.isAdmin) throw new Error('Not authorized')
  return createAdminClient()
}

export async function updateOrderStatusAction(
  orderId: string,
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled',
): Promise<{ error?: string }> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: 'Not authorized.' }
  }
  if (!supabase) return { error: 'Database not configured.' }

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  return {}
}

export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: 'unpaid' | 'paid' | 'refunded',
): Promise<{ error?: string }> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: 'Not authorized.' }
  }
  if (!supabase) return { error: 'Database not configured.' }

  const { error } = await supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', orderId)
  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  return {}
}
