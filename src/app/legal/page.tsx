import type { Metadata } from "next";
import { Scale } from "lucide-react";

import { SiteHeader } from "@/src/components/site-header";

export const metadata: Metadata = {
  title: "Legal & Disclaimers | LaneTips.app",
  description: "Riot Games disclaimer for LaneTips.app.",
};

const legalDisclaimers = [
  {
    id: "riot-games",
    provider: "Riot Games",
    relatedGames: ["League of Legends"],
    text: "LaneTips.app is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.",
  },
];

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-300">
            Legal
          </p>
          <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            Legal & Disclaimers
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Required notices for League of Legends and related provider
            disclaimers.
          </p>
        </div>

        <div className="grid gap-4">
          {legalDisclaimers.map((disclaimer) => (
            <section
              className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/80 shadow-xl shadow-black/20 ring-1 ring-white/5"
              key={disclaimer.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-200 ring-1 ring-white/10">
                    <Scale className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-mono text-lg font-semibold text-white">
                      {disclaimer.provider}
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      {disclaimer.relatedGames.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
              <p className="px-4 py-4 text-sm leading-6 text-zinc-300 sm:px-5">
                {disclaimer.text}
              </p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
