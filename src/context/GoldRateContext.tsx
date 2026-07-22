'use client'

import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { GoldRate } from '@/lib/gold-rates'

type GoldRateContextType = {
  rates: GoldRate[] | null
  lastUpdated: string | null
  isLoading: boolean
  refresh: () => void
}

const GoldRateContext = createContext<GoldRateContextType | undefined>(undefined)

/**
 * Fetches REAL gold rates from /api/gold-rates (which reads the Supabase
 * `current_gold_rates` view). No fabricated/placeholder numbers are ever shown —
 * `rates` is null until real data exists.
 */
export function GoldRateProvider({ children }: { children: ReactNode }) {
  const [rates, setRates] = useState<GoldRate[] | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const res = await fetch('/api/gold-rates', { cache: 'no-store' })
        const data = (await res.json()) as { rates: GoldRate[] | null; lastUpdated: string | null }
        if (!active) return
        setRates(data.rates)
        setLastUpdated(data.lastUpdated)
      } catch {
        if (active) {
          setRates(null)
          setLastUpdated(null)
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    // Refresh hourly while the tab is open.
    const id = setInterval(load, 60 * 60 * 1000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [tick])

  return (
    <GoldRateContext.Provider value={{ rates, lastUpdated, isLoading, refresh }}>
      {children}
    </GoldRateContext.Provider>
  )
}

export function useGoldRates() {
  const context = useContext(GoldRateContext)
  if (context === undefined) {
    throw new Error('useGoldRates must be used within a GoldRateProvider')
  }
  return context
}
