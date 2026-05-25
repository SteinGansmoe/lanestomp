import type { AdminGame } from "./types";

export type AdminGameItemGroup<TItem> = {
  gameId: string;
  gameName: string;
  items: TItem[];
};

export function groupAdminItemsByGame<TItem extends { game_id: string }>(
  items: TItem[],
  games: AdminGame[],
  gameNamesById: Map<string, string>
): Array<AdminGameItemGroup<TItem>> {
  const itemsByGameId = new Map<string, TItem[]>();

  for (const item of items) {
    const existingItems = itemsByGameId.get(item.game_id) ?? [];

    existingItems.push(item);
    itemsByGameId.set(item.game_id, existingItems);
  }

  const knownGameIds = new Set(games.map((game) => game.id));
  const knownGameGroups = games
    .map((game) => ({
      gameId: game.id,
      gameName: game.name,
      items: itemsByGameId.get(game.id) ?? [],
    }))
    .filter((group) => group.items.length > 0);
  const unknownGameGroups = [...itemsByGameId.entries()]
    .filter(([gameId]) => !knownGameIds.has(gameId))
    .map(([gameId, groupItems]) => ({
      gameId,
      gameName: gameNamesById.get(gameId) ?? gameId,
      items: groupItems,
    }))
    .sort((left, right) => left.gameName.localeCompare(right.gameName));

  return [...knownGameGroups, ...unknownGameGroups];
}

export function isMissingGameResourcesTableError(
  error: { code?: string; message?: string } | null
) {
  return (
    error?.code === "PGRST205" ||
    Boolean(
      error?.message?.includes("game_resources") &&
        error.message.includes("schema cache")
    )
  );
}

export function formatDate(value: string) {
  return value.slice(0, 10);
}

export function toDateTimeLocalValue(value: string) {
  return value.slice(0, 16);
}

export function toIsoDateTime(value: string) {
  return new Date(value).toISOString();
}
