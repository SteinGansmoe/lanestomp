import itemCache from "@/src/features/league/data-dragon/items.json";

export type LeagueItemIconMetadata = {
  dataDragonUrl: string;
  imageFile: string;
  localPath: string;
};

export type LeagueItemGoldMetadata = {
  base: number;
  purchasable: boolean;
  sell: number;
  total: number;
};

export type LeagueItemMetadata = {
  description: string;
  gold: LeagueItemGoldMetadata;
  icon: LeagueItemIconMetadata;
  id: number;
  name: string;
  patch: string;
  plaintext: string;
  stats: Record<string, number>;
  tags: string[];
};

type LeagueItemCache = {
  cachedAt: string;
  items: LeagueItemMetadata[];
  locale: string;
  patch: string;
};

export type LeagueItemIconSource = "cdn" | "local";

const typedItemCache = itemCache as LeagueItemCache;
const itemsById = new Map(typedItemCache.items.map((item) => [item.id, item]));

const itemStatLabels: Record<string, string> = {
  FlatArmorMod: "Armor",
  FlatAttackSpeedMod: "Attack speed",
  FlatBlockMod: "Block",
  FlatCritChanceMod: "Critical strike chance",
  FlatCritDamageMod: "Critical strike damage",
  FlatEnergyPoolMod: "Energy",
  FlatEnergyRegenMod: "Energy regen",
  FlatHPPoolMod: "Health",
  FlatHPRegenMod: "Health regen",
  FlatMagicDamageMod: "Ability power",
  FlatMovementSpeedMod: "Move speed",
  FlatMPPoolMod: "Mana",
  FlatMPRegenMod: "Mana regen",
  FlatPhysicalDamageMod: "Attack damage",
  FlatSpellBlockMod: "Magic resist",
  PercentArmorMod: "Armor",
  PercentAttackSpeedMod: "Attack speed",
  PercentBlockMod: "Block",
  PercentCritChanceMod: "Critical strike chance",
  PercentCritDamageMod: "Critical strike damage",
  PercentDodgeMod: "Dodge",
  PercentEXPBonus: "XP bonus",
  PercentHPPoolMod: "Health",
  PercentHPRegenMod: "Health regen",
  PercentLifeStealMod: "Life steal",
  PercentMagicDamageMod: "Ability power",
  PercentMovementSpeedMod: "Move speed",
  PercentMPPoolMod: "Mana",
  PercentMPRegenMod: "Mana regen",
  PercentPhysicalDamageMod: "Attack damage",
  PercentSpellBlockMod: "Magic resist",
  PercentSpellVampMod: "Spell vamp",
};

export const leagueItemCacheMetadata = {
  cachedAt: typedItemCache.cachedAt,
  locale: typedItemCache.locale,
  patch: typedItemCache.patch,
};

export const leagueItems = typedItemCache.items;

export function getLeagueItemById(itemId: number | string) {
  const numericItemId = typeof itemId === "number" ? itemId : Number(itemId);

  if (!Number.isFinite(numericItemId)) {
    return null;
  }

  return itemsById.get(numericItemId) ?? null;
}

export function getLeagueItemIconPath(
  item: Pick<LeagueItemMetadata, "icon"> | number | string,
  options: { source?: LeagueItemIconSource } = {},
) {
  const resolvedItem = typeof item === "object" ? item : getLeagueItemById(item);
  const source = options.source ?? "local";

  if (!resolvedItem) {
    return null;
  }

  return source === "cdn" ? resolvedItem.icon.dataDragonUrl : resolvedItem.icon.localPath;
}

export function getLeagueItemStatEntries(item: Pick<LeagueItemMetadata, "stats">) {
  return Object.entries(item.stats)
    .filter(([, value]) => Number.isFinite(value) && value !== 0)
    .map(([key, value]) => ({
      key,
      label: itemStatLabels[key] ?? formatItemStatKey(key),
      value,
    }));
}

function formatItemStatKey(key: string) {
  return key
    .replace(/^Flat|^Percent/g, "")
    .replace(/Mod$/g, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\bHP\b/g, "Health")
    .replace(/\bMP\b/g, "Mana")
    .trim();
}
