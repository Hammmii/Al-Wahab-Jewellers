'use client'

import { useEffect, useState } from 'react'
import { useCart, useWishlist } from './cart-wishlist-stores'

/**
 * Hydration-safe selectors for cart/wishlist counts.
 *
 * Returns 0 on the server and the first client render (matching the server
 * output), then the real persisted count after mount — avoiding React
 * hydration mismatches while keeping the components that use these (Header,
 * cart badge, etc.) server-renderable.
 */

export function useCartCount(): number {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  return mounted ? count : 0
}

export function useWishlistCount(): number {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const count = useWishlist((s) => s.ids.length)
  return mounted ? count : 0
}
