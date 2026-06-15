import { supabase } from "@/src/lib/supabase";
import { getChampionSlug } from "@/src/features/league/matchup-route-core";

export {
  getChampionSlug,
  slugifyChampionName,
} from "@/src/features/league/matchup-route-core";

export type LeagueChampion = {
  id: string;
  image_url: string;
  name: string;
  riot_key: string;
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
    .select("id, riot_key, name, title, image_url, tags, version")
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

export function getChampionSplashUrl(champion: Pick<LeagueChampion, "id">) {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
}

export function findChampionBySlug(champions: LeagueChampion[], slug: string) {
  return champions.find((champion) => getChampionSlug(champion) === slug) ?? null;
}
