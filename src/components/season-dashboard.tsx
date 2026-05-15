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
import type { Game } from "@/src/data/games";

function isEndingSoon(game: Game) {
  const end = new Date(`${game.season.endDate}T23:59:59`).getTime();
  const now = new Date().getTime();
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

  return daysLeft >= 0 && daysLeft <= 30;
}

function isStartingSoon(game: Game) {
  const start = new Date(`${game.season.startDate}T00:00:00`).getTime();
  const now = new Date().getTime();
  const daysUntilStart = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

  return daysUntilStart >= 0 && daysUntilStart <= 30;
}

function gameMatchesSearch(game: Game, search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [
    game.title,
    game.genre,
    game.season.title,
    game.season.type,
    game.season.startDate,
    game.season.endDate,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearch);
}

export function SeasonDashboard({ games }: { games: Game[] }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const filteredGames = useMemo(
    () => games.filter((game) => gameMatchesSearch(game, debouncedSearch)),
    [debouncedSearch, games]
  );

  const stats = [
    {
      label: "Tracked Games",
      value: filteredGames.length,
      icon: Gamepad2,
      className: "bg-violet-500/20 text-violet-200",
    },
    {
      label: "Active Seasons",
      value: filteredGames.length,
      icon: CalendarClock,
      className: "bg-sky-500/20 text-sky-200",
    },
    {
      label: "Starting Soon",
      value: filteredGames.filter(isStartingSoon).length,
      icon: Hourglass,
      className: "bg-emerald-500/20 text-emerald-200",
    },
    {
      label: "Ending Soon",
      value: filteredGames.filter(isEndingSoon).length,
      icon: TimerReset,
      className: "bg-rose-500/20 text-rose-200",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <SiteHeader searchValue={search} onSearchChange={setSearch} />

        <div>
          <h1 className="font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            Welcome back!
          </h1>
          <p className="mt-2 text-base text-zinc-400">
            Here&apos;s what&apos;s happening in your games.
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

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="border-l-4 border-violet-400 pl-4 font-mono text-xl font-semibold">
              Active Seasons
            </h2>
            <a className="text-sm text-violet-300" href="#">
              View all
            </a>
          </div>

          {filteredGames.length > 0 ? (
            <div className="space-y-4">
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
              No games match your search.
            </Card>
          )}
        </section>
      </section>
    </main>
  );
}
