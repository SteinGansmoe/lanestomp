import type { ComponentProps } from "react";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { cn } from "@/src/lib/utils";

export const navigationPillClassName =
  "inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#10182b]/85 px-4 py-2 text-sm font-medium text-zinc-100 shadow-lg shadow-black/10 transition-colors hover:border-cyan-500/50 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050b18]";

type BackButtonProps = Omit<ComponentProps<typeof Link>, "children"> & {
  icon?: LucideIcon;
  label: string;
};

export function BackButton({
  className,
  icon: Icon = ArrowLeft,
  label,
  ...props
}: BackButtonProps) {
  return (
    <Link
      className={cn(
        navigationPillClassName,
        className
      )}
      {...props}
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
