import assert from "node:assert/strict";

import {
  buildMatchupRankCoverageQueue,
  calculateMatchupRankCoveragePriorityScore,
  ensureMatchupRankCoverageCandidates,
  getProjectedMatchupRankCoverageImpact,
  loadMatchupRankCoverageQueue,
} from "./lib/matchup-rank-coverage-queue.mjs";

const now = new Date("2026-06-16T12:00:00.000Z");

testUnknownObservation();
testSinglePlayerObservation();
await testExistingAndMissingCandidates();
testDuplicateParticipant();
testPriorityScore();
testFiltering();
testCooldownDeprioritization();
testUnrankedStatus();
testBatchLimitProjection();
testPrivacyPreview();
await testLoadQueueRepositoryFlow();

console.log("Matchup rank coverage queue regression tests passed.");

function testUnknownObservation() {
  const queue = buildMatchupRankCoverageQueue({
    observations: [
      observation({
        championAPuuid: "unknown-a",
        championBPuuid: "unknown-b",
        method: "unknown",
      }),
    ],
  }).candidates;

  assert.equal(queue.length, 2);
  assert.equal(queue.every((candidate) => candidate.unknownObservationsAffected === 1), true);
}

function testSinglePlayerObservation() {
  const queue = buildMatchupRankCoverageQueue({
    observations: [
      observation({
        championARankScore: 22,
        championARankSnapshotId: "snapshot-a",
        championAPuuid: "ranked-side",
        championBPuuid: "missing-side",
        method: "single-player",
      }),
    ],
  }).candidates;

  assert.equal(queue.length, 1);
  assert.equal(queue[0].puuid, "missing-side");
  assert.equal(queue[0].twoPlayerUpgradePotential, 1);
}

async function testExistingAndMissingCandidates() {
  const repository = createFakeCoverageRepository({
    candidates: [
      candidate({
        id: "candidate-existing",
        platformRegion: "EUW1",
        puuid: "existing-puuid",
      }),
    ],
  });
  const result = await ensureMatchupRankCoverageCandidates({
    participants: [
      { platformRegion: "EUW1", puuid: "existing-puuid" },
      { platformRegion: "EUW1", puuid: "missing-puuid" },
    ],
    repository,
  });

  assert.equal(result.requestedCount, 2);
  assert.equal(result.existingCount, 1);
  assert.equal(result.createdCount, 1);
  assert.deepEqual(result.candidateIds.sort(), ["candidate-existing", "created-1"]);
}

function testDuplicateParticipant() {
  const queue = buildMatchupRankCoverageQueue({
    observations: [
      observation({ championAPuuid: "same-puuid", championBPuuid: "other-a", method: "unknown" }),
      observation({ championAPuuid: "same-puuid", championBPuuid: "other-b", method: "unknown" }),
    ],
  }).candidates;
  const same = queue.find((candidate) => candidate.puuid === "same-puuid");

  assert.equal(same.observationsAffected, 2);
  assert.equal(queue.filter((candidate) => candidate.puuid === "same-puuid").length, 1);
}

function testPriorityScore() {
  assert.equal(
    calculateMatchupRankCoveragePriorityScore({
      twoPlayerUpgradePotential: 3,
      unknownObservationsAffected: 2,
    }),
    8,
  );

  const queue = buildMatchupRankCoverageQueue({
    observations: [
      observation({
        championARankScore: 20,
        championARankSnapshotId: "snapshot-a",
        championBPuuid: "upgrade",
        method: "single-player",
      }),
      observation({ championAPuuid: "unknown", championBPuuid: "other", method: "unknown" }),
    ],
  }).candidates;

  assert.equal(queue[0].puuid, "upgrade");
}

function testFiltering() {
  const observations = [
    observation({
      championA: "Ahri",
      championAPuuid: "ahri-mid",
      matchId: "EUW1_1",
      patch: "16.12",
      role: "mid",
    }),
    observation({
      championA: "Garen",
      championAPuuid: "garen-top",
      matchId: "NA1_2",
      patch: "16.11",
      role: "top",
    }),
  ];

  assert.equal(
    buildMatchupRankCoverageQueue({
      filters: { champion: "Ahri", patch: "16.12", platformRegion: "EUW1", role: "mid" },
      observations,
    }).candidates.some((row) => row.puuid === "ahri-mid"),
    true,
  );
  assert.equal(
    buildMatchupRankCoverageQueue({
      filters: { champion: "Ahri", patch: "16.12", platformRegion: "EUW1", role: "mid" },
      observations,
    }).candidates.some((row) => row.puuid === "garen-top"),
    false,
  );
}

function testCooldownDeprioritization() {
  const queue = buildMatchupRankCoverageQueue({
    candidates: [
      candidate({
        nextEligibleAt: "2026-06-17T12:00:00.000Z",
        puuid: "cooldown-high-impact",
        rankStatus: "ranked",
      }),
    ],
    now,
    observations: [
      observation({ championAPuuid: "cooldown-high-impact", championBPuuid: "other-1" }),
      observation({ championAPuuid: "cooldown-high-impact", championBPuuid: "other-2" }),
      observation({ championAPuuid: "fresh-low-impact", championBPuuid: "other-3" }),
    ],
  }).candidates;

  assert.equal(queue[0].puuid, "fresh-low-impact");
  assert.equal(
    queue.find((row) => row.puuid === "cooldown-high-impact").cooldownActive,
    true,
  );
}

function testUnrankedStatus() {
  const queue = buildMatchupRankCoverageQueue({
    candidates: [
      candidate({
        puuid: "unranked-puuid",
        rankStatus: "unranked",
      }),
    ],
    observations: [observation({ championAPuuid: "unranked-puuid", championBPuuid: "other" })],
  }).candidates;

  assert.equal(queue.find((row) => row.puuid === "unranked-puuid").rankStatus, "unranked");
}

function testBatchLimitProjection() {
  const selected = Array.from({ length: 20 }, (_, index) => ({
    observationsAffected: 2,
    twoPlayerUpgradePotential: index % 2,
    unknownObservationsAffected: 1,
  }));
  const projection = getProjectedMatchupRankCoverageImpact(selected);

  assert.equal(selected.length <= 20, true);
  assert.equal(projection.unknownObservationsAffected, 20);
  assert.equal(projection.twoPlayerUpgradePotential, 10);
}

function testPrivacyPreview() {
  const [row] = buildMatchupRankCoverageQueue({
    observations: [
      observation({
        championAPuuid: "very-long-sensitive-puuid-value",
        championBPuuid: "other",
      }),
    ],
  }).candidates.filter((candidate) => candidate.puuid === "very-long-sensitive-puuid-value");

  assert.equal(row.puuidPreview.includes("very-long-sensitive-puuid-value"), false);
  assert.equal(row.puuidPreview, "very-l...alue");
}

async function testLoadQueueRepositoryFlow() {
  const repository = createFakeCoverageRepository({
    candidates: [candidate({ id: "candidate-a", puuid: "puuid-a" })],
    observations: [
      observation({ championAPuuid: "puuid-a", championBPuuid: "puuid-b", method: "unknown" }),
    ],
  });
  const result = await loadMatchupRankCoverageQueue({
    repository,
  });

  assert.equal(result.summary.totalObservations, 1);
  assert.equal(result.summary.unknown, 1);
  assert.equal(result.candidates.length, 2);
  assert.equal(result.candidates.find((row) => row.puuid === "puuid-a").candidateId, "candidate-a");
}

function createFakeCoverageRepository({ candidates = [], observations = [] } = {}) {
  const rows = new Map(
    candidates.map((row) => [`${row.platform_region}:${row.puuid}`, { ...row }]),
  );
  let nextCreatedId = 1;

  return {
    async createSeedCandidatesForParticipants(participants) {
      let newCandidatesCreated = 0;

      for (const participant of participants) {
        const key = `${participant.platformRegion}:${participant.puuid}`;

        if (rows.has(key)) {
          continue;
        }

        rows.set(
          key,
          candidate({
            id: `created-${nextCreatedId}`,
            platformRegion: participant.platformRegion,
            puuid: participant.puuid,
          }),
        );
        nextCreatedId += 1;
        newCandidatesCreated += 1;
      }

      return {
        existingCandidatesUpdated: participants.length - newCandidatesCreated,
        newCandidatesCreated,
      };
    },
    async fetchCoverageObservations() {
      return observations;
    },
    async fetchSeedCandidatesByIdentities(participants) {
      return participants
        .map((participant) => rows.get(`${participant.platformRegion}:${participant.puuid}`))
        .filter(Boolean);
    },
  };
}

function observation({
  championA = "Ahri",
  championAPuuid = "puuid-a",
  championARankScore = null,
  championARankSnapshotId = null,
  championB = "Zed",
  championBPuuid = "puuid-b",
  championBRankScore = null,
  championBRankSnapshotId = null,
  gameStartAt = "2026-06-16T10:00:00.000Z",
  matchId = "EUW1_123",
  method = "unknown",
  patch = "16.12",
  role = "mid",
} = {}) {
  return {
    champion_a: championA,
    champion_a_puuid: championAPuuid,
    champion_a_rank_score: championARankScore,
    champion_a_rank_snapshot_id: championARankSnapshotId,
    champion_b: championB,
    champion_b_puuid: championBPuuid,
    champion_b_rank_score: championBRankScore,
    champion_b_rank_snapshot_id: championBRankSnapshotId,
    game_start_at: gameStartAt,
    id: `${matchId}-${role}`,
    match_id: matchId,
    patch,
    rank_attribution_method: method,
    role,
  };
}

function candidate({
  id = "candidate",
  nextEligibleAt = null,
  platformRegion = "EUW1",
  puuid = "puuid",
  rankStatus = "pending",
} = {}) {
  return {
    id,
    platform_region: platformRegion,
    puuid,
    rank_division: null,
    rank_enrichment_status: rankStatus,
    rank_last_attempted_at: null,
    rank_last_success_at: null,
    rank_league_points: null,
    rank_next_eligible_at: nextEligibleAt,
    rank_tier: null,
  };
}
