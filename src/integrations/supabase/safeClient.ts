import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Safe Supabase client creator that avoids crashing the app when env vars are missing.
let cachedClient: SupabaseClient<Database> | null | undefined;

export const getSupabaseClient = async (): Promise<SupabaseClient<Database> | null> => {
  // Return cached instance if we've already initialized (or determined it's unavailable)
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  // Fallback to known project configuration if env vars are not injected correctly
  const SUPABASE_URL = envUrl || "https://iipcadleylfbtithaauh.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = envKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcGNhZGxleWxmYnRpdGhhYXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzExNjYsImV4cCI6MjA3NjY0NzE2Nn0.2sPuZjK94O7e2TyUGRRzmE2VC9pg-EbmbOTh7opwglA";

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error("Supabase configuration is missing. Backend features are disabled.");
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
