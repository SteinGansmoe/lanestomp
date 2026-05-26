"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Swords } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  getChampionSlug,
  type LeagueChampion,
} from "@/src/features/league/champions";
import { leagueRoles, type LeagueRole } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

type MatchupSelectorProps = {
  champions: LeagueChampion[];
  initialRole?: LeagueRole;
};

export function MatchupSelector({
  champions,
  initialRole = "mid",
}: MatchupSelectorProps) {
  const [championAId, setChampionAId] = useState<string | null>(null);
  const [championBId, setChampionBId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<LeagueRole>(initialRole);
  const championA = champions.find((champion) => champion.id === championAId) ?? null;
  const championB = champions.find((champion) => champion.id === championBId) ?? null;
  const filteredChampions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return champions;
    }

    return champions.filter((champion) =>
      [champion.name, champion.title, champion.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [champions, query]);
  const matchupHref =
    championA && championB ?
      `/league/matchups/${getChampionSlug(championA)}-vs-${getChampionSlug(championB)}?role=${role}`
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

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28rem),linear-gradient(135deg,rgba(20,184,166,0.14),transparent_34rem)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                Champion selector
              </p>
              <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white">
                Build a matchup
              </h2>
            </div>
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search champions</span>
              <Search
                className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <Input
                className="h-11 border-white/10 bg-black/20 pl-4 pr-11 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search champions..."
                type="search"
                value={query}
              />
            </label>
          </div>
        </div>

        <div className="grid max-h-[42rem] grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {filteredChampions.length > 0 ? (
            filteredChampions.map((champion) => {
              const isChampionA = champion.id === championAId;
              const isChampionB = champion.id === championBId;

              return (
                <button
                  className={cn(
                    "group flex min-h-24 min-w-0 flex-col items-start gap-2 rounded-lg border border-white/10 bg-white/[0.035] p-2.5 text-left transition hover:border-cyan-300/25 hover:bg-white/[0.06]",
                    isChampionA && "border-cyan-300/50 bg-cyan-400/10",
                    isChampionB && "border-rose-300/50 bg-rose-400/10"
                  )}
                  key={champion.id}
                  onClick={() => handleChampionPick(champion)}
                  type="button"
                >
                  <div className="flex w-full items-center gap-2">
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="size-12 shrink-0 rounded-md border border-white/10 object-cover"
                      height={48}
                      src={champion.image_url}
                      width={48}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-zinc-100">
                        {champion.name}
                      </span>
                      <span className="block truncate text-xs capitalize text-zinc-500">
                        {champion.title || "Champion"}
                      </span>
                    </span>
                  </div>
                  <span className="mt-auto flex gap-1.5">
                    {isChampionA ? (
                      <SelectionPill className="border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                        Champion A
                      </SelectionPill>
                    ) : null}
                    {isChampionB ? (
                      <SelectionPill className="border-rose-300/20 bg-rose-400/10 text-rose-100">
                        Champion B
                      </SelectionPill>
                    ) : null}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="col-span-full rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center text-sm text-zinc-400">
              No champions match that search.
            </div>
          )}
        </div>
      </section>

      <aside className="rounded-lg border border-white/10 bg-[#10182b] p-4 shadow-2xl shadow-black/25 xl:sticky xl:top-6 xl:self-start">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          Matchup setup
        </p>

        <div className="mt-4 grid gap-3">
          <SelectedChampionCard label="Champion A" champion={championA} tone="cyan" />
          <SelectedChampionCard label="Champion B" champion={championB} tone="rose" />
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-zinc-200">Lane / role</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {leagueRoles.map((nextRole) => (
              <button
                className={cn(
                  "h-10 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm capitalize text-zinc-300 transition hover:bg-white/[0.06] hover:text-white",
                  role === nextRole &&
                    "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
                )}
                key={nextRole}
                onClick={() => setRole(nextRole)}
                type="button"
              >
                {nextRole === "adc" ? "ADC" : nextRole}
              </button>
            ))}
          </div>
        </div>

        {matchupHref ? (
          <Button
            asChild
            className="mt-5 h-11 w-full bg-violet-500/80 text-white hover:bg-violet-500"
          >
            <Link href={matchupHref}>
              <Swords className="size-4" aria-hidden="true" />
              View matchup
            </Link>
          </Button>
        ) : (
          <Button
            className="mt-5 h-11 w-full bg-white/10 text-zinc-400"
            disabled
            type="button"
          >
            Select two champions
          </Button>
        )}
      </aside>
    </div>
  );
}

function SelectedChampionCard({
  champion,
  label,
  tone,
}: {
  champion: LeagueChampion | null;
  label: string;
  tone: "cyan" | "rose";
}) {
  return (
    <div
      className={cn(
        "flex min-h-20 items-center gap-3 rounded-lg border p-3",
        tone === "cyan"
          ? "border-cyan-300/20 bg-cyan-400/10"
          : "border-rose-300/20 bg-rose-400/10"
      )}
    >
      {champion ? (
        <>
          <Image
            alt=""
            aria-hidden="true"
            className="size-12 rounded-md border border-white/10 object-cover"
            height={48}
            src={champion.image_url}
            width={48}
          />
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase text-zinc-500">{label}</p>
            <p className="truncate font-medium text-white">{champion.name}</p>
          </div>
        </>
      ) : (
        <div>
          <p className="font-mono text-xs uppercase text-zinc-500">{label}</p>
          <p className="text-sm text-zinc-400">Select a champion</p>
        </div>
      )}
    </div>
  );
}

function SelectionPill({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <span className={cn("rounded-md border px-2 py-0.5 text-xs", className)}>
      {children}
    </span>
  );
}
