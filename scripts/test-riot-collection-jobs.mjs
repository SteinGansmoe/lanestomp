import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const collectionModule = await import("../src/features/league/riot-collection-jobs.ts");
const collectionActionsSource = readFileSync(
  new URL("../src/app/admin/league/counter-picks/actions.ts", import.meta.url),
  "utf8",
);

const {
  createEmptyRiotCollectionDiscoveryDiagnostics,
  defaultRiotCollectionSafetyLimits,
  getAdaptiveRiotCollectionSeedBatchSize,
  getRiotCollectionDiscoveryStopDetail,
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
testAdaptiveSeedBatchSize();
testTerminalStatuses();
testScanSummaryNormalization();
testDiscoveryDiagnostics();
testDiscoverySourceCodeGuards();

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
  assert.deepEqual(riotCollectionLadderSourcesByBracket["gold-emerald"][0].divisions, [
    "IV",
    "III",
    "II",
    "I",
  ]);
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

function testDiscoverySourceCodeGuards() {
  assert.equal(collectionActionsSource.includes("normalizedEntry.puuid"), true);
  assert.equal(collectionActionsSource.includes("normalizedEntry.summonerId"), true);
  assert.equal(collectionActionsSource.includes("fetchSummonerByEncryptedId"), true);
  assert.equal(collectionActionsSource.includes("stop_detail"), true);
  assert.equal(
    collectionActionsSource.includes(
      "Ladder discovery skipped because Riot API configuration is missing.",
    ),
    true,
  );
  assert.equal(collectionActionsSource.includes("Array.isArray(tierDivisionEntries)"), true);
  assert.equal(collectionActionsSource.includes("assertScanControlAllowsProgress"), true);
  assert.equal(collectionActionsSource.includes("mirrorScanProgressToCollectionJob"), true);
  assert.equal(collectionActionsSource.includes("getAdaptiveRiotCollectionSeedBatchSize"), true);
  assert.equal(collectionActionsSource.includes("reconcileCompletedCollectionChild"), true);
  assert.equal(collectionActionsSource.includes("claimCollectionChildConsumption"), true);
  assert.equal(collectionActionsSource.includes("collection_result_consumed_at"), true);
  assert.equal(collectionActionsSource.includes("getRiotCollectionConsistencyIssue"), true);
  assert.equal(collectionActionsSource.includes("terminal-child-unconsumed"), true);
  assert.equal(collectionActionsSource.includes("calculateCollectionConsumedTotals"), true);
  assert.equal(
    collectionActionsSource.includes("void refreshCollection(activeJob.id, { silent: true });"),
    false,
  );
}

function testDiscoveryDiagnostics() {
  const diagnostics = createEmptyRiotCollectionDiscoveryDiagnostics({
    collectionJobId: 17,
    event: "ladder-discovery-started",
    rankBracket: "gold-emerald",
    readySeedsBeforeDiscovery: 0,
    remainingTargetMatches: 182,
    role: "mid",
  });

  assert.equal(diagnostics.invocation.collectionJobId, 17);
  assert.equal(diagnostics.identifiers.directPuuids, 0);
  assert.equal(diagnostics.lifecycle.eligibleSeedsProduced, 0);
  assert.equal(
    getRiotCollectionDiscoveryStopDetail({
      ...diagnostics,
      entriesFetched: 83,
      identifiers: {
        ...diagnostics.identifiers,
        failed: 83,
      },
    }),
    "83 ladder players were found, but no PUUIDs could be resolved.",
  );
  assert.equal(
    getRiotCollectionDiscoveryStopDetail({
      ...diagnostics,
      candidates: {
        ...diagnostics.candidates,
        created: 2,
        reused: 1,
      },
      entriesFetched: 3,
      identifiers: {
        ...diagnostics.identifiers,
        directPuuids: 3,
        resolved: 3,
      },
      lifecycle: {
        ...diagnostics.lifecycle,
        eligibleSeedsProduced: 3,
        "ready-to-scan": 3,
      },
    }),
    "3 eligible seeds were produced, but seed selection still found no unused candidate.",
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

function testAdaptiveSeedBatchSize() {
  assert.equal(
    getAdaptiveRiotCollectionSeedBatchSize({
      seedsUsed: 0,
      targetUniqueMatches: 50,
      uniqueMatchesProcessed: 0,
    }),
    13,
  );
  assert.equal(
    getAdaptiveRiotCollectionSeedBatchSize({
      seedsUsed: 10,
      targetUniqueMatches: 100,
      uniqueMatchesProcessed: 80,
    }),
    3,
  );
  assert.equal(
    getAdaptiveRiotCollectionSeedBatchSize({
      seedsUsed: 10,
      targetUniqueMatches: 100,
      uniqueMatchesProcessed: 100,
    }),
    1,
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
