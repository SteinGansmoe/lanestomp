import { gamesSeed } from "@/src/features/games/seed";
import type { Game } from "@/src/features/games/types";
import { seasons as seasonsSeed } from "@/src/features/seasons/seed";
import type { Season } from "@/src/features/seasons/types";
import { resources as resourcesSeed } from "@/src/features/resources/seed";
import type { Resource } from "@/src/features/resources/types";

const dayInMs = 1000 * 60 * 60 * 24;
const defaultStartingSoonWindowDays = 30;
const defaultEndingSoonWindowDays = 7;

export type SeasonDataSource = {
  games: Game[];
  resources: Resource[];
  seasons: Season[];
};

const seedDataSource: SeasonDataSource = {
  games: gamesSeed,
  resources: resourcesSeed,
  seasons: seasonsSeed,
};

export type GameSeasonCard = Omit<Game, "createdAt" | "slug" | "updatedAt"> & {
  gameId: string;
  resources: Array<{
    href: string;
    label: string;
  }>;
  season: Pick<Season, "endDate" | "startDate" | "title" | "type">;
  seasonId: string;
};

export type DashboardStats = {
  activeSeasons: number;
  endingSoon: number;
  startingSoon: number;
  trackedGames: number;
};

function getSeasonStartTime(game: GameSeasonCard) {
  return new Date(`${game.season.startDate}T00:00:00`).getTime();
}

function getSeasonEndTime(game: GameSeasonCard) {
  return new Date(`${game.season.endDate}T23:59:59`).getTime();
}

function getDaysUntil(timestamp: number, now: Date) {
  return Math.ceil((timestamp - now.getTime()) / dayInMs);
}

export function getGamesWithSeasons(
  source: SeasonDataSource = seedDataSource
): GameSeasonCard[] {
  const gamesWithSeasons: GameSeasonCard[] = [];

  for (const season of source.seasons) {
    const game = source.games.find((item) => item.id === season.gameId);

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
      resources: getResourcesForGame(game.id, source).map((resource) => ({
        label: resource.label,
        href: resource.url,
      })),
    });
  }

  return gamesWithSeasons;
}

export function getResourcesForGame(
  gameId: string,
  source: SeasonDataSource = seedDataSource
): Resource[] {
  return source.resources.filter((resource) => resource.gameId === gameId);
}

export function getSupportedGames(
  source: SeasonDataSource = seedDataSource
): Game[] {
  return source.games;
}

export function getPrimarySeasonRouteForGame(
  gameId: string,
  source: SeasonDataSource = seedDataSource
) {
  const primarySeason = source.seasons.find(
    (season) => season.gameId === gameId
  );

  return primarySeason ? `/games/${primarySeason.slug}` : "#";
}

export function gameMatchesSearch(game: GameSeasonCard, search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [
    game.title,
    game.genre,
    game.season.title,
    game.season.type,
    game.season.startDate,
    game.season.endDate,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearch);
}

export function getSearchFilteredSeasonCards(
  games: GameSeasonCard[],
  search: string
) {
  return games.filter((game) => gameMatchesSearch(game, search));
}

export function getActiveSeasonCards(games: GameSeasonCard[], now = new Date()) {
  const nowTime = now.getTime();

  return games.filter(
    (game) =>
      getSeasonStartTime(game) <= nowTime && getSeasonEndTime(game) >= nowTime
  );
}

export function getStartingSoonSeasonCards(
  games: GameSeasonCard[],
  now = new Date(),
  days = defaultStartingSoonWindowDays
) {
  return games.filter((game) => {
    const daysUntilStart = getDaysUntil(getSeasonStartTime(game), now);

    return daysUntilStart >= 0 && daysUntilStart <= days;
  });
}

export function getEndingSoonSeasonCards(
  games: GameSeasonCard[],
  now = new Date(),
  days = defaultEndingSoonWindowDays
) {
  return games.filter((game) => {
    const daysLeft = getDaysUntil(getSeasonEndTime(game), now);

    return daysLeft >= 0 && daysLeft <= days;
  });
}

export function getFollowedSeasonCards(
  games: GameSeasonCard[],
  followedGameIds: string[]
) {
  return games.filter((game) => followedGameIds.includes(game.id));
}

export function getDashboardStats(
  games: GameSeasonCard[],
  now = new Date()
): DashboardStats {
  return {
    trackedGames: new Set(games.map((game) => game.gameId)).size,
    activeSeasons: getActiveSeasonCards(games, now).length,
    startingSoon: getStartingSoonSeasonCards(games, now).length,
    endingSoon: getEndingSoonSeasonCards(games, now).length,
  };
}

export function getSeasonCardById(
  id: string,
  source: SeasonDataSource = seedDataSource
) {
  return getGamesWithSeasons(source).find((game) => game.id === id);
}

export function getSeasonCardStaticParams(
  source: SeasonDataSource = seedDataSource
) {
  return getGamesWithSeasons(source).map((game) => ({
    gameId: game.id,
  }));
}
