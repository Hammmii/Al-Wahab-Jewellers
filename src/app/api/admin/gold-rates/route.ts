import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { getAdminUser } from '@/lib/auth/admin'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const admin = await getAdminUser()
  if (!admin?.isAdmin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const body = await request.json()
  const { rates } = body as {
    rates: { karat: string; ratePerTola: number; ratePer10g: number; ratePerGram: number }[]
  }

  if (!rates || !Array.isArray(rates) || rates.length === 0) {
    return NextResponse.json({ error: 'No rates provided' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 503 })

  // Insert new rate rows (manual, by this admin). The current_gold_rates view
  // automatically picks the latest per karat with manual winning ties.
  const rows = rates.map((r) => ({
    karat: r.karat,
    rate_per_tola: r.ratePerTola,
    rate_per_10g: r.ratePer10g,
    rate_per_gram: r.ratePerGram,
    source: 'manual' as const,
    currency: 'PKR',
    set_by: admin.id,
    effective_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from('gold_rates').insert(rows)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
