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
  return (
    <DetailSection
      action={
        <DetailActionLink href="#">
          View all resources
          <ArrowRight className="size-4" aria-hidden="true" />
        </DetailActionLink>
      }
      title="Resources"
    >
      {groups.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group) => (
            <article
              className="rounded-lg border border-white/10 bg-white/5 p-4"
              key={group.id}
            >
              <h3 className="font-medium text-white">{group.title}</h3>
              {group.resources.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {group.resources.map((resource) => (
                    <a
                      className="flex items-center justify-between gap-3 rounded-md px-1 py-1 text-sm transition hover:bg-white/5"
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
                        className="size-4 shrink-0 text-zinc-400"
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
