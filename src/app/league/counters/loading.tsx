import { Target } from "lucide-react";

import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import { SiteHeader } from "@/src/components/site-header";

export default function LeagueCountersLoading() {
  return (
    <LaneStompPageShell>
        <SiteHeader />
        <div className="overflow-hidden border border-cyan-100/15 bg-[#06111f]/88">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_30rem)] p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                <Target className="size-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  LaneStomp
                </p>
                <h1 className="mt-2 font-mono text-2xl font-semibold tracking-normal text-white">
                  Loading counter picks
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(19rem,22rem)_minmax(0,1fr)]">
          <div className="h-[36rem] animate-pulse rounded border border-cyan-100/15 bg-white/[0.04]" />
          <div className="h-[36rem] animate-pulse rounded border border-cyan-100/15 bg-white/[0.04]" />
        </div>
    </LaneStompPageShell>
  );
}
