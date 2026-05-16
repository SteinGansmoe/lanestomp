"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Gamepad2,
  Trophy,
} from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { FollowGameButton } from "@/src/components/follow-game-button";
import { Card, CardContent } from "@/src/components/ui/card";
import type { Game } from "@/src/data/games";
import {
  formatSeasonDate,
  getRemainingTime,
  getSeasonProgress,
} from "@/src/lib/season";

export function GameCard({ game }: { game: Game }) {
  const progress = getSeasonProgress(game.season.startDate, game.season.endDate);
  const startDate = formatSeasonDate(game.season.startDate);
  const endDate = formatSeasonDate(game.season.endDate);
  const initials = game.title
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 3);

  return (
    <Card className="group overflow-hidden border-white/10 bg-[#0e1729]/95 p-0 text-white shadow-xl shadow-black/25 ring-1 ring-white/5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-[#111c32] hover:shadow-violet-500/10">
      <CardContent className="grid gap-0 p-0 md:grid-cols-[180px_minmax(0,1fr)_160px] xl:grid-cols-[180px_minmax(220px,1fr)_160px_200px]">
        <div className="relative aspect-[16/9] self-stretch overflow-hidden rounded-t-xl md:aspect-auto md:h-full md:min-h-[132px] md:rounded-l-xl md:rounded-r-none">
          {game.image ? (
            <>
              <Image
                src={game.image}
                alt={`${game.title} game art`}
                fill
                sizes="(min-width: 768px) 180px, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0e1729]/35" />
            </>
          ) : (
            <div className="flex h-full min-h-32 items-center justify-center bg-linear-to-br from-violet-500/25 via-slate-900 to-cyan-500/15 md:min-h-0">
              <div className="flex size-20 items-center justify-center rounded-2xl border border-white/10 bg-black/20 font-mono text-2xl font-bold text-violet-100 shadow-inner shadow-white/5">
                {initials}
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-2 px-5 py-4">
          <h3 className="truncate text-base font-semibold text-zinc-50">
            {game.title}
          </h3>
          <Badge className="h-6 w-fit border-violet-300/20 bg-violet-500/20 px-2.5 text-[11px] text-violet-200">
            {game.season.type}
          </Badge>
          <FollowGameButton className="w-fit" gameId={game.id} />
          <p className="text-base font-medium text-zinc-100">
            {game.season.title}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-2 border-t border-white/10 px-5 py-4 md:border-l md:border-t-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock3 className="size-3.5" aria-hidden="true" />
            <span>Ends in</span>
          </div>
          <p className="whitespace-nowrap font-mono text-xl font-bold text-rose-400">
            {getRemainingTime(game.season.endDate)}
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/70">
            <div
              className="h-full rounded-full bg-linear-to-r from-rose-400 to-rose-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400">{progress}% complete</p>
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-3 border-t border-white/10 px-5 py-4 md:col-span-3 xl:col-span-1 xl:border-l xl:border-t-0">
          <p className="text-xs text-zinc-400">Quick Links</p>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Button
              aria-label={`${game.title} official site`}
              className="size-9 rounded-md border border-white/10 bg-white/5 p-0 text-zinc-200 hover:bg-white/10"
              variant="ghost"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label={`${game.title} game hub`}
              className="size-9 rounded-md border border-white/10 bg-white/5 p-0 text-zinc-200 hover:bg-white/10"
              variant="ghost"
            >
              <Gamepad2 className="size-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label={`${game.title} season rewards`}
              className="size-9 rounded-md border border-white/10 bg-white/5 p-0 text-zinc-200 hover:bg-white/10"
              variant="ghost"
            >
              <Trophy className="size-4" aria-hidden="true" />
            </Button>
            <Button
              asChild
              className="h-9 rounded-md bg-white/5 px-3 text-sm text-zinc-100 hover:bg-white/10"
            >
              <Link href={`/games/${game.id}`}>More</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
