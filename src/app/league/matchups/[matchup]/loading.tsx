import { HextechFrame } from "@/src/components/league/hextech-frame";
import {
  LaneStompPageBackground,
  laneStompContentClassName,
  laneStompPageClassName,
} from "@/src/components/lane-stomp-page";
import {
  SkeletonBlock,
  SkeletonButton,
  SkeletonChampionPortrait,
  SkeletonHeading,
  SkeletonIconSquare,
  SkeletonLine,
  SkeletonPanel,
  SkeletonSectionLabel,
} from "@/src/components/lane-stomp-skeleton";
import { SiteHeader } from "@/src/components/site-header";

const sectionTones = ["cyan", "gold", "danger", "cyan", "gold", "cyan"] as const;

export default function Loading() {
  return (
    <main className={laneStompPageClassName} role="status" aria-label="Loading League matchup guide">
      <LaneStompPageBackground />

      <section className={laneStompContentClassName}>
        <SiteHeader />

        <div className="flex flex-wrap items-center gap-3">
          <SkeletonButton className="h-10 w-52" />
          <SkeletonButton className="h-10 w-44" />
          <SkeletonLine className="ml-auto hidden h-4 w-24 sm:block" tone="cyan" />
        </div>

        <MatchupHeroSkeleton />

        <section className="mt-10 grid justify-center gap-4 sm:mt-12">
          <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-3">
            <AdminReviewSkeleton />

            <section className="grid gap-3 lg:grid-cols-2">
              {sectionTones.map((tone, index) => (
                <MatchupSectionSkeleton index={index} key={index} tone={tone} />
              ))}
            </section>

            <TipStripSkeleton />
          </div>
        </section>
      </section>
    </main>
  );
}

function MatchupHeroSkeleton() {
  return (
    <HextechFrame className="relative isolate min-h-[30rem] overflow-hidden bg-[#06111f]/90 sm:min-h-[34rem]">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-[48%] bg-[radial-gradient(circle_at_22%_28%,rgba(34,211,238,0.18),transparent_20rem),linear-gradient(90deg,rgba(14,116,144,0.2),transparent)]" />
        <div className="absolute inset-y-0 right-0 w-[48%] bg-[radial-gradient(circle_at_78%_28%,rgba(201,170,90,0.14),transparent_20rem),linear-gradient(270deg,rgba(14,116,144,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,9,20,0.94),rgba(3,9,20,0.62)_34%,rgba(3,9,20,0.7)_66%,rgba(3,9,20,0.94)),linear-gradient(180deg,rgba(3,9,20,0.18),rgba(3,9,20,0.94))]" />
      </div>

      <div className="relative z-10 flex min-h-[30rem] flex-col items-center justify-center px-5 py-12 text-center sm:min-h-[34rem] sm:px-10">
        <SkeletonSectionLabel className="justify-center" />
        <div className="mt-8 grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-6">
          <HeroChampionSide align="right" />
          <div className="grid place-items-center gap-3">
            <SkeletonBlock className="flex size-14 border-cyan-300/25 bg-[#071321]/88 sm:size-16" tone="cyan" />
            <SkeletonLine className="h-8 w-px" tone="cyan" />
          </div>
          <HeroChampionSide align="left" />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <SkeletonButton className="h-10 w-40" />
          <SkeletonButton className="h-10 w-44" />
          <SkeletonButton className="h-10 w-36" />
        </div>
      </div>
    </HextechFrame>
  );
}

function HeroChampionSide({ align }: { align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "flex min-w-0 justify-end" : "flex min-w-0 justify-start"}>
      <div className={align === "right" ? "grid justify-items-end gap-3" : "grid justify-items-start gap-3"}>
        <SkeletonHeading className="hidden h-12 w-48 max-w-[28vw] sm:block" />
        <SkeletonChampionPortrait className="size-20 border-[#C9AA5A]/35 sm:size-24" />
        <SkeletonLine className="hidden h-4 w-32 sm:block" tone="gold" />
      </div>
    </div>
  );
}

function AdminReviewSkeleton() {
  return (
    <SkeletonPanel className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <SkeletonIconSquare className="size-10" />
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-28" tone="raised" />
          <SkeletonLine className="h-3 w-72 max-w-[58vw]" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <SkeletonButton className="h-9 w-32" />
        <SkeletonButton className="h-9 w-36" />
      </div>
    </SkeletonPanel>
  );
}

function MatchupSectionSkeleton({
  index,
  tone,
}: {
  index: number;
  tone: "cyan" | "gold" | "danger";
}) {
  return (
    <SkeletonPanel className="min-h-56 p-4" raised>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonIconSquare className="size-9" tone={tone === "danger" ? "base" : tone} />
          <SkeletonLine className="h-4 w-44 max-w-[42vw]" tone="raised" />
        </div>
        <SkeletonButton className="h-8 w-28" />
      </div>

      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, lineIndex) => (
          <div className="flex gap-3" key={lineIndex}>
            <SkeletonBlock className="mt-1.5 size-1.5" tone={tone === "danger" ? "danger" : tone} />
            <SkeletonLine
              className={
                lineIndex === 0 ? "h-4 w-11/12" : lineIndex === 1 ? "h-4 w-10/12" : "h-4 w-8/12"
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-3">
        <div className="flex flex-wrap gap-2">
          <SkeletonButton className="h-8 w-20" />
          <SkeletonButton className="h-8 w-28" />
          <SkeletonButton className="h-8 w-24" />
        </div>
      </div>
      <SkeletonLine className="mt-4 h-2 w-16" tone={index % 2 === 0 ? "cyan" : "gold"} />
    </SkeletonPanel>
  );
}

function TipStripSkeleton() {
  return (
    <SkeletonPanel className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <SkeletonIconSquare className="mt-0.5 size-8" />
        <div className="grid gap-2">
          <SkeletonLine className="h-4 w-[min(34rem,68vw)]" tone="raised" />
          <SkeletonLine className="h-3 w-[min(26rem,56vw)]" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <SkeletonButton className="h-8 w-36" />
        <SkeletonButton className="h-8 w-28" />
      </div>
    </SkeletonPanel>
  );
}
