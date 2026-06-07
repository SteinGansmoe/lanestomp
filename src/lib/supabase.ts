import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const missingSupabaseConfigMessage =
  "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.";

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function getSupabaseGameCount() {
  if (!supabase) {
    return {
      count: null,
      error: missingSupabaseConfigMessage,
    };
  }

  const { count, error } = await supabase
    .from("games")
    .select("id", { count: "exact", head: true });

  if (error) {
    return {
      count: null,
      error: error.message,
    };
  }

  return {
    count: count ?? 0,
    error: null,
  };
}
