import { type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Centered max-width content wrapper. Uses the `container` config
 * (max 1400px, responsive padding).
 */
export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  return <Tag className={cn('container', className)}>{children}</Tag>
}
