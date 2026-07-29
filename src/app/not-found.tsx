'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section, Container, SectionHeading } from '@/components/common'
import { useT } from '@/lib/i18n/language-context'
import { IconRing } from '@/components/icons'

export default function NotFoundPage() {
  const t = useT()

  return (
    <Section spacing="loose">
      <Container className="flex flex-col items-center text-center">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary md:h-20 md:w-20">
          <IconRing className="h-8 w-8 md:h-10 md:w-10" />
        </span>
        <SectionHeading
          eyebrow="404"
          title={t('notFound.title')}
          subtitle={t('notFound.description')}
        />
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/collections">{t('notFound.browseCollection')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">{t('cta.backHome')}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
