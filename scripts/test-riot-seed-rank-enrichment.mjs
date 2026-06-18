import assert from "node:assert/strict";

import {
  areRankSnapshotsEquivalent,
  calculateRankWinRate,
  createRankSnapshotRow,
  enrichRiotSeedCandidateRank,
  getRankSortWeight,
  isRankRefreshEligible,
  mapRiotRankError,
  normalizeRankEntry,
  selectRankedSoloDuoEntry,
} from "./lib/riot-seed-rank-enrichment.mjs";

testRankNormalization();
await testRankedCandidatePersistence();
await testUnrankedClearsStaleRankAndDedupesSnapshot();
await testCooldownAndForce();
await testRiotErrorMapping();
testSortWeight();

console.log("Riot seed candidate rank enrichment regression tests passed.");

function testRankNormalization() {
  assert.equal(calculateRankWinRate({ wins: 61, losses: 39 }), 0.61);
  assert.equal(calculateRankWinRate({ wins: 0, losses: 0 }), null);

  const selectedEntry = selectRankedSoloDuoEntry([
    { queueType: "RANKED_FLEX_SR", tier: "GOLD" },
    {
      freshBlood: false,
      hotStreak: true,
      inactive: false,
      leaguePoints: 75,
      losses: 40,
      queueType: "RANKED_SOLO_5x5",
      rank: "ii",
      tier: "emerald",
      veteran: true,
      wins: 60,
    },
  ]);
  const rank = normalizeRankEntry(selectedEntry);

  assert.equal(rank.queueType, "RANKED_SOLO_5x5");
  assert.equal(rank.tier, "EMERALD");
  assert.equal(rank.division, "II");
  assert.equal(rank.winRate, 0.6);
  assert.equal(rank.hotStreak, true);
}

async function testRankedCandidatePersistence() {
  const repository = createMemoryRepository({
    latestSnapshot: null,
  });
  const result = await enrichRiotSeedCandidateRank({
    candidateId: "candidate-a",
    force: true,
    now: new Date("2026-06-15T12:00:00.000Z"),
    repository,
    riot: {
      async fetchLeagueEntriesByPuuid() {
        return [
          {
            freshBlood: false,
            hotStreak: true,
            inactive: false,
            leaguePoints: 41,
            losses: 25,
            queueType: "RANKED_SOLO_5x5",
            rank: "I",
            tier: "DIAMOND",
            veteran: false,
            wins: 75,
          },
        ];
      },
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, "ranked");
  assert.equal(result.snapshotInserted, true);
  assert.equal(repository.state.candidate.rank_tier, "DIAMOND");
  assert.equal(repository.state.candidate.rank_division, "I");
  assert.equal(repository.state.candidate.rank_league_points, 41);
  assert.equal(repository.state.candidate.rank_win_rate, 0.75);
  assert.equal(repository.state.candidate.rank_enrichment_attempts, 1);
  assert.equal(repository.state.snapshots.length, 1);
}

async function testUnrankedClearsStaleRankAndDedupesSnapshot() {
  const candidate = {
    ...makeCandidate(),
    rank_division: "IV",
    rank_league_points: 12,
    rank_queue_type: "RANKED_SOLO_5x5",
    rank_tier: "GOLD",
    rank_win_rate: 0.5,
  };
  const snapshot = createRankSnapshotRow({
    candidate,
    observedAt: "2026-06-15T12:00:00.000Z",
    rank: null,
    snapshotStatus: "unranked",
  });
  const repository = createMemoryRepository({
    candidate,
    latestSnapshot: snapshot,
  });
  const result = await enrichRiotSeedCandidateRank({
    candidateId: "candidate-a",
    force: true,
    now: new Date("2026-06-15T12:00:00.000Z"),
    repository,
    riot: {
      async fetchLeagueEntriesByPuuid() {
        return [];
      },
    },
  });

  assert.equal(result.status, "unranked");
  assert.equal(result.snapshotInserted, false);
  assert.equal(repository.state.candidate.rank_tier, null);
  assert.equal(repository.state.candidate.rank_queue_type, null);
  assert.equal(repository.state.snapshots.length, 0);
  assert.equal(areRankSnapshotsEquivalent(snapshot, { ...snapshot, observed_at: "later" }), true);
}

async function testCooldownAndForce() {
  const repository = createMemoryRepository({
    candidate: {
      ...makeCandidate(),
      rank_next_eligible_at: "2026-06-16T12:00:00.000Z",
      rank_enrichment_status: "ranked",
    },
  });
  let calls = 0;
  const riot = {
    async fetchLeagueEntriesByPuuid() {
      calls += 1;
      return [];
    },
  };
  const skipped = await enrichRiotSeedCandidateRank({
    candidateId: "candidate-a",
    now: new Date("2026-06-15T12:00:00.000Z"),
    repository,
    riot,
  });

  assert.equal(skipped.skipped, true);
  assert.equal(calls, 0);
  assert.equal(
    isRankRefreshEligible(repository.state.candidate, {
      now: new Date("2026-06-15T12:00:00.000Z"),
    }),
    false,
  );

  const forced = await enrichRiotSeedCandidateRank({
    candidateId: "candidate-a",
    force: true,
    now: new Date("2026-06-15T12:00:00.000Z"),
    repository,
    riot,
  });

  assert.equal(forced.status, "unranked");
  assert.equal(calls, 1);
}

async function testRiotErrorMapping() {
  assert.deepEqual(mapRiotRankError({ status: 429 }), {
    code: "riot_rate_limited",
    message: "Riot rank enrichment was rate limited.",
    status: "rate_limited",
  });

  const repository = createMemoryRepository();
  const result = await enrichRiotSeedCandidateRank({
    candidateId: "candidate-a",
    force: true,
    repository,
    riot: {
      async fetchLeagueEntriesByPuuid() {
        const error = new Error("missing");
        error.status = 404;
        throw error;
      },
    },
  });

  assert.equal(result.status, "not_found");
  assert.equal(result.ok, true);
  assert.equal(repository.state.candidate.rank_enrichment_status, "not_found");
  assert.equal(repository.state.snapshots.length, 1);
}

function testSortWeight() {
  assert(
    getRankSortWeight({ rank_tier: "CHALLENGER", rank_division: null }) <
      getRankSortWeight({ rank_tier: "DIAMOND", rank_division: "I" }),
  );
  assert(
    getRankSortWeight({ rank_tier: "DIAMOND", rank_division: "I" }) <
      getRankSortWeight({ rank_tier: "DIAMOND", rank_division: "IV" }),
  );
  assert(
    getRankSortWeight({ rank_tier: null }) >
      getRankSortWeight({ rank_tier: "IRON", rank_division: "IV" }),
  );
}

function makeCandidate() {
  return {
    id: "candidate-a",
    platform_region: "EUW1",
    puuid: "puuid-a",
    rank_division: null,
    rank_enrichment_attempts: 0,
    rank_enrichment_error_code: null,
    rank_enrichment_error_message: null,
    rank_enrichment_failures: 0,
    rank_enrichment_status: "pending",
    rank_fresh_blood: null,
    rank_hot_streak: null,
    rank_inactive: null,
    rank_last_attempted_at: null,
    rank_last_success_at: null,
    rank_league_points: null,
    rank_losses: null,
    rank_next_eligible_at: null,
    rank_queue_type: null,
    rank_tier: null,
    rank_veteran: null,
    rank_win_rate: null,
    rank_wins: null,
    ranked_at: null,
  };
}

function createMemoryRepository({ candidate = makeCandidate(), latestSnapshot = null } = {}) {
  const state = {
    candidate: { ...candidate },
    latestSnapshot,
    snapshots: [],
  };

  return {
    state,
    async fetchCandidate(candidateId) {
      return state.candidate.id === candidateId ? { ...state.candidate } : null;
    },
    async fetchLatestSnapshot() {
      return state.latestSnapshot;
    },
    async insertSnapshot(snapshot) {
      state.snapshots.push(snapshot);
      state.latestSnapshot = snapshot;
    },
    async markCandidateRankFailure(candidate, patch) {
      Object.assign(state.candidate, {
        rank_enrichment_error_code: patch.errorCode,
        rank_enrichment_error_message: patch.errorMessage,
        rank_enrichment_failures: Number(candidate.rank_enrichment_failures ?? 0) + 1,
        rank_enrichment_status: patch.status,
        rank_next_eligible_at: patch.nextEligibleAt,
      });
    },
    async markCandidateRankResult(_candidate, patch) {
      Object.assign(state.candidate, {
        rank_division: patch.rank?.division ?? null,
        rank_enrichment_error_code: patch.errorCode,
        rank_enrichment_error_message: patch.errorMessage,
        rank_enrichment_status: patch.status,
        rank_fresh_blood: patch.rank?.freshBlood ?? null,
        rank_hot_streak: patch.rank?.hotStreak ?? null,
        rank_inactive: patch.rank?.inactive ?? null,
        rank_last_success_at: patch.succeededAt,
        rank_league_points: patch.rank?.leaguePoints ?? null,
        rank_losses: patch.rank?.losses ?? null,
        rank_next_eligible_at: patch.nextEligibleAt,
        rank_queue_type: patch.rank?.queueType ?? null,
        rank_tier: patch.rank?.tier ?? null,
        rank_veteran: patch.rank?.veteran ?? null,
        rank_win_rate: patch.rank?.winRate ?? null,
        rank_wins: patch.rank?.wins ?? null,
        ranked_at: patch.status === "ranked" ? patch.succeededAt : null,
      });
    },
    async markCandidateRankRunning(candidate, attemptedAt) {
      Object.assign(state.candidate, {
        rank_enrichment_attempts: Number(candidate.rank_enrichment_attempts ?? 0) + 1,
        rank_enrichment_status: "running",
        rank_last_attempted_at: attemptedAt,
      });
    },
  };
}
