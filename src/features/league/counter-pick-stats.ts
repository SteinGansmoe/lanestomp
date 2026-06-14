import type { SupabaseClient } from "@supabase/supabase-js";

import type { LeagueRole } from "@/src/features/league/roles";
import { supabase } from "@/src/lib/supabase";

export type CounterPickStatTier = "A" | "B" | "C" | "S" | "S+";

export type CounterPickStat = {
  counter_champion_id: string;
  enemy_champion_id: string;
  games: number;
  id: number;
  losses: number;
  patch: string;
  role: LeagueRole;
  tier: CounterPickStatTier;
  updated_at: string;
  win_rate: number;
  wins: number;
};

export type CounterPickStatRowInput = {
  counterChampionId: string;
  enemyChampionId: string;
  games: number;
  losses?: number | null;
  patch: string;
  role: LeagueRole;
  tier?: CounterPickStatTier | null;
  winRate?: number | null;
  wins: number;
};

export type CounterPickStatsResult = {
  error: string | null;
  stats: CounterPickStat[];
};

export type CounterPickStatMutationResult = {
  error: string | null;
  stat: CounterPickStat | null;
};

type CounterPickStatsClient = SupabaseClient;

type FetchCounterPickStatsInput = {
  client?: CounterPickStatsClient | null;
  enemyChampionId: string;
  patch?: string | null;
  role: LeagueRole;
};

type FetchCounterPickStatInput = FetchCounterPickStatsInput & {
  counterChampionId: string;
};

type UpsertCounterPickStatInput = {
  client?: CounterPickStatsClient | null;
  stat: CounterPickStatRowInput;
};

type CalculateCounterPickStatTierInput = {
  games: number;
  winRate: number;
};

const missingSupabaseConfigMessage =
  "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

const counterPickStatSelect = [
  "counter_champion_id",
  "enemy_champion_id",
  "games",
  "id",
  "losses",
  "patch",
  "role",
  "tier",
  "updated_at",
  "win_rate",
  "wins",
].join(", ");

const counterPickStatTierThresholds = [
  { minimumWinRate: 56, tier: "S+" },
  { minimumWinRate: 53, tier: "S" },
  { minimumWinRate: 51, tier: "A" },
  { minimumWinRate: 49, tier: "B" },
  { minimumWinRate: 0, tier: "C" },
] as const satisfies ReadonlyArray<{
  minimumWinRate: number;
  tier: CounterPickStatTier;
}>;

export async function fetchCounterPickStatsByEnemyAndRole({
  client = supabase,
  enemyChampionId,
  patch = null,
  role,
}: FetchCounterPickStatsInput): Promise<CounterPickStatsResult> {
  if (!client) {
    return {
      error: missingSupabaseConfigMessage,
      stats: [],
    };
  }

  let query = client
    .from("counter_pick_stats")
    .select(counterPickStatSelect)
    .eq("enemy_champion_id", enemyChampionId)
    .eq("role", role)
    .order("patch", { ascending: false })
    .order("games", { ascending: false });

  if (patch) {
    query = query.eq("patch", patch);
  }

  const { data, error } = await query.returns<CounterPickStat[]>();

  if (error) {
    return {
      error: error.message,
      stats: [],
    };
  }

  return {
    error: null,
    stats: keepNewestCounterPickStatPerCounter(data ?? []),
  };
}

export async function fetchCounterPickStat({
  client = supabase,
  counterChampionId,
  enemyChampionId,
  patch = null,
  role,
}: FetchCounterPickStatInput): Promise<CounterPickStatMutationResult> {
  if (!client) {
    return {
      error: missingSupabaseConfigMessage,
      stat: null,
    };
  }

  let query = client
    .from("counter_pick_stats")
    .select(counterPickStatSelect)
    .eq("enemy_champion_id", enemyChampionId)
    .eq("counter_champion_id", counterChampionId)
    .eq("role", role)
    .order("patch", { ascending: false })
    .limit(1);

  if (patch) {
    query = query.eq("patch", patch);
  }

  const { data, error } = await query.returns<CounterPickStat[]>();

  if (error) {
    return {
      error: error.message,
      stat: null,
    };
  }

  return {
    error: null,
    stat: data?.[0] ?? null,
  };
}

export async function upsertCounterPickStat({
  client = supabase,
  stat,
}: UpsertCounterPickStatInput): Promise<CounterPickStatMutationResult> {
  if (!client) {
    return {
      error: missingSupabaseConfigMessage,
      stat: null,
    };
  }

  const wins = clampCount(stat.wins);
  const providedLosses = stat.losses === null || stat.losses === undefined ? null : clampCount(stat.losses);
  const requestedGames = Math.max(clampCount(stat.games), wins);
  const losses = providedLosses ?? Math.max(requestedGames - wins, 0);
  const games = wins + losses;
  const winRate = stat.winRate ?? calculateCounterPickStatWinRate({ games, wins });
  const tier = stat.tier ?? calculateCounterPickStatTier({ games, winRate });

  const { data, error } = await client
    .from("counter_pick_stats")
    .upsert(
      {
        counter_champion_id: stat.counterChampionId,
        enemy_champion_id: stat.enemyChampionId,
        games,
        losses,
        patch: stat.patch,
        role: stat.role,
        tier,
        win_rate: winRate,
        wins,
      },
      {
        onConflict: "enemy_champion_id,counter_champion_id,role,patch",
      },
    )
    .select(counterPickStatSelect)
    .maybeSingle<CounterPickStat>();

  if (error || !data) {
    return {
      error: error?.message ?? "Counter pick stat could not be saved.",
      stat: null,
    };
  }

  return {
    error: null,
    stat: data,
  };
}

export function calculateCounterPickStatTier({
  games,
  winRate,
}: CalculateCounterPickStatTierInput): CounterPickStatTier {
  if (games <= 0) {
    return "C";
  }

  return (
    counterPickStatTierThresholds.find((threshold) => winRate >= threshold.minimumWinRate)?.tier ??
    "C"
  );
}

export function calculateCounterPickStatWinRate({
  games,
  wins,
}: {
  games: number;
  wins: number;
}) {
  if (games <= 0) {
    return 0;
  }

  return Number(((wins / games) * 100).toFixed(2));
}

function keepNewestCounterPickStatPerCounter(stats: CounterPickStat[]) {
  const statsByCounterChampion = new Map<string, CounterPickStat>();

  for (const stat of stats) {
    if (!statsByCounterChampion.has(stat.counter_champion_id)) {
      statsByCounterChampion.set(stat.counter_champion_id, stat);
    }
  }

  return Array.from(statsByCounterChampion.values());
}

function clampCount(value: number) {
  return Math.max(Math.trunc(value), 0);
}
