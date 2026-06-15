import assert from "node:assert/strict";

import { getDirectedAggregateRows } from "./lib/riot-counter-pick-aggregation.mjs";
import {
  attributeMatchupObservation,
  attributeStoredMatchupRankBrackets,
  resolveParticipantRank,
} from "./lib/riot-matchup-rank-attribution.mjs";
import {
  getCounterPickAggregateRankBrackets,
  getRankBracketFromScore,
  getRankScore,
} from "./lib/riot-rank-brackets.mjs";

const gameStartAt = "2026-06-15T12:00:00.000Z";

testRankScoringAndBoundaries();
testTwoPlayerAttributionScenarios();
testSingleAndUnknownAttribution();
testSnapshotTooOld();
testClosestSnapshotSelection();
await testIdempotentStoredAttribution();
testAggregateFanout();
testParticipantOrientation();

console.log("Matchup rank attribution regression tests passed.");

function testRankScoringAndBoundaries() {
  assert.equal(getRankScore({ division: "IV", tier: "IRON" }), 0);
  assert.equal(getRankScore({ division: "III", tier: "IRON" }), 1);
  assert.equal(getRankScore({ division: "II", tier: "IRON" }), 2);
  assert.equal(getRankScore({ division: "I", tier: "IRON" }), 3);
  assert.equal(getRankScore({ division: null, tier: "MASTER" }), 28);
  assert.equal(getRankScore({ division: null, tier: "CHALLENGER" }), 30);
  assert.equal(getRankScore({ division: null, tier: "DIAMOND" }), null);

  assert.equal(getRankBracketFromScore(average(rank("IRON", "I"), rank("SILVER", "IV"))), "iron-silver");
  assert.equal(getRankBracketFromScore(average(rank("GOLD", "I"), rank("EMERALD", "IV"))), "gold-emerald");
  assert.equal(getRankBracketFromScore(average(rank("DIAMOND", "IV"), rank("DIAMOND", "I"))), "diamond");
  assert.equal(getRankBracketFromScore(average(rank("MASTER"), rank("CHALLENGER"))), "master-plus");
  assert.equal(getRankBracketFromScore(average(rank("EMERALD", "I"), rank("DIAMOND", "IV"))), "gold-emerald");
  assert.equal(getRankBracketFromScore(average(rank("GOLD", "I"), rank("PLATINUM", "IV"))), "gold-emerald");
}

function testTwoPlayerAttributionScenarios() {
  const scenarios = [
    {
      expected: "iron-silver",
      left: rank("IRON", "I"),
      right: rank("SILVER", "IV"),
    },
    {
      expected: "gold-emerald",
      left: rank("GOLD", "I"),
      right: rank("EMERALD", "IV"),
    },
    {
      expected: "diamond",
      left: rank("DIAMOND", "II"),
      right: rank("DIAMOND", "IV"),
    },
    {
      expected: "master-plus",
      left: rank("MASTER"),
      right: rank("CHALLENGER"),
    },
  ];

  for (const scenario of scenarios) {
    const result = attributeMatchupObservation({
      observation: observation(),
      snapshotsByPuuid: snapshotsByPuuid({
        "puuid-a": [snapshot("snapshot-a", scenario.left)],
        "puuid-b": [snapshot("snapshot-b", scenario.right)],
      }),
    });

    assert.equal(result.method, "two-player-average");
    assert.equal(result.rankBracket, scenario.expected);
  }
}

function testSingleAndUnknownAttribution() {
  const single = attributeMatchupObservation({
    observation: observation(),
    snapshotsByPuuid: snapshotsByPuuid({
      "puuid-a": [snapshot("snapshot-a", rank("DIAMOND", "III"))],
      "puuid-b": [],
    }),
  });
  const unknown = attributeMatchupObservation({
    observation: observation(),
    snapshotsByPuuid: snapshotsByPuuid({
      "puuid-a": [],
      "puuid-b": [],
    }),
  });

  assert.equal(single.method, "single-player");
  assert.equal(single.rankBracket, "diamond");
  assert.equal(single.patch.champion_a_rank_tier, "DIAMOND");
  assert.equal(single.patch.champion_b_rank_tier, null);
  assert.equal(unknown.method, "unknown");
  assert.equal(unknown.rankBracket, "unknown");
}

function testSnapshotTooOld() {
  const result = resolveParticipantRank({
    gameStartAt,
    puuid: "puuid-a",
    snapshotsByPuuid: snapshotsByPuuid({
      "puuid-a": [
        snapshot("snapshot-a", rank("GOLD", "II"), {
          observedAt: "2026-04-01T12:00:00.000Z",
        }),
      ],
    }),
  });

  assert.equal(result.rank, null);
  assert.equal(result.reason, "snapshot-too-old");
}

function testClosestSnapshotSelection() {
  const result = resolveParticipantRank({
    gameStartAt,
    puuid: "puuid-a",
    snapshotsByPuuid: snapshotsByPuuid({
      "puuid-a": [
        snapshot("far", rank("SILVER", "I"), {
          observedAt: "2026-06-01T12:00:00.000Z",
        }),
        snapshot("closest", rank("PLATINUM", "IV"), {
          observedAt: "2026-06-14T12:00:00.000Z",
        }),
      ],
    }),
  });

  assert.equal(result.rank.snapshotId, "closest");
  assert.equal(result.rank.tier, "PLATINUM");
}

async function testIdempotentStoredAttribution() {
  const repository = createMemoryAttributionRepository({
    observations: [observation({ id: "observation-1" })],
    snapshotsByPuuid: snapshotsByPuuid({
      "puuid-a": [snapshot("snapshot-a", rank("GOLD", "I"))],
      "puuid-b": [snapshot("snapshot-b", rank("PLATINUM", "IV"))],
    }),
  });
  const first = await attributeStoredMatchupRankBrackets({ repository });
  const second = await attributeStoredMatchupRankBrackets({ repository });

  assert.equal(first.summary.processed, 1);
  assert.equal(first.summary.twoPlayerAverage, 1);
  assert.equal(second.summary.processed, 0);
  assert.equal(second.summary.alreadyAttributed, 1);
  assert.equal(repository.state.patches[0].rank_bracket, "gold-emerald");
}

function testAggregateFanout() {
  assert.deepEqual(getCounterPickAggregateRankBrackets("diamond"), ["all", "diamond"]);
  assert.deepEqual(getCounterPickAggregateRankBrackets("unknown"), ["all", "unknown"]);

  const rows = getDirectedAggregateRows([
    {
      champion_a: "Ahri",
      champion_a_won: true,
      champion_b: "Zed",
      patch: "16.12",
      rank_bracket: "diamond",
      role: "mid",
    },
    {
      champion_a: "Ahri",
      champion_a_won: false,
      champion_b: "Zed",
      patch: "16.12",
      rank_bracket: "unknown",
      role: "mid",
    },
  ]);
  const brackets = new Set(rows.map((row) => row.rank_bracket));

  assert.deepEqual(brackets, new Set(["all", "diamond", "unknown"]));
  assert.equal(rows.filter((row) => row.rank_bracket === "all").length, 2);
  assert.equal(rows.filter((row) => row.rank_bracket === "diamond").length, 2);
  assert.equal(rows.filter((row) => row.rank_bracket === "unknown").length, 2);
}

function testParticipantOrientation() {
  const result = attributeMatchupObservation({
    observation: observation({
      champion_a: "Ahri",
      champion_a_puuid: "sorted-a",
      champion_b: "Zed",
      champion_b_puuid: "sorted-b",
    }),
    snapshotsByPuuid: snapshotsByPuuid({
      "sorted-a": [snapshot("snapshot-a", rank("DIAMOND", "IV"))],
      "sorted-b": [snapshot("snapshot-b", rank("GOLD", "I"))],
    }),
  });

  assert.equal(result.patch.champion_a_rank_tier, "DIAMOND");
  assert.equal(result.patch.champion_b_rank_tier, "GOLD");
}

function observation(overrides = {}) {
  return {
    champion_a: "Ahri",
    champion_a_puuid: "puuid-a",
    champion_b: "Zed",
    champion_b_puuid: "puuid-b",
    game_start_at: gameStartAt,
    id: "observation",
    match_id: "EUW1_1234567890",
    patch: "16.12",
    rank_attributed_at: null,
    role: "mid",
    ...overrides,
  };
}

function snapshot(id, rankValue, { observedAt = gameStartAt } = {}) {
  return {
    candidate_id: `${id}-candidate`,
    division: rankValue.division,
    id,
    observed_at: observedAt,
    snapshot_status: "ranked",
    tier: rankValue.tier,
  };
}

function rank(tier, division = null) {
  return {
    division,
    tier,
  };
}

function average(left, right) {
  return (getRankScore(left) + getRankScore(right)) / 2;
}

function snapshotsByPuuid(input) {
  return new Map(Object.entries(input));
}

function createMemoryAttributionRepository({ observations, snapshotsByPuuid }) {
  const state = {
    observations: observations.map((row) => ({ ...row })),
    patches: [],
  };

  return {
    state,
    async fetchMatchupObservations() {
      return state.observations.map((row) => ({ ...row }));
    },
    async fetchRankSnapshotsByPuuid() {
      return snapshotsByPuuid;
    },
    async persistMatchupRankAttribution(observationId, patch) {
      const observationRow = state.observations.find((row) => row.id === observationId);

      Object.assign(observationRow, patch);
      state.patches.push({ ...patch });
    },
  };
}
