import { Database } from "lucide-react";

import { Card } from "@/src/components/ui/card";
import { AdminSectionCard } from "./shared/admin-section-card";

function AdminStatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-white/10 bg-[#10182b]/90 p-5 text-white shadow-xl shadow-black/15">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-lg bg-sky-500/15 text-sky-200 ring-1 ring-sky-300/20">
          <Database className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="font-mono text-3xl font-semibold">{value}</p>
          <p className="text-sm text-zinc-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}

export function AdminOverview({
  gamesCount,
  leagueMatchupsCount,
  resourcesCount,
  seasonsCount,
  timelineEventsCount,
}: {
  gamesCount: number;
  leagueMatchupsCount: number;
  resourcesCount: number;
  seasonsCount: number;
  timelineEventsCount: number;
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-5">
        <AdminStatCard label="Games" value={gamesCount} />
        <AdminStatCard label="Seasons" value={seasonsCount} />
        <AdminStatCard label="Resources" value={resourcesCount} />
        <AdminStatCard label="Timeline" value={timelineEventsCount} />
        <AdminStatCard label="LoL matchups" value={leagueMatchupsCount} />
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <AdminSectionCard
          count={gamesCount}
          href="/admin/games"
          label="Manage games"
          summary="Create and edit game names, slugs, descriptions, and icons."
        />
        <AdminSectionCard
          count={seasonsCount}
          href="/admin/seasons"
          label="Manage seasons"
          summary="Create and edit season schedules, slugs, and descriptions."
        />
        <AdminSectionCard
          count={resourcesCount}
          href="/admin/resources"
          label="Manage resources"
          summary="Create and edit game detail resource cards."
        />
        <AdminSectionCard
          count={timelineEventsCount}
          href="/admin/timeline"
          label="Manage timeline"
          summary="Create and edit compact game timeline events."
        />
        <AdminSectionCard
          count={leagueMatchupsCount}
          href="/admin/league/matchups"
          label="Manage League"
          summary="Create and edit structured League matchup guidance."
        />
      </div>
    </>
  );
}
