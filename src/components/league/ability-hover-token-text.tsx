"use client";

import type { ReactNode } from "react";

import { AbilityHover } from "@/src/components/league/ability-hover";
import { ItemHover } from "@/src/components/league/item-hover";
import { parseLeagueHoverText } from "@/src/features/league/ability-hover-tokens";

export function renderLeagueHoverText(value: string): ReactNode[] {
  return parseLeagueHoverText(value).map((part, index) => {
    if (part.type === "text") {
      return part.text;
    }

    if (part.type === "item") {
      return <ItemHover itemId={part.itemId} key={`${part.rawToken}-${index}`} />;
    }

    if (!part.abilityKey) {
      return part.fallbackText;
    }

    return (
      <AbilityHover
        abilityKey={part.abilityKey}
        championId={part.championId}
        key={`${part.rawToken}-${index}`}
      />
    );
  });
}

export const renderAbilityHoverText = renderLeagueHoverText;
