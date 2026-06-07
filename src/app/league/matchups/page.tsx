import Link from "next/link";
import { ShieldAlert, Swords } from "lucide-react";
import { connection } from "next/server";

import { BackButton } from "@/src/components/back-button";
import { MatchupSelector } from "@/src/components/league/matchup-selector";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import { getLeagueChampions } from "@/src/features/league/champions";
import { getLeagueMatchupCoverageSummary } from "@/src/features/league/matchups";

export default async function LeagueMatchupsPage() {
  await connection();

  const { champions, error } = await getLeagueChampions();
  const { coverage } =
    champions.length > 0 ? await getLeagueMatchupCoverageSummary(champions) : { coverage: null };

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton href="/" label="Back to LaneStomp" />
          <Link
            className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
            href="/champions"
          >
            Champion data
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_30rem),linear-gradient(135deg,rgba(88,28,135,0.18),transparent_38rem)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                <Swords className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  LaneStomp
                </p>
                <h1 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white sm:text-3xl">
                  Pick your lane opponent
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                  Select two champions and a role for fast LaneStomp matchup prep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <Card className="border-amber-300/20 bg-amber-300/10 p-5 text-amber-100">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="font-mono text-lg">Champion data is not ready yet</CardTitle>
                <p className="mt-2 text-sm leading-6 text-amber-100/80">
                  Apply the latest champion migration and run the Data Dragon import before building
                  matchups.
                </p>
                <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                  {error}
                </p>
              </div>
            </div>
          </Card>
        ) : champions.length > 0 ? (
          <MatchupSelector champions={champions} matchupCoverage={coverage} />
        ) : (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            <CardTitle className="font-mono text-xl">No champions imported yet</CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Run the League champion import script to populate the selector.
            </p>
          </Card>
        )}
      </section>
    </main>
  );
}
