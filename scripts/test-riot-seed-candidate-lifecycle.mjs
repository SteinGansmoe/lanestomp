import assert from "node:assert/strict";

const lifecycleModule = await import("../src/features/league/riot-seed-candidate-lifecycle.ts");

const {
  deriveSeedCandidateLifecycle,
  getSeedCandidateRankBracket,
  getSeedScanCooldownEligibleAt,
  getSeedScanRetryEligibleAt,
  MAX_CONSECUTIVE_SCAN_FAILURES,
} = lifecycleModule;

const now = new Date("2026-06-17T12:00:00.000Z");

testUnrankedCandidateRequiresRankEnrichment();
testRankedCandidateWithSignalIsReady();
testRecentlyScannedCandidate();
testCooldownCandidate();
testCandidateReadyAfterCooldown();
testRunningCandidateCannotBeSelected();
testLowSignalCandidate();
testProvisionalLadderCandidateReadyWithoutObservations();
testManualRejectionAndRestore();
testSuccessfulScanResetsFailures();
testRetryBackoff();
testMaximumFailures();
testRankBracketMapping();

console.log("Riot seed candidate lifecycle regression tests passed.");

function testUnrankedCandidateRequiresRankEnrichment() {
  const lifecycle = deriveSeedCandidateLifecycle(candidate({ rankStatus: "pending" }), { now });

  assert.equal(lifecycle.state, "needs-rank-enrichment");
  assert.equal(lifecycle.reasonCodes.includes("missing-rank"), true);
  assert.equal(lifecycle.isSelectableForScan, false);
}

function testRankedCandidateWithSignalIsReady() {
  const lifecycle = deriveSeedCandidateLifecycle(candidate(), { now });

  assert.equal(lifecycle.state, "ready-to-scan");
  assert.equal(lifecycle.isSelectableForScan, true);
  assert.equal(lifecycle.rankBracket, "gold-emerald");
}

function testRecentlyScannedCandidate() {
  const lifecycle = deriveSeedCandidateLifecycle(
    candidate({
      lastSuccessfulScanAt: "2026-06-16T18:00:00.000Z",
      nextEligibleScanAt: "2026-06-23T18:00:00.000Z",
    }),
    { now },
  );

  assert.equal(lifecycle.state, "recently-scanned");
  assert.equal(lifecycle.isSelectableForScan, false);
}

function testCooldownCandidate() {
  const lifecycle = deriveSeedCandidateLifecycle(
    candidate({
      lastSuccessfulScanAt: "2026-06-14T12:00:00.000Z",
      nextEligibleScanAt: "2026-06-21T12:00:00.000Z",
    }),
    { now },
  );

  assert.equal(lifecycle.state, "cooling-down");
  assert.equal(lifecycle.reasonCodes.includes("cooldown-active"), true);
}

function testCandidateReadyAfterCooldown() {
  const lifecycle = deriveSeedCandidateLifecycle(
    candidate({
      lastSuccessfulScanAt: "2026-06-08T12:00:00.000Z",
      nextEligibleScanAt: "2026-06-15T12:00:00.000Z",
    }),
    { now },
  );

  assert.equal(lifecycle.state, "ready-to-scan");
  assert.equal(lifecycle.isSelectableForScan, true);
}

function testRunningCandidateCannotBeSelected() {
  const lifecycle = deriveSeedCandidateLifecycle(candidate({ status: "active" }), { now });

  assert.equal(lifecycle.state, "ready-to-scan");
  assert.equal(lifecycle.reasonCodes.includes("scan-running"), true);
  assert.equal(lifecycle.isSelectableForScan, false);
}

function testLowSignalCandidate() {
  const lifecycle = deriveSeedCandidateLifecycle(candidate({ observedGames: 1 }), { now });

  assert.equal(lifecycle.state, "low-signal");
  assert.equal(lifecycle.reasonCodes.includes("too-few-observations"), true);
}

function testProvisionalLadderCandidateReadyWithoutObservations() {
  const lifecycle = deriveSeedCandidateLifecycle(
    candidate({ observedGames: 0, source: "ladder_import" }),
    { now },
  );

  assert.equal(lifecycle.state, "ready-to-scan");
  assert.equal(lifecycle.isSelectableForScan, true);
  assert.equal(lifecycle.reasonCodes.includes("too-few-observations"), true);
  assert.equal(lifecycle.reasonCodes.includes("ready"), true);
}

function testManualRejectionAndRestore() {
  const rejected = deriveSeedCandidateLifecycle(
    candidate({ manuallyRejectedAt: "2026-06-17T10:00:00.000Z" }),
    { now },
  );
  const restored = deriveSeedCandidateLifecycle(candidate({ manuallyRejectedAt: null }), { now });

  assert.equal(rejected.state, "rejected");
  assert.equal(rejected.isSelectableForScan, false);
  assert.equal(restored.state, "ready-to-scan");
}

function testSuccessfulScanResetsFailures() {
  const lifecycle = deriveSeedCandidateLifecycle(
    candidate({
      consecutiveFailures: 0,
      lastSuccessfulScanAt: "2026-06-08T12:00:00.000Z",
      nextEligibleScanAt: "2026-06-15T12:00:00.000Z",
      status: "candidate",
    }),
    { now },
  );

  assert.equal(lifecycle.state, "ready-to-scan");
}

function testRetryBackoff() {
  const failedAt = "2026-06-17T11:00:00.000Z";
  const retryAt = getSeedScanRetryEligibleAt(failedAt, 2);
  const lifecycle = deriveSeedCandidateLifecycle(
    candidate({
      consecutiveFailures: 2,
      nextRetryAt: retryAt,
      status: "failed",
    }),
    { now },
  );

  assert.equal(lifecycle.state, "failed");
  assert.equal(lifecycle.reasonCodes.includes("retry-backoff"), true);
}

function testMaximumFailures() {
  const lifecycle = deriveSeedCandidateLifecycle(
    candidate({
      consecutiveFailures: MAX_CONSECUTIVE_SCAN_FAILURES,
      status: "failed",
    }),
    { now },
  );

  assert.equal(lifecycle.state, "failed");
  assert.equal(lifecycle.isSelectableForScan, false);
}

function testRankBracketMapping() {
  assert.equal(getSeedCandidateRankBracket(candidate({ rankTier: "SILVER" })), "iron-silver");
  assert.equal(getSeedCandidateRankBracket(candidate({ rankTier: "DIAMOND" })), "diamond");
  assert.equal(getSeedCandidateRankBracket(candidate({ rankTier: "MASTER" })), "master-plus");
  assert.equal(
    getSeedScanCooldownEligibleAt("2026-06-17T12:00:00.000Z"),
    "2026-06-24T12:00:00.000Z",
  );
}

function candidate({
  consecutiveFailures = 0,
  lastScannedAt = null,
  lastSuccessfulScanAt = null,
  manuallyRejectedAt = null,
  nextEligibleScanAt = null,
  nextRetryAt = null,
  observedGames = 2,
  rankLastSuccessAt = "2026-06-16T12:00:00.000Z",
  rankStatus = "ranked",
  rankTier = "GOLD",
  source = "match_discovery",
  status = "candidate",
} = {}) {
  return {
    consecutive_scan_failures: consecutiveFailures,
    last_scanned_at: lastScannedAt,
    last_successful_scan_at: lastSuccessfulScanAt,
    manually_rejected_at: manuallyRejectedAt,
    next_eligible_scan_at: nextEligibleScanAt,
    next_retry_at: nextRetryAt,
    observed_games: observedGames,
    rank_enrichment_status: rankStatus,
    rank_last_success_at: rankLastSuccessAt,
    rank_next_eligible_at: null,
    rank_tier: rankTier,
    source,
    status,
  };
}
