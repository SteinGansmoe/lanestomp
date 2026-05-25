import { gamesSeed } from "@/src/features/games/seed";
import type { Game } from "@/src/features/games/types";
import { seasons as seasonsSeed } from "@/src/features/seasons/seed";
import type { Season } from "@/src/features/seasons/types";
import { resources as resourcesSeed } from "@/src/features/resources/seed";
import type { Resource } from "@/src/features/resources/types";
import {
  creators as creatorsSeed,
  gameCreators as gameCreatorsSeed,
} from "@/src/features/creators/seed";
import type { Creator, GameCreator } from "@/src/features/creators/types";
import { communityLinks as communityLinksSeed } from "@/src/features/community-links/seed";
import type { CommunityLink } from "@/src/features/community-links/types";
import { events as eventsSeed } from "@/src/features/events/seed";
import type { GameEvent } from "@/src/features/events/types";
import { resourceGroups as resourceGroupsSeed } from "@/src/features/resource-groups/seed";
import type { ResourceGroup } from "@/src/features/resource-groups/types";
import { relatedGames as relatedGamesSeed } from "@/src/features/related-games/seed";
import type { RelatedGame } from "@/src/features/related-games/types";

const dayInMs = 1000 * 60 * 60 * 24;
const defaultStartingSoonWindowDays = 30;
const defaultEndingSoonWindowDays = 7;

export type SeasonDataSource = {
  games: Game[];
  resources: Resource[];
  seasons: Season[];
};

export type GameDetailDataSource = SeasonDataSource & {
  communityLinks: CommunityLink[];
  creators: Creator[];
  events: GameEvent[];
  gameCreators: GameCreator[];
  relatedGames: RelatedGame[];
  resourceGroups: ResourceGroup[];
};

const seedDataSource: SeasonDataSource = {
  games: gamesSeed,
  resources: resourcesSeed,
  seasons: seasonsSeed,
};

const gameDetailSeedDataSource: GameDetailDataSource = {
  ...seedDataSource,
  communityLinks: communityLinksSeed,
  creators: creatorsSeed,
  events: eventsSeed,
  gameCreators: gameCreatorsSeed,
  relatedGames: relatedGamesSeed,
  resourceGroups: resourceGroupsSeed,
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

export type GameDetailCreator = Creator & {
  role: GameCreator["role"];
};

export type GameDetailResourceGroup = Omit<ResourceGroup, "resourceIds"> & {
  resources: Resource[];
};

export type GameDetailRelatedGame = Game & {
  relationship: RelatedGame["type"];
};

export type GameDetail = Game & {
  communityLinks: CommunityLink[];
  creators: GameDetailCreator[];
  relatedGames: GameDetailRelatedGame[];
  resourceGroups: GameDetailResourceGroup[];
  seasons: Season[];
  selectedSeason?: Season;
  timelineEvents: GameEvent[];
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

export function getTimelineEventsForGame(
  gameId: string,
  source: Pick<GameDetailDataSource, "events"> = gameDetailSeedDataSource
): GameEvent[] {
  return [...source.events]
    .filter((event) => event.gameId === gameId)
    .sort((left, right) => left.startDate.localeCompare(right.startDate));
}

export function getResourceGroupsForGame(
  gameId: string,
  source: Pick<GameDetailDataSource, "resourceGroups" | "resources"> =
    gameDetailSeedDataSource
): GameDetailResourceGroup[] {
  return source.resourceGroups
    .filter((group) => group.gameId === gameId)
    .map(({ resourceIds, ...group }) => ({
      ...group,
      resources: resourceIds
        .map((resourceId) =>
          source.resources.find((resource) => resource.id === resourceId)
        )
        .filter((resource): resource is Resource => Boolean(resource)),
    }));
}

export function getCreatorsForGame(
  gameId: string,
  source: Pick<GameDetailDataSource, "creators" | "gameCreators"> =
    gameDetailSeedDataSource
): GameDetailCreator[] {
  return source.gameCreators
    .filter((gameCreator) => gameCreator.gameId === gameId)
    .map((gameCreator) => {
      const creator = source.creators.find(
        (item) => item.id === gameCreator.creatorId
      );

      if (!creator) {
        return undefined;
      }

      return {
        ...creator,
        role: gameCreator.role,
      };
    })
    .filter((creator): creator is GameDetailCreator => Boolean(creator));
}

export function getCommunityLinksForGame(
  gameId: string,
  source: Pick<GameDetailDataSource, "communityLinks"> =
    gameDetailSeedDataSource
): CommunityLink[] {
  return source.communityLinks.filter((link) => link.gameId === gameId);
}

export function getRelatedGamesForGame(
  gameId: string,
  source: Pick<GameDetailDataSource, "games" | "relatedGames"> =
    gameDetailSeedDataSource
): GameDetailRelatedGame[] {
  return source.relatedGames
    .filter((relatedGame) => relatedGame.gameId === gameId)
    .map((relatedGame) => {
      const game = source.games.find(
        (item) => item.id === relatedGame.relatedGameId
      );

      if (!game) {
        return undefined;
      }

      return {
        ...game,
        relationship: relatedGame.type,
      };
    })
    .filter((game): game is GameDetailRelatedGame => Boolean(game));
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
  return games.filter((game) => followedGameIds.includes(game.gameId));
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

export function getGameDetailByGameId(
  gameId: string,
  source: GameDetailDataSource = gameDetailSeedDataSource
): GameDetail | undefined {
  const game = source.games.find((item) => item.id === gameId);

  if (!game) {
    return undefined;
  }

  const seasons = source.seasons.filter((season) => season.gameId === game.id);

  return {
    ...game,
    communityLinks: getCommunityLinksForGame(game.id, source),
    creators: getCreatorsForGame(game.id, source),
    relatedGames: getRelatedGamesForGame(game.id, source),
    resourceGroups: getResourceGroupsForGame(game.id, source),
    seasons,
    timelineEvents: getTimelineEventsForGame(game.id, source),
  };
}

export function getGameDetailBySeasonSlug(
  seasonSlug: string,
  source: GameDetailDataSource = gameDetailSeedDataSource
): GameDetail | undefined {
  const selectedSeason = source.seasons.find(
    (season) => season.slug === seasonSlug
  );

  if (!selectedSeason) {
    return undefined;
  }

  const gameDetail = getGameDetailByGameId(selectedSeason.gameId, source);

  if (!gameDetail) {
    return undefined;
  }

  return {
    ...gameDetail,
    selectedSeason,
  };
}

export function getSeasonCardStaticParams(
  source: SeasonDataSource = seedDataSource
) {
  return getGamesWithSeasons(source).map((game) => ({
    gameId: game.id,
  }));
}
