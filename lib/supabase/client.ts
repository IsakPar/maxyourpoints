import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
}

// Client for browser/frontend use with auth support
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Legacy exports for compatibility
export const createClient = () => supabase
export const createServiceRoleClient = () => {
  throw new Error("Service role client should only be used on server-side. Use server.ts instead.")
}
