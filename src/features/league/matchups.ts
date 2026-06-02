import { supabase } from "@/src/lib/supabase";

import type { LeagueRole } from "./roles";

export type LeagueMatchup = {
  champion_a_id: string;
  champion_b_id: string;
  generation_status: "draft" | "reviewed";
  role: LeagueRole;
  overview: string | null;
  early_game: string | null;
  trading_pattern: string | null;
  power_spikes: string | null;
  danger_windows: string | null;
  win_conditions: string | null;
  difficulty_rating: number | null;
  confidence_level: string | null;
  id: number;
  updated_at: string | null;
};

export type LeagueMatchupResult = {
  error: string | null;
  matchup: LeagueMatchup | null;
};

type GetLeagueMatchupInput = {
  championAId: string;
  championBId: string;
  role: LeagueRole;
};

export async function getLeagueMatchup({
  championAId,
  championBId,
  role,
}: GetLeagueMatchupInput): Promise<LeagueMatchupResult> {
  if (!supabase) {
    return {
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      matchup: null,
    };
  }

  const { data, error } = await supabase
    .from("league_matchups")
    .select(
      [
        "champion_a_id",
        "champion_b_id",
        "generation_status",
        "role",
        "overview",
        "early_game",
        "trading_pattern",
        "power_spikes",
        "danger_windows",
        "win_conditions",
        "difficulty_rating",
        "confidence_level",
        "id",
        "updated_at",
      ].join(", ")
    )
    .eq("champion_a_id", championAId)
    .eq("champion_b_id", championBId)
    .eq("role", role)
    .eq("generation_status", "reviewed")
    .maybeSingle<LeagueMatchup>();

  if (error) {
    return {
      error: error.message,
      matchup: null,
    };
  }

  return {
    error: null,
    matchup: data,
  };
}
