import { gamesSeed } from "@/src/features/games/seed";
import type { Game } from "@/src/features/games/types";
import { seasons } from "@/src/features/seasons/seed";
import type { Season } from "@/src/features/seasons/types";
import { resources } from "@/src/features/resources/seed";
import type { Resource } from "@/src/features/resources/types";

export type GameSeasonCard = Omit<Game, "createdAt" | "slug" | "updatedAt"> & {
  gameId: string;
  resources: Array<{
    href: string;
    label: string;
  }>;
  season: Pick<Season, "endDate" | "startDate" | "title" | "type">;
  seasonId: string;
};

export function getGamesWithSeasons(): GameSeasonCard[] {
  const gamesWithSeasons: GameSeasonCard[] = [];

  for (const season of seasons) {
    const game = gamesSeed.find((item) => item.id === season.gameId);

    if (!game) {
      continue;
    }

    gamesWithSeasons.push({
      id: season.slug,
      gameId: game.id,
      title: game.title,
      genre: game.genre,
      image: game.image,
      detailImage: game.detailImage,
      seasonId: season.id,
      season: {
        title: season.title,
        type: season.type,
        startDate: season.startDate,
        endDate: season.endDate,
      },
      resources: getResourcesForGame(game.id).map((resource) => ({
        label: resource.label,
        href: resource.url,
      })),
    });
  }

  return gamesWithSeasons;
}

export function getResourcesForGame(gameId: string): Resource[] {
  return resources.filter((resource) => resource.gameId === gameId);
}

export function getSupportedGames(): Game[] {
  return gamesSeed;
}

export function getPrimarySeasonRouteForGame(gameId: string) {
  const primarySeason = seasons.find((season) => season.gameId === gameId);

  return primarySeason ? `/games/${primarySeason.slug}` : "#";
}
