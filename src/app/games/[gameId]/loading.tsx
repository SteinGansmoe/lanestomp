import { SiteHeader } from "@/src/components/site-header";
import { Card } from "@/src/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050b18] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-10">
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

          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            Loading seasons...
          </Card>
        </div>
      </div>
    </main>
  );
}
