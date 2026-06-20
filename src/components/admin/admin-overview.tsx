import type { ReactNode } from "react";
import { Database } from "lucide-react";

import { Card } from "@/src/components/ui/card";
import { AdminSectionCard } from "./shared/admin-section-card";

function AdminStatCard({
  label,
  tone = "default",
  value,
}: {
  label: string;
  tone?: "default" | "primary";
  value: number;
}) {
  return (
    <Card
      className={`border-white/10 p-5 text-white shadow-xl shadow-black/15 ${
        tone === "primary" ? "bg-cyan-500/10" : "bg-[#10182b]/90"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex size-11 items-center justify-center rounded-lg ring-1 ${
            tone === "primary"
              ? "bg-cyan-400/15 text-cyan-100 ring-cyan-300/20"
              : "bg-sky-500/15 text-sky-200 ring-sky-300/20"
          }`}
        >
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

function AdminProductArea({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-mono text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function AdminOverview({
  communityContentCount,
  leagueChampionsCount,
  leagueCounterPicksCount,
  leagueDraftMatchupsCount,
  leagueMatchupsCount,
  leagueReviewedMatchupsCount,
  resourcesCount,
}: {
  communityContentCount: number;
  leagueChampionsCount: number;
  leagueCounterPicksCount: number;
  leagueDraftMatchupsCount: number;
  leagueMatchupsCount: number;
  leagueReviewedMatchupsCount: number;
  resourcesCount: number;
}) {
  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-4">
        <AdminStatCard label="League matchups" tone="primary" value={leagueMatchupsCount} />
        <AdminStatCard label="Champions" value={leagueChampionsCount} />
        <AdminStatCard label="Draft matchups" value={leagueDraftMatchupsCount} />
        <AdminStatCard label="Reviewed matchups" value={leagueReviewedMatchupsCount} />
      </div>

      <AdminProductArea
        title="League"
        description="Primary workspace for the actively developed LaneStomp matchup tool and the League-specific systems that will grow around it."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AdminSectionCard
            actionLabel="Open matchups"
            count={leagueMatchupsCount}
            eyebrow="Active"
            href="/admin/league/matchups"
            label="Matchups"
            summary="Create, generate, review, and publish champion matchup guidance."
            tag="records"
          />
          <AdminSectionCard
            actionLabel="Open counters"
            count={leagueCounterPicksCount}
            eyebrow="Active"
            href="/admin/league/counter-picks"
            label="Counter Picks"
            summary="Create, edit, review, and publish counter pick recommendations."
            tag="records"
          />
          <AdminSectionCard
            count={leagueChampionsCount}
            eyebrow="Next"
            label="Champions"
            summary="Future home for champion coverage, metadata, and combat profile upkeep."
            tag="loaded"
          />
          <AdminSectionCard
            count={leagueDraftMatchupsCount}
            eyebrow="Inside matchups"
            href="/admin/league/matchups"
            label="Generation queue"
            summary="Batch-generate missing drafts and continue queue work from the matchup manager."
            tag="drafts"
          />
          <AdminSectionCard
            count={leagueReviewedMatchupsCount}
            eyebrow="Inside matchups"
            href="/admin/league/matchups"
            label="Coverage / review"
            summary="Track reviewed coverage by champion and lane before new lane expansion."
            tag="reviewed"
          />
        </div>
      </AdminProductArea>

      <AdminProductArea
        title="Users"
        description="Account and Riot identity tooling will live here as the League experience becomes more personalized."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <AdminSectionCard
            count={0}
            label="Accounts"
            muted
            summary="Future admin view for user account support and moderation workflows."
          />
          <AdminSectionCard
            count={0}
            label="Riot connections"
            muted
            summary="Future workspace for linked Riot accounts, regions, and player-facing integrations."
          />
        </div>
      </AdminProductArea>

      <AdminProductArea
        title="Content"
        description="Editorial and community surfaces that support game detail pages and future League learning material."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <AdminSectionCard
            count={resourcesCount}
            href="/admin/resources"
            label="Resources"
            muted
            summary="Maintain resource cards shown on game detail pages."
            tag="active"
          />
          <AdminSectionCard
            count={0}
            label="Guides"
            muted
            summary="Future home for authored League guides and structured learning content."
          />
          <AdminSectionCard
            count={communityContentCount}
            href="/admin/community"
            label="Community content"
            muted
            summary="Maintain community links without making them the dashboard focus."
            tag="active"
          />
        </div>
      </AdminProductArea>
    </div>
  );
}
