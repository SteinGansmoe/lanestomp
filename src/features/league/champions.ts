import { supabase } from "@/src/lib/supabase";
import { getChampionSlug } from "@/src/features/league/matchup-route-core";

export {
  getChampionSlug,
  slugifyChampionName,
} from "@/src/features/league/matchup-route-core";

export type LeagueChampion = {
  id: string;
  image_filename: string | null;
  image_url: string;
  is_active: boolean;
  name: string;
  riot_data_key: string | null;
  riot_key: string;
  slug: string | null;
  tags: string[];
  title: string;
  version: string;
};

export type LeagueChampionsResult = {
  champions: LeagueChampion[];
  error: string | null;
};

export async function getLeagueChampions(): Promise<LeagueChampionsResult> {
  if (!supabase) {
    return {
      champions: [],
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { data, error } = await supabase
    .from("league_champions")
    .select(
      "id, riot_key, riot_data_key, name, title, image_url, image_filename, slug, tags, version, is_active",
    )
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return {
      champions: [],
      error: error.message,
    };
  }

  return {
    champions: (data ?? []) as LeagueChampion[],
    error: null,
  };
}

export function getChampionIconPath(champion: Pick<LeagueChampion, "id">) {
  return `/league/champions/icons/${normalizeChampionAssetSlug(champion.id)}.png`;
}

export function getChampionSplashUrl(champion: Pick<LeagueChampion, "id">) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
}

export function findChampionBySlug(champions: LeagueChampion[], slug: string) {
  return champions.find((champion) => getChampionSlug(champion) === slug) ?? null;
}


function normalizeChampionAssetSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
