import assert from "node:assert/strict";

import {
  normalizeChampionSourceRow,
  syncLeagueChampionRegistry,
  verifyLeagueChampionRegistry,
} from "./lib/league-champion-registry.mjs";

const testVersion = "15.12.1";

async function testCompleteImport() {
  const supabase = createFakeSupabase();

  const result = await withFakeDataDragon(getBaseChampionPayload(), () =>
    syncLeagueChampionRegistry({ supabase }),
  );

  assert.equal(result.ok, true);
  assert.equal(result.championsInserted, getBaseChampionCount());
  assert.equal(result.championsUpdated, 0);
  assert.equal(result.championsUnchanged, 0);
  assert.equal(supabase.champions.size, getBaseChampionCount());
  assert.equal(new Set(supabase.champions.keys()).size, getBaseChampionCount());
  assert.equal(supabase.champions.get("Fiddlesticks").riot_data_key, "Fiddlesticks");
  assert.equal(supabase.syncState.last_sync_status, "success");
}

async function testIdempotentRerunPreservesProductMetadata() {
  const supabase = createFakeSupabase({
    champions: [
      {
        ...normalizeChampionSourceRow(makeChampion("Ahri", "103", "Ahri"), testVersion),
        admin_notes: "Manual note that should survive sync.",
      },
    ],
  });

  const firstRun = await withFakeDataDragon(getBaseChampionPayload(), () =>
    syncLeagueChampionRegistry({ supabase }),
  );
  const secondRun = await withFakeDataDragon(getBaseChampionPayload(), () =>
    syncLeagueChampionRegistry({ supabase }),
  );

  assert.equal(firstRun.championsInserted, getBaseChampionCount() - 1);
  assert.equal(secondRun.ok, true);
  assert.equal(secondRun.championsInserted, 0);
  assert.equal(secondRun.championsUpdated, 0);
  assert.equal(secondRun.championsUnchanged, getBaseChampionCount());
  assert.equal(supabase.champions.size, getBaseChampionCount());
  assert.equal(supabase.champions.get("Ahri").admin_notes, "Manual note that should survive sync.");
}

async function testMissingChampionRecovery() {
  const supabase = createFakeSupabase({
    champions: [normalizeChampionSourceRow(makeChampion("Ahri", "103", "Ahri"), testVersion)],
  });

  const result = await withFakeDataDragon(getBaseChampionPayload(), () =>
    syncLeagueChampionRegistry({ supabase }),
  );
  const verification = await withFakeDataDragon(getBaseChampionPayload(), () =>
    verifyLeagueChampionRegistry({ supabase }),
  );

  assert.equal(result.ok, true);
  assert.equal(supabase.champions.has("Fiddlesticks"), true);
  assert.equal(supabase.champions.get("Fiddlesticks").name, "Fiddlesticks");
  assert.equal(verification.ok, true);
  assert.equal(verification.missing.length, 0);
}

function testRiotNamingExceptions() {
  const expected = [
    ["MonkeyKing", "MonkeyKing", "Wukong", "wukong"],
    ["Kaisa", "Kaisa", "Kai'Sa", "kaisa"],
    ["Khazix", "Khazix", "Kha'Zix", "khazix"],
    ["Chogath", "Chogath", "Cho'Gath", "chogath"],
    ["RekSai", "RekSai", "Rek'Sai", "reksai"],
    ["Belveth", "Belveth", "Bel'Veth", "belveth"],
    ["Velkoz", "Velkoz", "Vel'Koz", "velkoz"],
    ["Renata", "Renata", "Renata Glasc", "renata-glasc"],
    ["Nunu", "Nunu", "Nunu & Willump", "nunu-willump"],
    ["Fiddlesticks", "Fiddlesticks", "Fiddlesticks", "fiddlesticks"],
    ["FiddleSticks", "Fiddlesticks", "Fiddlesticks", "fiddlesticks"],
  ];

  for (const [sourceId, canonicalId, displayName, slug] of expected) {
    const row = normalizeChampionSourceRow(makeChampion(sourceId, "999", displayName), testVersion);

    assert.equal(row.id, canonicalId);
    assert.equal(row.name, displayName);
    assert.equal(row.slug, slug);
  }
}

async function testDeactivatesRemovedChampion() {
  const supabase = createFakeSupabase({
    champions: [
      normalizeChampionSourceRow(makeChampion("Ahri", "103", "Ahri"), testVersion),
      normalizeChampionSourceRow(makeChampion("OldChampion", "999", "Old Champion"), testVersion),
    ],
  });

  const result = await withFakeDataDragon(getBaseChampionPayload(), () =>
    syncLeagueChampionRegistry({ supabase }),
  );

  assert.equal(result.ok, true);
  assert.equal(result.championsDeactivated, 1);
  assert.equal(supabase.champions.get("OldChampion").is_active, false);
}

async function testSourceFailureDoesNotTouchChampionRows() {
  const ahri = normalizeChampionSourceRow(makeChampion("Ahri", "103", "Ahri"), testVersion);
  const supabase = createFakeSupabase({
    champions: [ahri],
  });

  const result = await withFailingDataDragon(() => syncLeagueChampionRegistry({ supabase }));

  assert.equal(result.ok, false);
  assert.equal(result.status, "failed");
  assert.equal(result.failed, 1);
  assert.equal(supabase.champions.size, 1);
  assert.deepEqual(supabase.champions.get("Ahri"), ahri);
  assert.equal(supabase.syncState.last_sync_status, "failed");
}

async function testDuplicateSourceIdentifierFailsSafely() {
  const supabase = createFakeSupabase();
  const payload = getChampionPayload([
    makeChampion("Fiddlesticks", "9", "Fiddlesticks"),
    makeChampion("FiddleSticks", "10", "Fiddlesticks"),
  ]);

  const result = await withFakeDataDragon(payload, () => syncLeagueChampionRegistry({ supabase }));

  assert.equal(result.ok, false);
  assert.equal(result.status, "failed");
  assert.ok(result.failures.some((failure) => failure.includes("Duplicate source champion id")));
  assert.equal(supabase.champions.size, 0);
}

function createFakeSupabase({ champions = [] } = {}) {
  const state = {
    champions: new Map(champions.map((row) => [row.id, { ...row }])),
    syncState: {
      id: "league_champions",
      last_sync_status: "never_run",
    },
  };

  return {
    get champions() {
      return state.champions;
    },
    get syncState() {
      return state.syncState;
    },
    from(table) {
      return new FakeRegistryQuery({ state, table });
    },
  };
}

class FakeRegistryQuery {
  constructor({ state, table }) {
    this.filters = [];
    this.operation = "select";
    this.rows = null;
    this.state = state;
    this.table = table;
    this.updatePatch = null;
    this.wantsMaybeSingle = false;
  }

  eq(column, value) {
    this.filters.push({ column, type: "eq", value });
    return this;
  }

  in(column, values) {
    this.filters.push({ column, type: "in", values });
    return this;
  }

  maybeSingle() {
    this.wantsMaybeSingle = true;
    return this;
  }

  select() {
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

  upsert(rows) {
    this.operation = "upsert";
    this.rows = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  execute() {
    if (this.table === "league_champions") {
      return this.executeChampionQuery();
    }

    if (this.table === "league_champion_registry_sync_state") {
      return this.executeSyncStateQuery();
    }

    return {
      data: [],
      error: null,
    };
  }

  executeChampionQuery() {
    if (this.operation === "upsert") {
      for (const row of this.rows) {
        const existingRow = this.state.champions.get(row.id) ?? {};
        this.state.champions.set(row.id, {
          ...existingRow,
          ...row,
        });
      }

      return {
        data: [],
        error: null,
      };
    }

    if (this.operation === "update") {
      for (const row of this.filterRows(Array.from(this.state.champions.values()))) {
        Object.assign(row, this.updatePatch);
      }

      return {
        data: [],
        error: null,
      };
    }

    return {
      data: this.filterRows(Array.from(this.state.champions.values())).map((row) => ({ ...row })),
      error: null,
    };
  }

  executeSyncStateQuery() {
    if (this.operation === "upsert") {
      for (const row of this.rows) {
        this.state.syncState = {
          ...this.state.syncState,
          ...row,
        };
      }

      return {
        data: [],
        error: null,
      };
    }

    const row = this.filterRows([this.state.syncState])[0] ?? null;

    return {
      data: this.wantsMaybeSingle ? row : row ? [row] : [],
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

async function withFakeDataDragon(payload, callback) {
  return withFakeFetch(async (url) => {
    if (url.endsWith("/api/versions.json")) {
      return createFetchResponse([testVersion]);
    }

    if (url.endsWith(`/cdn/${testVersion}/data/en_US/champion.json`)) {
      return createFetchResponse(payload);
    }

    return createFetchResponse({ error: "Not found" }, false, 404);
  }, callback);
}

async function withFailingDataDragon(callback) {
  return withFakeFetch(() => createFetchResponse({ error: "Down" }, false, 503), callback);
}

async function withFakeFetch(fetchImplementation, callback) {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = fetchImplementation;

  try {
    return await callback();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function createFetchResponse(data, ok = true, status = 200) {
  return {
    json: async () => data,
    ok,
    status,
  };
}

function getBaseChampionPayload() {
  return getChampionPayload([
    makeChampion("Ahri", "103", "Ahri", "the Nine-Tailed Fox", ["Mage", "Assassin"]),
    makeChampion("Fiddlesticks", "9", "Fiddlesticks", "the Ancient Fear", ["Mage", "Support"]),
    makeChampion("MonkeyKing", "62", "Wukong", "the Monkey King", ["Fighter", "Tank"]),
    makeChampion("Kaisa", "145", "Kai'Sa", "Daughter of the Void", ["Marksman"]),
    makeChampion("Khazix", "121", "Kha'Zix", "the Voidreaver", ["Assassin"]),
    makeChampion("Chogath", "31", "Cho'Gath", "the Terror of the Void", ["Tank", "Mage"]),
    makeChampion("RekSai", "421", "Rek'Sai", "the Void Burrower", ["Fighter"]),
    makeChampion("Belveth", "200", "Bel'Veth", "the Empress of the Void", ["Fighter"]),
    makeChampion("Velkoz", "161", "Vel'Koz", "the Eye of the Void", ["Mage"]),
    makeChampion("Renata", "888", "Renata Glasc", "the Chem-Baroness", ["Support"]),
    makeChampion("Nunu", "20", "Nunu & Willump", "the Boy and His Yeti", ["Tank", "Mage"]),
  ]);
}

function getBaseChampionCount() {
  return Object.keys(getBaseChampionPayload().data).length;
}

function getChampionPayload(champions) {
  return {
    data: Object.fromEntries(champions.map((champion) => [champion.id, champion])),
    format: "standAloneComplex",
    type: "champion",
    version: testVersion,
  };
}

function makeChampion(id, key, name, title = "Champion title", tags = ["Mage"]) {
  return {
    id,
    image: {
      full: `${id}.png`,
    },
    key,
    name,
    tags,
    title,
  };
}

await testCompleteImport();
await testIdempotentRerunPreservesProductMetadata();
await testMissingChampionRecovery();
testRiotNamingExceptions();
await testDeactivatesRemovedChampion();
await testSourceFailureDoesNotTouchChampionRows();
await testDuplicateSourceIdentifierFailsSafely();

console.log("League champion registry regression tests passed.");
