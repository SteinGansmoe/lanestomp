import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6"
      role="status"
      aria-label="Loading champion data"
    >
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-10 w-40 rounded-lg border border-white/10 bg-white/[0.04]" />
          <div className="h-10 w-44 rounded-lg border border-cyan-300/20 bg-cyan-400/10" />
        </div>

        <section className="rounded-lg border border-white/10 bg-[#10182b]/80 p-6 shadow-xl shadow-black/20">
          <div className="h-4 w-36 rounded bg-cyan-200/15" />
          <div className="mt-4 h-10 w-full max-w-lg rounded bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded bg-white/5" />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-20 rounded-lg border border-white/10 bg-white/[0.04]" key={index} />
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              className="rounded-lg border border-white/10 bg-[#10182b]/90 p-4 shadow-xl shadow-black/15"
              key={index}
            >
              <div className="flex items-center gap-3">
                <div className="size-14 rounded-lg bg-white/10" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-5 w-28 rounded bg-white/10" />
                  <div className="h-3 w-20 rounded bg-white/5" />
                </div>
              </div>
              <div className="mt-4 h-3 rounded bg-white/5" />
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
