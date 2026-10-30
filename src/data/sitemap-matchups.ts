import type { MetadataRoute } from "next";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeagueChampion } from "@/src/features/league/champions";
import { getLeagueMatchupHref } from "@/src/features/league/matchup-routes";
import { isLeagueRole, type LeagueRole } from "@/src/features/league/roles";
import { supabase } from "@/src/lib/supabase";

const baseUrl = "https://lanestomp.com";
const PAGE_SIZE = 1000;

type SitemapMatchupRow = {
  id: number;
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
  if (!supabase) {
    throw new Error("Sitemap requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  // Read both dependencies completely; the shared champion reader intentionally
  // has UI fallbacks that are unsuitable for a release-time completeness check.
  const champions = await readSitemapRows<Pick<LeagueChampion, "id" | "name">>(
    supabase,
    "league_champions",
    "id, name",
    "is_active",
    true,
  );
  const allMatchups = await readSitemapRows<SitemapMatchupRow>(
    supabase,
    "public_league_matchups",
    "id, champion_a_id, champion_b_id, role, updated_at",
    "generation_status",
    "reviewed",
  );
  if (
    champions.some(
      (champion) => !champion.id || typeof champion.name !== "string" || !champion.name.trim(),
    )
  ) {
    throw new Error("Sitemap champion data is incomplete.");
  }
  const championsById = new Map(champions.map((champion) => [champion.id, champion]));
  const urls = new Set<string>();
  return allMatchups.map((matchup) => {
    const championA = championsById.get(matchup.champion_a_id);
    const championB = championsById.get(matchup.champion_b_id);

    if (!championA || !championB || !isLeagueRole(matchup.role)) {
      throw new Error("Sitemap guide references missing champion or invalid role data.");
    }
    const url = getSitemapMatchupUrl({ championA, championB, role: matchup.role });
    if (urls.has(url)) throw new Error("Sitemap guide URLs are not unique.");
    urls.add(url);
    const lastModified = matchup.updated_at ? new Date(matchup.updated_at) : new Date();
    if (Number.isNaN(lastModified.getTime())) throw new Error("Sitemap guide date is invalid.");
    return {
      url,
      lastModified,
    };
  });
}

async function readSitemapRows<Row extends { id: string | number }>(
  client: SupabaseClient,
  table: "league_champions" | "public_league_matchups",
  columns: string,
  filterColumn: string,
  filterValue: boolean | string,
): Promise<Row[]> {
  const rows: Row[] = [];
  const ids = new Set<string | number>();
  let expectedCount: number | null = null;
  do {
    const from = rows.length;
    const { data, error, count } = await client
      .from(table)
      .select(columns, { count: "exact" })
      .eq(filterColumn, filterValue)
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) {
      // Avoid logging raw database responses, which can include internal details.
      throw new Error(
        `Sitemap dependency ${table} failed at offset ${from} (${error.code || "unknown"}).`,
      );
    }
    if (!Array.isArray(data) || count === null || !Number.isSafeInteger(count) || count < 0) {
      throw new Error(`Sitemap dependency ${table} returned incomplete data or count.`);
    }
    expectedCount ??= count;
    if (count !== expectedCount || data.length !== Math.min(PAGE_SIZE, expectedCount - from)) {
      throw new Error(`Sitemap dependency ${table} changed or returned a truncated page.`);
    }
    for (const row of data as unknown as Row[]) {
      if (!row || (typeof row.id !== "string" && typeof row.id !== "number") || ids.has(row.id)) {
        throw new Error(`Sitemap dependency ${table} returned missing or duplicate IDs.`);
      }
      ids.add(row.id);
      rows.push(row);
    }
  } while (rows.length < expectedCount);
  return rows;
}
