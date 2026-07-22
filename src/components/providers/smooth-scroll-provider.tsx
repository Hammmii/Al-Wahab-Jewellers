'use client'

import { type ReactNode, useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Wraps the app in Lenis inertia-based smooth scrolling — the lightweight
 * (~3 KB) lever behind the "Cartier-style" weighted scroll feel.
 *
 * Accessibility: disabled entirely when the visitor prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
