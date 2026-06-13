/* eslint-disable @next/next/no-img-element -- League item and ability icons should bypass Vercel image optimization. */

import type { ReactNode } from "react";

import {
  getLeagueAbilityIconPath,
  type LeagueChampionAbilityMetadata,
} from "@/src/features/league/abilities";
import {
  getLeagueItemIconPath,
  getLeagueItemStatEntries,
  type LeagueItemMetadata,
} from "@/src/features/league/items";
import { cn } from "@/src/lib/utils";

type LeagueDataTooltipProps = {
  children?: ReactNode;
  className?: string;
  description?: string;
  footer?: string;
  iconAlt: string;
  iconSrc: string;
  stats?: Array<{ label: string; value: number | string }>;
  subtitle?: string;
  title: string;
};

export function LeagueItemTooltip({
  className,
  item,
}: {
  className?: string;
  item: LeagueItemMetadata;
}) {
  const iconSrc = getLeagueItemIconPath(item) ?? item.icon.dataDragonUrl;
  const statEntries = getLeagueItemStatEntries(item).slice(0, 4);

  return (
    <LeagueDataTooltip
      className={className}
      description={item.plaintext || cleanDataDragonText(item.description)}
      footer={`Patch ${item.patch} · ${item.gold.total}g`}
      iconAlt={`${item.name} item icon`}
      iconSrc={iconSrc}
      stats={statEntries.map((stat) => ({
        label: stat.label,
        value: formatTooltipStatValue(stat.value),
      }))}
      subtitle={item.tags.slice(0, 3).join(" · ")}
      title={item.name}
    />
  );
}

export function LeagueAbilityTooltip({
  ability,
  championName,
  className,
}: {
  ability: LeagueChampionAbilityMetadata;
  championName?: string;
  className?: string;
}) {
  return (
    <LeagueDataTooltip
      className={className}
      description={cleanDataDragonText(ability.description)}
      footer={`Patch ${ability.patch}`}
      iconAlt={`${ability.name} ability icon`}
      iconSrc={getLeagueAbilityIconPath(ability)}
      subtitle={[championName, ability.key].filter(Boolean).join(" · ")}
      title={ability.name}
    />
  );
}

export function LeagueDataTooltip({
  children,
  className,
  description,
  footer,
  iconAlt,
  iconSrc,
  stats = [],
  subtitle,
  title,
}: LeagueDataTooltipProps) {
  return (
    <span className={cn("group/league-tooltip relative inline-flex", className)}>
      <span
        aria-describedby={`league-tooltip-${toTooltipId(title)}`}
        className="inline-flex size-10 items-center justify-center overflow-hidden rounded-md border border-cyan-300/25 bg-black/40 shadow-lg shadow-black/30 outline-none transition focus-visible:border-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-200/30"
        tabIndex={0}
      >
        {children ?? (
          <img
            alt={iconAlt}
            className="size-full object-cover"
            decoding="async"
            loading="lazy"
            src={iconSrc}
          />
        )}
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 hidden w-72 -translate-x-1/2 border border-cyan-300/20 bg-[#06111f]/95 p-4 text-left shadow-2xl shadow-black/40 backdrop-blur group-hover/league-tooltip:block group-focus-within/league-tooltip:block"
        id={`league-tooltip-${toTooltipId(title)}`}
        role="tooltip"
      >
        <span className="flex items-start gap-3">
          <img
            alt=""
            aria-hidden="true"
            className="size-10 shrink-0 rounded-md border border-white/10 object-cover"
            decoding="async"
            loading="lazy"
            src={iconSrc}
          />
          <span className="min-w-0">
            <span className="block font-mono text-sm font-semibold uppercase tracking-[0.12em] text-cyan-100">
              {title}
            </span>
            {subtitle ? (
              <span className="mt-1 block text-xs text-zinc-400">{subtitle}</span>
            ) : null}
          </span>
        </span>

        {description ? (
          <span className="mt-3 block text-sm leading-6 text-zinc-300">{description}</span>
        ) : null}

        {stats.length > 0 ? (
          <span className="mt-3 grid gap-2 border-y border-white/10 py-3">
            {stats.map((stat) => (
              <span className="flex items-center justify-between gap-3 text-xs" key={stat.label}>
                <span className="text-zinc-400">{stat.label}</span>
                <span className="font-semibold text-zinc-100">{stat.value}</span>
              </span>
            ))}
          </span>
        ) : null}

        {footer ? (
          <span className="mt-3 block text-[0.68rem] uppercase tracking-[0.14em] text-zinc-500">
            {footer}
          </span>
        ) : null}
      </span>
    </span>
  );
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

function formatTooltipStatValue(value: number) {
  if (Math.abs(value) < 1) {
    return `${Math.round(value * 100)}%`;
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function toTooltipId(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
