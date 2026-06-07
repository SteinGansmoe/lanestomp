"use client";

import Image from "next/image";
import {
  ArrowLeftRight,
  Plus,
  Search,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ChangeMatchupPanel } from "@/src/components/league/change-matchup-panel";
import {
  type LeagueChampion,
} from "@/src/features/league/champions";
import type { LeagueMatchupCoverageSummary } from "@/src/features/league/matchups";
import {
  getChampionRoles,
  isChampionInRole,
  sortChampionsForRole,
} from "@/src/features/league/champion-roles";
import { type LeagueRole } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

type MatchupSelectorProps = {
  champions: LeagueChampion[];
  initialRole?: LeagueRole;
  matchupCoverage?: LeagueMatchupCoverageSummary | null;
};

type ChampionFilter = LeagueRole | "all";

const roleFilterOptions = [
  {
    iconSrc: "/images/All_icon.png",
    label: "All",
    shortLabel: "All",
    value: "all",
  },
  {
    iconSrc: "/images/Top_icon.png",
    label: "Top",
    shortLabel: "Top",
    value: "top",
  },
  {
    iconSrc: "/images/Jungle_icon.png",
    label: "Jungle",
    shortLabel: "Jgl",
    value: "jungle",
  },
  {
    iconSrc: "/images/Middle_icon.png",
    label: "Mid",
    shortLabel: "Mid",
    value: "mid",
  },
  {
    iconSrc: "/images/Bottom_icon.png",
    label: "Bot / ADC",
    shortLabel: "Bot",
    value: "adc",
  },
  {
    iconSrc: "/images/Support_icon.png",
    label: "Support",
    shortLabel: "Sup",
    value: "support",
  },
] as const satisfies ReadonlyArray<{
  iconSrc: string;
  label: string;
  shortLabel: string;
  value: ChampionFilter;
}>;

export function MatchupSelector({
  champions,
  initialRole,
  matchupCoverage,
}: MatchupSelectorProps) {
  const [championAId, setChampionAId] = useState<string | null>(null);
  const [championBId, setChampionBId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<LeagueRole>(initialRole ?? "mid");
  const [activeFilter, setActiveFilter] = useState<ChampionFilter>(
    initialRole ?? "all"
  );
  const [includeOffMeta, setIncludeOffMeta] = useState(false);
  const championA =
    champions.find((champion) => champion.id === championAId) ?? null;
  const championB =
    champions.find((champion) => champion.id === championBId) ?? null;
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

    if (activeFilter === "all") {
      return champions;
    }

    return sortChampionsForRole(
      champions.filter((champion) =>
        isChampionInRole(champion, activeFilter, { includeOffMeta })
      ),
      activeFilter
    );
  }, [activeFilter, champions, includeOffMeta, query]);
  const visibleCoverage =
    matchupCoverage?.[activeFilter] ?? matchupCoverage?.all ?? null;

  function handleChampionPick(champion: LeagueChampion) {
    if (!championAId || (championAId && championBId)) {
      setChampionAId(champion.id);
      setChampionBId(null);
      return;
    }

    if (champion.id !== championAId) {
      setChampionBId(champion.id);
    }
  }

  function handleFilterChange(nextFilter: ChampionFilter) {
    setActiveFilter(nextFilter);

    if (nextFilter !== "all") {
      setRole(nextFilter);
    }
  }

  function handleSwapChampions() {
    setChampionAId(championBId);
    setChampionBId(championAId);
  }

  const handleMatchupControlsChange = useCallback(
    (selection: {
      championAId: string;
      championBId: string;
      role: LeagueRole;
    }) => {
      setChampionAId(selection.championAId || null);
      setChampionBId(selection.championBId || null);
      setRole(selection.role);
      setActiveFilter(selection.role);
    },
    []
  );

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#07101f] shadow-2xl shadow-black/25">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28rem),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_26rem)] p-4 sm:p-5">
        <div className="grid gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
              Matchup setup
            </p>
            {championAId ? (
              <div className="mt-3">
                <ChangeMatchupPanel
                  champions={champions}
                  currentChampionAId={championAId}
                  currentChampionBId={championBId ?? undefined}
                  currentRole={role}
                  key={`${championAId}-${championBId ?? "none"}-${role}`}
                  mode="inline"
                  onSelectionChange={handleMatchupControlsChange}
                />
              </div>
            ) : (
              <>
                <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
                    <SelectionSlot
                      champion={championA}
                      label="Your champion"
                      tone="cyan"
                    />
                    <button
                      aria-label="Swap selected champions"
                      className="hidden size-11 items-center justify-center rounded-md border border-cyan-300/15 bg-cyan-400/10 text-cyan-100/80 shadow-lg shadow-cyan-950/10 transition hover:border-cyan-300/45 hover:bg-cyan-400/20 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-35 md:flex"
                      disabled={!championAId && !championBId}
                      onClick={handleSwapChampions}
                      type="button"
                    >
                      <ArrowLeftRight className="size-5" aria-hidden="true" />
                    </button>
                    <SelectionSlot
                      champion={championB}
                      label="Opponent"
                      tone="violet"
                    />
                  </div>

                  <Button
                    className="h-11 bg-white/10 px-4 text-zinc-400"
                    disabled
                    type="button"
                  >
                    Select two champions
                  </Button>
                </div>

                <RoleIconSelector
                  activeFilter={activeFilter}
                  onChange={handleFilterChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-center">
              <label className="relative block w-full xl:max-w-md">
                <span className="sr-only">Search champions</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <Input
                  className="h-11 border-white/10 bg-black/25 pl-10 pr-4 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search champions..."
                  type="search"
                  value={query}
                />
              </label>

              {visibleCoverage ? (
                <MatchupCoverageIndicator coverage={visibleCoverage} />
              ) : null}
            </div>

            {!championAId ? (
              <button
                aria-label="Swap selected champions"
                className="flex h-11 items-center justify-center gap-2 rounded-md border border-cyan-300/15 bg-cyan-400/10 px-3 text-sm font-medium text-cyan-100/80 transition hover:border-cyan-300/45 hover:bg-cyan-400/20 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-35 md:hidden"
                disabled
                onClick={handleSwapChampions}
                type="button"
              >
                <ArrowLeftRight className="size-4" aria-hidden="true" />
                Swap
              </button>
            ) : null}
          </div>

          <div className="grid max-h-[36rem] grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2 overflow-y-auto border-b border-white/10 py-4 sm:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]">
            {filteredChampions.length > 0 ? (
              filteredChampions.map((champion) => (
                <ChampionButton
                  champion={champion}
                  isChampionA={champion.id === championAId}
                  isChampionB={champion.id === championBId}
                  key={champion.id}
                  onClick={() => handleChampionPick(champion)}
                />
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-400">
                No champions match that search.
              </div>
            )}
          </div>

          <p className="mt-3 rounded-md border border-cyan-300/10 bg-cyan-400/[0.04] px-3 py-2 text-xs text-zinc-400">
            Search ignores role filters, so off-meta picks stay easy to find.
          </p>
        </div>

        <aside className="grid gap-3 lg:content-start">
          <InfoPanel />
          <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-4 text-sm text-zinc-300">
            <input
              checked={includeOffMeta}
              className="mt-0.5 size-4 accent-cyan-400"
              onChange={(event) => setIncludeOffMeta(event.target.checked)}
              type="checkbox"
            />
            <span>
              <span className="block font-medium text-zinc-100">
                Include off-meta
              </span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                Adds flexible picks to role filters. Search always includes
                every champion.
              </span>
            </span>
          </label>
          <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
              Current pool
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {filteredChampions.length}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {query.trim()
                ? "Search results"
                : activeFilter === "all"
                  ? "All champions"
                  : `${getRoleLabel(activeFilter)} priority picks`}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function RoleIconSelector({
  activeFilter,
  onChange,
}: {
  activeFilter: ChampionFilter;
  onChange: (nextFilter: ChampionFilter) => void;
}) {
  return (
    <div className="mt-3">
      <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">
        Role
      </p>
      <div
        aria-label="Role filter"
        className="grid max-w-3xl grid-cols-6 gap-2"
        role="radiogroup"
      >
        {roleFilterOptions.map((option) => {
          const isActive = activeFilter === option.value;

          return (
            <button
              aria-checked={isActive}
              aria-label={`${option.label} role filter`}
              className={cn(
                "group flex h-12 min-w-0 items-center justify-center rounded-md border border-white/10 bg-black/20 px-2 text-zinc-500 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.07] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
                isActive &&
                  "border-cyan-300/55 bg-cyan-400/15 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)] ring-1 ring-cyan-300/25"
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              role="radio"
              type="button"
            >
              <Image
                alt=""
                className={cn(
                  "size-7 object-contain transition",
                  isActive
                    ? "opacity-100 drop-shadow-[0_0_8px_rgba(125,211,252,0.55)]"
                    : "opacity-45 group-hover:opacity-80"
                )}
                height={28}
                aria-hidden="true"
                src={option.iconSrc}
                width={28}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MatchupCoverageIndicator({
  coverage,
}: {
  coverage: LeagueMatchupCoverageSummary["all"];
}) {
  const helperText =
    "We're actively expanding the matchup database and adding new guides every day.";
  const label = `🚀 ${formatMatchupCount(
    coverage.generatedCount
  )} / ${formatMatchupCount(coverage.totalCount)} matchups available`;

  return (
    <div
      aria-label={`${label}. ${helperText}`}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-cyan-300/15 bg-cyan-400/[0.06] px-3 text-sm text-cyan-100 shadow-inner shadow-cyan-950/10 xl:w-auto xl:justify-start"
      title={helperText}
    >
      <span className="mr-2" aria-hidden="true">
        🚀
      </span>
      <span className="whitespace-nowrap font-medium">
        {formatMatchupCount(coverage.generatedCount)} /{" "}
        {formatMatchupCount(coverage.totalCount)} matchups available
      </span>
      <span className="sr-only">{helperText}</span>
    </div>
  );
}

function ChampionButton({
  champion,
  isChampionA,
  isChampionB,
  onClick,
}: {
  champion: LeagueChampion;
  isChampionA: boolean;
  isChampionB: boolean;
  onClick: () => void;
}) {
  const championRoles = getChampionRoles(champion);

  return (
    <button
      aria-label={`Select ${champion.name}`}
      aria-pressed={isChampionA || isChampionB}
      className={cn(
        "group relative aspect-square min-w-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.035] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50",
        isChampionA && "border-cyan-300/80 ring-2 ring-cyan-300/30",
        isChampionB && "border-violet-300/80 ring-2 ring-violet-300/30"
      )}
      onClick={onClick}
      title={`${champion.name}${championRoles.length ? ` - ${championRoles.map(getRoleLabel).join(", ")}` : ""}`}
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover transition duration-200 group-hover:scale-105"
        fill
        sizes="72px"
        src={champion.image_url}
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-1 left-1 right-1 truncate rounded bg-black/65 px-1.5 py-0.5 text-[0.65rem] font-medium text-white opacity-0 transition group-hover:opacity-100">
        {champion.name}
      </span>
      {isChampionA || isChampionB ? (
        <span
          className={cn(
            "absolute right-1 top-1 rounded px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold uppercase",
            isChampionA
              ? "bg-cyan-300 text-cyan-950"
              : "bg-violet-300 text-violet-950"
          )}
        >
          {isChampionA ? "You" : "VS"}
        </span>
      ) : null}
    </button>
  );
}

function SelectionSlot({
  champion,
  label,
  tone,
}: {
  champion: LeagueChampion | null;
  label: string;
  tone: "cyan" | "violet";
}) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-2.5">
      <div
        className={cn(
          "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border",
          tone === "cyan"
            ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
            : "border-violet-300/30 bg-violet-400/10 text-violet-100"
        )}
      >
        {champion ? (
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover"
            fill
            sizes="48px"
            src={champion.image_url}
          />
        ) : (
          <Plus className="size-5" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "font-mono text-[0.65rem] uppercase tracking-[0.16em]",
            tone === "cyan" ? "text-cyan-200" : "text-violet-200"
          )}
        >
          {label}
        </p>
        <p className="mt-1 truncate text-sm text-zinc-300">
          {champion ? champion.name : "Select champion"}
        </p>
      </div>
    </div>
  );
}

function InfoPanel() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
        Flow
      </p>
      <ol className="mt-3 space-y-3 text-sm text-zinc-400">
        {["Pick your champion", "Pick the opponent", "Choose role", "Open guide"].map(
          (step, index) => (
            <li className="flex items-center gap-3" key={step}>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-400/10 font-mono text-xs text-cyan-100">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          )
        )}
      </ol>
    </div>
  );
}

function formatMatchupCount(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function getRoleLabel(role: ChampionFilter) {
  if (role === "all") {
    return "All";
  }

  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}
