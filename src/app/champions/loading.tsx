import { SiteHeader } from "@/src/components/site-header";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";

export default function Loading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading champion data">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-10 w-40 rounded border border-cyan-100/15 bg-white/[0.04]" />
          <div className="h-10 w-44 rounded border border-cyan-300/20 bg-cyan-400/10" />
        </div>

        <section className="rounded border border-cyan-100/15 bg-[#06111f]/80 p-6">
          <div className="h-4 w-36 rounded bg-cyan-200/15" />
          <div className="mt-4 h-10 w-full max-w-lg rounded bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/5" />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-20 rounded border border-cyan-100/15 bg-white/[0.04]" key={index} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              className="rounded border border-cyan-100/15 bg-[#06111f]/90 p-4"
              key={index}
            >
              <div className="flex items-center gap-3">
                <div className="size-14 rounded bg-white/10" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-5 w-28 rounded bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/5" />
                </div>
              </div>
              <div className="mt-4 h-3 rounded bg-white/5" />
            </div>
          ))}
        </section>
    </LaneStompPageShell>
  );
}
