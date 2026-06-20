import type { SupabaseClient } from "@supabase/supabase-js";

import type { CounterPickSampleConfidence } from "@/src/features/league/counter-pick-statistics";
import type { LeagueRole } from "@/src/features/league/roles";
import { supabase } from "@/src/lib/supabase";

export type LeagueCounterPickMatchStatistic = {
  counter_champion_id: string;
  enemy_champion_id: string;
  games: number;
  id: number;
  last_updated_at: string;
  patch: string;
  role: LeagueRole;
  sample_confidence: CounterPickSampleConfidence;
  win_rate: number;
  wins: number;
};

export type LeagueCounterPickMatchStatisticsResult = {
  error: string | null;
  statistics: LeagueCounterPickMatchStatistic[];
};

type CounterPickMatchStatisticsClient = SupabaseClient;

type FetchCounterPickMatchStatisticsInput = {
  client?: CounterPickMatchStatisticsClient | null;
  enemyChampionId: string;
  role: LeagueRole;
};

const missingSupabaseConfigMessage =
  "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

const leagueCounterPickMatchStatisticSelect = [
  "counter_champion_id",
  "enemy_champion_id",
  "games",
  "id",
  "last_updated_at",
  "patch",
  "role",
  "sample_confidence",
  "win_rate",
  "wins",
].join(", ");

export async function fetchCounterPickMatchStatisticsByEnemyAndRole({
  client = supabase,
  enemyChampionId,
  role,
}: FetchCounterPickMatchStatisticsInput): Promise<LeagueCounterPickMatchStatisticsResult> {
  if (!client) {
    return {
      error: missingSupabaseConfigMessage,
      statistics: [],
    };
  }

  const { data, error } = await client
    .from("league_counter_pick_match_statistics")
    .select(leagueCounterPickMatchStatisticSelect)
    .eq("enemy_champion_id", enemyChampionId)
    .eq("role", role)
    .order("patch", { ascending: false })
    .order("games", { ascending: false })
    .returns<LeagueCounterPickMatchStatistic[]>();

  if (error) {
    return {
      error: error.message,
      statistics: [],
    };
  }

  return {
    error: null,
    statistics: keepNewestStatisticPerCounter(data ?? []),
  };
}

function keepNewestStatisticPerCounter(statistics: LeagueCounterPickMatchStatistic[]) {
  const statisticsByCounterChampion = new Map<string, LeagueCounterPickMatchStatistic>();

  for (const statistic of statistics) {
    if (!statisticsByCounterChampion.has(statistic.counter_champion_id)) {
      statisticsByCounterChampion.set(statistic.counter_champion_id, statistic);
    }
  }

  return Array.from(statisticsByCounterChampion.values());
}
