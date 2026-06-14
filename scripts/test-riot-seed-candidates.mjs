import assert from "node:assert/strict";

import {
  createCandidateIdentityKey,
  persistSeedCandidatesFromObservations,
} from "./lib/riot-seed-candidates.mjs";

async function testMostlyNewCandidates() {
  const puuids = Array.from({ length: 805 }, (_, index) => `puuid-${index}`);
  const supabase = createFakeSupabase({
    existingPuuids: puuids.slice(0, 5),
  });
  const observations = Array.from({ length: 910 }, (_, index) =>
    makeObservation({
      index,
      matchId: `match-${index}`,
      puuid: puuids[index % puuids.length],
    }),
  );

  const result = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });

  assert.equal(result.participantPuuidsObserved, 910);
  assert.equal(result.uniqueCandidatesEncountered, 805);
  assert.equal(result.newCandidatesCreated, 800);
  assert.equal(result.existingCandidatesUpdated, 5);
  assert.equal(result.candidateIdsResolved, 805);
  assert.equal(result.candidateIdResolutionFailures, 0);
  assert.equal(result.candidateUniqueIdResolutionFailures, 0);
  assert.equal(result.candidateObservationResolutionFailures, 0);
  assert.equal(result.candidateObservationsFound, 910);
  assert.equal(result.candidateObservationsInserted, 910);
  assert.equal(result.candidateObservationDuplicatesSkipped, 0);
  assert.equal(result.candidateProfilesRebuilt, 805);
  assert.equal(supabase.candidates.size, 805);
  assert.equal(supabase.observations.size, 910);
}

async function testManyExistingCandidates() {
  const puuids = Array.from({ length: 804 }, (_, index) => `existing-puuid-${index}`);
  const supabase = createFakeSupabase({
    existingPuuids: puuids,
  });
  const observations = Array.from({ length: 910 }, (_, index) =>
    makeObservation({
      index,
      matchId: `existing-match-${index}`,
      puuid: puuids[index % puuids.length],
    }),
  );

  const result = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });

  assert.equal(result.participantPuuidsObserved, 910);
  assert.equal(result.uniqueCandidatesEncountered, 804);
  assert.equal(result.newCandidatesCreated, 0);
  assert.equal(result.existingCandidatesUpdated, 804);
  assert.equal(result.candidateIdsResolved, 804);
  assert.equal(result.candidateUniqueIdResolutionFailures, 0);
  assert.equal(result.candidateObservationResolutionFailures, 0);
  assert.equal(result.candidateObservationsFound, 910);
  assert.equal(result.candidateObservationsInserted, 910);
}

async function testManyNewCandidates() {
  const puuids = Array.from({ length: 804 }, (_, index) => `new-puuid-${index}`);
  const supabase = createFakeSupabase();
  const observations = Array.from({ length: 910 }, (_, index) =>
    makeObservation({
      index,
      matchId: `new-match-${index}`,
      puuid: puuids[index % puuids.length],
    }),
  );

  const result = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });

  assert.equal(result.newCandidatesCreated, 804);
  assert.equal(result.existingCandidatesUpdated, 0);
  assert.equal(result.candidateIdsResolved, 804);
  assert.equal(result.candidateUniqueIdResolutionFailures, 0);
  assert.equal(result.candidateObservationsFound, 910);
  assert.equal(result.candidateObservationsInserted, 910);
  assert.equal(result.candidateProfilesRebuilt, 804);
}

async function testNewCandidateSameScan() {
  const supabase = createFakeSupabase();

  const result = await persistSeedCandidatesFromObservations({
    observations: [
      makeObservation({
        index: 0,
        matchId: "match-new",
        puuid: "new-candidate",
      }),
    ],
    supabase,
  });
  const candidate = supabase.getCandidateByPuuid("new-candidate");

  assert.equal(result.newCandidatesCreated, 1);
  assert.equal(result.candidateIdsResolved, 1);
  assert.equal(result.candidateObservationsInserted, 1);
  assert.equal(result.candidateProfilesRebuilt, 1);
  assert.equal(candidate.observed_games, 1);
  assert.equal(candidate.estimated_primary_role, null);
  assert.equal(candidate.primary_champion, null);
}

async function testRerunRecovery() {
  const supabase = createFakeSupabase({
    failNextObservationUpsert: true,
  });
  const observations = [
    makeObservation({
      index: 0,
      matchId: "match-recovery",
      puuid: "recovery-candidate",
    }),
  ];

  const firstRun = await withSilencedConsoleError(() =>
    persistSeedCandidatesFromObservations({
      observations,
      supabase,
    }),
  );

  assert.equal(firstRun.newCandidatesCreated, 1);
  assert.equal(firstRun.candidateIdsResolved, 1);
  assert.equal(firstRun.candidateObservationsInserted, 0);
  assert.equal(firstRun.candidateObservationInsertFailures, 1);
  assert.equal(supabase.candidates.size, 1);
  assert.equal(supabase.observations.size, 0);

  const secondRun = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });

  assert.equal(secondRun.newCandidatesCreated, 0);
  assert.equal(secondRun.existingCandidatesUpdated, 1);
  assert.equal(secondRun.candidateIdsResolved, 1);
  assert.equal(secondRun.candidateObservationsInserted, 1);
  assert.equal(secondRun.candidateProfilesRebuilt, 1);
  assert.equal(supabase.candidates.size, 1);
  assert.equal(supabase.observations.size, 1);
}

async function testDuplicateScan() {
  const supabase = createFakeSupabase();
  const observations = [
    makeObservation({
      index: 0,
      matchId: "match-duplicate",
      puuid: "duplicate-candidate",
    }),
  ];

  await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });
  const secondRun = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });
  const candidate = supabase.getCandidateByPuuid("duplicate-candidate");

  assert.equal(secondRun.candidateObservationsInserted, 0);
  assert.equal(secondRun.candidateObservationDuplicatesSkipped, 1);
  assert.equal(secondRun.candidateProfilesRebuilt, 0);
  assert.equal(candidate.observed_games, 1);
  assert.equal(supabase.observations.size, 1);
}

async function testMixedNewAndExisting() {
  const supabase = createFakeSupabase({
    existingPuuids: ["existing-a", "existing-b"],
  });
  const observations = [
    makeObservation({ index: 0, matchId: "mixed-0", puuid: "existing-a" }),
    makeObservation({ index: 1, matchId: "mixed-1", puuid: "existing-b" }),
    makeObservation({ index: 2, matchId: "mixed-2", puuid: "new-a" }),
    makeObservation({ index: 3, matchId: "mixed-3", puuid: "new-b" }),
  ];

  const result = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });

  assert.equal(result.newCandidatesCreated, 2);
  assert.equal(result.existingCandidatesUpdated, 2);
  assert.equal(result.candidateIdsResolved, 4);
  assert.equal(result.candidateObservationsFound, 4);
  assert.equal(result.candidateObservationsInserted, 4);
}

async function testLongPuuidLookupChunking() {
  const puuids = Array.from({ length: 126 }, (_, index) => `${"x".repeat(78)}-${index}`);
  const supabase = createFakeSupabase({
    existingPuuids: puuids,
  });
  const observations = puuids.map((puuid, index) =>
    makeObservation({
      index,
      matchId: `long-puuid-match-${index}`,
      puuid,
    }),
  );

  const result = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });
  const postUpsertLookups = supabase.lookupQueries.filter(
    (query) => query.operationIndex > supabase.preUpsertLookupCount,
  );

  assert.equal(result.candidateIdsResolved, 126);
  assert.equal(result.candidateIdLookupChunks, 6);
  assert.equal(result.candidateIdLookupChunkFailures, 0);
  assert.ok(postUpsertLookups.every((query) => query.values.length <= 25));
}

async function testLookupChunkFailure() {
  const failingPuuid = "lookup-failure-puuid";
  const puuids = [failingPuuid, ...Array.from({ length: 29 }, (_, index) => `lookup-ok-${index}`)];
  const supabase = createFakeSupabase({
    existingPuuids: puuids,
    failCandidateLookupForPuuids: [failingPuuid],
  });
  const observations = puuids.map((puuid, index) =>
    makeObservation({
      index,
      matchId: `lookup-failure-match-${index}`,
      puuid,
    }),
  );

  const result = await withSilencedConsoleWarningsAndErrors(() =>
    persistSeedCandidatesFromObservations({
      observations,
      supabase,
    }),
  );

  assert.equal(result.candidateIdLookupChunkFailures, 2);
  assert.equal(result.candidateIdsResolved, 25);
  assert.equal(result.candidateUniqueIdResolutionFailures, 5);
  assert.equal(result.candidateObservationResolutionFailures, 5);
  assert.equal(result.candidateObservationsFound, 25);
  assert.equal(result.candidateObservationsInserted, 25);
}

async function testMultiRegionCandidates() {
  const supabase = createFakeSupabase({
    existingPuuids: [
      { platformRegion: "EUW1", puuid: "same-puuid" },
      { platformRegion: "NA1", puuid: "same-puuid" },
    ],
  });
  const observations = [
    makeObservation({
      index: 0,
      matchId: "multi-region-euw",
      platformRegion: "EUW1",
      puuid: "same-puuid",
    }),
    makeObservation({
      index: 1,
      matchId: "multi-region-na",
      platformRegion: "NA1",
      puuid: "same-puuid",
    }),
  ];

  const result = await persistSeedCandidatesFromObservations({
    observations,
    supabase,
  });

  assert.equal(result.uniqueCandidatesEncountered, 2);
  assert.equal(result.candidateIdsResolved, 2);
  assert.equal(result.candidateObservationsInserted, 2);
  assert.deepEqual(
    supabase.lookupQueries
      .filter((query) => query.operationIndex > supabase.preUpsertLookupCount)
      .map((query) => query.platformRegion)
      .sort(),
    ["EUW1", "NA1"],
  );
}

async function testConcurrentUpsertShape() {
  const supabase = createFakeSupabase();
  const observations = [
    makeObservation({ index: 0, matchId: "concurrent-0", puuid: "same-candidate" }),
  ];

  const [firstRun, secondRun] = await Promise.all([
    persistSeedCandidatesFromObservations({ observations, supabase }),
    persistSeedCandidatesFromObservations({ observations, supabase }),
  ]);

  assert.equal(supabase.candidates.size, 1);
  assert.equal(supabase.observations.size, 1);
  assert.equal(firstRun.candidateObservationsInserted + secondRun.candidateObservationsInserted, 1);
  assert.equal(
    firstRun.candidateObservationDuplicatesSkipped +
      secondRun.candidateObservationDuplicatesSkipped,
    1,
  );
}

function createFakeSupabase({
  existingPuuids = [],
  failCandidateLookupForPuuids = [],
  failNextObservationUpsert = false,
} = {}) {
  const state = {
    candidates: new Map(),
    candidateLookupCount: 0,
    failCandidateLookupForPuuids: new Set(failCandidateLookupForPuuids),
    failNextObservationUpsert,
    lookupQueries: [],
    nextCandidateId: 1,
    nextObservationId: 1,
    observations: new Map(),
    preUpsertLookupCount: 0,
    seenCandidateUpsert: false,
  };

  for (const existingCandidate of existingPuuids) {
    const candidateInput =
      typeof existingCandidate === "string"
        ? {
            platformRegion: "EUW1",
            puuid: existingCandidate,
          }
        : existingCandidate;
    const candidate = getCandidateRow({
      id: `candidate-${state.nextCandidateId}`,
      platform_region: candidateInput.platformRegion,
      puuid: candidateInput.puuid,
    });

    state.nextCandidateId += 1;
    state.candidates.set(getCandidateKey(candidate), candidate);
  }

  return {
    candidates: state.candidates,
    getCandidateByPuuid(puuid) {
      return Array.from(state.candidates.values()).find((candidate) => candidate.puuid === puuid);
    },
    get lookupQueries() {
      return state.lookupQueries;
    },
    observations: state.observations,
    get preUpsertLookupCount() {
      return state.preUpsertLookupCount;
    },
    from(table) {
      return new FakeQuery({ state, table });
    },
  };
}

class FakeQuery {
  constructor({ state, table }) {
    this.filters = [];
    this.operation = "select";
    this.rows = [];
    this.selectColumns = null;
    this.state = state;
    this.table = table;
    this.updatePatch = null;
    this.upsertOptions = {};
  }

  eq(column, value) {
    this.filters.push({ column, type: "eq", value });
    return this;
  }

  in(column, values) {
    this.filters.push({ column, type: "in", values });
    return this;
  }

  select(columns) {
    this.selectColumns = columns;
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this.execute()).then(resolve, reject);
  }

  update(patch) {
    this.operation = "update";
    this.updatePatch = patch;
    return this;
  }

  upsert(rows, options = {}) {
    this.operation = "upsert";
    this.rows = rows;
    this.upsertOptions = options;
    return this;
  }

  execute() {
    if (this.table === "riot_seed_candidates") {
      return this.executeCandidateQuery();
    }

    if (this.table === "riot_seed_candidate_observations") {
      return this.executeObservationQuery();
    }

    return {
      data: [],
      error: null,
    };
  }

  executeCandidateQuery() {
    if (this.operation === "upsert") {
      for (const row of this.rows) {
        const key = getCandidateKey(row);

        if (this.state.candidates.has(key) && this.upsertOptions.ignoreDuplicates) {
          continue;
        }

        if (this.state.candidates.has(key)) {
          Object.assign(this.state.candidates.get(key), row);
          continue;
        }

        const candidate = getCandidateRow({
          ...row,
          id: `candidate-${this.state.nextCandidateId}`,
        });

        this.state.nextCandidateId += 1;
        this.state.candidates.set(key, candidate);
      }

      this.state.seenCandidateUpsert = true;

      return {
        data: [],
        error: null,
      };
    }

    if (this.operation === "update") {
      for (const candidate of this.filterRows(Array.from(this.state.candidates.values()))) {
        Object.assign(candidate, this.updatePatch);
      }

      return {
        data: [],
        error: null,
      };
    }

    const rows = this.filterRows(Array.from(this.state.candidates.values()));
    const platformRegion = this.filters.find(
      (filter) => filter.column === "platform_region",
    )?.value;
    const puuidValues = this.filters.find((filter) => filter.column === "puuid")?.values ?? [];

    this.state.candidateLookupCount += 1;

    if (!this.state.seenCandidateUpsert) {
      this.state.preUpsertLookupCount += 1;
    }

    this.state.lookupQueries.push({
      operationIndex: this.state.candidateLookupCount,
      platformRegion,
      values: puuidValues,
    });

    if (puuidValues.some((puuid) => this.state.failCandidateLookupForPuuids.has(puuid))) {
      return {
        data: null,
        error: {
          code: "TEST_LOOKUP_FAILURE",
          details: null,
          hint: null,
          message: "Simulated candidate lookup failure.",
          status: 414,
        },
      };
    }

    return {
      data: rows.map((candidate) => ({
        id: candidate.id,
        platform_region: candidate.platform_region,
        puuid: candidate.puuid,
      })),
      error: null,
    };
  }

  executeObservationQuery() {
    if (this.operation === "upsert") {
      if (this.state.failNextObservationUpsert) {
        this.state.failNextObservationUpsert = false;

        return {
          data: null,
          error: {
            code: "TEST_OBSERVATION_FAILURE",
            details: null,
            hint: null,
            message: "Simulated observation insert failure.",
          },
        };
      }

      const insertedRows = [];

      for (const row of this.rows) {
        const key = `${row.candidate_id}::${row.match_id}`;

        if (this.state.observations.has(key) && this.upsertOptions.ignoreDuplicates) {
          continue;
        }

        const observation = {
          ...row,
          id: `observation-${this.state.nextObservationId}`,
        };

        this.state.nextObservationId += 1;
        this.state.observations.set(key, observation);
        insertedRows.push({
          candidate_id: observation.candidate_id,
          id: observation.id,
        });
      }

      return {
        data: insertedRows,
        error: null,
      };
    }

    return {
      data: this.filterRows(Array.from(this.state.observations.values())).map((observation) => ({
        candidate_id: observation.candidate_id,
        champion: observation.champion,
        game_start_at: observation.game_start_at,
        role: observation.role,
        won: observation.won,
      })),
      error: null,
    };
  }

  filterRows(rows) {
    return rows.filter((row) =>
      this.filters.every((filter) => {
        if (filter.type === "eq") {
          return row[filter.column] === filter.value;
        }

        return filter.values.includes(row[filter.column]);
      }),
    );
  }
}

function getCandidateRow(overrides) {
  return {
    consecutive_scan_failures: 0,
    estimated_primary_role: null,
    estimated_secondary_role: null,
    failed_scan_count: 0,
    first_seen_at: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    first_seen_match_id: null,
    first_seen_scan_job_id: null,
    id: overrides.id,
    last_profiled_at: null,
    last_scanned_at: null,
    last_seen_at: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    latest_match_seen_at: null,
    observed_games: 0,
    platform_region: "EUW1",
    primary_champion: null,
    primary_champion_games: 0,
    primary_champion_role: null,
    primary_champion_share: null,
    primary_role_share: null,
    puuid: overrides.puuid,
    regional_routing: "EUROPE",
    role_distribution: {},
    secondary_role_share: null,
    source: "match_discovery",
    status: "candidate",
    successful_scan_count: 0,
    times_scanned: 0,
    top_champions: [],
    ...overrides,
  };
}

function getCandidateKey(candidate) {
  return createCandidateIdentityKey(candidate.platform_region, candidate.puuid);
}

function makeObservation({ index, matchId, platformRegion = "EUW1", puuid }) {
  return {
    champion: index % 2 === 0 ? "Ahri" : "Yasuo",
    game_duration_seconds: 1800,
    game_start_at: new Date(1_700_000_000_000 + index * 1000).toISOString(),
    match_id: matchId,
    patch: "15.12",
    platform_region: platformRegion,
    puuid,
    queue_id: 420,
    regional_routing: "EUROPE",
    role: index % 2 === 0 ? "mid" : "top",
    won: index % 3 === 0,
  };
}

async function withSilencedConsoleError(callback) {
  const originalConsoleError = console.error;

  console.error = () => {};

  try {
    return await callback();
  } finally {
    console.error = originalConsoleError;
  }
}

async function withSilencedConsoleWarningsAndErrors(callback) {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = () => {};
  console.warn = () => {};

  try {
    return await callback();
  } finally {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }
}

await testMostlyNewCandidates();
await testManyExistingCandidates();
await testManyNewCandidates();
await testNewCandidateSameScan();
await testRerunRecovery();
await testDuplicateScan();
await testMixedNewAndExisting();
await testLongPuuidLookupChunking();
await testLookupChunkFailure();
await testMultiRegionCandidates();
await testConcurrentUpsertShape();

console.log("Riot seed candidate regression tests passed.");
