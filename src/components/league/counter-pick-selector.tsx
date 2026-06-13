"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Lightbulb,
  Search,
  Swords,
  Target,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { BackButton } from "@/src/components/back-button";
import {
  fetchReviewedCounterPicksByChampionAndRole,
  type LeagueCounterPick,
} from "@/src/features/league/counter-picks";
import {
  getChampionRoles,
  isChampionInRole,
  sortChampionsForRole,
} from "@/src/features/league/champion-roles";
import {
  getChampionSplashUrl,
  getChampionIconPath,
  slugifyChampionName,
  type LeagueChampion,
} from "@/src/features/league/champions";
import {
  getChampionCombatProfile,
  type LeagueChampionCounterRelationship,
} from "@/src/features/league/champion-knowledge";
import { getLeagueMatchupHref } from "@/src/features/league/matchup-routes";
import { getLeagueRoleLabel, type LeagueRole } from "@/src/features/league/roles";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";

type CounterPickSelectorProps = {
  champions: LeagueChampion[];
};

type CounterDirection = "best-counter" | "countered-by";
type CounterPrepSectionKey = "ad-heavy" | "alternative-build" | "build" | "guide" | "lane" | "why";

type CounterMatchupStats = {
  delta: number | null;
  games: number | null;
  winRate: number | null;
};

type CounterRowModel = {
  champion: LeagueChampion | null;
  direction: CounterDirection;
  fallbackName: string;
  guideKey: string | null;
  href: string | null;
  key: string;
  matchupHref: string | null;
  matchupLabel: string;
  reasons: string[];
  roleLabel: string;
  stats: CounterMatchupStats;
};

type CounterPrepSectionItem = {
  content: ReactNode;
  key: CounterPrepSectionKey;
  title: string;
};

type ReviewedCounterPickState = {
  counterPicks: LeagueCounterPick[];
  error: string | null;
};

type GuideAvailabilityState = {
  reviewedGuideKeys: Set<string>;
};

const pendingStats: CounterMatchupStats = {
  delta: null,
  games: null,
  winRate: null,
};

const emptyReviewedCounterPickState: ReviewedCounterPickState = {
  counterPicks: [],
  error: null,
};

const emptyGuideAvailabilityState: GuideAvailabilityState = {
  reviewedGuideKeys: new Set(),
};

const emptyCounterRelationships: readonly LeagueChampionCounterRelationship[] = [];

const roleOptions = [
  { iconSrc: "/images/Top_icon.png", label: "Top", value: "top" },
  { iconSrc: "/images/Jungle_icon.png", label: "Jungle", value: "jungle" },
  { iconSrc: "/images/Middle_icon.png", label: "Mid", value: "mid" },
  { iconSrc: "/images/Bottom_icon.png", label: "Bot / ADC", value: "adc" },
  { iconSrc: "/images/Support_icon.png", label: "Support", value: "support" },
] as const satisfies ReadonlyArray<{
  iconSrc: string;
  label: string;
  value: LeagueRole;
}>;

export function CounterPickSelector({ champions }: CounterPickSelectorProps) {
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(
    () =>
      champions.find((champion) => normalizeChampionLookupKey(champion.id) === "ahri")?.id ??
      champions.find((champion) => isChampionInRole(champion, "mid"))?.id ??
      champions[0]?.id ??
      null,
  );
  const [selectedRole, setSelectedRole] = useState<LeagueRole>("mid");
  const [selectorQuery, setSelectorQuery] = useState("");
  const [selectorRole, setSelectorRole] = useState<LeagueRole>("mid");
  const [includeOffMeta, setIncludeOffMeta] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedCounterKey, setSelectedCounterKey] = useState<string | null>(null);
  const [openPrepSections, setOpenPrepSections] = useState<CounterPrepSectionKey[]>(["why"]);
  const [reviewedCounterPickState, setReviewedCounterPickState] =
    useState<ReviewedCounterPickState>(emptyReviewedCounterPickState);
  const [guideAvailabilityState, setGuideAvailabilityState] = useState<GuideAvailabilityState>(
    emptyGuideAvailabilityState,
  );

  const championsByLookupKey = useMemo(() => buildChampionLookup(champions), [champions]);
  const selectedChampion =
    champions.find((champion) => champion.id === selectedChampionId) ?? null;
  const selectedProfile = selectedChampion
    ? getChampionCombatProfile(selectedChampion.id) ??
      getChampionCombatProfile(selectedChampion.name)
    : null;
  const selectedChampionRoles = selectedChampion ? getChampionRoles(selectedChampion) : [];
  const primaryRole =
    selectedChampionRoles.find((role) => role === selectedRole) ??
    selectedChampionRoles[0] ??
    selectedRole;
  const selectableChampions = useMemo(() => {
    const normalizedQuery = selectorQuery.trim().toLowerCase();

    if (normalizedQuery) {
      return champions.filter((champion) =>
        [champion.name, champion.title, champion.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      );
    }

    return sortChampionsForRole(
      champions.filter((champion) =>
        isChampionInRole(champion, selectorRole, { includeOffMeta }),
      ),
      selectorRole,
    );
  }, [champions, includeOffMeta, selectorQuery, selectorRole]);
  const bestCounterRelationships = selectedProfile?.counteredBy ?? emptyCounterRelationships;
  const counteredByRelationships = selectedProfile?.counters ?? emptyCounterRelationships;
  const combatRelationshipsByChampion = useMemo(
    () =>
      buildCombatRelationshipLookup([
        ...bestCounterRelationships,
        ...counteredByRelationships,
      ]),
    [bestCounterRelationships, counteredByRelationships],
  );
  const reviewedCounterPicks = reviewedCounterPickState.counterPicks;
  const hasRoleSpecificBestCounterPicks = reviewedCounterPicks.some(
    (counterPick) => counterPick.counter_type === "best_counter",
  );
  const hasRoleSpecificCounteredByPicks = reviewedCounterPicks.some(
    (counterPick) => counterPick.counter_type === "countered_by",
  );
  const bestCounterRows = useMemo(
    () => {
      if (hasRoleSpecificBestCounterPicks) {
        return buildCounterRowsFromCounterPicks({
          championsByLookupKey,
          combatRelationshipsByChampion,
          counterPicks: reviewedCounterPicks,
          direction: "best-counter",
          reviewedGuideKeys: guideAvailabilityState.reviewedGuideKeys,
          selectedChampion,
        });
      }

      return buildCounterRowsFromRelationships({
        championsByLookupKey,
        direction: "best-counter",
        relationships: bestCounterRelationships,
        reviewedGuideKeys: guideAvailabilityState.reviewedGuideKeys,
        role: selectedRole,
        selectedChampion,
      });
    },
    [
      bestCounterRelationships,
      championsByLookupKey,
      combatRelationshipsByChampion,
      guideAvailabilityState.reviewedGuideKeys,
      hasRoleSpecificBestCounterPicks,
      reviewedCounterPicks,
      selectedChampion,
      selectedRole,
    ],
  );
  const counteredByRows = useMemo(
    () => {
      if (hasRoleSpecificCounteredByPicks) {
        return buildCounterRowsFromCounterPicks({
          championsByLookupKey,
          combatRelationshipsByChampion,
          counterPicks: reviewedCounterPicks,
          direction: "countered-by",
          reviewedGuideKeys: guideAvailabilityState.reviewedGuideKeys,
          selectedChampion,
        });
      }

      return buildCounterRowsFromRelationships({
        championsByLookupKey,
        direction: "countered-by",
        relationships: counteredByRelationships,
        reviewedGuideKeys: guideAvailabilityState.reviewedGuideKeys,
        role: selectedRole,
        selectedChampion,
      });
    },
    [
      championsByLookupKey,
      combatRelationshipsByChampion,
      counteredByRelationships,
      guideAvailabilityState.reviewedGuideKeys,
      hasRoleSpecificCounteredByPicks,
      reviewedCounterPicks,
      selectedChampion,
      selectedRole,
    ],
  );
  const allCounterRows = useMemo(
    () => [...bestCounterRows, ...counteredByRows],
    [bestCounterRows, counteredByRows],
  );
  const guideAvailabilityRequestKey = useMemo(
    () =>
      allCounterRows
        .map((row) => row.guideKey)
        .filter((guideKey): guideKey is string => Boolean(guideKey))
        .sort()
        .join("|"),
    [allCounterRows],
  );
  const selectedCounter =
    allCounterRows.find((counter) => counter.key === selectedCounterKey) ??
    allCounterRows[0] ??
    null;

  useEffect(() => {
    let isMounted = true;

    async function loadReviewedCounterPicks() {
      await Promise.resolve();

      if (!selectedChampion) {
        if (isMounted) {
          setReviewedCounterPickState(emptyReviewedCounterPickState);
        }
        return;
      }

      const result = await fetchReviewedCounterPicksByChampionAndRole({
        championId: selectedChampion.id,
        role: selectedRole,
      });

      if (!isMounted) {
        return;
      }

      setReviewedCounterPickState({
        counterPicks: result.counterPicks,
        error: result.error,
      });
      setSelectedCounterKey(null);
    }

    void loadReviewedCounterPicks();

    return () => {
      isMounted = false;
    };
  }, [selectedChampion, selectedRole]);

  useEffect(() => {
    let isMounted = true;

    async function loadGuideAvailability() {
      await Promise.resolve();

      if (!guideAvailabilityRequestKey) {
        if (isMounted) {
          setGuideAvailabilityState(emptyGuideAvailabilityState);
        }
        return;
      }

      const requestedGuideKeys = guideAvailabilityRequestKey.split("|").filter(Boolean);
      const reviewedGuideKeys = await fetchReviewedGuideKeys(requestedGuideKeys);

      if (!isMounted) {
        return;
      }

      setGuideAvailabilityState({
        reviewedGuideKeys,
      });
    }

    void loadGuideAvailability();

    return () => {
      isMounted = false;
    };
  }, [guideAvailabilityRequestKey]);

  function handleChampionSelect(champion: LeagueChampion) {
    setSelectedChampionId(champion.id);
    setSelectorQuery("");
    setSelectedCounterKey(null);
    setOpenPrepSections(["why"]);
    setIsSelectorOpen(false);
  }

  function handleRoleChange(role: LeagueRole) {
    setSelectedRole(role);
    setSelectorRole(role);
    setSelectedCounterKey(null);
    setOpenPrepSections(["why"]);
  }

  function handleCounterSelect(counterKey: string) {
    setSelectedCounterKey(counterKey);
    setOpenPrepSections(["why"]);
  }

  function handlePrepSectionToggle(section: CounterPrepSectionKey) {
    setOpenPrepSections((currentSections) =>
      currentSections.includes(section)
        ? currentSections.filter((currentSection) => currentSection !== section)
        : [...currentSections, section],
    );
  }

  return (
    <section className="grid gap-8">
      <ChampionHero
        champion={selectedChampion}
        onOpenSelector={() => setIsSelectorOpen(true)}
        onRoleChange={handleRoleChange}
        primaryRole={primaryRole}
        selectedRole={selectedRole}
      />

      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        {!selectedChampion ? (
          <EmptyState
            title="Choose a champion"
            text="Select a champion and role to start building the counter-pick picture."
          />
        ) : !selectedProfile ? (
          <EmptyState
            title="No combat profile yet"
            text={`${selectedChampion.name} does not have counter notes in the combat profile yet.`}
          />
        ) : bestCounterRows.length === 0 && counteredByRows.length === 0 ? (
          <EmptyState
            title="No counter data yet"
            text={`Counter relationships for ${selectedChampion.name} are still being reviewed.`}
          />
        ) : (
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="grid min-w-0 gap-10">
              <CounterMatchupList
                emptyText={`No champions are listed as counters into ${selectedChampion.name} yet.`}
                onSelect={handleCounterSelect}
                rows={bestCounterRows}
                selectedKey={selectedCounter?.key ?? null}
                subtitle={`Champions that perform well into ${selectedChampion.name}`}
                title="Best Counters"
              />
              <CounterMatchupList
                emptyText={`No risky picks into ${selectedChampion.name} are listed yet.`}
                onSelect={handleCounterSelect}
                rows={counteredByRows}
                selectedKey={selectedCounter?.key ?? null}
                subtitle={`Champions that struggle when picked into ${selectedChampion.name}`}
                title={`Bad Into ${selectedChampion.name}`}
              />
              <CounterPreparationSection
                onSectionToggle={handlePrepSectionToggle}
                openSections={openPrepSections}
                selectedChampion={selectedChampion}
                selectedCounter={selectedCounter}
              />
              <CounterPickTip champion={selectedChampion} />
            </div>

            <div className="xl:sticky xl:top-6 xl:self-start">
              <CounterAnalysisPanel
                counter={selectedCounter}
                selectedChampion={selectedChampion}
              />
            </div>
          </div>
        )}
      </div>

      {isSelectorOpen ? (
        <ChampionSelectorOverlay
          champions={selectableChampions}
          includeOffMeta={includeOffMeta}
          onChampionSelect={handleChampionSelect}
          onClose={() => setIsSelectorOpen(false)}
          onIncludeOffMetaChange={setIncludeOffMeta}
          onQueryChange={setSelectorQuery}
          onRoleChange={setSelectorRole}
          query={selectorQuery}
          selectedChampionId={selectedChampionId}
          selectedRole={selectorRole}
        />
      ) : null}
    </section>
  );
}

function ChampionHero({
  champion,
  onOpenSelector,
  onRoleChange,
  primaryRole,
  selectedRole,
}: {
  champion: LeagueChampion | null;
  onOpenSelector: () => void;
  onRoleChange: (role: LeagueRole) => void;
  primaryRole: LeagueRole;
  selectedRole: LeagueRole;
}) {
  return (
    <section className="relative min-h-[420px] overflow-hidden border-b border-white/10 bg-[#07101f] sm:min-h-[480px]">
      {champion ? (
        <Image
          alt=""
          className="object-cover opacity-[0.86]"
          fill
          priority
          sizes="(min-width: 1024px) 80vw, 100vw"
          src={getChampionSplashUrl(champion)}
          style={{ objectPosition: "center 30%" }}
          unoptimized
        />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050b18_0%,rgba(5,11,24,0.78)_28%,rgba(5,11,24,0.28)_66%,rgba(5,11,24,0.66)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_34%_45%,rgba(34,211,238,0.12),transparent_22rem),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.1),transparent_30rem)]" />

      <div className="absolute left-4 top-5 z-20 sm:left-6 lg:left-8">
        <BackButton
          className="rounded border-white/10 bg-[#10182b]/70 shadow-black/20 backdrop-blur"
          href="/"
          label="Back to LaneStomp"
        />
      </div>

      <div className="relative z-10 flex min-h-[420px] flex-col justify-end gap-7 px-4 py-8 sm:min-h-[480px] sm:px-6 lg:px-8">
        <div className="flex max-w-4xl flex-col gap-5 sm:flex-row sm:items-end sm:gap-7">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-md border border-amber-300/65 bg-black/35 shadow-2xl shadow-black/40 ring-1 ring-white/15 sm:size-32">
            {champion ? (
              <Image
                alt=""
                aria-hidden="true"
                className="object-cover"
                fill
                sizes="128px"
                src={getChampionIconPath(champion)}
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-cyan-100">
                <Target className="size-10" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="min-w-0 pb-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200/85">
              Counter Pick
            </p>
            <h1 className="mt-2 font-mono text-5xl font-semibold uppercase tracking-normal text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)] sm:text-6xl">
              {champion?.name ?? "Counter Picks"}
            </h1>
            <p className="mt-2 text-2xl font-semibold text-zinc-100 sm:text-3xl">
              {champion?.title ?? "Choose a champion"}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <RolePill label={getLeagueRoleLabel(primaryRole)} tone="cyan" />
              <RolePill label={getLeagueRoleLabel(selectedRole)} tone="zinc" />
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-zinc-200 sm:text-base sm:leading-7">
              {champion
                ? `Find the best champions to counter ${champion.name}, understand why they work, and open detailed matchup guides.`
                : "Select a champion and role to reveal LaneStomp counter explanations and matchup guide links."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            className="h-11 rounded-md border border-cyan-300/25 bg-cyan-400/10 px-4 text-cyan-100 hover:bg-cyan-400/15"
            onClick={onOpenSelector}
            type="button"
            variant="ghost"
          >
            Change Champion
            <Search className="size-4" aria-hidden="true" />
          </Button>
          <div className="flex gap-2">
            {roleOptions.map((option) => (
              <button
                aria-label={`${option.label} role`}
                aria-pressed={selectedRole === option.value}
                className={cn(
                  "flex size-11 items-center justify-center rounded-md border border-white/10 bg-black/30 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.08]",
                  selectedRole === option.value &&
                    "border-cyan-300/55 bg-cyan-400/15 ring-1 ring-cyan-300/25",
                )}
                key={option.value}
                onClick={() => onRoleChange(option.value)}
                title={option.label}
                type="button"
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-6 object-contain"
                  height={24}
                  src={option.iconSrc}
                  width={24}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CounterMatchupList({
  emptyText,
  onSelect,
  rows,
  selectedKey,
  subtitle,
  title,
}: {
  emptyText: string;
  onSelect: (key: string) => void;
  rows: CounterRowModel[];
  selectedKey: string | null;
  subtitle: string;
  title: string;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <h2 className="font-mono text-2xl font-semibold uppercase tracking-normal text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
        </div>
        <span className="font-mono text-sm text-cyan-200">{rows.length}</span>
      </div>

      {rows.length > 0 ? (
        <div className="divide-y divide-white/10 border-y border-white/10">
          <div className="hidden grid-cols-[3.75rem_minmax(0,1fr)_6rem_6.5rem_5.5rem_2rem] items-center gap-4 border-b border-white/10 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:grid">
            <span />
            <span>Champion</span>
            <span>Win Rate</span>
            <span>Games</span>
            <span>Delta</span>
            <span />
          </div>
          {rows.map((row) => (
            <CounterMatchupRow
              isSelected={row.key === selectedKey}
              key={row.key}
              onSelect={() => onSelect(row.key)}
              row={row}
            />
          ))}
        </div>
      ) : (
        <div className="border-y border-dashed border-white/10 py-8 text-sm leading-6 text-zinc-400">
          {emptyText}
        </div>
      )}
    </section>
  );
}

function CounterMatchupRow({
  isSelected,
  onSelect,
  row,
}: {
  isSelected: boolean;
  onSelect: () => void;
  row: CounterRowModel;
}) {
  const championName = row.champion?.name ?? row.fallbackName;

  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "group grid w-full grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-4 py-4 text-left transition hover:bg-cyan-400/[0.045] sm:grid-cols-[3.75rem_minmax(0,1fr)_6rem_6.5rem_5.5rem_2rem]",
        isSelected && "bg-cyan-400/[0.07] shadow-[inset_3px_0_0_rgba(34,211,238,0.75)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="relative ml-1 size-14 overflow-hidden rounded-md border border-white/10 bg-black/30">
        {row.champion ? (
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover transition duration-200 group-hover:scale-105"
            fill
            sizes="56px"
            src={getChampionIconPath(row.champion)}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-cyan-100">
            <Swords className="size-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-white">{championName}</h3>
        <p className="mt-1 truncate text-sm text-zinc-400">{row.roleLabel}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:hidden">
          <MobileRowStat label="Win" value={formatWinRate(row.stats.winRate)} />
          <MobileRowStat label="Games" value={formatGames(row.stats.games)} />
          <MobileRowStat label="Delta" value={formatDelta(row.stats.delta)} />
        </div>
      </div>

      <div className="hidden text-sm sm:block">
        <p className="font-semibold text-cyan-200">{formatWinRate(row.stats.winRate)}</p>
        <p className="mt-1 text-xs text-zinc-500">Win Rate</p>
      </div>

      <div className="hidden text-sm sm:block">
        <p className="font-semibold text-zinc-200">{formatGames(row.stats.games)}</p>
        <p className="mt-1 text-xs text-zinc-500">Games</p>
      </div>

      <div className="hidden text-sm sm:block">
        <p className="font-semibold text-zinc-200">{formatDelta(row.stats.delta)}</p>
        <p className="mt-1 text-xs text-zinc-500">Delta</p>
      </div>

      <ChevronRight
        className={cn(
          "hidden size-5 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-200 sm:block",
          isSelected && "text-cyan-200",
        )}
        aria-hidden="true"
      />
    </button>
  );
}

function CounterAnalysisPanel({
  counter,
  selectedChampion,
}: {
  counter: CounterRowModel | null;
  selectedChampion: LeagueChampion | null;
}) {
  if (!selectedChampion || !counter) {
    return (
      <aside className="border-y border-white/10 py-8 text-sm text-zinc-400">
        Select a counter to read the LaneStomp analysis.
      </aside>
    );
  }

  const counterName = counter.champion?.name ?? counter.fallbackName;
  const matchupTitle = `${counterName} into ${selectedChampion.name}`;
  const quickSummary = counter.reasons[0] ?? "Matchup summary is still being reviewed.";

  return (
    <aside className="overflow-hidden border border-white/10 bg-[#07101f]/90 shadow-2xl shadow-black/25">
      <div className="relative min-h-56 border-b border-white/10 p-5">
        {counter.champion ? (
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover opacity-[0.48]"
            fill
            sizes="384px"
            src={getChampionSplashUrl(counter.champion)}
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07101f_0%,rgba(7,16,31,0.7)_58%,rgba(7,16,31,0.48)_100%)]" />
        <div className="relative z-10 flex min-h-[11.5rem] flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                Selected Counter
              </p>
              <h2 className="mt-2 text-2xl font-semibold uppercase tracking-normal text-white">
                {matchupTitle}
              </h2>
              <p className="mt-1 text-sm text-zinc-300">{counter.roleLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-cyan-100">
                {formatWinRate(counter.stats.winRate)}
              </p>
              <p className="mt-1 text-xs text-zinc-400">Win Rate</p>
            </div>
          </div>

          <div className="flex min-w-0 items-end gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-amber-300/40 bg-black/35 shadow-lg shadow-black/25">
              {counter.champion ? (
                <Image
                  alt=""
                  aria-hidden="true"
                  className="object-cover"
                  fill
                  sizes="64px"
                  src={getChampionIconPath(counter.champion)}
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-cyan-100">
                  <Swords className="size-6" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Counter Champion</p>
              <h3 className="mt-1 truncate text-xl font-semibold uppercase tracking-normal text-white">
                {counterName}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-3">
          <PanelStat label="Games" value={formatGames(counter.stats.games)} />
          <PanelStat label="Delta" value={formatDelta(counter.stats.delta)} />
          <PanelStat label="Guide" value={counter.href ? "Ready" : "Soon"} />
        </div>

        <div className="mt-5 border-y border-white/10 py-4">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-200/80">
            Quick matchup summary
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{quickSummary}</p>
        </div>

        {counter.href ? (
          <Button
            asChild
            className="mt-5 h-12 w-full rounded-md bg-cyan-200 font-semibold text-[#04111f] shadow-lg shadow-cyan-950/30 hover:bg-cyan-100"
          >
            <Link href={counter.href}>
              Open Matchup Guide
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <div className="mt-5 border-y border-white/10 py-3 text-center text-sm text-zinc-400">
            Guide coming soon
          </div>
        )}
      </div>
    </aside>
  );
}

function CounterPreparationSection({
  onSectionToggle,
  openSections,
  selectedChampion,
  selectedCounter,
}: {
  onSectionToggle: (section: CounterPrepSectionKey) => void;
  openSections: CounterPrepSectionKey[];
  selectedChampion: LeagueChampion;
  selectedCounter: CounterRowModel | null;
}) {
  if (!selectedCounter) {
    return (
      <section className="border-y border-white/10 py-8">
        <h2 className="font-mono text-2xl font-semibold uppercase tracking-normal text-white">
          Counter Preparation
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Select a counter to explore deeper matchup preparation.
        </p>
      </section>
    );
  }

  const counterName = selectedCounter.champion?.name ?? selectedCounter.fallbackName;
  const counterProfile = selectedCounter.champion
    ? getChampionCombatProfile(selectedCounter.champion.id) ??
      getChampionCombatProfile(selectedCounter.champion.name)
    : null;
  const lanePrepNotes = getLanePrepNotes(counterProfile);
  const sectionItems: CounterPrepSectionItem[] = [
    {
      content: <PrepBulletList items={selectedCounter.reasons} />,
      key: "why",
      title:
        selectedCounter.direction === "best-counter"
          ? `Why ${counterName} Works Into ${selectedChampion.name}`
          : `Why ${counterName} Struggles Into ${selectedChampion.name}`,
    },
    {
      content: <PrepBulletList items={lanePrepNotes} />,
      key: "lane",
      title: `How ${counterName} Should Play the Lane`,
    },
    {
      content: <PrepPlaceholder />,
      key: "build",
      title: "Common Build Path",
    },
    {
      content: <PrepPlaceholder />,
      key: "alternative-build",
      title: "Alternative Build Path",
    },
    {
      content: <PrepPlaceholder />,
      key: "ad-heavy",
      title: "If Enemy Team Is AD Heavy",
    },
    {
      content: selectedCounter.href ? (
        <Button
          asChild
          className="h-12 rounded-md bg-cyan-200 px-5 font-semibold text-[#04111f] shadow-lg shadow-cyan-950/30 hover:bg-cyan-100"
        >
          <Link href={selectedCounter.href}>
            Open Full Matchup Guide
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : (
        <div className="border-y border-white/10 py-4 text-sm leading-6 text-zinc-400">
          Guide coming soon
        </div>
      ),
      key: "guide",
      title: "Full Matchup Guide",
    },
  ];

  return (
    <section className="border-y border-white/10 py-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Selected Counter: {counterName}
          </p>
          <h2 className="mt-2 font-mono text-2xl font-semibold uppercase tracking-normal text-white">
            Counter Preparation
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-zinc-400">
          Open the sections you need to study the matchup without leaving the counter list.
        </p>
      </div>

      <div className="divide-y divide-white/10 border-y border-white/10">
        {sectionItems.map((item) => (
          <CounterPrepAccordionItem
            isOpen={openSections.includes(item.key)}
            item={item}
            key={item.key}
            onOpenChange={() => onSectionToggle(item.key)}
          />
        ))}
      </div>
    </section>
  );
}

function ChampionSelectorOverlay({
  champions,
  includeOffMeta,
  onChampionSelect,
  onClose,
  onIncludeOffMetaChange,
  onQueryChange,
  onRoleChange,
  query,
  selectedChampionId,
  selectedRole,
}: {
  champions: LeagueChampion[];
  includeOffMeta: boolean;
  onChampionSelect: (champion: LeagueChampion) => void;
  onClose: () => void;
  onIncludeOffMetaChange: (value: boolean) => void;
  onQueryChange: (value: string) => void;
  onRoleChange: (role: LeagueRole) => void;
  query: string;
  selectedChampionId: string | null;
  selectedRole: LeagueRole;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="ml-auto flex h-full w-full max-w-3xl flex-col border-l border-white/10 bg-[#07101f] shadow-2xl shadow-black">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
          <div>
            <h2 className="font-mono text-xl font-semibold uppercase tracking-normal text-white">
              Change Champion
            </h2>
            <p className="mt-1 text-sm text-zinc-400">Search and filter without taking over the page.</p>
          </div>
          <button
            aria-label="Close champion selector"
            className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/10 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-3 border-b border-white/10 p-4">
          <label className="relative block">
            <span className="sr-only">Search champions</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <Input
              autoFocus
              className="h-11 rounded-md border-white/10 bg-black/30 pl-10 pr-4 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-cyan-300/60 focus-visible:ring-cyan-300/20"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search champions..."
              type="search"
              value={query}
            />
          </label>

          <RoleSelector selectedRole={selectedRole} onChange={onRoleChange} />

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              checked={includeOffMeta}
              className="size-4 accent-cyan-400"
              onChange={(event) => onIncludeOffMetaChange(event.target.checked)}
              type="checkbox"
            />
            Include off-meta picks
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {champions.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(4.75rem,1fr))] gap-2">
              {champions.map((champion) => (
                <ChampionTile
                  champion={champion}
                  isSelected={champion.id === selectedChampionId}
                  key={champion.id}
                  onClick={() => onChampionSelect(champion)}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="No champions found" text="Try another search or role filter." />
          )}
        </div>
      </div>
    </div>
  );
}

function RoleSelector({
  onChange,
  selectedRole,
}: {
  onChange: (role: LeagueRole) => void;
  selectedRole: LeagueRole;
}) {
  return (
    <div aria-label="Role filter" className="flex flex-wrap gap-2" role="radiogroup">
      {roleOptions.map((option) => {
        const isActive = selectedRole === option.value;

        return (
          <button
            aria-checked={isActive}
            aria-label={`${option.label} role`}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-md border border-white/10 bg-black/25 px-2 text-zinc-500 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.07] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
              isActive &&
                "border-cyan-300/55 bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/25",
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            title={option.label}
            type="button"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="size-6 object-contain"
              height={24}
              src={option.iconSrc}
              width={24}
            />
          </button>
        );
      })}
    </div>
  );
}

function ChampionTile({
  champion,
  isSelected,
  onClick,
}: {
  champion: LeagueChampion;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`Select ${champion.name}`}
      aria-pressed={isSelected}
      className={cn(
        "group relative aspect-square min-w-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.035] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50",
        isSelected && "border-cyan-300/80 ring-2 ring-cyan-300/30",
      )}
      onClick={onClick}
      title={champion.name}
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="bg-[#0b1220] object-cover transition duration-200 group-hover:scale-105"
        fill
        sizes="80px"
        src={getChampionIconPath(champion)}
        unoptimized
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
      <span className="absolute bottom-1 left-1 right-1 truncate rounded bg-black/70 px-1.5 py-0.5 text-[0.65rem] font-medium text-white opacity-0 transition group-hover:opacity-100">
        {champion.name}
      </span>
    </button>
  );
}

function CounterPickTip({ champion }: { champion: LeagueChampion }) {
  return (
    <section className="relative overflow-hidden border-y border-white/10 py-5">
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-amber-300/25 bg-amber-400/10 text-amber-100">
          <Lightbulb className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.16em] text-amber-200">
            Counter Pick Tip
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-400">
            Counter picking {champion.name} gives you a draft edge, but wave control, cooldown
            tracking, jungle pressure, and team composition still decide how the matchup plays.
          </p>
        </div>
      </div>
    </section>
  );
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 text-center">
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-[0.65rem] uppercase tracking-[0.12em] text-zinc-500">{label}</p>
    </div>
  );
}

function MobileRowStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="min-w-0 border-l border-white/10 pl-2 first:border-l-0 first:pl-0">
      <span className="block truncate font-semibold text-zinc-200">{value}</span>
      <span className="mt-0.5 block text-[0.65rem] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </span>
    </span>
  );
}

function CounterPrepAccordionItem({
  isOpen,
  item,
  onOpenChange,
}: {
  isOpen: boolean;
  item: CounterPrepSectionItem;
  onOpenChange: () => void;
}) {
  return (
    <div className="py-1">
      <button
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        onClick={onOpenChange}
        type="button"
      >
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {item.title}
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-cyan-200 transition", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5">{item.content}</div>
        </div>
      </div>
    </div>
  );
}

function PrepBulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <PrepPlaceholder />;
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li className="flex gap-3 text-sm leading-6 text-zinc-300" key={item}>
          <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-amber-300/25 bg-amber-400/10 text-amber-100">
            <Crosshair className="size-3.5" aria-hidden="true" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PrepPlaceholder() {
  return (
    <p className="border-y border-dashed border-white/10 py-4 text-sm leading-6 text-zinc-400">
      Detailed preparation coming soon.
    </p>
  );
}

function getLanePrepNotes(profile: ReturnType<typeof getChampionCombatProfile>) {
  const notes: string[] = [];

  if (!profile) {
    return notes;
  }

  if (profile.lanePlan?.idealLaneState) {
    notes.push(profile.lanePlan.idealLaneState);
  }

  for (const want of profile.lanePlan?.wants.slice(0, 2) ?? []) {
    notes.push(want);
  }

  if (profile.primaryTradingPattern) {
    notes.push(profile.primaryTradingPattern);
  }

  if (profile.trading?.primaryPattern) {
    notes.push(profile.trading.primaryPattern);
  }

  for (const condition of profile.trading?.goodTradeConditions.slice(0, 2) ?? []) {
    notes.push(condition);
  }

  return notes.slice(0, 5);
}

function RolePill({ label, tone }: { label: string; tone: "cyan" | "zinc" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
        tone === "cyan"
          ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
          : "border-white/10 bg-white/[0.05] text-zinc-300",
      )}
    >
      {label}
    </span>
  );
}

function EmptyState({ text, title }: { text: string; title: string }) {
  return (
    <div className="border-y border-dashed border-white/10 py-12 text-center">
      <h2 className="font-mono text-2xl font-semibold uppercase tracking-normal text-white">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">{text}</p>
    </div>
  );
}

function buildCounterRowsFromRelationships({
  championsByLookupKey,
  direction,
  relationships,
  reviewedGuideKeys,
  role,
  selectedChampion,
}: {
  championsByLookupKey: Map<string, LeagueChampion>;
  direction: CounterDirection;
  relationships?: readonly LeagueChampionCounterRelationship[];
  reviewedGuideKeys: Set<string>;
  role: LeagueRole;
  selectedChampion: LeagueChampion | null;
}) {
  if (!selectedChampion || !relationships?.length) {
    return [];
  }

  return relationships.map((relationship) => {
    const champion = resolveChampion(championsByLookupKey, relationship.champion);
    const championName = champion?.name ?? relationship.champion;
    const championRoles = champion ? getChampionRoles(champion) : [];
    const roleLabel =
      championRoles.length > 0
        ? championRoles.map(getLeagueRoleLabel).join(", ")
        : getLeagueRoleLabel(role);
    const championA = champion;
    const championB = selectedChampion;
    const matchupHref =
      championA && championB
        ? getLeagueMatchupHref({
            championA,
            championB,
            role,
          })
        : null;
    const guideKey = championA && championB ? getMatchupGuideKey(championA, championB, role) : null;
    const href = guideKey && reviewedGuideKeys.has(guideKey) ? matchupHref : null;
    const matchupLabel = `${championName} vs ${selectedChampion.name}`;

    return {
      champion,
      direction,
      fallbackName: relationship.champion,
      guideKey,
      href,
      key: `${direction}-${normalizeChampionLookupKey(relationship.champion)}`,
      matchupHref,
      matchupLabel,
      reasons: [...relationship.reasons],
      roleLabel,
      stats: pendingStats,
    } satisfies CounterRowModel;
  });
}

function buildCounterRowsFromCounterPicks({
  championsByLookupKey,
  combatRelationshipsByChampion,
  counterPicks,
  direction,
  reviewedGuideKeys,
  selectedChampion,
}: {
  championsByLookupKey: Map<string, LeagueChampion>;
  combatRelationshipsByChampion: Map<string, LeagueChampionCounterRelationship>;
  counterPicks: LeagueCounterPick[];
  direction: CounterDirection;
  reviewedGuideKeys: Set<string>;
  selectedChampion: LeagueChampion | null;
}) {
  if (!selectedChampion) {
    return [];
  }

  const counterType = direction === "best-counter" ? "best_counter" : "countered_by";

  return counterPicks
    .filter((counterPick) => counterPick.counter_type === counterType)
    .map((counterPick) => {
      const champion = resolveChampion(championsByLookupKey, counterPick.counter_champion_id);
      const championName = champion?.name ?? counterPick.counter_champion_id;
      const combatRelationship = combatRelationshipsByChampion.get(
        normalizeChampionLookupKey(counterPick.counter_champion_id),
      );
      const championA = champion;
      const championB = selectedChampion;
      const matchupHref =
        championA && championB
          ? getLeagueMatchupHref({
              championA,
              championB,
              role: counterPick.role,
            })
          : null;
      const guideKey =
        championA && championB ? getMatchupGuideKey(championA, championB, counterPick.role) : null;
      const href = guideKey && reviewedGuideKeys.has(guideKey) ? matchupHref : null;
      const matchupLabel = `${championName} vs ${selectedChampion.name}`;

      return {
        champion,
        direction,
        fallbackName: championName,
        guideKey,
        href,
        key: `${direction}-${normalizeChampionLookupKey(counterPick.counter_champion_id)}-${counterPick.id}`,
        matchupHref,
        matchupLabel,
        reasons: combatRelationship ? [...combatRelationship.reasons] : [],
        roleLabel: getLeagueRoleLabel(counterPick.role),
        stats: {
          delta: null,
          games: counterPick.games,
          winRate: counterPick.win_rate,
        },
      } satisfies CounterRowModel;
    });
}

function buildCombatRelationshipLookup(relationships: readonly LeagueChampionCounterRelationship[]) {
  const lookup = new Map<string, LeagueChampionCounterRelationship>();

  for (const relationship of relationships) {
    lookup.set(normalizeChampionLookupKey(relationship.champion), relationship);
  }

  return lookup;
}

async function fetchReviewedGuideKeys(requestedGuideKeys: string[]) {
  if (!supabase || requestedGuideKeys.length === 0) {
    return new Set<string>();
  }

  const uniqueGuideKeys = Array.from(new Set(requestedGuideKeys));
  const matchupRequests = uniqueGuideKeys.map(parseMatchupGuideKey);
  const championAIds = Array.from(new Set(matchupRequests.map((request) => request.championAId)));
  const championBIds = Array.from(new Set(matchupRequests.map((request) => request.championBId)));
  const roles = Array.from(new Set(matchupRequests.map((request) => request.role)));

  const { data, error } = await supabase
    .from("league_matchups")
    .select("champion_a_id, champion_b_id, role")
    .in("champion_a_id", championAIds)
    .in("champion_b_id", championBIds)
    .in("role", roles)
    .eq("generation_status", "reviewed");

  if (error || !data) {
    return new Set<string>();
  }

  const requestedGuideKeySet = new Set(uniqueGuideKeys);
  const reviewedGuideKeys = new Set<string>();

  for (const matchup of data) {
    const guideKey = getMatchupGuideKeyFromIds(
      String(matchup.champion_a_id),
      String(matchup.champion_b_id),
      matchup.role as LeagueRole,
    );

    if (requestedGuideKeySet.has(guideKey)) {
      reviewedGuideKeys.add(guideKey);
    }
  }

  return reviewedGuideKeys;
}

function getMatchupGuideKey(
  championA: Pick<LeagueChampion, "id">,
  championB: Pick<LeagueChampion, "id">,
  role: LeagueRole,
) {
  return getMatchupGuideKeyFromIds(championA.id, championB.id, role);
}

function getMatchupGuideKeyFromIds(championAId: string, championBId: string, role: LeagueRole) {
  return `${championAId}::${championBId}::${role}`;
}

function parseMatchupGuideKey(guideKey: string) {
  const [championAId, championBId, role] = guideKey.split("::");

  return {
    championAId,
    championBId,
    role: role as LeagueRole,
  };
}

function buildChampionLookup(champions: LeagueChampion[]) {
  const lookup = new Map<string, LeagueChampion>();

  for (const champion of champions) {
    lookup.set(normalizeChampionLookupKey(champion.id), champion);
    lookup.set(normalizeChampionLookupKey(champion.name), champion);
    lookup.set(normalizeChampionLookupKey(slugifyChampionName(champion.name)), champion);
  }

  return lookup;
}

function resolveChampion(lookup: Map<string, LeagueChampion>, championNameOrId: string) {
  return lookup.get(normalizeChampionLookupKey(championNameOrId)) ?? null;
}

function normalizeChampionLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function formatWinRate(value: number | null) {
  return value === null ? "Pending" : `${value.toFixed(1)}%`;
}

function formatGames(value: number | null) {
  return value === null ? "Pending" : new Intl.NumberFormat("en").format(value);
}

function formatDelta(value: number | null) {
  if (value === null) {
    return "Pending";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}
