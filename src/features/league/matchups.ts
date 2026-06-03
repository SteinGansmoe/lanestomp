import { supabase } from "@/src/lib/supabase";

import type { LeagueChampion } from "./champions";
import { isChampionInRole } from "./champion-roles";
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

export type LeagueMatchupCoverage = {
  generatedCount: number;
  percentComplete: number;
  roleChampionCount: number;
  totalCount: number;
};

export type LeagueMatchupCoverageResult = {
  coverage: LeagueMatchupCoverage;
  error: string | null;
};

type GetLeagueMatchupInput = {
  championAId: string;
  championBId: string;
  role: LeagueRole;
};

type GetLeagueMatchupCoverageInput = {
  champions: LeagueChampion[];
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

export async function getLeagueMatchupCoverage({
  champions,
  role,
}: GetLeagueMatchupCoverageInput): Promise<LeagueMatchupCoverageResult> {
  const roleChampions = champions.filter((champion) =>
    isChampionInRole(champion, role)
  );
  const totalCount = roleChampions.length * Math.max(roleChampions.length - 1, 0);
  const emptyCoverage = {
    generatedCount: 0,
    percentComplete: 0,
    roleChampionCount: roleChampions.length,
    totalCount,
  };

  if (!supabase || totalCount === 0) {
    return {
      coverage: emptyCoverage,
      error: supabase
        ? null
        : "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { count, error } = await supabase
    .from("league_matchups")
    .select("id", { count: "exact", head: true })
    .eq("role", role)
    .eq("generation_status", "reviewed");

  if (error) {
    return {
      coverage: emptyCoverage,
      error: error.message,
    };
  }

  const generatedCount = Math.min(count ?? 0, totalCount);

  return {
    coverage: {
      generatedCount,
      percentComplete:
        totalCount > 0 ? Math.round((generatedCount / totalCount) * 100) : 0,
      roleChampionCount: roleChampions.length,
      totalCount,
    },
    error: null,
  };
}
