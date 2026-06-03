import { Swords } from "lucide-react";

import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#050b18] text-white"
      role="status"
      aria-label="Loading LaneStomp"
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <section className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/80 p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
              <Swords className="size-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="h-8 w-full max-w-lg rounded bg-white/10" />
              <div className="mt-3 h-4 w-full max-w-2xl rounded bg-white/5" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="rounded-lg border border-white/10 bg-[#10182b]/90 p-5 shadow-xl shadow-black/20">
            <div className="h-11 rounded-lg border border-white/10 bg-white/[0.04]" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <div
                  className="h-24 rounded-lg border border-white/10 bg-white/[0.04]"
                  key={index}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-cyan-300/15 bg-cyan-400/10 p-5">
              <div className="h-5 w-32 rounded bg-cyan-100/15" />
              <div className="mt-4 space-y-2">
                <div className="h-3 rounded bg-white/10" />
                <div className="h-3 w-4/5 rounded bg-white/10" />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="h-5 w-36 rounded bg-white/10" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="h-16 rounded bg-white/[0.05]" />
                <div className="h-16 rounded bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
