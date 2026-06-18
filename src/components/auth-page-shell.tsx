import Image from "next/image";
import type { ReactNode } from "react";

import { SiteHeader } from "@/src/components/site-header";

type AuthPageShellProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

const authHighlights = ["Counter Pick ready", "Matchup guides", "Saved account tools"];

export function AuthPageShell({ children, description, eyebrow, title }: AuthPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b18] text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28rem),radial-gradient(circle_at_80%_12%,rgba(201,170,90,0.12),transparent_24rem),linear-gradient(180deg,#050b18,#07101f_40%,#050b18)]"
        aria-hidden="true"
      />
      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:ml-72 lg:max-w-[calc(100%-18rem)] lg:px-8 lg:py-6">
        <SiteHeader />

        <section className="grid min-h-[calc(100vh-13rem)] items-center gap-8 py-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,28rem)] lg:gap-10">
          <div className="min-w-0">
            <div className="relative mb-8 h-24 w-60 max-w-full">
              <Image
                alt="LaneStomp"
                className="object-contain object-left"
                fill
                priority
                sizes="240px"
                src="/images/lanestomp-logo.png"
              />
            </div>

            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/80">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-2xl font-mono text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {authHighlights.map((highlight) => (
                <span
                  className="rounded-md border border-cyan-300/15 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-medium text-cyan-100"
                  key={highlight}
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full min-w-0 justify-self-center lg:justify-self-end">{children}</div>
        </section>
      </section>
    </main>
  );
}
