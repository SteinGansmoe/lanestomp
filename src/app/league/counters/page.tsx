import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { connection } from "next/server";

import { CounterPickSelector } from "@/src/components/league/counter-pick-selector";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import { getLeagueChampions } from "@/src/features/league/champions";

export const metadata: Metadata = {
  title: "Counter Picks | LaneStomp",
  description:
    "Find League of Legends counter picks by champion and role with LaneStomp matchup explanations.",
};

export default async function LeagueCountersPage() {
  await connection();

  const { champions, error } = await getLeagueChampions();

  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        {error ? (
          <Card className="mx-4 mt-6 border-amber-300/20 bg-amber-300/10 p-5 text-amber-100 sm:mx-6 lg:mx-8">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="font-mono text-lg">Champion data is not ready yet</CardTitle>
                <p className="mt-2 text-sm leading-6 text-amber-100/80">
                  Apply the latest champion migration and run the Data Dragon import before using
                  Counter Picks.
                </p>
                <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                  {error}
                </p>
              </div>
            </div>
          </Card>
        ) : champions.length > 0 ? (
          <CounterPickSelector champions={champions} />
        ) : (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            <CardTitle className="font-mono text-xl">No champions imported yet</CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Run the League champion import script to populate the counter pick selector.
            </p>
          </Card>
        )}
      </section>
    </main>
  );
}
