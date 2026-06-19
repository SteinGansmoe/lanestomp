import Link from "next/link";
import type { Metadata } from "next";
import { Database, ShieldAlert, Swords } from "lucide-react";
import { connection } from "next/server";

import { BackButton } from "@/src/components/back-button";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import { MatchupSelector } from "@/src/components/league/matchup-selector";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import { getLeagueChampions } from "@/src/features/league/champions";
import { getLeagueMatchupCoverageSummary } from "@/src/features/league/matchups";

export const metadata: Metadata = {
  alternates: {
    canonical: "/league/matchups",
  },
  description:
    "Find League of Legends matchup guides by champion and role with LaneStomp matchup prep.",
  title: "League Matchup Guides",
};

export default async function LeagueMatchupsPage() {
  await connection();

  const { champions, error } = await getLeagueChampions();
  const { coverage } =
    champions.length > 0 ? await getLeagueMatchupCoverageSummary(champions) : { coverage: null };

  return (
    <LaneStompPageShell>
        <SiteHeader />

        <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
          <BackButton href="/" label="Back to LaneStomp" />
          <Link
            className="inline-flex w-fit max-w-full items-center gap-2 rounded border border-cyan-300/15 bg-cyan-400/[0.07] px-3 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/35 hover:bg-cyan-400/10"
            href="/champions"
          >
            <Database className="size-4" aria-hidden="true" />
            Champion data
          </Link>
        </div>

        <section className="overflow-hidden border border-cyan-100/15 bg-[#06111f]/88">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_30rem),linear-gradient(135deg,rgba(8,24,40,0.94),rgba(3,9,20,0.84))] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                <Swords className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  Matchup guides
                </p>
                <h1 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white sm:text-3xl">
                  Find your lane plan
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                  Search champions directly, filter by role, and open the matchup guide for the
                  lane you want to study.
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
    </LaneStompPageShell>
  );
}
