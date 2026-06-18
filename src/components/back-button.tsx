import type { ComponentProps } from "react";
import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { cn } from "@/src/lib/utils";

export const navigationPillClassName =
  "inline-flex w-fit items-center gap-2 rounded border border-cyan-100/15 bg-[#06111f]/85 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-cyan-300/40 hover:bg-cyan-400/[0.08] hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/55";

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
    <Link className={cn(navigationPillClassName, className)} {...props}>
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}
