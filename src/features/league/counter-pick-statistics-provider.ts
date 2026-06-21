import type { SupabaseClient } from "@supabase/supabase-js";

import {
  calculateCounterPickStatTier,
  fetchCounterPickStatsByEnemyAndRole,
} from "./counter-pick-stats";
import {
  getPublicCounterResultsForSelectedChampionStats,
  type CounterPickStatistics,
  type CounterPickStatisticsTier,
  minimumTrustedCounterPickGames,
  type PublicReviewedMechanicalCounter,
} from "./counter-pick-statistics";
import { useReviewedMechanicalCountersPublicly } from "./counter-ranking-v2";
import { calculateCounterPickConfidence } from "./counter-pick-confidence";
import type { LeagueRole } from "./roles";

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
  countersIntoSelectedChampion: Map<string, CounterPickStatistics>;
  error: string | null;
  selectedChampionGoodInto: Map<string, CounterPickStatistics>;
  /** @deprecated Use selectedChampionGoodInto. */
  selectedChampionStatsByEnemyChampion: Map<string, CounterPickStatistics>;
  /** @deprecated Use countersIntoSelectedChampion. */
  statisticsByCounterChampion: Map<string, CounterPickStatistics>;
};

type CounterRankingV2PublicReviewRow = {
  counter_champion_id: string;
  enemy_champion_id: string;
  public_eligible: boolean;
  review_status: string;
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
const counterRankingV2PublicReviewSelect = [
  "counter_champion_id",
  "enemy_champion_id",
  "public_eligible",
  "review_status",
].join(", ");

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
  const countersIntoSelectedChampion = new Map<string, CounterPickStatistics>();
  const selectedChampionGoodInto = new Map<string, CounterPickStatistics>();
  const counteredByResult = await fetchCounterPickStatsByEnemyAndRole({
    client,
    enemyChampionId: enemyChampion,
    patch,
    rankBracket: "all",
    role,
  });
  const reviewedMechanicalCounters = useReviewedMechanicalCountersPublicly
    ? await fetchPublicEligibleCounterRankingV2Reviews({
        client,
        enemyChampion,
        role,
      })
    : [];
  const publicResults = getPublicCounterResultsForSelectedChampionStats(
    counteredByResult.stats,
    enemyChampion,
    {
      reviewedMechanicalCounters,
      useReviewedMechanicalCounters: useReviewedMechanicalCountersPublicly,
    },
  );

  for (const result of publicResults.countersIntoSelectedChampion) {
    countersIntoSelectedChampion.set(
      normalizeCounterPickStatsKey(result.listedChampionId),
      result.statistics,
    );
  }

  for (const result of publicResults.selectedChampionGoodInto) {
    selectedChampionGoodInto.set(
      normalizeCounterPickStatsKey(result.listedChampionId),
      result.statistics,
    );
  }

  return {
    countersIntoSelectedChampion,
    error: counteredByResult.error,
    selectedChampionGoodInto,
    selectedChampionStatsByEnemyChampion: selectedChampionGoodInto,
    statisticsByCounterChampion: countersIntoSelectedChampion,
  };
}

async function fetchPublicEligibleCounterRankingV2Reviews({
  client,
  enemyChampion,
  role,
}: {
  client?: CounterPickStatsProviderClient | null;
  enemyChampion: string;
  role: LeagueRole;
}): Promise<PublicReviewedMechanicalCounter[]> {
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("counter_ranking_v2_mechanical_reviews")
    .select(counterRankingV2PublicReviewSelect)
    .eq("enemy_champion_id", enemyChampion)
    .eq("role", role)
    .eq("public_eligible", true)
    .in("review_status", ["verified_strong_counter", "verified_soft_counter"])
    .returns<CounterRankingV2PublicReviewRow[]>();

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    counterChampionId: row.counter_champion_id,
    enemyChampionId: row.enemy_champion_id,
    publicEligible: row.public_eligible,
    reviewStatus: row.review_status,
  }));
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
  const confidenceSort =
    confidenceSortValue[right.confidence] - confidenceSortValue[left.confidence];

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

function getCounterPickStatsConfidence(games: number): CounterPickStatsConfidence {
  const confidence = calculateCounterPickConfidence(games);

  if (confidence.level === "insufficient") {
    return "not_enough_data";
  }

  if (confidence.level === "strong") {
    return "high";
  }

  if (confidence.level === "moderate") {
    return "medium";
  }

  return "low";
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
