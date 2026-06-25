/* eslint-disable @next/next/no-img-element -- League ability chips should use cached Data Dragon icons directly. */

"use client";

import { useId, useState } from "react";

import {
  getLeagueAbilityIconPath,
  getLeagueChampionAbility,
  type LeagueChampionAbilityMetadata,
  type LeagueAbilityTokenKey,
} from "@/src/features/league/abilities";
import { cn } from "@/src/lib/utils";

export type AbilityHoverProps = {
  abilityKey: LeagueAbilityTokenKey;
  championId: string;
  className?: string;
  compact?: boolean;
  label?: string;
};

export function AbilityHover({
  abilityKey,
  championId,
  className,
  compact = false,
  label,
}: AbilityHoverProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const ability = getLeagueChampionAbility(championId, abilityKey);

  if (!ability) {
    return (
      <span className={cn("text-zinc-200", className)}>
        {label ?? `${championId} ${abilityKey}`}
      </span>
    );
  }

  const tooltipDescription = getShortAbilityDescription(ability);
  const abilityFacts = getAbilityFacts(ability);
  const chipLabel = label ?? (compact ? ability.key : ability.name);

  return (
    <span
      className={cn("group/ability-hover relative inline-flex align-baseline", className)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-describedby={tooltipId}
        aria-expanded={isOpen}
        className="mx-0.5 inline-flex max-w-full translate-y-[0.12em] items-center gap-1.5 border border-cyan-300/25 bg-cyan-400/[0.08] px-1.5 py-0.5 font-mono text-[0.72rem] font-semibold uppercase leading-5 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.08)] outline-none transition hover:border-cyan-200/55 hover:bg-cyan-300/15 focus-visible:border-cyan-200/70 focus-visible:ring-2 focus-visible:ring-cyan-200/30"
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <img
          alt=""
          aria-hidden="true"
          className="size-4 shrink-0 rounded-sm object-cover"
          decoding="async"
          loading="lazy"
          src={getLeagueAbilityIconPath(ability)}
        />
        <span className="text-[#F4D88A]">{ability.key}</span>
        {chipLabel ? (
          <span className="max-w-[9rem] truncate text-cyan-50 normal-case">{chipLabel}</span>
        ) : null}
      </button>

      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-0 z-40 mb-2 hidden w-72 border border-cyan-300/20 bg-[#06111f]/98 p-3 text-left shadow-2xl shadow-black/45 backdrop-blur sm:left-1/2 sm:-translate-x-1/2",
          "group-hover/ability-hover:block group-focus-within/ability-hover:block",
          isOpen ? "block" : null,
        )}
        id={tooltipId}
        role="tooltip"
      >
        <span className="flex items-start gap-3">
          <img
            alt=""
            aria-hidden="true"
            className="size-10 shrink-0 rounded-md border border-white/10 object-cover"
            decoding="async"
            loading="lazy"
            src={getLeagueAbilityIconPath(ability)}
          />
          <span className="min-w-0">
            <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
              {championId} / {ability.key}
            </span>
            <span className="mt-1 block text-sm font-semibold leading-5 text-white">
              {ability.name}
            </span>
          </span>
        </span>

        {tooltipDescription ? (
          <span className="mt-3 block text-sm leading-6 text-zinc-300">
            {tooltipDescription}
          </span>
        ) : null}

        {abilityFacts.length > 0 ? (
          <span className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
            {abilityFacts.map((fact) => (
              <span
                className="border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-zinc-300"
                key={fact}
              >
                {fact}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </span>
  );
}

function getShortAbilityDescription(ability: LeagueChampionAbilityMetadata) {
  const description = cleanDataDragonText(ability.description || ability.tooltip);

  if (description.length <= 220) {
    return description;
  }

  return `${description.slice(0, 217).trimEnd()}...`;
}

function getAbilityFacts(ability: LeagueChampionAbilityMetadata) {
  return [
    ability.cooldownBurn ? `CD ${ability.cooldownBurn}s` : null,
    ability.costBurn && ability.costBurn !== "0"
      ? `Cost ${[ability.costBurn, cleanDataDragonText(ability.costType ?? "")]
          .filter(Boolean)
          .join(" ")}`
      : null,
  ].filter((fact): fact is string => Boolean(fact));
}

function cleanDataDragonText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
