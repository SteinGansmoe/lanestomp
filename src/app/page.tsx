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
  const featuredChampion = getHomeAtmosphereChampion(champions);
  const heroChampion = getHeroSplashChampion(champions);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b18] text-[#AAB7C8]">
      <HomeAtmosphere champion={featuredChampion} />
      <section className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
          <SiteHeader />

          <HeroSection champion={heroChampion} matchupCount={progressStats.matchupCount} />

          <PlatformStatusSection
            champions={champions}
            matchupCount={progressStats.matchupCount}
          />

          <WhyLaneStompSection />

          <ProgressSection stats={progressStats.items} />

          <CtaSection />

          <section className="space-y-4" id="matchup-tool">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  Available now
                </p>
                <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-[#E6EDF5] sm:text-3xl">
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
              <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-[#AAB7C8]">
                <CardTitle className="font-mono text-xl">
                  Champion data is not imported yet
                </CardTitle>
                <p className="mt-3 text-sm leading-6 text-[#9FB0C4]">
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

function HomeAtmosphere({ champion }: { champion: LeagueChampion | null }) {
  if (!champion) {
    return (
      <div
        className="pointer-events-none absolute inset-x-0 top-32 z-0 h-[34rem] bg-[radial-gradient(circle_at_18%_22%,rgba(14,165,233,0.1),transparent_22rem),radial-gradient(circle_at_82%_18%,rgba(250,204,21,0.06),transparent_20rem)]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-36 z-0 h-[42rem] overflow-hidden opacity-30"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-cover bg-[position:70%_18%] opacity-20 blur-2xl saturate-110"
        style={{
          backgroundImage: `url("${getChampionSplashUrl(champion)}")`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.99)_0%,rgba(5,11,24,0.88)_34%,rgba(5,11,24,0.8)_100%),linear-gradient(0deg,rgba(5,11,24,1)_0%,rgba(5,11,24,0.28)_42%,rgba(5,11,24,0.96)_100%)]" />
    </div>
  );
}

function HeroSection({
  champion,
  matchupCount,
}: {
  champion: LeagueChampion | null;
  matchupCount: number;
}) {
  return (
    <section className="relative isolate min-h-[34rem] overflow-hidden rounded-lg border border-cyan-100/10 bg-[#07101f] shadow-2xl shadow-black/30">
      <HeroBackground champion={champion} />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#050b18] to-transparent" />

      <div className="grid min-h-[34rem] gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:p-10">
        <div className="flex max-w-3xl flex-col justify-end self-end">
          <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-950/20">
            <Swords className="size-6" aria-hidden="true" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            LaneStomp League learning platform
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-medium leading-tight tracking-[-0.03em] text-[#C4D0DE] sm:text-5xl 2xl:text-6xl">
            Be prepared in champion select. Win more games.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#AAB7C8] sm:text-lg">
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
              className="inline-flex h-11 items-center gap-2 rounded-md border border-cyan-100/15 bg-white/[0.07] px-4 text-sm font-medium text-[#E6EDF5] transition hover:border-cyan-100/30 hover:bg-white/[0.12]"
              href="/champions"
            >
              Browse Champions
            </Link>
          </div>
        </div>

        <div className="self-end rounded-lg border border-cyan-100/10 bg-black/35 p-4 shadow-xl shadow-black/20 backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#9FB0C4]">
            Current coverage
          </p>
          <p className="mt-3 text-4xl font-semibold text-[#E6EDF5]">
            {formatNumber(matchupCount)}
          </p>
          <p className="mt-1 text-sm text-cyan-100">reviewed matchup guides available now</p>
          <div className="mt-5 grid gap-3 text-sm text-[#AAB7C8]">
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

function HeroBackground({ champion }: { champion: LeagueChampion | null }) {
  if (!champion) {
    return (
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,11,24,0.98)_0%,rgba(5,11,24,0.9)_42%,rgba(5,11,24,0.56)_100%),linear-gradient(0deg,rgba(5,11,24,0.98),rgba(5,11,24,0.18)_42%,rgba(5,11,24,0.8)),url('/images/summoners-rift.jpeg')] bg-cover bg-center" />
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#07101f]" aria-hidden="true">
      <div
        className="absolute inset-0 bg-cover bg-[position:68%_24%] opacity-56 blur-[0.2px] saturate-120"
        style={{
          backgroundImage: `url("${getChampionSplashUrl(champion)}")`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.99)_0%,rgba(5,11,24,0.9)_30%,rgba(5,11,24,0.52)_64%,rgba(5,11,24,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,11,24,0.96)_0%,rgba(5,11,24,0.18)_46%,rgba(5,11,24,0.68)_100%)]" />
    </div>
  );
}

function PlatformStatusSection({
  champions,
  matchupCount,
}: {
  champions: LeagueChampion[];
  matchupCount: number;
}) {
  const matchupGuideChampion = getMatchupGuidesCardChampion(champions);
  const cards = [
    {
      backgroundChampion: matchupGuideChampion,
      badge: "Available Now",
      description: "Role-specific matchup guidance built for champ select and loading screen prep.",
      features: [
        `${formatNumber(matchupCount)} matchup guides`,
        "Role-specific guidance",
        "AI-assisted drafts reviewed by admins",
        "Champion-specific advice",
      ],
      href: "/league/matchups",
      icon: Target,
      title: "Matchup Guides",
      tone: "cyan",
    },
    {
      backgroundChampion: null,
      badge: "Coming Soon",
      description: "Counter recommendations with practical reasons, tradeoffs, and pool context.",
      features: [
        "Counter recommendations",
        "Why the matchup works",
        "Strengths and weaknesses",
        "Champion pool planning",
      ],
      href: null,
      icon: Crosshair,
      title: "Counter Pick Tool",
      tone: "violet",
    },
    {
      backgroundChampion: null,
      badge: "Planned",
      description: "More ways to turn champion data and match history into better decisions.",
      features: ["Champion data", "Champion pools", "Climb tools", "Performance analysis"],
      href: null,
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
              className="relative isolate overflow-hidden rounded-lg border border-cyan-100/10 bg-[#10182b]/90 p-5 shadow-xl shadow-black/15"
              key={card.title}
            >
              {card.backgroundChampion ? (
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[82%] overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-[position:72%_35%] opacity-48 blur-[0.2px] saturate-125"
                    style={{
                      backgroundImage: `url("${getChampionSplashUrl(card.backgroundChampion)}")`,
                    }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,24,43,1)_0%,rgba(16,24,43,0.9)_22%,rgba(16,24,43,0.5)_52%,rgba(16,24,43,0.34)_76%,rgba(16,24,43,0.58)_100%)]" />
                </div>
              ) : null}

              <div className="relative z-10 flex items-start justify-between gap-4">
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
              <h3 className="relative z-10 mt-5 font-mono text-xl font-semibold text-[#E6EDF5]">
                {card.href ? (
                  <Link
                    className="inline-flex items-center gap-2 rounded-sm transition hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                    href={card.href}
                  >
                    {card.title}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ) : (
                  card.title
                )}
              </h3>
              <p className="relative z-10 mt-3 text-sm leading-6 text-[#9FB0C4]">
                {card.description}
              </p>
              <ul className="relative z-10 mt-5 grid gap-2 text-sm text-[#AAB7C8]">
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
              className="rounded-lg border border-cyan-100/10 bg-white/[0.035] p-5"
              key={pillar.title}
            >
              <Icon className="size-6 text-cyan-200" aria-hidden="true" />
              <h3 className="mt-4 font-mono text-lg font-semibold text-[#E6EDF5]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#9FB0C4]">{pillar.description}</p>
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
    <section className="rounded-lg border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_26rem),linear-gradient(135deg,rgba(16,24,43,0.96),rgba(7,16,31,0.92))] p-5 shadow-xl shadow-black/15 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
            Current progress
          </p>
          <h2 className="mt-3 font-mono text-2xl font-semibold tracking-normal text-[#E6EDF5] sm:text-3xl">
            The platform is already live and expanding.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#9FB0C4]">
            Matchup coverage, champion support, and role guidance are updated as the platform grows.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="rounded-lg border border-cyan-100/10 bg-black/20 p-4 shadow-lg shadow-black/10"
                key={stat.label}
              >
                <Icon className="size-5 text-cyan-200" aria-hidden="true" />
                <p className="mt-4 text-3xl font-semibold text-[#E6EDF5]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#9FB0C4]">{stat.label}</p>
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
          <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-[#E6EDF5]">
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
            className="inline-flex h-11 items-center rounded-md border border-cyan-100/15 bg-white/[0.07] px-4 text-sm font-medium text-[#E6EDF5] transition hover:border-cyan-100/30 hover:bg-white/[0.12]"
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
      <h2 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-[#E6EDF5] sm:text-3xl">
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

function getHomeAtmosphereChampion(champions: LeagueChampion[]) {
  const preferredChampionIds = ["Aurora", "Akali", "Yasuo", "Ahri", "Lux"];

  return (
    preferredChampionIds
      .map((championId) => champions.find((champion) => champion.id === championId))
      .find(Boolean) ??
    champions.find((champion) => champion.tags.includes("Mage")) ??
    champions[0] ??
    null
  );
}

function getHeroSplashChampion(champions: LeagueChampion[]) {
  const curatedChampionIds = [
    "Ahri",
    "Yasuo",
    "Jinx",
    "Lux",
    "Yone",
    "Thresh",
    "Ekko",
    "Lucian",
    "Vayne",
    "Riven",
    "Sylas",
    "Malphite",
    "Diana",
    "Aurora",
    "Nasus",
  ];
  const curatedChampions = curatedChampionIds
    .map((championId) => champions.find((champion) => champion.id === championId))
    .filter((champion): champion is LeagueChampion => Boolean(champion));

  if (curatedChampions.length === 0) {
    return null;
  }

  return curatedChampions[Math.floor(Math.random() * curatedChampions.length)];
}

function getMatchupGuidesCardChampion(champions: LeagueChampion[]) {
  const curatedChampionIds = ["Ahri", "Lux", "Ashe", "Lucian", "Jhin", "Vayne", "Yasuo", "LeeSin"];
  const curatedChampions = curatedChampionIds
    .map((championId) => champions.find((champion) => champion.id === championId))
    .filter((champion): champion is LeagueChampion => Boolean(champion));

  if (curatedChampions.length === 0) {
    return null;
  }

  const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);

  return curatedChampions[daysSinceEpoch % curatedChampions.length];
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
