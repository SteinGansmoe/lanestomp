import { ArrowRight, ExternalLink } from "lucide-react";

import {
  DetailActionLink,
  DetailEmptyState,
  DetailSection,
} from "@/src/components/game-detail/shared";
import type { GameDetailResourceGroup } from "@/src/features";

export function ResourceGroups({
  groups,
}: {
  groups: GameDetailResourceGroup[];
}) {
  const leagueChampionsHref = groups.some(
    (group) => group.gameId === "league-of-legends"
  )
    ? "/games/league-of-legends/champions"
    : null;

  return (
    <DetailSection
      action={
        <DetailActionLink href={leagueChampionsHref ?? "#"}>
          {leagueChampionsHref ? "Champion data" : "View all resources"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </DetailActionLink>
      }
      className="h-full"
      title="Resources"
    >
      {groups.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {groups.map((group) => (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-white/15 hover:bg-white/[0.06]"
              key={group.id}
            >
              <h3 className="font-medium leading-tight text-white">
                {group.title}
              </h3>
              {group.resources.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {group.resources.map((resource) => (
                    <a
                      className="group flex items-center justify-between gap-3 rounded-md py-1 text-sm transition hover:text-white"
                      href={resource.url}
                      key={resource.id}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-zinc-100">
                          {resource.label}
                        </span>
                        <span className="block truncate text-zinc-400">
                          {resource.description ?? resource.category}
                        </span>
                      </span>
                      <ExternalLink
                        className="size-4 shrink-0 text-zinc-500 transition group-hover:text-zinc-200"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-400">
                  No resources in this group yet.
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <DetailEmptyState message="No resource groups have been added for this game yet." />
      )}
    </DetailSection>
  );
}
