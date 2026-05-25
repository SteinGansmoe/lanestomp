"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  ChevronRight,
  Clock3,
  Flame,
  Gamepad2,
  Heart,
  Hourglass,
  Layers3,
} from "lucide-react";

import { FollowGameButton } from "@/src/components/follow-game-button";
import { SiteHeader } from "@/src/components/site-header";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import {
  getActiveSeasonCards,
  getDashboardStats,
  getFollowedSeasonCards,
  getSearchFilteredSeasonCards,
  getStartingSoonSeasonCards,
  type GameSeasonCard,
} from "@/src/features/games/selectors";
import { formatSeasonDate, getRemainingTime } from "@/src/lib/season";
import { cn } from "@/src/lib/utils";
import { useFollowedGames } from "@/src/hooks/use-followed-games";

type DashboardFilter = "all" | "active" | "arpg" | "moba" | "followed" | "mmo" | "starting";

type SeasonSectionConfig = {
  accentClassName: string;
  description: string;
  emptyMessage: string;
  games: GameSeasonCard[];
  icon: typeof CalendarClock;
  title: string;
};

const filterChips: Array<{ label: string; value: DashboardFilter }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Starting Soon", value: "starting" },
  { label: "Followed", value: "followed" },
  { label: "MMO", value: "mmo" },
  { label: "ARPG", value: "arpg" },
  { label: "MOBA", value: "moba" },
];

function getInitials(title: string) {
  return title
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 3);
}

function getFilteredGamesByChip(
  games: GameSeasonCard[],
  activeFilter: DashboardFilter,
  currentDate: Date,
  followedGameIds: string[]
) {
  if (activeFilter === "active") {
    return getActiveSeasonCards(games, currentDate);
  }

  if (activeFilter === "starting") {
    return getStartingSoonSeasonCards(games, currentDate);
  }

  if (activeFilter === "followed") {
    return getFollowedSeasonCards(games, followedGameIds);
  }

  if (activeFilter === "mmo") {
    return games.filter((game) => game.genre === "MMORPG");
  }

  if (activeFilter === "arpg") {
    return games.filter((game) => game.genre === "ARPG");
  }

  if (activeFilter === "moba") {
    return games.filter((game) => game.genre === "MOBA");
  }

  return games;
}

function getVisibleSections(
  sections: SeasonSectionConfig[],
  activeFilter: DashboardFilter
) {
  if (activeFilter === "active") {
    return sections.filter((section) => section.title === "Active Seasons");
  }

  if (activeFilter === "starting") {
    return sections.filter((section) => section.title === "Starting Soon");
  }

  if (activeFilter === "followed") {
    return sections.filter((section) => section.title === "Followed Games");
  }

  return sections;
}

function DashboardStatCard({
  className,
  icon: Icon,
  label,
  value,
}: {
  className: string;
  icon: typeof Gamepad2;
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-h-16 items-center gap-3 border-white/10 px-4 py-3 sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-md shadow-lg shadow-black/20 ring-1 ring-white/10",
          className
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="font-mono text-xl font-semibold leading-none text-white">
          {value}
        </p>
        <p className="mt-1 truncate text-xs text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

function FilterChips({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: DashboardFilter;
  onFilterChange: (filter: DashboardFilter) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterChips.map((chip) => {
        const isActive = activeFilter === chip.value;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "h-9 rounded-md border px-3 text-sm font-medium transition",
              isActive
                ? "border-violet-300/40 bg-violet-500/30 text-violet-100 shadow-lg shadow-violet-950/15"
                : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10 hover:text-white"
            )}
            key={chip.value}
            onClick={() => onFilterChange(chip.value)}
            type="button"
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

function SeasonSection({
  accentClassName,
  description,
  emptyMessage,
  games,
  icon: Icon,
  now,
  title,
}: SeasonSectionConfig & {
  now: Date;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/80 shadow-xl shadow-black/20 ring-1 ring-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-md ring-1 ring-white/10",
              accentClassName
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="font-mono text-lg font-semibold text-white">
              {title}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-400">{description}</p>
          </div>
        </div>
        <Badge className="border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
          {games.length}
        </Badge>
      </div>

      {games.length > 0 ? (
        <ul className="divide-y divide-white/10">
          {games.map((game) => (
            <SeasonRow game={game} key={game.id} now={now} />
          ))}
        </ul>
      ) : (
        <div className="p-5 text-sm text-zinc-400">{emptyMessage}</div>
      )}
    </section>
  );
}

function SeasonRow({ game, now }: { game: GameSeasonCard; now: Date }) {
  const startDate = formatSeasonDate(game.season.startDate);
  const endDate = formatSeasonDate(game.season.endDate);
  const initials = getInitials(game.title);

  return (
    <li className="group grid gap-4 px-4 py-4 transition hover:bg-white/[0.035] sm:grid-cols-[minmax(0,1fr)_minmax(160px,0.55fr)_auto] sm:items-center sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          aria-label={`View ${game.title}`}
          className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/5 font-mono text-xs font-semibold text-violet-100 shadow-lg shadow-black/15"
          href={`/games/${game.id}`}
        >
          {game.image ? (
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="48px"
              src={game.image}
            />
          ) : (
            initials
          )}
        </Link>

        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Link
              className="truncate text-base font-semibold text-zinc-50 transition hover:text-violet-200"
              href={`/games/${game.id}`}
            >
              {game.title}
            </Link>
            <Badge className="h-5 border-violet-300/20 bg-violet-500/20 px-2 text-[11px] text-violet-100">
              {game.genre === "MMORPG" ? "MMO" : game.genre}
            </Badge>
          </div>
          <p className="mt-1 truncate text-sm text-zinc-400">
            {game.season.title} · {game.season.type}
          </p>
        </div>
      </div>

      <div className="grid min-w-0 gap-1 text-sm text-zinc-400 sm:text-right">
        <div className="flex items-center gap-2 sm:justify-end">
          <CalendarClock className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {startDate} - {endDate}
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300 sm:justify-end">
          <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="font-mono text-xs">
            {getRemainingTime(game.season.endDate, now)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        <FollowGameButton
          className="size-9 rounded-md border-violet-300/10 bg-violet-500/20 p-0 text-white hover:bg-violet-500/30"
          gameId={game.gameId}
          iconClassName="size-4"
          showLabel={false}
        />
        <Link
          aria-label={`Open ${game.title} details`}
          className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
          href={`/games/${game.id}`}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

export function SeasonDashboard({
  games,
  now,
}: {
  games: GameSeasonCard[];
  now: string;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<DashboardFilter>("all");
  const currentDate = useMemo(() => new Date(now), [now]);
  const { followedGameIds } = useFollowedGames();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const searchedGames = useMemo(
    () => getSearchFilteredSeasonCards(games, debouncedSearch),
    [debouncedSearch, games]
  );
  const filteredGames = useMemo(
    () =>
      getFilteredGamesByChip(
        searchedGames,
        activeFilter,
        currentDate,
        followedGameIds
      ),
    [activeFilter, currentDate, followedGameIds, searchedGames]
  );
  const dashboardData = useMemo(
    () => ({
      activeGames: getActiveSeasonCards(filteredGames, currentDate),
      followedGames: getFollowedSeasonCards(filteredGames, followedGameIds),
      startingSoonGames: getStartingSoonSeasonCards(filteredGames, currentDate),
      stats: getDashboardStats(filteredGames, currentDate),
    }),
    [currentDate, filteredGames, followedGameIds]
  );

  const stats = [
    {
      label: "Tracked Games",
      value: dashboardData.stats.trackedGames,
      icon: Gamepad2,
      className: "bg-violet-500/20 text-violet-200",
    },
    {
      label: "Active Seasons",
      value: dashboardData.stats.activeSeasons,
      icon: Flame,
      className: "bg-sky-500/20 text-sky-200",
    },
    {
      label: "Starting Soon",
      value: dashboardData.stats.startingSoon,
      icon: Hourglass,
      className: "bg-emerald-500/20 text-emerald-200",
    },
    {
      label: "Following",
      value: followedGameIds.length,
      icon: Heart,
      className: "bg-rose-500/20 text-rose-200",
    },
  ];
  const sections = getVisibleSections(
    [
      {
        accentClassName: "bg-sky-500/15 text-sky-200",
        description: "Live seasons currently in progress.",
        emptyMessage: "No active seasons match the current filters.",
        games: dashboardData.activeGames,
        icon: Flame,
        title: "Active Seasons",
      },
      {
        accentClassName: "bg-emerald-500/15 text-emerald-200",
        description: "Upcoming starts inside the next 30 days.",
        emptyMessage: "No seasons are starting soon.",
        games: dashboardData.startingSoonGames,
        icon: Hourglass,
        title: "Starting Soon",
      },
      {
        accentClassName: "bg-violet-500/15 text-violet-200",
        description: "Seasons from games you follow.",
        emptyMessage: "No followed games yet. Follow games to keep them here.",
        games: dashboardData.followedGames,
        icon: Layers3,
        title: "Followed Games",
      },
    ],
    activeFilter
  );

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        <SiteHeader searchValue={search} onSearchChange={setSearch} />

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-300">
              Season overview
            </p>
            <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Track active, upcoming, and followed seasons in one compact view.
            </p>
          </div>

          <FilterChips
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <Card className="grid overflow-hidden rounded-lg border-white/10 bg-[#10182b]/70 text-white shadow-xl shadow-black/20 ring-1 ring-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard
              className={stat.className}
              icon={stat.icon}
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </Card>

        <div className="grid gap-5">
          {sections.map((section) => (
            <SeasonSection key={section.title} now={currentDate} {...section} />
          ))}
        </div>
      </section>
    </main>
  );
}
