'use client'

import { useEffect, useState } from 'react'

/**
 * First-visit branded intro. Plays a full-screen gold splash once per session,
 * then fades out. Skipped on subsequent navigations and for reduced-motion users.
 */
export function IntroLoader() {
  const [show, setShow] = useState(false)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try {
      if (sessionStorage.getItem('alwahab-intro-seen')) return
    } catch {
      return
    }
    setShow(true)
    const hideTimer = setTimeout(() => setHiding(true), 1900)
    const removeTimer = setTimeout(() => setShow(false), 2500)
    try {
      sessionStorage.setItem('alwahab-intro-seen', '1')
    } catch {
      /* ignore */
    }
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!show) return null

  return (
    <div
      className={`bg-hero-pattern fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500 ${
        hiding ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <svg
          viewBox="0 0 100 100"
          className="h-20 w-20 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M50,4 L80,22 L92,50 L80,78 L50,96 L20,78 L8,50 L20,22 Z" className="intro-draw" />
          <path d="M50,4 L50,96 M8,50 L92,50" strokeWidth="0.75" opacity="0.45" className="intro-draw intro-draw-delay" />
          <text x="50" y="60" textAnchor="middle" fontFamily="var(--font-headline), serif" fontSize="32" fill="currentColor" stroke="none" className="intro-fade">
            AW
          </text>
        </svg>
        <div className="intro-fade intro-fade-delay text-center">
          <p className="font-urdu text-3xl text-gold-shimmer">الوَہاب جیولرز</p>
          <p className="mt-1 font-headline text-xs uppercase tracking-luxury text-muted-foreground">
            Al-Wahab Jewellers
          </p>
        </div>
      </div>

      <style>{`
        @keyframes introDraw { to { stroke-dashoffset: 0; } }
        @keyframes introFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .intro-draw { stroke-dasharray: 320; stroke-dashoffset: 320; animation: introDraw 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .intro-draw-delay { animation-delay: 0.15s; }
        .intro-fade { opacity: 0; animation: introFade 0.6s ease forwards; }
        .intro-fade-delay { animation-delay: 0.6s; }
      `}</style>
    </div>
  )
}
