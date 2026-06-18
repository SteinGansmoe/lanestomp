import Link from "next/link";
import { BookOpen, CalendarDays, Scale } from "lucide-react";
import type { ReactNode } from "react";

import { LaneStompPageShell } from "@/src/components/lane-stomp-page";
import { SiteHeader } from "@/src/components/site-header";

type LegalSection = {
  body: ReactNode;
  title: string;
};

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/legal", label: "Legal" },
];

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
    <LaneStompPageShell>
        <SiteHeader />

        <header className="overflow-hidden border border-cyan-100/15 bg-[#06111f]/88">
          <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_28rem),radial-gradient(circle_at_85%_0%,rgba(201,170,90,0.14),transparent_26rem),linear-gradient(135deg,rgba(8,17,32,0.98),rgba(11,18,32,0.92))] p-5 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
                  {eyebrow}
                </p>
                <h1 className="mt-3 font-mono text-3xl font-semibold tracking-normal text-white sm:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
                  {description}
                </p>
              </div>
              <p className="inline-flex w-fit items-center gap-2 rounded border border-cyan-300/15 bg-cyan-400/[0.07] px-3 py-2 text-sm text-cyan-50">
                <CalendarDays className="size-4 text-cyan-200" aria-hidden="true" />
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </header>

        {children}

        <div className="grid gap-5 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
          <aside className="border border-cyan-100/15 bg-[#06111f]/80 p-4 lg:sticky lg:top-6">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                <Scale className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">
                  On this page
                </p>
                <p className="mt-1 text-xs text-zinc-500">Legal documents</p>
              </div>
            </div>

            <nav className="mt-4 grid gap-1 text-sm" aria-label={`${title} sections`}>
              {sections.map((section) => (
                <a
                  className="rounded px-2 py-1.5 text-zinc-400 transition hover:bg-cyan-400/[0.06] hover:text-cyan-100"
                  href={`#${getSectionId(section.title)}`}
                  key={section.title}
                >
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500">
                Related
              </p>
              <div className="mt-2 flex flex-wrap gap-2 lg:grid">
                {legalLinks.map((link) => (
                  <Link
                    className="rounded border border-cyan-100/15 bg-cyan-400/[0.035] px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-cyan-300/30 hover:text-cyan-100"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="grid min-w-0 gap-4">
            {sections.map((section) => (
              <section
                className="scroll-mt-6 overflow-hidden border border-cyan-100/15 bg-[#06111f]/80"
                id={getSectionId(section.title)}
                key={section.title}
              >
                <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                    <BookOpen className="size-5" aria-hidden="true" />
                  </div>
                  <h2 className="font-mono text-lg font-semibold text-white">{section.title}</h2>
                </div>
                <div className="space-y-3 px-4 py-4 text-sm leading-6 text-zinc-300 sm:px-5">
                  {section.body}
                </div>
              </section>
            ))}
          </div>
        </div>
    </LaneStompPageShell>
  );
}

function getSectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
