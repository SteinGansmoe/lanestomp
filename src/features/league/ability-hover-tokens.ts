export type AbilityHoverTokenKey = "E" | "Passive" | "Q" | "R" | "W";

export type AbilityHoverTextPart =
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
    };

const abilityTokenPattern = /\{\{ability:([^:{}]+):([^:{}]+)\}\}/g;

export function parseAbilityHoverText(value: string): AbilityHoverTextPart[] {
  const parts: AbilityHoverTextPart[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(abilityTokenPattern)) {
    const rawToken = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({
        text: value.slice(lastIndex, matchIndex),
        type: "text",
      });
    }

    const championId = match[1]?.trim() ?? "";
    const rawAbilityKey = match[2]?.trim() ?? "";
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
