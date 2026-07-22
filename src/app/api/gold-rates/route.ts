import { NextResponse } from 'next/server'
import { getCurrentGoldRates } from '@/lib/data/gold-rates'

// Gold-rate data is public, but `getCurrentGoldRates` uses the cookie-based SSR
// Supabase client (for RLS consistency), so this route must be dynamic.
export const dynamic = 'force-dynamic'

export async function GET() {
  const rates = await getCurrentGoldRates()
  const lastUpdated =
    rates?.reduce((max, r) => (r.effectiveAt > max ? r.effectiveAt : max), '') ?? null

  return NextResponse.json({ rates, lastUpdated })
}
