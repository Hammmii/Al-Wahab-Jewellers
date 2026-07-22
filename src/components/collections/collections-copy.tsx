'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EmptyState, Section, SectionHeading } from '@/components/common'
import { useT } from '@/lib/i18n/language-context'
import { useLang } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'
import { IconRing } from '@/components/icons'
import type { Category } from '@/lib/domain'

const CAT_UR: Record<string, string> = {
  rings: 'انگوٹھیاں',
  necklaces: 'ہار',
  bracelets: 'چوڑیاں',
  earrings: 'کان کی بالیاں',
}

export function CollectionsHeading() {
  const t = useT()
  return (
    <SectionHeading eyebrow="" title={t('collections.title')} subtitle={t('collections.subtitle')} />
  )
}

export function CollectionsEmpty() {
  const t = useT()
  return (
    <EmptyState
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

/** Category filter tabs (client, translated). */
export function CategoryTabs({
  categories,
  active,
}: {
  categories: Category[]
  active: string
}) {
  const { lang } = useLang()
  const tabs = [{ name: lang === 'ur' ? 'تمام' : 'All', slug: 'all' }, ...categories.map((c) => ({
    name: lang === 'ur' ? (CAT_UR[c.slug] ?? c.name) : c.name,
    slug: c.slug,
  }))]
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {tabs.map((tab) => {
        const isActive = active === tab.slug
        return (
          <Link
            key={tab.slug}
            href={tab.slug === 'all' ? '/collections' : `/collections?category=${tab.slug}`}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary',
            )}
          >
            {tab.name}
          </Link>
        )
      })}
    </div>
  )
}
