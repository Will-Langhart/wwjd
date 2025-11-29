import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Safe Supabase client creator that avoids crashing the app when env vars are missing.
let cachedClient: SupabaseClient<Database> | null | undefined;

export const getSupabaseClient = async (): Promise<SupabaseClient<Database> | null> => {
  // Return cached instance if we've already initialized (or determined it's unavailable)
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error("Supabase environment variables are missing. Backend features are disabled.");
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return cachedClient;
};
