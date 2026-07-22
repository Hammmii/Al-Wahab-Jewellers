import { useEffect, useState } from 'react'

/**
 * Returns false during SSR and the first client render, true after mount.
 * Use it to guard persisted Zustand values so server/client markup match
 * (avoids React hydration mismatches for cart counts, wishlist badges, etc.).
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
