import { SiteHeader } from "@/src/components/site-header";

const skeletonSections = [
  "Overview",
  "Role Plan",
  "Danger Windows",
  "Early Game",
  "Power Spikes",
  "Win Conditions",
];

export default function Loading() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050b18] px-4 py-4 text-white sm:px-6 lg:px-8"
      role="status"
      aria-label="Loading League matchup guide"
    >
      <LoadingPageTheme />

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-3 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 w-52 rounded-lg border border-white/10 bg-white/[0.055] shadow-lg shadow-black/10" />
          <div className="h-10 w-44 rounded-lg border border-white/10 bg-white/[0.055] shadow-lg shadow-black/10" />
          <div className="ml-auto h-5 w-24 rounded bg-cyan-300/15" />
        </div>

        <MatchupHeroSkeleton />

        <section className="mt-10 grid justify-center gap-4 sm:mt-12">
          <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-3">
            <AdminReviewSkeleton />

            <section className="grid gap-3 lg:grid-cols-2">
              {skeletonSections.map((section, index) => (
                <MatchupSectionSkeleton index={index} key={section} title={section} />
              ))}
            </section>

            <TipStripSkeleton />
          </div>
        </section>
      </section>
    </main>
  );
}

function LoadingPageTheme() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-0 top-0 h-[46rem] w-[58%] bg-[radial-gradient(circle_at_28%_22%,rgba(34,211,238,0.28),transparent_18rem),linear-gradient(115deg,rgba(30,64,175,0.34),rgba(5,11,24,0.74)_62%,transparent)] opacity-70" />
      <div className="absolute right-0 top-0 h-[46rem] w-[58%] bg-[radial-gradient(circle_at_72%_20%,rgba(168,85,247,0.28),transparent_18rem),linear-gradient(245deg,rgba(20,184,166,0.26),rgba(5,11,24,0.74)_62%,transparent)] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,24,0.18),rgba(5,11,24,0.82)_42%,rgba(5,11,24,0.82)_58%,rgba(5,11,24,0.18))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.18),rgba(5,11,24,0.58)_24rem,rgba(5,11,24,0.94)_52rem,#050b18_78rem)]" />
      <div className="absolute inset-x-[-12%] top-28 h-80 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.16),rgba(34,211,238,0.08)_34%,transparent_68%)] blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(5,11,24,0.9)_42%,#050b18)]" />
    </div>
  );
}

function MatchupHeroSkeleton() {
  return (
    <section className="relative animate-pulse">
      <div className="flex min-h-24 items-center justify-center px-4 py-3 sm:min-h-28">
        <div className="w-full max-w-3xl text-center">
          <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center justify-end gap-3">
              <div className="hidden h-8 w-32 rounded bg-white/12 sm:block" />
              <div className="size-12 rounded-lg border border-white/15 bg-white/10 shadow-lg shadow-black/30 sm:size-14" />
            </div>

            <div className="grid gap-1">
              <div className="flex size-9 items-center justify-center rounded-lg border border-violet-300/20 bg-violet-500/25">
                <div className="h-3 w-4 rounded bg-violet-100/40" />
              </div>
              <div className="h-5 rounded-md border border-white/10 bg-black/25 px-2 py-0.5">
                <div className="mx-auto h-2.5 w-8 rounded bg-zinc-300/25" />
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <div className="size-12 rounded-lg border border-white/15 bg-white/10 shadow-lg shadow-black/30 sm:size-14" />
              <div className="hidden h-8 w-32 rounded bg-white/12 sm:block" />
            </div>
          </div>

          <div className="mx-auto mt-3 h-7 w-56 rounded bg-white/12 sm:hidden" />

          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            <div className="h-7 w-28 rounded-md border border-white/10 bg-black/25" />
            <div className="h-7 w-32 rounded-md border border-white/10 bg-black/25" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminReviewSkeleton() {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-violet-300/18 bg-[#10182b]/72 p-4 shadow-lg shadow-black/10 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-md border border-violet-300/20 bg-violet-500/20" />
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-white/14" />
          <div className="h-3 w-72 max-w-[58vw] rounded bg-zinc-300/12" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <div className="h-9 w-32 rounded-md border border-white/10 bg-white/[0.06]" />
        <div className="h-9 w-36 rounded-md border border-cyan-300/12 bg-cyan-400/10" />
      </div>
    </section>
  );
}

function MatchupSectionSkeleton({ index, title }: { index: number; title: string }) {
  const accentClasses = [
    "border-cyan-300/20 bg-cyan-400/10 text-cyan-100",
    "border-violet-300/20 bg-violet-500/20 text-violet-100",
    "border-rose-300/20 bg-rose-400/10 text-rose-100",
    "border-emerald-300/20 bg-emerald-400/10 text-emerald-100",
    "border-yellow-300/20 bg-yellow-300/10 text-yellow-100",
    "border-teal-300/20 bg-teal-400/10 text-teal-100",
  ];

  return (
    <article className="min-h-52 rounded-lg border border-white/12 bg-[#10182b]/72 p-4 shadow-lg shadow-black/10 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${accentClasses[index]}`}
          >
            <div className="size-3 rounded-full bg-current opacity-45" />
          </div>
          <h2 className="truncate font-mono text-sm font-semibold uppercase tracking-[0.12em] text-white">
            {title}
          </h2>
        </div>
        <div className="h-8 w-28 shrink-0 rounded-md border border-white/10 bg-white/[0.06]" />
      </div>

      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, lineIndex) => (
          <div className="flex gap-3" key={lineIndex}>
            <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/30" />
            <div
              className={`h-4 rounded bg-zinc-200/12 ${
                lineIndex === 0 ? "w-11/12" : lineIndex === 1 ? "w-10/12" : "w-8/12"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-3">
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-20 rounded-md border border-cyan-300/15 bg-cyan-400/10" />
          <div className="h-8 w-28 rounded-md border border-yellow-300/15 bg-yellow-300/10" />
          <div className="h-8 w-24 rounded-md border border-rose-300/15 bg-rose-400/10" />
        </div>
      </div>
    </article>
  );
}

function TipStripSkeleton() {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-cyan-300/10 bg-[#10182b]/78 p-4 shadow-lg shadow-black/10 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 size-8 rounded-md border border-cyan-300/20 bg-cyan-400/10" />
        <div className="mt-1 h-4 w-[min(34rem,68vw)] rounded bg-zinc-300/12" />
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <div className="h-7 w-36 rounded-md border border-white/10 bg-black/25" />
        <div className="h-7 w-28 rounded-md border border-white/10 bg-white/[0.06]" />
      </div>
    </section>
  );
}
