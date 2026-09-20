import { createBrowserClient } from "@supabase/ssr";

// Supabase client for use in the browser (Client Components).
// Reads config from NEXT_PUBLIC_ env vars set in .env.local.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
