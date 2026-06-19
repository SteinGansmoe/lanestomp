import Image from "next/image";
import Link from "next/link";
import { Database, ShieldAlert, Swords } from "lucide-react";
import { connection } from "next/server";

import { BackButton } from "@/src/components/back-button";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import { getChampionIconPath, getLeagueChampions } from "@/src/features/league/champions";

export async function LeagueChampionsPage() {
  await connection();

  const { champions, error } = await getLeagueChampions();
  const dataVersion = champions[0]?.version ?? null;

  return (
    <LaneStompPageShell>
        <SiteHeader />

        <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
          <BackButton href="/league/matchups" label="Back to matchup selector" />
          <Link
            className="inline-flex w-fit max-w-full items-center gap-2 rounded border border-cyan-300/20 bg-cyan-400/[0.07] px-3 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/35 hover:bg-cyan-400/10"
            href="/league/matchups"
          >
            Open matchup selector
            <Swords className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <section className="overflow-hidden border border-cyan-100/15 bg-[#06111f]/88">
          <div className="border-b border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32rem),linear-gradient(135deg,rgba(8,24,40,0.94),rgba(3,9,20,0.82))] p-5 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 flex size-12 items-center justify-center rounded border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                  <Swords className="size-6" aria-hidden="true" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200">
                  League of Legends tool data
                </p>
                <h1 className="mt-3 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                  Champion foundation
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
                  Cached champion metadata from Riot Data Dragon, prepared for matchup guides and
                  champion pool workflows.
                </p>
              </div>

              <div className="grid overflow-hidden border border-cyan-100/15 bg-black/18 sm:grid-cols-2 lg:min-w-80">
                <StatBadge label="Champions" value={String(champions.length)} />
                <StatBadge label="Data Dragon" value={dataVersion ?? "Not imported"} />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {error ? (
              <Card className="border-amber-300/20 bg-amber-300/10 p-5 text-amber-100">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  <div>
                    <CardTitle className="font-mono text-lg">
                      Champion data is not ready yet
                    </CardTitle>
                    <p className="mt-2 text-sm leading-6 text-amber-100/80">
                      Apply the latest migration and run the League champion import script.
                    </p>
                    <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                      {error}
                    </p>
                  </div>
                </div>
              </Card>
            ) : champions.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {champions.map((champion) => (
                  <article
                    className="group flex min-w-0 gap-3 border border-cyan-100/12 bg-[#071321]/70 p-3 transition hover:border-cyan-300/30 hover:bg-cyan-400/[0.055]"
                    key={champion.id}
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="size-16 rounded border border-cyan-100/15 bg-[#0b1220] object-cover"
                      height={64}
                      src={getChampionIconPath(champion)}
                      unoptimized
                      width={64}
                    />
                    <div className="min-w-0">
                      <h2 className="truncate font-medium text-zinc-100">{champion.name}</h2>
                      <p className="truncate text-sm capitalize text-zinc-400">
                        {champion.title || "Champion"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {champion.tags.map((tag) => (
                          <span
                            className="rounded border border-cyan-300/15 bg-cyan-400/[0.06] px-2 py-0.5 text-xs text-cyan-100/90"
                            key={`${champion.id}-${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <Card className="border-cyan-100/15 bg-white/[0.035] p-8 text-center text-zinc-300">
                <Database className="mx-auto mb-4 size-8 text-zinc-500" aria-hidden="true" />
                <CardTitle className="font-mono text-xl">No champions imported yet</CardTitle>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Run the Data Dragon import script to populate this cached dataset.
                </p>
              </Card>
            )}
          </div>
        </section>
    </LaneStompPageShell>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-cyan-100/10 px-4 py-3 sm:border-l">
      <p className="font-mono text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-2 truncate text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
