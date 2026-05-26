import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Swords } from "lucide-react";
import { connection } from "next/server";

import { MatchupSelector } from "@/src/components/league/matchup-selector";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import {
  findChampionBySlug,
  getLeagueChampions,
  type LeagueChampion,
} from "@/src/features/league/champions";
import { isLeagueRole, type LeagueRole } from "@/src/features/league/roles";

type LeagueMatchupPageProps = {
  params: Promise<{ matchup: string }>;
  searchParams: Promise<{ role?: string | string[] }>;
};

const matchupSections = [
  {
    title: "Overview",
    body:
      "Use this matchup shell to frame the lane plan before AI-generated guidance arrives. Compare range, wave control, crowd control, and who gets to start fights on their terms.",
  },
  {
    title: "Early game",
    body:
      "Track level one spacing, first wave control, and how quickly each champion can contest the first three melee minions. This section will later become matchup-specific.",
  },
  {
    title: "Trading pattern",
    body:
      "Use short trades until cooldowns and range patterns are understood. Watch for the opponent's main punish window before committing to longer exchanges.",
  },
  {
    title: "Power spikes",
    body:
      "Respect first recall items, level six, and completed mythic-style item timings. Future versions will map exact champion breakpoints here.",
  },
  {
    title: "Danger windows",
    body:
      "Ping missing information before wave crashes, jungle hover timings, and all-in cooldowns. Treat fog of war as the biggest variable for now.",
  },
  {
    title: "Items/runes notes",
    body:
      "Hold item and rune notes here until matchup intelligence is connected. Future versions can suggest defensive shards, sustain options, and first recall priorities.",
  },
] as const;

export default async function LeagueMatchupPage({
  params,
  searchParams,
}: LeagueMatchupPageProps) {
  await connection();

  const [{ matchup }, query, championsResult] = await Promise.all([
    params,
    searchParams,
    getLeagueChampions(),
  ]);
  const role = getValidRole(query.role);
  const { championA, championB } = parseMatchup(matchup, championsResult.champions);

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200"
            href="/league/matchups"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to matchup selector
          </Link>
          <Link
            className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
            href="/games/league-of-legends/champions"
          >
            Champion data
          </Link>
        </div>

        {championsResult.error ? (
          <Card className="border-amber-300/20 bg-amber-300/10 p-5 text-amber-100">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="font-mono text-lg">
                  Champion data is not ready yet
                </CardTitle>
                <p className="mt-2 text-sm leading-6 text-amber-100/80">
                  Apply the latest champion migration and run the Data Dragon import before opening matchups.
                </p>
                <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                  {championsResult.error}
                </p>
              </div>
            </div>
          </Card>
        ) : championsResult.champions.length === 0 ? (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            <CardTitle className="font-mono text-xl">
              No champions imported yet
            </CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Run the League champion import script to populate matchup routes.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
              href="/games/league-of-legends/champions"
            >
              View champion data
            </Link>
          </Card>
        ) : championA && championB ? (
          <>
            <MatchupHero championA={championA} championB={championB} role={role} />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {matchupSections.map((section) => (
                <article
                  className="rounded-lg border border-white/10 bg-[#10182b] p-5 shadow-xl shadow-black/10"
                  key={section.title}
                >
                  <h2 className="font-mono text-lg font-semibold text-white">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>

            <section className="rounded-lg border border-white/10 bg-[#10182b] p-5">
              <h2 className="font-mono text-xl font-semibold text-white">
                Try another matchup
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                The selector stays here so future matchup pages can branch from the same flow.
              </p>
              <div className="mt-5">
                <MatchupSelector champions={championsResult.champions} initialRole={role} />
              </div>
            </section>
          </>
        ) : (
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            <CardTitle className="font-mono text-xl">
              Matchup not found
            </CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Pick two champions from the selector to create a matchup route.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-violet-300/20 bg-violet-500/20 px-3 py-2 text-sm font-medium text-violet-100 transition hover:bg-violet-500/30"
              href="/league/matchups"
            >
              Open selector
            </Link>
          </Card>
        )}
      </section>
    </main>
  );
}

function MatchupHero({
  championA,
  championB,
  role,
}: {
  championA: LeagueChampion;
  championB: LeagueChampion;
  role: LeagueRole;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
      <div className="grid min-h-72 lg:grid-cols-[1fr_auto_1fr]">
        <ChampionPanel champion={championA} side="left" />
        <div className="flex items-center justify-center border-y border-white/10 bg-black/20 p-5 lg:border-x lg:border-y-0">
          <div className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-500/20 text-violet-100">
              <Swords className="size-7" aria-hidden="true" />
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              {role === "adc" ? "ADC" : role} matchup
            </p>
            <p className="mt-2 text-sm text-zinc-400">Temporary guide shell</p>
          </div>
        </div>
        <ChampionPanel champion={championB} side="right" />
      </div>
    </section>
  );
}

function ChampionPanel({
  champion,
  side,
}: {
  champion: LeagueChampion;
  side: "left" | "right";
}) {
  return (
    <div className="relative min-h-72 overflow-hidden p-6 sm:p-8">
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover opacity-35"
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        src={champion.image_url}
      />
      <div
        className={`absolute inset-0 ${
          side === "left"
            ? "bg-gradient-to-r from-[#10182b] via-[#10182b]/70 to-transparent"
            : "bg-gradient-to-l from-[#10182b] via-[#10182b]/70 to-transparent"
        }`}
      />
      <div className="relative flex h-full min-h-56 flex-col justify-end">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
          {side === "left" ? "Champion A" : "Champion B"}
        </p>
        <h1 className="mt-3 font-mono text-4xl font-semibold tracking-normal text-white">
          {champion.name}
        </h1>
        <p className="mt-2 max-w-sm text-sm capitalize text-zinc-300">
          {champion.title || "Champion"}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {champion.tags.map((tag) => (
            <span
              className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-zinc-200"
              key={`${champion.id}-${tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function parseMatchup(matchup: string, champions: LeagueChampion[]) {
  const [championASlug, championBSlug] = matchup.split("-vs-");

  return {
    championA: championASlug
      ? findChampionBySlug(champions, championASlug)
      : null,
    championB: championBSlug
      ? findChampionBySlug(champions, championBSlug)
      : null,
  };
}

function getValidRole(role: string | string[] | undefined): LeagueRole {
  const nextRole = Array.isArray(role) ? role[0] : role;

  return isLeagueRole(nextRole) ? nextRole : "mid";
}
