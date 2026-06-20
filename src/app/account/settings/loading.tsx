import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import {
  SkeletonButton,
  SkeletonField,
  SkeletonHeading,
  SkeletonIconSquare,
  SkeletonLine,
  SkeletonPanel,
} from "@/src/components/lane-stomp-skeleton";
import { SiteHeader } from "@/src/components/site-header";

export default function AccountSettingsLoading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading account settings">
      <SiteHeader />

      <SkeletonPanel className="overflow-hidden">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_28rem),radial-gradient(circle_at_85%_0%,rgba(201,170,90,0.12),transparent_26rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.92))] p-5 sm:p-7">
          <SkeletonIconSquare className="size-12" />
          <SkeletonHeading className="mt-5 h-9 w-72 max-w-full" />
          <SkeletonLine className="mt-3 h-4 w-full max-w-2xl" />
          <SkeletonLine className="mt-2 h-4 w-10/12 max-w-xl" />
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="mx-auto w-full max-w-4xl p-6">
        <div className="flex items-start gap-4">
          <SkeletonIconSquare className="size-12" />
          <div className="min-w-0 flex-1">
            <SkeletonHeading className="h-8 w-56 max-w-full" />
            <SkeletonLine className="mt-3 h-4 w-full max-w-lg" />
          </div>
        </div>

        <div className="mt-8 grid gap-8">
          <AccountFormSectionSkeleton withHelper />
          <AccountFormSectionSkeleton />

          <div className="border border-cyan-100/15 bg-white/[0.03] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <SkeletonLine className="h-4 w-48" tone="cyan" />
                <SkeletonLine className="mt-3 h-3 w-full max-w-lg" />
                <SkeletonLine className="mt-2 h-3 w-8/12 max-w-md" />
              </div>
              <SkeletonButton className="h-10 w-36" />
            </div>
          </div>

          <AccountFormSectionSkeleton />
        </div>
      </SkeletonPanel>
    </LaneStompPageShell>
  );
}

function AccountFormSectionSkeleton({ withHelper = false }: { withHelper?: boolean }) {
  return (
    <div className="grid gap-3">
      <SkeletonLine className="h-4 w-28" tone="raised" />
      <SkeletonField className="h-11" />
      {withHelper ? <SkeletonLine className="h-3 w-52" /> : null}
      <SkeletonButton className="h-11 w-40" />
    </div>
  );
}
