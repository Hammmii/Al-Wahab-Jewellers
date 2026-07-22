import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/motion/reveal'

/**
 * Premium section heading: small gold eyebrow, large serif title, optional
 * subtitle, and a thin gold rule. Animates in on scroll.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-xs md:text-sm font-medium uppercase tracking-luxury text-primary/80">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-foreground">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
      <span className={cn('gold-rule mt-2 h-px', align === 'center' ? 'w-24' : 'w-16')} />
    </Reveal>
  )
}
