import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'

/**
 * Admin dashboard stats. Uses the service-role client (server-only) to count
 * rows across tables. Returns zeros when Supabase isn't configured.
 */
export async function getAdminStats() {
  const empty = {
    products: 0,
    pendingOrders: 0,
    newCustomDesigns: 0,
    newContacts: 0,
  }
  if (!isSupabaseConfigured()) return empty
  const supabase = createAdminClient()
  if (!supabase) return empty

  const [products, orders, custom, contact] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('custom_design_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])

  return {
    products: products.count ?? 0,
    pendingOrders: orders.count ?? 0,
    newCustomDesigns: custom.count ?? 0,
    newContacts: contact.count ?? 0,
  }
}
