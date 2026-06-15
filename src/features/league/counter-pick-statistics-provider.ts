import type { SupabaseClient } from "@supabase/supabase-js";

import {
  calculateCounterPickStatTier,
  fetchCounterPickStatsByCounterAndRole,
  fetchCounterPickStatsByEnemyAndRole,
  type CounterPickStat,
} from "@/src/features/league/counter-pick-stats";
import {
  type CounterPickStatistics,
  type CounterPickStatisticsTier,
  minimumTrustedCounterPickGames,
  publicCounterPickLowSampleThreshold,
} from "@/src/features/league/counter-pick-statistics";
import type { LeagueRole } from "@/src/features/league/roles";

export type CounterPickStatsConfidence = "high" | "low" | "medium" | "not_enough_data";

export type CounterPickMatchupStats = {
  confidence: CounterPickStatsConfidence;
  counterChampion: string;
  enemyChampion: string;
  games: number;
  lastUpdatedAt: string;
  patch: string;
  role: LeagueRole;
  tier: CounterPickStatisticsTier;
  winRate: number;
  wins: number;
};

type CounterPickStatsProviderClient = SupabaseClient;

type CounterPickStatsInput = {
  counterChampion: string;
  enemyChampion: string;
  patch?: string | null;
  role: LeagueRole;
};

type FetchCounterPickStatsInput = {
  client?: CounterPickStatsProviderClient | null;
  enemyChampion: string;
  patch?: string | null;
  role: LeagueRole;
};

type CounterPickStatsResult = {
  error: string | null;
  selectedChampionStatsByEnemyChampion: Map<string, CounterPickStatistics>;
  statisticsByCounterChampion: Map<string, CounterPickStatistics>;
};

type CalculateCounterTierInput = {
  confidence: CounterPickStatsConfidence;
  games: number;
  winRate: number;
};

type MockCounterPickStatsSeed = Omit<
  CounterPickMatchupStats,
  "confidence" | "lastUpdatedAt" | "tier" | "wins"
> & {
  lastUpdatedAt?: string;
};

const defaultMockPatch = "15.12";
const mockLastUpdatedAt = "2026-06-14T00:00:00.000Z";

const confidenceSortValue = {
  high: 3,
  medium: 2,
  low: 1,
  not_enough_data: 0,
} as const satisfies Record<CounterPickStatsConfidence, number>;

const tierSortValue = {
  "S+": 5,
  S: 4,
  A: 3,
  B: 2,
  C: 1,
  D: 0,
} as const satisfies Record<CounterPickStatisticsTier, number>;

const mockCounterPickStats = [
  createMockCounterPickStats({
    counterChampion: "Yasuo",
    enemyChampion: "Ahri",
    games: 12481,
    patch: defaultMockPatch,
    role: "mid",
    winRate: 53.4,
  }),
  createMockCounterPickStats({
    counterChampion: "Lissandra",
    enemyChampion: "Ahri",
    games: 18492,
    patch: defaultMockPatch,
    role: "mid",
    winRate: 54.1,
  }),
  createMockCounterPickStats({
    counterChampion: "Malzahar",
    enemyChampion: "Ahri",
    games: 9328,
    patch: defaultMockPatch,
    role: "mid",
    winRate: 52.2,
  }),
  createMockCounterPickStats({
    counterChampion: "Syndra",
    enemyChampion: "Ahri",
    games: 3275,
    patch: defaultMockPatch,
    role: "mid",
    winRate: 51.4,
  }),
  createMockCounterPickStats({
    counterChampion: "Lissandra",
    enemyChampion: "Yone",
    games: 9176,
    patch: defaultMockPatch,
    role: "mid",
    winRate: 54.8,
  }),
  createMockCounterPickStats({
    counterChampion: "Pantheon",
    enemyChampion: "Yone",
    games: 6410,
    patch: defaultMockPatch,
    role: "mid",
    winRate: 53.2,
  }),
  createMockCounterPickStats({
    counterChampion: "Renekton",
    enemyChampion: "Yone",
    games: 1372,
    patch: defaultMockPatch,
    role: "mid",
    winRate: 52.6,
  }),
] satisfies CounterPickMatchupStats[];

const mockCounterPickStatsByKey = new Map(
  mockCounterPickStats.map((stats) => [getCounterPickStatsKey(stats), stats]),
);

export async function fetchCounterPickStatsForEnemy({
  client,
  enemyChampion,
  patch = null,
  role,
}: FetchCounterPickStatsInput): Promise<CounterPickStatsResult> {
  const statisticsByCounterChampion = new Map<string, CounterPickStatistics>();
  const selectedChampionStatsByEnemyChampion = new Map<string, CounterPickStatistics>();
  const [counteredByResult, selectedCountersResult] = await Promise.all([
    fetchCounterPickStatsByEnemyAndRole({
      client,
      enemyChampionId: enemyChampion,
      patch,
      rankBracket: "all",
      role,
    }),
    fetchCounterPickStatsByCounterAndRole({
      client,
      counterChampionId: enemyChampion,
      patch,
      rankBracket: "all",
      role,
    }),
  ]);

  for (const stat of counteredByResult.stats) {
    statisticsByCounterChampion.set(
      normalizeCounterPickStatsKey(stat.counter_champion_id),
      getCounterPickStatisticsFromProviderStats(
        getSelectedChampionStatisticsFromCounteredByStoredStat(stat),
      ),
    );
  }

  for (const stat of selectedCountersResult.stats) {
    selectedChampionStatsByEnemyChampion.set(
      normalizeCounterPickStatsKey(stat.enemy_champion_id),
      getCounterPickStatisticsFromProviderStats(getCounterPickStatsFromStoredStat(stat)),
    );
  }

  return {
    error: counteredByResult.error ?? selectedCountersResult.error,
    selectedChampionStatsByEnemyChampion,
    statisticsByCounterChampion,
  };
}

export async function fetchCounterPickStatsForSelectedChampion({
  client,
  enemyChampion,
  patch = null,
  role,
}: FetchCounterPickStatsInput): Promise<CounterPickStatsResult> {
  return fetchCounterPickStatsForEnemy({
    client,
    enemyChampion,
    patch,
    role,
  });
}

export function getCounterPickStats({
  counterChampion,
  enemyChampion,
  patch = null,
  role,
}: CounterPickStatsInput): CounterPickMatchupStats {
  const requestedPatch = patch ?? defaultMockPatch;
  const stats = mockCounterPickStatsByKey.get(
    getCounterPickStatsKey({
      counterChampion,
      enemyChampion,
      patch: requestedPatch,
      role,
    }),
  );

  return (
    stats ??
    getNotEnoughDataCounterPickStats({
      counterChampion,
      enemyChampion,
      patch: requestedPatch,
      role,
    })
  );
}

export function calculateCounterTier({
  confidence,
  games,
  winRate,
}: CalculateCounterTierInput): CounterPickStatisticsTier {
  if (confidence === "not_enough_data" || games < minimumTrustedCounterPickGames) {
    return "D";
  }

  const baseTier = calculateCounterPickStatTier({ games, winRate });

  if (confidence === "low" && tierSortValue[baseTier] > tierSortValue.A) {
    return "A";
  }

  return baseTier;
}

export function compareCounterPickProviderStats(
  left: CounterPickMatchupStats,
  right: CounterPickMatchupStats,
  direction: "asc" | "desc",
) {
  const confidenceSort = confidenceSortValue[right.confidence] - confidenceSortValue[left.confidence];

  if (confidenceSort !== 0) {
    return confidenceSort;
  }

  const tierSort =
    direction === "desc"
      ? tierSortValue[right.tier] - tierSortValue[left.tier]
      : tierSortValue[left.tier] - tierSortValue[right.tier];

  if (tierSort !== 0) {
    return tierSort;
  }

  if (left.winRate !== right.winRate) {
    return direction === "desc" ? right.winRate - left.winRate : left.winRate - right.winRate;
  }

  return right.games - left.games;
}

function createMockCounterPickStats(seed: MockCounterPickStatsSeed): CounterPickMatchupStats {
  const wins = Math.round(seed.games * (seed.winRate / 100));
  const confidence = getCounterPickStatsConfidence(seed.games);

  return {
    ...seed,
    confidence,
    lastUpdatedAt: seed.lastUpdatedAt ?? mockLastUpdatedAt,
    tier: calculateCounterTier({
      confidence,
      games: seed.games,
      winRate: seed.winRate,
    }),
    wins,
  };
}

function getCounterPickStatsFromStoredStat(
  stat: CounterPickStat,
): CounterPickMatchupStats {
  const confidence = getCounterPickStatsConfidence(stat.games);

  return {
    confidence,
    counterChampion: stat.counter_champion_id,
    enemyChampion: stat.enemy_champion_id,
    games: stat.games,
    lastUpdatedAt: stat.updated_at,
    patch: stat.patch,
    role: stat.role,
    tier: stat.tier,
    winRate: stat.win_rate,
    wins: stat.wins,
  };
}

function getSelectedChampionStatisticsFromCounteredByStoredStat(
  stat: CounterPickStat,
): CounterPickMatchupStats {
  const selectedChampionWins = stat.losses;
  const selectedChampionWinRate =
    stat.games > 0 ? Number((100 - Number(stat.win_rate)).toFixed(2)) : 0;
  const confidence = getCounterPickStatsConfidence(stat.games);

  return {
    confidence,
    counterChampion: stat.enemy_champion_id,
    enemyChampion: stat.counter_champion_id,
    games: stat.games,
    lastUpdatedAt: stat.updated_at,
    patch: stat.patch,
    role: stat.role,
    tier: stat.tier,
    winRate: selectedChampionWinRate,
    wins: selectedChampionWins,
  };
}

function getCounterPickStatisticsFromProviderStats(
  stats: CounterPickMatchupStats,
): CounterPickStatistics {
  return {
    games: stats.games,
    lastUpdatedAt: stats.lastUpdatedAt,
    patch: stats.patch,
    rankFilter: null,
    region: null,
    sampleConfidence: stats.confidence === "not_enough_data" ? "low_sample" : stats.confidence,
    source: "provider",
    tier: stats.confidence === "not_enough_data" ? null : stats.tier,
    winRate: stats.confidence === "not_enough_data" ? null : stats.winRate,
    wins: stats.wins,
  };
}

function getNotEnoughDataCounterPickStats({
  counterChampion,
  enemyChampion,
  patch,
  role,
}: Omit<CounterPickStatsInput, "patch"> & { patch: string }): CounterPickMatchupStats {
  return {
    confidence: "not_enough_data",
    counterChampion,
    enemyChampion,
    games: 0,
    lastUpdatedAt: "",
    patch,
    role,
    tier: "D",
    winRate: 0,
    wins: 0,
  };
}

function getCounterPickStatsConfidence(games: number): CounterPickStatsConfidence {
  if (games <= 0) {
    return "not_enough_data";
  }

  if (games < publicCounterPickLowSampleThreshold) {
    return "low";
  }

  if (games < 500) {
    return "low";
  }

  if (games < 1000) {
    return "medium";
  }

  return "high";
}

function getCounterPickStatsKey({
  counterChampion,
  enemyChampion,
  patch,
  role,
}: Pick<CounterPickMatchupStats, "counterChampion" | "enemyChampion" | "patch" | "role">) {
  return [
    normalizeCounterPickStatsKey(enemyChampion),
    normalizeCounterPickStatsKey(counterChampion),
    role,
    patch,
  ].join("::");
}

function normalizeCounterPickStatsKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
