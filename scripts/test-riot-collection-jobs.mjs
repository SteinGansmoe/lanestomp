import assert from "node:assert/strict";

const collectionModule = await import("../src/features/league/riot-collection-jobs.ts");

const {
  defaultRiotCollectionSafetyLimits,
  getRiotCollectionProgressPercent,
  isRiotCollectionTerminalStatus,
  normalizeCollectionScanSummary,
  riotCollectionLadderSourcesByBracket,
  riotCollectionRankBrackets,
  riotCollectionTargets,
} = collectionModule;

testBracketMappings();
testSupportedTargets();
testSafetyLimits();
testProgressPercentage();
testTerminalStatuses();
testScanSummaryNormalization();

console.log("Riot collection job regression tests passed.");

function testBracketMappings() {
  assert.deepEqual(
    riotCollectionLadderSourcesByBracket["iron-silver"].map((source) => source.tier),
    ["IRON", "BRONZE", "SILVER"],
  );
  assert.deepEqual(
    riotCollectionLadderSourcesByBracket["gold-emerald"].map((source) => source.tier),
    ["GOLD", "PLATINUM", "EMERALD"],
  );
  assert.deepEqual(
    riotCollectionLadderSourcesByBracket.diamond.map((source) => source.tier),
    ["DIAMOND"],
  );
  assert.equal(
    riotCollectionLadderSourcesByBracket["master-plus"].every(
      (source) => source.route === "high-tier",
    ),
    true,
  );
  assert.deepEqual(
    [...riotCollectionRankBrackets],
    ["iron-silver", "gold-emerald", "diamond", "master-plus"],
  );
}

function testSupportedTargets() {
  assert.deepEqual([...riotCollectionTargets], [50, 100, 200]);
}

function testSafetyLimits() {
  assert.equal(defaultRiotCollectionSafetyLimits.maxSeedBatchSize, 20);
  assert.equal(defaultRiotCollectionSafetyLimits.maxLadderPagesPerJob, 5);
  assert.equal(defaultRiotCollectionSafetyLimits.maxNewCandidatesPerJob, 100);
  assert.equal(defaultRiotCollectionSafetyLimits.maxIdentifierLookupsPerJob, 150);
}

function testProgressPercentage() {
  assert.equal(
    getRiotCollectionProgressPercent({
      targetUniqueMatches: 200,
      uniqueMatchesProcessed: 146,
    }),
    73,
  );
  assert.equal(
    getRiotCollectionProgressPercent({
      targetUniqueMatches: 50,
      uniqueMatchesProcessed: 80,
    }),
    100,
  );
}

function testTerminalStatuses() {
  assert.equal(isRiotCollectionTerminalStatus("completed"), true);
  assert.equal(isRiotCollectionTerminalStatus("completed-partial"), true);
  assert.equal(isRiotCollectionTerminalStatus("failed"), true);
  assert.equal(isRiotCollectionTerminalStatus("scanning"), false);
  assert.equal(isRiotCollectionTerminalStatus("paused"), false);
}

function testScanSummaryNormalization() {
  assert.deepEqual(
    normalizeCollectionScanSummary({
      observationDuplicatesSkipped: 2,
      observationsInserted: 19,
      statsRowsUpdated: 84,
      uniqueMatchIds: 20,
    }),
    {
      duplicates: 2,
      newObservations: 19,
      statRowsUpdated: 84,
      uniqueMatchIds: 20,
    },
  );
  assert.deepEqual(normalizeCollectionScanSummary(null), {
    duplicates: 0,
    newObservations: 0,
    statRowsUpdated: 0,
    uniqueMatchIds: 0,
  });
}
