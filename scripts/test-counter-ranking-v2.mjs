import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildChampionRegistry,
  normalizeChampionIdentifier,
} from "./lib/league-champion-normalizer.mjs";

const rankingModule = await import("../src/features/league/counter-ranking-v2.ts");

const {
  calculateMechanicalMatchupFit,
  calculateCounterRankingV2FinalMechanicalScore,
  clampCounterRankingV2ManualAdjustment,
  counterRankingV2SupportedChampionIds,
  counterRankingV2TraitVocabulary,
  createCounterRankingV2MechanicalReview,
  createObservedCounterRankingV2Snapshot,
  getCounterRankingV2ChampionProfile,
  getCounterRankingV2ComparisonRows,
  isCounterRankingV2ManualAdjustmentInBounds,
  isCounterRankingV2PublicCandidateEligible,
  isCounterRankingV2ReviewPublicEligible,
  isCounterRankingV2ShadowCandidateEligible,
  sortCounterRankingV2RowsByReviewPriority,
} = rankingModule;

assert.deepEqual(
  counterRankingV2SupportedChampionIds,
  ["vex", "yone", "yasuo", "akali", "annie", "malzahar", "lissandra", "kassadin"],
  "The first Counter Ranking V2 shadow profile set should stay intentionally small.",
);

const traitIds = new Set(counterRankingV2TraitVocabulary.map((trait) => trait.id));
const championRegistry = buildChampionRegistry([
  championRegistryRow("Vex", "711", "Vex", "vex"),
  championRegistryRow("Yone", "777", "Yone", "yone"),
]);

assert.equal(
  normalizeChampionIdentifier("vex", championRegistry)?.canonicalKey,
  "Vex",
  "Lowercase V2 profile IDs should resolve to canonical league_champions IDs.",
);
assert.equal(
  normalizeChampionIdentifier("yone", championRegistry)?.canonicalKey,
  "Yone",
  "Lowercase V2 profile IDs should resolve to canonical league_champions IDs.",
);
assert.equal(
  normalizeChampionIdentifier("definitely-not-a-champion", championRegistry),
  null,
  "Invalid review champion IDs should fail normalization before database writes.",
);

for (const championId of counterRankingV2SupportedChampionIds) {
  const profile = getCounterRankingV2ChampionProfile(championId);

  assert.ok(profile, `${championId} should have a profile.`);
  assert.ok(profile.strengths.length > 0, `${championId} should define strengths.`);
  assert.ok(profile.vulnerabilities.length > 0, `${championId} should define vulnerabilities.`);

  for (const profileTrait of [...profile.strengths, ...profile.vulnerabilities]) {
    assert.ok(traitIds.has(profileTrait.traitId), `${profileTrait.traitId} should be vocabulary-backed.`);
    assert.ok(profileTrait.weight >= 0 && profileTrait.weight <= 5, "Profile weights are 0-5.");
  }
}

const vexIntoYone = calculateMechanicalMatchupFit({
  candidateChampionId: "vex",
  enemyChampionId: "yone",
  role: "mid",
});
const vexIntoYasuo = calculateMechanicalMatchupFit({
  candidateChampionId: "vex",
  enemyChampionId: "yasuo",
  role: "mid",
});
const kassadinIntoYone = calculateMechanicalMatchupFit({
  candidateChampionId: "kassadin",
  enemyChampionId: "yone",
  role: "mid",
});
const canonicalVexIntoYone = calculateMechanicalMatchupFit({
  candidateChampionId: "Vex",
  enemyChampionId: "Yone",
  role: "mid",
});

assert.equal(vexIntoYone.status, "calculated");
assert.equal(vexIntoYasuo.status, "calculated");
assert.equal(
  canonicalVexIntoYone.score,
  vexIntoYone.score,
  "Canonical Riot champion IDs should resolve to the same shadow profile.",
);
assert.ok(vexIntoYone.score >= 70, "Vex should have a strong mechanical score into Yone.");
assert.ok(vexIntoYasuo.score >= 70, "Vex should have a strong mechanical score into Yasuo.");
assert.ok(
  vexIntoYone.factors.some(
    (factor) =>
      factor.candidateStrength === "anti_dash" && factor.enemyVulnerability === "dash_reliant",
  ),
  "Vex into Yone should include anti-dash into dash-reliant as a factor.",
);
assert.ok(
  vexIntoYone.score > kassadinIntoYone.score,
  "Anti-dash Vex should mechanically fit Yone better than scaling Kassadin.",
);

for (const matchup of [
  vexIntoYone,
  vexIntoYasuo,
  kassadinIntoYone,
  calculateMechanicalMatchupFit({ candidateChampionId: "annie", enemyChampionId: "akali" }),
]) {
  assert.ok(matchup.score >= 0 && matchup.score <= 100, "Scores are normalized to 0-100.");
  assert.equal(matchup.rawScore <= matchup.maxRawScore, true, "Raw score should not exceed max.");
}

assert.equal(
  calculateMechanicalMatchupFit({ candidateChampionId: "unknown", enemyChampionId: "yone" }).status,
  "missing_candidate_profile",
);
assert.equal(
  calculateMechanicalMatchupFit({ candidateChampionId: "vex", enemyChampionId: "unknown" }).status,
  "missing_enemy_profile",
);

const observedByChampionId = new Map([
  [
    "kassadin",
    createObservedCounterRankingV2Snapshot({
      games: 1000,
      rank: 1,
      winRate: 60,
    }),
  ],
  [
    "vex",
    createObservedCounterRankingV2Snapshot({
      games: 5,
      rank: 8,
      winRate: 40,
    }),
  ],
]);
const shadowRows = getCounterRankingV2ComparisonRows({
  candidateChampionIds: ["vex", "kassadin"],
  enemyChampionId: "yone",
  observedByChampionId,
  role: "mid",
});
const shadowVexRow = shadowRows.find((row) => row.candidateChampionId === "vex");

assert.ok(shadowVexRow, "Vex should be present in shadow comparison rows.");
assert.equal(
  shadowVexRow.mechanicalRank,
  1,
  "Mechanical rank should be driven by profile fit, not observed win rate.",
);
assert.equal(
  shadowVexRow.observed?.rank,
  8,
  "Observed rank should be displayed separately from mechanical rank.",
);
assert.equal(
  shadowVexRow.rankDelta,
  7,
  "Rank delta should compare observed rank and shadow mechanical rank.",
);

assert.equal(clampCounterRankingV2ManualAdjustment(45), 30, "Positive manual adjustments clamp.");
assert.equal(clampCounterRankingV2ManualAdjustment(-45), -30, "Negative manual adjustments clamp.");
assert.equal(
  clampCounterRankingV2ManualAdjustment(Number.NaN),
  0,
  "Invalid adjustments become neutral.",
);
assert.equal(
  isCounterRankingV2ManualAdjustmentInBounds(-30),
  true,
  "The minimum review adjustment should be accepted.",
);
assert.equal(
  isCounterRankingV2ManualAdjustmentInBounds(30),
  true,
  "The maximum review adjustment should be accepted.",
);
assert.equal(
  isCounterRankingV2ManualAdjustmentInBounds(-31),
  false,
  "Review saves should reject adjustments below the lower bound.",
);
assert.equal(
  isCounterRankingV2ManualAdjustmentInBounds(31),
  false,
  "Review saves should reject adjustments above the upper bound.",
);
assert.equal(
  calculateCounterRankingV2FinalMechanicalScore({
    calculatedMechanicalScore: 78,
    manualAdjustment: 10,
  }),
  88,
  "Final reviewed score should add bounded manual adjustment.",
);
assert.equal(
  calculateCounterRankingV2FinalMechanicalScore({
    calculatedMechanicalScore: 88,
    manualAdjustment: 30,
  }),
  100,
  "Final reviewed score should clamp at 100.",
);
assert.equal(
  calculateCounterRankingV2FinalMechanicalScore({
    calculatedMechanicalScore: 12,
    manualAdjustment: -30,
  }),
  0,
  "Final reviewed score should clamp at 0.",
);

const reviewedVex = createCounterRankingV2MechanicalReview({
  adjustmentReason: "manual_review",
  adminReviewNote: "Vex reliably punishes Yone dash commits.",
  calculatedMechanicalScore: vexIntoYone.score,
  counterChampionId: "vex",
  enemyChampionId: "yone",
  manualAdjustment: 10,
  publicEligible: true,
  reviewStatus: "verified_strong_counter",
  role: "mid",
});

const unreviewedRows = getCounterRankingV2ComparisonRows({
  candidateChampionIds: ["vex"],
  enemyChampionId: "yone",
  observedByChampionId: new Map(),
  role: "mid",
});

assert.equal(
  unreviewedRows.at(0)?.review,
  null,
  "Comparison rows should load cleanly when no review row exists.",
);
assert.equal(
  reviewedVex.calculatedMechanicalScore,
  vexIntoYone.score,
  "Review rows should preserve the calculated mechanical model score.",
);
assert.equal(reviewedVex.manualAdjustment, 10, "Review rows should store manual adjustment separately.");
assert.equal(
  reviewedVex.finalMechanicalScore,
  Math.min(100, vexIntoYone.score + 10),
  "Review rows should expose final score.",
);

const reviewedRows = getCounterRankingV2ComparisonRows({
  candidateChampionIds: ["vex"],
  enemyChampionId: "yone",
  observedByChampionId: new Map(),
  reviewsByCandidateId: new Map([["vex", reviewedVex]]),
  role: "mid",
});

assert.equal(
  reviewedRows.at(0)?.review?.manualAdjustment,
  10,
  "Comparison rows should attach an existing review row by counter champion ID.",
);

const unreviewedBeforeReviewedRows = sortCounterRankingV2RowsByReviewPriority(
  getCounterRankingV2ComparisonRows({
    candidateChampionIds: ["vex", "kassadin"],
    enemyChampionId: "yone",
    observedByChampionId: new Map(),
    reviewsByCandidateId: new Map([
      [
        "vex",
        createCounterRankingV2MechanicalReview({
          calculatedMechanicalScore: vexIntoYone.score,
          counterChampionId: "vex",
          enemyChampionId: "yone",
          manualAdjustment: 30,
          reviewStatus: "verified_strong_counter",
          role: "mid",
        }),
      ],
    ]),
    role: "mid",
  }),
);

assert.equal(
  unreviewedBeforeReviewedRows.at(0)?.candidateChampionId,
  "kassadin",
  "Review-priority sorting should place unreviewed candidates before reviewed candidates.",
);

const finalReviewedScoreRows = sortCounterRankingV2RowsByReviewPriority(
  getCounterRankingV2ComparisonRows({
    candidateChampionIds: ["vex", "kassadin"],
    enemyChampionId: "yone",
    observedByChampionId: new Map(),
    reviewsByCandidateId: new Map([
      [
        "vex",
        createCounterRankingV2MechanicalReview({
          calculatedMechanicalScore: 55,
          counterChampionId: "vex",
          enemyChampionId: "yone",
          manualAdjustment: 30,
          reviewStatus: "verified_strong_counter",
          role: "mid",
        }),
      ],
      [
        "kassadin",
        createCounterRankingV2MechanicalReview({
          calculatedMechanicalScore: 90,
          counterChampionId: "kassadin",
          enemyChampionId: "yone",
          manualAdjustment: -20,
          reviewStatus: "verified_soft_counter",
          role: "mid",
        }),
      ],
    ]),
    role: "mid",
  }),
);

assert.equal(
  finalReviewedScoreRows.at(0)?.candidateChampionId,
  "vex",
  "Review-priority sorting should use final reviewed score when review rows exist.",
);

const calculatedScoreRows = sortCounterRankingV2RowsByReviewPriority(
  getCounterRankingV2ComparisonRows({
    candidateChampionIds: ["kassadin", "vex"],
    enemyChampionId: "yone",
    observedByChampionId: new Map(),
    role: "mid",
  }),
);
const highestCalculatedScore = Math.max(
  ...calculatedScoreRows.map((row) => row.mechanicalResult.score),
);

assert.equal(
  calculatedScoreRows.at(0)?.mechanicalResult.score,
  highestCalculatedScore,
  "Review-priority sorting should use calculated score when no review row exists.",
);
assert.equal(
  isCounterRankingV2ShadowCandidateEligible({
    minimumGames: 5,
    observedGames: 3,
    review: reviewedVex,
  }),
  true,
  "Shadow candidate logic can treat public-eligible mechanical reviews as eligible below 5 games.",
);
assert.equal(
  isCounterRankingV2PublicCandidateEligible({
    minimumGames: 5,
    observedGames: 3,
    review: reviewedVex,
    useReviewedMechanicalCounters: false,
  }),
  false,
  "Public candidate logic must not change while reviewed mechanical counters are disabled.",
);
assert.equal(
  isCounterRankingV2PublicCandidateEligible({
    minimumGames: 5,
    observedGames: 3,
    review: reviewedVex,
    useReviewedMechanicalCounters: true,
  }),
  true,
  "The feature flag can explicitly allow reviewed mechanical counters publicly.",
);
assert.equal(
  isCounterRankingV2ShadowCandidateEligible({
    minimumGames: 5,
    observedGames: 3,
    review: null,
  }),
  false,
  "Missing review rows should not make low-sample counters eligible.",
);

const incorrectSuggestionReview = createCounterRankingV2MechanicalReview({
  calculatedMechanicalScore: 90,
  counterChampionId: "kassadin",
  enemyChampionId: "yone",
  publicEligible: true,
  reviewStatus: "incorrect_suggestion",
  role: "mid",
});

assert.equal(
  isCounterRankingV2ReviewPublicEligible(incorrectSuggestionReview),
  false,
  "Incorrect suggestions should not be public eligible by default.",
);

const minimumAdjustmentReview = createCounterRankingV2MechanicalReview({
  calculatedMechanicalScore: 12,
  counterChampionId: "vex",
  enemyChampionId: "yone",
  manualAdjustment: -30,
  reviewStatus: "needs_more_data",
  role: "mid",
});

assert.equal(
  minimumAdjustmentReview.finalMechanicalScore,
  0,
  "A saved -30 review adjustment should clamp the final score at 0.",
);

const updatedReview = createCounterRankingV2MechanicalReview({
  calculatedMechanicalScore: 88,
  counterChampionId: "vex",
  enemyChampionId: "yone",
  manualAdjustment: 30,
  publicEligible: true,
  reviewStatus: "verified_strong_counter",
  role: "mid",
});

assert.equal(
  updatedReview.finalMechanicalScore,
  100,
  "Updating an existing review to +30 should clamp the final score at 100.",
);

const mechanicalReviewMigration = readFileSync(
  new URL(
    "../supabase/migrations/20260621003000_create_counter_ranking_v2_mechanical_reviews.sql",
    import.meta.url,
  ),
  "utf8",
);
const mechanicalReviewServiceRoleGrantMigration = readFileSync(
  new URL(
    "../supabase/migrations/20260621010000_grant_counter_ranking_v2_mechanical_reviews_service_role.sql",
    import.meta.url,
  ),
  "utf8",
);
const counterPickActionsSource = readFileSync(
  new URL("../src/app/admin/league/counter-picks/actions.ts", import.meta.url),
  "utf8",
);

assert.match(
  mechanicalReviewMigration,
  /create table if not exists public\.counter_ranking_v2_mechanical_reviews/,
  "The review layer migration should create the table loaded by the admin action.",
);
assert.match(
  mechanicalReviewMigration,
  /constraint counter_ranking_v2_mechanical_reviews_unique\s+unique \(enemy_champion_id, counter_champion_id, role\)/,
  "The review upsert conflict target should be backed by a table unique constraint.",
);
assert.match(
  mechanicalReviewMigration,
  /using \(public\.is_admin\(auth\.uid\(\)\)\)/,
  "Review table RLS should use the established admin helper.",
);
assert.match(
  mechanicalReviewServiceRoleGrantMigration,
  /grant select, insert, update\s+on table public\.counter_ranking_v2_mechanical_reviews\s+to service_role;/,
  "The service-role admin action should be granted review table load/save privileges.",
);
assert.doesNotMatch(
  mechanicalReviewMigration,
  /profiles\.is_admin/,
  "Review table RLS should not depend on the removed profiles.is_admin column.",
);
assert.match(
  counterPickActionsSource,
  /from\("counter_ranking_v2_mechanical_reviews"\)/,
  "The admin action should query the review table created by the migration.",
);
assert.match(
  counterPickActionsSource,
  /onConflict: "enemy_champion_id,counter_champion_id,role"/,
  "The review save action should upsert by the table unique key.",
);
assert.match(
  counterPickActionsSource,
  /resolveCounterRankingV2ReviewChampionIds/,
  "The review save action should resolve review champion IDs through the shared champion registry.",
);
assert.match(
  counterPickActionsSource,
  /counter_champion_id: resolvedChampionIds\.counterChampionId/,
  "The review save action should write canonical counter champion IDs.",
);
assert.match(
  counterPickActionsSource,
  /enemy_champion_id: resolvedChampionIds\.enemyChampionId/,
  "The review save action should write canonical enemy champion IDs.",
);
assert.match(
  counterPickActionsSource,
  /Counter Ranking V2 review save champion resolution failed/,
  "Review save champion resolution failures should be logged before database writes.",
);
assert.match(
  counterPickActionsSource,
  /Counter Ranking V2 review rows champion resolution failed/,
  "Review load champion resolution failures should be logged before database queries.",
);
assert.match(
  counterPickActionsSource,
  /Counter Ranking V2 review rows load failed/,
  "Review loading should log the exact server-side database error.",
);
assert.match(
  counterPickActionsSource,
  /Counter Ranking V2 review save failed/,
  "Review saving should log the exact server-side database error.",
);

console.log("Counter Ranking V2 shadow-mode tests passed.");

function championRegistryRow(id, riotKey, name, slug) {
  return {
    id,
    name,
    riot_data_key: id,
    riot_key: riotKey,
    slug,
  };
}
