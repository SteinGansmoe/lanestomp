import { SiteHeader } from "@/src/components/site-header";

export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-6"
      role="status"
      aria-label="Loading admin dashboard"
    >
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:ml-72 lg:max-w-[calc(100%-18rem)]">
        <SiteHeader />

        <div className="h-10 w-40 rounded-lg border border-white/10 bg-white/[0.04]" />

        <div className="flex items-center gap-3">
          <div className="size-12 rounded-lg bg-violet-500/20 ring-1 ring-violet-300/20" />
          <div className="space-y-3">
            <div className="h-10 w-72 rounded bg-white/10" />
            <div className="h-4 w-56 rounded bg-white/5" />
          </div>
        </div>

        <div className="flex gap-2 overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/90 p-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              className="h-10 min-w-28 rounded-md bg-white/[0.04]"
              key={index}
            />
          ))}
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-28 rounded-lg border border-white/10 bg-[#10182b]/90"
              key={index}
            />
          ))}
        </section>

        <section className="space-y-5">
          <div className="space-y-3">
            <div className="h-8 w-32 rounded bg-white/10" />
            <div className="h-4 w-full max-w-2xl rounded bg-white/5" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="h-40 rounded-lg border border-white/10 bg-[#10182b]/90"
                key={index}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
