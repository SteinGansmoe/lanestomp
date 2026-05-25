"use client";

import { type ReactNode, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

type AdminGroupedListGroup = {
  children: ReactNode;
  count: number;
  id: string;
  title: string;
};

type CollapsedGroups = Record<string, boolean>;

export function AdminGroupedListCard({
  emptyMessage,
  groups,
  storageKey,
  title,
}: {
  emptyMessage: string;
  groups: AdminGroupedListGroup[];
  storageKey: string;
  title: string;
}) {
  const [collapsedGroups, setCollapsedGroups] = useState<CollapsedGroups>({});

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      const storedValue = window.localStorage.getItem(storageKey);

      if (!storedValue) {
        return;
      }

      try {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (!parsedValue || typeof parsedValue !== "object") {
          return;
        }

        const nextCollapsedGroups: CollapsedGroups = {};

        for (const [groupId, isCollapsed] of Object.entries(parsedValue)) {
          nextCollapsedGroups[groupId] = Boolean(isCollapsed);
        }

        setCollapsedGroups(nextCollapsedGroups);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [storageKey]);

  function toggleGroup(groupId: string) {
    setCollapsedGroups((currentGroups) => {
      const nextGroups = {
        ...currentGroups,
        [groupId]: !currentGroups[groupId],
      };

      window.localStorage.setItem(storageKey, JSON.stringify(nextGroups));

      return nextGroups;
    });
  }

  return (
    <Card className="border-white/10 bg-[#10182b]/90 text-white shadow-xl shadow-black/15">
      <CardHeader>
        <CardTitle className="font-mono text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {groups.length > 0 ? (
          <ul className="space-y-4">
            {groups.map((group) => {
              const isCollapsed = Boolean(collapsedGroups[group.id]);
              const contentId = `${storageKey}-${group.id}`;

              return (
                <li
                  className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]"
                  key={group.id}
                >
                  <div
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors",
                      isCollapsed ? "" : "border-b border-white/10"
                    )}
                  >
                    <div>
                      <p className="font-semibold text-white">{group.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {group.count} {group.count === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <button
                      aria-controls={contentId}
                      aria-expanded={!isCollapsed}
                      aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${
                        group.title
                      }`}
                      className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      onClick={() => toggleGroup(group.id)}
                      type="button"
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isCollapsed ? "-rotate-90" : "rotate-0"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div
                    aria-hidden={isCollapsed}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                      isCollapsed
                        ? "pointer-events-none grid-rows-[0fr] opacity-0"
                        : "grid-rows-[1fr] opacity-100"
                    )}
                    id={contentId}
                    inert={isCollapsed ? true : undefined}
                  >
                    <div className="overflow-hidden">{group.children}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-zinc-400">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
