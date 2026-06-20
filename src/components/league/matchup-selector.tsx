"use client";

import Image from "next/image";
import { ArrowLeftRight, Plus, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ChangeMatchupPanel } from "@/src/components/league/change-matchup-panel";
import { getChampionIconPath, type LeagueChampion } from "@/src/features/league/champions";
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

export function MatchupSelector({ champions, initialRole }: MatchupSelectorProps) {
  const [championAId, setChampionAId] = useState<string | null>(null);
  const [championBId, setChampionBId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<LeagueRole>(initialRole ?? "mid");
  const [activeFilter, setActiveFilter] = useState<ChampionFilter>(initialRole ?? "all");
  const [includeOffMeta, setIncludeOffMeta] = useState(false);
  const championA = champions.find((champion) => champion.id === championAId) ?? null;
  const championB = champions.find((champion) => champion.id === championBId) ?? null;
  const filteredChampions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      return champions.filter((champion) =>
        [champion.name, champion.title, champion.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }

    if (activeFilter === "all") {
      return champions;
    }

    return sortChampionsForRole(
      champions.filter((champion) => isChampionInRole(champion, activeFilter, { includeOffMeta })),
      activeFilter,
    );
  }, [activeFilter, champions, includeOffMeta, query]);

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
    (selection: { championAId: string; championBId: string; role: LeagueRole }) => {
      setChampionAId(selection.championAId || null);
      setChampionBId(selection.championBId || null);
      setRole(selection.role);
      setActiveFilter(selection.role);
    },
    [],
  );

  return (
    <section className="relative z-10 overflow-hidden border border-cyan-100/20 bg-[#06111f]/88 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.65),transparent)]"
      />
      <div className="border-b border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_28rem),linear-gradient(135deg,rgba(8,24,40,0.9),rgba(3,9,20,0.82))] p-4 sm:p-5 lg:p-6">
        <div className="grid gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
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
                    <SelectionSlot champion={championA} label="Your champion" tone="cyan" />
                    <button
                      aria-label="Swap selected champions"
                      className="hidden size-11 items-center justify-center border border-cyan-300/15 bg-cyan-400/10 text-cyan-100/80 transition hover:border-cyan-300/45 hover:bg-cyan-400/20 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-35 md:flex"
                      disabled={!championAId && !championBId}
                      onClick={handleSwapChampions}
                      type="button"
                    >
                      <ArrowLeftRight className="size-5" aria-hidden="true" />
                    </button>
                    <SelectionSlot champion={championB} label="Opponent" tone="gold" />
                  </div>

                  <Button
                    className="h-11 border-cyan-100/15 bg-[#020814]/70 px-4 font-mono text-xs uppercase tracking-[0.16em] text-zinc-500"
                    disabled
                    type="button"
                  >
                    Select two champions
                  </Button>
                </div>

                <RoleIconSelector activeFilter={activeFilter} onChange={handleFilterChange} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:p-6">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-cyan-100/10 pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-center">
              <label className="relative block w-full xl:max-w-md">
                <span className="sr-only">Search champions</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <Input
                  className="h-12 border-cyan-100/15 bg-[#020814]/85 pl-10 pr-4 text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_0_18px_rgba(0,0,0,0.24)] focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search champions..."
                  type="search"
                  value={query}
                />
              </label>
            </div>

            {!championAId ? (
              <button
                aria-label="Swap selected champions"
                className="flex h-11 items-center justify-center gap-2 border border-cyan-300/15 bg-cyan-400/10 px-3 text-sm font-medium text-cyan-100/80 transition hover:border-cyan-300/45 hover:bg-cyan-400/20 hover:text-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45 disabled:cursor-not-allowed disabled:opacity-35 md:hidden"
                disabled
                onClick={handleSwapChampions}
                type="button"
              >
                <ArrowLeftRight className="size-4" aria-hidden="true" />
                Swap
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid max-h-[36rem] grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2 overflow-y-auto border border-cyan-100/10 bg-[#020814]/45 p-3 [scrollbar-color:rgba(34,211,238,0.35)_rgba(7,19,33,0.8)] [scrollbar-width:thin] sm:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]">
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
              <div className="col-span-full border border-cyan-100/15 bg-white/[0.035] p-8 text-center text-sm text-zinc-400">
                No champions match that search.
              </div>
            )}
          </div>

          <p className="mt-3 border border-cyan-300/10 bg-cyan-400/[0.04] px-3 py-2 text-xs text-zinc-400">
            Search ignores role filters, so off-meta picks stay easy to find.
          </p>
        </div>

        <aside className="grid gap-3 border border-cyan-100/20 bg-[#071321]/72 p-5 shadow-[inset_0_0_24px_rgba(34,211,238,0.03)] lg:content-start">
          <InfoPanel />
          <label className="flex items-start gap-3 border-t border-cyan-100/10 pt-4 text-sm text-zinc-300">
            <input
              checked={includeOffMeta}
              className="mt-0.5 size-4 accent-cyan-400"
              onChange={(event) => setIncludeOffMeta(event.target.checked)}
              type="checkbox"
            />
            <span>
              <span className="block font-medium text-zinc-100">Include off-meta</span>
              <span className="mt-1 block text-xs leading-5 text-zinc-500">
                Adds flexible picks to role filters. Search always includes every champion.
              </span>
            </span>
          </label>
          <div className="border-t border-cyan-100/10 pt-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
              Current pool
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{filteredChampions.length}</p>
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
    <div className="mt-4">
      <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cyan-100/60">
        Role
      </p>
      <div aria-label="Role filter" className="grid max-w-3xl grid-cols-6 gap-2" role="radiogroup">
        {roleFilterOptions.map((option) => {
          const isActive = activeFilter === option.value;

          return (
            <button
              aria-checked={isActive}
              aria-label={`${option.label} role filter`}
              className={cn(
                "group relative flex h-14 min-w-0 items-center justify-center border border-cyan-100/15 bg-[#020814]/65 px-2 text-[#C9AA5A]/60 transition hover:border-cyan-300/35 hover:bg-cyan-400/[0.07] hover:text-[#F4D88A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
                isActive &&
                  "border-cyan-300/70 bg-cyan-400/[0.12] text-[#F4D88A] shadow-[inset_0_-2px_0_rgba(34,211,238,0.75),0_0_20px_rgba(34,211,238,0.12)]",
              )}
              key={option.value}
              onClick={() => onChange(option.value)}
              role="radio"
              type="button"
            >
              {isActive ? (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-cyan-200/80 bg-[#06111f]"
                />
              ) : null}
              <Image
                alt=""
                className={cn(
                  "size-7 object-contain transition",
                  isActive
                    ? "opacity-100 brightness-125 sepia drop-shadow-[0_0_8px_rgba(201,170,90,0.42)]"
                    : "opacity-45 group-hover:opacity-80",
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
        "group relative aspect-square min-w-0 overflow-hidden border border-cyan-100/15 bg-[#071321] transition hover:border-cyan-300/45 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50",
        isChampionA &&
          "border-cyan-300/80 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.2),0_0_18px_rgba(34,211,238,0.16)]",
        isChampionB &&
          "border-[#C9AA5A]/80 shadow-[inset_0_0_0_1px_rgba(244,216,138,0.2),0_0_18px_rgba(201,170,90,0.14)]",
      )}
      onClick={onClick}
      title={`${champion.name}${championRoles.length ? ` - ${championRoles.map(getRoleLabel).join(", ")}` : ""}`}
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="bg-[#0b1220] object-cover transition duration-200 group-hover:scale-105"
        fill
        sizes="72px"
        src={getChampionIconPath(champion)}
        unoptimized
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-1 left-1 right-1 truncate border border-white/10 bg-black/70 px-1.5 py-0.5 text-[0.65rem] font-medium text-white opacity-0 transition group-hover:opacity-100">
        {champion.name}
      </span>
      {isChampionA || isChampionB ? (
        <span
          className={cn(
            "absolute right-1 top-1 border px-1.5 py-0.5 font-mono text-[0.6rem] font-semibold uppercase backdrop-blur-sm",
            isChampionA
              ? "border-cyan-200/60 bg-cyan-400/15 text-cyan-100"
              : "border-[#C9AA5A]/60 bg-[#C9AA5A]/15 text-[#F4D88A]",
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
  tone: "cyan" | "gold";
}) {
  return (
    <div
      className={cn(
        "flex min-h-16 items-center gap-3 border border-cyan-100/15 bg-[#020814]/60 p-2.5",
        tone === "cyan"
          ? "shadow-[inset_3px_0_0_rgba(34,211,238,0.28)]"
          : "shadow-[inset_3px_0_0_rgba(201,170,90,0.28)]",
      )}
    >
      <div
        className={cn(
          "relative flex size-12 shrink-0 items-center justify-center overflow-hidden border",
          tone === "cyan"
            ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
            : "border-[#C9AA5A]/35 bg-[#C9AA5A]/10 text-[#F4D88A]",
        )}
      >
        {champion ? (
          <Image
            alt=""
            aria-hidden="true"
            className="bg-[#0b1220] object-cover"
            fill
            sizes="48px"
            src={getChampionIconPath(champion)}
            unoptimized
          />
        ) : (
          <Plus className="size-5" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "font-mono text-[0.65rem] uppercase tracking-[0.16em]",
            tone === "cyan" ? "text-cyan-200" : "text-[#F4D88A]",
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
    <div>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
        Tool flow
      </p>
      <ol className="mt-3 space-y-3 text-sm text-zinc-400">
        {["Pick your champion", "Pick the opponent", "Choose role", "Open guide"].map(
          (step, index) => (
            <li className="flex items-center gap-3" key={step}>
              <span className="flex size-6 shrink-0 items-center justify-center border border-cyan-300/20 bg-cyan-400/10 font-mono text-xs text-cyan-100">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ),
        )}
      </ol>
    </div>
  );
}

function getRoleLabel(role: ChampionFilter) {
  if (role === "all") {
    return "All";
  }

  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}
