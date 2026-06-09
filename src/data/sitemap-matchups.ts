import { MetadataRoute } from "next";
import { supabase } from "@/src/lib/supabase";
import { slugifyChampionName } from "@/src/features/league/champions";

const baseUrl = "https://lanestomp.com";
const PAGE_SIZE = 1000;

export async function getMatchupsForSitemap(): Promise<MetadataRoute.Sitemap> {
  if (!supabase) return [];

  const allMatchups = [];
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

    allMatchups.push(...(data ?? []));

    if (!data || data.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      from += PAGE_SIZE;
      to += PAGE_SIZE;
    }
  }

  return allMatchups.map((matchup) => {
    const championASlug = slugifyChampionName(matchup.champion_a_id);
    const championBSlug = slugifyChampionName(matchup.champion_b_id);

    return {
      url: `${baseUrl}/league/matchups/${championASlug}-vs-${championBSlug}?role=${matchup.role}`,
      lastModified: matchup.updated_at
        ? new Date(matchup.updated_at)
        : new Date(),
    };
  });
}