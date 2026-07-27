import { GoldRateManager } from '@/components/admin/gold-rate-manager'

export default async function AdminGoldRatesPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl text-foreground">Gold Rates</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter today's real Sarafa Bazar rate. This updates the live rate shown across the site.
      </p>
      <div className="mt-8">
        <GoldRateManager />
      </div>
    </div>
  )
}
