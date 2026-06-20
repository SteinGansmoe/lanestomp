import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Crosshair,
  Database,
  Hourglass,
  Lightbulb,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { connection } from "next/server";

import {
  LaneStompPageBackground,
  laneStompContentClassName,
  laneStompPageClassName,
} from "@/src/components/lane-stomp-page";
import { ChangeMatchupPanel } from "@/src/components/league/change-matchup-panel";
import { HextechFrame } from "@/src/components/league/hextech-frame";
import { LeagueMatchupReviewPanel } from "@/src/components/league/league-matchup-review-panel";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import {
  findChampionBySlug,
  getChampionIconPath,
  getLeagueChampions,
  getChampionSplashUrl,
  type LeagueChampion,
} from "@/src/features/league/champions";
import {
  getLeagueMatchupCoverage,
  getLeagueMatchup,
  type LeagueMatchupCoverage,
  type LeagueMatchup,
} from "@/src/features/league/matchups";
import { isLeagueRole, type LeagueRole } from "@/src/features/league/roles";

type LeagueMatchupPageProps = {
  params: Promise<{ matchup: string }>;
  searchParams: Promise<{ role?: string | string[] }>;
};

const fallbackMetadataTitle = "League Matchup Guide";
const fallbackMetadataDescription =
  "Learn League of Legends matchups, trading patterns, power spikes and win conditions with LaneStomp.";
const matchupHeroActionClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-none border border-cyan-100/20 bg-[#06111f]/85 px-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-zinc-100 transition hover:border-cyan-300/45 hover:bg-cyan-400/[0.08] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55";

export async function generateMetadata({
  params,
  searchParams,
}: LeagueMatchupPageProps): Promise<Metadata> {
  const [{ matchup }, query, championsResult] = await Promise.all([
    params,
    searchParams,
    getLeagueChampions(),
  ]);
  const role = getValidRole(query.role);
  const { championA, championB } = parseMatchup(matchup, championsResult.champions);

  if (championsResult.error || !championA || !championB) {
    return createMatchupMetadata({
      description: fallbackMetadataDescription,
      title: fallbackMetadataTitle,
      url: "/league/matchups",
    });
  }

  const roleLabel = getSeoRoleLabel(role);
  const title = `${championA.name} vs ${championB.name} ${roleLabel} Matchup Guide`;
  const description = `Learn how to play ${championA.name} into ${championB.name} as ${roleLabel}. Trading patterns, power spikes, danger windows and win conditions.`;

  return createMatchupMetadata({
    description,
    title,
    url: `/league/matchups/${matchup}?role=${role}`,
  });
}

export default async function LeagueMatchupPage({ params, searchParams }: LeagueMatchupPageProps) {
  await connection();

  const [{ matchup }, query, championsResult] = await Promise.all([
    params,
    searchParams,
    getLeagueChampions(),
  ]);
  const role = getValidRole(query.role);
  const { championA, championB } = parseMatchup(matchup, championsResult.champions);
  const [matchupResult, coverageResult] =
    championA && championB
      ? await Promise.all([
          getLeagueMatchup({
            championAId: championA.id,
            championBId: championB.id,
            role,
          }),
          getLeagueMatchupCoverage({
            champions: championsResult.champions,
            role,
          }),
        ])
      : [null, null];

  return (
    <main className={laneStompPageClassName}>
      <LaneStompPageBackground />

      <section className={laneStompContentClassName}>
        <SiteHeader />

        {championsResult.error ? (
          <Card className="rounded-none border-amber-300/20 bg-[#10182b]/92 p-5 text-amber-100 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="font-mono text-lg">Champion data is not ready yet</CardTitle>
                <p className="mt-2 text-sm leading-6 text-amber-100/80">
                  Apply the latest champion migration and run the Data Dragon import before opening
                  matchups.
                </p>
                <p className="mt-4 border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                  {championsResult.error}
                </p>
              </div>
            </div>
          </Card>
        ) : championsResult.champions.length === 0 ? (
          <Card className="rounded-none border-white/10 bg-[#10182b]/92 p-8 text-center text-zinc-300 shadow-xl shadow-black/20 backdrop-blur-md">
            <CardTitle className="font-mono text-xl">No champions imported yet</CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Run the League champion import script to populate matchup routes.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
              href="/champions"
            >
              View champion data
            </Link>
          </Card>
        ) : championA && championB ? (
          <>
            <MatchupHero
              championA={championA}
              championB={championB}
              champions={championsResult.champions}
              matchup={matchupResult?.matchup ?? null}
              role={role}
            />

            <TacticalSummaryStrip
              championA={championA}
              championB={championB}
              matchup={matchupResult?.matchup ?? null}
              role={role}
            />

            {matchupResult?.error ? (
              <Card className="rounded-none border-amber-300/20 bg-[#10182b]/92 p-5 text-amber-100 shadow-xl shadow-black/20 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  <div>
                    <CardTitle className="font-mono text-lg">
                      Live matchup data is not ready yet
                    </CardTitle>
                    <p className="mt-2 text-sm leading-6 text-amber-100/80">
                      Showing the generation progress state until the structured matchup table is
                      available.
                    </p>
                    <p className="mt-4 border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                      {matchupResult.error}
                    </p>
                  </div>
                </div>
              </Card>
            ) : null}

            {matchupResult?.matchup ? (
              <section className="mt-10 grid justify-center gap-4 sm:mt-12">
                <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-3">
                  <LeagueMatchupReviewPanel
                    championAId={championA.id}
                    championAName={championA.name}
                    championBId={championB.id}
                    championBName={championB.name}
                    initialMatchup={matchupResult.matchup}
                    role={role}
                  />

                  <TipStrip
                    championA={championA}
                    championB={championB}
                    role={role}
                    updatedAt={matchupResult.matchup.updated_at}
                  />
                </div>

                <aside aria-hidden="true" className="hidden" />
              </section>
            ) : (
              <UnavailableMatchupState
                championA={championA}
                championB={championB}
                coverage={coverageResult?.coverage ?? null}
                coverageError={coverageResult?.error ?? null}
                role={role}
              />
            )}
          </>
        ) : (
          <Card className="rounded-none border-white/10 bg-[#10182b]/92 p-8 text-center text-zinc-300 shadow-xl shadow-black/20 backdrop-blur-md">
            <CardTitle className="font-mono text-xl">Matchup not found</CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Pick two champions from the selector to create a matchup route.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
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

function UnavailableMatchupState({
  championA,
  championB,
  coverage,
  coverageError,
  role,
}: {
  championA: LeagueChampion;
  championB: LeagueChampion;
  coverage: LeagueMatchupCoverage | null;
  coverageError: string | null;
  role: LeagueRole;
}) {
  const roleLabel = getRoleLabel(role);

  return (
    <section className="overflow-hidden border border-cyan-300/15 bg-[#06111f]/88">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
            <Hourglass className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
              Matchup generation in progress
            </p>
            <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white">
              This guide is not available yet
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
              LaneStomp is currently generating thousands of matchup guides. This {roleLabel} lane
              matchup for {championA.name} vs {championB.name} is not available yet, but new
              matchups are being added continuously.
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Check back later, or choose another matchup while coverage expands.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link className={matchupHeroActionClassName} href={`/league/matchups?role=${role}`}>
                <Crosshair className="size-4" aria-hidden="true" />
                Pick another matchup
              </Link>
              <Link className={matchupHeroActionClassName} href="/champions">
                Champion data
              </Link>
            </div>
          </div>
        </div>

        <CoverageProgressCard
          coverage={coverage}
          coverageError={coverageError}
          roleLabel={roleLabel}
        />
      </div>
    </section>
  );
}

function CoverageProgressCard({
  coverage,
  coverageError,
  roleLabel,
}: {
  coverage: LeagueMatchupCoverage | null;
  coverageError: string | null;
  roleLabel: string;
}) {
  return (
    <div className="border border-white/10 bg-black/15 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center border border-[#C9AA5A]/25 bg-[#C9AA5A]/10 text-[#F4D88A]">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#F4D88A]">
            Current {roleLabel} Lane progress
          </p>
          <p className="mt-1 text-xs text-zinc-500">Publicly available guides</p>
        </div>
      </div>

      {coverage ? (
        <>
          <div className="mt-5 flex items-end justify-between gap-3">
            <p className="font-mono text-3xl font-semibold text-white">
              {formatNumber(coverage.generatedCount)}
              <span className="text-base text-zinc-500">
                {" "}
                / {formatNumber(coverage.totalCount)}
              </span>
            </p>
            <p className="border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 font-mono text-sm text-cyan-100">
              {coverage.percentComplete}%
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden bg-black/40">
            <div
              className="h-full bg-cyan-300 transition-[width] duration-300"
              style={{ width: `${coverage.percentComplete}%` }}
            />
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Based on {coverage.roleChampionCount} champions currently classified for this lane.
          </p>
        </>
      ) : (
        <p className="mt-5 text-sm leading-6 text-zinc-400">
          Coverage totals are temporarily unavailable, but matchup generation is still in progress.
        </p>
      )}

      {coverageError ? (
        <p className="mt-3 border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100/80">
          Progress could not refresh: {coverageError}
        </p>
      ) : null}
    </div>
  );
}

function TacticalSummaryStrip({
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
  return (
    <section className="grid gap-4 border border-cyan-100/15 bg-[#06111f]/82 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-5">
      <div className="flex size-11 items-center justify-center border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
        <Crosshair className="size-5" aria-hidden="true" />
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Start here
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            Read <span className="text-cyan-100">Overview</span> →{" "}
            <span className="text-cyan-100">Trading Pattern</span> →{" "}
            <span className="text-cyan-100">Danger Windows</span> first for the fastest{" "}
            {getRoleLabel(role)} lane plan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MatchupMetaPill label={`${championA.name} into ${championB.name}`} />
          <MatchupMetaPill label={matchup?.confidence_level ?? "Confidence pending"} />
        </div>
      </div>
    </section>
  );
}

function MatchupHero({
  championA,
  championB,
  champions,
  matchup,
  role,
}: {
  championA: LeagueChampion;
  championB: LeagueChampion;
  champions: LeagueChampion[];
  matchup: LeagueMatchup | null;
  role: LeagueRole;
}) {
  const roleLabel = getRoleLabel(role);
  const confidenceLabel = matchup?.confidence_level
    ? `${matchup.confidence_level} confidence`
    : "Confidence pending";
  const updatedLabel = matchup?.updated_at
    ? `Updated ${formatMatchupDate(matchup.updated_at)}`
    : "Update pending";

  return (
    <HextechFrame className="relative isolate min-h-[38rem] overflow-hidden bg-[#030914] shadow-[0_0_34px_rgba(0,0,0,0.42),0_0_42px_rgba(34,211,238,0.08)] lg:min-h-[42rem]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_32%,rgba(8,24,40,0.98),rgba(3,9,20,1)_72%),linear-gradient(180deg,#06111f,#030914)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-[linear-gradient(rgba(103,232,249,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.035)_1px,transparent_1px)] bg-[size:56px_56px]"
      />
      <div
        className="absolute inset-y-0 left-0 z-[2] w-[60%] opacity-[0.84]"
        style={{
          maskImage:
            "linear-gradient(to right, black 0%, black 50%, rgba(0,0,0,0.58) 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 50%, rgba(0,0,0,0.58) 70%, transparent 100%)",
        }}
      >
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover saturate-125 [transform:scaleX(-1)]"
          fill
          priority
          sizes="62vw"
          src={getChampionSplashUrl(championA)}
          style={{ objectPosition: getChampionSplashFocus(championA) }}
          unoptimized
        />
      </div>
      <div
        className="absolute inset-y-0 right-0 z-[2] w-[60%] opacity-[0.84]"
        style={{
          maskImage:
            "linear-gradient(to left, black 0%, black 50%, rgba(0,0,0,0.58) 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 0%, black 50%, rgba(0,0,0,0.58) 70%, transparent 100%)",
        }}
      >
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover saturate-125"
          fill
          priority
          sizes="62vw"
          src={getChampionSplashUrl(championB)}
          style={{ objectPosition: getChampionSplashFocus(championB) }}
          unoptimized
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_34%,rgba(34,211,238,0.1),rgba(8,24,40,0.48)_15rem,rgba(3,9,20,0.1)_30rem,transparent_44rem),radial-gradient(circle_at_50%_42%,rgba(201,170,90,0.04),transparent_18rem),linear-gradient(90deg,rgba(3,9,20,0.84)_0%,rgba(3,9,20,0.32)_27%,rgba(3,9,20,0.7)_50%,rgba(3,9,20,0.32)_73%,rgba(3,9,20,0.84)_100%),linear-gradient(180deg,rgba(3,9,20,0.22),rgba(3,9,20,0.76))]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#030914]/86 via-[#030914]/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-52 bg-gradient-to-t from-[#030914] via-[#030914]/52 to-transparent"
      />

      <div className="relative z-40 flex min-h-[38rem] flex-col px-6 py-10 sm:px-10 lg:min-h-[42rem] lg:px-14">
        <div className="flex flex-wrap items-center gap-2">
          <Link className={matchupHeroActionClassName} href="/league/matchups">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to selector
          </Link>
          {champions.length > 0 ? (
            <ChangeMatchupPanel
              champions={champions}
              currentChampionAId={championA.id}
              currentChampionBId={championB.id}
              currentRole={role}
              key={`${championA.id}-${championB.id}-${role}`}
              triggerClassName={matchupHeroActionClassName}
            />
          ) : null}
          <Link className={matchupHeroActionClassName} href="/champions">
            <Database className="size-4" aria-hidden="true" />
            Champion data
          </Link>
        </div>

        <div className="flex grow items-center justify-center py-12">
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-20 bg-cyan-200/35" aria-hidden="true" />
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">
                Matchup guide
              </p>
              <span
                className="size-2 rotate-45 border border-cyan-200/80 shadow-[0_0_14px_rgba(34,211,238,0.55)]"
                aria-hidden="true"
              />
              <span className="h-px w-20 bg-cyan-200/35" aria-hidden="true" />
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
              <ChampionIdentity champion={championA} align="right" />

              <div className="mx-auto grid justify-items-center gap-3">
                <div className="flex size-16 items-center justify-center border border-cyan-300/35 bg-cyan-400/[0.08] font-mono text-lg font-semibold text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.16)]">
                  VS
                </div>
                <div className="h-12 w-px bg-[linear-gradient(180deg,rgba(103,232,249,0.8),rgba(201,170,90,0.45),rgba(103,232,249,0.8))]" />
              </div>

              <ChampionIdentity champion={championB} align="left" />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <MatchupMetaPill label={roleLabel} />
              <MatchupMetaPill label={confidenceLabel} />
              <MatchupMetaPill label={updatedLabel} />
              {matchup?.difficulty_rating ? (
                <MatchupMetaPill label={`Difficulty ${matchup.difficulty_rating}/5`} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </HextechFrame>
  );
}

function MatchupMetaPill({ label }: { label: string }) {
  return (
    <span className="border border-cyan-100/15 bg-[#020814]/70 px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-zinc-300">
      {label}
    </span>
  );
}

function ChampionIdentity({
  align,
  champion,
}: {
  align: "left" | "right";
  champion: LeagueChampion;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col items-center gap-4 text-center lg:flex-row ${
        align === "right" ? "lg:justify-end lg:text-right" : "lg:justify-start lg:text-left"
      }`}
    >
      {align === "right" ? (
        <>
          <ChampionName champion={champion} />
          <ChampionIcon champion={champion} />
        </>
      ) : (
        <>
          <ChampionIcon champion={champion} />
          <ChampionName champion={champion} />
        </>
      )}
    </div>
  );
}

function ChampionName({ champion }: { champion: LeagueChampion }) {
  return (
    <div className="min-w-0">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-200/80">
        {champion.title}
      </p>
      <h1 className="mt-2 font-mono text-4xl font-semibold uppercase leading-none tracking-normal text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:text-5xl xl:text-6xl">
        {champion.name}
      </h1>
    </div>
  );
}

const championSplashFocus: Partial<Record<string, string>> = {
  Akshan: "center 24%",
  AurelionSol: "center 18%",
};

function getChampionSplashFocus(champion: Pick<LeagueChampion, "id">) {
  return championSplashFocus[champion.id] ?? "center 32%";
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
    <section className="flex flex-col gap-3 border border-[#C9AA5A]/20 bg-[#06111f]/82 p-4 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-[#C9AA5A]/25 bg-[#C9AA5A]/10 text-[#F4D88A]">
          <Lightbulb className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#F4D88A]">
            Tactical tip
          </p>
          <p className="mt-1 leading-6">
            For {championA.name} vs {championB.name}, read overview, trading pattern, and danger
            windows first for a fast {getRoleLabel(role)} lane check.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {updatedAt ? <MatchupMetaPill label={`Updated ${formatMatchupDate(updatedAt)}`} /> : null}
        <Link
          className="inline-flex h-9 items-center gap-2 border border-cyan-100/15 bg-white/5 px-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-zinc-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/[0.08] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55"
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
      className="size-20 border border-[#C9AA5A]/50 bg-[#0b1220] object-cover shadow-[0_0_24px_rgba(0,0,0,0.35)] sm:size-24"
      height={96}
      src={getChampionIconPath(champion)}
      unoptimized
      width={96}
    />
  );
}

function parseMatchup(matchup: string, champions: LeagueChampion[]) {
  const matchupParts = matchup.split("-vs-");
  const [championASlug, championBSlug] = matchupParts;

  return {
    championA:
      matchupParts.length === 2 && championASlug
        ? findChampionBySlug(champions, championASlug)
        : null,
    championB:
      matchupParts.length === 2 && championBSlug
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

function getSeoRoleLabel(role: LeagueRole) {
  return role.toUpperCase();
}

function createMatchupMetadata({
  description,
  title,
  url,
}: {
  description: string;
  title: string;
  url: string;
}): Metadata {
  return {
    alternates: {
      canonical: url,
    },
    description,
    openGraph: {
      description,
      siteName: "LaneStomp",
      title,
      type: "article",
      url,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function formatMatchupDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
