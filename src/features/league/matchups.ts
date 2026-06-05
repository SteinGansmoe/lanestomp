import { supabase } from "@/src/lib/supabase";

import type { LeagueChampion } from "./champions";
import { isChampionInRole } from "./champion-roles";
import { leagueRoles, type LeagueRole } from "./roles";

export type LeagueMatchup = {
  champion_a_id: string;
  champion_b_id: string;
  generation_status: "draft" | "failed" | "reviewed";
  role: LeagueRole;
  overview: string | null;
  early_game: string | null;
  trading_pattern: string | null;
  power_spikes: string | null;
  danger_windows: string | null;
  win_conditions: string | null;
  difficulty_rating: number | null;
  confidence_level: string | null;
  id: number;
  updated_at: string | null;
};

export type LeagueMatchupResult = {
  error: string | null;
  matchup: LeagueMatchup | null;
};

export type LeagueMatchupCoverage = {
  generatedCount: number;
  percentComplete: number;
  roleChampionCount: number;
  totalCount: number;
};

export type LeagueMatchupCoverageResult = {
  coverage: LeagueMatchupCoverage;
  error: string | null;
};

export type LeagueMatchupCoverageScope = LeagueRole | "all";

export type LeagueMatchupCoverageSummary = Record<
  LeagueMatchupCoverageScope,
  LeagueMatchupCoverage
>;

export type LeagueMatchupCoverageSummaryResult = {
  coverage: LeagueMatchupCoverageSummary;
  error: string | null;
};

type GetLeagueMatchupInput = {
  championAId: string;
  championBId: string;
  role: LeagueRole;
};

type GetLeagueMatchupCoverageInput = {
  champions: LeagueChampion[];
  role: LeagueRole;
};

export async function getLeagueMatchup({
  championAId,
  championBId,
  role,
}: GetLeagueMatchupInput): Promise<LeagueMatchupResult> {
  if (!supabase) {
    return {
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      matchup: null,
    };
  }

  const { data, error } = await supabase
    .from("league_matchups")
    .select(
      [
        "champion_a_id",
        "champion_b_id",
        "generation_status",
        "role",
        "overview",
        "early_game",
        "trading_pattern",
        "power_spikes",
        "danger_windows",
        "win_conditions",
        "difficulty_rating",
        "confidence_level",
        "id",
        "updated_at",
      ].join(", ")
    )
    .eq("champion_a_id", championAId)
    .eq("champion_b_id", championBId)
    .eq("role", role)
    .eq("generation_status", "reviewed")
    .maybeSingle<LeagueMatchup>();

  if (error) {
    return {
      error: error.message,
      matchup: null,
    };
  }

  return {
    error: null,
    matchup: data,
  };
}

export async function getLeagueMatchupCoverage({
  champions,
  role,
}: GetLeagueMatchupCoverageInput): Promise<LeagueMatchupCoverageResult> {
  const roleChampions = champions.filter((champion) =>
    isChampionInRole(champion, role)
  );
  const totalCount = roleChampions.length * Math.max(roleChampions.length - 1, 0);
  const emptyCoverage = {
    generatedCount: 0,
    percentComplete: 0,
    roleChampionCount: roleChampions.length,
    totalCount,
  };

  if (!supabase || totalCount === 0) {
    return {
      coverage: emptyCoverage,
      error: supabase
        ? null
        : "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const { count, error } = await supabase
    .from("league_matchups")
    .select("id", { count: "exact", head: true })
    .eq("role", role)
    .eq("generation_status", "reviewed");

  if (error) {
    return {
      coverage: emptyCoverage,
      error: error.message,
    };
  }

  const generatedCount = Math.min(count ?? 0, totalCount);

  return {
    coverage: {
      generatedCount,
      percentComplete:
        totalCount > 0 ? Math.round((generatedCount / totalCount) * 100) : 0,
      roleChampionCount: roleChampions.length,
      totalCount,
    },
    error: null,
  };
}

export async function getLeagueMatchupCoverageSummary(
  champions: LeagueChampion[]
): Promise<LeagueMatchupCoverageSummaryResult> {
  const emptyCoverageByRole = getEmptyCoverageSummary(champions);

  if (!supabase) {
    return {
      coverage: emptyCoverageByRole,
      error:
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const supabaseClient = supabase;
  const roleCounts = await Promise.all(
    leagueRoles.map(async (role) => {
      const { count, error } = await supabaseClient
        .from("league_matchups")
        .select("id", { count: "exact", head: true })
        .eq("role", role)
        .eq("generation_status", "reviewed");

      return {
        count: count ?? 0,
        error,
        role,
      };
    })
  );
  const firstError = roleCounts.find((result) => result.error)?.error;

  if (firstError) {
    return {
      coverage: emptyCoverageByRole,
      error: firstError.message,
    };
  }

  const coverage = { ...emptyCoverageByRole };

  for (const { count, role } of roleCounts) {
    const roleCoverage = coverage[role];
    const generatedCount = Math.min(count, roleCoverage.totalCount);

    coverage[role] = {
      ...roleCoverage,
      generatedCount,
      percentComplete:
        roleCoverage.totalCount > 0
          ? Math.round((generatedCount / roleCoverage.totalCount) * 100)
          : 0,
    };
  }

  const totalGeneratedCount = leagueRoles.reduce(
    (sum, role) => sum + coverage[role].generatedCount,
    0
  );
  const totalPossibleCount = leagueRoles.reduce(
    (sum, role) => sum + coverage[role].totalCount,
    0
  );

  coverage.all = {
    generatedCount: totalGeneratedCount,
    percentComplete:
      totalPossibleCount > 0
        ? Math.round((totalGeneratedCount / totalPossibleCount) * 100)
        : 0,
    roleChampionCount: champions.length,
    totalCount: totalPossibleCount,
  };

  return {
    coverage,
    error: null,
  };
}

function getEmptyCoverageSummary(
  champions: LeagueChampion[]
): LeagueMatchupCoverageSummary {
  const roleCoverageEntries = leagueRoles.map((role) => {
    const roleChampions = champions.filter((champion) =>
      isChampionInRole(champion, role)
    );
    const totalCount =
      roleChampions.length * Math.max(roleChampions.length - 1, 0);

    return [
      role,
      {
        generatedCount: 0,
        percentComplete: 0,
        roleChampionCount: roleChampions.length,
        totalCount,
      },
    ] as const;
  });
  const roleCoverage = Object.fromEntries(roleCoverageEntries) as Record<
    LeagueRole,
    LeagueMatchupCoverage
  >;
  const totalCount = leagueRoles.reduce(
    (sum, role) => sum + roleCoverage[role].totalCount,
    0
  );

  return {
    ...roleCoverage,
    all: {
      generatedCount: 0,
      percentComplete: 0,
      roleChampionCount: champions.length,
      totalCount,
    },
  };
}
