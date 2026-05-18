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
} from "@/src/features";

type GameDetailPageProps = {
  params: Promise<{ gameId: string }>;
};

export function generateStaticParams() {
  return getSeasonCardStaticParams();
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { gameId } = await params;
  const game = getGameDetailBySeasonSlug(gameId);
  const selectedSeason = game?.selectedSeason;

  if (!game || !selectedSeason) {
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

  const nextTimelineEvent = getNextTimelineEvent(game.timelineEvents);
  const relatedGames: RelatedGameCard[] = game.relatedGames.map(
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
            game={game}
            season={selectedSeason}
          />
          <GameStatusSummary
            nextEvent={nextTimelineEvent}
            season={selectedSeason}
          />
          <GameTimeline events={game.timelineEvents} />
          <ResourceGroups groups={game.resourceGroups} />
          <PopularCreators creators={game.creators} />
          <CommunityLinks links={game.communityLinks} />
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

function getNextTimelineEvent(events: { startDate: string; title: string }[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.find(
    (event) => new Date(`${event.startDate}T00:00:00`).getTime() >= today.getTime()
  );
}
