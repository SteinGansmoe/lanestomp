import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { SiteHeader } from "@/src/components/site-header";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for LaneStomp.",
};

const termsSections = [
  {
    title: "Use of LaneStomp",
    text: "LaneStomp is a League of Legends learning and matchup preparation tool. Use it to study champion matchups, improve champion pools, and plan your climb.",
  },
  {
    title: "Fan-Made Product",
    text: "LaneStomp is an independent fan-made product and is not endorsed by Riot Games. Riot Games owns League of Legends and related Riot properties.",
  },
  {
    title: "Content Accuracy",
    text: "Matchup guidance is intended as practical learning support. League patches, champion balance, and player skill can change how any matchup plays out.",
  },
  {
    title: "Account Responsibility",
    text: "You are responsible for keeping your account access secure and for using LaneStomp in a respectful way.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet-300">
            Legal
          </p>
          <h1 className="mt-2 font-mono text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            Terms of Use
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            The baseline terms for using LaneStomp as a League matchup learning
            and improvement platform.
          </p>
        </div>

        <div className="grid gap-4">
          {termsSections.map((section) => (
            <section
              className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/80 shadow-xl shadow-black/20 ring-1 ring-white/5"
              key={section.title}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-200 ring-1 ring-white/10">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <h2 className="font-mono text-lg font-semibold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="px-4 py-4 text-sm leading-6 text-zinc-300 sm:px-5">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
