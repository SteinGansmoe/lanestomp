import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";

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
  getGameDetailByGameId,
  getGameDetailBySeasonSlug,
  getPrimarySeasonRouteForGame,
  getSeasonCardStaticParams,
  type CommunityLink,
  type CommunityLinkType,
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

type SupabaseGame = {
  created_at: string;
  description: string | null;
  icon_url: string | null;
  id: string;
  name: string;
  slug: string;
};

type SupabaseResource = {
  created_at: string;
  game_id: string;
  icon: string;
  id: string;
  label: string;
  title: string;
  url: string;
};

const supabaseFetchTimeoutMs = 8_000;
const communityLinkTypes = [
  "discord",
  "forum",
  "reddit",
  "social",
  "video",
] satisfies CommunityLinkType[];

export function generateStaticParams() {
  return getSeasonCardStaticParams();
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  await connection();

  const now = new Date();
  const { gameId } = await params;
  const seasonResult = await getSupabaseSeasonBySlug(gameId);
  const game =
    seasonResult.season ?
      getGameDetailByGameId(seasonResult.season.gameId)
    : getGameDetailBySeasonSlug(gameId);

  if (seasonResult.error || !game) {
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
              {seasonResult.error ??
                "We could not find a game matching that page."}
            </p>
          </Card>
        </div>
      </main>
    );
  }

  const [seasonsResult, liveGameResult, resourcesResult] = await Promise.all([
    getSupabaseSeasonsForGame(game.id),
    getSupabaseGameById(game.id),
    getSupabaseResourcesForGame(game.id),
  ]);

  if (seasonsResult.error || resourcesResult.error) {
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
              Could not load game details
            </CardTitle>
            <p className="mt-3 text-zinc-400">
              Season Tracker could not fetch this game detail content from Supabase right now.
            </p>
            <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-rose-100">
              {seasonsResult.error ?? resourcesResult.error}
            </p>
          </Card>
        </div>
      </main>
    );
  }

  const gameWithLiveSeasons = {
    ...mergeLiveGameData(game, liveGameResult.game),
    communityLinks: resourcesResult.resources,
    seasons: seasonsResult.seasons,
    selectedSeason: seasonResult.season ?? getFeaturedSeason(seasonsResult.seasons),
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
            now={now}
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

async function getSupabaseGameById(gameId: string) {
  if (!supabase) {
    return {
      game: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("games")
      .select("id, name, slug, description, icon_url, created_at")
      .eq("id", gameId)
      .abortSignal(AbortSignal.timeout(supabaseFetchTimeoutMs))
      .maybeSingle();

    if (error) {
      return {
        game: null,
      };
    }

    return {
      game: data ? (data as SupabaseGame) : null,
    };
  } catch {
    return {
      game: null,
    };
  }
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

async function getSupabaseResourcesForGame(gameId: string) {
  if (!supabase) {
    return {
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      resources: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from("game_resources")
      .select("id, game_id, title, label, url, icon, created_at")
      .eq("game_id", gameId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .abortSignal(AbortSignal.timeout(supabaseFetchTimeoutMs));

    if (error) {
      return {
        error: error.message,
        resources: [],
      };
    }

    return {
      error: null,
      resources: ((data ?? []) as SupabaseResource[]).map(toCommunityLink),
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
      resources: [],
    };
  }
}

async function getSupabaseSeasonBySlug(slug: string) {
  if (!supabase) {
    return {
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      season: null,
    };
  }

  try {
    const { data, error } = await supabase
      .from("seasons")
      .select("id, game_id, name, slug, starts_at, ends_at, description, created_at")
      .eq("slug", slug)
      .abortSignal(AbortSignal.timeout(supabaseFetchTimeoutMs))
      .maybeSingle();

    if (error) {
      return {
        error: error.message,
        season: null,
      };
    }

    return {
      error: null,
      season: data ? toSeason(data as SupabaseSeason) : null,
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
      season: null,
    };
  }
}

function toCommunityLink(resource: SupabaseResource): CommunityLink {
  return {
    createdAt: resource.created_at,
    gameId: resource.game_id,
    id: resource.id,
    label: resource.title,
    sourceUrl: resource.url,
    type: getCommunityLinkType(resource.icon),
    typeLabel: resource.label,
    updatedAt: resource.created_at,
    url: resource.url,
  };
}

function toSeason(season: SupabaseSeason): Season {
  return {
    createdAt: season.created_at,
    description: season.description,
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

function getCommunityLinkType(icon: string): CommunityLinkType {
  return communityLinkTypes.includes(icon as CommunityLinkType) ?
      (icon as CommunityLinkType)
    : "forum";
}

function mergeLiveGameData<TGame extends { image: string; title: string }>(
  game: TGame,
  liveGame: SupabaseGame | null
) {
  if (!liveGame) {
    return game;
  }

  return {
    ...game,
    description: liveGame.description,
    image: liveGame.icon_url ?? game.image,
    title: liveGame.name,
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
