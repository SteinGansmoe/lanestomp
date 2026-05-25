import Link from "next/link";

import type { AdminSection } from "./types";

export function AdminNavigation({ activeSection }: { activeSection: AdminSection }) {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Admin sections">
      {[
        { href: "/admin", label: "Overview", section: "overview" },
        { href: "/admin/games", label: "Games", section: "games" },
        { href: "/admin/seasons", label: "Seasons", section: "seasons" },
        { href: "/admin/resources", label: "Resources", section: "resources" },
        { href: "/admin/timeline", label: "Timeline", section: "timeline" },
      ].map((item) => {
        const isActive = item.section === activeSection;

        return (
          <Link
            className={`rounded-md border px-4 py-2 text-sm transition ${
              isActive
                ? "border-violet-300/30 bg-violet-500/30 text-violet-100"
                : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            }`}
            href={item.href}
            key={item.href}
            transitionTypes={["admin-section"]}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
