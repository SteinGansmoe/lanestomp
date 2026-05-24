import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Gamepad2,
  Heart,
  MoreVertical,
  Trophy,
} from "lucide-react";

import { FollowGameButton } from "@/src/components/follow-game-button";
import { Badge } from "@/src/components/ui/badge";
import type { Game, Season } from "@/src/features";

export function GameDetailHero({
  followGameId,
  game,
  season,
}: {
  followGameId: string;
  game: Pick<Game, "detailImage" | "id" | "image" | "title">;
  season: Pick<Season, "description" | "title" | "type">;
}) {
  const heroBackgroundImage = game.detailImage
    ? { backgroundImage: `url('${game.detailImage}')` }
    : undefined;
  const initials = game.title
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 3);

  return (
    <section className="relative overflow-hidden rounded-xl border border-white/10 bg-[#10182b] p-5 shadow-xl shadow-black/25 ring-1 ring-white/5 sm:p-7">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={heroBackgroundImage}
        aria-hidden="true"
      />

      <div className="relative">
        <Link
          className="inline-flex w-fit items-center gap-2 rounded-md bg-[#081120]/35 px-2 py-1 text-sm text-violet-200 shadow-lg shadow-black/20 transition hover:text-violet-100"
          href="/"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to games
        </Link>

        <div className="mt-8 flex min-h-52 flex-col gap-7 sm:flex-row sm:items-start">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/30 shadow-lg shadow-black/25 sm:size-32">
            {game.image ? (
              <Image
                src={game.image}
                alt={`${game.title} game art`}
                fill
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center font-mono text-2xl font-semibold text-violet-100">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          </div>

          <div className="max-w-xl self-end rounded-lg bg-[#081120]/45 p-4 shadow-2xl shadow-black/35 ring-1 ring-white/10 sm:self-auto">
            <Badge className="w-fit border-violet-300/20 bg-violet-500/50 px-3 py-1 text-violet-100 backdrop-blur">
              {season.type}
            </Badge>
            <h1 className="mt-4 font-mono text-4xl font-semibold tracking-normal text-white sm:text-5xl">
              {game.title}
            </h1>
            <p className="mt-3 text-2xl font-medium text-zinc-100">
              {season.title}
            </p>
            <p className="mt-5 max-w-lg text-sm leading-6 text-zinc-300">
              {season.description?.trim() ||
                "Track the active season, upcoming events, resources, creators, and community links in one place."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <FollowGameButton
                className="h-10 rounded-md border-violet-300/20 bg-violet-500/45 px-4 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500/55"
                gameId={followGameId}
              />
              <HeroIconButton icon={ExternalLink} label="Open official site" />
              <HeroIconButton icon={Gamepad2} label="Game hub" />
              <HeroIconButton icon={Trophy} label="Season rewards" />
              <HeroIconButton icon={MoreVertical} label="More actions" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroIconButton({
  icon: Icon,
  label,
}: {
  icon: typeof Heart;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
      type="button"
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
