import assert from "node:assert/strict";

const confidenceModule = await import("../src/features/league/counter-pick-confidence.ts");
const statisticsModule = await import("../src/features/league/counter-pick-statistics.ts");

const {
  calculateCounterPickConfidence,
  lowCounterPickConfidenceGames,
  minimumPublicCounterPickGames,
  strongCounterPickConfidenceGames,
} = confidenceModule;
const {
  compareCounterPickStatistics,
  getCounterPickPublicTierLabel,
  isCounterPickStatisticsPubliclyRanked,
  publicCounterPickMinimumRankedGames,
} = statisticsModule;

for (const [games, expectedLevel, publiclyRanked, tierVisible] of [
  [0, "insufficient", false, false],
  [4, "insufficient", false, false],
  [5, "very_low", true, false],
  [19, "very_low", true, false],
  [20, "low", true, true],
  [49, "low", true, true],
  [50, "developing", true, true],
  [99, "developing", true, true],
  [100, "moderate", true, true],
  [249, "moderate", true, true],
  [250, "strong", true, true],
]) {
  const confidence = calculateCounterPickConfidence(games);

  assert.equal(confidence.level, expectedLevel, `${games} games confidence`);
  assert.equal(confidence.publiclyRanked, publiclyRanked, `${games} games public ranking`);
  assert.equal(confidence.tierVisible, tierVisible, `${games} games tier visibility`);
  assert.equal(confidence.minimumGamesForPublicResult, minimumPublicCounterPickGames);
}

assert.equal(publicCounterPickMinimumRankedGames, 5);

assert.equal(
  getCounterPickPublicTierLabel(stat({ games: 0, tier: "S+", winRate: 100 })),
  "Not enough data",
);
assert.equal(
  getCounterPickPublicTierLabel(stat({ games: 4, tier: "S+", winRate: 75 })),
  "Not enough data",
);
assert.equal(
  getCounterPickPublicTierLabel(stat({ games: 5, tier: "S+", winRate: 60 })),
  "Preliminary",
);
assert.equal(
  getCounterPickPublicTierLabel(stat({ games: 20, tier: "S+", winRate: 56 })),
  "S+ Tier",
);
assert.equal(getCounterPickPublicTierLabel(stat({ games: 250, tier: "A", winRate: 52 })), "A Tier");

const visibilityRows = [1, 4, 5, 20, 100].map((games) => stat({ games, tier: "A", winRate: 52 }));
assert.deepEqual(visibilityRows.map(isCounterPickStatisticsPubliclyRanked), [
  false,
  false,
  true,
  true,
  true,
]);

const hiddenCount = visibilityRows.filter(
  (row) => !isCounterPickStatisticsPubliclyRanked(row),
).length;
const rankedCount = visibilityRows.filter(isCounterPickStatisticsPubliclyRanked).length;
assert.equal(hiddenCount, 2);
assert.equal(rankedCount, 3);

assert.equal(getEmptyStateKind([]), "no_observations");
assert.equal(
  getEmptyStateKind([stat({ games: 1, tier: "S+", winRate: 100 })]),
  "only_insufficient_observations",
);
assert.equal(
  getEmptyStateKind([
    stat({ games: 1, tier: "S+", winRate: 100 }),
    stat({ games: 20, tier: "A", winRate: 52 }),
  ]),
  "mixed_public_and_preliminary",
);

const worstRows = [
  stat({ games: 250, tier: "A", winRate: 47 }),
  stat({ games: 5, tier: "S+", winRate: 44 }),
  stat({ games: 100, tier: "B", winRate: 47 }),
].sort((left, right) => compareCounterPickStatistics(left, right, "asc"));
assert.equal(worstRows[0].winRate, 44);
assert.equal(worstRows[1].games, 250);

const bestRows = [
  stat({ games: 250, tier: "A", winRate: 53 }),
  stat({ games: 5, tier: "S+", winRate: 61 }),
  stat({ games: 100, tier: "B", winRate: 53 }),
].sort((left, right) => compareCounterPickStatistics(left, right, "desc"));
assert.equal(bestRows[0].winRate, 61);
assert.equal(bestRows[1].games, 250);

console.log("Counter Pick confidence handling passed.");

function getEmptyStateKind(rows) {
  if (rows.length === 0) {
    return "no_observations";
  }

  if (rows.every((row) => !isCounterPickStatisticsPubliclyRanked(row))) {
    return "only_insufficient_observations";
  }

  if (rows.some((row) => !isCounterPickStatisticsPubliclyRanked(row))) {
    return "mixed_public_and_preliminary";
  }

  return "public_results_only";
}

function stat({ games, tier, winRate }) {
  return {
    confidence: calculateCounterPickConfidence(games),
    games,
    lastUpdatedAt: "2026-06-15T00:00:00.000Z",
    patch: "15.12",
    rankFilter: "all",
    region: null,
    sampleConfidence:
      games < lowCounterPickConfidenceGames
        ? "low_sample"
        : games < strongCounterPickConfidenceGames
          ? "low"
          : "medium",
    source: "provider",
    tier,
    winRate,
    wins: Math.round(games * (winRate / 100)),
  };
}
