"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Gamepad2, Heart, Layers3 } from "lucide-react";

import { SeasonListRow } from "@/src/components/season-list-row";
import { SiteHeader } from "@/src/components/site-header";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import {
  getFollowedSeasonCards,
  getSearchFilteredSeasonCards,
  type GameSeasonCard,
} from "@/src/features/games/selectors";
import { useFollowedGames } from "@/src/hooks/use-followed-games";
import { cn } from "@/src/lib/utils";

type FollowedGameGroup = {
  gameId: string;
  genre: GameSeasonCard["genre"];
  seasons: GameSeasonCard[];
  title: string;
};

function groupSeasonCardsByGame(games: GameSeasonCard[]) {
  const groupsByGame = new Map<string, FollowedGameGroup>();

  for (const game of games) {
    const existingGroup = groupsByGame.get(game.gameId);

    if (existingGroup) {
      existingGroup.seasons.push(game);
      continue;
    }

    groupsByGame.set(game.gameId, {
      gameId: game.gameId,
      genre: game.genre,
      seasons: [game],
      title: game.title,
    });
  }

  return [...groupsByGame.values()].sort((left, right) =>
    left.title.localeCompare(right.title)
  );
}

function SummaryTile({
  className,
  icon: Icon,
  label,
  value,
}: {
  className: string;
  icon: typeof Heart;
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

export function MyGamesPage({
  games,
  now,
}: {
  games: GameSeasonCard[];
  now: string;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const currentDate = useMemo(() => new Date(now), [now]);
  const { followedGameIds } = useFollowedGames();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const followedGames = useMemo(
    () =>
      getSearchFilteredSeasonCards(
        getFollowedSeasonCards(games, followedGameIds),
        debouncedSearch
      ),
    [debouncedSearch, followedGameIds, games]
  );
  const followedGroups = useMemo(
    () => groupSeasonCardsByGame(followedGames),
    [followedGames]
  );
  const totalFollowedGames = new Set(followedGames.map((game) => game.gameId))
    .size;

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        <SiteHeader searchValue={search} onSearchChange={setSearch} />

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-300">
              Followed games
            </p>
            <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              My Games
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Keep track of followed games and jump back into their season
              details quickly.
            </p>
          </div>
        </div>

        {followedGames.length > 0 ? (
          <>
            <Card className="grid overflow-hidden rounded-lg border-white/10 bg-[#10182b]/70 text-white shadow-xl shadow-black/20 ring-1 ring-white/5 sm:grid-cols-3">
              <SummaryTile
                className="bg-violet-500/20 text-violet-200"
                icon={Heart}
                label="Followed Games"
                value={totalFollowedGames}
              />
              <SummaryTile
                className="bg-sky-500/20 text-sky-200"
                icon={Layers3}
                label="Tracked Seasons"
                value={followedGames.length}
              />
              <SummaryTile
                className="bg-emerald-500/20 text-emerald-200"
                icon={Gamepad2}
                label="Game Groups"
                value={followedGroups.length}
              />
            </Card>

            <div className="grid gap-5">
              {followedGroups.map((group) => (
                <section
                  className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/80 shadow-xl shadow-black/20 ring-1 ring-white/5"
                  key={group.gameId}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-200 ring-1 ring-white/10">
                        <Gamepad2 className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate font-mono text-lg font-semibold text-white">
                          {group.title}
                        </h2>
                        <p className="mt-0.5 text-sm text-zinc-400">
                          {group.seasons.length} followed season
                          {group.seasons.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <Badge className="border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300">
                      {group.genre === "MMORPG" ? "MMO" : group.genre}
                    </Badge>
                  </div>
                  <ul className="divide-y divide-white/10">
                    {group.seasons.map((game) => (
                      <SeasonListRow
                        game={game}
                        key={game.id}
                        now={currentDate}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
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
