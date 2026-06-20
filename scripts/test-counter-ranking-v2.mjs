import assert from "node:assert/strict";

const rankingModule = await import("../src/features/league/counter-ranking-v2.ts");

const {
  calculateMechanicalMatchupFit,
  counterRankingV2SupportedChampionIds,
  counterRankingV2TraitVocabulary,
  createObservedCounterRankingV2Snapshot,
  getCounterRankingV2ChampionProfile,
  getCounterRankingV2ComparisonRows,
} = rankingModule;

assert.deepEqual(
  counterRankingV2SupportedChampionIds,
  ["vex", "yone", "yasuo", "akali", "annie", "malzahar", "lissandra", "kassadin"],
  "The first Counter Ranking V2 shadow profile set should stay intentionally small.",
);

const traitIds = new Set(counterRankingV2TraitVocabulary.map((trait) => trait.id));

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

console.log("Counter Ranking V2 shadow-mode tests passed.");
