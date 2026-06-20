import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Crosshair,
  LineChart,
  Search,
  ShieldAlert,
  ShieldCheck,
  Swords,
  Target,
} from "lucide-react";

import {
  LaneStompPageBackground,
  laneStompContentClassName,
  laneStompPageClassName,
} from "@/src/components/lane-stomp-page";
import { CounterPickStartForm } from "@/src/components/league/counter-pick-start-form";
import { HextechFrame } from "@/src/components/league/hextech-frame";
import { SiteHeader } from "@/src/components/site-header";
import {
  getChampionSplashUrl,
  getLeagueChampions,
  type LeagueChampion,
} from "@/src/features/league/champions";
import { getPopularCounterPickChampions } from "@/src/features/league/counter-pick-popular-champions";
import {
  getLeagueMatchupCoverageSummary,
  type LeagueMatchupCoverageSummary,
} from "@/src/features/league/matchups";
import { leagueRoles } from "@/src/features/league/roles";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = {
  title: "League of Legends Counter Picks & Matchup Guides | LaneStomp",
  description:
    "Find League of Legends counter picks, champion matchup guides, and role-specific preparation with LaneStomp.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const { champions, error } = await getLeagueChampions();
  const popularChampions =
    champions.length > 0 ? await getPopularCounterPickChampions(champions) : [];
  const { coverage } =
    champions.length > 0 ? await getLeagueMatchupCoverageSummary(champions) : { coverage: null };
  const stats = getHomepageStats(champions.length, coverage);
  const heroChampion = getHeroSplashChampion(champions);

  return (
    <main className={laneStompPageClassName}>
      <LaneStompPageBackground />
      <div className={laneStompContentClassName}>
        <SiteHeader />

        <HomepageHero champion={heroChampion}>
          {error ? (
            <ChampionDataError message={error} />
          ) : champions.length > 0 ? (
            <CounterPickStartForm champions={champions} popularChampions={popularChampions} />
          ) : (
            <div className="max-w-xl border border-cyan-100/15 bg-[#07101f]/90 p-4 text-zinc-300">
              <h2 className="font-mono text-lg font-semibold text-white">
                Champion data is not ready yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Import League champion data to enable the Counter Pick search.
              </p>
            </div>
          )}
        </HomepageHero>

        <ConfidenceGuide />
        <MatchupFeatureLinks />
        <PlatformStats stats={stats} />
      </div>
    </main>
  );
}

function HomepageHero({
  champion,
  children,
}: {
  champion: LeagueChampion | null;
  children: ReactNode;
}) {
  return (
    <HextechFrame className="relative isolate z-30 min-h-[35rem] w-[calc(100vw-2rem)] max-w-full overflow-visible bg-[#06111f]/88 sm:w-full">
      <HomepageHeroBackground champion={champion} />
      <div className="relative z-40 w-full max-w-[21rem] px-3 py-12 sm:max-w-3xl sm:px-8 sm:py-14 lg:px-12 lg:py-20">
        <div className="flex items-center gap-4">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Counter Pick
          </p>
          <span
            className="hidden h-px w-28 bg-[linear-gradient(90deg,rgba(103,232,249,0.85),rgba(103,232,249,0.08))] sm:block"
            aria-hidden="true"
          />
          <span
            className="hidden size-1.5 rotate-45 border border-cyan-300/70 bg-cyan-300/20 sm:block"
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-6 font-mono text-4xl font-bold uppercase leading-[1.04] tracking-normal text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl xl:text-7xl">
          <span className="block">Find the right</span>
          <span className="block">counter before</span>
          <span className="block">champion select</span>
        </h1>
        <span
          className="mt-6 block h-0.5 w-12 bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.85)]"
          aria-hidden="true"
        />
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100 sm:text-lg">
          Search any champion to get smart counter picks, matchup insights, and practical prep
          before you lock in.
        </p>
        <div className="mt-8">{children}</div>
      </div>
    </HextechFrame>
  );
}

function HomepageHeroBackground({ champion }: { champion: LeagueChampion | null }) {
  const backgroundImage = champion
    ? `url("${getChampionSplashUrl(champion)}")`
    : "url('/images/summoners-rift.jpeg')";

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-[position:74%_18%] opacity-90 saturate-125"
        style={{ backgroundImage }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,9,20,0.98)_0%,rgba(3,9,20,0.9)_32%,rgba(3,9,20,0.28)_66%,rgba(3,9,20,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,20,0.24)_0%,rgba(3,9,20,0.06)_55%,rgba(3,9,20,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_34%,rgba(34,211,238,0.12),transparent_26rem),radial-gradient(circle_at_74%_20%,rgba(34,211,238,0.12),transparent_28rem),radial-gradient(circle_at_86%_58%,rgba(201,170,90,0.08),transparent_28rem)]" />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(103,232,249,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,0.12) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
    </div>
  );
}

function ConfidenceGuide() {
  const confidenceLevels = [
    { label: "Very high", range: "1000+ stored games", style: "bg-cyan-300" },
    { label: "High", range: "500–999 games", style: "bg-lime-300 rotate-45" },
    { label: "Medium", range: "200–499 games", style: "bg-amber-400 rotate-45" },
    { label: "Low", range: "50–199 games", style: "bg-rose-500" },
    { label: "Very low", range: "Under 50 / preliminary", style: "bg-slate-500 rotate-45" },
  ];

  return (
    <section className="border border-cyan-100/20 bg-[#06111f]/92 px-5 py-5 sm:px-7">
      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.7fr)] xl:items-center">
        <div className="flex gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center border border-cyan-300/35 bg-cyan-400/10 text-cyan-100">
            <LineChart className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Confidence Guide
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
              Confidence is based on stored Riot game count for a given patch. More games provide
              more reliable insights. Real matchup win rates are usually close - 52-54% is already
              strong at scale.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {confidenceLevels.map((level) => (
            <div className="flex items-start gap-3" key={level.label}>
              <span
                className={cn("mt-1 size-4 shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.2)]", level.style)}
                aria-hidden="true"
              />
              <span>
                <span className="block font-semibold text-zinc-50">{level.label}</span>
                <span className="mt-1 block text-sm leading-5 text-zinc-400">{level.range}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MatchupFeatureLinks() {
  const features = [
    {
      description: "See win rates, lane stats, and key insights for any champion matchup.",
      href: "/league/matchups",
      icon: Search,
      title: "Understand the matchup",
    },
    {
      description: "Explore strengths, tradeoffs, and difficulty so you lock in with confidence.",
      href: "/league/counters",
      icon: Swords,
      title: "Prepare your counter pick",
    },
    {
      description: "Turn short matchup notes into a practical lane and teamfight plan.",
      href: "/league/matchups",
      icon: ShieldCheck,
      title: "Play with a plan",
    },
  ];

  return (
    <section className="mt-4 border border-cyan-100/20 bg-[#06111f]/82 p-4 sm:p-5">
      <h2 className="px-3 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
        Matchup Guides
      </h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <Link
              className="group grid min-h-28 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border border-cyan-100/15 bg-[#071321]/80 px-5 py-4 transition hover:border-cyan-300/50 hover:bg-cyan-400/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55"
              href={feature.href}
              key={feature.title}
            >
              <span className="flex size-16 items-center justify-center border border-cyan-300/15 bg-cyan-400/[0.06] text-cyan-200">
                <Icon className="size-8" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold text-white">{feature.title}</span>
                <span className="mt-2 block text-sm leading-6 text-zinc-400">
                  {feature.description}
                </span>
              </span>
              <ArrowRight
                className="size-5 text-cyan-200 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PlatformStats({
  stats,
}: {
  stats: { icon: typeof BarChart3; label: string; value: string }[];
}) {
  return (
    <section className="mt-4 border border-cyan-100/20 bg-[#06111f]/88 px-5 py-5 sm:px-7">
      <div className="grid gap-5 md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,2fr)] md:items-center">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
          LaneStomp in Numbers
        </h2>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                className={cn(
                  "flex items-center gap-4 border-cyan-100/15 py-3 sm:px-6",
                  index > 0 && "lg:border-l",
                  index % 2 === 1 && "sm:border-l lg:border-l",
                )}
                key={stat.label}
              >
                <span className="flex size-11 shrink-0 items-center justify-center border border-cyan-100/15 bg-[#071321] text-cyan-200">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-2xl font-semibold leading-none text-white">
                    {stat.value}
                  </span>
                  <span className="mt-1 block text-sm text-zinc-400">{stat.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ChampionDataError({ message }: { message: string }) {
  return (
    <div className="max-w-xl border border-amber-300/25 bg-amber-300/10 p-4 text-amber-100">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="font-mono text-lg font-semibold text-white">
            Champion data is not ready yet
          </h2>
          <p className="mt-2 text-sm leading-6 text-amber-100/80">
            Apply the latest champion migration and run the Data Dragon import before using Counter
            Pick from the homepage.
          </p>
          <p className="mt-4 border border-white/10 bg-black/20 p-3 font-mono text-xs text-amber-50">
            {message}
          </p>
        </div>
      </div>
    </div>
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
      icon: Crosshair,
      label: "Roles covered",
      value: String(rolesCovered || leagueRoles.length),
    },
    {
      icon: CheckCircle2,
      label: "Counter Pick",
      value: "LIVE",
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
