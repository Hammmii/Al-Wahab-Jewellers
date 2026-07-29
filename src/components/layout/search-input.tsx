'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n/language-context'
import { IconSearch } from '@/components/icons'

interface SearchInputProps {
  className?: string
  variant?: 'header' | 'mobile-menu'
  onNavigate?: () => void
}

export function SearchInput({ className, variant = 'header', onNavigate }: SearchInputProps) {
  const router = useRouter()
  const t = useT()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const submit = () => {
    const term = value.trim()
    if (!term) return
    setOpen(false)
    setValue('')
    onNavigate?.()
    router.push(`/collections?search=${encodeURIComponent(term)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'Escape') {
      setOpen(false)
      setValue('')
    }
  }

  if (variant === 'mobile-menu') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <IconSearch className="h-5 w-5 shrink-0 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('nav.searchPlaceholder')}
          className="h-10 bg-background"
          aria-label={t('nav.search')}
        />
        <Button size="sm" onClick={submit} disabled={!value.trim()}>
          {t('nav.search')}
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-end', className)}>
      <div
        className={cn(
          'flex items-center overflow-hidden transition-all duration-300 ease-out',
          open ? 'w-56 sm:w-72' : 'w-0',
        )}
      >
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('nav.searchPlaceholder')}
          className="h-9 w-full border-primary/20 bg-background text-sm"
          aria-label={t('nav.search')}
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="relative shrink-0 text-muted-foreground hover:text-primary"
        onClick={() => setOpen((v) => !v)}
        aria-label={t('nav.search')}
      >
        <IconSearch className="h-6 w-6" />
      </Button>
    </div>
  )
}
