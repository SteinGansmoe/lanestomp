import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/src/lib/utils";

export const laneStompPageClassName =
  "relative isolate min-h-screen w-full max-w-full overflow-x-hidden bg-[#030914] text-[#AAB7C8]";

export const laneStompContentClassName =
  "relative z-10 mx-auto flex w-full max-w-[96rem] flex-col gap-6 px-4 pb-8 pt-4 sm:px-6 lg:px-8";

export const laneStompPanelClassName =
  "border border-cyan-100/15 bg-[#06111f]/88 text-zinc-100";

export const laneStompElevatedPanelClassName =
  "border border-cyan-100/20 bg-[#071321]/90 text-zinc-100";

export const laneStompSectionLabelClassName =
  "font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200";

export function LaneStompPageBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,24,40,0.7)_0%,rgba(3,9,20,0.64)_42%,rgba(1,5,13,0.98)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.3),transparent_18%,transparent_82%,rgba(0,0,0,0.34)),linear-gradient(180deg,rgba(5,18,30,0.24),transparent_28%,rgba(0,0,0,0.22)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='96' height='96' filter='url(%23n)' opacity='.34'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-x-[-12%] top-20 h-[54rem] opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(103,232,249,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,0.14) 1px, transparent 1px), linear-gradient(135deg, transparent 0 47%, rgba(103,232,249,0.1) 48% 49%, transparent 50% 100%)",
          backgroundSize: "88px 88px, 88px 88px, 176px 176px",
          maskImage:
            "linear-gradient(90deg, transparent, black 18%, black 72%, transparent), linear-gradient(180deg, transparent, black 14%, black 72%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 18%, black 72%, transparent), linear-gradient(180deg, transparent, black 14%, black 72%, transparent)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_18%,rgba(34,211,238,0.16),transparent_34rem),radial-gradient(ellipse_at_18%_28%,rgba(8,145,178,0.08),transparent_28rem),radial-gradient(ellipse_at_60%_82%,rgba(14,116,144,0.1),transparent_34rem)] blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_54%,rgba(0,0,0,0.34)_100%)]" />
    </div>
  );
}

export function LaneStompPageShell({
  children,
  className,
  contentClassName,
  ...props
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
} & Omit<ComponentProps<"main">, "children">) {
  return (
    <main className={cn(laneStompPageClassName, className)} {...props}>
      <LaneStompPageBackground />
      <section className={cn(laneStompContentClassName, contentClassName)}>{children}</section>
    </main>
  );
}
