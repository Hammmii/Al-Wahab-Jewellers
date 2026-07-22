import { Resend } from 'resend'
import type { ReactElement } from 'react'

/**
 * Email sender (SERVER ONLY). Wraps Resend.
 * If RESEND_API_KEY isn't set, it logs and returns `skipped` instead of
 * throwing — so the app keeps working in dev / before email is configured.
 */

let client: Resend | null = null

function getEmailClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!client) client = new Resend(process.env.RESEND_API_KEY)
  return client
}

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[]
  subject: string
  react: ReactElement
}): Promise<{ id: string | null; skipped?: boolean; error?: unknown }> {
  const resend = getEmailClient()
  const from =
    process.env.MAIL_FROM ?? 'Al-Wahab Jewellers <noreply@alwahabjewellers.com>'

  if (!resend) {
    console.info('[email] RESEND_API_KEY not set — skipping send', { to, subject })
    return { id: null, skipped: true }
  }

  const { data, error } = await resend.emails.send({ from, to, subject, react })
  if (error) {
    console.error('[email] send failed', error)
    return { id: null, error }
  }
  return { id: data?.id ?? null }
}
