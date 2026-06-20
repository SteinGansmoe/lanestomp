import assert from "node:assert/strict";

const maxSeedCandidatesPerScan = 20;
const maxSeedCandidateRankRefreshBatch = 20;
const recentSeedCandidateScanHours = 24;

testDuplicateProtection();
testBatchLimit();
testRankRefreshBatchLimit();
testVisibleSelectionPruning();
testRecentScanWarning();

console.log("Riot seed candidate bulk control regression tests passed.");

function testDuplicateProtection() {
  const currentPuuids = ["puuid-a", "puuid-b"];
  const selectedPuuids = ["puuid-b", "puuid-c", "puuid-c"];
  const merged = mergePuuids(currentPuuids, selectedPuuids);

  assert.deepEqual(merged, ["puuid-a", "puuid-b", "puuid-c"]);
}

function testBatchLimit() {
  assert.equal(isWithinBulkScanLimit(Array.from({ length: 20 })), true);
  assert.equal(isWithinBulkScanLimit(Array.from({ length: 21 })), false);
}

function testRankRefreshBatchLimit() {
  assert.equal(isWithinRankRefreshLimit(Array.from({ length: 20 })), true);
  assert.equal(isWithinRankRefreshLimit(Array.from({ length: 21 })), false);
}

function testVisibleSelectionPruning() {
  const selectedIds = new Set(["visible-1", "hidden-1", "visible-2"]);
  const visibleIds = ["visible-1", "visible-2"];
  const pruned = pruneSelectionToVisible(selectedIds, visibleIds);

  assert.deepEqual(Array.from(pruned).sort(), ["visible-1", "visible-2"]);
}

function testRecentScanWarning() {
  const now = new Date("2026-06-15T12:00:00.000Z").getTime();
  const recent = new Date(now - 2 * 60 * 60 * 1000).toISOString();
  const old = new Date(now - 48 * 60 * 60 * 1000).toISOString();

  assert.equal(wasScannedRecently(recent, now), true);
  assert.equal(wasScannedRecently(old, now), false);
  assert.equal(wasScannedRecently(null, now), false);
}

function mergePuuids(currentPuuids, selectedPuuids) {
  return Array.from(new Set([...currentPuuids, ...selectedPuuids].map(String).filter(Boolean)));
}

function isWithinBulkScanLimit(values) {
  return values.length <= maxSeedCandidatesPerScan;
}

function isWithinRankRefreshLimit(values) {
  return values.length <= maxSeedCandidateRankRefreshBatch;
}

function pruneSelectionToVisible(selectedIds, visibleIds) {
  const visibleIdSet = new Set(visibleIds);

  return new Set([...selectedIds].filter((candidateId) => visibleIdSet.has(candidateId)));
}

function wasScannedRecently(value, now) {
  if (!value) {
    return false;
  }

  const timestamp = new Date(value).getTime();

  return (
    Number.isFinite(timestamp) && now - timestamp < recentSeedCandidateScanHours * 60 * 60 * 1000
  );
}
