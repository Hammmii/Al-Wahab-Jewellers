'use client'

import { SectionHeading } from '@/components/common'
import { useT } from '@/lib/i18n/language-context'

export function CategoriesHeading() {
  const t = useT()
  return (
    <SectionHeading eyebrow="Browse" title={t('section.categories')} subtitle={t('section.categoriesSub')} />
  )
}
