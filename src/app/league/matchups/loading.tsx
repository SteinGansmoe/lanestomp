import { HextechFrame } from "@/src/components/league/hextech-frame";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import {
  SkeletonBlock,
  SkeletonButton,
  SkeletonField,
  SkeletonHeading,
  SkeletonIconSquare,
  SkeletonLine,
  SkeletonPanel,
  SkeletonSectionLabel,
} from "@/src/components/lane-stomp-skeleton";
import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading League matchup selector">
      <SiteHeader />

      <HextechFrame className="relative isolate min-h-[34rem] overflow-hidden bg-[#06111f]/92 lg:min-h-[39rem]">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(103,232,249,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.035)_1px,transparent_1px)] bg-[size:56px_56px]" />
          <div className="absolute inset-y-0 left-0 w-[64%] bg-[radial-gradient(circle_at_24%_34%,rgba(34,211,238,0.14),transparent_22rem),linear-gradient(115deg,rgba(12,32,52,0.74),transparent_64%)] opacity-80" />
          <div className="absolute inset-y-0 right-0 w-[68%] bg-[radial-gradient(circle_at_62%_28%,rgba(201,170,90,0.12),transparent_22rem),linear-gradient(245deg,rgba(14,116,144,0.22),transparent_68%)] opacity-75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(34,211,238,0.18),transparent_23rem),linear-gradient(90deg,rgba(3,9,20,0.96)_0%,rgba(3,9,20,0.82)_34%,rgba(3,9,20,0.34)_62%,rgba(3,9,20,0.9)_100%),linear-gradient(180deg,rgba(3,9,20,0.22),rgba(3,9,20,0.88))]" />
        </div>

        <div className="relative z-40 flex min-h-[34rem] max-w-4xl flex-col justify-center px-8 py-20 sm:px-12 lg:min-h-[39rem] lg:px-14">
          <SkeletonSectionLabel />
          <div className="mt-8 grid gap-3">
            <SkeletonHeading className="h-14 w-72 max-w-full sm:h-16 sm:w-[33rem] lg:h-20" />
            <SkeletonHeading className="h-14 w-64 max-w-full sm:h-16 sm:w-[25rem] lg:h-20" />
          </div>
          <SkeletonLine className="mt-7 h-0.5 w-20" tone="cyan" />
          <SkeletonLine className="mt-6 h-4 w-full max-w-2xl" />
          <SkeletonLine className="mt-3 h-4 w-10/12 max-w-xl" />
        </div>
      </HextechFrame>

      <SkeletonPanel className="relative z-10 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <div className="border-b border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_28rem),linear-gradient(135deg,rgba(8,24,40,0.9),rgba(3,9,20,0.82))] p-4 sm:p-5 lg:p-6">
          <SkeletonLine className="h-3 w-36" tone="cyan" />
          <div className="mt-5 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
              <SelectionSlotSkeleton tone="cyan" />
              <SkeletonIconSquare className="hidden size-11 md:block" />
              <SelectionSlotSkeleton tone="gold" />
            </div>
            <SkeletonButton className="h-11 w-full xl:w-44" />
          </div>
          <div className="mt-5 grid max-w-3xl grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonIconSquare className="h-12 w-full" key={index} tone={index === 0 ? "cyan" : "base"} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:p-6">
          <div className="min-w-0">
            <div className="flex flex-col gap-3 border-b border-cyan-100/10 pb-4 xl:flex-row xl:items-center xl:justify-between">
              <SkeletonField className="w-full xl:max-w-md" />
              <SkeletonButton className="h-11 w-full md:hidden" />
            </div>

            <div className="mt-4 grid max-h-[36rem] grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2 overflow-hidden border border-cyan-100/10 bg-[#020814]/45 p-3 sm:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]">
              {Array.from({ length: 84 }).map((_, index) => (
                <SkeletonBlock className="aspect-square" key={index} tone="raised" />
              ))}
            </div>

            <SkeletonLine className="mt-3 h-9 w-full" tone="cyan" />
          </div>

          <aside className="grid gap-3 border border-cyan-100/20 bg-[#071321]/72 p-5 lg:content-start">
            <SkeletonLine className="h-4 w-28" tone="cyan" />
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="flex items-center gap-3" key={index}>
                  <SkeletonBlock className="size-6" tone="cyan" />
                  <SkeletonLine className="h-4 w-40" />
                </div>
              ))}
            </div>
            <div className="border-t border-cyan-100/10 pt-4">
              <SkeletonLine className="h-4 w-32" tone="raised" />
              <SkeletonLine className="mt-3 h-3 w-full" />
              <SkeletonLine className="mt-2 h-3 w-10/12" />
            </div>
          </aside>
        </div>
      </SkeletonPanel>
    </LaneStompPageShell>
  );
}

function SelectionSlotSkeleton({ tone }: { tone: "cyan" | "gold" }) {
  return (
    <div className="flex min-h-16 items-center gap-3 border border-cyan-100/10 bg-black/20 p-2.5">
      <SkeletonIconSquare className="size-12" tone={tone} />
      <div className="grid min-w-0 flex-1 gap-2">
        <SkeletonLine className="h-3 w-24" tone={tone} />
        <SkeletonLine className="h-4 w-36 max-w-full" />
      </div>
    </div>
  );
}
