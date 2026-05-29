"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, Plus, Search, Swords } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  getChampionSlug,
  type LeagueChampion,
} from "@/src/features/league/champions";
import {
  getChampionRoles,
  isChampionInRole,
  sortChampionsForRole,
} from "@/src/features/league/champion-roles";
import { leagueRoles, type LeagueRole } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

type MatchupSelectorProps = {
  champions: LeagueChampion[];
  initialRole?: LeagueRole;
};

type ChampionFilter = LeagueRole | "all";

const roleFilterOptions: ChampionFilter[] = ["all", ...leagueRoles];

export function MatchupSelector({
  champions,
  initialRole = "mid",
}: MatchupSelectorProps) {
  const [championAId, setChampionAId] = useState<string | null>(null);
  const [championBId, setChampionBId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<LeagueRole>(initialRole);
  const [activeFilter, setActiveFilter] = useState<ChampionFilter>(initialRole);
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
  const matchupHref =
    championA && championB
      ? `/league/matchups/${getChampionSlug(championA)}-vs-${getChampionSlug(championB)}?role=${role}`
      : null;

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

  function handleRoleChange(nextRole: LeagueRole) {
    setRole(nextRole);
    setActiveFilter(nextRole);
  }

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#07101f] shadow-2xl shadow-black/25">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28rem),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_26rem)] p-4 sm:p-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
              Matchup setup
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_11rem] md:items-center">
              <SelectionSlot
                champion={championA}
                label="Your champion"
                tone="cyan"
              />
              <div className="hidden justify-center text-cyan-100/70 md:flex">
                <ArrowLeftRight className="size-5" aria-hidden="true" />
              </div>
              <SelectionSlot
                champion={championB}
                label="Opponent"
                tone="violet"
              />
              <label className="block">
                <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">
                  Role
                </span>
                <select
                  className="h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm capitalize text-zinc-100 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                  onChange={(event) =>
                    handleRoleChange(event.target.value as LeagueRole)
                  }
                  value={role}
                >
                  {leagueRoles.map((nextRole) => (
                    <option
                      className="bg-[#10182b] text-zinc-100"
                      key={nextRole}
                      value={nextRole}
                    >
                      {getRoleLabel(nextRole)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
            {matchupHref ? (
              <Button
                asChild
                className="h-11 bg-violet-500/80 px-4 text-white hover:bg-violet-500"
              >
                <Link href={matchupHref}>
                  <Swords className="size-4" aria-hidden="true" />
                  View matchup
                </Link>
              </Button>
            ) : (
              <Button
                className="h-11 bg-white/10 px-4 text-zinc-400"
                disabled
                type="button"
              >
                Select two champions
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 xl:flex-row xl:items-center xl:justify-between">
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

            <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
              {roleFilterOptions.map((nextFilter) => {
                const isActive = activeFilter === nextFilter && !query.trim();

                return (
                  <button
                    className={cn(
                      "h-10 shrink-0 rounded-md border border-white/10 bg-white/[0.035] px-4 text-sm capitalize text-zinc-300 transition hover:border-cyan-300/25 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35",
                      isActive &&
                        "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
                    )}
                    key={nextFilter}
                    onClick={() => {
                      setActiveFilter(nextFilter);

                      if (nextFilter !== "all") {
                        setRole(nextFilter);
                      }
                    }}
                    type="button"
                  >
                    {getRoleLabel(nextFilter)}
                  </button>
                );
              })}
            </div>
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

function getRoleLabel(role: ChampionFilter) {
  if (role === "all") {
    return "All";
  }

  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}
