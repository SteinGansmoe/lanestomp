import { Swords } from "lucide-react";

import { Card } from "@/src/components/ui/card";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <div className="h-24 rounded-lg border border-white/10 bg-[#10182b]/70" />

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

        <Card className="border-white/10 bg-[#10182b]/90 p-8 text-center text-zinc-300">
          Loading LaneStomp...
        </Card>
      </section>
    </main>
  );
}
