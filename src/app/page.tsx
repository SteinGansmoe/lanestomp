import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Crosshair,
  LineChart,
  ShieldAlert,
  Target,
  Trophy,
} from "lucide-react";
import { connection } from "next/server";

import { CounterPickStartForm } from "@/src/components/league/counter-pick-start-form";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import {
  getChampionSplashUrl,
  getLeagueChampions,
  type LeagueChampion,
} from "@/src/features/league/champions";
import {
  getLeagueMatchupCoverageSummary,
  type LeagueMatchupCoverageSummary,
} from "@/src/features/league/matchups";
import { leagueRoles } from "@/src/features/league/roles";

export const metadata: Metadata = {
  title: "League of Legends Counter Picks & Matchup Guides | LaneStomp",
  description:
    "Find League of Legends counter picks, champion matchup guides, and role-specific preparation with LaneStomp.",
};

export default async function Home() {
  await connection();

  const { champions, error } = await getLeagueChampions();
  const { coverage } =
    champions.length > 0 ? await getLeagueMatchupCoverageSummary(champions) : { coverage: null };
  const stats = getHomepageStats(champions.length, coverage);
  const heroChampion = getHeroSplashChampion(champions);
  const matchupChampion = getMatchupSectionChampion(champions);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b18] text-[#AAB7C8]">
      <section className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
          <SiteHeader />

          <HeroSection champion={heroChampion}>
            {error ? (
              <ChampionDataError message={error} />
            ) : champions.length > 0 ? (
              <CounterPickStartForm champions={champions} />
            ) : (
              <Card className="rounded-lg border-white/10 bg-[#10182b]/90 p-5 text-zinc-300">
                <CardTitle className="font-mono text-lg">Champion data is not ready yet</CardTitle>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Import League champion data to enable the Counter Pick search.
                </p>
              </Card>
            )}
          </HeroSection>

          <MatchupGuideSection champion={matchupChampion} />

          <ValueSection />

          <ProgressSection stats={stats} />

          <ToolStatusSection />
        </div>
      </section>
    </main>
  );
}

function HeroSection({
  champion,
  children,
}: {
  champion: LeagueChampion | null;
  children: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-lg border border-cyan-100/10 bg-[#07101f] shadow-2xl shadow-black/30">
      <ThemedHeroBackground champion={champion} priority />

      <div className="grid min-h-[34rem] gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:items-center lg:p-10">
        <div className="max-w-3xl">
          <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-950/20">
            <Crosshair className="size-6" aria-hidden="true" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Counter Pick available now
          </p>
          <h1 className="mt-4 max-w-4xl font-mono text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl 2xl:text-6xl">
            Find the right League of Legends counter pick
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#C4D0DE] sm:text-lg">
            Search a champion to find reliable counter picks, matchup context, and practical
            preparation before champion select.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-[#05111d] transition hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55"
              href="/league/counters"
            >
              Find counters
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-md border border-cyan-100/15 bg-white/[0.07] px-4 text-sm font-medium text-[#E6EDF5] transition hover:border-cyan-100/30 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45"
              href="/league/matchups"
            >
              Open Matchup Guides
            </Link>
          </div>
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function ThemedHeroBackground({
  champion,
  priority = false,
}: {
  champion: LeagueChampion | null;
  priority?: boolean;
}) {
  const backgroundImage = champion
    ? `url("${getChampionSplashUrl(champion)}")`
    : "url('/images/summoners-rift.jpeg')";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-[position:72%_24%] opacity-65 saturate-125"
        data-priority={priority ? "true" : undefined}
        style={{ backgroundImage }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_28%,rgba(34,211,238,0.16),transparent_22rem),radial-gradient(circle_at_82%_18%,rgba(201,170,90,0.14),transparent_24rem)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.99)_0%,rgba(5,11,24,0.92)_38%,rgba(5,11,24,0.64)_70%,rgba(5,11,24,0.76)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.62)_0%,rgba(5,11,24,0.16)_42%,rgba(5,11,24,0.96)_100%)]" />
      <div className="absolute inset-x-[-10%] bottom-[-5rem] h-48 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_68%)] blur-3xl" />
    </div>
  );
}

function MatchupGuideSection({ champion }: { champion: LeagueChampion | null }) {
  return (
    <section className="relative isolate overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/90 p-5 shadow-xl shadow-black/20 sm:p-6">
      <ThemedHeroBackground champion={champion} />
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Matchup Guides
          </p>
          <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white sm:text-3xl">
            Already know the matchup?
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
            Open detailed guides with trading patterns, danger windows, power spikes, and win
            conditions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-400/10 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45"
            href="/league/matchups"
          >
            Search matchup
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            className="inline-flex h-11 items-center rounded-md border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-zinc-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45"
            href="/champions"
          >
            Browse champions
          </Link>
        </div>
      </div>
    </section>
  );
}

function ValueSection() {
  const cards = [
    {
      description: "Know what the enemy wants to do before the lane starts.",
      icon: Brain,
      title: "Understand the matchup",
    },
    {
      description: "See strengths, tradeoffs, and difficulty before you lock in.",
      icon: Crosshair,
      title: "Prepare your counter pick",
    },
    {
      description: "Turn short matchup notes into a practical first-wave plan.",
      icon: Trophy,
      title: "Play with a plan",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article className="rounded-lg border border-white/10 bg-white/[0.035] p-5" key={card.title}>
            <Icon className="size-6 text-cyan-200" aria-hidden="true" />
            <h2 className="mt-4 font-mono text-lg font-semibold text-white">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{card.description}</p>
          </article>
        );
      })}
    </section>
  );
}

function ProgressSection({
  stats,
}: {
  stats: { icon: typeof BarChart3; label: string; value: string }[];
}) {
  return (
    <section className="rounded-lg border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_26rem),linear-gradient(135deg,rgba(16,24,43,0.96),rgba(7,16,31,0.92))] p-5 shadow-xl shadow-black/15 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Platform progress
          </p>
          <h2 className="mt-3 font-mono text-2xl font-semibold tracking-normal text-white sm:text-3xl">
            Built on thousands of matchup guides
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            LaneStomp is live and improving as more match data is collected.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="rounded-lg border border-cyan-100/10 bg-black/20 p-4 shadow-lg shadow-black/10"
                key={stat.label}
              >
                <Icon className="size-5 text-cyan-200" aria-hidden="true" />
                <p className="mt-4 text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ToolStatusSection() {
  const plannedTools = ["Champion pages", "Climb tools", "Performance analysis"];

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <div className="rounded-lg border border-cyan-300/15 bg-cyan-400/[0.06] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
          Available now
        </p>
        <div className="mt-4 grid gap-3">
          <ToolStatusItem href="/league/counters" icon={Crosshair} label="Counter Pick" />
          <ToolStatusItem href="/league/matchups" icon={BookOpen} label="Matchup Guides" />
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.025] p-5">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">Coming next</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {plannedTools.map((tool) => (
            <span
              className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-400"
              key={tool}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolStatusItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Crosshair;
  label: string;
}) {
  return (
    <Link
      className="flex items-center justify-between gap-3 rounded-md border border-cyan-300/15 bg-black/20 px-3 py-3 text-sm font-semibold text-cyan-50 transition hover:border-cyan-300/35 hover:bg-cyan-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/45"
      href={href}
    >
      <span className="flex items-center gap-3">
        <Icon className="size-4 text-cyan-200" aria-hidden="true" />
        {label}
      </span>
      <span className="rounded border border-cyan-300/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">
        Available Now
      </span>
    </Link>
  );
}

function ChampionDataError({ message }: { message: string }) {
  return (
    <Card className="rounded-lg border-amber-300/20 bg-amber-300/10 p-5 text-amber-100">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <CardTitle className="font-mono text-lg">Champion data is not ready yet</CardTitle>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">
            Apply the latest champion migration and run the Data Dragon import before using Counter
            Pick from the homepage.
          </p>
          <p className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
            {message}
          </p>
        </div>
      </div>
    </Card>
  );
}

function getHomepageStats(
  championCount: number,
  coverage: LeagueMatchupCoverageSummary | null,
) {
  const matchupCount = coverage?.all.generatedCount ?? 0;
  const rolesCovered = coverage
    ? leagueRoles.filter((role) => coverage[role].generatedCount > 0).length
    : leagueRoles.length;

  return [
    {
      icon: BarChart3,
      label: "Matchup guides",
      value: formatNumber(matchupCount),
    },
    {
      icon: Target,
      label: "Champions",
      value: `${formatNumber(championCount)}+`,
    },
    {
      icon: LineChart,
      label: "Roles covered",
      value: String(rolesCovered || leagueRoles.length),
    },
    {
      icon: CheckCircle2,
      label: "Counter Pick",
      value: "Live",
    },
  ];
}

function getHeroSplashChampion(champions: LeagueChampion[]) {
  return getFirstAvailableChampion(champions, [
    "Ahri",
    "Yasuo",
    "Jinx",
    "Lux",
    "Thresh",
    "Ekko",
    "Lucian",
    "Vayne",
  ]);
}

function getMatchupSectionChampion(champions: LeagueChampion[]) {
  return getFirstAvailableChampion(champions, ["Akali", "Yone", "Lissandra", "Syndra", "Ashe"]);
}

function getFirstAvailableChampion(champions: LeagueChampion[], championIds: string[]) {
  return (
    championIds
      .map((championId) => champions.find((champion) => champion.id === championId))
      .find((champion): champion is LeagueChampion => Boolean(champion)) ??
    champions[0] ??
    null
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}
