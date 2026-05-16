"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Gamepad2,
  MoreVertical,
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
  const [isActionsOpen, setIsActionsOpen] = useState(false);
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
      <CardContent
        className={`grid gap-0 p-0 transition-[grid-template-columns] duration-300 ease-out md:grid-cols-[104px_minmax(0,1fr)_210px] ${
          isActionsOpen
            ? "xl:grid-cols-[104px_minmax(180px,1fr)_210px_360px]"
            : "xl:grid-cols-[104px_minmax(220px,1fr)_210px_210px]"
        }`}
      >
        <div className="relative aspect-[16/9] self-stretch overflow-hidden rounded-t-xl md:aspect-auto md:h-full md:min-h-[92px] md:rounded-l-xl md:rounded-r-none">
          {game.image ? (
            <>
              <Image
                src={game.image}
                alt={`${game.title} game art`}
                fill
                sizes="(min-width: 768px) 104px, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0e1729]/35" />
            </>
          ) : (
            <div className="flex h-full min-h-28 items-center justify-center bg-linear-to-br from-violet-500/25 via-slate-900 to-cyan-500/15 md:min-h-0">
              <div className="flex size-16 items-center justify-center rounded-xl border border-white/10 bg-black/20 font-mono text-xl font-bold text-violet-100 shadow-inner shadow-white/5 md:size-14 md:text-base">
                {initials}
              </div>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-1.5 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-zinc-50">
              <Link
                className="transition hover:text-violet-200"
                href={`/games/${game.id}`}
              >
                {game.title}
              </Link>
            </h3>
            <Badge className="h-5 w-fit border-violet-300/20 bg-violet-500/20 px-2 text-[11px] text-violet-200">
              {game.season.type}
            </Badge>
          </div>
          <p className="text-sm font-medium text-zinc-100">
            {game.season.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-400 sm:text-sm">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-2 border-t border-white/10 px-4 py-3 md:border-l md:border-t-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock3 className="size-3.5" aria-hidden="true" />
            <span>Ends in</span>
          </div>
          <p className="whitespace-nowrap font-mono text-lg font-bold text-rose-400">
            {getRemainingTime(game.season.endDate)}
          </p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-slate-700/70">
              <div
                className="h-full rounded-full bg-linear-to-r from-rose-400 to-rose-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="whitespace-nowrap text-xs text-zinc-400">
              {progress}% complete
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-2 border-t border-white/10 px-4 py-3 md:col-span-3 xl:col-span-1 xl:border-l xl:border-t-0">
          <div className="flex min-w-0 items-center justify-between gap-2 overflow-hidden">
            <FollowGameButton className="h-8 w-fit" gameId={game.id} />
            <div
              className={`flex min-w-0 items-center gap-2 overflow-hidden transition-all duration-300 ease-out ${
                isActionsOpen
                  ? "max-w-[210px] opacity-100"
                  : "max-w-0 opacity-0"
              }`}
            >
              <ActionIconLink
                href={`/games/${game.id}`}
                icon={ExternalLink}
                label="View details"
              />
              <ActionIconButton icon={Gamepad2} label="Game hub" />
              <ActionIconButton icon={Trophy} label="Season rewards" />
              <ActionIconButton icon={ExternalLink} label="Official site" />
            </div>
            <div className="shrink-0">
              <Button
                aria-expanded={isActionsOpen}
                aria-label={`${game.title} more actions`}
                className={`size-8 rounded-md p-0 transition-colors ${
                  isActionsOpen
                    ? "bg-white text-zinc-950 hover:bg-zinc-200"
                    : "bg-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
                }`}
                onClick={() => setIsActionsOpen((current) => !current)}
                type="button"
                variant="ghost"
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionIconLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof ExternalLink;
  label: string;
}) {
  return (
    <Link
      aria-label={label}
      className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 hover:text-white"
      href={href}
    >
      <Icon className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

function ActionIconButton({
  icon: Icon,
  label,
}: {
  icon: typeof ExternalLink;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-200 transition hover:bg-white/10 hover:text-white"
      type="button"
    >
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  );
}
