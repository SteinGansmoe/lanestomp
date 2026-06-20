import { supabase } from "@/src/lib/supabase";

import type { LeagueChampion } from "./champions";

type CounterPickPopularityRow = {
  enemy_champion_id: string;
  games: number | null;
  patch: string | null;
};

const popularChampionLimit = 9;
const fallbackPopularChampionIds = [
  "Ahri",
  "Yasuo",
  "Zed",
  "Yone",
  "Jinx",
  "Lux",
  "Akali",
  "LeeSin",
  "Aatrox",
] as const;

export async function getPopularCounterPickChampions(champions: LeagueChampion[]) {
  const activeChampionsById = new Map(champions.map((champion) => [champion.id, champion]));

  if (!supabase || champions.length === 0) {
    return getFallbackPopularChampions(activeChampionsById);
  }

  const { data, error } = await supabase
    .from("counter_pick_stats")
    .select("enemy_champion_id, games, patch")
    .eq("rank_bracket", "all")
    .order("patch", { ascending: false })
    .limit(5000)
    .returns<CounterPickPopularityRow[]>();

  if (error || !data || data.length === 0) {
    return getFallbackPopularChampions(activeChampionsById);
  }

  const latestPatch = data
    .map((row) => row.patch)
    .filter((patch): patch is string => Boolean(patch))
    .sort(comparePatchVersions)
    .at(-1);
  const gamesByEnemyChampion = new Map<string, number>();

  for (const row of data) {
    if (latestPatch && row.patch !== latestPatch) {
      continue;
    }

    if (!activeChampionsById.has(row.enemy_champion_id)) {
      continue;
    }

    gamesByEnemyChampion.set(
      row.enemy_champion_id,
      (gamesByEnemyChampion.get(row.enemy_champion_id) ?? 0) + (row.games ?? 0),
    );
  }

  const popularChampions = Array.from(gamesByEnemyChampion.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, popularChampionLimit)
    .map(([championId]) => activeChampionsById.get(championId))
    .filter((champion): champion is LeagueChampion => Boolean(champion));

  if (popularChampions.length >= popularChampionLimit) {
    return popularChampions;
  }

  return fillPopularChampionFallback(popularChampions, activeChampionsById);
}

function getFallbackPopularChampions(activeChampionsById: Map<string, LeagueChampion>) {
  return fillPopularChampionFallback([], activeChampionsById);
}

function fillPopularChampionFallback(
  champions: LeagueChampion[],
  activeChampionsById: Map<string, LeagueChampion>,
) {
  const popularChampions = [...champions];
  const popularChampionIds = new Set(popularChampions.map((champion) => champion.id));

  for (const championId of fallbackPopularChampionIds) {
    const champion = activeChampionsById.get(championId);

    if (!champion || popularChampionIds.has(champion.id)) {
      continue;
    }

    popularChampions.push(champion);
    popularChampionIds.add(champion.id);

    if (popularChampions.length >= popularChampionLimit) {
      return popularChampions;
    }
  }

  for (const champion of activeChampionsById.values()) {
    if (popularChampionIds.has(champion.id)) {
      continue;
    }

    popularChampions.push(champion);

    if (popularChampions.length >= popularChampionLimit) {
      break;
    }
  }

  return popularChampions;
}

function comparePatchVersions(left: string, right: string) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  const partCount = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < partCount; index += 1) {
    const leftPart = Number.isFinite(leftParts[index]) ? leftParts[index] : 0;
    const rightPart = Number.isFinite(rightParts[index]) ? rightParts[index] : 0;

    if (leftPart !== rightPart) {
      return leftPart - rightPart;
    }
  }

  return left.localeCompare(right);
}
