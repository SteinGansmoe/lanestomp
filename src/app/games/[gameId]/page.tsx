import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  CommunityLinks,
  GameDetailHero,
  GameStatusSummary,
  GameTimeline,
  PopularCreators,
  RelatedGames,
  ResourceGroups,
  type RelatedGameCard,
} from "@/src/components/game-detail";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import {
  getGameDetailBySeasonSlug,
  getPrimarySeasonRouteForGame,
  getSeasonCardStaticParams,
  type Season,
} from "@/src/features";
import { supabase } from "@/src/lib/supabase";

type GameDetailPageProps = {
  params: Promise<{ gameId: string }>;
};

type SupabaseSeason = {
  created_at: string;
  description: string | null;
  ends_at: string;
  game_id: string;
  id: string;
  name: string;
  slug: string;
  starts_at: string;
};

const supabaseFetchTimeoutMs = 8_000;

export function generateStaticParams() {
  return getSeasonCardStaticParams();
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameId } = await params;
  const game = getGameDetailBySeasonSlug(gameId);

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

  const seasonsResult = await getSupabaseSeasonsForGame(game.id);

  if (seasonsResult.error) {
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
          <Card className="mt-8 border-rose-400/20 bg-[#10182b]/90 p-8 text-white">
            <CardTitle className="font-mono text-2xl">
              Could not load seasons
            </CardTitle>
            <p className="mt-3 text-zinc-400">
              Season Tracker could not fetch seasons from Supabase right now.
            </p>
            <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-rose-100">
              {seasonsResult.error}
            </p>
          </Card>
        </div>
      </main>
    );
  }

  const gameWithLiveSeasons = {
    ...game,
    seasons: seasonsResult.seasons,
    selectedSeason: getFeaturedSeason(seasonsResult.seasons),
  };
  const selectedSeason = gameWithLiveSeasons.selectedSeason;

  if (!selectedSeason) {
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
            <CardTitle className="font-mono text-2xl">
              No seasons found
            </CardTitle>
            <p className="mt-3 text-zinc-400">
              This game does not have any seasons in Supabase yet.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  const nextTimelineEvent = getNextTimelineEvent(game.timelineEvents);
  const relatedGames: RelatedGameCard[] = gameWithLiveSeasons.relatedGames.map(
    (relatedGame) => ({
      ...relatedGame,
      href: getPrimarySeasonRouteForGame(relatedGame.id),
    })
  );

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex max-w-6xl flex-col gap-6">
          <GameDetailHero
            followGameId={selectedSeason.slug}
            game={gameWithLiveSeasons}
            season={selectedSeason}
          />
          <GameStatusSummary
            nextEvent={nextTimelineEvent}
            season={selectedSeason}
          />
          <GameTimeline events={gameWithLiveSeasons.timelineEvents} />
          <ResourceGroups groups={gameWithLiveSeasons.resourceGroups} />
          <PopularCreators creators={gameWithLiveSeasons.creators} />
          <CommunityLinks links={gameWithLiveSeasons.communityLinks} />
          <RelatedGames games={relatedGames} />

          <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white">
            <p className="text-sm text-zinc-400">
              Following this game keeps it visible on your My Games page.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}

async function getSupabaseSeasonsForGame(gameId: string) {
  if (!supabase) {
    return {
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      seasons: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from("seasons")
      .select("id, game_id, name, slug, starts_at, ends_at, description, created_at")
      .eq("game_id", gameId)
      .order("starts_at", { ascending: true })
      .abortSignal(AbortSignal.timeout(supabaseFetchTimeoutMs));

    if (error) {
      return {
        error: error.message,
        seasons: [],
      };
    }

    return {
      error: null,
      seasons: ((data ?? []) as SupabaseSeason[]).map(toSeason),
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
      seasons: [],
    };
  }
}

function toSeason(season: SupabaseSeason): Season {
  return {
    createdAt: season.created_at,
    endDate: toDateOnly(season.ends_at),
    gameId: season.game_id,
    id: season.id,
    slug: season.slug,
    startDate: toDateOnly(season.starts_at),
    title: season.name,
    type: "Season",
    updatedAt: season.created_at,
  };
}

function getActiveSeason(seasons: Season[], now = new Date()) {
  const nowTime = now.getTime();

  return seasons.find((season) => {
    const startTime = new Date(`${season.startDate}T00:00:00`).getTime();
    const endTime = new Date(`${season.endDate}T23:59:59`).getTime();

    return startTime <= nowTime && endTime >= nowTime;
  });
}

function getUpcomingSeason(seasons: Season[], now = new Date()) {
  const nowTime = now.getTime();

  return seasons.find(
    (season) => new Date(`${season.startDate}T00:00:00`).getTime() > nowTime
  );
}

function getEndedSeason(seasons: Season[], now = new Date()) {
  const nowTime = now.getTime();

  return [...seasons]
    .reverse()
    .find(
      (season) => new Date(`${season.endDate}T23:59:59`).getTime() < nowTime
    );
}

function getFeaturedSeason(seasons: Season[]) {
  return (
    getActiveSeason(seasons) ??
    getUpcomingSeason(seasons) ??
    getEndedSeason(seasons)
  );
}

function toDateOnly(value: string) {
  return value.slice(0, 10);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Supabase error.";
}

function getNextTimelineEvent(events: { startDate: string; title: string }[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.find(
    (event) => new Date(`${event.startDate}T00:00:00`).getTime() >= today.getTime()
  );
}
