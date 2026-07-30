import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { formatDate } from '@/lib/format'
import { MessagesHeading, MessagesEmpty } from '@/components/admin/admin-copy'

interface MessageRow {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: string
  created_at: string
}

async function getMessages(): Promise<MessageRow[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id, name, email, phone, message, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error || !data) {
    console.error('[admin:messages] failed to fetch', error)
    return []
  }
  return data as MessageRow[]
}

export default async function AdminMessagesPage() {
  const rows = await getMessages()

  return (
    <div>
      <MessagesHeading count={rows.length} />

      {rows.length === 0 ? (
        <MessagesEmpty />
      ) : (
        <div className="surface-card mt-6 overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3">Date</th>
                  <th className="whitespace-nowrap px-4 py-3">From</th>
                  <th className="whitespace-nowrap px-4 py-3">Contact</th>
                  <th className="whitespace-nowrap px-4 py-3">Message</th>
                  <th className="whitespace-nowrap px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-secondary/40">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3 text-foreground">{r.name}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-muted-foreground">{r.phone}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                    </td>
                    <td className="max-w-md px-4 py-3 text-muted-foreground">
                      <p className="line-clamp-3">{r.message}</p>
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
