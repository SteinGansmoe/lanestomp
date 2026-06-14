export const dataDragonBaseUrl = "https://ddragon.leagueoflegends.com";
export const defaultDataDragonLocale = "en_US";
export const registrySyncStateId = "league_champions";

export const championIdentifierExceptions = {
  AurelionSol: {
    canonicalId: "AurelionSol",
    displayName: "Aurelion Sol",
    slug: "aurelion-sol",
  },
  Belveth: {
    canonicalId: "Belveth",
    displayName: "Bel'Veth",
    slug: "belveth",
  },
  Chogath: {
    canonicalId: "Chogath",
    displayName: "Cho'Gath",
    slug: "chogath",
  },
  DrMundo: {
    canonicalId: "DrMundo",
    displayName: "Dr. Mundo",
    slug: "dr-mundo",
  },
  FiddleSticks: {
    canonicalId: "Fiddlesticks",
    displayName: "Fiddlesticks",
    slug: "fiddlesticks",
  },
  Fiddlesticks: {
    canonicalId: "Fiddlesticks",
    displayName: "Fiddlesticks",
    slug: "fiddlesticks",
  },
  JarvanIV: {
    canonicalId: "JarvanIV",
    displayName: "Jarvan IV",
    slug: "jarvan-iv",
  },
  Kaisa: {
    canonicalId: "Kaisa",
    displayName: "Kai'Sa",
    slug: "kaisa",
  },
  Khazix: {
    canonicalId: "Khazix",
    displayName: "Kha'Zix",
    slug: "khazix",
  },
  KSante: {
    canonicalId: "KSante",
    displayName: "K'Sante",
    slug: "ksante",
  },
  LeeSin: {
    canonicalId: "LeeSin",
    displayName: "Lee Sin",
    slug: "lee-sin",
  },
  MasterYi: {
    canonicalId: "MasterYi",
    displayName: "Master Yi",
    slug: "master-yi",
  },
  MissFortune: {
    canonicalId: "MissFortune",
    displayName: "Miss Fortune",
    slug: "miss-fortune",
  },
  MonkeyKing: {
    canonicalId: "MonkeyKing",
    displayName: "Wukong",
    slug: "wukong",
  },
  Nunu: {
    canonicalId: "Nunu",
    displayName: "Nunu & Willump",
    slug: "nunu-willump",
  },
  RekSai: {
    canonicalId: "RekSai",
    displayName: "Rek'Sai",
    slug: "reksai",
  },
  Renata: {
    canonicalId: "Renata",
    displayName: "Renata Glasc",
    slug: "renata-glasc",
  },
  TahmKench: {
    canonicalId: "TahmKench",
    displayName: "Tahm Kench",
    slug: "tahm-kench",
  },
  TwistedFate: {
    canonicalId: "TwistedFate",
    displayName: "Twisted Fate",
    slug: "twisted-fate",
  },
  Velkoz: {
    canonicalId: "Velkoz",
    displayName: "Vel'Koz",
    slug: "velkoz",
  },
  XinZhao: {
    canonicalId: "XinZhao",
    displayName: "Xin Zhao",
    slug: "xin-zhao",
  },
};

const sourceManagedColumns = [
  "id",
  "riot_key",
  "riot_data_key",
  "name",
  "title",
  "image_url",
  "image_filename",
  "slug",
  "tags",
  "version",
  "is_active",
];

export async function fetchLatestDataDragonVersion() {
  const versions = await fetchJson(`${dataDragonBaseUrl}/api/versions.json`);

  if (!Array.isArray(versions) || typeof versions[0] !== "string") {
    throw new Error("Data Dragon versions response did not include a latest version.");
  }

  return versions[0];
}

export async function fetchDataDragonChampionPayload({
  locale = defaultDataDragonLocale,
  version = null,
} = {}) {
  const resolvedVersion = version ?? (await fetchLatestDataDragonVersion());
  const payload = await fetchJson(
    `${dataDragonBaseUrl}/cdn/${resolvedVersion}/data/${locale}/champion.json`,
  );

  return {
    locale,
    payload,
    version: resolvedVersion,
  };
}

export function toChampionRegistryRows(payload, version) {
  const champions = payload?.data ? Object.values(payload.data) : [];

  return champions
    .map((champion) => normalizeChampionSourceRow(champion, version))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function normalizeChampionSourceRow(champion, version) {
  const riotDataKey = String(champion?.id ?? "").trim();

  if (!riotDataKey) {
    throw new Error(`Champion source row is missing Data Dragon id: ${JSON.stringify(champion)}`);
  }

  const exception = championIdentifierExceptions[riotDataKey] ?? {};
  const displayName = String(exception.displayName ?? champion?.name ?? riotDataKey).trim();
  const imageFilename = String(champion?.image?.full ?? `${riotDataKey}.png`).trim();

  return {
    id: String(exception.canonicalId ?? riotDataKey).trim(),
    image_filename: imageFilename,
    image_url: `${dataDragonBaseUrl}/cdn/${version}/img/champion/${imageFilename}`,
    imported_at: new Date().toISOString(),
    is_active: true,
    name: displayName,
    riot_data_key: riotDataKey,
    riot_key: String(champion?.key ?? "").trim(),
    slug: exception.slug ?? slugifyChampionName(displayName),
    tags: Array.isArray(champion?.tags) ? champion.tags.map(String).sort() : [],
    title: String(champion?.title ?? "").trim(),
    updated_at: new Date().toISOString(),
    version,
  };
}

export async function syncLeagueChampionRegistry({
  dryRun = false,
  locale = defaultDataDragonLocale,
  supabase = null,
  version = null,
} = {}) {
  const startedAt = new Date().toISOString();
  let source;
  let sourceRows;

  try {
    source = await fetchDataDragonChampionPayload({
      locale,
      version,
    });
    sourceRows = toChampionRegistryRows(source.payload, source.version);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Data Dragon source error.";

    if (supabase && !dryRun) {
      await updateSyncState({
        patch: {
          last_sync_completed_at: new Date().toISOString(),
          last_sync_error: message,
          last_sync_failed: 1,
          last_sync_started_at: startedAt,
          last_sync_status: "failed",
        },
        supabase,
      });
    }

    return {
      ...emptySyncSummary([], version ?? "unknown"),
      failed: 1,
      failures: [message],
      ok: false,
      status: "failed",
    };
  }

  const validation = validateSourceRows(sourceRows);

  if (!validation.ok) {
    if (supabase && !dryRun) {
      await updateSyncState({
        patch: {
          last_sync_completed_at: new Date().toISOString(),
          last_sync_error: validation.conflicts.join(" "),
          last_sync_failed: validation.conflicts.length,
          last_sync_started_at: startedAt,
          last_sync_status: "failed",
          source_champion_count: sourceRows.length,
          source_version: source.version,
        },
        supabase,
      });
    }

    return {
      ...emptySyncSummary(sourceRows, source.version),
      failed: validation.conflicts.length,
      failures: validation.conflicts,
      ok: false,
      status: "failed",
    };
  }

  if (dryRun) {
    return {
      ...emptySyncSummary(sourceRows, source.version),
      ok: true,
      status: "dry_run",
    };
  }

  if (!supabase) {
    throw new Error("Supabase client is required unless dryRun is enabled.");
  }

  await updateSyncState({
    patch: {
      last_sync_completed_at: null,
      last_sync_error: null,
      last_sync_failed: 0,
      last_sync_started_at: startedAt,
      last_sync_status: "running",
      source_champion_count: sourceRows.length,
      source_version: source.version,
    },
    supabase,
  });

  try {
    const existingRows = await fetchExistingChampionRows(supabase);
    const existingRowsById = new Map(existingRows.map((row) => [row.id, row]));
    const sourceIds = new Set(sourceRows.map((row) => row.id));
    const upsertRows = sourceRows.map((row) => ({
      ...row,
      imported_at: startedAt,
      updated_at: startedAt,
    }));
    const inserted = sourceRows.filter((row) => !existingRowsById.has(row.id)).length;
    const updated = sourceRows.filter((row) => {
      const existingRow = existingRowsById.get(row.id);

      return existingRow ? hasSourceManagedChanges(existingRow, row) : false;
    }).length;
    const unchanged = sourceRows.length - inserted - updated;
    const { error: upsertError } = await supabase.from("league_champions").upsert(upsertRows, {
      onConflict: "id",
    });

    if (upsertError) {
      throw new Error(`Could not sync League champions: ${upsertError.message}`);
    }

    const championsToDeactivate = existingRows.filter(
      (row) => row.is_active !== false && !sourceIds.has(row.id),
    );

    if (championsToDeactivate.length > 0) {
      const { error: deactivateError } = await supabase
        .from("league_champions")
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .in(
          "id",
          championsToDeactivate.map((row) => row.id),
        );

      if (deactivateError) {
        throw new Error(
          `Could not deactivate removed League champions: ${deactivateError.message}`,
        );
      }
    }

    const completedAt = new Date().toISOString();
    const summary = {
      championsDeactivated: championsToDeactivate.length,
      championsInserted: inserted,
      championsReceived: sourceRows.length,
      championsUnchanged: unchanged,
      championsUpdated: updated,
      failed: 0,
      failures: [],
      ok: true,
      sourceVersion: source.version,
      status: "success",
    };

    await updateSyncState({
      patch: {
        last_sync_completed_at: completedAt,
        last_sync_deactivated: summary.championsDeactivated,
        last_sync_error: null,
        last_sync_failed: summary.failed,
        last_sync_inserted: summary.championsInserted,
        last_sync_status: "success",
        last_sync_unchanged: summary.championsUnchanged,
        last_sync_updated: summary.championsUpdated,
        source_champion_count: summary.championsReceived,
        source_version: summary.sourceVersion,
      },
      supabase,
    });

    return summary;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown champion registry sync error.";

    await updateSyncState({
      patch: {
        last_sync_completed_at: new Date().toISOString(),
        last_sync_error: message,
        last_sync_failed: sourceRows.length,
        last_sync_status: "failed",
        source_champion_count: sourceRows.length,
        source_version: source.version,
      },
      supabase,
    });

    return {
      ...emptySyncSummary(sourceRows, source.version),
      failed: sourceRows.length,
      failures: [message],
      ok: false,
      status: "failed",
    };
  }
}

export async function verifyLeagueChampionRegistry({
  locale = defaultDataDragonLocale,
  supabase,
  version = null,
} = {}) {
  const source = await fetchDataDragonChampionPayload({
    locale,
    version,
  });
  const sourceRows = toChampionRegistryRows(source.payload, source.version);
  const sourceValidation = validateSourceRows(sourceRows);
  const databaseRows = await fetchExistingChampionRows(supabase);
  const sourceRowsById = new Map(sourceRows.map((row) => [row.id, row]));
  const databaseRowsById = new Map(databaseRows.map((row) => [row.id, row]));
  const missing = sourceRows.filter((row) => {
    const databaseRow = databaseRowsById.get(row.id);

    return !databaseRow || databaseRow.is_active === false;
  });
  const unknown = databaseRows.filter(
    (row) => row.is_active !== false && !sourceRowsById.has(row.id),
  );
  const inactiveReturnedByRiot = databaseRows.filter(
    (row) => row.is_active === false && sourceRowsById.has(row.id),
  );
  const nameMismatches = sourceRows
    .map((sourceRow) => {
      const databaseRow = databaseRowsById.get(sourceRow.id);

      if (!databaseRow || databaseRow.name === sourceRow.name) {
        return null;
      }

      return {
        databaseName: databaseRow.name,
        id: sourceRow.id,
        sourceName: sourceRow.name,
      };
    })
    .filter(Boolean);
  const duplicateRiotKeys = getDuplicateValues(databaseRows, "riot_key");
  const duplicateCanonicalKeys = getDuplicateValues(databaseRows, "id");
  const duplicateSlugs = getDuplicateValues(databaseRows, "slug");
  const conflicts = [
    ...sourceValidation.conflicts,
    ...duplicateRiotKeys.map((value) => `Duplicate database Riot numeric key: ${value}`),
    ...duplicateCanonicalKeys.map((value) => `Duplicate database champion id: ${value}`),
    ...duplicateSlugs.map((value) => `Duplicate database slug: ${value}`),
  ];

  return {
    activeDatabaseChampionCount: databaseRows.filter((row) => row.is_active !== false).length,
    conflicts,
    databaseChampionCount: databaseRows.length,
    duplicateCanonicalKeys,
    duplicateRiotKeys,
    duplicateSlugs,
    inactiveReturnedByRiot,
    missing,
    nameMismatches,
    ok:
      missing.length === 0 &&
      unknown.length === 0 &&
      conflicts.length === 0 &&
      inactiveReturnedByRiot.length === 0 &&
      nameMismatches.length === 0,
    sourceChampionCount: sourceRows.length,
    sourceVersion: source.version,
    unknown,
  };
}

export async function getLeagueChampionRegistryStatus({ supabase, locale, version = null }) {
  const verification = await verifyLeagueChampionRegistry({
    locale,
    supabase,
    version,
  });
  const syncState = await fetchRegistrySyncState(supabase);

  return {
    ...verification,
    lastSyncedAt: syncState?.last_sync_completed_at ?? null,
    lastSyncError: syncState?.last_sync_error ?? null,
    lastSyncStatus: syncState?.last_sync_status ?? "never_run",
  };
}

export function slugifyChampionName(name) {
  return String(name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveCanonicalChampionId(value) {
  const key = String(value ?? "").trim();
  const exception = championIdentifierExceptions[key];

  return exception?.canonicalId ?? key;
}

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Data Dragon request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

async function fetchExistingChampionRows(supabase) {
  const { data, error } = await supabase
    .from("league_champions")
    .select(
      "id, riot_key, riot_data_key, name, title, image_url, image_filename, slug, tags, version, is_active",
    );

  if (error) {
    throw new Error(`Could not load league_champions: ${error.message}`);
  }

  return data ?? [];
}

async function fetchRegistrySyncState(supabase) {
  const { data, error } = await supabase
    .from("league_champion_registry_sync_state")
    .select(
      "source_version, source_champion_count, last_sync_started_at, last_sync_completed_at, last_sync_status, last_sync_inserted, last_sync_updated, last_sync_unchanged, last_sync_deactivated, last_sync_failed, last_sync_error",
    )
    .eq("id", registrySyncStateId)
    .maybeSingle();

  if (error) {
    console.warn("Could not load League champion registry sync state", {
      message: error.message,
    });
    return null;
  }

  return data ?? null;
}

async function updateSyncState({ patch, supabase }) {
  const { error } = await supabase.from("league_champion_registry_sync_state").upsert(
    {
      id: registrySyncStateId,
      ...patch,
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    console.warn("Could not update League champion registry sync state", {
      message: error.message,
    });
  }
}

function validateSourceRows(rows) {
  const duplicateIds = getDuplicateValues(rows, "id");
  const duplicateRiotKeys = getDuplicateValues(rows, "riot_key");
  const duplicateRiotDataKeys = getDuplicateValues(rows, "riot_data_key");
  const duplicateSlugs = getDuplicateValues(rows, "slug");
  const conflicts = [
    ...duplicateIds.map((value) => `Duplicate source champion id: ${value}`),
    ...duplicateRiotKeys.map((value) => `Duplicate source Riot numeric key: ${value}`),
    ...duplicateRiotDataKeys.map((value) => `Duplicate source Riot data key: ${value}`),
    ...duplicateSlugs.map((value) => `Duplicate source slug: ${value}`),
  ];

  return {
    conflicts,
    ok: conflicts.length === 0,
  };
}

function hasSourceManagedChanges(existingRow, sourceRow) {
  return sourceManagedColumns.some((column) => {
    if (Array.isArray(sourceRow[column])) {
      return (
        JSON.stringify([...(existingRow[column] ?? [])].sort()) !==
        JSON.stringify(sourceRow[column])
      );
    }

    return (existingRow[column] ?? null) !== (sourceRow[column] ?? null);
  });
}

function getDuplicateValues(rows, key) {
  const counts = new Map();

  for (const row of rows) {
    const value = row[key];

    if (value === null || value === undefined || value === "") {
      continue;
    }

    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

function emptySyncSummary(rows, sourceVersion) {
  return {
    championsDeactivated: 0,
    championsInserted: 0,
    championsReceived: rows.length,
    championsUnchanged: 0,
    championsUpdated: 0,
    failed: 0,
    failures: [],
    sourceVersion,
  };
}
