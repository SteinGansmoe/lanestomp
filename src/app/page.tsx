import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Clock3,
  Crosshair,
  Layers3,
  LineChart,
  ShieldAlert,
  Sparkles,
  Swords,
  Target,
  Trophy,
} from "lucide-react";
import { connection } from "next/server";

import { MatchupSelector } from "@/src/components/league/matchup-selector";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import { getLeagueChampions } from "@/src/features/league/champions";
import {
  getLeagueMatchupCoverageSummary,
  type LeagueMatchupCoverageSummary,
} from "@/src/features/league/matchups";
import { leagueRoles } from "@/src/features/league/roles";

export const metadata: Metadata = {
  title: "League of Legends Matchup Guides and Learning Tools",
  description:
    "LaneStomp is a League of Legends improvement platform for matchup guides, counter-pick preparation, champion strengths, and role-specific learning tools.",
};

export default async function Home() {
  await connection();

  const { champions, error } = await getLeagueChampions();
  const { coverage } =
    champions.length > 0 ? await getLeagueMatchupCoverageSummary(champions) : { coverage: null };
  const progressStats = getProgressStats(champions.length, coverage);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050b18] text-white">
      <section className="px-4 py-6 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
          <SiteHeader />

          <HeroSection matchupCount={progressStats.matchupCount} />

          <PlatformStatusSection matchupCount={progressStats.matchupCount} />

          <WhyLaneStompSection />

          <ProgressSection stats={progressStats.items} />

          <CtaSection />

          <section className="space-y-4" id="matchup-tool">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  Available now
                </p>
                <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white sm:text-3xl">
                  Open the Matchup Tool
                </h2>
              </div>
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-400/10 px-4 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/45 hover:bg-cyan-400/20"
                href="/league/matchups"
              >
                Full matchup page
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            {error ? (
              <ChampionDataError message={error} />
            ) : champions.length > 0 ? (
              <MatchupSelector champions={champions} matchupCoverage={coverage} />
            ) : (
              <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
                <CardTitle className="font-mono text-xl">
                  Champion data is not imported yet
                </CardTitle>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Import League champion data to enable the matchup picker.
                </p>
              </Card>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function HeroSection({ matchupCount }: { matchupCount: number }) {
  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden rounded-lg border border-white/10 bg-[#07101f] shadow-2xl shadow-black/30">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,11,24,0.98)_0%,rgba(5,11,24,0.86)_42%,rgba(5,11,24,0.42)_100%),linear-gradient(0deg,rgba(5,11,24,0.96),rgba(5,11,24,0.08)_42%,rgba(5,11,24,0.76)),url('/images/summoners-rift.jpeg')] bg-cover bg-center" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#050b18] to-transparent" />

      <div className="grid min-h-[34rem] gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:p-10">
        <div className="flex max-w-3xl flex-col justify-end self-end">
          <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-950/20">
            <Swords className="size-6" aria-hidden="true" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            LaneStomp League learning platform
          </p>
          <h1 className="mt-4 max-w-4xl font-mono text-4xl font-semibold tracking-normal text-white sm:text-5xl 2xl:text-6xl">
            Prepare before champion select. Win more games.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg">
            LaneStomp helps you understand matchups, counter picks, power
            spikes, and champion strengths before the game begins.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-200"
              href="#matchup-tool"
            >
              Open Matchup Tool
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex h-11 items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 text-sm font-medium text-zinc-100 transition hover:border-white/30 hover:bg-white/15"
              href="/champions"
            >
              Browse Champions
            </Link>
          </div>
        </div>

        <div className="self-end rounded-lg border border-white/10 bg-black/35 p-4 shadow-xl shadow-black/20 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
            Current coverage
          </p>
          <p className="mt-3 text-4xl font-semibold text-white">{formatNumber(matchupCount)}</p>
          <p className="mt-1 text-sm text-cyan-100">reviewed matchup guides available now</p>
          <div className="mt-5 grid gap-3 text-sm text-zinc-300">
            {["Role-specific guidance", "Champion-specific advice", "Admin-reviewed drafts"].map(
              (item) => (
                <p className="flex items-center gap-2" key={item}>
                  <CheckCircle2 className="size-4 text-cyan-200" aria-hidden="true" />
                  {item}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformStatusSection({ matchupCount }: { matchupCount: number }) {
  const cards = [
    {
      badge: "Available Now",
      description: "Role-specific matchup guidance built for champ select and loading screen prep.",
      features: [
        `${formatNumber(matchupCount)} matchup guides`,
        "Role-specific guidance",
        "AI-assisted drafts reviewed by admins",
        "Champion-specific advice",
      ],
      icon: Target,
      title: "Matchup Guides",
      tone: "cyan",
    },
    {
      badge: "Coming Soon",
      description: "Counter recommendations with practical reasons, tradeoffs, and pool context.",
      features: [
        "Counter recommendations",
        "Why the matchup works",
        "Strengths and weaknesses",
        "Champion pool planning",
      ],
      icon: Crosshair,
      title: "Counter Pick Tool",
      tone: "violet",
    },
    {
      badge: "Planned",
      description: "More ways to turn champion data and match history into better decisions.",
      features: ["Champion data", "Champion pools", "Climb tools", "Performance analysis"],
      icon: Layers3,
      title: "More Tools Planned",
      tone: "emerald",
    },
  ] as const;

  return (
    <section className="space-y-5">
      <SectionHeading
        eyebrow="Platform status"
        title="LaneStomp is growing from matchup guides into a League improvement platform."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              className="rounded-lg border border-white/10 bg-[#10182b]/90 p-5 shadow-xl shadow-black/15"
              key={card.title}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex size-11 items-center justify-center rounded-lg border ${getToneClass(
                    card.tone,
                    "icon",
                  )}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${getToneClass(
                    card.tone,
                    "badge",
                  )}`}
                >
                  {card.badge}
                </span>
              </div>
              <h3 className="mt-5 font-mono text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{card.description}</p>
              <ul className="mt-5 grid gap-2 text-sm text-zinc-300">
                {card.features.map((feature) => (
                  <li className="flex gap-2" key={feature}>
                    <Sparkles
                      className="mt-0.5 size-3.5 shrink-0 text-cyan-200"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function WhyLaneStompSection() {
  const pillars = [
    {
      description:
        "Get the matchup context you need before lock-in, loading screen, or first wave.",
      icon: Brain,
      title: "Learn Faster",
    },
    {
      description:
        "See the trades, danger windows, spikes, and win conditions that actually matter.",
      icon: Swords,
      title: "Understand Matchups",
    },
    {
      description: "Build better habits through focused preparation instead of generic advice.",
      icon: Trophy,
      title: "Improve Consistently",
    },
  ];

  return (
    <section className="space-y-5">
      <SectionHeading
        eyebrow="Why LaneStomp"
        title="Built for players who want clear decisions, not vague coaching noise."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <article
              className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
              key={pillar.title}
            >
              <Icon className="size-6 text-cyan-200" aria-hidden="true" />
              <h3 className="mt-4 font-mono text-lg font-semibold text-white">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{pillar.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProgressSection({
  stats,
}: {
  stats: { icon: typeof BarChart3; label: string; value: string }[];
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_26rem),linear-gradient(135deg,rgba(16,24,43,0.96),rgba(7,16,31,0.92))] p-5 shadow-xl shadow-black/15 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Current progress
          </p>
          <h2 className="mt-3 font-mono text-2xl font-semibold tracking-normal text-white sm:text-3xl">
            The platform is already live and expanding.
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Matchup coverage, champion support, and role guidance are updated as the platform grows.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="rounded-lg border border-white/10 bg-black/20 p-4 shadow-lg shadow-black/10"
                key={stat.label}
              >
                <Icon className="size-5 text-cyan-200" aria-hidden="true" />
                <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="rounded-lg border border-cyan-300/15 bg-cyan-400/[0.06] p-5 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Ready before queue
          </p>
          <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white">
            Start with the matchup you are about to play.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-200"
            href="#matchup-tool"
          >
            Open Matchup Tool
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            className="inline-flex h-11 items-center rounded-md border border-white/15 bg-white/10 px-4 text-sm font-medium text-zinc-100 transition hover:border-white/30 hover:bg-white/15"
            href="/champions"
          >
            Browse Champions
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">{eyebrow}</p>
      <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function ChampionDataError({ message }: { message: string }) {
  return (
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
            {message}
          </p>
          <Link
            className="mt-4 inline-flex rounded-md border border-amber-200/20 bg-amber-200/10 px-3 py-2 text-sm font-medium text-amber-50 transition hover:bg-amber-200/15"
            href="/champions"
          >
            View champion data
          </Link>
        </div>
      </div>
    </Card>
  );
}

function getProgressStats(championCount: number, coverage: LeagueMatchupCoverageSummary | null) {
  const matchupCount = coverage?.all.generatedCount ?? 0;
  const rolesCovered = coverage
    ? leagueRoles.filter((role) => coverage[role].generatedCount > 0).length
    : leagueRoles.length;

  return {
    items: [
      {
        icon: BarChart3,
        label: "Matchups",
        value: formatNumber(matchupCount),
      },
      {
        icon: Target,
        label: "Champions",
        value: `${formatNumber(championCount)}+`,
      },
      {
        icon: LineChart,
        label: "Roles Covered",
        value: String(rolesCovered || leagueRoles.length),
      },
      {
        icon: Clock3,
        label: "Growing Daily",
        value: "Live",
      },
    ],
    matchupCount,
  };
}

function getToneClass(tone: "cyan" | "emerald" | "violet", element: "badge" | "icon") {
  if (tone === "violet") {
    return element === "icon"
      ? "border-violet-300/20 bg-violet-500/10 text-violet-100"
      : "border-violet-300/20 bg-violet-500/10 text-violet-100";
  }

  if (tone === "emerald") {
    return element === "icon"
      ? "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"
      : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100";
  }

  return element === "icon"
    ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
    : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}
