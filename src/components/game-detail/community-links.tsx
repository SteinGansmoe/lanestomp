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
    <DetailSection title="Community">
      {links.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {links.map((link) => {
            const Icon = linkIcons[link.type];

            return (
              <a
                className="flex min-w-0 items-center gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                href={link.url}
                key={link.id}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-200">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-white">
                    {link.label}
                  </span>
                  <span className="block text-sm capitalize text-zinc-400">
                    {link.typeLabel ?? link.type}
                  </span>
                </span>
                <ExternalLink
                  className="size-4 shrink-0 text-zinc-400"
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
