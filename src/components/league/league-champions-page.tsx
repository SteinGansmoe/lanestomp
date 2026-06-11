import Image from "next/image";
import Link from "next/link";
import { Database, ShieldAlert, Swords } from "lucide-react";
import { connection } from "next/server";

import { BackButton } from "@/src/components/back-button";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import { getLeagueChampions } from "@/src/features/league/champions";

export async function LeagueChampionsPage() {
  await connection();

  const { champions, error } = await getLeagueChampions();
  const dataVersion = champions[0]?.version ?? null;

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton href="/league/matchups" label="Back to matchup selector" />
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/15"
            href="/league/matchups"
          >
            Open matchup selector
            <Swords className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_32rem),linear-gradient(135deg,rgba(88,28,135,0.22),transparent_38rem)] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-5 flex size-12 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-400/10 text-emerald-100">
                  <Swords className="size-6" aria-hidden="true" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-200/80">
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

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
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
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {champions.map((champion) => (
                  <article
                    className="group flex min-w-0 gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3 transition hover:border-emerald-300/25 hover:bg-white/[0.06]"
                    key={champion.id}
                  >
                    <Image
                      alt=""
                      aria-hidden="true"
                      className="size-16 rounded-md border border-white/10 bg-[#0b1220] object-cover"
                      height={64}
                      src={champion.image_url}
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
                            className="rounded-md border border-emerald-300/15 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-100/90"
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
              <Card className="border-white/10 bg-white/[0.035] p-8 text-center text-zinc-300">
                <Database className="mx-auto mb-4 size-8 text-zinc-500" aria-hidden="true" />
                <CardTitle className="font-mono text-xl">No champions imported yet</CardTitle>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Run the Data Dragon import script to populate this cached dataset.
                </p>
              </Card>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <p className="font-mono text-xs uppercase text-zinc-500">{label}</p>
      <p className="mt-2 truncate text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
