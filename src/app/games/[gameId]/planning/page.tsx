import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PlanningBoardEditor } from "@/src/components/planning-board/planning-board-editor";
import { SiteHeader } from "@/src/components/site-header";
import {
  getSeasonCardById,
  getSeasonCardStaticParams,
} from "@/src/features";

type PlanningBoardPageProps = {
  params: Promise<{ gameId: string }>;
};

export function generateStaticParams() {
  return getSeasonCardStaticParams();
}

export default async function PlanningBoardPage({
  params,
}: PlanningBoardPageProps) {
  const { gameId } = await params;
  const seasonCard = getSeasonCardById(gameId);
  const boardTitle = seasonCard
    ? `${seasonCard.title} ${seasonCard.season.title}`
    : gameId;

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex max-w-6xl flex-col gap-6">
          <Link
            className="inline-flex w-fit items-center gap-2 text-sm text-violet-300 transition hover:text-violet-200"
            href={`/games/${gameId}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to season
          </Link>

          <section>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-300">
              Season planning
            </p>
            <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Planning Board
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Create or open your personal planning board for {boardTitle}.
            </p>
          </section>

          <PlanningBoardEditor
            fallbackTitle={boardTitle}
            seasonSlug={gameId}
          />
        </div>
      </div>
    </main>
  );
}
