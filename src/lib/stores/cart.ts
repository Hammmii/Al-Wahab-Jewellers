import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSafeJSONStorage } from './safe-storage'

/**
 * Client-side cart. Persisted to localStorage for guest recovery.
 * Authoritative totals/prices are re-validated by the server at checkout —
 * the `price` here is only a display snapshot.
 *
 * All money values are PKR integers/numerics.
 */

export interface CartItem {
  productId: string
  slug: string
  name: string
  variantId?: string
  price: number // PKR snapshot
  image?: string
  metalPurity?: string
  size?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  hydrated: boolean
  setHydrated: (v: boolean) => void
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  clear: () => void
}

const lineKey = (productId: string, variantId?: string) => `${productId}::${variantId ?? ''}`

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      addItem: (item, quantity = 1) =>
        set((state) => {
          const key = lineKey(item.productId, item.variantId)
          const items = [...state.items]
          const idx = items.findIndex((i) => lineKey(i.productId, i.variantId) === key)
          if (idx >= 0) {
            items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity }
          } else {
            items.push({ ...item, quantity })
          }
          return { items }
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => lineKey(i.productId, i.variantId) !== lineKey(productId, variantId),
          ),
        })),
      updateQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => lineKey(i.productId, i.variantId) !== lineKey(productId, variantId),
                )
              : state.items.map((i) =>
                  lineKey(i.productId, i.variantId) === lineKey(productId, variantId)
                    ? { ...i, quantity }
                    : i,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'alwahab-cart',
      storage: createSafeJSONStorage(),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
)

// Derived selectors (subscribe to the smallest slice → fewer re-renders).
export const useCartCount = (): number =>
  useCart((state) => state.items.reduce((total, item) => total + item.quantity, 0))

export const useCartSubtotal = (): number =>
  useCart((state) => state.items.reduce((total, item) => total + item.quantity * item.price, 0))
