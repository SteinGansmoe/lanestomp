import Link from "next/link";
import { ShieldAlert, Sparkles, Swords } from "lucide-react";
import { connection } from "next/server";

import { MatchupSelector } from "@/src/components/league/matchup-selector";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import { getLeagueChampions } from "@/src/features/league/champions";
import { getLeagueMatchupCoverageSummary } from "@/src/features/league/matchups";

export default async function Home() {
  await connection();

  const { champions, error } = await getLeagueChampions();
  const { coverage } =
    champions.length > 0
      ? await getLeagueMatchupCoverageSummary(champions)
      : { coverage: null };

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex max-w-7xl flex-col gap-6 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.24),transparent_30rem),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_32rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.92))] p-5 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-950/20">
                  <Swords className="size-6" aria-hidden="true" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  LaneStomp
                </p>
                <h1 className="mt-3 font-mono text-3xl font-semibold tracking-normal text-white sm:text-5xl">
                  Master matchups, sharpen champion pools, and climb with confidence.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                  Pick your champion, choose the enemy laner, and jump into
                  concise matchup notes built for champ select, loading screen,
                  and second monitor checks.
                </p>
              </div>

              <div className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-zinc-300 shadow-xl shadow-black/15 sm:min-w-72">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
                  Focus
                </p>
                <p className="flex items-center gap-2">
                  <Sparkles className="size-4 text-cyan-200" aria-hidden="true" />
                  Fast champion recognition
                </p>
                <p className="flex items-center gap-2">
                  <Sparkles className="size-4 text-violet-200" aria-hidden="true" />
                  Practical lane advice
                </p>
                <p className="flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-200" aria-hidden="true" />
                  AI-assisted drafts reviewed by admins
                </p>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <ChampionDataError message={error} />
        ) : champions.length > 0 ? (
          <MatchupSelector champions={champions} matchupCoverage={coverage} />
        ) : (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            <CardTitle className="font-mono text-xl">
              Champion data is not imported yet
            </CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Import League champion data to enable the matchup picker.
            </p>
          </Card>
        )}
      </section>
    </main>
  );
}

function ChampionDataError({ message }: { message: string }) {
  return (
    <Card className="border-amber-300/20 bg-amber-300/10 p-5 text-amber-100">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <CardTitle className="font-mono text-lg">
            Champion data is not ready yet
          </CardTitle>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">
            Apply the latest champion migration and run the Data Dragon import
            before building matchups.
          </p>
          <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
            {message}
          </p>
          <Link
            className="mt-4 inline-flex rounded-md border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-sm font-medium text-amber-50 transition hover:bg-amber-200/15"
            href="/games/league-of-legends/champions"
          >
            View champion data
          </Link>
        </div>
      </div>
    </Card>
  );
}
