"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Gamepad2,
  Hourglass,
  TimerReset,
} from "lucide-react";

import { GameCard } from "@/src/components/game-card";
import { SiteHeader } from "@/src/components/site-header";
import { Card } from "@/src/components/ui/card";
import {
  getActiveSeasonCards,
  getDashboardStats,
  getEndingSoonSeasonCards,
  getFollowedSeasonCards,
  getSearchFilteredSeasonCards,
  getStartingSoonSeasonCards,
  type GameSeasonCard,
} from "@/src/features/games/selectors";
import { useFollowedGames } from "@/src/hooks/use-followed-games";

function SeasonSection({
  borderClassName,
  emptyMessage,
  games,
  title,
}: {
  borderClassName: string;
  emptyMessage: string;
  games: GameSeasonCard[];
  title: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className={`border-l-4 pl-4 font-mono text-xl font-semibold ${borderClassName}`}
        >
          {title}
        </h2>
        <a className="text-sm text-violet-300" href="#">
          View all
        </a>
      </div>

      {games.length > 0 ? (
        <div className="space-y-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
          {emptyMessage}
        </Card>
      )}
    </section>
  );
}

export function SeasonDashboard({ games }: { games: GameSeasonCard[] }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { followedGameIds } = useFollowedGames();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const filteredGames = useMemo(
    () => getSearchFilteredSeasonCards(games, debouncedSearch),
    [debouncedSearch, games]
  );
  const dashboardData = useMemo(
    () => ({
      activeGames: getActiveSeasonCards(filteredGames),
      endingSoonGames: getEndingSoonSeasonCards(filteredGames),
      followedGames: getFollowedSeasonCards(filteredGames, followedGameIds),
      startingSoonGames: getStartingSoonSeasonCards(filteredGames),
      stats: getDashboardStats(filteredGames),
    }),
    [filteredGames, followedGameIds]
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
      icon: CalendarClock,
      className: "bg-sky-500/20 text-sky-200",
    },
    {
      label: "Starting Soon",
      value: dashboardData.stats.startingSoon,
      icon: Hourglass,
      className: "bg-emerald-500/20 text-emerald-200",
    },
    {
      label: "Ending Soon",
      value: dashboardData.stats.endingSoon,
      icon: TimerReset,
      className: "bg-rose-500/20 text-rose-200",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        <SiteHeader searchValue={search} onSearchChange={setSearch} />

        <div>
          <h1 className="font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            Welcome!
          </h1>
          <p className="mt-2 text-base text-zinc-400">
            Site is currently under construction, check back later for more features and improvements.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="flex-row items-center gap-4 border-white/10 bg-[#10182b]/90 p-5 text-white"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-full ${stat.className}`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-mono text-3xl font-semibold">
                    {stat.value}
                  </p>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <SeasonSection
          borderClassName="border-sky-400"
          emptyMessage="No followed games yet. Follow games to keep them here."
          games={dashboardData.followedGames}
          title="My Games"
        />

        <SeasonSection
          borderClassName="border-violet-400"
          emptyMessage="No active seasons match your search."
          games={dashboardData.activeGames}
          title="Active Seasons"
        />

        <SeasonSection
          borderClassName="border-emerald-400"
          emptyMessage="No seasons are starting soon."
          games={dashboardData.startingSoonGames}
          title="Starting Soon"
        />

        <SeasonSection
          borderClassName="border-rose-400"
          emptyMessage="No seasons are ending soon."
          games={dashboardData.endingSoonGames}
          title="Ending Soon"
        />
      </section>
    </main>
  );
}
