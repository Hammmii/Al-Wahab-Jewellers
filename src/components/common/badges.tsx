import { cn } from '@/lib/utils'
import type { MetalPurity } from '@/lib/domain'

const KARAT_LABELS: Record<MetalPurity, string> = {
  '24k': '24K Gold',
  '22k': '22K Gold',
  '21k': '21K Gold',
  '18k': '18K Gold',
  silver: 'Silver',
}

/** Small pill denoting a metal purity (24K / 22K / …). */
export function KaratBadge({
  purity,
  className,
}: {
  purity: MetalPurity
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
        className,
      )}
    >
      {KARAT_LABELS[purity]}
    </span>
  )
}

/** Generic small label pill. */
export function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
