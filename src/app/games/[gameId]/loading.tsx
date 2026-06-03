import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6"
      role="status"
      aria-label="Loading game detail"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex max-w-6xl flex-col gap-6">
          <section className="min-h-80 rounded-xl border border-white/10 bg-[#10182b] p-7 shadow-xl shadow-black/25 ring-1 ring-white/5">
            <div className="h-6 w-32 rounded bg-white/10" />
            <div className="mt-16 flex gap-7">
              <div className="size-32 rounded-lg bg-white/10" />
              <div className="space-y-4">
                <div className="h-6 w-24 rounded bg-violet-500/20" />
                <div className="h-12 w-64 rounded bg-white/10" />
                <div className="h-7 w-40 rounded bg-white/5" />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                className="h-24 rounded-lg border border-white/10 bg-[#10182b]/80"
                key={index}
              />
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="rounded-lg border border-white/10 bg-[#10182b]/90 p-5"
                  key={index}
                >
                  <div className="h-5 w-36 rounded bg-white/10" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 rounded bg-white/5" />
                    <div className="h-3 w-5/6 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
              <div className="h-5 w-32 rounded bg-white/10" />
              <div className="mt-4 grid gap-3">
                <div className="h-16 rounded bg-white/[0.05]" />
                <div className="h-16 rounded bg-white/[0.05]" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
