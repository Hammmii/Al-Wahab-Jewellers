import { createBrowserClient } from '@supabase/ssr'
import { isSupabaseConfigured } from './configured'

/**
 * Browser Supabase client (Client Components). Uses the anon key and is bound
 * by Row Level Security. Returns null when Supabase isn't configured (e.g.
 * before keys are provided) so callers can degrade gracefully.
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
