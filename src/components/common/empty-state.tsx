import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Empty state for lists/grids with no data (e.g. empty cart, no products yet).
 * Honours the no-fake-data rule: shows a clear message, never placeholder content.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 py-20 text-center',
        className,
      )}
    >
      {icon ? <div className="mb-5 text-primary/50">{icon}</div> : null}
      <h3 className="font-headline text-2xl text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  )
}
