import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

export const skeletonPulseClassName = "motion-safe:animate-pulse motion-reduce:animate-none";

export const skeletonSurfaceClassName =
  "border border-cyan-100/15 bg-[#06111f]/88 shadow-[inset_0_0_24px_rgba(34,211,238,0.025)]";

export const skeletonRaisedSurfaceClassName =
  "border border-cyan-100/20 bg-[#071321]/82 shadow-[0_18px_44px_rgba(0,0,0,0.18),inset_0_0_20px_rgba(34,211,238,0.025)]";

export function SkeletonBlock({
  className,
  tone = "base",
}: {
  className?: string;
  tone?: "base" | "raised" | "cyan" | "gold" | "danger";
}) {
  const toneClassName = {
    base: "border-cyan-100/12 bg-white/[0.045]",
    cyan: "border-cyan-300/18 bg-cyan-400/[0.075]",
    danger: "border-rose-300/16 bg-rose-400/[0.07]",
    gold: "border-[#C9AA5A]/18 bg-[#C9AA5A]/[0.08]",
    raised: "border-cyan-100/16 bg-white/[0.065]",
  }[tone];

  return (
    <span
      aria-hidden="true"
      className={cn("block border", skeletonPulseClassName, toneClassName, className)}
    />
  );
}

export function SkeletonLine({
  className,
  tone = "base",
}: {
  className?: string;
  tone?: "base" | "raised" | "cyan" | "gold" | "danger";
}) {
  return <SkeletonBlock className={cn("h-3", className)} tone={tone} />;
}

export function SkeletonHeading({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("h-8", className)} tone="raised" />;
}

export function SkeletonField({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("h-12", className)} />;
}

export function SkeletonButton({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("h-11 w-44", className)} tone="cyan" />;
}

export function SkeletonIconSquare({ className, tone = "cyan" }: { className?: string; tone?: "cyan" | "gold" | "base" }) {
  return <SkeletonBlock className={cn("size-12 shrink-0", className)} tone={tone} />;
}

export function SkeletonChampionPortrait({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("size-16 shrink-0", className)} tone="raised" />;
}

export function SkeletonPanel({
  children,
  className,
  raised = false,
}: {
  children?: ReactNode;
  className?: string;
  raised?: boolean;
}) {
  return (
    <section
      aria-hidden="true"
      className={cn(raised ? skeletonRaisedSurfaceClassName : skeletonSurfaceClassName, className)}
    >
      {children}
    </section>
  );
}

export function SkeletonSectionLabel({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)} aria-hidden="true">
      <SkeletonLine className="h-3 w-28" tone="cyan" />
      <span className="hidden h-px w-24 bg-cyan-200/24 sm:block" />
      <span className="hidden size-1.5 rotate-45 border border-cyan-300/45 bg-cyan-300/10 sm:block" />
    </div>
  );
}

export function SkeletonStatCell({ className }: { className?: string }) {
  return (
    <div className={cn("border-cyan-100/10 px-4 py-3 sm:border-l", className)}>
      <SkeletonLine className="w-20" />
      <SkeletonLine className="mt-3 h-5 w-28" tone="raised" />
    </div>
  );
}

export function SkeletonResultRow({ className, tone = "cyan" }: { className?: string; tone?: "cyan" | "danger" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid min-h-[9rem] gap-4 border bg-[#06111f]/70 p-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-4",
        tone === "cyan" ? "border-cyan-300/16" : "border-rose-300/16",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <SkeletonLine className="mt-5 h-4 w-4" tone={tone === "cyan" ? "cyan" : "danger"} />
        <SkeletonChampionPortrait className="size-12 sm:size-14" />
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <SkeletonLine className="h-5 w-32" tone="raised" />
            <SkeletonLine className="mt-3 h-5 w-56 max-w-full" tone="gold" />
          </div>
          <SkeletonBlock className="mt-2 size-3 rounded-full border-cyan-300/20 bg-cyan-200/10" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="grid gap-2" key={index}>
              <SkeletonLine className="h-4 w-16" tone="raised" />
              <SkeletonLine className="h-2 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
