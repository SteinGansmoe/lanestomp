"use client";

import Image from "next/image";
import { useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

import {
  getChampionRoles,
  isChampionInRole,
  sortChampionsForRole,
} from "@/src/features/league/champion-roles";
import { getChampionIconPath, type LeagueChampion } from "@/src/features/league/champions";
import {
  matchesPublicCounterPickChampionSearch,
  normalizePublicCounterPickSearchValue,
} from "@/src/features/league/public-counter-pick-options";
import { getLeagueRoleLabel, leagueRoles, type LeagueRole } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

type CounterPickStartFormProps = {
  champions: LeagueChampion[];
};

const visibleSuggestionCount = 7;

export function CounterPickStartForm({ champions }: CounterPickStartFormProps) {
  const router = useRouter();
  const [highlightedChampionId, setHighlightedChampionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedChampion, setSelectedChampion] = useState<LeagueChampion | null>(null);
  const [selectedRole, setSelectedRole] = useState<LeagueRole>("mid");
  const normalizedQuery = normalizePublicCounterPickSearchValue(query);
  const matchingChampions = useMemo(() => {
    if (!normalizedQuery) {
      return sortChampionsForRole(
        champions.filter((champion) => isChampionInRole(champion, selectedRole)),
        selectedRole,
      );
    }

    return champions.filter((champion) =>
      matchesPublicCounterPickChampionSearch(
        champion,
        normalizedQuery,
        getChampionRoles(champion).map(getLeagueRoleLabel),
      ),
    );
  }, [champions, normalizedQuery, selectedRole]);
  const visibleChampions = matchingChampions.slice(0, visibleSuggestionCount);
  const highlightedChampion =
    visibleChampions.find((champion) => champion.id === highlightedChampionId) ??
    visibleChampions[0] ??
    null;

  function handleChampionSelect(champion: LeagueChampion) {
    setSelectedChampion(champion);
    setQuery(champion.name);
    setHighlightedChampionId(champion.id);

    const championRoles = getChampionRoles(champion);

    if (!championRoles.includes(selectedRole) && championRoles[0]) {
      setSelectedRole(championRoles[0]);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (visibleChampions.length === 0) {
      return;
    }

    const currentIndex = Math.max(
      visibleChampions.findIndex((champion) => champion.id === highlightedChampion?.id),
      0,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedChampionId(visibleChampions[(currentIndex + 1) % visibleChampions.length].id);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedChampionId(
        visibleChampions[
          (currentIndex - 1 + visibleChampions.length) % visibleChampions.length
        ].id,
      );
      return;
    }

    if (event.key === "Enter" && highlightedChampion) {
      event.preventDefault();
      handleChampionSelect(highlightedChampion);
    }
  }

  function handleSubmit() {
    if (!selectedChampion || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    router.push(`/league/counters?champion=${encodeURIComponent(selectedChampion.id)}&role=${selectedRole}`);
  }

  return (
    <div className="rounded-lg border border-cyan-300/15 bg-[#07101f]/88 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur sm:p-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
          Who are you playing against?
        </p>
        <label className="relative mt-3 block">
          <span className="sr-only">Search enemy champion</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            aria-activedescendant={highlightedChampion ? `home-counter-option-${highlightedChampion.id}` : undefined}
            aria-autocomplete="list"
            aria-controls="home-counter-champion-results"
            aria-expanded={visibleChampions.length > 0}
            aria-label="Search enemy champion"
            autoComplete="off"
            className="h-12 w-full rounded-md border border-white/10 bg-black/35 pl-10 pr-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedChampion(null);
              setHighlightedChampionId(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search champion..."
            role="combobox"
            type="search"
            value={query}
          />
        </label>
      </div>

      <div
        className="mt-3 grid max-h-64 gap-2 overflow-y-auto"
        id="home-counter-champion-results"
        role="listbox"
      >
        {visibleChampions.length > 0 ? (
          visibleChampions.map((champion) => {
            const isSelected = selectedChampion?.id === champion.id;
            const isHighlighted = highlightedChampion?.id === champion.id;

            return (
              <button
                aria-label={`Select ${champion.name}`}
                aria-selected={isSelected}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-2 text-left transition hover:border-cyan-300/35 hover:bg-cyan-400/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45",
                  isSelected && "border-cyan-300/70 bg-cyan-400/[0.09]",
                  isHighlighted && !isSelected && "border-cyan-300/35",
                )}
                id={`home-counter-option-${champion.id}`}
                key={champion.id}
                onClick={() => handleChampionSelect(champion)}
                onMouseEnter={() => setHighlightedChampionId(champion.id)}
                role="option"
                type="button"
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-10 rounded-md border border-white/10 bg-[#0b1220] object-cover"
                  height={40}
                  src={getChampionIconPath(champion)}
                  unoptimized
                  width={40}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {champion.name}
                  </span>
                  <span className="block truncate text-xs text-zinc-500">{champion.title}</span>
                </span>
              </button>
            );
          })
        ) : (
          <p className="rounded-md border border-white/10 bg-white/[0.035] p-4 text-center text-sm text-zinc-400">
            No champions match that search.
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">Role</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {leagueRoles.map((role) => {
            const isActive = selectedRole === role;

            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  "h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm font-medium text-zinc-300 transition hover:border-cyan-300/35 hover:bg-cyan-400/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45",
                  isActive &&
                    "border-cyan-300/65 bg-cyan-400/15 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.14)]",
                )}
                key={role}
                onClick={() => setSelectedRole(role)}
                type="button"
              >
                {getLeagueRoleLabel(role)}
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-[#05111d] transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!selectedChampion || isSubmitting}
        onClick={handleSubmit}
        type="button"
      >
        {isSubmitting ? "Opening counters..." : "Find counters"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
