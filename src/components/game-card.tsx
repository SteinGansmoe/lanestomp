"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  Gamepad2,
  MoreVertical,
  Trophy,
} from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { FollowGameButton } from "@/src/components/follow-game-button";
import { Card, CardContent } from "@/src/components/ui/card";
import type { GameSeasonCard } from "@/src/features/games/selectors";
import {
  formatSeasonDate,
  getRemainingTime,
  getSeasonProgress,
} from "@/src/lib/season";

const gameCardBackgrounds: Record<string, string> = {
  "diablo-4": "/images/diablo-gamecard.jpg",
  "last-epoch": "/images/le-gamecard.jpg",
  "league-of-legends": "/images/leagueoflegends-gamecard.jpg",
  "path-of-exile": "/images/pathofexile-gamecard.jpg",
  "world-of-warcraft": "/images/wowmidnight-gamecard.jpg",
};

function getGameCardBackground(game: GameSeasonCard) {
  return gameCardBackgrounds[game.gameId] ?? game.detailImage ?? game.image;
}

export function GameCard({
  game,
  now,
}: {
  game: GameSeasonCard;
  now: Date;
}) {
  const progress = getSeasonProgress(
    game.season.startDate,
    game.season.endDate,
    now
  );
  const startDate = formatSeasonDate(game.season.startDate);
  const endDate = formatSeasonDate(game.season.endDate);
  const backgroundImage = getGameCardBackground(game);
  const initials = game.title
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 3);

  return (
    <Card
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-[#081120] p-0 text-white shadow-xl shadow-black/25 ring-1 ring-white/5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/35 hover:shadow-violet-500/10"
    >
      {backgroundImage ? (
        <div
          className="absolute inset-y-0 left-0 hidden w-[42%] sm:block"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundPosition: "center 32%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            maskImage:
              "linear-gradient(90deg, black 0%, black 58%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, black 0%, black 58%, transparent 100%)",
          }}
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#081120]/35 to-[#081120]" />
      <CardContent className="relative grid min-h-32 gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_228px_304px]">
        <div className="flex min-w-0 flex-col items-center justify-center gap-5 px-5 py-5 text-center sm:flex-row sm:justify-start sm:text-left md:px-8">
          <div className="relative hidden size-[86px] shrink-0 overflow-hidden rounded-lg border border-violet-400/60 bg-black/25 shadow-lg shadow-violet-950/30 sm:flex">
            {game.image ? (
              <Image
                src={game.image}
                alt={`${game.title} game art`}
                fill
                sizes="86px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center font-mono text-xl font-bold text-violet-100">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h3 className="truncate text-lg font-semibold text-zinc-50">
                <Link
                  className="transition hover:text-violet-200"
                  href={`/games/${game.id}`}
                >
                  {game.title}
                </Link>
              </h3>
              <Badge className="h-5 w-fit border-violet-300/20 bg-violet-500/35 px-2 text-[11px] font-medium text-violet-100">
                {game.season.type}
              </Badge>
            </div>
            <p className="mt-2 text-base font-semibold text-zinc-50">
              {game.season.title}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-zinc-400 sm:justify-start">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              <span>
                {startDate} - {endDate}
              </span>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center justify-center gap-2 border-t border-white/10 px-5 py-5 text-center sm:items-start sm:text-left lg:border-l lg:border-t-0 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Clock3 className="size-3.5" aria-hidden="true" />
            <span>Ends in</span>
          </div>
          <p className="whitespace-nowrap font-mono text-lg font-bold text-rose-400 sm:text-xl">
            {getRemainingTime(game.season.endDate, now)}
          </p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-full max-w-36 overflow-hidden rounded-full bg-slate-700/70">
              <div
                className="h-full rounded-full bg-linear-to-r from-rose-400 to-pink-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="whitespace-nowrap text-xs text-zinc-400">
              {progress}%
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-center gap-3 border-t border-white/10 px-5 py-5 sm:justify-start lg:border-l lg:border-t-0 lg:px-8">
          <ActionIconLink
            href={`/games/${game.id}`}
            icon={ExternalLink}
            label="View details"
          />
          <ActionIconButton icon={Gamepad2} label="Game hub" />
          <ActionIconButton icon={Trophy} label="Season rewards" />
          <FollowGameButton
            className="size-10 rounded-md border-violet-300/10 bg-violet-500/35 p-0 text-white shadow-lg shadow-violet-950/20 hover:bg-violet-500/45"
            gameId={game.id}
            iconClassName="size-5"
            showLabel={false}
          />
          <ActionIconButton
            className="border-transparent bg-transparent text-zinc-500 hover:bg-transparent hover:text-zinc-300 sm:ml-auto"
            icon={MoreVertical}
            label="More actions"
          />
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
      className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/5 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
      href={href}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Link>
  );
}

function ActionIconButton({
  className,
  icon: Icon,
  label,
}: {
  className?: string;
  icon: typeof ExternalLink;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className={`flex size-10 shrink-0 items-center justify-center rounded-md border border-white/5 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white ${className ?? ""}`}
      type="button"
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
