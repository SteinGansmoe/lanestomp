import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6"
      role="status"
      aria-label="Loading League matchups"
    >
      <section className="mx-auto flex max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="h-10 w-40 rounded-lg border border-white/10 bg-white/[0.04]" />
          <div className="h-10 w-44 rounded-lg border border-cyan-300/20 bg-cyan-400/10" />
        </div>

        <section className="rounded-lg border border-white/10 bg-[#10182b]/80 p-6 shadow-xl shadow-black/20">
          <div className="h-4 w-32 rounded bg-cyan-200/15" />
          <div className="mt-4 h-10 w-full max-w-xl rounded bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-3xl rounded bg-white/5" />
        </section>

        <section className="mt-10 grid justify-center gap-6 sm:mt-12">
          <div className="mx-auto w-full max-w-6xl rounded-lg border border-white/10 bg-[#10182b]/90 p-5 shadow-xl shadow-black/20">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
              <div className="h-11 rounded-lg border border-white/10 bg-white/[0.04]" />
              <div className="h-11 rounded-lg border border-white/10 bg-white/[0.04]" />
            </div>
            <div className="mt-5 flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="h-9 flex-1 rounded-lg border border-white/10 bg-white/[0.04]"
                  key={index}
                />
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  className="h-20 rounded-lg border border-white/10 bg-white/[0.04]"
                  key={index}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5" key={index}>
                <div className="h-5 w-32 rounded bg-white/10" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 rounded bg-white/10" />
                  <div className="h-3 w-5/6 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
