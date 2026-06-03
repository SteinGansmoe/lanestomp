import { BookOpen, CalendarDays } from "lucide-react";
import type { ReactNode } from "react";

import { SiteHeader } from "@/src/components/site-header";

type LegalSection = {
  body: ReactNode;
  title: string;
};

export function LegalPageShell({
  children,
  description,
  eyebrow = "Legal",
  lastUpdated,
  sections,
  title,
}: {
  children?: ReactNode;
  description: string;
  eyebrow?: string;
  lastUpdated: string;
  sections: LegalSection[];
  title: string;
}) {
  return (
    <main className="min-h-screen bg-[#050b18] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <header className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b] shadow-2xl shadow-black/25">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_28rem),radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_30rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.92))] p-5 sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-mono text-3xl font-semibold tracking-normal text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
              {description}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300">
              <CalendarDays className="size-4 text-cyan-200" aria-hidden="true" />
              Last updated: {lastUpdated}
            </p>
          </div>
        </header>

        {children}

        <div className="grid gap-4">
          {sections.map((section) => (
            <section
              className="overflow-hidden rounded-lg border border-white/10 bg-[#10182b]/80 shadow-xl shadow-black/20 ring-1 ring-white/5"
              key={section.title}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-200 ring-1 ring-white/10">
                  <BookOpen className="size-5" aria-hidden="true" />
                </div>
                <h2 className="font-mono text-lg font-semibold text-white">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-3 px-4 py-4 text-sm leading-6 text-zinc-300 sm:px-5">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
