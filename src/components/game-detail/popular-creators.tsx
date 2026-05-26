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
      className="h-full"
      title="Popular creators"
    >
      {creators.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
          {creators.map((creator) => (
            <article
              className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-white/15 hover:bg-white/[0.06]"
              key={creator.id}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-violet-300/20 bg-violet-500/20 font-mono text-sm font-semibold text-violet-100">
                {getInitials(creator.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white">
                  {creator.name}
                </h3>
                <p className="mt-0.5 text-xs capitalize text-zinc-400">
                  {creator.role.replace("-", " ")}
                </p>
              </div>
              {creator.websiteUrl ? (
                <a
                  aria-label={`Open ${creator.name}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
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
