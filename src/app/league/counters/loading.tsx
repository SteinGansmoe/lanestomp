import { HextechFrame } from "@/src/components/league/hextech-frame";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import {
  SkeletonButton,
  SkeletonField,
  SkeletonHeading,
  SkeletonIconSquare,
  SkeletonLine,
  SkeletonSectionLabel,
} from "@/src/components/lane-stomp-skeleton";
import { SiteHeader } from "@/src/components/site-header";

export default function LeagueCountersLoading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading counter pick">
      <SiteHeader />

      <HextechFrame className="relative min-h-[38rem] w-[calc(100vw-2rem)] max-w-full overflow-hidden bg-[#06111f]/88 sm:w-full sm:overflow-visible lg:min-h-[44rem]">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_20%,rgba(34,211,238,0.16),transparent_25rem),linear-gradient(90deg,#030914_0%,rgba(3,9,20,0.91)_28%,rgba(3,9,20,0.34)_58%,rgba(3,9,20,0.48)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,9,20,0.96)_0%,rgba(3,9,20,0.68)_24%,transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.075] mix-blend-screen bg-[linear-gradient(rgba(103,232,249,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.12)_1px,transparent_1px)] bg-[size:88px_88px]" />
        </div>

        <div className="relative z-40 flex min-h-[38rem] min-w-0 flex-col justify-between gap-10 px-3 py-8 sm:px-8 sm:py-10 lg:min-h-[44rem] lg:px-14 lg:py-14">
          <div className="max-w-3xl pt-8 sm:pt-12 lg:pt-20">
            <SkeletonSectionLabel />
            <div className="mt-6 grid gap-3">
              <SkeletonHeading className="h-12 w-64 max-w-full sm:h-14 sm:w-[31rem] lg:h-16" />
              <SkeletonHeading className="h-12 w-56 max-w-full sm:h-14 sm:w-[24rem] lg:h-16" />
            </div>
            <SkeletonLine className="mt-6 h-0.5 w-12" tone="cyan" />
            <SkeletonLine className="mt-5 h-4 w-full max-w-2xl" />
            <SkeletonLine className="mt-3 h-4 w-10/12 max-w-xl" />
          </div>

          <div className="relative w-[calc(100vw-3.5rem)] max-w-full min-w-0 border border-cyan-300/35 bg-[#06111f]/82 shadow-[0_24px_60px_rgba(0,0,0,0.34),0_0_28px_rgba(34,211,238,0.08)] backdrop-blur sm:w-full">
            <div className="pointer-events-none absolute inset-x-3 -bottom-px hidden h-px bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.6),transparent)] sm:block" />
            <div className="grid gap-5 p-5 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.1fr)_auto] lg:items-center lg:p-7">
              <div>
                <SkeletonLine className="h-3 w-24" tone="cyan" />
                <div className="mt-5 flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonIconSquare className="size-14 sm:size-16" key={index} tone={index === 2 ? "cyan" : "gold"} />
                  ))}
                </div>
              </div>
              <div>
                <SkeletonLine className="h-3 w-28" tone="cyan" />
                <SkeletonField className="mt-5 h-14" />
              </div>
              <SkeletonButton className="h-14 w-full lg:w-56" />
            </div>
          </div>
        </div>
      </HextechFrame>
    </LaneStompPageShell>
  );
}
