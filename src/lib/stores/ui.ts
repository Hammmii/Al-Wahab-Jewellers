import { create } from 'zustand'

/**
 * Ephemeral UI state (not persisted): cart drawer, mobile menu, search overlay.
 */
interface UIState {
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
}))
