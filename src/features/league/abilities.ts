import abilityCache from "@/src/features/league/data-dragon/champion-abilities.json";

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
  description: string;
  effect?: Array<number | number[] | null>;
  effectBurn?: Array<string | null>;
  icon: LeagueAbilityIconMetadata;
  id: string;
  key: LeagueAbilityTokenKey;
  name: string;
  patch: string;
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
const abilitySetsByChampionLookupKey = new Map(
  Object.values(typedAbilityCache.champions).map((champion) => [
    normalizeAbilityChampionLookupKey(champion.id),
    champion,
  ]),
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

export function getLeagueAbilityIconPath(
  ability: Pick<LeagueChampionAbilityMetadata, "icon">,
  options: { source?: LeagueAbilityIconSource } = {},
) {
  return options.source === "cdn" ? ability.icon.dataDragonUrl : ability.icon.localPath;
}

function normalizeAbilityChampionLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
