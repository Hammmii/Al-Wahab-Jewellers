'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { translations, type Lang, type TKey } from './translations'

interface LanguageCtx {
  lang: Lang
  setLang: (l: Lang) => void
  toggle: () => void
  t: (key: TKey) => string
  rtl: boolean
}

const Ctx = createContext<LanguageCtx | undefined>(undefined)
const STORAGE_KEY = 'alwahab-lang'

export function LanguageProvider({
  children,
  initialLang = 'en',
}: {
  children: ReactNode
  /** Server-rendered initial language (from the cookie) — avoids an English flash. */
  initialLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  // After mount, prefer any newer localStorage choice over the server cookie.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (saved === 'ur' || saved === 'en') setLangState(saved)
    } catch {
      /* ignore */
    }
  }, [])

  // Reflect language on <html> + persist to both localStorage and a cookie
  // (the cookie lets the SERVER render the right language on the next load).
  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = lang === 'ur' ? 'rtl' : 'ltr'
    html.classList.toggle('lang-ur', lang === 'ur')
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore */
    }
    document.cookie = `alwahab-lang=${lang};path=/;max-age=31536000;samesite=lax`
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(() => setLangState((l) => (l === 'en' ? 'ur' : 'en')), [])

  const t = useCallback(
    (key: TKey) => {
      const entry = translations[key]
      if (!entry) return key
      return entry[lang] ?? entry.en
    },
    [lang],
  )

  return (
    <Ctx.Provider value={{ lang, setLang, toggle, t, rtl: lang === 'ur' }}>{children}</Ctx.Provider>
  )
}

export function useLang() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}

export function useT() {
  return useLang().t
}
