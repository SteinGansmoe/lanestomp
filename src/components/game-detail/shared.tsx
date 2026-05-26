import type { ReactNode } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

export function DetailSection({
  action,
  children,
  className,
  contentClassName,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  title: string;
}) {
  return (
    <Card
      className={cn(
        "border-white/10 bg-white/[0.035] text-white shadow-none ring-1 ring-white/5 backdrop-blur-md",
        className
      )}
    >
      <CardHeader className="gap-3 pb-3">
        <CardTitle className="font-mono text-lg font-semibold sm:text-xl">
          {title}
        </CardTitle>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function DetailActionLink({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition hover:text-violet-100"
      href={href}
    >
      {children}
    </a>
  );
}

export function DetailEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.025] p-6 text-sm leading-6 text-zinc-400">
      {message}
    </div>
  );
}
