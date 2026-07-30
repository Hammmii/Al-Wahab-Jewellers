import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { formatDate } from '@/lib/format'
import { CustomDesignsHeading, CustomDesignsEmpty } from '@/components/admin/admin-copy'

interface CustomDesignRow {
  id: string
  name: string
  email: string | null
  phone: string | null
  jewelry_type: string
  gold_type: string
  weight_grams: number | null
  budget: number | null
  description: string | null
  status: string
  created_at: string
}

async function getCustomDesigns(): Promise<CustomDesignRow[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('custom_design_requests')
    .select('id, name, email, phone, jewelry_type, gold_type, weight_grams, budget, description, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error || !data) {
    console.error('[admin:custom-designs] failed to fetch', error)
    return []
  }
  return data as CustomDesignRow[]
}

export default async function AdminCustomDesignsPage() {
  const rows = await getCustomDesigns()

  return (
    <div>
      <CustomDesignsHeading count={rows.length} />

      {rows.length === 0 ? (
        <CustomDesignsEmpty />
      ) : (
        <div className="surface-card mt-6 overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3">Date</th>
                  <th className="whitespace-nowrap px-4 py-3">Customer</th>
                  <th className="whitespace-nowrap px-4 py-3">Type</th>
                  <th className="whitespace-nowrap px-4 py-3">Gold</th>
                  <th className="whitespace-nowrap px-4 py-3">Budget</th>
                  <th className="whitespace-nowrap px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-secondary/40">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{r.name}</div>
                      {r.phone ? <div className="text-xs text-muted-foreground">{r.phone}</div> : null}
                      {r.email ? <div className="text-xs text-muted-foreground">{r.email}</div> : null}
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{r.jewelry_type}</td>
                    <td className="px-4 py-3 uppercase text-muted-foreground">{r.gold_type}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {r.budget ? `PKR ${r.budget.toLocaleString('en-PK')}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize">{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
