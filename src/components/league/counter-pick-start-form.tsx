"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";

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
import { buildCounterPickUrl } from "@/src/features/league/counter-pick-routes";
import {
  counterPickConfirmedInputClassName,
  counterPickPrimaryCtaClassName,
} from "@/src/components/league/counter-pick-cta-styles";
import { getLeagueRoleLabel, type LeagueRole } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

type CounterPickStartFormProps = {
  champions: LeagueChampion[];
  popularChampions: LeagueChampion[];
};

export function CounterPickStartForm({ champions, popularChampions }: CounterPickStartFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlightedChampionId, setHighlightedChampionId] = useState<string | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedChampion, setSelectedChampion] = useState<LeagueChampion | null>(null);
  const [selectedRole, setSelectedRole] = useState<LeagueRole>("mid");
  const [showAllChampions, setShowAllChampions] = useState(false);
  const [showSelectionHint, setShowSelectionHint] = useState(false);
  const normalizedQuery = normalizePublicCounterPickSearchValue(query);
  const matchingChampions = useMemo(() => {
    if (!normalizedQuery) {
      return showAllChampions
        ? champions
        : sortChampionsForRole(
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
  }, [champions, normalizedQuery, selectedRole, showAllChampions]);
  const highlightedChampion =
    matchingChampions.find((champion) => champion.id === highlightedChampionId) ??
    matchingChampions[0] ??
    null;
  const exactQueryChampion =
    normalizedQuery.length > 0
      ? champions.find(
          (champion) => normalizePublicCounterPickSearchValue(champion.name) === normalizedQuery,
        ) ?? null
      : null;

  useEffect(() => {
    function closeResultsOnOutsideClick(event: MouseEvent) {
      if (!formRef.current?.contains(event.target as Node)) {
        setIsResultsOpen(false);
        setShowAllChampions(false);
      }
    }

    document.addEventListener("mousedown", closeResultsOnOutsideClick);

    return () => document.removeEventListener("mousedown", closeResultsOnOutsideClick);
  }, []);

  function handleChampionSelect(champion: LeagueChampion) {
    setSelectedChampion(champion);
    setQuery(champion.name);
    setHighlightedChampionId(champion.id);
    setIsResultsOpen(false);
    setShowAllChampions(false);
    setShowSelectionHint(false);

    const championRoles = getChampionRoles(champion);

    if (!championRoles.includes(selectedRole) && championRoles[0]) {
      setSelectedRole(championRoles[0]);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsResultsOpen(false);
      setShowAllChampions(false);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (exactQueryChampion) {
        handleChampionSelect(exactQueryChampion);
        return;
      }

      if (isResultsOpen && highlightedChampion) {
        handleChampionSelect(highlightedChampion);
        return;
      }

      promptChampionSelection();
      return;
    }

    if (matchingChampions.length === 0) {
      return;
    }

    const currentIndex = Math.max(
      matchingChampions.findIndex((champion) => champion.id === highlightedChampion?.id),
      0,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsResultsOpen(true);
      setHighlightedChampionId(
        matchingChampions[(currentIndex + 1) % matchingChampions.length].id,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsResultsOpen(true);
      setHighlightedChampionId(
        matchingChampions[
          (currentIndex - 1 + matchingChampions.length) % matchingChampions.length
        ].id,
      );
    }
  }

  function handleSubmit() {
    if (!selectedChampion) {
      promptChampionSelection();
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const url = buildCounterPickUrl({ champion: selectedChampion, role: selectedRole });

    if (url) {
      router.push(url);
    } else {
      setIsSubmitting(false);
    }
  }

  function promptChampionSelection() {
    setShowSelectionHint(true);
    setShowAllChampions(true);
    setIsResultsOpen(true);
    setHighlightedChampionId(matchingChampions[0]?.id ?? champions[0]?.id ?? null);
    inputRef.current?.focus();
  }

  function clearSelectedChampion() {
    setHighlightedChampionId(champions[0]?.id ?? null);
    setQuery("");
    setSelectedChampion(null);
    setShowSelectionHint(false);
    setShowAllChampions(true);
    setIsResultsOpen(true);
    inputRef.current?.focus();
  }

  return (
    <div className="w-full max-w-[48rem]" ref={formRef}>
      <div className="relative z-20">
        <div
          className={cn(
            "flex flex-col border border-cyan-300/45 bg-[#020a14]/90 shadow-[0_0_18px_rgba(34,211,238,0.08)] sm:flex-row",
            selectedChampion && counterPickConfirmedInputClassName,
          )}
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search any champion</span>
            {selectedChampion ? (
              <Image
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-9 -translate-y-1/2 border border-cyan-300/35 bg-[#0b1220] object-cover"
                height={36}
                src={getChampionIconPath(selectedChampion)}
                unoptimized
                width={36}
              />
            ) : (
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cyan-100/60"
                aria-hidden="true"
              />
            )}
            <input
              aria-activedescendant={
                isResultsOpen && highlightedChampion
                  ? `home-counter-option-${highlightedChampion.id}`
                  : undefined
              }
              aria-autocomplete="list"
              aria-controls="home-counter-champion-results"
              aria-describedby={showSelectionHint ? "home-counter-selection-hint" : undefined}
              aria-expanded={isResultsOpen}
              aria-label="Search any champion"
              autoComplete="off"
              className={cn(
                "h-16 w-full bg-transparent pr-12 text-base text-zinc-100 outline-none placeholder:text-zinc-500 focus:ring-0",
                selectedChampion ? "pl-16" : "pl-12",
              )}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedChampion(null);
                setHighlightedChampionId(null);
                setShowAllChampions(false);
                setShowSelectionHint(false);
                setIsResultsOpen(true);
              }}
              onFocus={() => setIsResultsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search any champion..."
              ref={inputRef}
              role="combobox"
              type="text"
              value={query}
            />
            {selectedChampion ? (
              <button
                aria-label={`Clear ${selectedChampion.name}`}
                className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center border border-cyan-100/15 text-zinc-300 transition hover:border-cyan-300/45 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45"
                onClick={clearSelectedChampion}
                type="button"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </label>
          <button
            className={cn(
              "inline-flex h-16 items-center justify-center gap-3 border-t px-6 font-mono text-sm font-bold uppercase tracking-[0.08em] sm:min-w-52 sm:border-l sm:border-t-0",
              selectedChampion
                ? counterPickPrimaryCtaClassName
                : "border-cyan-100/15 bg-[#06111f]/90 text-cyan-100 hover:border-cyan-300/50 hover:bg-cyan-400/[0.08] focus-visible:ring-cyan-300/55",
            )}
            onClick={handleSubmit}
            type="button"
          >
            {isSubmitting ? "Opening" : selectedChampion ? "Find counters" : "Select a champion"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        {showSelectionHint ? (
          <p
            className="mt-3 border border-cyan-300/20 bg-cyan-400/[0.07] px-3 py-2 text-sm text-cyan-100"
            id="home-counter-selection-hint"
          >
            Choose a champion from the results to continue.
          </p>
        ) : null}

        {isResultsOpen ? (
          <div
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-80 overflow-y-auto border border-cyan-300/35 bg-[#06111f] p-1 shadow-[0_18px_44px_rgba(0,0,0,0.5)] [scrollbar-color:rgba(34,211,238,0.38)_rgba(7,19,33,0.9)] [scrollbar-width:thin]"
            id="home-counter-champion-results"
            role="listbox"
          >
            {matchingChampions.length > 0 ? (
              matchingChampions.map((champion) => {
                const isSelected = selectedChampion?.id === champion.id;
                const isHighlighted = highlightedChampion?.id === champion.id;

                return (
                  <button
                    aria-label={`Select ${champion.name}`}
                    aria-selected={isSelected}
                    className={cn(
                      "flex min-h-14 w-full items-center gap-3 border border-transparent p-2 text-left transition hover:border-cyan-300/35 hover:bg-cyan-400/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45",
                      isSelected && "border-cyan-300/70 bg-cyan-400/[0.12]",
                      isHighlighted && !isSelected && "border-cyan-300/35 bg-white/[0.035]",
                    )}
                    id={`home-counter-option-${champion.id}`}
                    key={champion.id}
                    onClick={() => handleChampionSelect(champion)}
                    onMouseEnter={() => setHighlightedChampionId(champion.id)}
                    role="option"
                    type="button"
                  >
                    <Image
                      alt={`${champion.name} champion icon`}
                      className="size-10 border border-cyan-100/15 bg-[#0b1220] object-cover"
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
              <p className="border border-cyan-100/10 bg-white/[0.035] p-4 text-center text-sm text-zinc-400">
                No champions match that search.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Most popular picks
        </p>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:rgba(103,232,249,0.45)_transparent] lg:grid lg:grid-cols-9 lg:overflow-visible lg:pb-0">
          {popularChampions.slice(0, 9).map((champion) => {
            const isSelected = selectedChampion?.id === champion.id;

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "group w-14 shrink-0 text-center text-xs text-zinc-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55",
                  isSelected && "text-cyan-100",
                )}
                key={champion.id}
                onClick={() => handleChampionSelect(champion)}
                type="button"
              >
                <span
                  className={cn(
                    "block size-14 border border-cyan-100/20 bg-[#06111f] p-0.5 transition group-hover:border-cyan-300/70 group-hover:bg-cyan-400/10",
                    isSelected && "border-cyan-300 bg-cyan-400/10",
                  )}
                >
                  <Image
                    alt={`${champion.name} champion icon`}
                    className="size-full object-cover"
                    height={48}
                    src={getChampionIconPath(champion)}
                    unoptimized
                    width={48}
                  />
                </span>
                <span className="mt-2 block truncate">{champion.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
