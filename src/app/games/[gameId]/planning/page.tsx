import Link from "next/link";
import { ArrowLeft, ClipboardCheck, LinkIcon, ListChecks, StickyNote } from "lucide-react";

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
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
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

          <section className="rounded-xl border border-white/10 bg-[#10182b]/90 p-5 shadow-xl shadow-black/20 ring-1 ring-white/5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-300">
                  Season planning
                </p>
                <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                  Launch Preparation
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  Turn {boardTitle} into a focused prep workspace with notes,
                  launch tasks, and the resources you want close at hand.
                </p>
              </div>

              <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-3 lg:w-[30rem]">
                <WorkspacePill
                  icon={StickyNote}
                  label="Notes"
                  text="Capture plans"
                />
                <WorkspacePill
                  icon={ListChecks}
                  label="Checklist"
                  text="Track launch prep"
                />
                <WorkspacePill
                  icon={LinkIcon}
                  label="Links"
                  text="Save resources"
                />
              </div>
            </div>
          </section>

          <PlanningBoardEditor
            fallbackTitle={boardTitle}
            seasonIdentifier={gameId}
          />
        </div>
      </div>
    </main>
  );
}

function WorkspacePill({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2 text-zinc-100">
        <Icon className="size-4 text-emerald-200" aria-hidden="true" />
        <span className="font-medium">{label}</span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">{text}</p>
    </div>
  );
}
