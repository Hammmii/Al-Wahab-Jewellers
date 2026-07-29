/**
 * Al-Wahab Jewellers — custom icon set.
 *
 * Spec (apply to every icon, designed as one set for a shared visual language):
 *  - ViewBox 0 0 24 24, uniform 1.25px stroke, round line caps & joins.
 *  - Line-based; no flat fills, no gradients, no shadows, no background chips.
 *  - Signature motif: every icon carries a subtle "faceted / gem-cut" detail
 *    (an angled segment or notch) rather than a generic rounded shape.
 *  - Color routes through theme tokens via `currentColor`:
 *      .icon         → var(--icon-stroke)
 *      .icon-accent  → var(--icon-accent)   (sparing duotone accent)
 *      hover         → var(--icon-stroke-hover)
 *    Override per-instance with text-color utilities (e.g. text-gold-400).
 *
 * No Lucide / Heroicons / Feather. Inline SVG only.
 */

import { type ReactNode, type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export type IconProps = SVGProps<SVGSVGElement> & { title?: string }

function Icon({
  title,
  children,
  className,
  strokeWidth = 1.25,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('icon h-6 w-6 shrink-0', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   Product icons — each centred on a faceted gemstone
   ────────────────────────────────────────────────────────────────────────── */

export const IconRing = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="15.5" r="5.5" />
    <path d="M12 3.5 L15.7 7.2 L12 11 L8.3 7.2 Z" />
    <path d="M12 3.5 L12 11 M8.3 7.2 L15.7 7.2" />
  </Icon>
)

export const IconNecklace = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 5.5 Q 12 16 19.5 5.5" />
    <path d="M12 13 L15.5 16.5 L12 20.5 L8.5 16.5 Z" />
    <path d="M12 13 L12 20.5 M8.5 16.5 L15.5 16.5" />
  </Icon>
)

export const IconEarring = (p: IconProps) => (
  <Icon {...p}>
    <path d="M11.5 3 C 11.5 5.5, 10 6.5, 11 8.5" />
    <path d="M12 9.5 L15.2 12.8 L12 18.5 L8.8 12.8 Z" />
    <path d="M12 9.5 L12 18.5 M8.8 12.8 L15.2 12.8" />
  </Icon>
)

export const IconBracelet = (p: IconProps) => (
  <Icon {...p}>
    <ellipse cx="10.5" cy="12" rx="7" ry="5" />
    <path d="M17.5 10 L19.8 12 L17.5 14 L16 12 Z" />
    <path d="M17.5 10 L17.5 14 M16 12 L19.8 12" />
  </Icon>
)

/* ──────────────────────────────────────────────────────────────────────────
   Trust / service icons — facet = folded corner, seam, or notch
   ────────────────────────────────────────────────────────────────────────── */

export const IconCertificate = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 3 H14 L17.5 6.5 V15.5 H5.5 Z" />
    <path d="M14 3 V6.5 H17.5" />
    <path d="M8 9 H14.5 M8 11.5 H14.5 M8 14 H12" />
    <circle cx="16" cy="17.5" r="2.2" />
    <path d="M14.6 19 L13.5 21.5 L16 20.5 L18.5 21.5 L17.4 19" />
  </Icon>
)

export const IconShipping = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8 L12 4 L20 8 L20 16.5 L12 20.5 L4 16.5 Z" />
    <path d="M4 8 L12 12 L20 8 M12 12 L12 20.5" />
  </Icon>
)

export const IconWarranty = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 L19.5 6 V11.5 C 19.5 16.5, 16 19.5, 12 20.8 C 8 19.5, 4.5 16.5, 4.5 11.5 V6 Z" />
    <path d="M12 3 L12 20.8" />
    <path d="M8.8 12 L11.2 14.4 L15.5 9.5" />
  </Icon>
)

export const IconGift = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 9.5 H19.5 V20 H4.5 Z" />
    <path d="M3.5 6.5 H20.5 V9.5 H3.5 Z" />
    <path d="M12 6.5 V20" />
    <path d="M12 6.5 L8.5 3.5 L10 6.5 Z M12 6.5 L15.5 3.5 L14 6.5 Z" />
  </Icon>
)

/* ──────────────────────────────────────────────────────────────────────────
   UI icons
   ────────────────────────────────────────────────────────────────────────── */

export const IconWhatsApp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 4.5 H20 V15.5 H10 L6 19.5 V15.5 H4 Z" />
    <path d="M8.5 8.2 C 8 7.2, 9.4 6.6, 10.1 7.6 L10.7 8.9 C 11 9.4, 10.3 9.9, 9.9 10.2 C 10.4 11.8, 12.2 13.6, 13.8 14.1 C 14.1 13.7, 14.6 13, 15.1 13.2 L16.4 13.8 C 17.4 14.3, 16.8 15.7, 15.8 15.7" />
  </Icon>
)

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="M14.8 14.8 L20 20" />
    <path d="M7.6 10.6 L9.6 8.6" />
  </Icon>
)

export const IconCart = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 8 H18 L17 20 H7 Z" />
    <path d="M9 8 V6.5 C 9 4.5, 15 4.5, 15 6.5 V8" />
    <path d="M12 8 V20" />
  </Icon>
)

export const IconHeart = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20 C 4.5 14, 4.5 7.5, 8.5 7.5 C 10.5 7.5, 12 9.5, 12 9.5 C 12 9.5, 13.5 7.5, 15.5 7.5 C 19.5 7.5, 19.5 14, 12 20 Z" />
    <path d="M12 9.5 L12 20" />
    <path d="M8.5 7.5 L12 9.5 L15.5 7.5" />
  </Icon>
)

export const IconFilter = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 5.5 H20 L14 12.5 V18.5 L10 20.5 V12.5 Z" />
    <path d="M7.5 8.5 H16.5" />
  </Icon>
)

export const IconStar = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 L14.3 8.8 L20.5 9.3 L15.8 13.4 L17.3 19.5 L12 16.2 L6.7 19.5 L8.2 13.4 L3.5 9.3 L9.7 8.8 Z" />
    <path d="M12 9 L12 16.2" />
  </Icon>
)

export const IconPhone = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 4.5 C 5 4.5, 8 4, 9.2 6.8 C 9.2 6.8, 8 7.8, 8.2 8.8 C 9.2 11.8, 12.2 14.8, 15.2 15.8 C 16.2 16, 17.2 14.8, 17.2 14.8 C 20 16, 19.5 19, 19.5 19 C 19.5 19, 16.5 21, 12.5 19 C 8.5 17, 5 12.5, 4 9.5 C 3, 7, 5 4.5, 5 4.5 Z" />
    <path d="M7 6.5 L9 8.5" />
  </Icon>
)

export const IconLocation = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21 C 12 21, 5 14, 5 9.5 C 5 5.5, 8 3.5, 12 3.5 C 16 3.5, 19 5.5, 19 9.5 C 19 14, 12 21, 12 21 Z" />
    <path d="M12 6.8 L14.3 9.5 L12 12.2 L9.7 9.5 Z" />
    <path d="M12 6.8 L12 12.2 M9.7 9.5 L14.3 9.5" />
  </Icon>
)

export const IconPurity = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 3.8 L12 5.2 M12 18.8 L12 20.2 M3.8 12 L5.2 12 M18.8 12 L20.2 12" />
    <path d="M12 7.5 L15 12 L12 16.5 L9 12 Z" />
    <path d="M12 7.5 L12 16.5 M9 12 L15 12" />
  </Icon>
)

export const IconAlertTriangle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 L21.5 19.5 H2.5 Z" />
    <path d="M12 8.5 V13.5 M12 15.5 L12 15.6" />
  </Icon>
)
