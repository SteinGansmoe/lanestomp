import { ArrowLeft, Search, Swords } from "lucide-react";

import { SiteHeader } from "@/src/components/site-header";

const roleSkeletons = ["All", "Top", "Jungle", "Mid", "Bot", "Support"];

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6"
      role="status"
      aria-label="Loading League matchup selector"
    >
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex h-10 w-44 animate-pulse items-center gap-2 rounded-xl border border-white/10 bg-[#10182b]/85 px-4 shadow-lg shadow-black/10">
            <ArrowLeft className="size-4 text-zinc-500" aria-hidden="true" />
            <div className="h-3 w-28 rounded bg-zinc-200/12" />
          </div>
          <div className="h-4 w-28 animate-pulse rounded bg-cyan-300/15" />
        </div>

        <SelectorHeroSkeleton />

        <SelectorPanelSkeleton />
      </section>
    </main>
  );
}

function SelectorHeroSkeleton() {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
      <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_30rem),linear-gradient(135deg,rgba(88,28,135,0.18),transparent_38rem)] p-5 sm:p-6">
        <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
            <Swords className="size-6 opacity-45" aria-hidden="true" />
          </div>
          <div className="grid gap-3">
            <div className="h-3 w-28 rounded bg-cyan-200/20" />
            <div className="h-8 w-64 max-w-[68vw] rounded bg-white/14" />
            <div className="h-4 w-[min(34rem,78vw)] rounded bg-zinc-200/12" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectorPanelSkeleton() {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-[#07101f] shadow-2xl shadow-black/25">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28rem),radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_26rem)] p-4 sm:p-5">
        <div className="grid animate-pulse gap-3">
          <div className="h-3 w-32 rounded bg-cyan-200/20" />
          <div className="mt-1 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
              <SelectionSlotSkeleton tone="cyan" />
              <div className="hidden size-11 rounded-md border border-cyan-300/15 bg-cyan-400/10 md:block" />
              <SelectionSlotSkeleton tone="gold" />
            </div>
            <div className="h-11 w-44 rounded-md border border-white/10 bg-white/10" />
          </div>

          <div className="mt-3">
            <div className="mb-2 h-3 w-12 rounded bg-zinc-200/12" />
            <div className="grid max-w-3xl grid-cols-6 gap-2">
              {roleSkeletons.map((role) => (
                <div
                  className="flex h-12 items-center justify-center rounded-md border border-white/10 bg-black/20"
                  key={role}
                >
                  <div className="size-7 rounded-full bg-zinc-200/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-center">
              <div className="relative h-11 w-full animate-pulse rounded-md border border-white/10 bg-black/25 xl:max-w-md">
                <Search
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
                <div className="ml-10 mt-4 h-3 w-36 rounded bg-zinc-200/12" />
              </div>
              <div className="h-11 w-full animate-pulse rounded-md border border-cyan-300/15 bg-cyan-400/[0.06] xl:w-72" />
            </div>
          </div>

          <div className="grid max-h-[36rem] grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2 overflow-hidden border-b border-white/10 py-4 sm:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]">
            {Array.from({ length: 72 }).map((_, index) => (
              <div
                className="aspect-square animate-pulse rounded-md border border-white/10 bg-white/[0.045] shadow-lg shadow-black/20"
                key={index}
              />
            ))}
          </div>

          <div className="mt-3 h-9 animate-pulse rounded-md border border-cyan-300/10 bg-cyan-400/[0.04]" />
        </div>

        <aside className="grid gap-3 lg:content-start">
          <InfoPanelSkeleton />
          <div className="h-24 animate-pulse rounded-lg border border-white/10 bg-white/[0.025]" />
          <div className="h-32 animate-pulse rounded-lg border border-white/10 bg-white/[0.025]" />
        </aside>
      </div>
    </section>
  );
}

function SelectionSlotSkeleton({ tone }: { tone: "cyan" | "gold" }) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-2.5">
      <div
        className={`size-12 shrink-0 rounded-md border ${
          tone === "cyan"
            ? "border-cyan-300/30 bg-cyan-400/10"
            : "border-[#C9AA5A]/35 bg-[#C9AA5A]/10"
        }`}
      />
      <div className="grid min-w-0 flex-1 gap-2">
        <div
          className={`h-3 w-24 rounded ${tone === "cyan" ? "bg-cyan-200/18" : "bg-[#C9AA5A]/18"}`}
        />
        <div className="h-4 w-36 max-w-full rounded bg-zinc-200/12" />
      </div>
    </div>
  );
}

function InfoPanelSkeleton() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
      <div className="h-3 w-14 animate-pulse rounded bg-zinc-200/12" />
      <ol className="mt-3 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <li className="flex animate-pulse items-center gap-3" key={index}>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-400/10" />
            <span className="h-4 w-36 rounded bg-zinc-200/12" />
          </li>
        ))}
      </ol>
    </div>
  );
}
