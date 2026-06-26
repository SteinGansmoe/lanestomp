/* eslint-disable @next/next/no-img-element -- League ability chips should use cached Data Dragon icons directly. */

"use client";

import { useId, useState } from "react";

import {
  getLeagueAbilityIconPath,
  getLeagueChampionAbility,
  type LeagueAbilityTokenKey,
} from "@/src/features/league/abilities";
import { getCompactAbilityTooltip } from "@/src/features/league/ability-tooltip-formatting";
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

  const tooltip = getCompactAbilityTooltip(ability, championId);
  const chipLabel = label ?? (compact ? ability.key : ability.name);

  return (
    <span
      className={cn("group/ability-hover relative inline-flex align-baseline", className)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-describedby={tooltipId}
        aria-expanded={isOpen}
        className="mx-0.5 inline-flex max-w-full appearance-none items-center gap-1 border-0 bg-transparent px-0.5 py-0 align-baseline text-[0.95em] font-semibold leading-[inherit] text-cyan-100 underline decoration-cyan-300/35 decoration-dotted underline-offset-[3px] outline-none transition hover:text-cyan-50 hover:decoration-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-200/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06111f]"
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <img
          alt=""
          aria-hidden="true"
          className="size-3.5 shrink-0 rounded-sm object-cover"
          decoding="async"
          loading="lazy"
          src={getLeagueAbilityIconPath(ability)}
        />
        <span className="font-mono text-[0.85em] text-[#F4D88A]">{ability.key}</span>
        {chipLabel ? (
          <span className="max-w-[9rem] truncate text-cyan-50 normal-case">{chipLabel}</span>
        ) : null}
      </button>

      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-0 z-40 mb-2 hidden w-80 max-w-[min(20rem,calc(100vw-2rem))] border border-cyan-300/20 bg-[#06111f]/98 p-2.5 text-left shadow-2xl shadow-black/45 backdrop-blur sm:left-1/2 sm:-translate-x-1/2",
          "group-hover/ability-hover:block group-focus-within/ability-hover:block",
          isOpen ? "block" : null,
        )}
        id={tooltipId}
        role="tooltip"
      >
        <span className="flex items-start gap-2.5">
          <img
            alt=""
            aria-hidden="true"
            className="size-9 shrink-0 rounded-md border border-white/10 object-cover"
            decoding="async"
            loading="lazy"
            src={getLeagueAbilityIconPath(ability)}
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-5 text-white">
              <span className="font-mono text-[#F4D88A]">{ability.key}</span> {ability.name}
            </span>
            {tooltip.metaText ? (
              <span className="mt-0.5 block font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-cyan-100/90">
                {tooltip.metaText}
              </span>
            ) : null}
          </span>
        </span>

        {tooltip.description ? (
          <span className="mt-2.5 block text-sm leading-5 text-zinc-300">
            {tooltip.description}
          </span>
        ) : null}

        {tooltip.details.length > 0 ? (
          <span className="mt-2.5 grid gap-2 border-t border-white/10 pt-2.5">
            {tooltip.details.map((detail) => (
              <span className="grid gap-1 text-xs" key={detail.label}>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-zinc-500">
                  {detail.label}
                </span>
                <span className="grid gap-0.5">
                  {detail.values.map((value) => (
                    <span className="font-medium text-zinc-200" key={value}>
                      {value}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </span>
  );
}
