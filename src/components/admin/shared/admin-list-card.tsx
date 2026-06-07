import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export function AdminListCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">{children}</ul>
      </CardContent>
    </Card>
  );
}
