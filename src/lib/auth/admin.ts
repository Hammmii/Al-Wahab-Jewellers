import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/configured'

export type AdminUser = {
  id: string
  email: string
  fullName: string | null
  isAdmin: boolean
}

/**
 * Returns the signed-in admin user (or null) by reading the Supabase session
 * server-side and checking the `profiles.is_admin` flag. Used by admin pages
 * to authorize before rendering. Returns null when Supabase isn't configured.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, is_admin')
    .eq('id', user.id)
    .maybeSingle()

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (profile as { full_name: string | null } | null)?.full_name ?? null,
    isAdmin: Boolean((profile as { is_admin: boolean } | null)?.is_admin),
  }
}
