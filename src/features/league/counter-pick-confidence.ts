export type CounterPickConfidenceLevel =
  | "insufficient"
  | "very_low"
  | "low"
  | "developing"
  | "moderate"
  | "strong";

export type CounterPickConfidenceFactors = {
  games: number;
  maximumSinglePlayerShare?: number;
  patchFreshness?: number;
  rankCoverage?: number;
  specialistShare?: number;
  uniquePlayers?: number;
};

export type CounterPickConfidence = {
  description: string;
  games: number;
  label: string;
  level: CounterPickConfidenceLevel;
  minimumGamesForPublicResult: number;
  publiclyRanked: boolean;
  shortLabel: string;
  tierVisible: boolean;
  warningVisible: boolean;
};

type CounterPickConfidenceThreshold = {
  description: string;
  label: string;
  level: CounterPickConfidenceLevel;
  minimumGames: number;
  shortLabel: string;
  tierVisible: boolean;
  warningVisible: boolean;
};

export const minimumPublicCounterPickGames = 5;
export const veryLowCounterPickConfidenceGames = 5;
export const lowCounterPickConfidenceGames = 20;
export const developingCounterPickConfidenceGames = 50;
export const moderateCounterPickConfidenceGames = 100;
export const strongCounterPickConfidenceGames = 250;

export const counterPickConfidenceThresholds = [
  {
    description: "Fewer than five stored Riot matches is not enough to rank this matchup publicly.",
    label: "Insufficient data",
    level: "insufficient",
    minimumGames: 0,
    shortLabel: "Insufficient",
    tierVisible: false,
    warningVisible: true,
  },
  {
    description:
      "This result is based on a very small sample and may change significantly as more matches are collected.",
    label: "Very low confidence",
    level: "very_low",
    minimumGames: veryLowCounterPickConfidenceGames,
    shortLabel: "Very low",
    tierVisible: false,
    warningVisible: true,
  },
  {
    description:
      "This result has enough stored games to show, but the sample can still move noticeably.",
    label: "Low confidence",
    level: "low",
    minimumGames: lowCounterPickConfidenceGames,
    shortLabel: "Low",
    tierVisible: true,
    warningVisible: true,
  },
  {
    description:
      "This result is developing and should become steadier as more stored games are added.",
    label: "Developing sample",
    level: "developing",
    minimumGames: developingCounterPickConfidenceGames,
    shortLabel: "Developing",
    tierVisible: true,
    warningVisible: false,
  },
  {
    description: "This result is based on a moderate stored-game sample.",
    label: "Moderate confidence",
    level: "moderate",
    minimumGames: moderateCounterPickConfidenceGames,
    shortLabel: "Moderate",
    tierVisible: true,
    warningVisible: false,
  },
  {
    description: "This result is based on a strong stored-game sample.",
    label: "Strong confidence",
    level: "strong",
    minimumGames: strongCounterPickConfidenceGames,
    shortLabel: "Strong",
    tierVisible: true,
    warningVisible: false,
  },
] as const satisfies ReadonlyArray<CounterPickConfidenceThreshold>;

export function calculateCounterPickConfidence(
  gamesOrFactors: number | CounterPickConfidenceFactors,
): CounterPickConfidence {
  const games = clampConfidenceGames(
    typeof gamesOrFactors === "number" ? gamesOrFactors : gamesOrFactors.games,
  );
  const threshold = [...counterPickConfidenceThresholds]
    .reverse()
    .find((candidate) => games >= candidate.minimumGames);
  const resolvedThreshold = threshold ?? counterPickConfidenceThresholds[0];

  return {
    description: resolvedThreshold.description,
    games,
    label: resolvedThreshold.label,
    level: resolvedThreshold.level,
    minimumGamesForPublicResult: minimumPublicCounterPickGames,
    publiclyRanked: games >= minimumPublicCounterPickGames,
    shortLabel: resolvedThreshold.shortLabel,
    tierVisible: resolvedThreshold.tierVisible,
    warningVisible: resolvedThreshold.warningVisible,
  };
}

export function isPublicCounterPickConfidenceRanked(confidence: CounterPickConfidence) {
  return confidence.publiclyRanked;
}

function clampConfidenceGames(games: number) {
  return Math.max(Math.trunc(Number.isFinite(games) ? games : 0), 0);
}
