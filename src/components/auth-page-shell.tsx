import Image from "next/image";
import type { ReactNode } from "react";

import {
  LaneStompPageBackground,
  laneStompContentClassName,
  laneStompPageClassName,
} from "@/src/components/lane-stomp-page";
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
    <main className={laneStompPageClassName}>
      <LaneStompPageBackground />
      <section className={laneStompContentClassName}>
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
                  className="rounded border border-cyan-300/15 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-medium text-cyan-100"
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
