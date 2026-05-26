import { ExternalLink, Hash, MessageCircle, Play, Radio, Users } from "lucide-react";

import {
  DetailEmptyState,
  DetailSection,
} from "@/src/components/game-detail/shared";
import type { CommunityLink } from "@/src/features";

const linkIcons = {
  discord: MessageCircle,
  forum: Users,
  reddit: Hash,
  social: Radio,
  video: Play,
};

export function CommunityLinks({ links }: { links: CommunityLink[] }) {
  return (
    <DetailSection className="h-full" title="Community">
      {links.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
          {links.map((link) => {
            const Icon = linkIcons[link.type];

            return (
              <a
                className="group flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-white/15 hover:bg-white/[0.06]"
                href={link.url}
                key={link.id}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-200">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {link.label}
                  </span>
                  <span className="block text-xs capitalize text-zinc-400">
                    {link.typeLabel ?? link.type}
                  </span>
                </span>
                <ExternalLink
                  className="size-4 shrink-0 text-zinc-500 transition group-hover:text-zinc-200"
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </div>
      ) : (
        <DetailEmptyState message="No community links have been added for this game yet." />
      )}
    </DetailSection>
  );
}
