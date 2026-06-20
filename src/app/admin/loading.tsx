import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import {
  SkeletonButton,
  SkeletonHeading,
  SkeletonIconSquare,
  SkeletonLine,
  SkeletonPanel,
  SkeletonStatCell,
} from "@/src/components/lane-stomp-skeleton";
import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading admin dashboard">
      <SiteHeader />

      <SkeletonButton className="h-10 w-40" />

      <div className="flex items-center gap-3">
        <SkeletonIconSquare className="size-12" />
        <div className="space-y-3">
          <SkeletonHeading className="h-10 w-72 max-w-[72vw]" />
          <SkeletonLine className="h-4 w-56 max-w-[64vw]" />
        </div>
      </div>

      <SkeletonPanel className="flex gap-2 overflow-hidden p-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonButton className="h-10 min-w-28" key={index} />
        ))}
      </SkeletonPanel>

      <section className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonPanel className="h-28 p-4" key={index}>
            <SkeletonStatCell className="border-l-0 px-0 py-0" />
          </SkeletonPanel>
        ))}
      </section>

      <SkeletonPanel className="p-4 sm:p-5">
        <div className="space-y-3">
          <SkeletonLine className="h-6 w-32" tone="raised" />
          <SkeletonLine className="h-4 w-full max-w-2xl" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="min-h-40 border border-cyan-100/12 bg-[#071321]/72 p-4" key={index}>
              <SkeletonLine className="h-4 w-32" tone="cyan" />
              <div className="mt-5 grid gap-3">
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                  <div className="grid grid-cols-[minmax(0,1fr)_4rem] gap-3" key={rowIndex}>
                    <SkeletonLine className="h-3 w-full" />
                    <SkeletonLine className="h-3 w-14" tone="raised" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="overflow-hidden">
        <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(3,7rem)] border-b border-cyan-100/10 bg-[#071321]/85 p-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonLine className="h-3 w-20" tone="cyan" key={index} />
          ))}
        </div>
        <div className="divide-y divide-cyan-100/10">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="grid grid-cols-[minmax(12rem,1fr)_repeat(3,7rem)] gap-3 p-3" key={index}>
              <SkeletonLine className="h-4 w-48" tone="raised" />
              <SkeletonLine className="h-4 w-16" />
              <SkeletonLine className="h-4 w-16" />
              <SkeletonLine className="h-4 w-16" />
            </div>
          ))}
        </div>
      </SkeletonPanel>
    </LaneStompPageShell>
  );
}
