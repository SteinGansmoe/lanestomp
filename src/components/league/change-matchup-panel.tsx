"use client";

import Image from "next/image";
import {
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { ArrowLeftRight, ChevronDown, Search, Swords } from "lucide-react";

import {
  navigationPillClassName,
} from "@/src/components/back-button";
import {
  isChampionInRole,
  sortChampionsForRole,
} from "@/src/features/league/champion-roles";
import type { LeagueChampion } from "@/src/features/league/champions";
import { getLeagueMatchupHref } from "@/src/features/league/matchup-routes";
import {
  getLeagueRoleLabel,
  leagueRoles,
  type LeagueRole,
} from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

type ChangeMatchupPanelProps = {
  champions: LeagueChampion[];
  currentChampionAId?: string;
  currentChampionBId?: string;
  currentRole: LeagueRole;
};

const selectClassName =
  "h-11 w-full rounded-md border border-white/10 bg-[#081120] px-3 text-sm text-zinc-100 shadow-inner shadow-black/15 transition focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-300/20";
const optionClassName = "bg-[#10182b] text-zinc-100";
type OpenPicker = "champion" | "opponent" | null;
type ChampionFilter = LeagueRole | "all";

const championFilterStorageKey = "lanetips-change-matchup-role-filter";
const championFilterChangeEvent = "lanetips-change-matchup-role-filter-change";
const roleFilterOptions = [
  {
    iconSrc: "/images/All_icon.png",
    label: "All",
    value: "all",
  },
  {
    iconSrc: "/images/Top_icon.png",
    label: "Top",
    value: "top",
  },
  {
    iconSrc: "/images/Jungle_icon.png",
    label: "Jungle",
    value: "jungle",
  },
  {
    iconSrc: "/images/Middle_icon.png",
    label: "Mid",
    value: "mid",
  },
  {
    iconSrc: "/images/Bottom_icon.png",
    label: "Bot / ADC",
    value: "adc",
  },
  {
    iconSrc: "/images/Support_icon.png",
    label: "Support",
    value: "support",
  },
] as const satisfies ReadonlyArray<{
  iconSrc: string;
  label: string;
  value: ChampionFilter;
}>;

function getStoredChampionFilter(): ChampionFilter {
  if (typeof window === "undefined") {
    return "all";
  }

  const storedFilter = window.localStorage.getItem(championFilterStorageKey);

  return (
    roleFilterOptions.find((option) => option.value === storedFilter)?.value ??
    "all"
  );
}

function subscribeToChampionFilter(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(championFilterChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(championFilterChangeEvent, callback);
  };
}

function setStoredChampionFilter(nextFilter: ChampionFilter) {
  window.localStorage.setItem(championFilterStorageKey, nextFilter);
  window.dispatchEvent(new Event(championFilterChangeEvent));
}

export function ChangeMatchupPanel({
  champions,
  currentChampionAId,
  currentChampionBId,
  currentRole,
}: ChangeMatchupPanelProps) {
  const panelId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const [championAId, setChampionAId] = useState(currentChampionAId ?? "");
  const [championBId, setChampionBId] = useState(currentChampionBId ?? "");
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const [role, setRole] = useState<LeagueRole>(() => {
    const storedFilter = getStoredChampionFilter();

    return storedFilter === "all" ? currentRole : storedFilter;
  });
  const championFilter = useSyncExternalStore<ChampionFilter>(
    subscribeToChampionFilter,
    getStoredChampionFilter,
    () => "all"
  );
  const sortedChampions = useMemo(
    () => [...champions].sort((a, b) => a.name.localeCompare(b.name)),
    [champions]
  );
  const championA =
    champions.find((champion) => champion.id === championAId) ?? null;
  const championB =
    champions.find((champion) => champion.id === championBId) ?? null;
  const matchupHref =
    championA && championB
      ? getLeagueMatchupHref({ championA, championB, role })
      : null;

  function handleChampionFilterChange(nextFilter: ChampionFilter) {
    setStoredChampionFilter(nextFilter);

    if (nextFilter !== "all") {
      setRole(nextFilter);
    }
  }

  function handleChampionAChange(nextChampionId: string) {
    setChampionAId(nextChampionId);
    setOpenPicker(null);

    if (nextChampionId === championBId) {
      setChampionBId("");
    }
  }

  function handleChampionBChange(nextChampionId: string) {
    setChampionBId(nextChampionId);
    setOpenPicker(null);

    if (nextChampionId === championAId) {
      setChampionAId("");
    }
  }

  function handleSwapChampions() {
    setChampionAId(championBId);
    setChampionBId(championAId);
  }

  return (
    <div className="contents">
      <button
        aria-controls={panelId}
        aria-expanded={isExpanded}
        className={cn(navigationPillClassName, "justify-center")}
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            isExpanded && "rotate-180"
          )}
          aria-hidden="true"
        />
        Change Matchup
      </button>

      <div
        className={cn(
          "order-last grid basis-full transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
          isExpanded
            ? "grid-rows-[1fr] overflow-visible opacity-100"
            : "grid-rows-[0fr] overflow-hidden opacity-0"
        )}
        id={panelId}
      >
        <div
          className={cn(
            "min-h-0",
            isExpanded ? "overflow-visible" : "overflow-hidden"
          )}
        >
          <div
            className="mt-3 rounded-xl border border-white/10 bg-[#10182b]/90 p-4 shadow-xl shadow-black/20 ring-1 ring-white/5"
          >
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_12rem_auto] lg:items-end">
              <MatchupChampionPicker
                disabledChampionId={championBId}
                id={`${panelId}-champion`}
                label="Champion"
                onOpenChange={() =>
                  setOpenPicker(openPicker === "champion" ? null : "champion")
                }
                onChange={handleChampionAChange}
                isOpen={openPicker === "champion"}
                selectedChampionId={championAId}
                champions={sortedChampions}
                championFilter={championFilter}
                onChampionFilterChange={handleChampionFilterChange}
              />

              <button
                aria-label="Swap selected champions"
                className="hidden size-11 items-center justify-center rounded-md border border-cyan-300/15 bg-cyan-400/10 text-cyan-100/80 shadow-lg shadow-cyan-950/10 transition hover:border-cyan-300/45 hover:bg-cyan-400/20 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-35 lg:flex"
                disabled={!championAId && !championBId}
                onClick={handleSwapChampions}
                type="button"
              >
                <ArrowLeftRight className="size-5" aria-hidden="true" />
              </button>

              <MatchupChampionPicker
                disabledChampionId={championAId}
                id={`${panelId}-opponent`}
                label="Opponent"
                onOpenChange={() =>
                  setOpenPicker(openPicker === "opponent" ? null : "opponent")
                }
                onChange={handleChampionBChange}
                isOpen={openPicker === "opponent"}
                selectedChampionId={championBId}
                champions={sortedChampions}
                championFilter={championFilter}
                onChampionFilterChange={handleChampionFilterChange}
              />

              <label className="grid gap-2">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">
                  Role
                </span>
                <select
                  className={selectClassName}
                  name="role"
                  onChange={(event) =>
                    setRole(event.target.value as LeagueRole)
                  }
                  value={role}
                >
                  {leagueRoles.map((leagueRole) => (
                    <option
                      className={optionClassName}
                      key={leagueRole}
                      value={leagueRole}
                    >
                      {getLeagueRoleLabel(leagueRole)}
                    </option>
                  ))}
                </select>
              </label>

              {matchupHref ? (
                <Link
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-violet-300/20 bg-violet-500/80 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-950/20 transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
                  href={matchupHref}
                  onClick={() => setIsExpanded(false)}
                  scroll={false}
                >
                  <Swords className="size-4" aria-hidden="true" />
                  Generate matchup
                </Link>
              ) : (
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 text-sm font-semibold text-zinc-500"
                  disabled
                  type="button"
                >
                  <Swords className="size-4" aria-hidden="true" />
                  Generate matchup
                </button>
              )}
            </div>

            <button
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-cyan-300/15 bg-cyan-400/10 px-3 text-sm font-medium text-cyan-100/80 transition hover:border-cyan-300/45 hover:bg-cyan-400/20 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-35 lg:hidden"
              disabled={!championAId && !championBId}
              onClick={handleSwapChampions}
              type="button"
            >
              <ArrowLeftRight className="size-4" aria-hidden="true" />
              Swap champions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchupChampionPicker({
  champions,
  championFilter,
  disabledChampionId,
  id,
  isOpen,
  label,
  onChange,
  onChampionFilterChange,
  onOpenChange,
  selectedChampionId,
}: {
  champions: LeagueChampion[];
  championFilter: ChampionFilter;
  disabledChampionId: string;
  id: string;
  isOpen: boolean;
  label: string;
  onChange: (championId: string) => void;
  onChampionFilterChange: (nextFilter: ChampionFilter) => void;
  onOpenChange: () => void;
  selectedChampionId: string;
}) {
  const [query, setQuery] = useState("");
  const selectedChampion =
    champions.find((champion) => champion.id === selectedChampionId) ?? null;
  const filteredChampions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      return champions.filter((champion) =>
        [champion.name, champion.title, champion.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    const roleFilteredChampions =
      championFilter === "all"
        ? champions
        : sortChampionsForRole(
            champions.filter((champion) =>
              isChampionInRole(champion, championFilter)
            ),
            championFilter
          );

    return roleFilteredChampions;
  }, [championFilter, champions, query]);

  return (
    <div className="relative grid gap-2">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </span>
      <button
        aria-controls={`${id}-menu`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex h-11 w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-[#081120] px-3 text-left text-sm text-zinc-100 shadow-inner shadow-black/15 transition hover:border-cyan-300/35 hover:bg-white/[0.04] focus-visible:border-cyan-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/20"
        id={id}
        onClick={onOpenChange}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedChampion ? (
            <Image
              alt=""
              aria-hidden="true"
              className="size-7 shrink-0 rounded-md border border-white/10 object-cover"
              height={28}
              src={selectedChampion.image_url}
              width={28}
            />
          ) : (
            <span className="size-7 shrink-0 rounded-md border border-white/10 bg-white/5" />
          )}
          <span className="truncate">
            {selectedChampion ? selectedChampion.name : "Select champion"}
          </span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-full z-30 mt-2 w-[18rem] max-w-[calc(100vw-2rem)] rounded-xl border border-white/10 bg-[#081120] p-3 shadow-2xl shadow-black/40 ring-1 ring-white/5"
          id={`${id}-menu`}
        >
          <label className="relative block">
            <span className="sr-only">Search {label.toLowerCase()}</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              className="h-10 w-full rounded-md border border-white/10 bg-black/25 pl-10 pr-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/20"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search champions..."
              type="search"
              value={query}
            />
          </label>

          <CompactRoleFilter
            activeFilter={championFilter}
            onChange={onChampionFilterChange}
          />

          <div
            aria-label={`${label} champion options`}
            className="mt-3 grid max-h-64 grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-2 overflow-y-auto pr-1"
            role="listbox"
          >
            {filteredChampions.map((champion) => {
              const isDisabled = champion.id === disabledChampionId;
              const isSelected = champion.id === selectedChampionId;

              return (
                <button
                  aria-label={`Select ${champion.name}`}
                  aria-selected={isSelected}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md border border-white/10 bg-white/[0.035] transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50",
                    isSelected && "border-cyan-300/80 ring-2 ring-cyan-300/30",
                    isDisabled && "cursor-not-allowed opacity-25"
                  )}
                  disabled={isDisabled}
                  key={champion.id}
                  onClick={() => onChange(champion.id)}
                  role="option"
                  title={champion.name}
                  type="button"
                >
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="object-cover"
                    fill
                    sizes="48px"
                    src={champion.image_url}
                  />
                </button>
              );
            })}
            {filteredChampions.length === 0 ? (
              <p className="col-span-full rounded-md border border-white/10 bg-white/[0.035] p-4 text-center text-sm text-zinc-400">
                No champions found.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CompactRoleFilter({
  activeFilter,
  onChange,
}: {
  activeFilter: ChampionFilter;
  onChange: (nextFilter: ChampionFilter) => void;
}) {
  return (
    <div
      aria-label="Champion lane filter"
      className="mt-2 grid grid-cols-6 gap-1"
      role="radiogroup"
    >
      {roleFilterOptions.map((option) => {
        const isActive = activeFilter === option.value;

        return (
          <button
            aria-checked={isActive}
            aria-label={`${option.label} champion filter`}
            className={cn(
              "group flex h-8 min-w-0 items-center justify-center rounded-md border border-white/10 bg-black/20 text-zinc-500 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.07] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
              isActive &&
                "border-cyan-300/55 bg-cyan-400/15 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.14)] ring-1 ring-cyan-300/25"
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            type="button"
          >
            <Image
              alt=""
              aria-hidden="true"
              className={cn(
                "size-5 object-contain transition",
                isActive
                  ? "opacity-100 drop-shadow-[0_0_7px_rgba(125,211,252,0.55)]"
                  : "opacity-45 group-hover:opacity-80"
              )}
              height={20}
              src={option.iconSrc}
              width={20}
            />
          </button>
        );
      })}
    </div>
  );
}
