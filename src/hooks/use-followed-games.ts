"use client";

import { useCallback, useEffect, useState } from "react";

const followedGamesStorageKey = "seasontracker.followedGameIds";
const followedGamesChangedEvent = "seasontracker:followed-games-changed";

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

    return parsedValue.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeFollowedGameIds(gameIds: string[]) {
  window.localStorage.setItem(followedGamesStorageKey, JSON.stringify(gameIds));
  window.dispatchEvent(new Event(followedGamesChangedEvent));
}

export function useFollowedGames() {
  const [followedGameIds, setFollowedGameIds] = useState<string[]>([]);

  useEffect(() => {
    function syncFollowedGames() {
      setFollowedGameIds(readFollowedGameIds());
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
