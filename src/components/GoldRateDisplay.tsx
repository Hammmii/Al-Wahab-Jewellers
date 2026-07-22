'use client'

import { useGoldRates } from '@/context/GoldRateContext'
import { rateFor } from '@/lib/gold-rates'
import { formatPKR, formatDate } from '@/lib/format'
import { useT } from '@/lib/i18n/language-context'

type Props = {
  variant?: 'default' | 'compact' | 'hero'
  className?: string
}

export default function GoldRateDisplay({ variant = 'default', className = '' }: Props) {
  const { rates, lastUpdated, isLoading } = useGoldRates()
  const t = useT()
  const r24 = rateFor(rates, '24k')?.ratePerTola ?? null
  const r22 = rateFor(rates, '22k')?.ratePerTola ?? null

  const cell = (rate: number | null) =>
    isLoading ? t('gold.loading') : rate == null ? t('gold.unavailable') : formatPKR(rate)

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
        <h2 className="font-headline text-2xl font-semibold text-primary md:text-3xl">
          {t('gold.title')}
        </h2>
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="rounded-lg border border-primary/20 bg-card/30 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm text-white/70">24k {t('gold.perTola')}</p>
            <p className="text-xl font-bold text-primary">{cell(r24)}</p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-card/30 px-6 py-3 backdrop-blur-sm">
            <p className="text-sm text-white/70">22k {t('gold.perTola')}</p>
            <p className="text-xl font-bold text-primary">{cell(r22)}</p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-row gap-4 ${className}`}>
        <div>
          <span className="block text-xs text-muted-foreground">24k {t('gold.perTola')}</span>
          <span className="font-medium text-primary">{cell(r24)}</span>
        </div>
        <div>
          <span className="block text-xs text-muted-foreground">22k {t('gold.perTola')}</span>
          <span className="font-medium text-primary">{cell(r22)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between text-lg">
        <span className="font-medium text-muted-foreground">24k {t('gold.perTola')}</span>
        <span className="font-bold text-foreground">{cell(r24)}</span>
      </div>
      <div className="flex justify-between text-lg">
        <span className="font-medium text-muted-foreground">22k {t('gold.perTola')}</span>
        <span className="font-bold text-foreground">{cell(r22)}</span>
      </div>
      <div className="mt-2 text-right text-xs text-muted-foreground">
        {lastUpdated ? `${t('gold.lastUpdated')}: ${formatDate(lastUpdated)}` : ''}
      </div>
    </div>
  )
}
