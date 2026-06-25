export type AbilityHoverTokenKey = "E" | "Passive" | "Q" | "R" | "W";

export type LeagueHoverTextPart =
  | {
      text: string;
      type: "text";
    }
  | {
      abilityKey: AbilityHoverTokenKey | null;
      abilityKeyLabel: string;
      championId: string;
      fallbackText: string;
      rawToken: string;
      type: "ability";
    }
  | {
      fallbackText: string;
      itemId: string;
      rawToken: string;
      type: "item";
    };

export type AbilityHoverTextPart = LeagueHoverTextPart;

const leagueHoverTokenPattern = /\{\{(ability|item):([^:{}]+)(?::([^:{}]+))?\}\}/g;

export function parseLeagueHoverText(value: string): LeagueHoverTextPart[] {
  const parts: LeagueHoverTextPart[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(leagueHoverTokenPattern)) {
    const rawToken = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        text: value.slice(lastIndex, matchIndex),
        type: "text",
      });
    }

    const tokenType = match[1];

    if (tokenType === "item") {
      const itemId = match[2]?.trim() ?? "";

      parts.push({
        fallbackText: getItemHoverFallbackText(itemId),
        itemId,
        rawToken,
        type: "item",
      });
    } else {
      const championId = match[2]?.trim() ?? "";
      const rawAbilityKey = match[3]?.trim() ?? "";
      const abilityKey = normalizeAbilityHoverTokenKey(rawAbilityKey);
      const abilityKeyLabel = abilityKey ?? rawAbilityKey;

      parts.push({
        abilityKey,
        abilityKeyLabel,
        championId,
        fallbackText: getAbilityHoverFallbackText(championId, abilityKeyLabel),
        rawToken,
        type: "ability",
      });
    }

    lastIndex = matchIndex + rawToken.length;
  }

  if (lastIndex < value.length) {
    parts.push({
      text: value.slice(lastIndex),
      type: "text",
    });
  }

  return parts.length > 0 ? parts : [{ text: value, type: "text" }];
}

export function parseAbilityHoverText(value: string): AbilityHoverTextPart[] {
  return parseLeagueHoverText(value);
}

export function normalizeAbilityHoverTokenKey(value: string): AbilityHoverTokenKey | null {
  const normalizedValue = value.trim().toLowerCase();

  switch (normalizedValue) {
    case "q":
      return "Q";
    case "w":
      return "W";
    case "e":
      return "E";
    case "r":
      return "R";
    case "p":
    case "passive":
      return "Passive";
    default:
      return null;
  }
}

function getAbilityHoverFallbackText(championId: string, abilityKeyLabel: string) {
  return [championId, abilityKeyLabel].filter(Boolean).join(" ") || "unknown ability";
}

function getItemHoverFallbackText(itemId: string) {
  return itemId ? `Item ${itemId}` : "unknown item";
}
