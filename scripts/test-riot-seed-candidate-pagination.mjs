import assert from "node:assert/strict";

const paginationModule = await import("../src/features/league/riot-seed-candidate-rank-groups.ts");

const {
  createDefaultRiotSeedCandidateGroupRequest,
  getRiotSeedCandidateRange,
  getRiotSeedCandidateRankGroup,
  getRiotSeedCandidateTotalPages,
  isRiotSeedCandidateBulkSelectionWithinLimit,
  normalizeRiotSeedCandidatePage,
  normalizeRiotSeedCandidatePageSize,
  pruneRiotSeedCandidateSelection,
  riotSeedCandidateRankGroupIds,
  selectVisibleRiotSeedCandidates,
  sortRiotSeedCandidateRows,
  toggleRiotSeedCandidateSelection,
} = paginationModule;

testRankGroupDefinitions();
testPageNormalization();
testRankSorting();
testIndependentGroupPaging();
testVisiblePageSelection();
testSelectionPruningAndLimits();

console.log("Riot seed candidate pagination regression tests passed.");

function testRankGroupDefinitions() {
  assert.deepEqual(riotSeedCandidateRankGroupIds, [
    "master-plus",
    "diamond",
    "gold-emerald",
    "iron-silver",
    "unknown",
  ]);

  assert.equal(getRiotSeedCandidateRankGroup(candidate({ rankTier: "CHALLENGER" })), "master-plus");
  assert.equal(getRiotSeedCandidateRankGroup(candidate({ rankTier: "MASTER" })), "master-plus");
  assert.equal(getRiotSeedCandidateRankGroup(candidate({ rankTier: "DIAMOND" })), "diamond");
  assert.equal(getRiotSeedCandidateRankGroup(candidate({ rankTier: "EMERALD" })), "gold-emerald");
  assert.equal(getRiotSeedCandidateRankGroup(candidate({ rankTier: "GOLD" })), "gold-emerald");
  assert.equal(getRiotSeedCandidateRankGroup(candidate({ rankTier: "SILVER" })), "iron-silver");
  assert.equal(getRiotSeedCandidateRankGroup(candidate({ rankTier: "IRON" })), "iron-silver");
  assert.equal(
    getRiotSeedCandidateRankGroup(
      candidate({ rankEnrichmentStatus: "pending", rankTier: null }),
    ),
    "unknown",
  );
  assert.equal(
    getRiotSeedCandidateRankGroup(
      candidate({ rankEnrichmentStatus: "failed", rankTier: null }),
    ),
    "unknown",
  );
}

function testPageNormalization() {
  assert.equal(normalizeRiotSeedCandidatePage(3), 3);
  assert.equal(normalizeRiotSeedCandidatePage(0), 1);
  assert.equal(normalizeRiotSeedCandidatePageSize(25), 25);
  assert.equal(normalizeRiotSeedCandidatePageSize(50), 50);
  assert.equal(normalizeRiotSeedCandidatePageSize(999), 25);
  assert.equal(getRiotSeedCandidateTotalPages(0, 25), 1);
  assert.equal(getRiotSeedCandidateTotalPages(101, 25), 5);
  assert.deepEqual(getRiotSeedCandidateRange({ page: 1, pageSize: 25, totalCount: 0 }), {
    from: 0,
    to: 0,
  });
  assert.deepEqual(getRiotSeedCandidateRange({ page: 2, pageSize: 25, totalCount: 38 }), {
    from: 26,
    to: 38,
  });
}

function testRankSorting() {
  const sorted = sortRiotSeedCandidateRows(
    [
      candidate({ id: "master-low", leaguePoints: 20, rankDivision: "II", rankTier: "MASTER" }),
      candidate({ id: "challenger", leaguePoints: 500, rankTier: "CHALLENGER" }),
      candidate({ id: "master-high", leaguePoints: 400, rankDivision: "I", rankTier: "MASTER" }),
      candidate({ id: "grandmaster", leaguePoints: 700, rankTier: "GRANDMASTER" }),
    ],
    { sort: "rank_tier", sortDirection: "asc" },
  );

  assert.deepEqual(
    sorted.map((row) => row.id),
    ["challenger", "grandmaster", "master-high", "master-low"],
  );

  const observedGames = sortRiotSeedCandidateRows(
    [
      candidate({ id: "few", observedGames: 8 }),
      candidate({ id: "many", observedGames: 40 }),
      candidate({ id: "some", observedGames: 20 }),
    ],
    { sort: "observed_games", sortDirection: "desc" },
  );

  assert.deepEqual(
    observedGames.map((row) => row.id),
    ["many", "some", "few"],
  );
}

function testIndependentGroupPaging() {
  const groupStates = {
    diamond: createDefaultRiotSeedCandidateGroupRequest("diamond"),
    "master-plus": createDefaultRiotSeedCandidateGroupRequest("master-plus"),
  };

  groupStates["master-plus"] = {
    ...groupStates["master-plus"],
    page: 3,
    pageSize: 50,
  };

  assert.equal(groupStates["master-plus"].page, 3);
  assert.equal(groupStates["master-plus"].pageSize, 50);
  assert.equal(groupStates.diamond.page, 1);
  assert.equal(groupStates.diamond.pageSize, 25);
  assert.equal(groupStates["master-plus"].sort, "rank_tier");
  assert.equal(groupStates["master-plus"].sortDirection, "asc");
}

function testVisiblePageSelection() {
  const selected = new Set(["hidden-selected"]);
  const nextSelection = selectVisibleRiotSeedCandidates(selected, ["visible-1", "visible-2"]);

  assert.deepEqual([...nextSelection].sort(), ["hidden-selected", "visible-1", "visible-2"]);

  const toggledOff = toggleRiotSeedCandidateSelection(nextSelection, "visible-1");

  assert.equal(toggledOff.has("visible-1"), false);
  assert.equal(toggledOff.has("visible-2"), true);
  assert.equal(toggledOff.has("hidden-selected"), true);
}

function testSelectionPruningAndLimits() {
  const selected = new Set(["visible-1", "hidden-1", "visible-2"]);
  const pruned = pruneRiotSeedCandidateSelection(selected, ["visible-1", "visible-2"]);

  assert.deepEqual([...pruned].sort(), ["visible-1", "visible-2"]);
  assert.equal(
    isRiotSeedCandidateBulkSelectionWithinLimit(makeSelectionOfSize(20), 20),
    true,
  );
  assert.equal(
    isRiotSeedCandidateBulkSelectionWithinLimit(makeSelectionOfSize(21), 20),
    false,
  );
}

function makeSelectionOfSize(size) {
  return new Set(Array.from({ length: size }, (_, index) => `candidate-${index}`));
}

function candidate({
  id = "candidate",
  leaguePoints = null,
  observedGames = 1,
  rankDivision = null,
  rankEnrichmentStatus = "ranked",
  rankTier = null,
} = {}) {
  return {
    id,
    observed_games: observedGames,
    rank_division: rankDivision,
    rank_enrichment_status: rankEnrichmentStatus,
    rank_league_points: leaguePoints,
    rank_tier: rankTier,
  };
}
