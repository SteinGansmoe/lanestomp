import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Crosshair,
  Lightbulb,
  ShieldAlert,
} from "lucide-react";
import { connection } from "next/server";

import { LeagueMatchupReviewPanel } from "@/src/components/league/league-matchup-review-panel";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import {
  findChampionBySlug,
  getLeagueChampions,
  getChampionSplashUrl,
  type LeagueChampion,
} from "@/src/features/league/champions";
import {
  getLeagueMatchup,
  type LeagueMatchup,
} from "@/src/features/league/matchups";
import { isLeagueRole, type LeagueRole } from "@/src/features/league/roles";

type LeagueMatchupPageProps = {
  params: Promise<{ matchup: string }>;
  searchParams: Promise<{ role?: string | string[] }>;
};

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
  const matchupResult =
    championA && championB
      ? await getLeagueMatchup({
          championAId: championA.id,
          championBId: championB.id,
          role,
        })
      : null;

  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex max-w-7xl flex-col gap-5 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-3">
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
            <MatchupHero
              championA={championA}
              championB={championB}
              matchup={matchupResult?.matchup ?? null}
              role={role}
            />

            {matchupResult?.error ? (
              <Card className="border-amber-300/20 bg-amber-300/10 p-5 text-amber-100">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  <div>
                    <CardTitle className="font-mono text-lg">
                      Live matchup data is not ready yet
                    </CardTitle>
                    <p className="mt-2 text-sm leading-6 text-amber-100/80">
                      Showing the placeholder matchup guide until the structured matchup table is available.
                    </p>
                    <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                      {matchupResult.error}
                    </p>
                  </div>
                </div>
              </Card>
            ) : null}

            <LeagueMatchupReviewPanel
              championAId={championA.id}
              championBId={championB.id}
              initialMatchup={matchupResult?.matchup ?? null}
              role={role}
            />

            <TipStrip
              championA={championA}
              championB={championB}
              role={role}
              updatedAt={matchupResult?.matchup?.updated_at ?? null}
            />
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
  matchup,
  role,
}: {
  championA: LeagueChampion;
  championB: LeagueChampion;
  matchup: LeagueMatchup | null;
  role: LeagueRole;
}) {
  const roleLabel = getRoleLabel(role);

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
      <div className="grid lg:min-h-72 lg:grid-cols-[minmax(0,1fr)_17rem_minmax(0,1fr)]">
        <ChampionPanel champion={championA} label="You" side="left" />
        <div className="relative z-10 flex min-h-56 items-center justify-center border-y border-white/10 bg-[#081120]/95 p-4 shadow-2xl shadow-black/30 lg:border-x lg:border-y-0">
          <div className="w-full text-center">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
              {roleLabel} lane
            </p>
            <div className="mx-auto mt-4 grid max-w-44 grid-cols-[1fr_auto_1fr] items-center gap-2">
              <ChampionIcon champion={championA} />
              <div className="flex size-10 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-500/20 font-mono text-xs font-semibold text-violet-100 shadow-lg shadow-violet-950/30">
                VS
              </div>
              <ChampionIcon champion={championB} />
            </div>
            <h1 className="mt-4 font-mono text-2xl font-semibold leading-tight tracking-normal text-white">
              {championA.name} vs {championB.name}
            </h1>
            {matchup ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {matchup.difficulty_rating ? (
                  <MatchupMetaPill label={`Difficulty ${matchup.difficulty_rating}/5`} />
                ) : null}
                {matchup.confidence_level ? (
                  <MatchupMetaPill label={`Confidence ${matchup.confidence_level}`} />
                ) : null}
                {matchup.updated_at ? (
                  <MatchupMetaPill label={`Updated ${formatMatchupDate(matchup.updated_at)}`} />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
        <ChampionPanel champion={championB} label="Opponent" side="right" />
      </div>
    </section>
  );
}

function MatchupMetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-zinc-300">
      {label}
    </span>
  );
}

function ChampionPanel({
  champion,
  label,
  side,
}: {
  champion: LeagueChampion;
  label: "Opponent" | "You";
  side: "left" | "right";
}) {
  return (
    <div className="relative min-h-56 overflow-hidden p-5 transition duration-300 hover:brightness-110 sm:p-6 lg:min-h-72">
      <Image
        alt=""
        aria-hidden="true"
        className="object-cover"
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        src={getChampionSplashUrl(champion)}
      />
      <div
        className={`absolute inset-0 ${
          side === "left"
            ? "bg-gradient-to-r from-[#10182b] via-[#10182b]/68 to-[#10182b]/18"
            : "bg-gradient-to-l from-[#10182b] via-[#10182b]/68 to-[#10182b]/18"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#10182b] to-transparent" />
      <div className="relative flex h-full min-h-44 flex-col justify-end">
        <ChampionIcon champion={champion} />
        <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-zinc-500">
          {label}
        </p>
        <h2 className="mt-1 font-mono text-3xl font-semibold tracking-normal text-white">
          {champion.name}
        </h2>
        <p className="mt-1 max-w-sm text-sm capitalize text-zinc-300">
          {champion.title || "Champion"}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
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

function TipStrip({
  championA,
  championB,
  role,
  updatedAt,
}: {
  championA: LeagueChampion;
  championB: LeagueChampion;
  role: LeagueRole;
  updatedAt: string | null;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-cyan-300/10 bg-[#10182b]/80 p-4 text-sm text-zinc-400 shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
          <Lightbulb className="size-4" aria-hidden="true" />
        </span>
        <p className="leading-6">
          <span className="font-medium text-cyan-100">Tip:</span> For{" "}
          {championA.name} vs {championB.name}, read overview, trading pattern,
          and danger windows first for a fast {getRoleLabel(role)} lane check.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {updatedAt ? (
          <MatchupMetaPill label={`Updated ${formatMatchupDate(updatedAt)}`} />
        ) : null}
        <Link
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
          href={`/league/matchups?role=${role}`}
        >
          <Crosshair className="size-3.5" aria-hidden="true" />
          New matchup
        </Link>
      </div>
    </section>
  );
}

function ChampionIcon({ champion }: { champion: LeagueChampion }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="size-14 rounded-lg border border-white/15 object-cover shadow-lg shadow-black/30"
      height={56}
      src={champion.image_url}
      width={56}
    />
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

function getRoleLabel(role: LeagueRole) {
  return role === "adc" ? "ADC" : role.charAt(0).toUpperCase() + role.slice(1);
}

function formatMatchupDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
