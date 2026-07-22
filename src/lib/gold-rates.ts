/**
 * Gold-rate types & pure helpers.
 * Pure module (no server imports) so it is safe to import in Client Components.
 */

export const KARATS = ['24k', '22k', '21k', '18k'] as const
export type Karat = (typeof KARATS)[number]

export type GoldRate = {
  karat: Karat
  ratePerTola: number
  ratePer10g: number
  ratePerGram: number
  source: 'auto' | 'manual'
  effectiveAt: string // ISO timestamp
}

/** Find the current rate row for a given karat, or null. */
export function rateFor(
  rates: GoldRate[] | null | undefined,
  karat: Karat,
): GoldRate | null {
  return rates?.find((r) => r.karat === karat) ?? null
}
