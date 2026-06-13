import type { LeagueCounterPick } from "@/src/features/league/counter-picks";

export type CounterPickStatisticsTier = "A" | "B" | "C" | "S" | "S+";
export type CounterPickStatisticsSource = "league_counter_picks" | "manual" | "provider";

export type CounterPickStatistics = {
  games: number | null;
  patch: string | null;
  rankFilter: string | null;
  region: string | null;
  source: CounterPickStatisticsSource;
  tier: CounterPickStatisticsTier | null;
  winRate: number | null;
};

export type CounterPickStatisticsTierThreshold = {
  minimumWinRate: number;
  tier: CounterPickStatisticsTier;
};

export const counterPickStatisticsTierThresholds: CounterPickStatisticsTierThreshold[] = [
  { minimumWinRate: 55, tier: "S+" },
  { minimumWinRate: 53, tier: "S" },
  { minimumWinRate: 51, tier: "A" },
  { minimumWinRate: 49, tier: "B" },
  { minimumWinRate: 0, tier: "C" },
];

export const emptyCounterPickStatistics: CounterPickStatistics = {
  games: null,
  patch: null,
  rankFilter: null,
  region: null,
  source: "manual",
  tier: null,
  winRate: null,
};

export function getCounterPickStatisticsFromCounterPick(
  counterPick: Pick<
    LeagueCounterPick,
    "games" | "patch" | "rank_filter" | "region" | "win_rate"
  >,
): CounterPickStatistics {
  return {
    games: counterPick.games,
    patch: counterPick.patch,
    rankFilter: counterPick.rank_filter,
    region: counterPick.region,
    source: "league_counter_picks",
    tier: getCounterPickStatisticsTier(counterPick.win_rate),
    winRate: counterPick.win_rate,
  };
}

export function getCounterPickStatisticsTier(winRate: number | null) {
  if (winRate === null) {
    return null;
  }

  return (
    counterPickStatisticsTierThresholds.find(
      (threshold) => winRate >= threshold.minimumWinRate,
    )?.tier ?? "C"
  );
}

export function hasCounterPickStatistics(statistics: CounterPickStatistics) {
  return statistics.winRate !== null || statistics.games !== null;
}

export function compareCounterPickStatistics(
  left: CounterPickStatistics,
  right: CounterPickStatistics,
  direction: "asc" | "desc",
) {
  if (left.winRate !== null && right.winRate !== null && left.winRate !== right.winRate) {
    return direction === "desc" ? right.winRate - left.winRate : left.winRate - right.winRate;
  }

  if (left.winRate !== null) {
    return -1;
  }

  if (right.winRate !== null) {
    return 1;
  }

  return 0;
}
