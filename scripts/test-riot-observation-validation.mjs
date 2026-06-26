import assert from "node:assert/strict";

import { buildChampionRegistry } from "./lib/league-champion-normalizer.mjs";
import {
  createObservationValidationContext,
  exceedsValidationFailureRate,
  observationValidityRules,
  partitionValidatedRows,
  summarizeValidationFailures,
  validateCounterPickAggregate,
  validateMatchupObservation,
  validateSeedCandidateObservation,
} from "./lib/riot-observation-validation.mjs";

const candidateId = "11111111-1111-4111-8111-111111111111";
const validTimestamp = new Date(Date.now() - 60_000).toISOString();
const championRegistry = buildChampionRegistry([
  champion("Ahri", "103", "Ahri", "ahri"),
  champion("Fiddlesticks", "9", "Fiddlesticks", "fiddlesticks"),
  champion("Kaisa", "145", "Kai'Sa", "kaisa"),
  champion("Khazix", "121", "Kha'Zix", "khazix"),
  champion("MonkeyKing", "62", "Wukong", "wukong"),
  champion("Nunu", "20", "Nunu & Willump", "nunu-willump"),
  champion("Renata", "888", "Renata Glasc", "renata-glasc"),
  champion("Yasuo", "157", "Yasuo", "yasuo"),
  champion("Zed", "238", "Zed", "zed"),
]);
const context = createObservationValidationContext({
  candidateIds: [candidateId],
  championRegistry,
});

testValidCandidateObservation();
testUnknownChampion();
testFiddlesticksCanonicalValue();
testRawNonCanonicalAliasRejected();
testInvalidRole();
testRoutingMismatch();
testWinnerConflict();
testSameChampionMatchup();
testObservationValidityRulesStayBroad();
testInvalidMatchupObservationRoleAndChampion();
testRankBracketValidation();
testAggregateMismatch();
testBatchPartitioning();
testMultipleIssuesOnOneRow();
testFailureRateThreshold();
testLargeBatchSampleBound();

console.log("Riot observation validation regression tests passed.");

function testValidCandidateObservation() {
  const result = validateSeedCandidateObservation(validCandidateObservation(), context);

  assert.equal(result.valid, true);
  assert.equal(result.value.champion, "Ahri");
}

function testUnknownChampion() {
  const result = validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      champion: "DefinitelyNotAChampion",
    },
    context,
  );

  assertCodes(result, ["UNKNOWN_CHAMPION"]);
}

function testFiddlesticksCanonicalValue() {
  const result = validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      champion: "Fiddlesticks",
    },
    context,
  );

  assert.equal(result.valid, true);
}

function testRawNonCanonicalAliasRejected() {
  const result = validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      champion: "FiddleSticks",
    },
    context,
  );

  assertCodes(result, ["UNKNOWN_CHAMPION"]);
}

function testInvalidRole() {
  const result = validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      role: "middle",
    },
    context,
  );

  assertCodes(result, ["INVALID_ROLE"]);
}

function testRoutingMismatch() {
  const result = validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      platform_region: "EUW1",
      regional_routing: "AMERICAS",
    },
    context,
  );

  assertCodes(result, ["ROUTING_REGION_MISMATCH"]);
}

function testWinnerConflict() {
  const result = validateMatchupObservation(
    {
      ...validMatchupObservation(),
      champion_a: "Ahri",
      champion_a_won: true,
      champion_b: "Zed",
      winner_champion: "Zed",
    },
    context,
  );

  assertCodes(result, ["WINNER_BOOLEAN_CONFLICT"]);
}

function testSameChampionMatchup() {
  const result = validateMatchupObservation(
    {
      ...validMatchupObservation(),
      champion_a: "Ahri",
      champion_b: "Ahri",
      winner_champion: "Ahri",
    },
    context,
  );

  assertCodes(result, ["SAME_CHAMPION_MATCHUP"]);
}

function testObservationValidityRulesStayBroad() {
  assert.ok(observationValidityRules.required.includes("supported role"));
  assert.ok(observationValidityRules.required.includes("winner and loser can be determined"));
  assert.ok(observationValidityRules.intentionallyNotRequired.includes("seed candidate main role"));
  assert.ok(
    observationValidityRules.intentionallyNotRequired.includes("multiple historical matchup games"),
  );
}

function testInvalidMatchupObservationRoleAndChampion() {
  const result = validateMatchupObservation(
    {
      ...validMatchupObservation(),
      champion_b: "DefinitelyNotAChampion",
      role: "middle",
    },
    context,
  );

  assertCodes(result, ["INVALID_ROLE", "UNKNOWN_CHAMPION"]);
}

function testRankBracketValidation() {
  const invalidObservation = validateMatchupObservation(
    {
      ...validMatchupObservation(),
      rank_bracket: "all",
    },
    context,
  );
  const invalidAggregate = validateCounterPickAggregate(
    {
      ...validAggregate(),
      rank_bracket: "made-up",
    },
    context,
  );

  assertCodes(invalidObservation, ["INVALID_RANK_BRACKET"]);
  assertCodes(invalidAggregate, ["INVALID_RANK_BRACKET"]);
}

function testAggregateMismatch() {
  const result = validateCounterPickAggregate(
    {
      ...validAggregate(),
      games: 10,
      losses: 2,
      wins: 7,
    },
    context,
  );

  assertCodes(result, ["INVALID_GAME_TOTAL"]);
}

function testBatchPartitioning() {
  const rows = [
    ...Array.from({ length: 249 }, (_, index) => ({
      ...validCandidateObservation(),
      match_id: `EUW1_${10_000 + index}`,
    })),
    {
      ...validCandidateObservation(),
      champion: "DefinitelyNotAChampion",
      match_id: "EUW1_99999",
    },
  ];
  const partition = partitionValidatedRows(rows, validateSeedCandidateObservation, context);

  assert.equal(partition.valid.length, 249);
  assert.equal(partition.invalid.length, 1);
  assert.equal(partition.validated, 250);
  assertCodes({ issues: partition.invalid[0].issues, valid: false }, ["UNKNOWN_CHAMPION"]);
}

function testMultipleIssuesOnOneRow() {
  const result = validateSeedCandidateObservation(
    {
      ...validCandidateObservation(),
      champion: "DefinitelyNotAChampion",
      game_start_at: "not-a-date",
      role: "middle",
    },
    context,
  );

  assert.equal(result.valid, false);
  assert.equal(result.issues.length, 3);
  assertCodes(result, ["INVALID_ROLE", "INVALID_TIMESTAMP", "UNKNOWN_CHAMPION"]);
}

function testFailureRateThreshold() {
  assert.equal(exceedsValidationFailureRate({ rejected: 1, validated: 100 }), false);
  assert.equal(exceedsValidationFailureRate({ rejected: 6, validated: 100 }), true);
}

function testLargeBatchSampleBound() {
  const rows = Array.from({ length: 10_000 }, (_, index) => ({
    ...validCandidateObservation(),
    champion: index % 1000 === 0 ? "DefinitelyNotAChampion" : "Ahri",
    match_id: `EUW1_${1_000_000 + index}`,
  }));
  const partition = partitionValidatedRows(rows, validateSeedCandidateObservation, context);
  const summary = summarizeValidationFailures(partition.invalid);

  assert.equal(partition.validated, 10_000);
  assert.equal(partition.invalid.length, 10);
  assert.equal(summary.samples.length, 10);
}

function validCandidateObservation() {
  return {
    candidate_id: candidateId,
    champion: "Ahri",
    game_duration_seconds: 1800,
    game_start_at: validTimestamp,
    match_id: "EUW1_1234567890",
    patch: "16.12",
    platform_region: "EUW1",
    queue_id: 420,
    regional_routing: "EUROPE",
    role: "mid",
    scan_job_id: 1,
    won: true,
  };
}

function validMatchupObservation() {
  return {
    champion_a: "Ahri",
    champion_a_puuid: "a".repeat(78),
    champion_a_tier: null,
    champion_a_won: true,
    champion_b: "Zed",
    champion_b_puuid: "b".repeat(78),
    champion_b_tier: null,
    game_duration_seconds: 1800,
    game_start_at: validTimestamp,
    match_id: "EUW1_1234567890",
    patch: "16.12",
    queue_id: 420,
    rank_bracket: null,
    role: "mid",
    scan_job_id: 1,
    seen_count: 1,
    winner_champion: "Ahri",
  };
}

function validAggregate() {
  return {
    counter_champion_id: "Ahri",
    enemy_champion_id: "Zed",
    games: 10,
    losses: 4,
    patch: "16.12",
    role: "mid",
    tier: "A",
    win_rate: 60,
    wins: 6,
  };
}

function assertCodes(result, expectedCodes) {
  assert.equal(result.valid, false);
  const actualCodes = result.issues.map((issue) => issue.code).sort();

  assert.deepEqual(actualCodes, [...expectedCodes].sort());
}

function champion(id, riotKey, name, slug) {
  return {
    id,
    name,
    riot_data_key: id,
    riot_key: riotKey,
    slug,
  };
}
