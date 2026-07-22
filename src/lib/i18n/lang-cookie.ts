import { cookies } from 'next/headers'
import type { Lang } from './translations'

export const LANG_COOKIE = 'alwahab-lang'

/**
 * Read the saved language from the cookie, server-side. Used so the entire
 * tree renders in the correct language on first paint (no English flash).
 * Returns 'en' when unset.
 */
export async function getLangFromCookie(): Promise<Lang> {
  const store = await cookies()
  const value = store.get(LANG_COOKIE)?.value
  return value === 'ur' ? 'ur' : 'en'
}
