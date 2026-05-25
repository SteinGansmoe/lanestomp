"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  ChevronRight,
  ClipboardCheck,
  Clock3,
} from "lucide-react";

import { FollowGameButton } from "@/src/components/follow-game-button";
import { Badge } from "@/src/components/ui/badge";
import type { GameSeasonCard } from "@/src/features/games/selectors";
import { formatSeasonDate, getRemainingTime } from "@/src/lib/season";

function getInitials(title: string) {
  return title
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 3);
}

export function SeasonListRow({
  game,
  now,
}: {
  game: GameSeasonCard;
  now: Date;
}) {
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
            {game.season.title} - {game.season.type}
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
          aria-label={`Open ${game.title} planning board`}
          className="hidden h-9 items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-500/10 px-3 text-sm text-emerald-100 transition hover:bg-emerald-500/20 sm:inline-flex"
          href={`/games/${game.seasonId}/planning`}
        >
          <ClipboardCheck className="size-4" aria-hidden="true" />
          Plan
        </Link>
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
