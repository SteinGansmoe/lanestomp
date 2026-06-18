"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Info,
  Lightbulb,
  ShieldCheck,
  Search,
  Swords,
  Target,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { BackButton } from "@/src/components/back-button";
import { LeagueItemTooltip } from "@/src/components/league/league-data-tooltip";
import {
  fetchReviewedCounterPicksByChampionAndRole,
  type LeagueCounterPick,
  type CounterPickBuildPath as StoredCounterPickBuildPath,
} from "@/src/features/league/counter-picks";
import { fetchCounterPickStatsForSelectedChampion } from "@/src/features/league/counter-pick-statistics-provider";
import {
  compareCounterPickStatistics,
  emptyCounterPickStatistics,
  getCounterPickPublicTierLabel,
  hasCounterPickStatistics,
  isCounterPickStatisticsPubliclyRanked,
  isCounterPickStatisticsTrusted,
  publicCounterPickMinimumRankedGames,
  type CounterPickStatistics,
} from "@/src/features/league/counter-pick-statistics";
import {
  getCounterPickAlternativeBuildSections,
  getCounterPickBuildGuide,
  type CounterPickAlternativeBuildSection,
  type CounterPickBuildPath,
  type CounterPickBuildGuide,
} from "@/src/features/league/counter-pick-builds";
import {
  getChampionMasteryRequirement,
  type ChampionMasteryRequirement,
} from "@/src/features/league/champion-mastery-requirements";
import {
  getChampionRoles,
  isChampionInRole,
  sortChampionsForRole,
} from "@/src/features/league/champion-roles";
import {
  getChampionSplashUrl,
  getChampionIconPath,
  type LeagueChampion,
} from "@/src/features/league/champions";
import {
  getChampionCombatProfile,
  type LeagueChampionCounterRelationship,
} from "@/src/features/league/champion-knowledge";
import { getLeagueItemById, type LeagueItemMetadata } from "@/src/features/league/items";
import { getLeagueMatchupHref } from "@/src/features/league/matchup-routes";
import {
  matchesPublicCounterPickChampionSearch,
  normalizePublicCounterPickSearchValue,
} from "@/src/features/league/public-counter-pick-options";
import { getLeagueRoleLabel, type LeagueRole } from "@/src/features/league/roles";
import { supabase } from "@/src/lib/supabase";
import { cn } from "@/src/lib/utils";

type CounterPickSelectorProps = {
  champions: LeagueChampion[];
};

type CounterDirection = "best-counter" | "countered-by";
type CounterPrepSectionKey = "alternative-build" | "build" | "guide" | "lane" | "mastery" | "why";

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
  commonBuildPath: StoredCounterPickBuildPath | null;
  behindBuildPath: StoredCounterPickBuildPath | null;
  stats: CounterPickStatistics;
};

type CounterPickListSampleSummary = {
  hiddenPreliminaryCount: number;
  observedCount: number;
  rankedCount: number;
};

type CounterPrepSectionItem = {
  content: ReactNode;
  description?: string;
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

type MatchStatisticsState = {
  countersIntoSelectedChampion: Map<string, CounterPickStatistics>;
  error: string | null;
  isLoading: boolean;
  selectedChampionGoodInto: Map<string, CounterPickStatistics>;
};

const emptyReviewedCounterPickState: ReviewedCounterPickState = {
  counterPicks: [],
  error: null,
};

const emptyGuideAvailabilityState: GuideAvailabilityState = {
  reviewedGuideKeys: new Set(),
};

const emptyMatchStatisticsState: MatchStatisticsState = {
  countersIntoSelectedChampion: new Map(),
  error: null,
  isLoading: false,
  selectedChampionGoodInto: new Map(),
};

const emptyCounterRelationships: readonly LeagueChampionCounterRelationship[] = [];
const defaultOpenPrepSections: CounterPrepSectionKey[] = ["build"];
const defaultVisibleCounterCount = 3;
const maxVisibleCounterCount = 5;

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
type ChampionSelectorRoleFilter = LeagueRole | "all";

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
  const [selectorRole, setSelectorRole] = useState<ChampionSelectorRoleFilter>("all");
  const [includeOffMeta, setIncludeOffMeta] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedCounterKey, setSelectedCounterKey] = useState<string | null>(null);
  const [isBestCountersExpanded, setIsBestCountersExpanded] = useState(false);
  const [isCounteredByExpanded, setIsCounteredByExpanded] = useState(false);
  const [openPrepSections, setOpenPrepSections] =
    useState<CounterPrepSectionKey[]>(defaultOpenPrepSections);
  const [reviewedCounterPickState, setReviewedCounterPickState] =
    useState<ReviewedCounterPickState>(emptyReviewedCounterPickState);
  const [guideAvailabilityState, setGuideAvailabilityState] = useState<GuideAvailabilityState>(
    emptyGuideAvailabilityState,
  );
  const [matchStatisticsState, setMatchStatisticsState] =
    useState<MatchStatisticsState>(emptyMatchStatisticsState);

  const selectedChampion = champions.find((champion) => champion.id === selectedChampionId) ?? null;
  const selectedProfile = selectedChampion
    ? (getChampionCombatProfile(selectedChampion.id) ??
      getChampionCombatProfile(selectedChampion.name))
    : null;
  const selectedChampionRoles = selectedChampion ? getChampionRoles(selectedChampion) : [];
  const primaryRole =
    selectedChampionRoles.find((role) => role === selectedRole) ??
    selectedChampionRoles[0] ??
    selectedRole;
  const selectableChampions = useMemo(() => {
    const normalizedQuery = normalizePublicCounterPickSearchValue(selectorQuery);

    if (normalizedQuery) {
      return champions.filter((champion) =>
        matchesPublicCounterPickChampionSearch(
          champion,
          normalizedQuery,
          getChampionRoles(champion).map(getLeagueRoleLabel),
        ),
      );
    }

    if (selectorRole === "all") {
      return [...champions].sort((left, right) => left.name.localeCompare(right.name));
    }

    return sortChampionsForRole(
      champions.filter((champion) => isChampionInRole(champion, selectorRole, { includeOffMeta })),
      selectorRole,
    );
  }, [champions, includeOffMeta, selectorQuery, selectorRole]);
  const bestCounterRelationships = selectedProfile?.counteredBy ?? emptyCounterRelationships;
  const counteredByRelationships = selectedProfile?.counters ?? emptyCounterRelationships;
  const combatRelationshipsByChampion = useMemo(
    () => buildCombatRelationshipLookup([...bestCounterRelationships, ...counteredByRelationships]),
    [bestCounterRelationships, counteredByRelationships],
  );
  const reviewedCounterPicks = reviewedCounterPickState.counterPicks;
  const countersIntoSelectedChampion = matchStatisticsState.countersIntoSelectedChampion;
  const selectedChampionGoodInto = matchStatisticsState.selectedChampionGoodInto;
  const bestCounterRows = useMemo(() => {
    return buildCounterRowsFromStatistics({
      champions,
      combatRelationshipsByChampion,
      direction: "best-counter",
      reviewedCounterPicks,
      reviewedGuideKeys: guideAvailabilityState.reviewedGuideKeys,
      role: selectedRole,
      selectedChampion,
      statisticsByChampion: countersIntoSelectedChampion,
    });
  }, [
    champions,
    combatRelationshipsByChampion,
    guideAvailabilityState.reviewedGuideKeys,
    countersIntoSelectedChampion,
    reviewedCounterPicks,
    selectedChampion,
    selectedRole,
  ]);
  const counteredByRows = useMemo(() => {
    return buildCounterRowsFromStatistics({
      champions,
      combatRelationshipsByChampion,
      direction: "countered-by",
      reviewedCounterPicks,
      reviewedGuideKeys: guideAvailabilityState.reviewedGuideKeys,
      role: selectedRole,
      selectedChampion,
      statisticsByChampion: selectedChampionGoodInto,
    });
  }, [
    champions,
    combatRelationshipsByChampion,
    guideAvailabilityState.reviewedGuideKeys,
    reviewedCounterPicks,
    selectedChampion,
    selectedRole,
    selectedChampionGoodInto,
  ]);
  const allCounterRows = useMemo(
    () => [...bestCounterRows, ...counteredByRows],
    [bestCounterRows, counteredByRows],
  );
  const bestCounterSampleSummary = useMemo(
    () =>
      getCounterPickListSampleSummary({
        rows: bestCounterRows,
        statisticsByChampion: countersIntoSelectedChampion,
      }),
    [bestCounterRows, countersIntoSelectedChampion],
  );
  const counteredBySampleSummary = useMemo(
    () =>
      getCounterPickListSampleSummary({
        rows: counteredByRows,
        statisticsByChampion: selectedChampionGoodInto,
      }),
    [counteredByRows, selectedChampionGoodInto],
  );
  const totalObservedMatchups =
    bestCounterSampleSummary.observedCount + counteredBySampleSummary.observedCount;
  const totalHiddenPreliminaryMatchups =
    bestCounterSampleSummary.hiddenPreliminaryCount +
    counteredBySampleSummary.hiddenPreliminaryCount;
  const totalRankedMatchups =
    bestCounterSampleSummary.rankedCount + counteredBySampleSummary.rankedCount;
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
  const visibleBestCounterRows = useMemo(
    () =>
      getVisibleCounterRows({
        isExpanded: isBestCountersExpanded,
        rows: bestCounterRows,
      }),
    [bestCounterRows, isBestCountersExpanded],
  );
  const visibleCounteredByRows = useMemo(
    () =>
      getVisibleCounterRows({
        isExpanded: isCounteredByExpanded,
        rows: counteredByRows,
      }),
    [counteredByRows, isCounteredByExpanded],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadMatchStatistics() {
      await Promise.resolve();

      if (!selectedChampion) {
        if (isMounted) {
          setMatchStatisticsState(emptyMatchStatisticsState);
        }
        return;
      }

      setMatchStatisticsState({
        ...emptyMatchStatisticsState,
        isLoading: true,
      });

      const result = await fetchCounterPickStatsForSelectedChampion({
        enemyChampion: selectedChampion.id,
        role: selectedRole,
      });

      if (!isMounted) {
        return;
      }

      setMatchStatisticsState({
        error: result.error,
        isLoading: false,
        countersIntoSelectedChampion: result.countersIntoSelectedChampion,
        selectedChampionGoodInto: result.selectedChampionGoodInto,
      });
    }

    void loadMatchStatistics();

    return () => {
      isMounted = false;
    };
  }, [selectedChampion, selectedRole]);

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
    setIsBestCountersExpanded(false);
    setIsCounteredByExpanded(false);
    setOpenPrepSections(defaultOpenPrepSections);
    setIsSelectorOpen(false);
  }

  function handleRoleChange(role: LeagueRole) {
    setSelectedRole(role);
    setSelectorRole(role);
    setSelectedCounterKey(null);
    setIsBestCountersExpanded(false);
    setIsCounteredByExpanded(false);
    setOpenPrepSections(defaultOpenPrepSections);
  }

  function handleCounterSelect(counterKey: string) {
    setSelectedCounterKey(counterKey);
    setOpenPrepSections(defaultOpenPrepSections);
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
        selectedProfile={selectedProfile}
        selectedRole={selectedRole}
      />

      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        {!selectedChampion ? (
          <EmptyState
            title="Choose a champion"
            text="Select a champion and role to start building the counter-pick picture."
          />
        ) : matchStatisticsState.isLoading ? (
          <CounterPickLoadingState
            selectedChampion={selectedChampion}
            selectedRole={selectedRole}
          />
        ) : matchStatisticsState.error ? (
          <CounterPickErrorState
            error={matchStatisticsState.error}
            selectedChampion={selectedChampion}
            selectedRole={selectedRole}
          />
        ) : bestCounterRows.length === 0 && counteredByRows.length === 0 ? (
          <NoCounterPickDataState
            hiddenPreliminaryCount={totalHiddenPreliminaryMatchups}
            observedCount={totalObservedMatchups}
            selectedChampion={selectedChampion}
            selectedRole={selectedRole}
          />
        ) : (
          <div className="grid min-w-0 gap-8">
            <CounterPickConfidenceSummary
              hiddenPreliminaryCount={totalHiddenPreliminaryMatchups}
              rankedCount={totalRankedMatchups}
            />
            <div className="grid gap-5 lg:grid-cols-2">
              <CounterMatchupList
                emptyText={`No reliable counters into ${selectedChampion.name} ${getLeagueRoleLabel(selectedRole)} are available yet.`}
                hiddenPreliminaryCount={bestCounterSampleSummary.hiddenPreliminaryCount}
                isExpanded={isBestCountersExpanded}
                onExpandedChange={setIsBestCountersExpanded}
                onSelect={handleCounterSelect}
                rows={visibleBestCounterRows}
                selectedKey={selectedCounter?.key ?? null}
                showToggle={bestCounterRows.length > defaultVisibleCounterCount}
                subtitle={`Strong enemy counters into ${selectedChampion.name}`}
                title="Best Counters"
                totalRows={bestCounterRows.length}
              />
              <CounterMatchupList
                emptyText={`No reliable matchups ${selectedChampion.name} performs well into are available yet.`}
                hiddenPreliminaryCount={counteredBySampleSummary.hiddenPreliminaryCount}
                isExpanded={isCounteredByExpanded}
                onExpandedChange={setIsCounteredByExpanded}
                onSelect={handleCounterSelect}
                rows={visibleCounteredByRows}
                selectedKey={selectedCounter?.key ?? null}
                showToggle={counteredByRows.length > defaultVisibleCounterCount}
                subtitle={`Champions ${selectedChampion.name} performs well into`}
                title={`Bad Into ${selectedChampion.name}`}
                totalRows={counteredByRows.length}
              />
            </div>
            <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="grid min-w-0 gap-8">
                <CounterPreparationSection
                  onSectionToggle={handlePrepSectionToggle}
                  openSections={openPrepSections}
                  selectedChampion={selectedChampion}
                  selectedCounter={selectedCounter}
                />
                <CounterPickTip champion={selectedChampion} />
              </div>
              <MatchupSnapshotSidebar
                selectedChampion={selectedChampion}
                selectedCounter={selectedCounter}
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
  selectedProfile,
  selectedRole,
}: {
  champion: LeagueChampion | null;
  onOpenSelector: () => void;
  onRoleChange: (role: LeagueRole) => void;
  primaryRole: LeagueRole;
  selectedProfile: ReturnType<typeof getChampionCombatProfile> | null;
  selectedRole: LeagueRole;
}) {
  const championClassLabel = getChampionClassLabel(selectedProfile, champion);

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
              <RolePill label={championClassLabel} tone="zinc" />
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

function CounterPickConfidenceSummary({
  hiddenPreliminaryCount,
  rankedCount,
}: {
  hiddenPreliminaryCount: number;
  rankedCount: number;
}) {
  return (
    <section className="border-y border-cyan-300/15 bg-cyan-400/[0.035] px-4 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-cyan-200" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-cyan-50">
              Showing {rankedCount} ranked matchup{rankedCount === 1 ? "" : "s"}
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              Confidence is based on stored Riot game count for now. Small samples can change
              significantly as more matches are collected.
            </p>
            {hiddenPreliminaryCount > 0 ? (
              <p className="mt-2 text-sm leading-6 text-amber-100">
                {hiddenPreliminaryCount} preliminary matchup
                {hiddenPreliminaryCount === 1 ? " is" : "s are"} hidden because fewer than{" "}
                {publicCounterPickMinimumRankedGames} stored games are not enough to rank publicly.
              </p>
            ) : null}
          </div>
        </div>
        <details className="group shrink-0 text-sm text-zinc-300">
          <summary className="cursor-pointer list-none font-semibold text-cyan-100 outline-none transition hover:text-cyan-50 focus-visible:ring-2 focus-visible:ring-cyan-300/40">
            Confidence guide
          </summary>
          <div className="mt-3 max-w-md border border-white/10 bg-black/30 p-3 text-xs leading-5 text-zinc-400">
            Confidence currently reflects how many stored Riot matches each result is based on. It
            does not yet include unique-player spread, rank diversity, specialist share, or patch
            freshness.
          </div>
        </details>
      </div>
    </section>
  );
}

function CounterMatchupList({
  emptyText,
  hiddenPreliminaryCount,
  isExpanded,
  onExpandedChange,
  onSelect,
  rows,
  selectedKey,
  showToggle,
  subtitle,
  title,
  totalRows,
}: {
  emptyText: string;
  hiddenPreliminaryCount: number;
  isExpanded: boolean;
  onExpandedChange: (value: boolean) => void;
  onSelect: (key: string) => void;
  rows: CounterRowModel[];
  selectedKey: string | null;
  showToggle: boolean;
  subtitle: string;
  title: string;
  totalRows: number;
}) {
  return (
    <section className="min-w-0 border-y border-white/10 py-4">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-mono text-xl font-semibold uppercase tracking-normal text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          <p className="mt-2 text-xs text-zinc-500">
            Showing {totalRows} ranked matchups
            {hiddenPreliminaryCount > 0
              ? `; ${hiddenPreliminaryCount} additional matchup${hiddenPreliminaryCount === 1 ? "" : "s"} below the ${publicCounterPickMinimumRankedGames}-game public threshold`
              : ""}
            .
          </p>
        </div>
        <span className="font-mono text-sm text-cyan-200">
          {Math.min(totalRows, maxVisibleCounterCount)}
        </span>
      </div>

      {rows.length > 0 ? (
        <>
          <div className="grid gap-2">
            {rows.map((row) => (
              <CounterMatchupRow
                isSelected={row.key === selectedKey}
                key={row.key}
                onSelect={() => onSelect(row.key)}
                row={row}
              />
            ))}
          </div>
          {showToggle ? (
            <div className="mt-4 flex justify-center">
              <Button
                className="h-9 rounded-md border border-cyan-300/25 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/15"
                onClick={() => onExpandedChange(!isExpanded)}
                type="button"
                variant="ghost"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>
          ) : null}
        </>
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
  const isTrustedStatistics = isCounterPickStatisticsTrusted(row.stats);
  const confidenceWarning = getCounterPickConfidenceWarning(row.stats);

  return (
    <button
      aria-pressed={isSelected}
      className={cn(
        "group flex w-full items-center gap-3 border border-white/10 bg-white/[0.025] p-3 text-left transition hover:border-cyan-300/35 hover:bg-cyan-400/[0.055]",
        isSelected &&
          "border-cyan-300/65 bg-cyan-400/[0.09] shadow-[inset_3px_0_0_rgba(34,211,238,0.85)]",
      )}
      onClick={onSelect}
      type="button"
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/30">
        {row.champion ? (
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover transition duration-200 group-hover:scale-105"
            fill
            sizes="48px"
            src={getChampionIconPath(row.champion)}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-cyan-100">
            <Swords className="size-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-white">{championName}</h3>
        <p className="mt-1 text-xs text-zinc-500 md:hidden">
          {isTrustedStatistics
            ? `${formatCounterPickWinRate(row.stats)} | ${formatCounterPickGames(row.stats)} | ${formatCounterPickTier(row.stats)} | ${row.stats.confidence.label}`
            : "Not enough data"}
        </p>
        {isTrustedStatistics ? <CounterPickConfidenceBadge statistics={row.stats} /> : null}
        {confidenceWarning ? (
          <p className="mt-1 text-xs text-amber-200/85">{confidenceWarning}</p>
        ) : null}
      </div>

      <div className="hidden shrink-0 grid-cols-[5rem_6rem_5rem_8rem] items-center gap-3 text-right md:grid">
        {isTrustedStatistics ? (
          <>
            <CounterMatchupRowStat
              label="WR"
              value={formatCounterPickWinRate(row.stats, { includeSuffix: false })}
            />
            <CounterMatchupRowStat label="Games" value={formatCounterPickGames(row.stats)} />
            <CounterMatchupRowStat label="Tier" value={formatCounterPickTier(row.stats)} />
            <CounterMatchupRowStat label="Confidence" value={row.stats.confidence.shortLabel} />
            {confidenceWarning ? (
              <p className="col-span-4 text-xs text-amber-200/85">{confidenceWarning}</p>
            ) : null}
          </>
        ) : (
          <p className="col-span-4 text-sm font-semibold text-zinc-500">Not enough data</p>
        )}
      </div>

      <span
        className={cn(
          "size-2.5 shrink-0 rounded-full border border-white/15 bg-white/10 transition",
          isSelected && "border-cyan-200 bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.6)]",
        )}
        aria-hidden="true"
      />
    </button>
  );
}

function CounterMatchupRowStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-cyan-100">{value}</p>
      <p className="mt-0.5 truncate text-[0.62rem] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
    </div>
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
    ? (getChampionCombatProfile(selectedCounter.champion.id) ??
      getChampionCombatProfile(selectedCounter.champion.name))
    : null;
  const selectedProfile =
    getChampionCombatProfile(selectedChampion.id) ??
    getChampionCombatProfile(selectedChampion.name);
  const whyPrepNotes = getMatchupPrepReasons({
    counterProfile,
    counterRow: selectedCounter,
    selectedChampion,
    selectedProfile,
  });
  const lanePrepNotes = getLanePrepNotes({
    counterProfile,
    counterRow: selectedCounter,
    selectedChampion,
    selectedProfile,
  });
  const buildGuide = selectedCounter.champion
    ? getCounterPickBuildGuide(selectedCounter.champion.id, selectedCounter.champion.name)
    : null;
  const masteryRequirement = getChampionMasteryRequirement(
    selectedCounter.champion ?? selectedCounter.fallbackName,
  );
  const sectionItems: CounterPrepSectionItem[] = [
    {
      content: <CounterBuildPath buildPath={buildGuide?.build ?? null} />,
      key: "build",
      title: `Build ${counterName}`,
    },
    {
      content: (
        <CounterAlternativeBuildPath
          behindBuildPath={selectedCounter.behindBuildPath}
          buildGuide={buildGuide}
          commonBuildPath={selectedCounter.commonBuildPath}
        />
      ),
      key: "alternative-build",
      title: "Alternative Build Path",
    },
    {
      content: <ChampionMasteryRequirementPanel masteryRequirement={masteryRequirement} />,
      key: "mastery",
      title: "Mastery Requirement",
    },
    {
      content: <PrepBulletList items={whyPrepNotes} />,
      key: "why",
      title:
        selectedCounter.direction === "best-counter"
          ? `Why ${counterName} Works Into ${selectedChampion.name}`
          : `Why ${counterName} Struggles Into ${selectedChampion.name}`,
    },
    {
      content: <PrepBulletList items={lanePrepNotes} />,
      key: "lane",
      title: `How ${counterName} Should Play The Lane`,
    },
    {
      content: <FullMatchupGuideCallout href={selectedCounter.href} />,
      description:
        "Want detailed lane strategy, trading patterns, power spikes, danger windows, and win conditions? Open the full matchup guide.",
      key: "guide",
      title: `Open Full ${counterName} vs ${selectedChampion.name} Matchup Guide`,
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

function MatchupSnapshotSidebar({
  selectedChampion,
  selectedCounter,
}: {
  selectedChampion: LeagueChampion;
  selectedCounter: CounterRowModel | null;
}) {
  if (!selectedCounter) {
    return (
      <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
        <section className="border-y border-white/10 py-6">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Matchup Snapshot
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Select a counter to see the quick matchup read.
          </p>
        </section>
        <ReservedAdContainer />
      </aside>
    );
  }

  const counterName = selectedCounter.champion?.name ?? selectedCounter.fallbackName;
  const counterProfile = selectedCounter.champion
    ? (getChampionCombatProfile(selectedCounter.champion.id) ??
      getChampionCombatProfile(selectedCounter.champion.name))
    : null;
  const selectedProfile =
    getChampionCombatProfile(selectedChampion.id) ??
    getChampionCombatProfile(selectedChampion.name);
  const snapshot = getMatchupSnapshot({
    counterName,
    counterProfile,
    counterRow: selectedCounter,
    selectedChampion,
    selectedProfile,
  });

  return (
    <aside className="grid gap-4 xl:sticky xl:top-6 xl:self-start">
      <section className="border border-white/10 bg-[#07101f]/90 p-4 shadow-2xl shadow-black/25">
        <div className="border-b border-white/10 pb-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Matchup Snapshot
          </p>
          <h2 className="mt-2 font-mono text-xl font-semibold uppercase tracking-normal text-white">
            {counterName} vs {selectedChampion.name}
          </h2>
        </div>

        <div className="divide-y divide-white/10">
          <SnapshotRow label="Counter Type" value={snapshot.counterType} />
          <SnapshotRow label="Lane Phase Winner" value={snapshot.lanePhaseWinner} />
          <SnapshotRow label="Mid Game Advantage" value={snapshot.midGameAdvantage} />
          <SnapshotRow label="Late Game Advantage" value={snapshot.lateGameAdvantage} />
          <SnapshotRow label="Difficulty" value={snapshot.difficulty} />
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-3">
          <SnapshotStat label="Win Rate" value={formatCounterPickWinRate(selectedCounter.stats)} />
          <SnapshotStat label="Games" value={formatCounterPickGames(selectedCounter.stats)} />
          <SnapshotStat label="Tier" value={formatCounterPickTier(selectedCounter.stats)} />
        </div>
        <div className="mt-3">
          <CounterPickConfidenceBadge statistics={selectedCounter.stats} />
        </div>
        {getCounterPickConfidenceWarning(selectedCounter.stats) ? (
          <p className="mt-3 border border-amber-300/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-100">
            {getCounterPickConfidenceWarning(selectedCounter.stats)}
          </p>
        ) : null}
      </section>

      <ReservedAdContainer />
    </aside>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-xs uppercase tracking-[0.12em] text-zinc-500">{label}</span>
      <span className="text-right text-sm font-semibold text-zinc-100">{value}</span>
    </div>
  );
}

function SnapshotStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-2 text-center">
      <p className="truncate text-sm font-semibold text-cyan-100">{value}</p>
      <p className="mt-1 truncate text-[0.65rem] uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
    </div>
  );
}

function ReservedAdContainer() {
  return (
    <section className="flex min-h-40 items-center justify-center border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
          Reserved Ad Container
        </p>
        <p className="mt-2 text-xs leading-5 text-zinc-600">Future ad slot</p>
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
  onRoleChange: (role: ChampionSelectorRoleFilter) => void;
  query: string;
  selectedChampionId: string | null;
  selectedRole: ChampionSelectorRoleFilter;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <div className="ml-auto flex h-full w-full max-w-3xl flex-col border-l border-white/10 bg-[#07101f] shadow-2xl shadow-black">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4">
          <div>
            <h2 className="font-mono text-xl font-semibold uppercase tracking-normal text-white">
              Change Champion
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Search and filter without taking over the page.
            </p>
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
  onChange: (role: ChampionSelectorRoleFilter) => void;
  selectedRole: ChampionSelectorRoleFilter;
}) {
  return (
    <div aria-label="Role filter" className="flex flex-wrap gap-2" role="radiogroup">
      <button
        aria-checked={selectedRole === "all"}
        aria-label="All roles"
        className={cn(
          "flex h-10 min-w-10 items-center justify-center rounded-md border border-white/10 bg-black/25 px-3 text-xs font-semibold text-zinc-500 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.07] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
          selectedRole === "all" &&
            "border-cyan-300/55 bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/25",
        )}
        onClick={() => onChange("all")}
        role="radio"
        title="All roles"
        type="button"
      >
        All
      </button>
      {roleOptions.map((option) => {
        const isActive = selectedRole === option.value;

        return (
          <button
            aria-checked={isActive}
            aria-label={`${option.label} role`}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-md border border-white/10 bg-black/25 px-2 text-zinc-500 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.07] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40",
              isActive && "border-cyan-300/55 bg-cyan-400/15 text-cyan-100 ring-1 ring-cyan-300/25",
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
  const championRoles = getChampionRoles(champion).filter((role) =>
    roleOptions.some((option) => option.value === role),
  );
  const supportedRoleText = championRoles.map(getLeagueRoleLabel).join(", ");
  const championLabel = supportedRoleText
    ? `Select ${champion.name}. Supported roles: ${supportedRoleText}`
    : `Select ${champion.name}`;

  return (
    <button
      aria-label={championLabel}
      aria-pressed={isSelected}
      className={cn(
        "group relative aspect-square min-w-0 overflow-hidden rounded-md border border-white/10 bg-white/[0.035] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50",
        isSelected && "border-cyan-300/80 ring-2 ring-cyan-300/30",
      )}
      onClick={onClick}
      title={supportedRoleText ? `${champion.name} - ${supportedRoleText}` : champion.name}
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

function CounterPickConfidenceBadge({ statistics }: { statistics: CounterPickStatistics }) {
  return (
    <span
      className={cn(
        "mt-2 inline-flex w-fit items-center gap-1.5 border px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em]",
        statistics.confidence.warningVisible
          ? "border-amber-300/25 bg-amber-400/10 text-amber-100"
          : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
      )}
      title={statistics.confidence.description}
    >
      {statistics.confidence.warningVisible ? (
        <AlertTriangle className="size-3" aria-hidden="true" />
      ) : null}
      {formatCounterPickGames(statistics)} · {statistics.confidence.label}
    </span>
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

type MatchupSnapshot = {
  counterType: string;
  difficulty: string;
  lanePhaseWinner: string;
  lateGameAdvantage: string;
  midGameAdvantage: string;
};

function getMatchupSnapshot({
  counterName,
  counterProfile,
  counterRow,
  selectedChampion,
  selectedProfile,
}: {
  counterName: string;
  counterProfile: ReturnType<typeof getChampionCombatProfile>;
  counterRow: CounterRowModel;
  selectedChampion: LeagueChampion;
  selectedProfile: ReturnType<typeof getChampionCombatProfile>;
}): MatchupSnapshot {
  const selectedName = selectedChampion.name;
  const fallbackWinner = counterRow.direction === "best-counter" ? counterName : selectedName;
  const lanePhaseWinner = getProfileAdvantageLabel({
    counterName,
    counterProfile,
    fallbackWinner,
    scoreProfile: getLanePhaseScore,
    selectedName,
    selectedProfile,
  });
  const midGameAdvantage = getProfileAdvantageLabel({
    counterName,
    counterProfile,
    fallbackWinner,
    scoreProfile: getMidGameScore,
    selectedName,
    selectedProfile,
  });
  const lateGameAdvantage = getProfileAdvantageLabel({
    counterName,
    counterProfile,
    fallbackWinner,
    scoreProfile: getLateGameScore,
    selectedName,
    selectedProfile,
  });

  return {
    counterType: counterRow.direction === "best-counter" ? "Best Counter" : "Bad Matchup",
    difficulty: getSnapshotDifficulty({
      counterName,
      counterRow,
      lanePhaseWinner,
      lateGameAdvantage,
      midGameAdvantage,
    }),
    lanePhaseWinner,
    lateGameAdvantage,
    midGameAdvantage,
  };
}

function getProfileAdvantageLabel({
  counterName,
  counterProfile,
  fallbackWinner,
  scoreProfile,
  selectedName,
  selectedProfile,
}: {
  counterName: string;
  counterProfile: ReturnType<typeof getChampionCombatProfile>;
  fallbackWinner: string;
  scoreProfile: (profile: ReturnType<typeof getChampionCombatProfile>) => number;
  selectedName: string;
  selectedProfile: ReturnType<typeof getChampionCombatProfile>;
}) {
  const counterScore = scoreProfile(counterProfile);
  const selectedScore = scoreProfile(selectedProfile);
  const scoreDifference = counterScore - selectedScore;

  if (Math.abs(scoreDifference) < 0.75) {
    return fallbackWinner;
  }

  return scoreDifference > 0 ? counterName : selectedName;
}

function getLanePhaseScore(profile: ReturnType<typeof getChampionCombatProfile>) {
  const laneIdentity = profile?.laneIdentity;

  if (!laneIdentity || typeof laneIdentity === "string") {
    return 0;
  }

  return (
    getLaneIdentityScore(laneIdentity.earlyGameAgency) * 2 +
    getLaneIdentityScore(laneIdentity.lanePressure) * 1.5
  );
}

function getMidGameScore(profile: ReturnType<typeof getChampionCombatProfile>) {
  const laneIdentity = profile?.laneIdentity;
  const lanePressure =
    laneIdentity && typeof laneIdentity !== "string"
      ? getLaneIdentityScore(laneIdentity.lanePressure)
      : 0;

  return getStrategicScalingScore(profile?.strategicIdentity.scalingProfile, "mid") + lanePressure;
}

function getLateGameScore(profile: ReturnType<typeof getChampionCombatProfile>) {
  const laneIdentity = profile?.laneIdentity;
  const scalingPriority =
    laneIdentity && typeof laneIdentity !== "string"
      ? getLaneIdentityScore(laneIdentity.scalingPriority)
      : 0;

  return (
    getStrategicScalingScore(profile?.strategicIdentity.scalingProfile, "late") +
    scalingPriority * 1.5
  );
}

function getLaneIdentityScore(value: string) {
  if (value === "very_high") {
    return 4;
  }

  if (value === "high") {
    return 3;
  }

  if (value === "medium") {
    return 2;
  }

  if (value === "low") {
    return 1;
  }

  return 0;
}

function getStrategicScalingScore(
  value: "early" | "late" | "mid" | undefined,
  phase: "late" | "mid",
) {
  if (phase === "mid") {
    return value === "mid" ? 4 : value === "early" ? 3 : value === "late" ? 2 : 0;
  }

  return value === "late" ? 4 : value === "mid" ? 2 : value === "early" ? 1 : 0;
}

function getSnapshotDifficulty({
  counterName,
  counterRow,
  lanePhaseWinner,
  lateGameAdvantage,
  midGameAdvantage,
}: {
  counterName: string;
  counterRow: CounterRowModel;
  lanePhaseWinner: string;
  lateGameAdvantage: string;
  midGameAdvantage: string;
}) {
  if (counterRow.direction === "countered-by") {
    return "High";
  }

  const counterAdvantageCount = [lanePhaseWinner, midGameAdvantage, lateGameAdvantage].filter(
    (winner) => winner === counterName,
  ).length;

  return counterAdvantageCount >= 2 ? "Medium" : "Skill Check";
}

function formatCounterPickWinRate(
  statistics: CounterPickStatistics,
  { includeSuffix = true }: { includeSuffix?: boolean } = {},
) {
  if (!isCounterPickStatisticsTrusted(statistics) || statistics.winRate === null) {
    return "Not enough data";
  }

  const formattedWinRate = `${statistics.winRate.toFixed(1)}%`;

  return includeSuffix ? `${formattedWinRate} WR` : formattedWinRate;
}

function formatCounterPickGames(statistics: CounterPickStatistics) {
  return isCounterPickStatisticsTrusted(statistics) && statistics.games !== null
    ? `${new Intl.NumberFormat("en").format(statistics.games)} games`
    : "Not enough data";
}

function formatCounterPickTier(statistics: CounterPickStatistics) {
  return getCounterPickPublicTierLabel(statistics);
}

function getCounterPickConfidenceWarning(statistics: CounterPickStatistics) {
  if (!isCounterPickStatisticsTrusted(statistics) || statistics.games === null) {
    return null;
  }

  if (statistics.confidence.level === "very_low") {
    return `Preliminary result - this matchup is based on only ${formatCounterPickGames(statistics)} and may change significantly.`;
  }

  if (statistics.confidence.level === "low") {
    return `Limited sample size - this result is based on ${formatCounterPickGames(statistics)} and may still change.`;
  }

  return null;
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
        <div className={cn("min-h-0", isOpen ? "overflow-visible" : "overflow-hidden")}>
          <div className="grid gap-4 pb-5">
            {item.description ? (
              <p className="max-w-3xl text-sm leading-6 text-zinc-400">{item.description}</p>
            ) : null}
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}

function FullMatchupGuideCallout({ href }: { href: string | null }) {
  if (!href) {
    return (
      <p className="border-y border-white/10 py-4 text-sm leading-6 text-zinc-400">
        Guide coming soon
      </p>
    );
  }

  return (
    <Button
      asChild
      className="h-12 w-fit rounded-md bg-cyan-200 px-5 font-semibold text-[#04111f] shadow-lg shadow-cyan-950/30 hover:bg-cyan-100"
    >
      <Link href={href}>
        Open Full Matchup Guide
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}

function CounterAlternativeBuildPath({
  behindBuildPath,
  buildGuide,
  commonBuildPath,
}: {
  behindBuildPath: StoredCounterPickBuildPath | null;
  buildGuide: CounterPickBuildGuide | null;
  commonBuildPath: StoredCounterPickBuildPath | null;
}) {
  const sections = getCounterPickAlternativeBuildSections({
    behindBuildPath,
    commonBuildPath,
    guide: buildGuide,
  });

  if (sections.length === 0) {
    return <BuildGuidancePlaceholder />;
  }

  return (
    <div className="grid gap-5">
      {sections.map((section) => (
        <CounterAlternativeBuildSubsection key={section.key} section={section} />
      ))}
    </div>
  );
}

function CounterAlternativeBuildSubsection({
  section,
}: {
  section: CounterPickAlternativeBuildSection;
}) {
  return (
    <section className="grid gap-3 border-y border-white/10 py-4">
      <div>
        <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-cyan-100">
          {section.title}
        </h3>
        {section.description ? (
          <p className="mt-2 text-sm leading-6 text-zinc-400">{section.description}</p>
        ) : null}
      </div>
      <CounterBuildPathContent itemIds={section.itemIds} note={section.note} />
    </section>
  );
}

function ChampionMasteryRequirementPanel({
  masteryRequirement,
}: {
  masteryRequirement: ChampionMasteryRequirement;
}) {
  const isDemanding =
    masteryRequirement.level === "high" || masteryRequirement.level === "very_high";

  return (
    <div
      className={cn(
        "grid gap-4 border-y p-4",
        isDemanding
          ? "border-amber-300/20 bg-amber-400/10"
          : "border-cyan-300/15 bg-cyan-400/[0.035]",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full border",
              isDemanding
                ? "border-amber-300/25 bg-black/20 text-amber-100"
                : "border-cyan-300/20 bg-black/20 text-cyan-100",
            )}
          >
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              Mastery Requirement: {masteryRequirement.label}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
              Champion familiarity guidance
            </p>
          </div>
        </div>
        <span
          className={cn(
            "w-fit border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
            isDemanding
              ? "border-amber-300/30 bg-amber-400/10 text-amber-100"
              : "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
          )}
        >
          {masteryRequirement.label}
        </span>
      </div>
      <div className="grid gap-3 text-sm leading-6 text-zinc-300">
        {masteryRequirement.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function CounterBuildPath({ buildPath }: { buildPath: CounterPickBuildPath | null }) {
  if (!buildPath) {
    return <BuildGuidancePlaceholder />;
  }

  return <CounterBuildPathContent itemIds={buildPath.itemIds} note={buildPath.note} />;
}

function CounterBuildPathContent({
  itemIds,
  note,
}: {
  itemIds: Array<LeagueItemMetadata["id"]>;
  note: string;
}) {
  const items = itemIds
    .map((itemId) => getLeagueItemById(itemId))
    .filter((item): item is LeagueItemMetadata => Boolean(item));

  if (items.length === 0) {
    return <BuildGuidancePlaceholder />;
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <div className="flex items-center gap-2" key={item.id}>
            {index > 0 ? (
              <ChevronRight className="size-4 text-cyan-200/45" aria-hidden="true" />
            ) : null}
            <LeagueItemTooltip className="shrink-0" item={item} />
          </div>
        ))}
      </div>
      {note ? <p className="max-w-3xl text-sm leading-6 text-zinc-300">{note}</p> : null}
    </div>
  );
}

function PrepBulletList({ items }: { items: string[] }) {
  const uniqueItems = dedupePrepBullets(items);

  if (uniqueItems.length === 0) {
    return <PrepPlaceholder />;
  }

  return (
    <ul className="space-y-4">
      {uniqueItems.map((item) => (
        <li
          className="flex gap-3 text-sm leading-6 text-zinc-300"
          key={normalizePrepBulletKey(item)}
        >
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
      Detailed prep coming soon.
    </p>
  );
}

function BuildGuidancePlaceholder() {
  return (
    <p className="border-y border-dashed border-white/10 py-4 text-sm leading-6 text-zinc-400">
      Build guidance coming soon.
    </p>
  );
}

function getMatchupPrepReasons({
  counterProfile,
  counterRow,
  selectedChampion,
  selectedProfile,
}: {
  counterProfile: ReturnType<typeof getChampionCombatProfile>;
  counterRow: CounterRowModel;
  selectedChampion: LeagueChampion;
  selectedProfile: ReturnType<typeof getChampionCombatProfile>;
}) {
  const counterName = counterRow.champion?.name ?? counterRow.fallbackName;
  const selectedName = selectedChampion.name;
  const selectedDanger = getPrimaryThreatLabel(selectedProfile);
  const counterControl = getPrimaryControlLabel(counterProfile);
  const selectedWeakness = selectedProfile?.commonWeaknesses?.[0];
  const counterMobility = counterProfile?.mobilityLevel;
  const selectedMobility = selectedProfile?.mobilityLevel;
  const isBadMatchup = counterRow.direction === "countered-by";
  const candidates: PrepCandidate[] = counterRow.reasons.map((reason) => ({
    concept: inferPrepConcept(reason),
    text: reason,
  }));

  if (isBadMatchup) {
    if (selectedDanger) {
      candidates.push({
        concept: "cooldown",
        text: `${counterName} has to track ${selectedName}'s ${selectedDanger} before stepping forward, because that cooldown decides whether the trade is playable.`,
      });
    }

    if (counterProfile?.commonWeaknesses?.[0]) {
      candidates.push({
        concept: "punish",
        text: `${selectedName} can keep attacking ${counterName}'s weak point: ${formatEmbeddedAdvice(counterProfile.commonWeaknesses[0])}.`,
      });
    }

    if (selectedProfile?.hardCrowdControl?.[0] || selectedProfile?.softCrowdControl?.[0]) {
      candidates.push({
        concept: "lockdown",
        text: `${selectedName}'s ${selectedProfile.hardCrowdControl?.[0] ?? selectedProfile.softCrowdControl?.[0]} makes ${counterName}'s commit windows easier to punish.`,
      });
    }

    if (selectedProfile?.laneIdentity && typeof selectedProfile.laneIdentity !== "string") {
      candidates.push({
        concept: "wave",
        text: `${selectedName} can use lane tempo to make ${counterName} choose between contesting the wave and taking an unsafe trade.`,
      });
    }
  } else {
    if (selectedDanger) {
      candidates.push({
        concept: "cooldown",
        text: `${counterName} can pressure ${selectedName} harder whenever ${selectedName}'s ${selectedDanger} is unavailable.`,
      });
    }

    if (counterControl) {
      candidates.push({
        concept: "lockdown",
        text: `${counterName}'s ${counterControl} creates reliable punish windows before ${selectedName} can reset spacing.`,
      });
    }

    if (selectedWeakness) {
      candidates.push({
        concept: "punish",
        text: `${counterName} can repeatedly attack ${selectedName}'s weak point: ${formatEmbeddedAdvice(selectedWeakness)}.`,
      });
    }

    if (
      (counterMobility === "high" || counterMobility === "very_high") &&
      (selectedMobility === "none" || selectedMobility === "low" || selectedMobility === "medium")
    ) {
      candidates.push({
        concept: "mobility",
        text: `${counterName}'s mobility lets them choose trade angles that ${selectedName} cannot easily match.`,
      });
    }
  }

  candidates.push({
    concept: "trading",
    text: `${counterName} should win this matchup by turning ${selectedName}'s missed or spent cooldowns into immediate trade pressure.`,
  });

  return pickPrepCandidates(candidates, 3);
}

function getLanePrepNotes({
  counterProfile,
  counterRow,
  selectedChampion,
  selectedProfile,
}: {
  counterProfile: ReturnType<typeof getChampionCombatProfile>;
  counterRow: CounterRowModel;
  selectedChampion: LeagueChampion;
  selectedProfile: ReturnType<typeof getChampionCombatProfile>;
}) {
  if (!counterProfile) {
    return [];
  }

  const selectedName = selectedChampion.name;
  const selectedDanger = getPrimaryThreatLabel(selectedProfile);
  const counterControl = getPrimaryControlLabel(counterProfile);
  const counterDefensiveTool = getDefensiveToolLabel(counterProfile);
  const candidates: PrepCandidate[] = [];

  if (counterProfile.primaryTradingPattern) {
    candidates.push({
      concept: "trading",
      text: toActionInstruction(counterProfile.primaryTradingPattern),
    });
  }

  if (selectedDanger) {
    candidates.push({
      concept: "cooldown",
      text: `Track ${selectedName}'s ${selectedDanger} before committing to a forward trade.`,
    });
  }

  if (counterDefensiveTool && selectedDanger) {
    candidates.push({
      concept: "ability",
      text: `Save ${counterDefensiveTool} for ${selectedName}'s ${selectedDanger} instead of spending it on low-value poke.`,
    });
  } else if (counterControl) {
    candidates.push({
      concept: "ability",
      text: `Use ${counterControl} when ${selectedName} has already spent mobility or walked into a narrow angle.`,
    });
  }

  if (usesMinionWave(counterProfile)) {
    candidates.push({
      concept: "positioning",
      text: "Fight around minion waves so you have both engage angles and a way back out.",
    });
  } else if (
    counterProfile.mobilityLevel === "high" ||
    counterProfile.mobilityLevel === "very_high"
  ) {
    candidates.push({
      concept: "positioning",
      text: `Plan the exit before using mobility forward into ${selectedName}.`,
    });
  } else {
    candidates.push({
      concept: "positioning",
      text: `Hold spacing so ${selectedName} has to spend a key cooldown before reaching you.`,
    });
  }

  candidates.push({
    concept: "wave",
    text:
      counterRow.direction === "countered-by"
        ? "Keep the wave closer to safety until the dangerous cooldowns are down."
        : "Thin large waves before trading so the all-in is decided by cooldowns, not minion damage.",
  });

  const levelSixSpike = counterProfile.powerSpikes?.major.find((spike) =>
    spike.timing.toLowerCase().includes("level 6"),
  );

  if (levelSixSpike) {
    candidates.push({
      concept: "kill-window",
      text: `Look for all-ins after ${levelSixSpike.timing.toLowerCase()} when ${selectedName}'s escape or peel tools are unavailable.`,
    });
  } else {
    candidates.push({
      concept: "kill-window",
      text: `Turn ${selectedName}'s missed defensive cooldown into your main kill window instead of forcing blind engages.`,
    });
  }

  for (const condition of counterProfile.trading?.goodTradeConditions ?? []) {
    candidates.push({
      concept: inferPrepConcept(condition),
      text: toActionInstruction(condition),
    });
  }

  for (const action of counterProfile.powerSpikes?.major.map((spike) => spike.playerAction) ?? []) {
    candidates.push({
      concept: inferPrepConcept(action),
      text: toActionInstruction(action),
    });
  }

  return pickPrepCandidates(candidates, 5);
}

type PrepConcept =
  | "ability"
  | "cooldown"
  | "kill-window"
  | "lockdown"
  | "mobility"
  | "positioning"
  | "punish"
  | "range"
  | "scaling"
  | "trading"
  | "wave";

type PrepCandidate = {
  concept: PrepConcept;
  text: string;
};

function pickPrepCandidates(candidates: PrepCandidate[], limit: number) {
  const picked: string[] = [];
  const usedConcepts = new Set<PrepConcept>();
  const usedKeys = new Set<string>();

  for (const candidate of candidates) {
    const text = normalizePrepSentence(candidate.text);
    const key = normalizePrepBulletKey(text);

    if (!text || usedConcepts.has(candidate.concept) || usedKeys.has(key)) {
      continue;
    }

    usedConcepts.add(candidate.concept);
    usedKeys.add(key);
    picked.push(text);

    if (picked.length === limit) {
      return picked;
    }
  }

  for (const candidate of candidates) {
    const text = normalizePrepSentence(candidate.text);
    const key = normalizePrepBulletKey(text);

    if (!text || usedKeys.has(key)) {
      continue;
    }

    usedKeys.add(key);
    picked.push(text);

    if (picked.length === limit) {
      return picked;
    }
  }

  return picked;
}

function inferPrepConcept(text: string): PrepConcept {
  const normalizedText = text.toLowerCase();

  if (/(wave|push|shove|crash|thin|minion|farm|last hit)/.test(normalizedText)) {
    return "wave";
  }

  if (/(cooldown|down|available|spent|misses|missed|unavailable|track)/.test(normalizedText)) {
    return "cooldown";
  }

  if (/(stun|root|knock|suppress|lock|crowd control|cc|charm|binding|taunt)/.test(normalizedText)) {
    return "lockdown";
  }

  if (/(dash|mobility|blink|kite|reposition|escape|spacing|angle|range)/.test(normalizedText)) {
    return normalizedText.includes("range") ? "range" : "mobility";
  }

  if (/(level 6|ultimate|all-in|lethal|kill|burst|execute)/.test(normalizedText)) {
    return "kill-window";
  }

  if (/(scale|scaling|stack|item)/.test(normalizedText)) {
    return "scaling";
  }

  if (/(punish|weak|vulnerable|pressure)/.test(normalizedText)) {
    return "punish";
  }

  if (/(hold|save|use|cast|ability|tool)/.test(normalizedText)) {
    return "ability";
  }

  if (/(position|forward|backward|side|flank)/.test(normalizedText)) {
    return "positioning";
  }

  return "trading";
}

function getPrimaryThreatLabel(profile: ReturnType<typeof getChampionCombatProfile>) {
  return (
    profile?.dangerAbilities?.[0] ??
    profile?.hardCrowdControl?.[0] ??
    profile?.importantAbilityNotes?.[0]?.match(/\([QWER]\)/)?.[0] ??
    null
  );
}

function getPrimaryControlLabel(profile: ReturnType<typeof getChampionCombatProfile>) {
  return profile?.hardCrowdControl?.[0] ?? profile?.softCrowdControl?.[0] ?? null;
}

function getDefensiveToolLabel(profile: ReturnType<typeof getChampionCombatProfile>) {
  const notes = [
    ...(profile?.importantAbilityNotes ?? []),
    ...(profile?.trading?.badTradeConditions ?? []),
    profile?.primaryTradingPattern ?? "",
  ];
  const defensiveNote = notes.find((note) =>
    /(block|shield|shroud|wall|dodge|escape|snapback|disengage|peel|defensive)/i.test(note),
  );

  return defensiveNote?.match(/\([QWER]\)/)?.[0] ?? null;
}

function usesMinionWave(profile: ReturnType<typeof getChampionCombatProfile>) {
  const notes = [
    profile?.lanePlan?.idealLaneState ?? "",
    profile?.primaryTradingPattern ?? "",
    ...(profile?.lanePlan?.wants ?? []),
    ...(profile?.commonWeaknesses ?? []),
  ];

  return notes.some((note) => /(minion|wave|dash through wave|waves)/i.test(note));
}

function toActionInstruction(text: string) {
  const normalizedText = normalizePrepSentence(text);

  if (
    /^(use|hold|save|track|fight|thin|keep|look|force|plan|respect|trade|poke|stack|dash|crash|push|freeze|bait|wait)\b/i.test(
      normalizedText,
    )
  ) {
    return normalizedText;
  }

  if (/^(the enemy|enemy|target|targets|opponent|opponents)\b/i.test(normalizedText)) {
    return `Punish when ${normalizedText.charAt(0).toLowerCase()}${normalizedText.slice(1)}`;
  }

  return `Play around this rule: ${normalizedText.charAt(0).toLowerCase()}${normalizedText.slice(1)}`;
}

function formatEmbeddedAdvice(text: string) {
  const formattedText = normalizePrepSentence(text);

  return formattedText.charAt(0).toLowerCase() + formattedText.slice(1);
}

function normalizePrepSentence(text: string) {
  const trimmedText = text.trim().replace(/\s+/g, " ");

  if (!trimmedText) {
    return "";
  }

  return /[.!?]$/.test(trimmedText) ? trimmedText : `${trimmedText}.`;
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

function getChampionClassLabel(
  profile: ReturnType<typeof getChampionCombatProfile> | null,
  champion: LeagueChampion | null,
) {
  const championTag = champion?.tags.find((tag) => tag.trim());

  if (championTag) {
    return formatChampionClassLabel(championTag);
  }

  const archetypes = profile?.archetype ?? [];
  const classKeywords = [
    "assassin",
    "mage",
    "marksman",
    "fighter",
    "tank",
    "support",
    "enchanter",
    "skirmisher",
    "juggernaut",
    "bruiser",
    "carry",
  ];
  const classKeyword = classKeywords.find((keyword) =>
    archetypes.some((archetype) => archetype.toLowerCase().includes(keyword)),
  );

  if (classKeyword) {
    return formatChampionClassLabel(classKeyword);
  }

  return archetypes[0] ? formatChampionClassLabel(archetypes[0]) : "Champion";
}

function formatChampionClassLabel(label: string) {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

function CounterPickLoadingState({
  selectedChampion,
  selectedRole,
}: {
  selectedChampion: LeagueChampion;
  selectedRole: LeagueRole;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {[0, 1].map((index) => (
        <section className="min-w-0 border-y border-white/10 py-4" key={index}>
          <div className="mb-3 h-6 w-44 bg-white/10" />
          <div className="grid gap-2">
            {[0, 1, 2].map((rowIndex) => (
              <div
                className="h-[4.625rem] animate-pulse border border-white/10 bg-white/[0.035]"
                key={rowIndex}
              />
            ))}
          </div>
        </section>
      ))}
      <p className="lg:col-span-2 text-center text-sm text-zinc-500">
        Loading stored matchup data for {selectedChampion.name} {getLeagueRoleLabel(selectedRole)}.
      </p>
    </div>
  );
}

function CounterPickErrorState({
  error,
  selectedChampion,
  selectedRole,
}: {
  error: string;
  selectedChampion: LeagueChampion;
  selectedRole: LeagueRole;
}) {
  return (
    <div className="border-y border-rose-300/20 bg-rose-500/10 py-10 text-center">
      <h2 className="font-mono text-2xl font-semibold uppercase tracking-normal text-rose-100">
        Counter data could not load
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-rose-100/80">
        We could not load stored matchup data for {selectedChampion.name}{" "}
        {getLeagueRoleLabel(selectedRole)}. Refresh the page or try another role.
      </p>
      <p className="mx-auto mt-4 max-w-2xl break-words border border-white/10 bg-black/20 p-3 font-mono text-xs text-rose-50">
        {error}
      </p>
    </div>
  );
}

function NoCounterPickDataState({
  hiddenPreliminaryCount,
  observedCount,
  selectedChampion,
  selectedRole,
}: {
  hiddenPreliminaryCount: number;
  observedCount: number;
  selectedChampion: LeagueChampion;
  selectedRole: LeagueRole;
}) {
  if (observedCount > 0) {
    return (
      <EmptyState
        title="Not enough ranked data yet"
        text={`We have started collecting matchup data for ${selectedChampion.name} ${getLeagueRoleLabel(selectedRole)}, but ${hiddenPreliminaryCount || observedCount} observed matchup${(hiddenPreliminaryCount || observedCount) === 1 ? "" : "s"} are still below the ${publicCounterPickMinimumRankedGames}-game public ranking threshold.`}
      />
    );
  }

  return (
    <EmptyState
      title="No stored counter data yet"
      text={`No stored matchup data is available yet for ${selectedChampion.name} ${getLeagueRoleLabel(selectedRole)}. More Riot match data is currently being collected.`}
    />
  );
}

function getCounterPickListSampleSummary({
  rows,
  statisticsByChampion,
}: {
  rows: CounterRowModel[];
  statisticsByChampion: Map<string, CounterPickStatistics>;
}): CounterPickListSampleSummary {
  let hiddenPreliminaryCount = 0;
  let observedCount = 0;

  for (const statistics of statisticsByChampion.values()) {
    if (!hasCounterPickStatistics(statistics)) {
      continue;
    }

    observedCount += 1;

    if (!isCounterPickStatisticsPubliclyRanked(statistics)) {
      hiddenPreliminaryCount += 1;
    }
  }

  return {
    hiddenPreliminaryCount,
    observedCount,
    rankedCount: rows.length,
  };
}

function buildCounterRowsFromStatistics({
  champions,
  combatRelationshipsByChampion,
  direction,
  reviewedCounterPicks,
  reviewedGuideKeys,
  role,
  selectedChampion,
  statisticsByChampion,
}: {
  champions: LeagueChampion[];
  combatRelationshipsByChampion: Map<string, LeagueChampionCounterRelationship>;
  direction: CounterDirection;
  reviewedCounterPicks: LeagueCounterPick[];
  reviewedGuideKeys: Set<string>;
  role: LeagueRole;
  selectedChampion: LeagueChampion | null;
  statisticsByChampion: Map<string, CounterPickStatistics>;
}) {
  if (!selectedChampion || statisticsByChampion.size === 0) {
    return [];
  }

  // stats.winRate is always the listed champion's win rate against the selected champion.
  const reviewedCounterPickByChampion = new Map(
    reviewedCounterPicks
      .filter((counterPick) =>
        direction === "best-counter"
          ? counterPick.counter_type === "best_counter"
          : counterPick.counter_type === "countered_by",
      )
      .map((counterPick) => [
        normalizeChampionLookupKey(counterPick.counter_champion_id),
        counterPick,
      ]),
  );
  const rows: CounterRowModel[] = [];

  for (const champion of champions) {
    if (champion.id === selectedChampion.id) {
      continue;
    }

    const statistics = getCachedCounterPickStatistics({
      champion,
      fallbackName: champion.id,
      statisticsByCounterChampion: statisticsByChampion,
    });

    if (!hasCounterPickStatistics(statistics)) {
      continue;
    }

    if (!isCounterPickStatisticsPubliclyRanked(statistics)) {
      continue;
    }

    const reviewedCounterPick = reviewedCounterPickByChampion.get(
      normalizeChampionLookupKey(champion.id),
    );
    const combatRelationship = combatRelationshipsByChampion.get(
      normalizeChampionLookupKey(champion.id),
    );
    const matchupHref = getLeagueMatchupHref({
      championA: champion,
      championB: selectedChampion,
      role,
    });
    const guideKey = getMatchupGuideKey(champion, selectedChampion, role);
    const href = guideKey && reviewedGuideKeys.has(guideKey) ? matchupHref : null;

    rows.push({
      behindBuildPath: reviewedCounterPick?.behind_build_path ?? null,
      champion,
      commonBuildPath: reviewedCounterPick?.common_build_vs ?? null,
      direction,
      fallbackName: champion.name,
      guideKey,
      href,
      key: `${direction}-stats-${champion.id}`,
      matchupHref,
      matchupLabel: `${champion.name} vs ${selectedChampion.name}`,
      reasons: reviewedCounterPick
        ? buildCounterPickReasonList(reviewedCounterPick, combatRelationship)
        : dedupePrepBullets(combatRelationship?.reasons ?? []),
      stats: statistics,
    });
  }

  return sortCounterRows(rows, direction);
}

function getVisibleCounterRows({
  isExpanded,
  rows,
}: {
  isExpanded: boolean;
  rows: CounterRowModel[];
}) {
  return rows.slice(0, isExpanded ? maxVisibleCounterCount : defaultVisibleCounterCount);
}

function buildCombatRelationshipLookup(
  relationships: readonly LeagueChampionCounterRelationship[],
) {
  const lookup = new Map<string, LeagueChampionCounterRelationship>();

  for (const relationship of relationships) {
    lookup.set(normalizeChampionLookupKey(relationship.champion), relationship);
  }

  return lookup;
}

function getCachedCounterPickStatistics({
  champion,
  fallbackName,
  fallbackStatistics = emptyCounterPickStatistics,
  statisticsByCounterChampion,
}: {
  champion: LeagueChampion | null;
  fallbackName: string;
  fallbackStatistics?: CounterPickStatistics;
  statisticsByCounterChampion: Map<string, CounterPickStatistics>;
}) {
  const lookupKeys = [champion?.id, champion?.name, fallbackName].filter((key): key is string =>
    Boolean(key),
  );

  for (const lookupKey of lookupKeys) {
    const statistics = statisticsByCounterChampion.get(normalizeChampionLookupKey(lookupKey));

    if (statistics) {
      return statistics;
    }
  }

  return fallbackStatistics;
}

function sortCounterRows(rows: CounterRowModel[], direction: CounterDirection) {
  const statisticDirection = direction === "best-counter" ? "desc" : "asc";

  return [...rows].sort((left, right) => {
    const statisticsSort = compareCounterPickStatistics(
      left.stats,
      right.stats,
      statisticDirection,
    );

    if (statisticsSort !== 0) {
      return statisticsSort;
    }

    const leftName = left.champion?.name ?? left.fallbackName;
    const rightName = right.champion?.name ?? right.fallbackName;

    return leftName.localeCompare(rightName);
  });
}

function buildCounterPickReasonList(
  counterPick: LeagueCounterPick,
  combatRelationship: LeagueChampionCounterRelationship | undefined,
) {
  return dedupePrepBullets([counterPick.reason ?? "", ...(combatRelationship?.reasons ?? [])]);
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

function normalizeChampionLookupKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function dedupePrepBullets(items: readonly string[]) {
  const uniqueItems: string[] = [];
  const seenKeys = new Set<string>();

  for (const item of items) {
    const trimmedItem = item.trim();

    if (!trimmedItem) {
      continue;
    }

    const key = normalizePrepBulletKey(trimmedItem);

    if (!key || seenKeys.has(key)) {
      continue;
    }

    seenKeys.add(key);
    uniqueItems.push(trimmedItem);
  }

  return uniqueItems;
}

function normalizePrepBulletKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/\.+$/g, "");
}
