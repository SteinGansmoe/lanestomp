import { MetadataRoute } from "next";
import {
  getLeagueChampions,
  type LeagueChampion,
} from "@/src/features/league/champions";
import { getLeagueMatchupHref } from "@/src/features/league/matchup-routes";
import type { LeagueRole } from "@/src/features/league/roles";
import { supabase } from "@/src/lib/supabase";

const baseUrl = "https://lanestomp.com";
const PAGE_SIZE = 1000;

type SitemapMatchupRow = {
  champion_a_id: string;
  champion_b_id: string;
  role: LeagueRole;
  updated_at: string | null;
};

export function getSitemapMatchupUrl({
  championA,
  championB,
  role,
}: {
  championA: Pick<LeagueChampion, "id" | "name">;
  championB: Pick<LeagueChampion, "id" | "name">;
  role: LeagueRole;
}) {
  return `${baseUrl}${getLeagueMatchupHref({ championA, championB, role })}`;
}

export async function getMatchupsForSitemap(): Promise<MetadataRoute.Sitemap> {
  if (!supabase) return [];

  const { champions, error: championError } = await getLeagueChampions();

  if (championError) {
    console.error("Failed to fetch sitemap champions:", championError);
    return [];
  }

  const championsById = new Map(
    champions.map((champion) => [champion.id, champion]),
  );
  const allMatchups: SitemapMatchupRow[] = [];
  let from = 0;
  let to = PAGE_SIZE - 1;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from("league_matchups")
      .select("champion_a_id, champion_b_id, role, updated_at")
      .eq("generation_status", "reviewed")
      .range(from, to);

    if (error) {
      console.error("Failed to fetch sitemap matchups:", error.message);
      break;
    }

    allMatchups.push(...((data ?? []) as SitemapMatchupRow[]));

    if (!data || data.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      from += PAGE_SIZE;
      to += PAGE_SIZE;
    }
  }

  return allMatchups.flatMap((matchup) => {
    const championA = championsById.get(matchup.champion_a_id);
    const championB = championsById.get(matchup.champion_b_id);

    if (!championA || !championB) {
      console.error("Skipping sitemap matchup with missing champion:", {
        championAId: matchup.champion_a_id,
        championBId: matchup.champion_b_id,
      });
      return [];
    }

    return {
      url: getSitemapMatchupUrl({
        championA,
        championB,
        role: matchup.role,
      }),
      lastModified: matchup.updated_at
        ? new Date(matchup.updated_at)
        : new Date(),
    };
  });
}
