import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSafeJSONStorage } from './safe-storage'

/**
 * Client-side wishlist (saved items). Persisted to localStorage.
 * Stores product ids; product details are fetched from the server on demand.
 */

interface WishlistState {
  ids: string[]
  hydrated: boolean
  setHydrated: (v: boolean) => void
  toggle: (id: string) => void
  has: (id: string) => boolean
  remove: (id: string) => void
  clear: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((x) => x !== id) : [...state.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      remove: (id) => set((state) => ({ ids: state.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'alwahab-wishlist',
      storage: createSafeJSONStorage(),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
)

export const useWishlistCount = (): number => useWishlist((state) => state.ids.length)
