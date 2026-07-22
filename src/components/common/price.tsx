import { cn } from '@/lib/utils'
import { formatPKR, formatPKRCompact } from '@/lib/format'

const SIZES = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-3xl',
} as const

/**
 * PKR price display. Uses Pakistani grouping. Pass `from` for a "From" prefix
 * (e.g. products with multiple variants) and `compact` for tight spaces.
 */
export function Price({
  amount,
  from = false,
  compact = false,
  size = 'md',
  className,
}: {
  amount: number
  from?: boolean
  compact?: boolean
  size?: keyof typeof SIZES
  className?: string
}) {
  const text = compact ? formatPKRCompact(amount) : formatPKR(amount)

  return (
    <span className={cn('font-medium tabular-nums text-foreground', SIZES[size], className)}>
      {from ? (
        <span className="mr-1.5 text-[0.7em] font-normal text-muted-foreground">From</span>
      ) : null}
      {text}
    </span>
  )
}
