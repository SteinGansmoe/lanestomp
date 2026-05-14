import Image from "next/image";
import { CalendarDays, Clock3 } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { Game } from "@/src/data/games";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function getDaysUntil(date: string) {
  const end = new Date(`${date}T23:59:59`);
  const now = new Date();

  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getSeasonCountdown(endDate: string) {
  const daysLeft = getDaysUntil(endDate);

  if (daysLeft < 0) {
    return "Season ended";
  }

  if (daysLeft === 0) {
    return "Ends today";
  }

  if (daysLeft === 1) {
    return "1 day left";
  }

  return `${daysLeft} days left`;
}

function getSeasonProgress(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`).getTime();
  const end = new Date(`${endDate}T23:59:59`).getTime();
  const now = new Date().getTime();

  if (now <= start) {
    return 0;
  }

  if (now >= end) {
    return 100;
  }

  return Math.round(((now - start) / (end - start)) * 100);
}

export function GameCard({ game }: { game: Game }) {
  const progress = getSeasonProgress(game.season.startDate, game.season.endDate);

  return (
    <Card className="group border-white/10 bg-[#10182b]/90 p-0 text-white shadow-xl shadow-black/20 ring-white/5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/40 hover:bg-[#121d34] hover:shadow-violet-500/10">
      <div className="grid gap-0 overflow-hidden rounded-xl sm:grid-cols-[14rem_1fr] lg:grid-cols-[17rem_1fr_16rem]">
        <div className="relative aspect-[16/9] min-h-40 overflow-hidden sm:aspect-auto sm:min-h-full">
          <Image
            src={game.image}
            alt={`${game.title} game art`}
            fill
            sizes="(min-width: 1024px) 17rem, (min-width: 640px) 14rem, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-transparent to-[#10182b]/20 sm:to-[#10182b]" />
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-4 p-5">
          <CardHeader className="gap-2 px-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl font-semibold text-white">
                {game.title}
              </CardTitle>
              <CardAction className="col-auto row-auto justify-self-auto">
                <Badge className="bg-violet-500/20 text-violet-200">
                  {game.season.type}
                </Badge>
              </CardAction>
            </div>
            <p className="text-base font-medium text-zinc-100">
              {game.season.title}
            </p>
          </CardHeader>

          <CardContent className="px-0">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <CalendarDays className="size-4" aria-hidden="true" />
              <span>
                {dateFormatter.format(new Date(`${game.season.startDate}T00:00:00`))} -{" "}
                {dateFormatter.format(new Date(`${game.season.endDate}T00:00:00`))}
              </span>
            </div>
          </CardContent>
        </div>

        <div className="flex flex-col justify-center gap-3 border-t border-white/10 p-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock3 className="size-4" aria-hidden="true" />
            <span>Ends in</span>
          </div>
          <p className="text-3xl font-semibold text-rose-400">
            {getSeasonCountdown(game.season.endDate)}
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-700/70">
            <div
              className="h-full rounded-full bg-linear-to-r from-rose-400 to-violet-400"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-zinc-400">{progress}% complete</p>
        </div>
      </div>
    </Card>
  );
}
