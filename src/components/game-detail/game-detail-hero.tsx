import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  ExternalLink,
  Gamepad2,
  MoreVertical,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { FollowGameButton } from "@/src/components/follow-game-button";
import { Badge } from "@/src/components/ui/badge";
import type { Game, Season } from "@/src/features";

export function GameDetailHero({
  followGameId,
  game,
  planningHref,
  season,
}: {
  followGameId: string;
  game: Pick<Game, "description" | "detailImage" | "id" | "image" | "title">;
  planningHref: string;
  season: Pick<Season, "title" | "type">;
}) {
  const heroImage = game.detailImage || game.image;
  const heroBackgroundImage = heroImage
    ? { backgroundImage: `url("${heroImage}")` }
    : undefined;
  const initials = game.title
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 3);

  return (
    <section className="group relative isolate -mx-4 min-h-[720px] overflow-hidden bg-[#050b18] sm:-mx-6 sm:min-h-[680px] lg:-mx-8 xl:min-h-[720px]">
      <div
        className="absolute inset-0 bg-cover bg-[center_top] opacity-90 transition duration-1000 group-hover:scale-[1.025] md:bg-center"
        style={heroBackgroundImage}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-r from-[#050b18] via-[#050b18]/72 to-[#050b18]/12"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-[#050b18] via-[#050b18]/38 to-black/55"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_55%,rgba(124,58,237,0.28),transparent_42%),radial-gradient(ellipse_at_72%_28%,rgba(244,63,94,0.24),transparent_46%),radial-gradient(ellipse_at_55%_88%,rgba(16,185,129,0.13),transparent_38%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(0,0,0,0.42)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-[#050b18] via-[#050b18]/88 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex min-h-[720px] flex-col px-5 py-6 sm:min-h-[680px] sm:px-7 sm:py-8 lg:min-h-[720px] lg:px-10 lg:py-10">
        <Link
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-medium text-violet-100 shadow-lg shadow-black/20 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-black/50 hover:text-white"
          href="/"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to games
        </Link>

        <div className="mt-10 flex max-w-5xl flex-col gap-8 pb-20 sm:mt-12 sm:flex-row sm:items-start lg:mt-14 lg:gap-10 xl:pb-24">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-black/35 shadow-2xl shadow-black/35 backdrop-blur sm:mt-2 sm:size-36">
            {game.image ? (
              <Image
                src={game.image}
                alt={`${game.title} game art`}
                fill
                sizes="144px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center font-mono text-3xl font-semibold text-violet-100">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent ring-1 ring-inset ring-white/10" />
          </div>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="w-fit border-violet-300/20 bg-violet-500/55 px-3 py-1 text-violet-50 shadow-lg shadow-violet-950/20 backdrop-blur">
                {season.type}
              </Badge>
              <span className="text-base font-semibold text-zinc-100 drop-shadow">
                {season.title}
              </span>
            </div>
            <h1 className="mt-6 max-w-4xl break-words font-mono text-5xl font-semibold leading-[0.9] tracking-normal text-white drop-shadow-2xl sm:text-7xl lg:text-8xl">
              {game.title}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-zinc-200 drop-shadow sm:text-lg">
              {game.description?.trim() ||
                "Track the active season, upcoming events, resources, creators, and community links in one place."}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex h-12 items-center gap-2 rounded-md border border-emerald-300/25 bg-emerald-400 px-5 text-sm font-semibold text-emerald-950 shadow-xl shadow-emerald-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-300"
                href={planningHref}
              >
                <ClipboardCheck className="size-4" aria-hidden="true" />
                Planning board
              </Link>
              <FollowGameButton
                className="h-12 rounded-md border-violet-300/20 bg-violet-500/30 px-5 text-white shadow-lg shadow-violet-950/25 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500/45"
                gameId={followGameId}
              />
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 p-1 opacity-80 backdrop-blur transition duration-200 hover:opacity-100">
                <HeroIconButton icon={ExternalLink} label="Open official site" />
                <HeroIconButton icon={Gamepad2} label="Game hub" />
                <HeroIconButton icon={Trophy} label="Season rewards" />
                <HeroIconButton icon={MoreVertical} label="More actions" />
              </div>
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
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition duration-200 hover:bg-white/10 hover:text-white"
      type="button"
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
