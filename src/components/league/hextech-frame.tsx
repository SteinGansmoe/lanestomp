import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

export function HextechFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative border border-cyan-300/35 shadow-[inset_0_0_34px_rgba(34,211,238,0.08),0_0_36px_rgba(34,211,238,0.1)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 border border-cyan-100/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.86),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-0 z-20 h-px bg-[linear-gradient(90deg,transparent,rgba(103,232,249,0.72),transparent)]"
      />

      {["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"].map(
        (position) => {
          const isRight = position.includes("right");
          const isBottom = position.includes("bottom");

          return (
            <div
              aria-hidden="true"
              className={cn("pointer-events-none absolute z-30 size-16", position)}
              key={position}
            >
              <span
                className={cn(
                  "absolute h-px w-16 bg-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.72)]",
                  isBottom ? "bottom-0" : "top-0",
                  isRight ? "right-0" : "left-0",
                )}
              />
              <span
                className={cn(
                  "absolute h-16 w-px bg-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.72)]",
                  isBottom ? "bottom-0" : "top-0",
                  isRight ? "right-0" : "left-0",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-8 bg-[#C9AA5A]/80",
                  isBottom ? "bottom-3" : "top-3",
                  isRight ? "right-3" : "left-3",
                )}
              />
            </div>
          );
        },
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 z-30 h-7 w-36 -translate-x-1/2"
      >
        <span className="absolute left-0 top-0 h-px w-12 bg-cyan-200/80" />
        <span className="absolute right-0 top-0 h-px w-12 bg-cyan-200/80" />
        <span className="absolute left-1/2 top-0 size-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-cyan-200/80 bg-[#06111f] shadow-[0_0_18px_rgba(34,211,238,0.58)]" />
        <span className="absolute left-1/2 top-3 h-px w-20 -translate-x-1/2 bg-[#C9AA5A]/55" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-30 h-7 w-36 -translate-x-1/2"
      >
        <span className="absolute bottom-0 left-0 h-px w-12 bg-cyan-200/70" />
        <span className="absolute bottom-0 right-0 h-px w-12 bg-cyan-200/70" />
        <span className="absolute bottom-0 left-1/2 size-4 -translate-x-1/2 translate-y-1/2 rotate-45 border border-cyan-200/75 bg-[#06111f] shadow-[0_0_18px_rgba(34,211,238,0.5)]" />
        <span className="absolute bottom-3 left-1/2 h-px w-20 -translate-x-1/2 bg-[#C9AA5A]/45" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 z-30 hidden h-48 w-5 -translate-y-1/2 lg:block"
      >
        <span className="absolute left-0 top-0 h-16 w-px bg-[linear-gradient(180deg,transparent,rgba(103,232,249,0.82))]" />
        <span className="absolute left-0 bottom-0 h-16 w-px bg-[linear-gradient(0deg,transparent,rgba(103,232,249,0.82))]" />
        <span className="absolute left-0 top-1/2 h-10 w-px -translate-y-1/2 bg-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.7)]" />
        <span className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-[#C9AA5A]/70" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 z-30 hidden h-48 w-5 -translate-y-1/2 lg:block"
      >
        <span className="absolute right-0 top-0 h-16 w-px bg-[linear-gradient(180deg,transparent,rgba(103,232,249,0.82))]" />
        <span className="absolute bottom-0 right-0 h-16 w-px bg-[linear-gradient(0deg,transparent,rgba(103,232,249,0.82))]" />
        <span className="absolute right-0 top-1/2 h-10 w-px -translate-y-1/2 bg-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.7)]" />
        <span className="absolute right-0 top-1/2 h-px w-5 -translate-y-1/2 bg-[#C9AA5A]/70" />
      </div>

      {children}
    </section>
  );
}
