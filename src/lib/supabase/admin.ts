import { createClient as supabaseCreateClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from './configured'

/**
 * Service-role admin client — **BYPASSES Row Level Security. SERVER ONLY.**
 * Returns null when Supabase isn't configured.
 */
export function createAdminClient() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  return supabaseCreateClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
