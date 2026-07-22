'use client'

import { useLang } from '@/lib/i18n/language-context'
import { cn } from '@/lib/utils'

/**
 * Compact EN / اردو toggle. Sits in the header. Choice persists via the
 * LanguageProvider (localStorage) and flips the whole site to RTL Urdu.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-card/60 p-0.5 text-xs font-medium',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ur')}
        aria-pressed={lang === 'ur'}
        className={cn(
          'rounded-full px-2.5 py-1 transition-colors',
          lang === 'ur' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        اردو
      </button>
    </div>
  )
}
