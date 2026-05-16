import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, ExternalLink } from "lucide-react";

import { FollowGameButton } from "@/src/components/follow-game-button";
import { SiteHeader } from "@/src/components/site-header";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { games } from "@/src/data/games";
import {
  formatSeasonDate,
  getRemainingTime,
  getSeasonProgress,
} from "@/src/lib/season";

type GameDetailPageProps = {
  params: Promise<{ gameId: string }>;
};

export function generateStaticParams() {
  return games.map((game) => ({
    gameId: game.id,
  }));
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameId } = await params;
  const game = games.find((item) => item.id === gameId);

  if (!game) {
    return (
      <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
          <SiteHeader />
          <Link
            className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200"
            href="/"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to dashboard
          </Link>
          <Card className="mt-8 border-white/10 bg-[#10182b]/90 p-8 text-white">
            <CardTitle className="font-mono text-2xl">Game not found</CardTitle>
            <p className="mt-3 text-zinc-400">
              We could not find a game matching that page.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  const progress = getSeasonProgress(game.season.startDate, game.season.endDate);
  const heroBackgroundImage = game.detailImage
    ? {
        backgroundImage: `linear-gradient(90deg, rgba(14, 23, 41, 0.96) 0%, rgba(14, 23, 41, 0.72) 44%, rgba(14, 23, 41, 0.2) 100%), linear-gradient(0deg, rgba(14, 23, 41, 0.2), rgba(14, 23, 41, 0.2)), url('${game.detailImage}')`,
      }
    : undefined;

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex max-w-5xl flex-col gap-6">
          <Link
            className="inline-flex w-fit items-center gap-2 text-sm text-violet-300 hover:text-violet-200"
            href="/"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to dashboard
          </Link>

          <section
            className="overflow-hidden rounded-xl border border-white/10 bg-[#0e1729]/95 bg-cover bg-center p-6 shadow-xl shadow-black/20"
            style={heroBackgroundImage}
          >
            <div className="flex min-h-40 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  Current season
                </p>
                <h1 className="mt-2 font-mono text-4xl font-semibold">
                  {game.title}
                </h1>
                <p className="mt-3 text-xl text-zinc-100">
                  {game.season.title}
                </p>
              </div>
              <Badge className="w-fit border-violet-300/20 bg-violet-500/50 px-3 py-1 text-violet-100 backdrop-blur">
                {game.season.type}
              </Badge>
              <FollowGameButton
                className="w-fit backdrop-blur"
                gameId={game.id}
              />
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-white/10 bg-[#10182b]/90 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Start date
                </CardTitle>
              </CardHeader>
              <CardContent className="font-mono text-2xl font-semibold">
                {formatSeasonDate(game.season.startDate)}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#10182b]/90 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  End date
                </CardTitle>
              </CardHeader>
              <CardContent className="font-mono text-2xl font-semibold">
                {formatSeasonDate(game.season.endDate)}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#10182b]/90 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-zinc-400">
                  <Clock3 className="size-4" aria-hidden="true" />
                  Ends in
                </CardTitle>
              </CardHeader>
              <CardContent className="font-mono text-2xl font-semibold text-rose-400">
                {getRemainingTime(game.season.endDate)}
              </CardContent>
            </Card>
          </div>

        <Card className="border-white/10 bg-[#10182b]/90 text-white">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Season progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-2 overflow-hidden rounded-full bg-slate-700/70">
              <div
                className="h-full rounded-full bg-linear-to-r from-rose-400 to-violet-400"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-zinc-400">{progress}% complete</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#10182b]/90 text-white">
          <CardHeader>
            <CardTitle className="font-mono text-xl">Resources</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {game.resources.map((resource) => (
              <a
                target="_blank"
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 transition hover:bg-white/10"
                href={resource.href}
                key={resource.label}
              >
                {resource.label}
                <ExternalLink
                  className="size-4 text-zinc-400"
                  aria-hidden="true"
                />
              </a>
            ))}
          </CardContent>
        </Card>
        </div>
      </div>
    </main>
  );
}
