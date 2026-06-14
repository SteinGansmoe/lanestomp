import type { LeagueCounterPick } from "@/src/features/league/counter-picks";
import type { LeagueCounterPickMatchStatistic } from "@/src/features/league/counter-pick-match-statistics";

export type CounterPickStatisticsTier = "A" | "B" | "C" | "S" | "S+";
export type CounterPickSampleConfidence = "high" | "low" | "low_sample" | "medium";
export type CounterPickStatisticsSource =
  | "league_counter_picks"
  | "manual"
  | "match_statistics_cache"
  | "provider";

export type CounterPickStatistics = {
  games: number | null;
  lastUpdatedAt: string | null;
  patch: string | null;
  rankFilter: string | null;
  region: string | null;
  sampleConfidence: CounterPickSampleConfidence | null;
  source: CounterPickStatisticsSource;
  tier: CounterPickStatisticsTier | null;
  winRate: number | null;
  wins: number | null;
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

export const minimumTrustedCounterPickGames = 100;

export const emptyCounterPickStatistics: CounterPickStatistics = {
  games: null,
  lastUpdatedAt: null,
  patch: null,
  rankFilter: null,
  region: null,
  sampleConfidence: null,
  source: "manual",
  tier: null,
  winRate: null,
  wins: null,
};

export function getCounterPickStatisticsFromCounterPick(
  counterPick: Pick<
    LeagueCounterPick,
    "games" | "patch" | "rank_filter" | "region" | "win_rate"
  >,
): CounterPickStatistics {
  const sampleConfidence = getCounterPickSampleConfidence(counterPick.games);

  return {
    games: counterPick.games,
    lastUpdatedAt: null,
    patch: counterPick.patch,
    rankFilter: counterPick.rank_filter,
    region: counterPick.region,
    sampleConfidence,
    source: "league_counter_picks",
    tier: getCounterPickStatisticsTier(counterPick.win_rate, counterPick.games),
    winRate: counterPick.win_rate,
    wins: null,
  };
}

export function getCounterPickStatisticsFromMatchStatistic(
  statistic: LeagueCounterPickMatchStatistic,
): CounterPickStatistics {
  return {
    games: statistic.games,
    lastUpdatedAt: statistic.last_updated_at,
    patch: statistic.patch,
    rankFilter: null,
    region: null,
    sampleConfidence: statistic.sample_confidence,
    source: "match_statistics_cache",
    tier: getCounterPickStatisticsTier(statistic.win_rate, statistic.games),
    winRate: statistic.win_rate,
    wins: statistic.wins,
  };
}

export function getCounterPickSampleConfidence(games: number | null) {
  if (games === null || games < minimumTrustedCounterPickGames) {
    return "low_sample";
  }

  if (games < 500) {
    return "low";
  }

  if (games < 1000) {
    return "medium";
  }

  return "high";
}

export function getCounterPickStatisticsTier(winRate: number | null, games: number | null = null) {
  if (winRate === null || games === null || games < minimumTrustedCounterPickGames) {
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

export function isCounterPickStatisticsTrusted(statistics: CounterPickStatistics) {
  return (
    statistics.winRate !== null &&
    statistics.games !== null &&
    statistics.games >= minimumTrustedCounterPickGames
  );
}

export function compareCounterPickStatistics(
  left: CounterPickStatistics,
  right: CounterPickStatistics,
  direction: "asc" | "desc",
) {
  const isLeftTrusted = isCounterPickStatisticsTrusted(left);
  const isRightTrusted = isCounterPickStatisticsTrusted(right);

  if (isLeftTrusted && isRightTrusted) {
    const leftWinRate = left.winRate ?? 0;
    const rightWinRate = right.winRate ?? 0;

    if (leftWinRate !== rightWinRate) {
      return direction === "desc" ? rightWinRate - leftWinRate : leftWinRate - rightWinRate;
    }
  }

  if (isLeftTrusted && !isRightTrusted) {
    return -1;
  }

  if (isRightTrusted && !isLeftTrusted) {
    return 1;
  }

  return (right.games ?? 0) - (left.games ?? 0);
}
