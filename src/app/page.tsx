import { Gamepad2 } from "lucide-react";

import { SeasonDashboard } from "@/src/components/season-dashboard";
import { SiteHeader } from "@/src/components/site-header";
import { Card } from "@/src/components/ui/card";
import { gamesSeed } from "@/src/features/games/seed";
import type { Game } from "@/src/features/games/types";
import { resources, seasons } from "@/src/features";
import { getGamesWithSeasons } from "@/src/features";
import { supabase } from "@/src/lib/supabase";

type SupabaseGame = {
  created_at: string;
  icon_url: string | null;
  id: string;
  name: string;
  slug: string;
};

const supabaseFetchTimeoutMs = 8_000;

async function getSupabaseGames() {
  if (!supabase) {
    return {
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
      games: [],
    };
  }

  try {
    const { data, error } = await supabase
      .from("games")
      .select("id, name, slug, icon_url, created_at")
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

function toDashboardGame(game: SupabaseGame): Game {
  const mockGame = gamesSeed.find(
    (item) => item.id === game.id || item.slug === game.slug
  );

  return {
    createdAt: game.created_at,
    detailImage: mockGame?.detailImage ?? "",
    genre: mockGame?.genre ?? "ARPG",
    id: game.id,
    image: game.icon_url ?? mockGame?.image ?? "",
    slug: game.slug,
    title: game.name,
    updatedAt: game.created_at,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown Supabase error.";
}

export default async function Home() {
  const { error, games: supabaseGames } = await getSupabaseGames();

  if (error) {
    return <DashboardDataError message={error} />;
  }

  const games = getGamesWithSeasons({
    games: supabaseGames,
    resources,
    seasons,
  });

  return <SeasonDashboard games={games} />;
}

function DashboardDataError({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        <SiteHeader />

        <Card className="border-rose-400/20 bg-[#10182b]/90 p-8 text-zinc-200 shadow-xl shadow-black/20">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-200 ring-1 ring-rose-300/20">
              <Gamepad2 className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-mono text-2xl font-semibold text-white">
                Could not load games
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Season Tracker could not fetch games from Supabase right now.
              </p>
              <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-rose-100">
                {message}
              </p>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
