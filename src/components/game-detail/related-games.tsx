import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  DetailEmptyState,
  DetailSection,
} from "@/src/components/game-detail/shared";
import type { GameDetailRelatedGame } from "@/src/features";

export type RelatedGameCard = GameDetailRelatedGame & {
  href: string;
};

export function RelatedGames({ games }: { games: RelatedGameCard[] }) {
  return (
    <DetailSection title="You might also like">
      {games.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {games.map((game) => (
            <Link
              className="group relative min-h-36 overflow-hidden rounded-lg border border-white/10 bg-[#081120] p-4 transition hover:border-violet-400/35"
              href={game.href}
              key={game.id}
            >
              {game.detailImage || game.image ? (
                <Image
                  src={game.detailImage || game.image}
                  alt={`${game.title} artwork`}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-45 transition group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-linear-to-t from-[#081120] via-[#081120]/60 to-transparent" />
              <div className="relative mt-12 flex min-h-16 items-end justify-between gap-4">
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-white">
                    {game.title}
                  </span>
                  <span className="mt-1 block text-sm capitalize text-rose-300">
                    {game.relationship.replace("-", " ")}
                  </span>
                </span>
                <ArrowRight
                  className="size-5 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-white"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <DetailEmptyState message="No related games have been added yet." />
      )}
    </DetailSection>
  );
}
