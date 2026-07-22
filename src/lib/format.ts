/**
 * Formatting helpers. All money is PKR (Pakistani Rupees).
 */

// Pakistani numbering ( lakh/crore grouping: 12,34,567 ).
const pkrGrouping = new Intl.NumberFormat('en-PK')

/** Whole-rupee PKR with Pakistani grouping, e.g. "Rs 1,234,567". */
export function formatPKR(amount: number): string {
  return `Rs ${pkrGrouping.format(Math.round(amount || 0))}`
}

/** Compact PKR for tight spaces, e.g. "Rs 1.2M" / "Rs 350K". */
export function formatPKRCompact(amount: number): string {
  const n = amount || 0
  if (n >= 1_000_000) return `Rs ${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `Rs ${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
  return `Rs ${pkrGrouping.format(n)}`
}

/** Weight in grams, e.g. "12.5 g". */
export function formatGrams(grams: number): string {
  return `${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 3 }).format(grams)} g`
}

/** "3 Jul 2026". */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
