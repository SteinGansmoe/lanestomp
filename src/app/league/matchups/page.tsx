import Image from "next/image";
import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { connection } from "next/server";

import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import { HextechFrame } from "@/src/components/league/hextech-frame";
import { MatchupSelector } from "@/src/components/league/matchup-selector";
import { SiteHeader } from "@/src/components/site-header";
import { Card, CardTitle } from "@/src/components/ui/card";
import {
  getChampionSplashUrl,
  getLeagueChampions,
  type LeagueChampion,
} from "@/src/features/league/champions";

export const metadata: Metadata = {
  alternates: {
    canonical: "/league/matchups",
  },
  description:
    "Find League of Legends matchup guides by champion and role with LaneStomp matchup prep.",
  title: "League Matchup Guides",
};

export default async function LeagueMatchupsPage() {
  await connection();

  const { champions, error } = await getLeagueChampions();

  return (
    <LaneStompPageShell>
      <SiteHeader />

      <MatchupGuidesHero champions={champions} />

      {error ? (
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
                {error}
              </p>
            </div>
          </div>
        </Card>
      ) : champions.length > 0 ? (
        <MatchupSelector champions={champions} />
      ) : (
        <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
          <CardTitle className="font-mono text-xl">No champions imported yet</CardTitle>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Run the League champion import script to populate the selector.
          </p>
        </Card>
      )}
    </LaneStompPageShell>
  );
}

function MatchupGuidesHero({ champions }: { champions: LeagueChampion[] }) {
  const firstChampion = getHeroChampion(champions, "Ahri") ?? champions[0] ?? null;
  const secondChampion = getHeroChampion(champions, "Yasuo") ?? champions[1] ?? firstChampion;

  return (
    <HextechFrame className="relative isolate min-h-[34rem] overflow-hidden bg-[#06111f]/92 lg:min-h-[39rem]">
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[linear-gradient(rgba(103,232,249,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.035)_1px,transparent_1px)] bg-[size:56px_56px]"
      />

      {firstChampion ? (
        <div className="absolute inset-y-0 left-0 z-0 w-[64%] opacity-70">
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover saturate-125 [transform:scaleX(-1)]"
            fill
            priority
            sizes="70vw"
            src={getChampionSplashUrl(firstChampion)}
            style={{ objectPosition: "24% 34%" }}
            unoptimized
          />
        </div>
      ) : null}

      {secondChampion ? (
        <div className="absolute inset-y-0 right-0 z-0 w-[68%] opacity-[0.64]">
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover saturate-110"
            fill
            priority
            sizes="72vw"
            src={getChampionSplashUrl(secondChampion)}
            style={{ objectPosition: "58% 28%" }}
            unoptimized
          />
        </div>
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_30%,rgba(34,211,238,0.18),transparent_23rem),linear-gradient(90deg,rgba(3,9,20,0.96)_0%,rgba(3,9,20,0.82)_34%,rgba(3,9,20,0.34)_62%,rgba(3,9,20,0.9)_100%),linear-gradient(180deg,rgba(3,9,20,0.22),rgba(3,9,20,0.88))]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-[#030914] via-[#030914]/70 to-transparent"
      />

      <div className="relative z-40 flex min-h-[34rem] max-w-4xl flex-col justify-center px-8 py-20 sm:px-12 lg:min-h-[39rem] lg:px-14">
        <div className="flex items-center gap-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">
            Matchup guides
          </p>
          <span className="h-px w-28 bg-cyan-200/35" aria-hidden="true" />
          <span
            className="size-2 rotate-45 border border-cyan-200/80 shadow-[0_0_14px_rgba(34,211,238,0.55)]"
            aria-hidden="true"
          />
        </div>

        <h1 className="mt-8 max-w-3xl font-mono text-5xl font-semibold uppercase leading-[0.96] tracking-normal text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
          Find your
          <span className="block text-cyan-50">lane plan</span>
        </h1>

        <div className="mt-7 h-0.5 w-20 bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.72)]" />
        <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-zinc-100 sm:text-lg">
          Search champions directly, filter by role, and open the matchup guide for the lane you
          want to study.
        </p>
      </div>
    </HextechFrame>
  );
}

function getHeroChampion(champions: LeagueChampion[], name: string) {
  return champions.find((champion) => champion.name.toLowerCase() === name.toLowerCase()) ?? null;
}
