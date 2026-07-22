import { createClient } from '@/lib/supabase/server'
import type { GoldRate, Karat } from '@/lib/gold-rates'

/**
 * Real gold rates only. Reads the `current_gold_rates` view (latest row per
 * karat; manual overrides win). Returns null when Supabase is unconfigured or
 * has no rate rows — it NEVER invents a number (project no-fake-data rule).
 */
export async function getCurrentGoldRates(): Promise<GoldRate[] | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null
  }

  try {
    const supabase = await createClient()
    if (!supabase) return null
    const { data, error } = await supabase
      .from('current_gold_rates')
      .select('karat, rate_per_tola, rate_per_10g, rate_per_gram, source, effective_at')

    if (error) {
      console.error('[gold-rates:getCurrentGoldRates] Supabase query failed:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return null
    }
    if (!data || data.length === 0) return null

    const rows = data as Array<{
      karat: Karat
      rate_per_tola: number
      rate_per_10g: number
      rate_per_gram: number
      source: 'auto' | 'manual'
      effective_at: string
    }>

    return rows.map((r) => ({
      karat: r.karat,
      ratePerTola: Number(r.rate_per_tola),
      ratePer10g: Number(r.rate_per_10g),
      ratePerGram: Number(r.rate_per_gram),
      source: r.source,
      effectiveAt: r.effective_at,
    }))
  } catch (err) {
    console.error('[gold-rates:getCurrentGoldRates] Unexpected error:', err)
    return null
  }
}
