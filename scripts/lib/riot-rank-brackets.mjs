export const riotRankTiers = [
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "EMERALD",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];

export const counterPickRankBrackets = [
  "all",
  "iron-silver",
  "gold-emerald",
  "diamond",
  "master-plus",
  "unknown",
];

export const attributedCounterPickRankBrackets = counterPickRankBrackets.filter(
  (bracket) => bracket !== "all" && bracket !== "unknown",
);

export const matchupRankAttributionMethods = [
  "two-player-average",
  "single-player",
  "unknown",
];

export const MAX_RANK_SNAPSHOT_DISTANCE_DAYS = 30;
export const MAX_RANK_SNAPSHOT_DISTANCE_MS =
  MAX_RANK_SNAPSHOT_DISTANCE_DAYS * 24 * 60 * 60 * 1000;

const divisionScores = {
  IV: 0,
  III: 1,
  II: 2,
  I: 3,
};

const tierBaseScores = {
  IRON: 0,
  BRONZE: 4,
  SILVER: 8,
  GOLD: 12,
  PLATINUM: 16,
  EMERALD: 20,
  DIAMOND: 24,
  MASTER: 28,
  GRANDMASTER: 29,
  CHALLENGER: 30,
};

export const rankBracketBoundaries = [
  {
    bracket: "iron-silver",
    maxExclusiveScore: tierBaseScores.GOLD,
    minInclusiveScore: tierBaseScores.IRON,
  },
  {
    bracket: "gold-emerald",
    maxExclusiveScore: tierBaseScores.DIAMOND,
    minInclusiveScore: tierBaseScores.GOLD,
  },
  {
    bracket: "diamond",
    maxExclusiveScore: tierBaseScores.MASTER,
    minInclusiveScore: tierBaseScores.DIAMOND,
  },
  {
    bracket: "master-plus",
    maxExclusiveScore: Number.POSITIVE_INFINITY,
    minInclusiveScore: tierBaseScores.MASTER,
  },
];

export function normalizeRiotRankTier(value) {
  const tier = String(value ?? "")
    .trim()
    .toUpperCase();

  return isRiotRankTier(tier) ? tier : null;
}

export function normalizeRiotRankDivision(value) {
  const division = String(value ?? "")
    .trim()
    .toUpperCase();

  return Object.hasOwn(divisionScores, division) ? division : null;
}

export function isRiotRankTier(value) {
  return riotRankTiers.includes(String(value ?? "").trim().toUpperCase());
}

export function isCounterPickRankBracket(value) {
  return counterPickRankBrackets.includes(String(value ?? "").trim());
}

export function isMatchupRankAttributionMethod(value) {
  return matchupRankAttributionMethods.includes(String(value ?? "").trim());
}

export function getRankScore({ division = null, tier }) {
  const normalizedTier = normalizeRiotRankTier(tier);

  if (!normalizedTier) {
    return null;
  }

  const baseScore = tierBaseScores[normalizedTier];

  if (normalizedTier === "MASTER" || normalizedTier === "GRANDMASTER" || normalizedTier === "CHALLENGER") {
    return baseScore;
  }

  const normalizedDivision = normalizeRiotRankDivision(division);

  if (!normalizedDivision) {
    return null;
  }

  return baseScore + divisionScores[normalizedDivision];
}

export function getRankBracketFromScore(score) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return "unknown";
  }

  return (
    rankBracketBoundaries.find(
      (boundary) =>
        numericScore >= boundary.minInclusiveScore &&
        numericScore < boundary.maxExclusiveScore,
    )?.bracket ?? "unknown"
  );
}

export function getRankBracketFromRank(rank) {
  const score = getRankScore(rank);

  return score === null ? "unknown" : getRankBracketFromScore(score);
}

export function getCounterPickAggregateRankBrackets(rankBracket) {
  const bracket = isCounterPickRankBracket(rankBracket) ? rankBracket : "unknown";
  const fanout = new Set(["all"]);

  fanout.add(bracket === "all" ? "unknown" : bracket);

  return Array.from(fanout);
}

export function getRankSortWeight(candidate) {
  const score = getRankScore({
    division: candidate?.rank_division ?? candidate?.division ?? null,
    tier: candidate?.rank_tier ?? candidate?.tier ?? null,
  });

  return score === null ? Number.MAX_SAFE_INTEGER : -score;
}
