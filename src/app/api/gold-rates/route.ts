import { NextResponse } from 'next/server'
import { getCurrentGoldRates } from '@/lib/data/gold-rates'

// Rates change infrequently (admin sets the daily Sarafa rate); refresh every 5 min.
export const revalidate = 300

export async function GET() {
  const rates = await getCurrentGoldRates()
  const lastUpdated =
    rates?.reduce((max, r) => (r.effectiveAt > max ? r.effectiveAt : max), '') ?? null

  return NextResponse.json({ rates, lastUpdated })
}
