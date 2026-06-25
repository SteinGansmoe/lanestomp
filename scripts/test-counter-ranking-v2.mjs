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
  filterCounterRankingV2RowsByReviewFilter,
  generateCounterRankingV2MechanicalSuggestion,
  generateCounterRankingV2MechanicalSuggestionsForRole,
  getCounterRankingV2AutomationBlockerSummary,
  getCounterRankingV2AutomationSummary,
  getCounterRankingV2ChampionProfile,
  getCounterRankingV2ComparisonRows,
  getCounterRankingV2FactorImpactLevel,
  getCounterRankingV2MechanicalReasons,
  getCounterRankingV2PublicPreviewRows,
  getCounterRankingV2ProfileImpactLabel,
  getCounterRankingV2ReviewProgressSummary,
  hasCounterRankingV2WeakMechanicalSignal,
  isCounterRankingV2ApprovedReviewPublicEligible,
  isCounterRankingV2ManualAdjustmentInBounds,
  isCounterRankingV2PublicCandidateEligible,
  isCounterRankingV2ReviewPublicEligible,
  isCounterRankingV2ReviewStatusPublicEligible,
  isCounterRankingV2ShadowCandidateEligible,
  isCounterRankingV2ProfileValueInBounds,
  normalizeCounterRankingV2TraitId,
  normalizeCounterRankingV2PublicEligible,
  sortCounterRankingV2RowsByReviewPriority,
  useReviewedMechanicalCountersPublicly,
} = rankingModule;

const secondBatchMidChampionIds = [
  "ahri",
  "syndra",
  "orianna",
  "zed",
  "katarina",
  "leblanc",
  "viktor",
  "sylas",
  "fizz",
  "hwei",
  "malphite",
  "veigar",
];
const finalMidCoverageChampionIds = [
  "akshan",
  "anivia",
  "aurelionsol",
  "aurora",
  "azir",
  "cassiopeia",
  "corki",
  "diana",
  "ekko",
  "galio",
  "irelia",
  "lux",
  "mel",
  "naafiri",
  "neeko",
  "qiyana",
  "ryze",
  "taliyah",
  "talon",
  "twistedfate",
  "vladimir",
  "xerath",
  "ziggs",
  "zoe",
];
const draftAddedMidChampionIds = [
  ...secondBatchMidChampionIds,
  ...finalMidCoverageChampionIds,
];

assert.deepEqual(
  counterRankingV2SupportedChampionIds,
  [
    "vex",
    "yone",
    "yasuo",
    "akali",
    "annie",
    "malzahar",
    "lissandra",
    "kassadin",
    ...secondBatchMidChampionIds,
    ...finalMidCoverageChampionIds,
  ],
  "Counter Ranking V2 shadow profile support should include the first set plus expanded mid coverage.",
);
assert.equal(
  useReviewedMechanicalCountersPublicly,
  false,
  "Reviewed mechanical counters should remain disabled publicly by default.",
);

const traitIds = new Set(counterRankingV2TraitVocabulary.map((trait) => trait.id));
const traitLabelsById = new Map(counterRankingV2TraitVocabulary.map((trait) => [trait.id, trait.label]));
const expectedNewTraitLabels = {
  all_in_threat: "All-in threat",
  anti_heal: "Anti-heal",
  anti_shield: "Anti-shield",
  disengage: "Disengage",
  roaming: "Roaming",
  scaling: "Scaling",
  strong_early: "Strong early",
  sustain: "Sustain",
};
const expectedNewVulnerabilityLabels = {
  falls_off_late: "Falls off late",
  gap_closing: "Gap closing",
  skillshot_reliant: "Skillshot-reliant",
  vulnerable_to_all_in: "Weak to all-in",
  weak_early: "Weak early",
  weak_vs_poke: "Vulnerable to poke",
  weak_vs_range: "Weak vs range",
  weak_vs_roaming: "Weak vs roaming",
  weak_vs_sustain: "Weak vs sustain",
  weak_vs_waveclear: "Weak vs waveclear",
};

for (const [traitId, label] of Object.entries(expectedNewTraitLabels)) {
  assert.equal(traitLabelsById.get(traitId), label, `${traitId} should be available as a trait.`);
}

for (const [traitId, label] of Object.entries(expectedNewVulnerabilityLabels)) {
  assert.equal(
    traitLabelsById.get(traitId),
    label,
    `${traitId} should be available as a vulnerability.`,
  );
}

assert.equal(traitIds.has("mana_reliant"), false, "Mana reliance should not be added.");
assert.equal(
  traitIds.has("late_scaling"),
  false,
  "Legacy late_scaling should not appear in the visible trait dropdown vocabulary.",
);
assert.equal(
  normalizeCounterRankingV2TraitId("late_scaling"),
  "scaling",
  "Legacy late_scaling values should alias to scaling.",
);
const championRegistry = buildChampionRegistry([
  championRegistryRow("Ahri", "103", "Ahri", "ahri"),
  championRegistryRow("Syndra", "134", "Syndra", "syndra"),
  championRegistryRow("Orianna", "61", "Orianna", "orianna"),
  championRegistryRow("Zed", "238", "Zed", "zed"),
  championRegistryRow("Katarina", "55", "Katarina", "katarina"),
  championRegistryRow("Leblanc", "7", "LeBlanc", "leblanc"),
  championRegistryRow("Viktor", "112", "Viktor", "viktor"),
  championRegistryRow("Sylas", "517", "Sylas", "sylas"),
  championRegistryRow("Fizz", "105", "Fizz", "fizz"),
  championRegistryRow("Hwei", "910", "Hwei", "hwei"),
  championRegistryRow("Malphite", "54", "Malphite", "malphite"),
  championRegistryRow("Veigar", "45", "Veigar", "veigar"),
  championRegistryRow("Akshan", "166", "Akshan", "akshan"),
  championRegistryRow("Anivia", "34", "Anivia", "anivia"),
  championRegistryRow("AurelionSol", "136", "Aurelion Sol", "aurelion-sol"),
  championRegistryRow("Aurora", "893", "Aurora", "aurora"),
  championRegistryRow("Azir", "268", "Azir", "azir"),
  championRegistryRow("Cassiopeia", "69", "Cassiopeia", "cassiopeia"),
  championRegistryRow("Corki", "42", "Corki", "corki"),
  championRegistryRow("Diana", "131", "Diana", "diana"),
  championRegistryRow("Ekko", "245", "Ekko", "ekko"),
  championRegistryRow("Galio", "3", "Galio", "galio"),
  championRegistryRow("Irelia", "39", "Irelia", "irelia"),
  championRegistryRow("Lux", "99", "Lux", "lux"),
  championRegistryRow("Mel", "800", "Mel", "mel"),
  championRegistryRow("Naafiri", "950", "Naafiri", "naafiri"),
  championRegistryRow("Neeko", "518", "Neeko", "neeko"),
  championRegistryRow("Qiyana", "246", "Qiyana", "qiyana"),
  championRegistryRow("Ryze", "13", "Ryze", "ryze"),
  championRegistryRow("Taliyah", "163", "Taliyah", "taliyah"),
  championRegistryRow("Talon", "91", "Talon", "talon"),
  championRegistryRow("TwistedFate", "4", "Twisted Fate", "twisted-fate"),
  championRegistryRow("Vladimir", "8", "Vladimir", "vladimir"),
  championRegistryRow("Xerath", "101", "Xerath", "xerath"),
  championRegistryRow("Ziggs", "115", "Ziggs", "ziggs"),
  championRegistryRow("Zoe", "142", "Zoe", "zoe"),
  championRegistryRow("Vex", "711", "Vex", "vex"),
  championRegistryRow("Yone", "777", "Yone", "yone"),
  championRegistryRow("Yasuo", "157", "Yasuo", "yasuo"),
  championRegistryRow("Akali", "84", "Akali", "akali"),
  championRegistryRow("Annie", "1", "Annie", "annie"),
  championRegistryRow("Malzahar", "90", "Malzahar", "malzahar"),
  championRegistryRow("Lissandra", "127", "Lissandra", "lissandra"),
  championRegistryRow("Kassadin", "38", "Kassadin", "kassadin"),
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
  normalizeChampionIdentifier("leblanc", championRegistry)?.canonicalKey,
  "Leblanc",
  "LeBlanc should resolve to the canonical Riot data id used by league_champions.",
);
assert.equal(
  normalizeChampionIdentifier("aurelionsol", championRegistry)?.canonicalKey,
  "AurelionSol",
  "Lowercase Aurelion Sol profile IDs should resolve to canonical league_champions IDs.",
);
assert.equal(
  normalizeChampionIdentifier("twistedfate", championRegistry)?.canonicalKey,
  "TwistedFate",
  "Lowercase Twisted Fate profile IDs should resolve to canonical league_champions IDs.",
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
  assert.ok(profile.supportedRoles.includes("mid"), `${championId} should support mid.`);
  assert.ok(profile.notes?.length > 0, `${championId} should include internal profile reasoning.`);

  for (const profileTrait of [...profile.strengths, ...profile.vulnerabilities]) {
    assert.ok(traitIds.has(profileTrait.traitId), `${profileTrait.traitId} should be vocabulary-backed.`);
    assert.ok(profileTrait.weight >= 0 && profileTrait.weight <= 5, "Profile weights are 0-5.");
  }
}

const baseVexProfile = getCounterRankingV2ChampionProfile("vex");
assert.ok(baseVexProfile, "Vex should have a base profile for alias tests.");

const legacyScalingOverride = {
  ...baseVexProfile,
  strengths: [{ traitId: "late_scaling", weight: 7 }],
};
const legacyScalingProfile = getCounterRankingV2ChampionProfile(
  "vex",
  undefined,
  new Map([["vex", legacyScalingOverride]]),
);

assert.equal(
  legacyScalingProfile?.strengths.at(0)?.traitId,
  "scaling",
  "Legacy late_scaling values should load as scaling.",
);
assert.equal(
  legacyScalingProfile?.strengths.at(0)?.weight,
  7,
  "Legacy late_scaling weights should be preserved when aliased to scaling.",
);
assert.equal(
  legacyScalingProfile?.reviewStatus,
  baseVexProfile.reviewStatus,
  "Aliasing legacy traits should not change existing profile review statuses.",
);

const roamingReloadProfile = getCounterRankingV2ChampionProfile(
  "vex",
  undefined,
  new Map([
    [
      "vex",
      {
        ...baseVexProfile,
        strengths: [{ traitId: "roaming", weight: 8 }],
        vulnerabilities: [{ traitId: "weak_vs_roaming", weight: 6 }],
      },
    ],
  ]),
);

assert.deepEqual(
  roamingReloadProfile?.strengths,
  [{ traitId: "roaming", weight: 8 }],
  "New trait values should load back unchanged after profile management save/reload.",
);
assert.deepEqual(
  roamingReloadProfile?.vulnerabilities,
  [{ traitId: "weak_vs_roaming", weight: 6 }],
  "New vulnerability values should load back unchanged after profile management save/reload.",
);
assert.equal(
  roamingReloadProfile?.reviewStatus,
  baseVexProfile.reviewStatus,
  "Editing trait values should not automatically change profile review status.",
);

const scalingIntoLateFalloff = calculateMechanicalMatchupFit({
  candidateChampionId: "vex",
  enemyChampionId: "yone",
  profileOverridesByChampionId: new Map([
    [
      "vex",
      {
        ...baseVexProfile,
        strengths: [{ traitId: "late_scaling", weight: 7 }],
      },
    ],
    [
      "yone",
      {
        ...getCounterRankingV2ChampionProfile("yone"),
        vulnerabilities: [{ traitId: "falls_off_late", weight: 6 }],
      },
    ],
  ]),
  role: "mid",
});

assert.ok(
  scalingIntoLateFalloff.factors.some(
    (factor) =>
      factor.candidateStrength === "scaling" && factor.enemyVulnerability === "falls_off_late",
  ),
  "Aliased scaling should participate in conservative scaling/falls-off-late scoring.",
);

for (const championId of draftAddedMidChampionIds) {
  const profile = getCounterRankingV2ChampionProfile(championId);
  const canonicalChampionId = normalizeChampionIdentifier(championId, championRegistry)?.canonicalKey;

  assert.ok(profile, `${championId} should load as an expanded mid profile.`);
  assert.equal(profile.reviewStatus, "draft", `${championId} should remain draft until reviewed.`);
  assert.ok(canonicalChampionId, `${championId} should resolve to a canonical champion id.`);
  assert.ok(
    counterRankingV2SupportedChampionIds.includes(championId),
    `${championId} should be selectable in Shadow Ranking supported options.`,
  );

  const championAsCandidate = calculateMechanicalMatchupFit({
    candidateChampionId: championId,
    enemyChampionId: "yone",
    role: "mid",
  });
  const championAsEnemy = calculateMechanicalMatchupFit({
    candidateChampionId: "vex",
    enemyChampionId: championId,
    role: "mid",
  });
  const canonicalMatchup = calculateMechanicalMatchupFit({
    candidateChampionId: canonicalChampionId,
    enemyChampionId: "Yone",
    role: "mid",
  });

  assert.equal(championAsCandidate.status, "calculated", `${championId} should score as candidate.`);
  assert.equal(championAsEnemy.status, "calculated", `${championId} should score as enemy.`);
  assert.equal(
    canonicalMatchup.status,
    "calculated",
    `${canonicalChampionId} should score through canonical id normalization.`,
  );
}

const finalMidCoverageRows = generateCounterRankingV2MechanicalSuggestionsForRole({
  enemyChampionId: "yone",
  observedByChampionId: new Map(),
  role: "mid",
});
for (const championId of finalMidCoverageChampionIds) {
  assert.ok(
    finalMidCoverageRows.some((row) => row.candidateChampionId === championId),
    `${championId} should appear as a Shadow Ranking candidate when Yone Mid is selected.`,
  );
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
assert.deepEqual(
  [
    getCounterRankingV2FactorImpactLevel({ contribution: 12 }),
    getCounterRankingV2FactorImpactLevel({ contribution: 6 }),
    getCounterRankingV2FactorImpactLevel({ contribution: 5.9 }),
  ],
  ["high", "medium", "low"],
  "Mechanical factor impact levels should map raw contributions to readable labels.",
);

const readableFactorReasons = getCounterRankingV2MechanicalReasons(
  [
    testMechanicalFactor({ contribution: 14, enemyVulnerability: "dash_reliant" }),
    testMechanicalFactor({
      candidateStrength: "burst_damage",
      contribution: 7,
      enemyVulnerability: "cooldown_reliant",
    }),
    testMechanicalFactor({
      candidateStrength: "poke",
      contribution: 4,
      enemyVulnerability: "short_range",
    }),
    testMechanicalFactor({
      candidateStrength: "waveclear",
      contribution: 3,
      enemyVulnerability: "waveclear_weak",
    }),
  ],
  3,
);

assert.deepEqual(
  readableFactorReasons.map((reason) => reason.impactLevel),
  ["high", "medium", "low"],
  "Readable mechanical reasons should keep impact labels for the top factors.",
);
assert.deepEqual(
  readableFactorReasons.map((reason) => reason.title),
  ["Punishes dash commits", "Punishes cooldown windows", "Taxes short range"],
  "Readable mechanical reasons should use review-friendly titles.",
);
assert.equal(
  readableFactorReasons.length,
  3,
  "Readable mechanical reasons should show the top 3 factors by default.",
);
assert.equal(
  hasCounterRankingV2WeakMechanicalSignal([
    testMechanicalFactor({ contribution: 5 }),
    testMechanicalFactor({
      candidateStrength: "poke",
      contribution: 4,
      enemyVulnerability: "short_range",
    }),
    testMechanicalFactor({
      candidateStrength: "waveclear",
      contribution: 3,
      enemyVulnerability: "waveclear_weak",
    }),
  ]),
  true,
  "Weak-signal detection should flag scores spread across small factors.",
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
const secondBatchUnreviewedRows = getCounterRankingV2ComparisonRows({
  candidateChampionIds: secondBatchMidChampionIds,
  enemyChampionId: "yone",
  observedByChampionId: new Map(),
  role: "mid",
});

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
assert.deepEqual(
  getCounterRankingV2PublicPreviewRows({
    minimumGames: 5,
    rows: secondBatchUnreviewedRows,
  }),
  [],
  "New profiles alone should not change public output without public eligible review rows.",
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
assert.equal(
  reviewedRows.at(0)?.automationSuggestion?.automationStatus,
  "manual_approved",
  "Existing approved manual reviews should take priority over generated automation statuses.",
);
assert.equal(
  reviewedRows.at(0)?.review?.publicEligible,
  true,
  "Existing public-eligible review rows should be preserved by generated suggestions.",
);

const highScoreSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...vexIntoYone,
    score: 88,
  },
  observed: null,
});

assert.equal(
  highScoreSuggestion?.automationStatus,
  "auto_approval_candidate",
  "Safe high-score reviewed-profile matchups should become auto-approval candidates.",
);
assert.equal(
  highScoreSuggestion?.suggestedStrength,
  "strong_counter",
  "Scores from 80-89 should be suggested as strong counters.",
);

const autoSuggestedScoreSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...vexIntoYone,
    score: 75,
  },
  observed: null,
});

assert.equal(
  autoSuggestedScoreSuggestion?.automationStatus,
  "auto_suggested",
  "Reviewed-profile scores from 75-84 should remain auto-suggested instead of auto-approval candidates.",
);

const mediumScoreSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...vexIntoYone,
    score: 74,
  },
  observed: null,
});

assert.equal(
  mediumScoreSuggestion?.automationStatus,
  "needs_review",
  "Medium-score suggestions should require review.",
);
assert.equal(
  mediumScoreSuggestion?.suggestedStrength,
  "soft_counter",
  "Scores from 65-79 should still be suggested as soft counters.",
);
assert.deepEqual(
  mediumScoreSuggestion?.blockers.map((blocker) => blocker.id),
  ["score_below_auto_suggested_threshold", "score_below_auto_approval_threshold"],
  "Medium-score needs-review suggestions should explain both blocked automation thresholds.",
);
assert.ok(
  mediumScoreSuggestion?.blockers.some(
    (blocker) => blocker.message === "Score 74 is below auto_suggested threshold 75.",
  ),
  "Per-candidate blocker messages should include the exact score and auto_suggested threshold.",
);

const draftProfileSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...calculateMechanicalMatchupFit({ candidateChampionId: "ahri", enemyChampionId: "yone" }),
    score: 88,
  },
  observed: null,
});

assert.equal(
  draftProfileSuggestion?.automationStatus,
  "needs_review",
  "Draft profile suggestions should require review even when the score is high.",
);
assert.ok(
  draftProfileSuggestion?.blockers.some(
    (blocker) => blocker.id === "candidate_profile_generated_draft",
  ),
  "Draft candidate profiles should produce a generated_draft blocker.",
);
assert.equal(isCounterRankingV2ProfileValueInBounds(-1), false);
assert.equal(isCounterRankingV2ProfileValueInBounds(0), true);
assert.equal(isCounterRankingV2ProfileValueInBounds(10), true);
assert.equal(isCounterRankingV2ProfileValueInBounds(11), false);
assert.equal(getCounterRankingV2ProfileImpactLabel(0), "None");
assert.equal(getCounterRankingV2ProfileImpactLabel(3), "Low");
assert.equal(getCounterRankingV2ProfileImpactLabel(6), "Medium");
assert.equal(getCounterRankingV2ProfileImpactLabel(8), "High");
assert.equal(getCounterRankingV2ProfileImpactLabel(10), "Defining");

const savedDraftProfileSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...calculateMechanicalMatchupFit({ candidateChampionId: "vex", enemyChampionId: "yone" }),
    score: 88,
  },
  observed: null,
  profileStatusesByChampionId: new Map([["vex", "draft"]]),
});

assert.equal(
  savedDraftProfileSuggestion?.automationStatus,
  "needs_review",
  "Persisted draft profile reviews should force generated suggestions into manual review.",
);

const reviewedDraftProfileAutoSuggested = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...calculateMechanicalMatchupFit({ candidateChampionId: "ahri", enemyChampionId: "yone" }),
    score: 75,
  },
  observed: null,
  profileStatusesByChampionId: new Map([["ahri", "reviewed"]]),
});

assert.equal(
  reviewedDraftProfileAutoSuggested?.automationStatus,
  "auto_suggested",
  "Persisted reviewed profile reviews should allow high enough draft-profile suggestions to become auto-suggested.",
);

const reviewedDraftProfileAutoApprovalCandidate = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...calculateMechanicalMatchupFit({ candidateChampionId: "ahri", enemyChampionId: "yone" }),
    score: 88,
  },
  observed: null,
  profileStatusesByChampionId: new Map([["ahri", "reviewed"]]),
});

assert.equal(
  reviewedDraftProfileAutoApprovalCandidate?.automationStatus,
  "auto_approval_candidate",
  "Persisted reviewed profile reviews should allow safe high-score suggestions to become auto-approval candidates.",
);

const highMasterySuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...calculateMechanicalMatchupFit({ candidateChampionId: "yasuo", enemyChampionId: "yone" }),
    score: 88,
  },
  observed: null,
});

assert.equal(
  highMasterySuggestion?.automationStatus,
  "needs_review",
  "High-mastery candidate suggestions should require manual review.",
);
assert.ok(
  highMasterySuggestion?.blockers.some((blocker) => blocker.id === "high_mastery_candidate"),
  "High-mastery candidates should expose a blocker explanation.",
);

const contradictedSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...vexIntoYone,
    score: 88,
  },
  observed: createObservedCounterRankingV2Snapshot({
    games: 25,
    rank: 9,
    winRate: 42,
  }),
});

assert.equal(
  contradictedSuggestion?.automationStatus,
  "needs_review",
  "Observed stats that strongly contradict a suggestion should require review.",
);
assert.ok(
  contradictedSuggestion?.blockers.some(
    (blocker) => blocker.id === "observed_stat_contradiction",
  ),
  "Observed-stat contradictions should expose a blocker explanation.",
);

const oneWeakFactorSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...vexIntoYone,
    factors: [testMechanicalFactor({ contribution: 4 })],
    score: 88,
  },
  observed: null,
});

assert.equal(
  oneWeakFactorSuggestion?.automationStatus,
  "needs_review",
  "Auto approval should be blocked when the score is based on only one weak factor.",
);
assert.ok(
  oneWeakFactorSuggestion?.blockers.some((blocker) => blocker.id === "weak_one_factor_signal"),
  "Weak one-factor suggestions should expose a blocker explanation.",
);

const manuallyRejectedSuggestion = generateCounterRankingV2MechanicalSuggestion({
  mechanicalResult: {
    ...vexIntoYone,
    score: 88,
  },
  observed: null,
  review: createCounterRankingV2MechanicalReview({
    calculatedMechanicalScore: 88,
    counterChampionId: "vex",
    enemyChampionId: "yone",
    reviewStatus: "incorrect_suggestion",
    role: "mid",
  }),
});

assert.equal(
  manuallyRejectedSuggestion?.automationStatus,
  "manual_rejected",
  "Manually rejected suggestions should never become auto-approval candidates.",
);
assert.ok(
  manuallyRejectedSuggestion?.blockers.some((blocker) => blocker.id === "manually_rejected"),
  "Manual rejections should expose a manually rejected blocker.",
);

const blockerSummary = getCounterRankingV2AutomationBlockerSummary([
  {
    automationSuggestion: mediumScoreSuggestion,
    candidateChampionId: "vex",
    mechanicalRank: 1,
    mechanicalResult: {
      ...vexIntoYone,
      score: 74,
    },
    observed: null,
    rankDelta: null,
    review: null,
  },
  {
    automationSuggestion: draftProfileSuggestion,
    candidateChampionId: "ahri",
    mechanicalRank: 2,
    mechanicalResult: {
      ...calculateMechanicalMatchupFit({ candidateChampionId: "ahri", enemyChampionId: "yone" }),
      score: 88,
    },
    observed: null,
    rankDelta: null,
    review: null,
  },
  {
    automationSuggestion: manuallyRejectedSuggestion,
    candidateChampionId: "vex",
    mechanicalRank: 1,
    mechanicalResult: {
      ...vexIntoYone,
      score: 88,
    },
    observed: null,
    rankDelta: null,
    review: createCounterRankingV2MechanicalReview({
      calculatedMechanicalScore: 88,
      counterChampionId: "vex",
      enemyChampionId: "yone",
      reviewStatus: "incorrect_suggestion",
      role: "mid",
    }),
  },
]);

assert.equal(
  blockerSummary.score_below_auto_suggested_threshold,
  1,
  "Blocker summary should count score-below-auto-suggested blockers.",
);
assert.equal(
  blockerSummary.score_below_auto_approval_threshold,
  1,
  "Blocker summary should count score-below-auto-approval blockers.",
);
assert.equal(
  blockerSummary.candidate_profile_generated_draft,
  1,
  "Blocker summary should count generated_draft candidate profiles.",
);
assert.equal(
  blockerSummary.manually_rejected,
  1,
  "Blocker summary should count manually rejected suggestions.",
);

assert.equal(
  generateCounterRankingV2MechanicalSuggestion({
    mechanicalResult: calculateMechanicalMatchupFit({
      candidateChampionId: "unknown",
      enemyChampionId: "yone",
    }),
    observed: null,
  }),
  null,
  "Missing candidate profiles should be skipped safely by suggestion generation.",
);

const generatedMidSuggestions = generateCounterRankingV2MechanicalSuggestionsForRole({
  enemyChampionId: "yone",
  observedByChampionId: new Map(),
  role: "mid",
});

assert.equal(
  generatedMidSuggestions.length,
  counterRankingV2SupportedChampionIds.length - 1,
  "Mid-lane generation should evaluate every supported candidate profile except the selected enemy.",
);
assert.ok(
  generatedMidSuggestions.some((row) => row.candidateChampionId === "vex" && row.automationSuggestion),
  "Mid-lane generation should include generated suggestions for supported candidate pairs.",
);

const missingEnemyGeneratedRows = generateCounterRankingV2MechanicalSuggestionsForRole({
  enemyChampionId: "unknown",
  observedByChampionId: new Map(),
  role: "mid",
});

assert.equal(
  getCounterRankingV2AutomationSummary(missingEnemyGeneratedRows).generatedSuggestions,
  0,
  "Missing enemy profiles should not produce generated automation suggestions.",
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

const reviewFilterRows = getCounterRankingV2ComparisonRows({
  candidateChampionIds: ["vex", "kassadin", "malzahar", "annie", "lissandra", "akali", "yasuo"],
  enemyChampionId: "yone",
  observedByChampionId: new Map([
    [
      "akali",
      createObservedCounterRankingV2Snapshot({
        games: 3,
        rank: 6,
        winRate: 48,
      }),
    ],
  ]),
  reviewsByCandidateId: new Map([
    [
      "vex",
      createCounterRankingV2MechanicalReview({
        calculatedMechanicalScore: 80,
        counterChampionId: "vex",
        enemyChampionId: "yone",
        publicEligible: true,
        reviewStatus: "verified_strong_counter",
        role: "mid",
      }),
    ],
    [
      "kassadin",
      createCounterRankingV2MechanicalReview({
        calculatedMechanicalScore: 70,
        counterChampionId: "kassadin",
        enemyChampionId: "yone",
        reviewStatus: "verified_soft_counter",
        role: "mid",
      }),
    ],
    [
      "malzahar",
      createCounterRankingV2MechanicalReview({
        calculatedMechanicalScore: 60,
        counterChampionId: "malzahar",
        enemyChampionId: "yone",
        reviewStatus: "needs_more_data",
        role: "mid",
      }),
    ],
    [
      "annie",
      createCounterRankingV2MechanicalReview({
        calculatedMechanicalScore: 50,
        counterChampionId: "annie",
        enemyChampionId: "yone",
        publicEligible: true,
        reviewStatus: "incorrect_suggestion",
        role: "mid",
      }),
    ],
    [
      "lissandra",
      createCounterRankingV2MechanicalReview({
        calculatedMechanicalScore: 75,
        counterChampionId: "lissandra",
        enemyChampionId: "yone",
        reviewStatus: "unreviewed",
        role: "mid",
      }),
    ],
  ]),
  role: "mid",
});

assert.equal(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "all",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).length,
  reviewFilterRows.length,
  "The all filter should keep every candidate row.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "verified_strong_counter",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["vex"],
  "The strong-counter filter should only include strong verified reviews.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "verified_soft_counter",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["kassadin"],
  "The soft-counter filter should only include soft verified reviews.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "needs_more_data",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["malzahar"],
  "The needs-more-data filter should only include those review rows.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "incorrect_suggestion",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["annie"],
  "The incorrect-suggestion filter should only include rejected review rows.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "public_eligible",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["vex"],
  "The public-eligible filter should exclude incorrect suggestions even if marked public eligible.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "low_sample",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["akali"],
  "The low-sample filter should include observed rows below the ranked-games threshold.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "unreviewed",
    minimumGames: 5,
    rows: reviewFilterRows,
  })
    .map((row) => row.candidateChampionId)
    .sort(),
  ["akali", "lissandra", "yasuo"],
  "The unreviewed filter should include missing review rows and explicit unreviewed rows.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "manual_approved",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["vex", "kassadin"],
  "The manual-approved automation filter should include approved manual review rows.",
);
assert.deepEqual(
  filterCounterRankingV2RowsByReviewFilter({
    filter: "manual_rejected",
    minimumGames: 5,
    rows: reviewFilterRows,
  }).map((row) => row.candidateChampionId),
  ["annie"],
  "The manual-rejected automation filter should include rejected manual review rows.",
);
assert.deepEqual(
  getCounterRankingV2AutomationSummary(reviewFilterRows),
  {
    autoApprovalCandidates: 0,
    autoApproved: 0,
    autoSuggested: 0,
    generatedSuggestions: 7,
    manualApproved: 2,
    manualRejected: 1,
    needsReview: 4,
  },
  "Automation summary should count generated and manual-priority automation states.",
);

assert.deepEqual(
  getCounterRankingV2ReviewProgressSummary(reviewFilterRows),
  {
    incorrectSuggestions: 1,
    needsMoreData: 1,
    publicEligible: 1,
    reviewed: 4,
    total: 7,
    unreviewed: 3,
    verifiedSoftCounters: 1,
    verifiedStrongCounters: 1,
  },
  "Review progress summary should count review states and public eligibility for the selected matchup.",
);

const publicPreviewRows = getCounterRankingV2PublicPreviewRows({
  minimumGames: 5,
  rows: reviewFilterRows,
});

assert.deepEqual(
  publicPreviewRows.map((row) => row.candidateChampionId),
  ["vex"],
  "Public Preview should include only reviewed mechanical candidates that would be eligible.",
);
assert.deepEqual(
  {
    confidenceLabel: publicPreviewRows.at(0)?.confidenceLabel,
    currentPublicRank: publicPreviewRows.at(0)?.currentPublicRank,
    finalReviewedScore: publicPreviewRows.at(0)?.finalReviewedScore,
    isLowSampleDesignCounter: publicPreviewRows.at(0)?.isLowSampleDesignCounter,
    observedGames: publicPreviewRows.at(0)?.observedGames,
  },
  {
    confidenceLabel: "No data",
    currentPublicRank: null,
    finalReviewedScore: 80,
    isLowSampleDesignCounter: true,
    observedGames: null,
  },
  "Public Preview rows should expose preview-only public rank, score, games, confidence, and low-sample design labels.",
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
    observedGames: publicPreviewRows.at(0)?.observedGames ?? 0,
    review: reviewFilterRows.find((row) => row.candidateChampionId === "vex")?.review ?? null,
    useReviewedMechanicalCounters: false,
  }),
  false,
  "Public Preview data should not affect public API/output while the feature flag is disabled.",
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
const highMasteryReview = {
  ...createCounterRankingV2MechanicalReview({
    calculatedMechanicalScore: 90,
    counterChampionId: "yasuo",
    enemyChampionId: "yone",
    publicEligible: true,
    reviewStatus: "high_mastery_required",
    role: "mid",
  }),
  publicEligible: true,
};

assert.equal(
  isCounterRankingV2ReviewPublicEligible(incorrectSuggestionReview),
  false,
  "Incorrect suggestions should not be public eligible by default.",
);
assert.equal(
  incorrectSuggestionReview.publicEligible,
  false,
  "Incorrect suggestions should be normalized away from persisted public eligibility.",
);
assert.equal(
  isCounterRankingV2ApprovedReviewPublicEligible(highMasteryReview),
  false,
  "Only verified strong/soft mechanical reviews should be approved for public Counter Pick output.",
);
assert.equal(
  isCounterRankingV2PublicCandidateEligible({
    minimumGames: 5,
    observedGames: 3,
    review: highMasteryReview,
    useReviewedMechanicalCounters: true,
  }),
  false,
  "High-mastery reviews should not bypass the public minimum-games threshold.",
);
assert.equal(
  normalizeCounterRankingV2PublicEligible({
    publicEligible: true,
    reviewStatus: "incorrect_suggestion",
  }),
  false,
  "Public eligibility normalization should reject incorrect suggestions.",
);
assert.equal(
  normalizeCounterRankingV2PublicEligible({
    publicEligible: true,
    reviewStatus: "unreviewed",
  }),
  false,
  "Public eligibility normalization should reject unreviewed rows.",
);
assert.equal(
  isCounterRankingV2ReviewStatusPublicEligible("verified_strong_counter"),
  true,
  "Verified statuses can be marked public eligible for future reviewed mechanical counters.",
);
assert.equal(
  isCounterRankingV2ReviewStatusPublicEligible("unreviewed"),
  false,
  "Unreviewed status should require status selection before public eligibility.",
);
assert.equal(
  createCounterRankingV2MechanicalReview({
    calculatedMechanicalScore: 80,
    counterChampionId: "vex",
    enemyChampionId: "yone",
    publicEligible: true,
    reviewStatus: "unreviewed",
    role: "mid",
  }).publicEligible,
  false,
  "Creating unreviewed review rows should not persist public eligibility.",
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
const profileManagementServiceRoleGrantMigration = readFileSync(
  new URL(
    "../supabase/migrations/20260622013000_grant_counter_ranking_v2_profile_management_service_role.sql",
    import.meta.url,
  ),
  "utf8",
);
const publicMechanicalReviewPolicyMigration = readFileSync(
  new URL(
    "../supabase/migrations/20260621115000_add_public_counter_ranking_v2_review_read_policy.sql",
    import.meta.url,
  ),
  "utf8",
);
const autoApprovalAuditMigration = readFileSync(
  new URL(
    "../supabase/migrations/20260621193000_add_counter_ranking_v2_auto_approval_audit.sql",
    import.meta.url,
  ),
  "utf8",
);
const counterPickActionsSource = readFileSync(
  new URL("../src/app/admin/league/counter-picks/actions.ts", import.meta.url),
  "utf8",
);
const counterPickAdminSectionSource = readFileSync(
  new URL("../src/components/admin/league/league-counter-pick-section.tsx", import.meta.url),
  "utf8",
);
const counterPickProfileReviewPageSource = readFileSync(
  new URL("../src/app/admin/counter-picks/profile-review/page.tsx", import.meta.url),
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
assert.match(
  profileManagementServiceRoleGrantMigration,
  /grant select, insert, update\s+on table\s+public\.counter_ranking_v2_profile_reviews,\s+public\.counter_ranking_v2_champion_trait_profiles,\s+public\.counter_ranking_v2_champion_vulnerability_profiles\s+to service_role;/,
  "The service-role profile management action should be granted profile review, trait, and vulnerability table load/save privileges.",
);
assert.match(
  publicMechanicalReviewPolicyMigration,
  /grant select\s+on table public\.counter_ranking_v2_mechanical_reviews\s+to anon, authenticated;/,
  "Public readers should only receive SELECT on the review table.",
);
assert.match(
  publicMechanicalReviewPolicyMigration,
  /public_eligible = true[\s\S]*review_status in \('verified_strong_counter', 'verified_soft_counter'\)/,
  "Public review table reads should be restricted to eligible verified counter rows.",
);
assert.match(
  autoApprovalAuditMigration,
  /add column if not exists generated_at timestamptz/,
  "Auto-approval audit migration should add generated_at to mechanical review rows.",
);
assert.match(
  autoApprovalAuditMigration,
  /add column if not exists generated_by text/,
  "Auto-approval audit migration should add generated_by to mechanical review rows.",
);
assert.match(
  autoApprovalAuditMigration,
  /'auto_generated'/,
  "Auto-approval audit migration should allow auto_generated adjustment reasons.",
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
assert.match(
  counterPickActionsSource,
  /batchSaveCounterRankingV2MechanicalReviews/,
  "The admin action should expose a batch review save action for auto-approval candidates.",
);
assert.match(
  counterPickActionsSource,
  /generated_by: "system"/,
  "Batch review saves should stamp generated_by as system.",
);
assert.match(
  counterPickActionsSource,
  /adjustment_reason: "auto_generated"/,
  "Batch review saves should use the auto_generated adjustment reason.",
);
assert.match(
  counterPickActionsSource,
  /publicEligible: Boolean\(input\.publicEligible\) && input\.action === "approve"/,
  "Batch review saves should keep public eligibility default-off unless explicitly selected for approval.",
);
assert.match(
  counterPickActionsSource,
  /saveCounterRankingV2ProfileReview/,
  "The admin action layer should expose a profile review save action.",
);
assert.match(
  counterPickActionsSource,
  /counter_ranking_v2_profile_reviews/,
  "Profile reviews should persist to the Counter Ranking V2 profile review table.",
);
assert.match(
  counterPickActionsSource,
  /reviewed_by: isReviewed \? authResult\.userId : null/,
  "Promoting a profile to reviewed should stamp reviewed_by metadata.",
);
assert.match(
  counterPickActionsSource,
  /reviewed_at: isReviewed \? now : null/,
  "Promoting a profile to reviewed should stamp reviewed_at metadata.",
);
assert.match(
  counterPickActionsSource,
  /notes: nullableTrim\(input\.reviewNote\)/,
  "Profile review notes should be saved when supported by the table.",
);
assert.match(
  counterPickActionsSource,
  /saveCounterRankingV2ProfileManagement/,
  "The admin action layer should expose profile management saves.",
);
assert.match(
  counterPickActionsSource,
  /counter_ranking_v2_champion_trait_profiles/,
  "Trait edits should save to the Counter Ranking V2 trait profile table.",
);
assert.match(
  counterPickActionsSource,
  /counter_ranking_v2_champion_vulnerability_profiles/,
  "Vulnerability edits should save to the Counter Ranking V2 vulnerability profile table.",
);
assert.match(
  counterPickActionsSource,
  /isCounterRankingV2ProfileValueInBounds\(weight\)/,
  "Profile management saves should reject trait and vulnerability values outside 0-10.",
);
assert.match(
  counterPickActionsSource,
  /normalizeCounterRankingV2TraitId\(trait\.traitId\)/,
  "Profile management saves should normalize legacy trait IDs before storing edits.",
);
assert.match(
  counterPickActionsSource,
  /normalizeCounterRankingV2TraitId\(record\.traitId \?\? record\.trait_id\)/,
  "Profile management reloads should normalize legacy trait IDs from stored JSON.",
);
assert.match(
  counterPickActionsSource,
  /updated_by: authResult\.userId/,
  "Profile management saves should store the editor when supported.",
);
assert.match(
  counterPickAdminSectionSource,
  /generateCounterRankingV2MechanicalSuggestionsForRole/,
  "The admin Shadow Ranking panel should generate suggestions for all supported role profiles.",
);
assert.match(
  counterPickAdminSectionSource,
  /CounterRankingV2ProfileReviewPanel/,
  "The admin Counter Profile Review page should render profile review controls.",
);
assert.match(
  counterPickActionsSource,
  /export async function backfillCounterRankingV2GeneratedDraftProfiles/,
  "Profile management should expose an admin action that backfills generated draft profiles.",
);
assert.match(
  counterPickActionsSource,
  /\.from\("league_champions"\)[\s\S]*\.eq\("is_active", true\)/,
  "Generated draft profile backfill should use the active champion registry.",
);
assert.match(
  counterPickActionsSource,
  /ignoreDuplicates: true, onConflict: "champion_id"/,
  "Generated draft profile backfill should be idempotent and avoid duplicate profile rows.",
);
assert.match(
  counterPickActionsSource,
  /createdProfiles[\s\S]*repairedProfiles[\s\S]*skippedProfiles/,
  "Generated draft profile backfill should report created, repaired, and skipped counts.",
);
assert.match(
  counterPickAdminSectionSource,
  /Create missing drafts/,
  "Counter Profile Review should expose a backfill control for missing generated drafts.",
);
assert.match(
  counterPickAdminSectionSource,
  /Active champions/,
  "Counter Profile Review should show total active champion coverage.",
);
assert.match(
  counterPickAdminSectionSource,
  /Missing profiles/,
  "Counter Profile Review should show missing profile coverage.",
);
assert.match(
  counterPickAdminSectionSource,
  /Draft\/generated_draft/,
  "Counter Profile Review should label draft rows as generated draft coverage.",
);
assert.match(
  counterPickAdminSectionSource,
  /rowsByChampionId = new Map<string, CounterRankingV2ProfileReviewPanelRow>/,
  "Counter Profile Review should dedupe profile rows by normalized champion id before rendering.",
);
assert.match(
  counterPickAdminSectionSource,
  /Counter Ranking V2 profile duplicates detected before rendering/,
  "Counter Profile Review should warn when duplicate profile rows are detected.",
);
assert.match(
  counterPickAdminSectionSource,
  /getPreferredCounterRankingV2ProfileRow/,
  "Counter Profile Review should prefer the best current row when duplicates exist.",
);
assert.match(
  counterPickAdminSectionSource,
  /key=\{normalizeCounterRankingV2ChampionId\(profile\.championId\)\}/,
  "Counter Profile Review should render rows with a normalized stable champion key after dedupe.",
);
assert.match(
  counterPickProfileReviewPageSource,
  /section="counter-picks-profile-review"/,
  "Counter profile review should have its own admin page.",
);
assert.match(
  counterPickAdminSectionSource,
  /const shouldDefaultCounterRankingV2Champion = view === "shadow-ranking"/,
  "Counter Profile Review should not default-select the first supported Counter Ranking V2 champion.",
);
assert.match(
  counterPickAdminSectionSource,
  /Promote to Reviewed/,
  "The profile review panel should expose a direct promotion action.",
);
assert.match(
  counterPickAdminSectionSource,
  /trait\.weight\}\/10/,
  "Trait and vulnerability values should render with explicit /10 scale labels.",
);
assert.match(
  counterPickAdminSectionSource,
  /0 = not present/,
  "The profile management page should explain the 0-10 scale.",
);
assert.match(
  counterPickAdminSectionSource,
  /CounterRankingV2ProfileTraitEditor/,
  "The profile management page should expose editable trait and vulnerability controls.",
);
assert.match(
  counterPickAdminSectionSource,
  /title="Strengths"/,
  "Counter Profile Review should label trait profile sections as Strengths.",
);
assert.match(
  counterPickAdminSectionSource,
  /title="Weaknesses"/,
  "Counter Profile Review should label vulnerability profile sections as Weaknesses.",
);
assert.match(
  counterPickAdminSectionSource,
  /counterRankingV2TraitVocabulary/,
  "The profile management dropdown should be driven by the shared trait vocabulary.",
);
assert.match(
  counterPickAdminSectionSource,
  /isTraitDefinitionVisibleForProfileContext\(traitDefinition, labelContext\)/,
  "Profile management dropdowns should split strength and weakness vocabulary by context.",
);
assert.match(
  counterPickAdminSectionSource,
  /weak_vs_range: "Strong vs range"/,
  "Strength display labels should not show Weak vs wording.",
);
assert.match(
  counterPickAdminSectionSource,
  /weak_vs_roaming: "Vulnerable to roaming"/,
  "Weakness display labels should keep vulnerability wording.",
);
assert.match(
  counterPickAdminSectionSource,
  /normalizeCounterRankingV2TraitId/,
  "The profile management UI should display legacy trait aliases consistently.",
);
assert.match(
  counterPickAdminSectionSource,
  /Add/,
  "The profile management page should allow adding traits and vulnerabilities.",
);
assert.match(
  counterPickAdminSectionSource,
  /aria-label=\{`Remove \$\{getProfileTraitLabel\(trait\.traitId, labelContext\)\}`\}/,
  "The profile management page should allow removing traits and vulnerabilities with compact icon buttons.",
);
assert.match(
  counterPickAdminSectionSource,
  /Confirm editing this reviewed profile/,
  "Reviewed profile edits should have an explicit guardrail.",
);
assert.match(
  counterPickAdminSectionSource,
  /Reviewed coverage by role/,
  "The profile review panel should summarize reviewed coverage by role.",
);
assert.match(
  counterPickAdminSectionSource,
  /profileStatusesByChampionId: counterRankingV2ProfileStatusesByChampionId/,
  "Generated suggestions should use persisted profile review statuses.",
);
assert.match(
  counterPickAdminSectionSource,
  /CounterRankingV2AutomationSummaryPanel/,
  "The admin Shadow Ranking panel should render automation summary counts.",
);
assert.match(
  counterPickAdminSectionSource,
  /auto_suggested/,
  "The admin Shadow Ranking filter controls should include automation statuses.",
);
assert.match(
  counterPickAdminSectionSource,
  /Show calculation details/,
  "Raw mechanical contribution details should remain available behind a secondary details control.",
);
assert.match(
  counterPickAdminSectionSource,
  /formatCounterRankingV2ImpactLevel/,
  "The admin factor cards should show readable impact labels instead of raw numbers by default.",
);
assert.match(
  counterPickAdminSectionSource,
  /Weak signal/,
  "The admin factor cards should flag weak mechanical signal rows.",
);
assert.match(
  counterPickAdminSectionSource,
  /Auto-approval batch review/,
  "The admin Shadow Ranking panel should expose batch controls for auto-approval candidates.",
);
assert.match(
  counterPickAdminSectionSource,
  /Generated suggestion/,
  "Generated suggestion panels should clearly identify automation output.",
);
assert.match(
  counterPickAdminSectionSource,
  /Why this needs review/,
  "Generated suggestion panels should explain why needs-review rows need review.",
);
assert.match(
  counterPickAdminSectionSource,
  /Automation blocker breakdown/,
  "The admin Shadow Ranking panel should render automation blocker counts.",
);
assert.match(
  counterPickAdminSectionSource,
  /auto_suggested 75-84, auto_approval_candidate 85\+, 65-74 needs_review/,
  "The admin Shadow Ranking panel should show current automation thresholds.",
);
assert.match(
  counterPickAdminSectionSource,
  /Observed-stat contradiction/,
  "The admin Shadow Ranking panel should label observed-stat contradiction blockers.",
);
assert.match(
  counterPickAdminSectionSource,
  /Top mechanical reasons/,
  "Generated suggestion panels should label top mechanical reasons.",
);
assert.match(
  counterPickAdminSectionSource,
  /Public eligible on approve/,
  "Batch approval public eligibility should be an explicit UI choice.",
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

function testMechanicalFactor({
  candidateStrength = "anti_dash",
  contribution,
  enemyVulnerability = "dash_reliant",
  interactionWeight = 1,
  reason = "Readable mechanical reason.",
}) {
  return {
    candidateStrength,
    contribution,
    enemyVulnerability,
    interactionWeight,
    reason,
  };
}
