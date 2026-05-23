import { Gamepad2 } from "lucide-react";

import { Card } from "@/src/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-10">
        <div className="h-24 rounded-lg border border-white/10 bg-[#10182b]/70" />

        <div>
          <div className="h-9 w-48 rounded bg-white/10" />
          <div className="mt-3 h-5 w-full max-w-xl rounded bg-white/5" />
        </div>

        <div className="grid overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/70 text-white shadow-xl shadow-black/20 ring-1 ring-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="flex min-h-16 items-center gap-3 border-white/10 px-4 py-3 sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0"
              key={index}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-200 ring-1 ring-white/10">
                <Gamepad2 className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-5 w-12 rounded bg-white/10" />
                <div className="mt-2 h-3 w-24 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>

        <section className="space-y-4">
          <div className="h-7 w-44 rounded bg-white/10" />
          <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
            Loading games from Supabase...
          </Card>
        </section>
      </section>
    </main>
  );
}
