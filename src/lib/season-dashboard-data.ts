import type { Game, GameGenre, GameSeasonCard, Season } from "@/src/features";
import { getGamesWithSeasons, resources } from "@/src/features";
import { supabase } from "@/src/lib/supabase";

type SupabaseGame = {
  created_at: string;
  description: string | null;
  icon_url: string | null;
  id: string;
  name: string;
  slug: string;
};

type SupabaseSeason = {
  created_at: string;
  description: string | null;
  ends_at: string;
  game_id: string;
  id: string;
  name: string;
  slug: string;
  starts_at: string;
};

const supabaseFetchTimeoutMs = 8_000;
const missingSupabaseConfigMessage =
  "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.";
const gameDisplayAssets: Record<
  string,
  {
    detailImage: string;
    genre: GameGenre;
    image: string;
  }
> = {
  "diablo-4": {
    detailImage: "/images/d4-detailpage.png",
    genre: "ARPG",
    image: "/images/d4-icon.jpg",
  },
  "last-epoch": {
    detailImage: "/images/le-detailpage.png",
    genre: "ARPG",
    image: "/images/le-icon3.png",
  },
  "league-of-legends": {
    detailImage: "",
    genre: "MOBA",
    image: "/images/lol-icon.png",
  },
  "path-of-exile": {
    detailImage: "",
    genre: "ARPG",
    image: "/images/poe1-icon3.png",
  },
  "world-of-warcraft": {
    detailImage: "",
    genre: "MMORPG",
    image: "/images/WoW-icon.png",
  },
};

export async function getSupabaseSeasonCards(): Promise<{
  error: string | null;
  games: GameSeasonCard[];
}> {
  const [gamesResult, seasonsResult] = await Promise.all([
    getSupabaseGames(),
    getSupabaseSeasons(),
  ]);

  if (gamesResult.error || seasonsResult.error) {
    return {
      error:
        gamesResult.error ??
        seasonsResult.error ??
        "Could not load Supabase data.",
      games: [],
    };
  }

  return {
    error: null,
    games: getGamesWithSeasons({
      games: gamesResult.games,
      resources,
      seasons: seasonsResult.seasons,
    }),
  };
}

async function getSupabaseGames() {
  if (!supabase) {
    return {
      error: missingSupabaseConfigMessage,
      games: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from("games")
      .select("id, name, slug, description, icon_url, created_at")
      .order("name", { ascending: true })
      .abortSignal(AbortSignal.timeout(supabaseFetchTimeoutMs));

    if (error) {
      return {
        error: error.message,
        games: [],
      };
    }

    return {
      error: null,
      games: ((data ?? []) as SupabaseGame[]).map(toDashboardGame),
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
      games: [],
    };
  }
}

async function getSupabaseSeasons() {
  if (!supabase) {
    return {
      error: missingSupabaseConfigMessage,
      seasons: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from("seasons")
      .select("id, game_id, name, slug, starts_at, ends_at, description, created_at")
      .order("starts_at", { ascending: true })
      .abortSignal(AbortSignal.timeout(supabaseFetchTimeoutMs));

    if (error) {
      return {
        error: error.message,
        seasons: [],
      };
    }

    return {
      error: null,
      seasons: ((data ?? []) as SupabaseSeason[]).map(toSeason),
    };
  } catch (error) {
    return {
      error: getErrorMessage(error),
      seasons: [],
    };
  }
}

function toDashboardGame(game: SupabaseGame): Game {
  const displayAssets = gameDisplayAssets[game.slug];

  return {
    createdAt: game.created_at,
    description: game.description,
    detailImage: displayAssets?.detailImage ?? "",
    genre: displayAssets?.genre ?? "ARPG",
    id: game.id,
    image: game.icon_url ?? displayAssets?.image ?? "",
    slug: game.slug,
    title: game.name,
    updatedAt: game.created_at,
  };
}

function toSeason(season: SupabaseSeason): Season {
  return {
    createdAt: season.created_at,
    description: season.description,
    endDate: toDateOnly(season.ends_at),
    gameId: season.game_id,
    id: season.id,
    slug: season.slug,
    startDate: toDateOnly(season.starts_at),
    title: season.name,
    type: "Season",
    updatedAt: season.created_at,
  };
}

function toDateOnly(value: string) {
  return value.slice(0, 10);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Supabase error.";
}
