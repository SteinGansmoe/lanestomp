import { HextechFrame } from "@/src/components/league/hextech-frame";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import {
  SkeletonBlock,
  SkeletonButton,
  SkeletonChampionPortrait,
  SkeletonField,
  SkeletonHeading,
  SkeletonIconSquare,
  SkeletonLine,
  SkeletonPanel,
  SkeletonSectionLabel,
  SkeletonStatCell,
} from "@/src/components/lane-stomp-skeleton";
import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading LaneStomp">
      <SiteHeader />

      <HextechFrame className="relative isolate min-h-[35rem] w-[calc(100vw-2rem)] max-w-full overflow-visible bg-[#06111f]/88 sm:w-full">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(34,211,238,0.18),transparent_24rem),linear-gradient(90deg,rgba(3,9,20,0.98)_0%,rgba(3,9,20,0.9)_32%,rgba(3,9,20,0.32)_66%,rgba(3,9,20,0.62)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(103,232,249,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.035)_1px,transparent_1px)] bg-[size:88px_88px]" />
          <div className="absolute inset-y-0 right-0 w-[64%] bg-[radial-gradient(ellipse_at_70%_22%,rgba(103,232,249,0.16),transparent_25rem),linear-gradient(135deg,transparent,rgba(255,255,255,0.045)_48%,transparent_68%)] opacity-80" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,9,20,0.2),rgba(3,9,20,0.08)_55%,rgba(3,9,20,0.94))]" />
        </div>

        <div className="relative z-40 w-full max-w-[21rem] px-3 py-12 sm:max-w-3xl sm:px-8 sm:py-14 lg:px-12 lg:py-20">
          <SkeletonSectionLabel />
          <div className="mt-6 grid gap-3">
            <SkeletonHeading className="h-12 w-72 max-w-full sm:h-14 sm:w-[34rem] lg:h-16" />
            <SkeletonHeading className="h-12 w-64 max-w-full sm:h-14 sm:w-[31rem] lg:h-16" />
            <SkeletonHeading className="h-12 w-80 max-w-full sm:h-14 sm:w-[36rem] lg:h-16" />
          </div>
          <SkeletonLine className="mt-6 h-0.5 w-12" tone="cyan" />
          <div className="mt-5 grid gap-3">
            <SkeletonLine className="h-4 w-full max-w-2xl" />
            <SkeletonLine className="h-4 w-11/12 max-w-xl" />
          </div>

          <div className="mt-8 w-full max-w-3xl border border-cyan-300/35 bg-[#06111f]/82">
            <div className="grid sm:grid-cols-[minmax(0,1fr)_15rem]">
              <SkeletonField className="h-16 border-0 bg-[#020814]/70" />
              <SkeletonButton className="h-16 w-full border-x-0 border-y-0 sm:border-l" />
            </div>
          </div>

          <div className="mt-6">
            <SkeletonLine className="h-3 w-40" tone="cyan" />
            <div className="mt-4 flex gap-4 overflow-hidden">
              {Array.from({ length: 9 }).map((_, index) => (
                <div className="grid shrink-0 gap-2 text-center" key={index}>
                  <SkeletonChampionPortrait className="size-14" />
                  <SkeletonLine className="mx-auto h-2 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </HextechFrame>

      <SkeletonPanel className="px-5 py-5 sm:px-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.7fr)] xl:items-center">
          <div className="flex gap-4">
            <SkeletonIconSquare className="size-11" />
            <div className="min-w-0 flex-1">
              <SkeletonLine className="h-4 w-40" tone="cyan" />
              <SkeletonLine className="mt-4 h-3 w-full max-w-xl" />
              <SkeletonLine className="mt-2 h-3 w-10/12 max-w-lg" />
              <SkeletonLine className="mt-2 h-3 w-8/12 max-w-md" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="flex items-start gap-3" key={index}>
                <SkeletonBlock className="mt-1 size-4" tone={index === 0 ? "cyan" : "gold"} />
                <div className="grid gap-2">
                  <SkeletonLine className="h-4 w-20" tone="raised" />
                  <SkeletonLine className="h-3 w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="mt-4 p-4 sm:p-5">
        <SkeletonLine className="mx-3 h-4 w-40" tone="cyan" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              className="grid min-h-28 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 border border-cyan-100/15 bg-[#071321]/80 px-5 py-4"
              key={index}
            >
              <SkeletonIconSquare className="size-16" />
              <div className="grid gap-3">
                <SkeletonLine className="h-5 w-44" tone="raised" />
                <SkeletonLine className="h-3 w-full" />
                <SkeletonLine className="h-3 w-10/12" />
              </div>
              <SkeletonBlock className="size-5" tone="cyan" />
            </div>
          ))}
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonStatCell key={index} />
        ))}
      </SkeletonPanel>
    </LaneStompPageShell>
  );
}
