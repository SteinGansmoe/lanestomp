import Link from "next/link";

import type { AdminSection } from "./types";
import { cn } from "@/src/lib/utils";

type AdminNavItem =
  | {
      href: string;
      label: string;
      section: AdminSection;
      status?: never;
    }
  | {
      href?: never;
      label: string;
      section?: never;
      status: "planned";
    }
  | {
      href: string;
      label: string;
      section?: never;
      status: "inside";
    };

const adminNavGroups: Array<{
  items: AdminNavItem[];
  label: string;
}> = [
  {
    label: "League",
    items: [
      {
        href: "/admin/league/matchups",
        label: "Matchups",
        section: "league-matchups",
      },
      {
        href: "/admin/league/counter-picks",
        label: "Counter Picks",
        section: "league-counter-picks",
      },
      { label: "Champions", status: "planned" },
      {
        href: "/admin/league/matchups",
        label: "Generation queue",
        status: "inside",
      },
      {
        href: "/admin/league/matchups",
        label: "Coverage / Review",
        status: "inside",
      },
    ],
  },
  {
    label: "Users",
    items: [
      { label: "Accounts", status: "planned" },
      { label: "Riot connections", status: "planned" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/resources", label: "Resources", section: "resources" },
      { label: "Guides", status: "planned" },
      {
        href: "/admin/community",
        label: "Community",
        section: "community",
      },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin", label: "Overview", section: "overview" },
      { href: "/admin/games", label: "Games", section: "games" },
      { href: "/admin/seasons", label: "Seasons", section: "seasons" },
      { href: "/admin/timeline", label: "Timeline", section: "timeline" },
    ],
  },
];

export function AdminNavigation({ activeSection }: { activeSection: AdminSection }) {
  return (
    <nav
      className="grid gap-4 rounded-lg border border-white/10 bg-[#10182b]/70 p-4 md:grid-cols-2 xl:grid-cols-4"
      aria-label="Admin sections"
    >
      {adminNavGroups.map((group) => (
        <div className="space-y-2" key={group.label}>
          <p className="px-1 text-xs font-semibold uppercase text-zinc-500">{group.label}</p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => {
              if (item.status === "planned") {
                return (
                  <span
                    aria-disabled="true"
                    className="inline-flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.025] px-3 py-2 text-sm text-zinc-600"
                    key={`${group.label}-${item.label}`}
                  >
                    {item.label}
                    <span className="text-[0.65rem] uppercase text-zinc-700">Future</span>
                  </span>
                );
              }

              const isActive =
                item.section === activeSection ||
                (item.status === "inside" && activeSection === "league-matchups");

              return (
                <Link
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition",
                    isActive
                      ? "border-violet-300/30 bg-violet-500/30 text-violet-100"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
                  )}
                  href={item.href}
                  key={`${group.label}-${item.label}`}
                  transitionTypes={["admin-section"]}
                >
                  {item.label}
                  {item.status === "inside" ? (
                    <span className="ml-2 text-[0.65rem] uppercase opacity-70">Inside</span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
