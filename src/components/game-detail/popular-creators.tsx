import { ArrowRight, ExternalLink } from "lucide-react";

import {
  DetailActionLink,
  DetailEmptyState,
  DetailSection,
} from "@/src/components/game-detail/shared";
import type { GameDetailCreator } from "@/src/features";

export function PopularCreators({
  creators,
}: {
  creators: GameDetailCreator[];
}) {
  return (
    <DetailSection
      action={
        <DetailActionLink href="#">
          View all creators
          <ArrowRight className="size-4" aria-hidden="true" />
        </DetailActionLink>
      }
      title="Popular creators"
    >
      {creators.length > 0 ? (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex w-max gap-4 sm:grid sm:w-auto sm:grid-cols-2 xl:grid-cols-4">
            {creators.map((creator) => (
              <article
                className="flex w-72 min-w-0 items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 sm:w-auto"
                key={creator.id}
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-violet-300/20 bg-violet-500/20 font-mono text-lg font-semibold text-violet-100">
                  {getInitials(creator.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-white">
                    {creator.name}
                  </h3>
                  <p className="mt-1 text-sm capitalize text-zinc-400">
                    {creator.role.replace("-", " ")}
                  </p>
                </div>
                {creator.websiteUrl ? (
                  <a
                    aria-label={`Open ${creator.name}`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    href={creator.websiteUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      ) : (
        <DetailEmptyState message="No creators have been added for this game yet." />
      )}
    </DetailSection>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 2);
}
