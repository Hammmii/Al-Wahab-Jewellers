'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Section, Container, SectionHeading } from '@/components/common'
import { useT } from '@/lib/i18n/language-context'
import { IconAlertTriangle } from '@/components/icons'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useT()

  return (
    <Section spacing="loose">
      <Container className="flex flex-col items-center text-center">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5 text-destructive md:h-20 md:w-20">
          <IconAlertTriangle className="h-8 w-8 md:h-10 md:w-10" />
        </span>
        <SectionHeading
          eyebrow={error.digest ?? undefined}
          title={t('error.title')}
          subtitle={t('error.description')}
        />
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            {t('error.retry')}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">{t('cta.backHome')}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  )
}
