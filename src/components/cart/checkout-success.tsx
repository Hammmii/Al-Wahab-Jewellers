'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common'
import { IconPurity } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'

export function CheckoutSuccess() {
  const t = useT()
  return (
    <EmptyState
      icon={<IconPurity className="h-10 w-10" />}
      title={t('success.thanks')}
      description={t('success.thanksDesc')}
      action={
        <Button asChild>
          <Link href="/collections">{t('cta.continueShopping')}</Link>
        </Button>
      }
    />
  )
}
