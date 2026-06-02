"use client";

import { useCallback, useEffect, useState } from "react";

import { seasons } from "@/src/features";

const followedGamesStorageKey = "lanestomp.followedGameIds";
const followedGamesChangedEvent = "lanestomp:followed-games-changed";
const legacySeasonIdToGameId = new Map<string, string>(
  seasons.flatMap((season) => [
    [season.id, season.gameId],
    [season.slug, season.gameId],
  ])
);

function normalizeFollowedGameIds(gameIds: string[]) {
  return Array.from(
    new Set(gameIds.map((gameId) => legacySeasonIdToGameId.get(gameId) ?? gameId))
  );
}

function readFollowedGameIds() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(followedGamesStorageKey);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return normalizeFollowedGameIds(
      parsedValue.filter((item): item is string => typeof item === "string")
    );
  } catch {
    return [];
  }
}

function writeFollowedGameIds(gameIds: string[]) {
  window.localStorage.setItem(
    followedGamesStorageKey,
    JSON.stringify(normalizeFollowedGameIds(gameIds))
  );
  window.dispatchEvent(new Event(followedGamesChangedEvent));
}

export function useFollowedGames() {
  const [followedGameIds, setFollowedGameIds] = useState<string[]>([]);

  useEffect(() => {
    function syncFollowedGames() {
      const normalizedGameIds = readFollowedGameIds();

      setFollowedGameIds(normalizedGameIds);
      window.localStorage.setItem(
        followedGamesStorageKey,
        JSON.stringify(normalizedGameIds)
      );
    }

    syncFollowedGames();
    window.addEventListener("storage", syncFollowedGames);
    window.addEventListener(followedGamesChangedEvent, syncFollowedGames);

    return () => {
      window.removeEventListener("storage", syncFollowedGames);
      window.removeEventListener(followedGamesChangedEvent, syncFollowedGames);
    };
  }, []);

  const isFollowing = useCallback(
    (gameId: string) => followedGameIds.includes(gameId),
    [followedGameIds]
  );

  const followGame = useCallback((gameId: string) => {
    const currentGameIds = readFollowedGameIds();

    if (currentGameIds.includes(gameId)) {
      return;
    }

    writeFollowedGameIds([...currentGameIds, gameId]);
  }, []);

  const unfollowGame = useCallback((gameId: string) => {
    writeFollowedGameIds(readFollowedGameIds().filter((id) => id !== gameId));
  }, []);

  const toggleFollowedGame = useCallback(
    (gameId: string) => {
      if (readFollowedGameIds().includes(gameId)) {
        unfollowGame(gameId);
        return;
      }

      followGame(gameId);
    },
    [followGame, unfollowGame]
  );

  return {
    followedGameIds,
    followGame,
    isFollowing,
    toggleFollowedGame,
    unfollowGame,
  };
}
