import { championIdentifierExceptions } from "./league-champion-registry.mjs";

export const canonicalChampionIdentifierField = "league_champions.id";

export const manualChampionAliases = {
  AurelionSol: "AurelionSol",
  Belveth: "Belveth",
  "Bel'Veth": "Belveth",
  Chogath: "Chogath",
  "Cho'Gath": "Chogath",
  DrMundo: "DrMundo",
  "Dr. Mundo": "DrMundo",
  FiddleSticks: "Fiddlesticks",
  Fiddlesticks: "Fiddlesticks",
  JarvanIV: "JarvanIV",
  "Jarvan IV": "JarvanIV",
  Kaisa: "Kaisa",
  "Kai'Sa": "Kaisa",
  Khazix: "Khazix",
  "Kha'Zix": "Khazix",
  KSante: "KSante",
  "K'Sante": "KSante",
  LeeSin: "LeeSin",
  "Lee Sin": "LeeSin",
  MasterYi: "MasterYi",
  "Master Yi": "MasterYi",
  MissFortune: "MissFortune",
  "Miss Fortune": "MissFortune",
  MonkeyKing: "MonkeyKing",
  Nunu: "Nunu",
  "Nunu & Willump": "Nunu",
  RekSai: "RekSai",
  "Rek'Sai": "RekSai",
  Renata: "Renata",
  "Renata Glasc": "Renata",
  TahmKench: "TahmKench",
  "Tahm Kench": "TahmKench",
  TwistedFate: "TwistedFate",
  "Twisted Fate": "TwistedFate",
  Velkoz: "Velkoz",
  "Vel'Koz": "Velkoz",
  Wukong: "MonkeyKing",
  XinZhao: "XinZhao",
  "Xin Zhao": "XinZhao",
};

export async function loadActiveChampionRegistry({ supabase }) {
  const { data, error } = await supabase
    .from("league_champions")
    .select("id, riot_key, riot_data_key, slug, name")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Could not load active League champion registry: ${error.message}`);
  }

  return buildChampionRegistry(data ?? []);
}

export function buildChampionRegistry(rows) {
  const registry = {
    aliases: new Map(),
    byCanonicalKey: new Map(),
    byDisplayName: new Map(),
    byNormalizedAlias: new Map(),
    byRiotDataKey: new Map(),
    byRiotNumericKey: new Map(),
    bySlug: new Map(),
    entries: [],
  };
  const collisions = [];

  for (const row of rows ?? []) {
    const entry = toChampionRegistryEntry(row);

    registry.entries.push(entry);
    addExactLookup(registry.byCanonicalKey, entry.canonicalKey, entry, "canonical key", collisions);
    addExactLookup(
      registry.byRiotNumericKey,
      entry.riotNumericKey,
      entry,
      "Riot numeric key",
      collisions,
    );
    addExactLookup(registry.byRiotDataKey, entry.riotDataKey, entry, "Riot data key", collisions);
    addExactLookup(registry.bySlug, entry.slug, entry, "slug", collisions);
    addExactLookup(registry.byDisplayName, entry.displayName, entry, "display name", collisions);

    addNormalizedLookup(registry, entry.canonicalKey, entry, "canonical key", collisions);
    addNormalizedLookup(registry, entry.riotDataKey, entry, "Riot data key", collisions);
    addNormalizedLookup(registry, entry.slug, entry, "slug", collisions);
    addNormalizedLookup(registry, entry.displayName, entry, "display name", collisions);

    const generatedException = championIdentifierExceptions[entry.riotDataKey];

    if (generatedException?.displayName) {
      addNormalizedLookup(
        registry,
        generatedException.displayName,
        entry,
        "registry exception",
        collisions,
      );
    }
  }

  for (const [alias, canonicalKey] of Object.entries(manualChampionAliases)) {
    const entry = registry.byCanonicalKey.get(canonicalKey);

    if (!entry) {
      continue;
    }

    registry.aliases.set(alias, entry);
    addNormalizedLookup(registry, alias, entry, "manual alias", collisions);
  }

  for (const entry of registry.entries) {
    if (
      normalizeChampionIdentifier(entry.canonicalKey, registry)?.canonicalKey !== entry.canonicalKey
    ) {
      collisions.push(`Champion ${entry.canonicalKey} could not resolve itself.`);
    }
  }

  if (collisions.length > 0) {
    const error = new Error(
      `Champion registry normalization is ambiguous: ${collisions.join(" ")}`,
    );

    error.collisions = collisions;
    throw error;
  }

  return registry;
}

export function normalizeChampionIdentifier(input, registry) {
  if (!registry) {
    return null;
  }

  if (typeof input === "number") {
    return registry.byRiotNumericKey.get(String(input)) ?? null;
  }

  if (typeof input === "string") {
    return normalizeSingleChampionIdentifier(input, registry);
  }

  if (!input || typeof input !== "object") {
    return null;
  }

  const candidates = [input.championId, input.championKey, input.championName, input.slug];

  for (const candidate of candidates) {
    const entry = normalizeChampionIdentifier(candidate, registry);

    if (entry) {
      return entry;
    }
  }

  return null;
}

export function normalizeParticipantChampionIdentifiers(participant, registry) {
  const numericEntry = normalizeChampionIdentifier(participant?.championId, registry);
  const textEntry = normalizeChampionIdentifier(
    {
      championKey: participant?.championKey,
      championName: participant?.championName,
    },
    registry,
  );
  const resolvedEntry = numericEntry ?? textEntry;

  if (numericEntry && textEntry && numericEntry.canonicalKey !== textEntry.canonicalKey) {
    return {
      conflict: true,
      entry: null,
      failure: false,
      inputs: getParticipantChampionSafeContext(participant),
      usedAlias: false,
    };
  }

  if (!resolvedEntry) {
    return {
      conflict: false,
      entry: null,
      failure: true,
      inputs: getParticipantChampionSafeContext(participant),
      usedAlias: false,
    };
  }

  return {
    conflict: false,
    entry: resolvedEntry,
    failure: false,
    inputs: getParticipantChampionSafeContext(participant),
    usedAlias:
      Boolean(textEntry) &&
      !isExactCanonicalOrNumeric({
        entry: resolvedEntry,
        participant,
        registry,
      }),
  };
}

export function getChampionNormalizationSummary(stats) {
  return {
    champion_aliases_resolved: stats.aliasesResolved,
    champion_identifier_conflicts: stats.conflicts,
    champion_identifiers_normalized: stats.normalized,
    champion_identifiers_processed: stats.processed,
    champion_normalization_failures: stats.failures,
  };
}

export function createChampionNormalizationStats() {
  return {
    aliasesResolved: 0,
    conflicts: 0,
    failures: 0,
    normalized: 0,
    processed: 0,
  };
}

export function normalizeChampionComparisonToken(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function getChampionDisplayName(registry, championId) {
  return registry?.byCanonicalKey?.get(championId)?.displayName ?? championId;
}

function toChampionRegistryEntry(row) {
  return {
    canonicalKey: String(row.id ?? "").trim(),
    displayName: String(row.name ?? row.id ?? "").trim(),
    riotDataKey: stringOrNull(row.riot_data_key),
    riotNumericKey: stringOrNull(row.riot_key),
    slug: stringOrNull(row.slug),
  };
}

function normalizeSingleChampionIdentifier(input, registry) {
  const value = String(input ?? "").trim();

  if (!value) {
    return null;
  }

  if (/^\d+$/.test(value)) {
    const numericEntry = registry.byRiotNumericKey.get(value);

    if (numericEntry) {
      return numericEntry;
    }
  }

  return (
    registry.byCanonicalKey.get(value) ??
    registry.byRiotDataKey.get(value) ??
    registry.bySlug.get(value) ??
    registry.byDisplayName.get(value) ??
    registry.aliases.get(value) ??
    registry.byNormalizedAlias.get(normalizeChampionComparisonToken(value)) ??
    null
  );
}

function addExactLookup(map, value, entry, label, collisions) {
  const key = stringOrNull(value);

  if (!key) {
    return;
  }

  const existing = map.get(key);

  if (existing && existing.canonicalKey !== entry.canonicalKey) {
    collisions.push(
      `Duplicate ${label} "${key}" maps to ${existing.canonicalKey} and ${entry.canonicalKey}.`,
    );
    return;
  }

  map.set(key, entry);
}

function addNormalizedLookup(registry, value, entry, source, collisions) {
  const token = normalizeChampionComparisonToken(value);

  if (!token) {
    return;
  }

  const existing = registry.byNormalizedAlias.get(token);

  if (existing && existing.canonicalKey !== entry.canonicalKey) {
    collisions.push(
      `Normalized ${source} token "${token}" maps to ${existing.canonicalKey} and ${entry.canonicalKey}.`,
    );
    return;
  }

  registry.byNormalizedAlias.set(token, entry);
}

function stringOrNull(value) {
  const text = String(value ?? "").trim();

  return text ? text : null;
}

function isExactCanonicalOrNumeric({ entry, participant, registry }) {
  const championId = String(participant?.championId ?? "").trim();
  const championName = String(participant?.championName ?? "").trim();
  const championKey = String(participant?.championKey ?? "").trim();

  return (
    (championId &&
      registry.byRiotNumericKey.get(championId)?.canonicalKey === entry.canonicalKey) ||
    championName === entry.canonicalKey ||
    championName === entry.riotDataKey ||
    championName === entry.displayName ||
    championKey === entry.canonicalKey ||
    championKey === entry.riotDataKey ||
    championKey === entry.displayName
  );
}

function getParticipantChampionSafeContext(participant) {
  return {
    championId: participant?.championId ?? null,
    championKey: participant?.championKey ?? null,
    championName: participant?.championName ?? null,
  };
}
