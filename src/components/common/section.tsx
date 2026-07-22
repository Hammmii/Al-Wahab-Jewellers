import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Container } from './container'

const SPACING = {
  tight: 'py-10 md:py-14',
  default: 'py-14 md:py-24',
  loose: 'py-20 md:py-32',
  none: '',
}

/**
 * Page section with consistent vertical rhythm. Wraps content in a Container
 * by default; pass `container={false}` to control width yourself.
 */
export function Section({
  children,
  className,
  spacing = 'default',
  container = true,
  id,
}: {
  children: ReactNode
  className?: string
  spacing?: keyof typeof SPACING
  container?: boolean
  id?: string
}) {
  return (
    <section id={id} className={cn('relative scroll-mt-20', SPACING[spacing], className)}>
      {container ? <Container>{children}</Container> : children}
    </section>
  )
}
