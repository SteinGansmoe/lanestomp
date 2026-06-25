/* eslint-disable @next/next/no-img-element -- League item chips should use cached Data Dragon icons directly. */

"use client";

import { useId, useState } from "react";

import {
  getLeagueItemById,
  getLeagueItemIconPath,
  getLeagueItemStatEntries,
  type LeagueItemMetadata,
} from "@/src/features/league/items";
import { cn } from "@/src/lib/utils";

export type ItemHoverProps = {
  className?: string;
  compact?: boolean;
  itemId: number | string;
  label?: string;
};

export function ItemHover({ className, compact = false, itemId, label }: ItemHoverProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const item = getLeagueItemById(itemId);

  if (!item) {
    return <span className={cn("text-zinc-200", className)}>{label ?? `Item ${itemId}`}</span>;
  }

  const iconSrc = getLeagueItemIconPath(item) ?? item.icon.dataDragonUrl;
  const chipLabel = label ?? (compact ? String(item.id) : item.name);
  const tooltipDescription = getShortItemDescription(item);
  const statEntries = getLeagueItemStatEntries(item).slice(0, 4);

  return (
    <span
      className={cn("group/item-hover relative inline-flex align-baseline", className)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-describedby={tooltipId}
        aria-expanded={isOpen}
        className="mx-0.5 inline-flex max-w-full translate-y-[0.12em] items-center gap-1.5 border border-[#C9AA5A]/30 bg-[#C9AA5A]/10 px-1.5 py-0.5 font-mono text-[0.72rem] font-semibold uppercase leading-5 text-[#F4D88A] shadow-[0_0_14px_rgba(201,170,90,0.08)] outline-none transition hover:border-[#F4D88A]/55 hover:bg-[#C9AA5A]/15 focus-visible:border-[#F4D88A]/70 focus-visible:ring-2 focus-visible:ring-[#F4D88A]/30"
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
          src={iconSrc}
        />
        <span className="max-w-[9rem] truncate text-[#F8E6A0] normal-case">{chipLabel}</span>
      </button>

      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-0 z-40 mb-2 hidden w-72 border border-[#C9AA5A]/25 bg-[#06111f]/98 p-3 text-left shadow-2xl shadow-black/45 backdrop-blur sm:left-1/2 sm:-translate-x-1/2",
          "group-hover/item-hover:block group-focus-within/item-hover:block",
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
            src={iconSrc}
          />
          <span className="min-w-0">
            <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#F4D88A]">
              Item {item.id}
            </span>
            <span className="mt-1 block text-sm font-semibold leading-5 text-white">
              {item.name}
            </span>
            {item.tags.length > 0 ? (
              <span className="mt-1 block text-xs text-zinc-400">
                {item.tags.slice(0, 3).join(" / ")}
              </span>
            ) : null}
          </span>
        </span>

        {tooltipDescription ? (
          <span className="mt-3 block text-sm leading-6 text-zinc-300">
            {tooltipDescription}
          </span>
        ) : null}

        {statEntries.length > 0 ? (
          <span className="mt-3 grid gap-2 border-y border-white/10 py-3">
            {statEntries.map((stat) => (
              <span className="flex items-center justify-between gap-3 text-xs" key={stat.key}>
                <span className="text-zinc-400">{stat.label}</span>
                <span className="font-semibold text-zinc-100">
                  {formatItemStatValue(stat.value)}
                </span>
              </span>
            ))}
          </span>
        ) : null}

        {item.gold.total > 0 ? (
          <span className="mt-3 block text-sm font-semibold text-[#D8B14A]">
            {item.gold.total}g
          </span>
        ) : null}
      </span>
    </span>
  );
}

function getShortItemDescription(item: LeagueItemMetadata) {
  const description = cleanDataDragonText(item.description || item.plaintext);

  if (description.length <= 240) {
    return description;
  }

  return `${description.slice(0, 237).trimEnd()}...`;
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

function formatItemStatValue(value: number) {
  if (Math.abs(value) < 1) {
    return `${Math.round(value * 100)}%`;
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
