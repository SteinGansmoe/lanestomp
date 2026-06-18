import { SiteHeader } from "@/src/components/site-header";
import { LaneStompPageShell } from "@/src/components/lane-stomp-page";

export default function Loading() {
  return (
    <LaneStompPageShell role="status" aria-label="Loading admin dashboard">
        <SiteHeader />

        <div className="h-10 w-40 rounded border border-cyan-100/15 bg-white/[0.04]" />

        <div className="flex items-center gap-3">
          <div className="size-12 rounded bg-cyan-400/10" />
          <div className="space-y-3">
            <div className="h-10 w-72 rounded bg-white/10" />
            <div className="h-4 w-56 rounded bg-white/5" />
          </div>
        </div>

        <div className="flex gap-2 overflow-hidden rounded border border-cyan-100/15 bg-[#06111f]/90 p-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="h-10 min-w-28 rounded bg-white/[0.04]" key={index} />
          ))}
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="h-28 rounded border border-cyan-100/15 bg-[#06111f]/90" key={index} />
          ))}
        </section>

        <section className="space-y-5">
          <div className="space-y-3">
            <div className="h-8 w-32 rounded bg-white/10" />
            <div className="h-4 w-full max-w-2xl rounded bg-white/5" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-40 rounded border border-cyan-100/15 bg-[#06111f]/90" key={index} />
            ))}
          </div>
        </section>
    </LaneStompPageShell>
  );
}
