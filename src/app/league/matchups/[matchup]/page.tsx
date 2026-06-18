import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Crosshair, Hourglass, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { connection } from "next/server";

import { BackButton } from "@/src/components/back-button";
import { ChangeMatchupPanel } from "@/src/components/league/change-matchup-panel";
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
    <main className="relative min-h-screen overflow-hidden bg-[#050b18] px-4 py-4 text-white sm:px-6 lg:px-8">
      {championA && championB ? (
        <MatchupPageTheme championA={championA} championB={championB} />
      ) : null}

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-3 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center gap-3">
          <BackButton href="/league/matchups" label="Back to matchup selector" />
          {!championsResult.error && championsResult.champions.length > 0 ? (
            <ChangeMatchupPanel
              champions={championsResult.champions}
              currentChampionAId={championA?.id}
              currentChampionBId={championB?.id}
              currentRole={role}
              key={`${championA?.id ?? "unknown"}-${championB?.id ?? "unknown"}-${role}`}
            />
          ) : null}
          <Link
            className="ml-auto inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
            href="/champions"
          >
            Champion data
          </Link>
        </div>

        {championsResult.error ? (
          <Card className="border-amber-300/20 bg-[#10182b]/92 p-5 text-amber-100 shadow-xl shadow-black/20 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="font-mono text-lg">Champion data is not ready yet</CardTitle>
                <p className="mt-2 text-sm leading-6 text-amber-100/80">
                  Apply the latest champion migration and run the Data Dragon import before opening
                  matchups.
                </p>
                <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
                  {championsResult.error}
                </p>
              </div>
            </div>
          </Card>
        ) : championsResult.champions.length === 0 ? (
          <Card className="border-white/10 bg-[#10182b]/92 p-8 text-center text-zinc-300 shadow-xl shadow-black/20 backdrop-blur-md">
            <CardTitle className="font-mono text-xl">No champions imported yet</CardTitle>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Run the League champion import script to populate matchup routes.
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
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
              matchup={matchupResult?.matchup ?? null}
              role={role}
            />

            {matchupResult?.error ? (
              <Card className="border-amber-300/20 bg-[#10182b]/92 p-5 text-amber-100 shadow-xl shadow-black/20 backdrop-blur-md">
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
                    <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
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
          <Card className="border-white/10 bg-[#10182b]/92 p-8 text-center text-zinc-300 shadow-xl shadow-black/20 backdrop-blur-md">
            <CardTitle className="font-mono text-xl">Matchup not found</CardTitle>
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

function MatchupPageTheme({
  championA,
  championB,
}: {
  championA: LeagueChampion;
  championB: LeagueChampion;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-65">
        <ThemedSplash champion={championA} side="left" />
        <ThemedSplash champion={championB} side="right" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.18),rgba(5,11,24,0.82)_42%,rgba(5,11,24,0.82)_58%,rgba(5,11,24,0.18))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.18),rgba(5,11,24,0.58)_24rem,rgba(5,11,24,0.94)_52rem,#050b18_78rem)]" />
      <div className="absolute inset-x-[-12%] top-28 h-80 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.16),rgba(34,211,238,0.08)_34%,transparent_68%)] blur-2xl" />
      <div className="absolute inset-x-[-10%] top-[22rem] h-[30rem] bg-[radial-gradient(ellipse_at_center,rgba(226,232,240,0.09),rgba(56,189,248,0.05)_32%,transparent_72%)] blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(5,11,24,0.9)_42%,#050b18)]" />
    </div>
  );
}

function ThemedSplash({ champion, side }: { champion: LeagueChampion; side: "left" | "right" }) {
  const objectPosition = getChampionSplashFocus(champion);
  const fadeMask =
    side === "left"
      ? "linear-gradient(to right, black 0%, black 58%, rgba(0,0,0,0.55) 78%, transparent 100%)"
      : "linear-gradient(to left, black 0%, black 58%, rgba(0,0,0,0.55) 78%, transparent 100%)";

  return (
    <div
      className={`absolute top-0 h-[46rem] w-[58%] ${side === "left" ? "left-0" : "right-0"}`}
      style={{
        maskImage: fadeMask,
        WebkitMaskImage: fadeMask,
      }}
    >
      <div
        className="absolute inset-0 bg-cover blur-[1px] saturate-125"
        style={{
          backgroundImage: `url("${getChampionSplashUrl(champion)}")`,
          backgroundPosition: objectPosition,
        }}
      />
      <div
        className={`absolute inset-0 ${
          side === "left"
            ? "bg-gradient-to-r from-transparent via-[#050b18]/22 to-[#050b18]"
            : "bg-gradient-to-l from-transparent via-[#050b18]/22 to-[#050b18]"
        }`}
      />
    </div>
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
    <section className="overflow-hidden rounded-lg border border-cyan-300/15 bg-[#10182b]/92 shadow-xl shadow-black/20 backdrop-blur-md">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
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
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
                href={`/league/matchups?role=${role}`}
              >
                <Crosshair className="size-4" aria-hidden="true" />
                Pick another matchup
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/10 hover:text-white"
                href="/champions"
              >
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
    <div className="rounded-lg border border-white/10 bg-black/15 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-violet-300/20 bg-violet-500/15 text-violet-100">
          <Sparkles className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-violet-200">
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
            <p className="rounded-md border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 font-mono text-sm text-cyan-100">
              {coverage.percentComplete}%
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/40">
            <div
              className="h-full rounded-full bg-cyan-300 transition-[width] duration-300"
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
        <p className="mt-3 rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100/80">
          Progress could not refresh: {coverageError}
        </p>
      ) : null}
    </div>
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
    <section className="relative">
      <div className="flex min-h-24 items-center justify-center px-4 py-3 sm:min-h-28">
        <div className="w-full max-w-3xl text-center">
          <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center justify-end gap-3">
              <span className="hidden truncate text-right font-mono text-xl font-semibold tracking-normal text-white sm:block lg:text-2xl">
                {championA.name}
              </span>
              <ChampionIcon champion={championA} />
            </div>

            <div className="grid gap-1">
              <div className="flex size-9 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-500/25 font-mono text-xs font-semibold text-violet-100 shadow-lg shadow-violet-950/25">
                VS
              </div>
              <span className="rounded-md border border-white/10 bg-black/25 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-zinc-300">
                {roleLabel}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <ChampionIcon champion={championB} />
              <span className="hidden truncate font-mono text-xl font-semibold tracking-normal text-white sm:block lg:text-2xl">
                {championB.name}
              </span>
            </div>
          </div>

          <h1 className="mt-3 font-mono text-2xl font-semibold leading-tight tracking-normal text-white sm:hidden">
            {championA.name} vs {championB.name}
          </h1>

          {matchup ? (
            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
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
    </section>
  );
}

function MatchupMetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-white/10 bg-black/25 px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-zinc-300 shadow-sm shadow-black/20">
      {label}
    </span>
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
    <section className="flex flex-col gap-3 rounded-lg border border-cyan-300/10 bg-[#10182b]/78 p-4 text-sm text-zinc-400 shadow-lg shadow-black/10 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
          <Lightbulb className="size-4" aria-hidden="true" />
        </span>
        <p className="leading-6">
          <span className="font-medium text-cyan-100">Tip:</span> For {championA.name} vs{" "}
          {championB.name}, read overview, trading pattern, and danger windows first for a fast{" "}
          {getRoleLabel(role)} lane check.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {updatedAt ? <MatchupMetaPill label={`Updated ${formatMatchupDate(updatedAt)}`} /> : null}
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
      className="size-12 rounded-lg border border-white/15 bg-[#0b1220] object-cover shadow-lg shadow-black/30 sm:size-14"
      height={56}
      src={getChampionIconPath(champion)}
      unoptimized
      width={56}
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
