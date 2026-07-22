'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/common'
import { EmptyState } from '@/components/common'
import { useT } from '@/lib/i18n/language-context'
import { IconRing } from '@/components/icons'

/**
 * Client wrapper for the translated Featured section heading + empty state.
 * The product grid itself is server-rendered by FeaturedProducts.
 */
export function FeaturedHeading() {
  const t = useT()
  return (
    <SectionHeading
      eyebrow=""
      title={t('section.featured')}
    />
  )
}

export function FeaturedEmpty() {
  const t = useT()
  return (
    <EmptyState
      className="mt-10"
      icon={<IconRing className="h-10 w-10" />}
      title={t('collections.empty')}
      description={t('collections.emptyDesc')}
      action={
        <Button asChild>
          <Link href="/custom-design">{t('cta.startCustom')}</Link>
        </Button>
      }
    />
  )
}
