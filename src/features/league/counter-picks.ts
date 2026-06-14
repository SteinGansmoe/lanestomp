import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/src/lib/supabase";

import {
  compareCounterPickStatistics,
  getCounterPickStatisticsFromCounterPick,
} from "./counter-pick-statistics";
import type { LeagueRole } from "./roles";

export type LeagueCounterPickType = "best_counter" | "countered_by";
export type LeagueCounterPickStatus = "draft" | "reviewed";

export type LeagueCounterPick = {
  behind_build_path: CounterPickBuildPath | null;
  champion_id: string;
  common_build_vs: CounterPickBuildPath | null;
  counter_champion_id: string;
  counter_strength: string | null;
  counter_type: LeagueCounterPickType;
  created_at: string;
  games: number | null;
  generation_status: LeagueCounterPickStatus;
  id: number;
  patch: string | null;
  rank_filter: string | null;
  region: string | null;
  reason: string | null;
  role: LeagueRole;
  updated_at: string;
  win_rate: number | null;
};

export type LeagueCounterPickListResult = {
  counterPicks: LeagueCounterPick[];
  error: string | null;
};

export type LeagueCounterPickMutationResult = {
  counterPick: LeagueCounterPick | null;
  error: string | null;
};

export type LeagueCounterPickDeleteResult = {
  error: string | null;
  ok: boolean;
};

type CounterPickClient = SupabaseClient;

type FetchCounterPicksInput = {
  championId: string;
  client?: CounterPickClient | null;
  role: LeagueRole;
};

type UpsertCounterPickDraftInput = FetchCounterPicksInput & {
  behindBuildPath?: CounterPickBuildPath | null;
  commonBuildVs?: CounterPickBuildPath | null;
  counterChampionId: string;
  counterStrength?: string | null;
  counterType: LeagueCounterPickType;
  games?: number | null;
  patch?: string | null;
  rankFilter?: string | null;
  region?: string | null;
  reason?: string | null;
  winRate?: number | null;
};

type CounterPickByIdInput = {
  client?: CounterPickClient | null;
  counterPickId: number;
};

const missingSupabaseConfigMessage =
  "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export type CounterPickBuildPath = Record<string, unknown>;

const leagueCounterPickSelect = [
  "behind_build_path",
  "champion_id",
  "common_build_vs",
  "counter_champion_id",
  "counter_strength",
  "counter_type",
  "created_at",
  "games",
  "generation_status",
  "id",
  "patch",
  "rank_filter",
  "region",
  "reason",
  "role",
  "updated_at",
  "win_rate",
].join(", ");

export async function fetchReviewedCounterPicksByChampionAndRole({
  championId,
  client = supabase,
  role,
}: FetchCounterPicksInput): Promise<LeagueCounterPickListResult> {
  if (!client) {
    return {
      counterPicks: [],
      error: missingSupabaseConfigMessage,
    };
  }

  const { data, error } = await client
    .from("league_counter_picks")
    .select(leagueCounterPickSelect)
    .eq("champion_id", championId)
    .eq("role", role)
    .eq("generation_status", "reviewed")
    .order("counter_type", { ascending: true })
    .order("counter_champion_id", { ascending: true })
    .returns<LeagueCounterPick[]>();

  if (error) {
    return {
      counterPicks: [],
      error: error.message,
    };
  }

  return {
    counterPicks: sortCounterPicksByTrustedScore(data ?? []),
    error: null,
  };
}

export async function fetchAdminCounterPicksByChampionAndRole({
  championId,
  client = supabase,
  role,
}: FetchCounterPicksInput): Promise<LeagueCounterPickListResult> {
  if (!client) {
    return {
      counterPicks: [],
      error: missingSupabaseConfigMessage,
    };
  }

  const { data, error } = await client
    .from("league_counter_picks")
    .select(leagueCounterPickSelect)
    .eq("champion_id", championId)
    .eq("role", role)
    .order("generation_status", { ascending: true })
    .order("counter_type", { ascending: true })
    .order("counter_champion_id", { ascending: true })
    .returns<LeagueCounterPick[]>();

  if (error) {
    return {
      counterPicks: [],
      error: error.message,
    };
  }

  return {
    counterPicks: sortCounterPicksByTrustedScore(data ?? []),
    error: null,
  };
}

export async function upsertCounterPickDraft({
  behindBuildPath = null,
  championId,
  client = supabase,
  commonBuildVs = null,
  counterChampionId,
  counterStrength = null,
  counterType,
  games = null,
  patch = null,
  rankFilter = null,
  region = null,
  reason = null,
  role,
  winRate = null,
}: UpsertCounterPickDraftInput): Promise<LeagueCounterPickMutationResult> {
  if (!client) {
    return {
      counterPick: null,
      error: missingSupabaseConfigMessage,
    };
  }

  const { data, error } = await client
    .from("league_counter_picks")
    .upsert(
      {
        behind_build_path: behindBuildPath,
        champion_id: championId,
        common_build_vs: commonBuildVs,
        counter_champion_id: counterChampionId,
        counter_strength: counterStrength,
        counter_type: counterType,
        games,
        generation_status: "draft",
        patch,
        rank_filter: rankFilter,
        region,
        reason,
        role,
        win_rate: winRate,
      },
      {
        onConflict: "champion_id,counter_champion_id,role,counter_type",
      },
    )
    .select(leagueCounterPickSelect)
    .maybeSingle<LeagueCounterPick>();

  if (error || !data) {
    return {
      counterPick: null,
      error: error?.message ?? "Counter pick draft could not be saved.",
    };
  }

  return {
    counterPick: data,
    error: null,
  };
}

export async function markCounterPickAsReviewed({
  client = supabase,
  counterPickId,
}: CounterPickByIdInput): Promise<LeagueCounterPickMutationResult> {
  if (!client) {
    return {
      counterPick: null,
      error: missingSupabaseConfigMessage,
    };
  }

  const { data, error } = await client
    .from("league_counter_picks")
    .update({
      generation_status: "reviewed",
    })
    .eq("id", counterPickId)
    .select(leagueCounterPickSelect)
    .maybeSingle<LeagueCounterPick>();

  if (error || !data) {
    return {
      counterPick: null,
      error: error?.message ?? "Counter pick could not be marked as reviewed.",
    };
  }

  return {
    counterPick: data,
    error: null,
  };
}

export async function deleteCounterPick({
  client = supabase,
  counterPickId,
}: CounterPickByIdInput): Promise<LeagueCounterPickDeleteResult> {
  if (!client) {
    return {
      error: missingSupabaseConfigMessage,
      ok: false,
    };
  }

  const { error } = await client.from("league_counter_picks").delete().eq("id", counterPickId);

  if (error) {
    return {
      error: error.message,
      ok: false,
    };
  }

  return {
    error: null,
    ok: true,
  };
}

function sortCounterPicksByTrustedScore(counterPicks: LeagueCounterPick[]) {
  return [...counterPicks].sort((left, right) => {
    const counterTypeOrder = left.counter_type.localeCompare(right.counter_type);

    if (counterTypeOrder !== 0) {
      return counterTypeOrder;
    }

    const statisticsSort = compareCounterPickStatistics(
      getCounterPickStatisticsFromCounterPick(left),
      getCounterPickStatisticsFromCounterPick(right),
      left.counter_type === "best_counter" ? "desc" : "asc",
    );

    if (statisticsSort !== 0) {
      return statisticsSort;
    }

    return left.counter_champion_id.localeCompare(right.counter_champion_id);
  });
}
