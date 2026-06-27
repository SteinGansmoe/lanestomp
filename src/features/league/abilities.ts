import { championIdsByRole } from "./champion-role-registry.ts";
import abilityCache from "./data-dragon/champion-abilities.json";

export type LeagueAbilityKey = "E" | "Q" | "R" | "W";
export type LeagueAbilityTokenKey = LeagueAbilityKey | "Passive";

export type LeagueAbilityIconMetadata = {
  dataDragonUrl: string;
  imageFile: string;
  localPath: string;
};

export type LeagueAbilityVarMetadata = {
  coeff?: number | number[];
  key: string;
  link?: string;
};

export type LeagueChampionAbilityMetadata = {
  cooldownBurn?: string;
  costBurn?: string;
  costType?: string;
  datavalues?: Record<string, unknown>;
  description: string;
  effect?: Array<number | number[] | null>;
  effectBurn?: Array<string | null>;
  icon: LeagueAbilityIconMetadata;
  id: string;
  key: LeagueAbilityTokenKey;
  leveltip?: {
    effect?: string[];
    label?: string[];
  } | null;
  maxrank?: number;
  name: string;
  patch: string;
  resourceType?: string;
  tooltip: string;
  vars?: LeagueAbilityVarMetadata[];
};

export type LeagueChampionAbilitySet = {
  abilities: Record<LeagueAbilityKey, LeagueChampionAbilityMetadata> &
    Partial<Record<"Passive", LeagueChampionAbilityMetadata>>;
  id: string;
  name: string;
  patch: string;
};

type LeagueChampionAbilityCache = {
  cachedAt: string;
  champions: Record<string, LeagueChampionAbilitySet>;
  locale: string;
  patch: string;
};

export type LeagueAbilityIconSource = "cdn" | "local";

const typedAbilityCache = abilityCache as LeagueChampionAbilityCache;
const knownChampionLookupKeys = new Set(
  Object.values(championIdsByRole).flatMap((championIds) =>
    championIds.map(normalizeAbilityChampionLookupKey),
  ),
);
const abilitySetsByChampionLookupKey = createAbilitySetLookupMap(
  Object.values(typedAbilityCache.champions),
);

export const leagueAbilityCacheMetadata = {
  cachedAt: typedAbilityCache.cachedAt,
  locale: typedAbilityCache.locale,
  patch: typedAbilityCache.patch,
};

export const leagueChampionAbilitySets = typedAbilityCache.champions;

export function getLeagueChampionAbilitySet(championId: string) {
  return abilitySetsByChampionLookupKey.get(normalizeAbilityChampionLookupKey(championId)) ?? null;
}

export function getLeagueChampionAbility(championId: string, abilityKey: LeagueAbilityTokenKey) {
  return getLeagueChampionAbilitySet(championId)?.abilities[abilityKey] ?? null;
}

export function getLeagueAbilityDataDiagnostics(
  championId: string,
  abilityKey: LeagueAbilityTokenKey,
) {
  const lookupKey = normalizeAbilityChampionLookupKey(championId);
  const abilitySet = abilitySetsByChampionLookupKey.get(lookupKey) ?? null;

  return {
    abilityDataExists: Boolean(abilitySet?.abilities[abilityKey]),
    abilityKey,
    cacheLocale: typedAbilityCache.locale,
    cachePatch: typedAbilityCache.patch,
    championId,
    championRegistryEntryExists: knownChampionLookupKeys.has(lookupKey),
    dataSource: "data-dragon-champion-abilities-cache" as const,
    normalizedChampionId: lookupKey,
    spellDataExists: Boolean(abilitySet),
  };
}

export function getLeagueAbilityIconPath(
  ability: Pick<LeagueChampionAbilityMetadata, "icon">,
  options: { source?: LeagueAbilityIconSource } = {},
) {
  return options.source === "cdn" ? ability.icon.dataDragonUrl : ability.icon.localPath;
}

function createAbilitySetLookupMap(champions: LeagueChampionAbilitySet[]) {
  const lookupMap = new Map<string, LeagueChampionAbilitySet>();

  for (const champion of champions) {
    addAbilitySetLookup(lookupMap, champion.id, champion);
    addAbilitySetLookup(lookupMap, champion.name, champion);
  }

  return lookupMap;
}

function addAbilitySetLookup(
  lookupMap: Map<string, LeagueChampionAbilitySet>,
  value: string,
  champion: LeagueChampionAbilitySet,
) {
  const lookupKey = normalizeAbilityChampionLookupKey(value);

  if (!lookupKey || lookupMap.has(lookupKey)) {
    return;
  }

  lookupMap.set(lookupKey, champion);
}

export function normalizeAbilityChampionLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
