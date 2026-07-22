import { type PersistStorage, type StorageValue } from 'zustand/middleware'

/**
 * SSR-safe JSON persistence for Zustand.
 *
 * Returns a real `PersistStorage` only in a genuine browser (where
 * localStorage.getItem is a function). On the server / Next.js edge runtime
 * — where `localStorage` is undefined OR a non-functional stub — we return a
 * no-op storage so store creation never throws and SSR never 500s.
 */

function realLocalStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    const ls = window.localStorage
    if (typeof ls?.getItem !== 'function') return null
    return ls as Storage
  } catch {
    return null
  }
}

export function createSafeJSONStorage<S>(): PersistStorage<S> | undefined {
  return {
    getItem: (name): StorageValue<S> | null => {
      const ls = realLocalStorage()
      if (!ls) return null
      const str = ls.getItem(name)
      return str ? (JSON.parse(str) as StorageValue<S>) : null
    },
    setItem: (name, value): void => {
      const ls = realLocalStorage()
      if (!ls) return
      ls.setItem(name, JSON.stringify(value))
    },
    removeItem: (name): void => {
      const ls = realLocalStorage()
      if (!ls) return
      ls.removeItem(name)
    },
  }
}
