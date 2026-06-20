import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import {
  SkeletonButton,
  SkeletonChampionPortrait,
  SkeletonHeading,
  SkeletonIconSquare,
  SkeletonLine,
  SkeletonPanel,
  SkeletonStatCell,
} from "@/src/components/lane-stomp-skeleton";
import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading champion data">
      <SiteHeader />

      <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
        <SkeletonButton className="h-10 w-52" />
        <SkeletonButton className="h-10 w-48" />
      </div>

      <SkeletonPanel className="overflow-hidden">
        <div className="border-b border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32rem),linear-gradient(135deg,rgba(8,24,40,0.94),rgba(3,9,20,0.82))] p-5 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <SkeletonIconSquare className="mb-5 size-12" />
              <SkeletonLine className="h-3 w-56" tone="cyan" />
              <SkeletonHeading className="mt-3 h-10 w-80 max-w-full" />
              <SkeletonLine className="mt-4 h-3 w-full max-w-2xl" />
              <SkeletonLine className="mt-2 h-3 w-9/12 max-w-xl" />
            </div>

            <div className="grid overflow-hidden border border-cyan-100/15 bg-black/18 sm:grid-cols-2 lg:min-w-80">
              <SkeletonStatCell />
              <SkeletonStatCell />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <article
                aria-hidden="true"
                className="flex min-w-0 gap-3 border border-cyan-100/12 bg-[#071321]/70 p-3"
                key={index}
              >
                <SkeletonChampionPortrait />
                <div className="min-w-0 flex-1">
                  <SkeletonLine className="h-5 w-28" tone="raised" />
                  <SkeletonLine className="mt-2 h-3 w-36 max-w-full" />
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <SkeletonLine className="h-5 w-14" tone="cyan" />
                    <SkeletonLine className="h-5 w-16" tone="cyan" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SkeletonPanel>
    </LaneStompPageShell>
  );
}
