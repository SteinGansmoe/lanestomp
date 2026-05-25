import { Gamepad2 } from "lucide-react";
import { connection } from "next/server";

import { MyGamesPage } from "@/src/components/my-games-page";
import { SiteHeader } from "@/src/components/site-header";
import { Card } from "@/src/components/ui/card";
import { getSupabaseSeasonCards } from "@/src/lib/season-dashboard-data";

export default async function Page() {
  await connection();

  const seasonCardsResult = await getSupabaseSeasonCards();
  const now = new Date().toISOString();

  if (seasonCardsResult.error) {
    return <MyGamesDataError message={seasonCardsResult.error} />;
  }

  return <MyGamesPage games={seasonCardsResult.games} now={now} />;
}

function MyGamesDataError({ message }: { message: string }) {
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
                Could not load followed games
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                Season Tracker could not fetch season data from Supabase right
                now.
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
