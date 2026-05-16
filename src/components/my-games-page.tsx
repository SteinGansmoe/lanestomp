"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { GameCard } from "@/src/components/game-card";
import { SiteHeader } from "@/src/components/site-header";
import { Card } from "@/src/components/ui/card";
import type { Game } from "@/src/data/games";
import { useFollowedGames } from "@/src/hooks/use-followed-games";

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

export function MyGamesPage({ games }: { games: Game[] }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { followedGameIds } = useFollowedGames();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const followedGames = useMemo(
    () =>
      games
        .filter((game) => followedGameIds.includes(game.id))
        .filter((game) => gameMatchesSearch(game, debouncedSearch)),
    [debouncedSearch, followedGameIds, games]
  );

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        <SiteHeader searchValue={search} onSearchChange={setSearch} />

        <div>
          <p className="text-sm font-medium text-violet-300">Followed games</p>
          <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            My Games
          </h1>
          <p className="mt-2 max-w-2xl text-base text-zinc-400">
            Keep track of the games you follow and jump back into their season
            details quickly.
          </p>
        </div>

        {followedGames.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="border-l-4 border-sky-400 pl-4 font-mono text-xl font-semibold">
                Followed Games
              </h2>
              <p className="text-sm text-zinc-400">
                {followedGames.length} followed
              </p>
            </div>
            <div className="space-y-4">
              {followedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        ) : (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            <h2 className="font-mono text-xl font-semibold text-white">
              No followed games yet
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-400">
              Follow games from the dashboard or game detail pages and they will
              show up here.
            </p>
            <Link
              className="mx-auto mt-5 inline-flex w-fit rounded-md bg-violet-500/25 px-4 py-2 text-sm text-violet-100 transition hover:bg-violet-500/35"
              href="/"
            >
              Browse games
            </Link>
          </Card>
        )}
      </section>
    </main>
  );
}
