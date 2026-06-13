import { Target } from "lucide-react";

import { SiteHeader } from "@/src/components/site-header";

export default function LeagueCountersLoading() {
  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_30rem)] p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
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
          <div className="h-[36rem] animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
          <div className="h-[36rem] animate-pulse rounded-lg border border-white/10 bg-white/[0.04]" />
        </div>
      </section>
    </main>
  );
}
