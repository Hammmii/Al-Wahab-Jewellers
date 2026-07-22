/**
 * Whether Supabase env vars are present. Used to gracefully skip Supabase
 * operations (clients, middleware, data queries) before the project is wired up.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
