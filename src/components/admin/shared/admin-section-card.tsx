import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

export function AdminSectionCard({
  count,
  href,
  label,
  summary,
}: {
  count: number;
  href: string;
  label: string;
  summary: string;
}) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xl font-semibold">{label}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{summary}</p>
        </div>
        <p className="font-mono text-3xl font-semibold text-violet-100">
          {count}
        </p>
      </div>
      <Button
        asChild
        className="mt-5 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
        variant="ghost"
      >
        <Link href={href} transitionTypes={["admin-section"]}>
          <Pencil className="size-3.5" aria-hidden="true" />
          Open section
        </Link>
      </Button>
    </Card>
  );
}
