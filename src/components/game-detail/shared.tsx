import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export function DetailSection({
  action,
  children,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  title: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader className="flex-row items-center justify-between gap-4">
        <CardTitle className="font-mono text-xl font-semibold">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
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
    <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-zinc-400">
      {message}
    </div>
  );
}
