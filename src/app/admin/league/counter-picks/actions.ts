"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  RiotIdResolverInput,
  RiotIdResolverResult,
  RiotIdResolverRow,
  RiotSeedCandidateGroupedQueryInput,
  RiotSeedCandidateGroupedResult,
  RiotSeedCandidateFilters,
  RiotSeedCandidateRankRefreshInput,
  RiotSeedCandidateRankRefreshResult,
  RiotSeedCandidateSort,
  RiotSeedCandidatesResult,
  RiotSeedCandidateView,
  RiotScanDiscoveryResult,
  RiotScanJobResult,
  RiotScanJobsResult,
  RiotScanJobView,
  RiotScanMode,
  RiotScanStatus,
  RiotScanSummary,
  RiotScanTargetResult,
  StartRiotScanJobInput,
} from "@/src/features/league/riot-scan-jobs";
import {
  getRiotSeedCandidateTotalPages,
  normalizeRiotSeedCandidatePage,
  normalizeRiotSeedCandidatePageSize,
  riotSeedCandidateRankGroupIds,
  riotSeedCandidateRankGroupsById,
  sortRiotSeedCandidateRows,
  type PaginatedSeedCandidates,
  type RiotSeedCandidateRankGroupId,
} from "@/src/features/league/riot-seed-candidate-rank-groups";
import type { LeagueRole } from "@/src/features/league/roles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const maxMatchCount = 50;
const maxDisplayedResultsLimit = 100;
const maxRiotIdsPerBatch = 20;
const maxSeedCandidatesPerScan = 20;
const maxSeedCandidateRankRefreshBatch = 20;
const recentSeedCandidateScanHours = 24;
const recentSeedCandidateRankRefreshHours = 24;
const defaultRegionalRoute = "europe";
const defaultPlatformRegion = "EUW1";
const maxWarningOnlyPersistenceFailureCount = 5;
const maxWarningOnlyPersistenceFailureRate = 0.01;
const riotScanJobSelect =
  "id, mode, status, role, seed_puuids, enemy_champion, counter_champion, focus_champion_id, match_count, minimum_games, progress, summary, results, error_message, created_at, started_at, completed_at";
const riotSeedCandidateSelect = [
  "id",
  "puuid",
  "platform_region",
  "regional_routing",
  "source",
  "status",
  "first_seen_match_id",
  "first_seen_scan_job_id",
  "first_seen_at",
  "last_seen_at",
  "observed_games",
  "estimated_primary_role",
  "estimated_secondary_role",
  "primary_role_share",
  "secondary_role_share",
  "primary_champion",
  "primary_champion_role",
  "primary_champion_games",
  "primary_champion_share",
  "rank_queue_type",
  "rank_tier",
  "rank_division",
  "rank_league_points",
  "rank_wins",
  "rank_losses",
  "rank_win_rate",
  "rank_hot_streak",
  "rank_veteran",
  "rank_fresh_blood",
  "rank_inactive",
  "ranked_at",
  "rank_last_attempted_at",
  "rank_last_success_at",
  "rank_next_eligible_at",
  "rank_enrichment_status",
  "rank_enrichment_error_code",
  "rank_enrichment_error_message",
  "rank_enrichment_attempts",
  "rank_enrichment_failures",
  "role_distribution",
  "top_champions",
  "last_profiled_at",
  "last_scanned_at",
  "next_eligible_scan_at",
  "times_scanned",
  "successful_scan_count",
  "failed_scan_count",
  "consecutive_scan_failures",
  "latest_match_seen_at",
  "created_at",
].join(", ");

type AuthorizedClientResult =
  | {
      ok: true;
      userId: string;
    }
  | {
      error: string;
      ok: false;
    };

type RiotScanJobRow = {
  completed_at: string | null;
  counter_champion: string | null;
  created_at: string;
  enemy_champion: string | null;
  error_message: string | null;
  focus_champion_id: string | null;
  id: number;
  match_count: number;
  minimum_games: number;
  mode: RiotScanMode;
  progress: RiotScanSummary | null;
  results: RiotScanDiscoveryResult[] | RiotScanTargetResult | null;
  role: LeagueRole;
  seed_puuids: string[] | null;
  started_at: string | null;
  status: RiotScanStatus;
  summary: RiotScanSummary | null;
};

export type LeagueChampionRegistryAdminStatusResult =
  | {
      ok: true;
      status: {
        activeDatabaseChampionCount: number;
        conflictCount: number;
        conflicts: string[];
        databaseChampionCount: number;
        inactiveReturnedByRiotCount: number;
        inactiveReturnedByRiot: string[];
        lastSyncedAt: string | null;
        lastSyncError: string | null;
        lastSyncStatus: string;
        missing: string[];
        missingCount: number;
        nameMismatchCount: number;
        nameMismatches: string[];
        registryOk: boolean;
        sourceChampionCount: number;
        sourceVersion: string;
        unknown: string[];
        unknownCount: number;
      };
    }
  | {
      error: string;
      ok: false;
    };

export async function startRiotScanJob(input: StartRiotScanJobInput): Promise<RiotScanJobResult> {
  const authResult = await getAuthorizedAdmin(input.accessToken, "run Riot match scans");

  if (!authResult.ok) {
    return authResult;
  }

  const serviceClientResult = getServiceSupabaseClient();

  if (!serviceClientResult.ok) {
    return serviceClientResult;
  }

  const registryResult = await loadChampionRegistry(serviceClientResult.supabase);

  if (!registryResult.ok) {
    return registryResult;
  }

  const validation = validateStartInput(
    input,
    registryResult.registry,
    registryResult.normalizeChampionIdentifier,
  );

  if (!validation.ok) {
    return validation;
  }

  const { data: insertedJob, error: insertError } = await serviceClientResult.supabase
    .from("riot_scan_jobs")
    .insert({
      counter_champion: validation.mode === "target" ? validation.counterChampion : null,
      created_by: authResult.userId,
      enemy_champion: validation.mode === "target" ? validation.enemyChampion : null,
      focus_champion_id:
        validation.mode === "discovery" ? validation.discoveryFocusChampion : null,
      match_count: validation.matchCount,
      minimum_games: validation.minimumGames,
      mode: validation.mode,
      progress: {
        discoveryFocusChampion: validation.discoveryFocusChampion,
        maxDisplayedResults: validation.maxDisplayedResults,
        seedCount: validation.seedPuuids.length,
      },
      results: validation.mode === "discovery" ? [] : null,
      role: validation.role,
      seed_puuids: validation.seedPuuids,
      status: "queued",
      summary: {
        currentPatchOnly: validation.currentPatchOnly,
        discoveryFocusChampion: validation.discoveryFocusChampion,
        maxDisplayedResults: validation.maxDisplayedResults,
        seedCount: validation.seedPuuids.length,
      },
    })
    .select(riotScanJobSelect)
    .single<RiotScanJobRow>();

  if (insertError || !insertedJob) {
    return {
      error: "Database write failed while creating the scan job.",
      ok: false,
    };
  }

  await markSeedCandidatesQueued({
    jobId: insertedJob.id,
    seedPuuids: validation.seedPuuids,
    supabase: serviceClientResult.supabase,
  });

  if (!process.env.RIOT_API_KEY) {
    const failedJob = await failJob({
      errorMessage: "Missing Riot API configuration.",
      jobId: insertedJob.id,
      supabase: serviceClientResult.supabase,
    });
    await markSeedCandidatesScanFailed({
      seedPuuids: validation.seedPuuids,
      supabase: serviceClientResult.supabase,
    });

    return {
      job: failedJob ?? sanitizeJobRow(insertedJob),
      ok: true,
    };
  }

  void runRiotScanJob({
    input: validation,
    jobId: insertedJob.id,
    supabase: serviceClientResult.supabase,
  });

  return {
    job: sanitizeJobRow(insertedJob),
    ok: true,
  };
}

export async function getLeagueChampionRegistryAdminStatus({
  accessToken,
}: {
  accessToken: string;
}): Promise<LeagueChampionRegistryAdminStatusResult> {
  const authResult = await getAuthorizedAdmin(accessToken, "view League champion registry status");

  if (!authResult.ok) {
    return authResult;
  }

  const serviceClientResult = getServiceSupabaseClient();

  if (!serviceClientResult.ok) {
    return serviceClientResult;
  }

  try {
    const { getLeagueChampionRegistryStatus } =
      await import("@/scripts/lib/league-champion-registry.mjs");
    const status = await getLeagueChampionRegistryStatus({
      supabase: serviceClientResult.supabase,
    });

    return {
      ok: true,
      status: {
        activeDatabaseChampionCount: status.activeDatabaseChampionCount,
        conflictCount: status.conflicts.length,
        conflicts: status.conflicts.slice(0, 8),
        databaseChampionCount: status.databaseChampionCount,
        inactiveReturnedByRiot: status.inactiveReturnedByRiot.slice(0, 8).map(getRegistryRowLabel),
        inactiveReturnedByRiotCount: status.inactiveReturnedByRiot.length,
        lastSyncedAt: status.lastSyncedAt,
        lastSyncError: status.lastSyncError,
        lastSyncStatus: status.lastSyncStatus,
        missing: status.missing.slice(0, 8).map(getRegistryRowLabel),
        missingCount: status.missing.length,
        nameMismatchCount: status.nameMismatches.length,
        nameMismatches: status.nameMismatches.slice(0, 8).map((mismatch) => {
          return `${mismatch.id}: ${mismatch.databaseName} -> ${mismatch.sourceName}`;
        }),
        registryOk: status.ok,
        sourceChampionCount: status.sourceChampionCount,
        sourceVersion: status.sourceVersion,
        unknown: status.unknown.slice(0, 8).map(getRegistryRowLabel),
        unknownCount: status.unknown.length,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "League champion registry status could not be loaded.",
      ok: false,
    };
  }
}

export async function resolveRiotIdsToPuuids(
  input: RiotIdResolverInput,
): Promise<RiotIdResolverResult> {
  const authResult = await getAuthorizedAdmin(input.accessToken, "resolve Riot IDs");

  if (!authResult.ok) {
    return authResult;
  }

  const { RiotApiClient } = await import("@/scripts/lib/riot-api-client.mjs");
  const { parseRiotId, resolveRiotAccountByRiotId, uniqueRiotIds } =
    await import("@/scripts/lib/riot-account-lookup.mjs");
  const { upsertSeedCandidatesFromPuuids } = await import("@/scripts/lib/riot-seed-candidates.mjs");
  const uniqueRiotIdsToResolve = uniqueRiotIds(input.riotIds ?? []);

  if (uniqueRiotIdsToResolve.length === 0) {
    return {
      error: "Add at least one Riot ID.",
      ok: false,
    };
  }

  if (uniqueRiotIdsToResolve.length > maxRiotIdsPerBatch) {
    return {
      error: `Resolve up to ${maxRiotIdsPerBatch} Riot IDs at a time.`,
      ok: false,
    };
  }

  if (!process.env.RIOT_API_KEY) {
    return {
      error: "Missing Riot API configuration.",
      ok: false,
    };
  }

  const riot = new RiotApiClient({
    apiKey: process.env.RIOT_API_KEY,
    regionalRoute: process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute,
    requestDelayMs: Number(process.env.RIOT_REQUEST_DELAY_MS ?? 1200),
  });
  const results: RiotIdResolverRow[] = [];

  for (const originalRiotId of uniqueRiotIdsToResolve) {
    const parsedRiotId = parseRiotId(originalRiotId);

    if (!parsedRiotId.ok) {
      results.push({
        error: parsedRiotId.error,
        gameName: null,
        ok: false,
        originalRiotId: parsedRiotId.originalRiotId,
        puuid: null,
        riotId: parsedRiotId.originalRiotId,
        tagLine: null,
      });
      continue;
    }

    try {
      const account = await resolveRiotAccountByRiotId({
        gameName: parsedRiotId.gameName,
        riot,
        tagLine: parsedRiotId.tagLine,
      });

      results.push({
        error: null,
        gameName: account.gameName,
        ok: true,
        originalRiotId: parsedRiotId.originalRiotId,
        puuid: account.puuid,
        riotId: account.riotId,
        tagLine: account.tagLine,
      });
    } catch (error) {
      results.push({
        error: getRiotIdLookupErrorMessage(error),
        gameName: parsedRiotId.gameName,
        ok: false,
        originalRiotId: parsedRiotId.originalRiotId,
        puuid: null,
        riotId: parsedRiotId.originalRiotId,
        tagLine: parsedRiotId.tagLine,
      });
    }
  }

  const resolvedPuuids = results.filter((result) => result.ok).map((result) => result.puuid);

  if (resolvedPuuids.length > 0) {
    const serviceClientResult = getServiceSupabaseClient();

    if (serviceClientResult.ok) {
      try {
        await upsertSeedCandidatesFromPuuids({
          platformRegion: process.env.RIOT_PLATFORM_REGION ?? defaultPlatformRegion,
          puuids: resolvedPuuids,
          regionalRouting: process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute,
          source: "riot_id_resolver",
          supabase: serviceClientResult.supabase,
        });
      } catch (error) {
        console.error("Riot ID resolver seed candidate persistence failed", error);
      }
    }
  }

  return {
    failedCount: results.filter((result) => !result.ok).length,
    ok: true,
    results,
    successCount: results.filter((result) => result.ok).length,
    uniqueCount: uniqueRiotIdsToResolve.length,
  };
}

export async function getRiotSeedCandidates({
  accessToken,
  filters = {},
  limit = 25,
  sort = "last_seen_at",
}: {
  accessToken: string;
  filters?: RiotSeedCandidateFilters;
  limit?: number;
  sort?: RiotSeedCandidateSort;
}): Promise<RiotSeedCandidatesResult> {
  const authResult = await getAuthorizedAdmin(accessToken, "view Riot seed candidates");

  if (!authResult.ok) {
    return authResult;
  }

  const serviceClientResult = getServiceSupabaseClient();

  if (!serviceClientResult.ok) {
    return serviceClientResult;
  }

  const orderColumn = getCandidateSortColumn(sort);
  const { data, error } = await buildRiotSeedCandidateQuery({
    filters,
    supabase: serviceClientResult.supabase,
  })
    .order(orderColumn, { ascending: false, nullsFirst: false })
    .limit(sort === "rank_tier" ? 100 : Math.min(Math.max(limit, 1), 100))
    .returns<RiotSeedCandidateView[]>();

  if (error) {
    return {
      error: "Seed candidates could not be loaded.",
      ok: false,
    };
  }

  return {
    candidates: sortCandidateRows(data ?? [], sort).slice(0, Math.min(Math.max(limit, 1), 100)),
    ok: true,
  };
}

export async function getPaginatedRiotSeedCandidates({
  accessToken,
  filters = {},
  groups,
}: RiotSeedCandidateGroupedQueryInput): Promise<RiotSeedCandidateGroupedResult> {
  const authResult = await getAuthorizedAdmin(accessToken, "view Riot seed candidates");

  if (!authResult.ok) {
    return authResult;
  }

  const serviceClientResult = getServiceSupabaseClient();

  if (!serviceClientResult.ok) {
    return serviceClientResult;
  }

  const supabase = serviceClientResult.supabase;
  const counts = {} as Record<RiotSeedCandidateRankGroupId, number>;
  const groupedResults: Partial<
    Record<RiotSeedCandidateRankGroupId, PaginatedSeedCandidates>
  > = {};

  for (const rankGroup of riotSeedCandidateRankGroupIds) {
    const { count, error } = await buildRiotSeedCandidateQuery({
      filters,
      rankGroup,
      selectOptions: { count: "exact", head: true },
      supabase,
    });

    if (error) {
      return {
        error: "Seed candidate counts could not be loaded.",
        ok: false,
      };
    }

    counts[rankGroup] = count ?? 0;
  }

  for (const groupRequest of groups) {
    const pageSize = normalizeRiotSeedCandidatePageSize(groupRequest.pageSize);
    const totalCount = counts[groupRequest.rankGroup] ?? 0;
    const totalPages = getRiotSeedCandidateTotalPages(totalCount, pageSize);
    const page = Math.min(normalizeRiotSeedCandidatePage(groupRequest.page), totalPages);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const orderColumn = getCandidateSortColumn(groupRequest.sort);
    const pageResult =
      groupRequest.sort === "rank_tier"
        ? await fetchRankTierSortedSeedCandidatePage({
            filters,
            page,
            pageSize,
            rankGroup: groupRequest.rankGroup,
            sortDirection: groupRequest.sortDirection,
            supabase,
          })
        : await buildRiotSeedCandidateQuery({
            filters,
            rankGroup: groupRequest.rankGroup,
            supabase,
          })
            .order(orderColumn, {
              ascending: groupRequest.sortDirection === "asc",
              nullsFirst: false,
            })
            .range(from, to)
            .returns<RiotSeedCandidateView[]>();

    if (pageResult.error) {
      return {
        error: `Could not load ${getRiotSeedCandidateGroupLabel(groupRequest.rankGroup)} candidates.`,
        ok: false,
      };
    }

    groupedResults[groupRequest.rankGroup] = {
      candidates: sortRiotSeedCandidateRows(pageResult.data ?? [], {
        sort: groupRequest.sort,
        sortDirection: groupRequest.sortDirection,
      }),
      page,
      pageSize,
      totalCount,
      totalPages,
    };
  }

  return {
    counts,
    groups: groupedResults,
    ok: true,
  };
}

export async function refreshRiotSeedCandidateRanks(
  input: RiotSeedCandidateRankRefreshInput,
): Promise<RiotSeedCandidateRankRefreshResult> {
  const authResult = await getAuthorizedAdmin(
    input.accessToken,
    "refresh Riot seed candidate ranks",
  );

  if (!authResult.ok) {
    return authResult;
  }

  const serviceClientResult = getServiceSupabaseClient();

  if (!serviceClientResult.ok) {
    return serviceClientResult;
  }

  const candidateIds = uniqueValues(input.candidateIds ?? []);

  if (candidateIds.length === 0) {
    return {
      error: "Select at least one seed candidate.",
      ok: false,
    };
  }

  if (candidateIds.length > maxSeedCandidateRankRefreshBatch) {
    return {
      error: `Refresh rank for up to ${maxSeedCandidateRankRefreshBatch} seed candidates at a time.`,
      ok: false,
    };
  }

  if (!process.env.RIOT_API_KEY) {
    return {
      error: "Missing Riot API configuration.",
      ok: false,
    };
  }

  try {
    const { RiotApiClient } = await import("@/scripts/lib/riot-api-client.mjs");
    const { createSupabaseRankRepository, enrichRiotSeedCandidateRanks } = await import(
      "@/scripts/lib/riot-seed-rank-enrichment.mjs"
    );
    const riot = new RiotApiClient({
      apiKey: process.env.RIOT_API_KEY,
      regionalRoute: process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute,
      requestDelayMs: Number(process.env.RIOT_REQUEST_DELAY_MS ?? 1200),
    });
    const result = await enrichRiotSeedCandidateRanks({
      candidateIds,
      force: input.force ?? false,
      limit: candidateIds.length,
      repository: createSupabaseRankRepository(serviceClientResult.supabase),
      riot,
    });

    return {
      failedCount: result.failedCount,
      notFoundCount: result.notFoundCount,
      ok: true,
      rankedCount: result.rankedCount,
      rateLimitedCount: result.rateLimitedCount,
      skippedCount: result.skippedCount,
      snapshotInsertedCount: result.snapshotInsertedCount,
      total: result.total,
      unrankedCount: result.unrankedCount,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? getRiotRankRefreshErrorMessage(error) : "Rank refresh failed.",
      ok: false,
    };
  }
}

export async function getRecentRiotScanJobs({
  accessToken,
  limit = 10,
}: {
  accessToken: string;
  limit?: number;
}): Promise<RiotScanJobsResult> {
  const authResult = await getAuthorizedAdmin(accessToken, "view Riot scan jobs");

  if (!authResult.ok) {
    return authResult;
  }

  const serviceClientResult = getServiceSupabaseClient();

  if (!serviceClientResult.ok) {
    return serviceClientResult;
  }

  const { data, error } = await serviceClientResult.supabase
    .from("riot_scan_jobs")
    .select(riotScanJobSelect)
    .order("created_at", { ascending: false })
    .limit(Math.min(Math.max(limit, 1), 20))
    .returns<RiotScanJobRow[]>();

  if (error) {
    return {
      error: "Database read failed while loading recent scan jobs.",
      ok: false,
    };
  }

  return {
    jobs: (data ?? []).map(sanitizeJobRow),
    ok: true,
  };
}

export async function getRiotScanJob({
  accessToken,
  jobId,
}: {
  accessToken: string;
  jobId: number;
}): Promise<RiotScanJobResult> {
  const authResult = await getAuthorizedAdmin(accessToken, "view Riot scan jobs");

  if (!authResult.ok) {
    return authResult;
  }

  const serviceClientResult = getServiceSupabaseClient();

  if (!serviceClientResult.ok) {
    return serviceClientResult;
  }

  const { data, error } = await serviceClientResult.supabase
    .from("riot_scan_jobs")
    .select(riotScanJobSelect)
    .eq("id", jobId)
    .single<RiotScanJobRow>();

  if (error || !data) {
    return {
      error: "Scan job could not be loaded.",
      ok: false,
    };
  }

  return {
    job: sanitizeJobRow(data),
    ok: true,
  };
}

async function runRiotScanJob({
  input,
  jobId,
  supabase,
}: {
  input: ValidatedStartInput;
  jobId: number;
  supabase: SupabaseClient;
}) {
  const { RiotApiClient } = await import("@/scripts/lib/riot-api-client.mjs");
  const { loadActiveChampionRegistry } =
    await import("@/scripts/lib/league-champion-normalizer.mjs");
  const {
    createObservationValidationContext,
    exceedsValidationFailureRate,
    validateRoutingConfiguration,
  } = await import("@/scripts/lib/riot-observation-validation.mjs");
  const { fetchCurrentPatch, rankedSoloDuoQueueId, scanRiotCounterPickMatchups } =
    await import("@/scripts/lib/riot-counter-pick-scanner.mjs");
  const { persistObservationsAndRebuildStats } =
    await import("@/scripts/lib/riot-counter-pick-aggregation.mjs");
  const { persistSeedCandidatesFromObservations } =
    await import("@/scripts/lib/riot-seed-candidates.mjs");
  const startedAt = new Date().toISOString();

  try {
    await supabase
      .from("riot_scan_jobs")
      .update({
        started_at: startedAt,
        status: "running",
      })
      .eq("id", jobId);
    await markSeedCandidatesScanRunning({
      seedPuuids: input.seedPuuids,
      supabase,
    });

    const patch = input.currentPatchOnly ? await fetchCurrentPatch() : null;
    const riot = new RiotApiClient({
      apiKey: process.env.RIOT_API_KEY ?? "",
      regionalRoute: process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute,
      requestDelayMs: Number(process.env.RIOT_REQUEST_DELAY_MS ?? 1200),
    });
    const championRegistry = await loadActiveChampionRegistry({
      supabase,
    });
    const validationContext = createObservationValidationContext({
      championRegistry,
    });
    const platformRegion = process.env.RIOT_PLATFORM_REGION ?? defaultPlatformRegion;
    const regionalRouting = process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute;
    const routingValidation = validateRoutingConfiguration({
      context: validationContext,
      platformRegion,
      regionalRouting,
    });

    if (!routingValidation.ok) {
      throw new Error(
        `Invalid Riot routing configuration: ${routingValidation.issues
          .map((issue) => issue.code)
          .join(", ")}`,
      );
    }
    const progressBase = {
      currentPatchOnly: input.currentPatchOnly,
      discoveryFocusChampion: input.discoveryFocusChampion,
      maxDisplayedResults: input.maxDisplayedResults,
      seedCount: input.seedPuuids.length,
    };
    const scanResult = await scanRiotCounterPickMatchups({
      championRegistry,
      discover: input.mode === "discovery",
      focusChampionId: input.discoveryFocusChampion,
      matchCount: input.matchCount,
      onProgress: async (progress) => {
        await supabase
          .from("riot_scan_jobs")
          .update({
            progress: {
              ...progressBase,
              ...progress,
            },
          })
          .eq("id", jobId);
      },
      patch,
      platformRegion,
      queue: rankedSoloDuoQueueId,
      regionalRouting,
      riot,
      role: input.role,
      seedPuuids: input.seedPuuids,
      target:
        input.mode === "target"
          ? {
              counterChampionId: input.counterChampion,
              enemyChampionId: input.enemyChampion,
            }
          : null,
    });
    const summary = {
      ...progressBase,
      ...scanResult.summary,
    };
    const persistenceResult = await persistObservationsAndRebuildStats({
      championRegistry,
      observations: scanResult.observations,
      scanJobId: jobId,
      supabase,
      validationContext,
    });
    const candidatePersistenceResult = await persistSeedCandidatesFromObservations({
      championRegistry,
      observations: scanResult.candidateObservations,
      scanJobId: jobId,
      source: "match_discovery",
      supabase,
      validationContext,
    });
    const focusObservationKeys = new Set(scanResult.focusObservationKeys ?? []);
    const focusChampionObservationsNew = countKeyIntersections(
      focusObservationKeys,
      persistenceResult.insertedObservationKeys ?? [],
    );
    const focusChampionObservationsDuplicate = countKeyIntersections(
      focusObservationKeys,
      persistenceResult.duplicateObservationKeys ?? [],
    );
    const persistedSummary = {
      ...summary,
      candidateIdLookupChunkFailures: candidatePersistenceResult.candidateIdLookupChunkFailures,
      candidateIdLookupChunks: candidatePersistenceResult.candidateIdLookupChunks,
      candidateIdResolutionFailures: candidatePersistenceResult.candidateIdResolutionFailures,
      candidateIdsResolved: candidatePersistenceResult.candidateIdsResolved,
      candidateObservationDuplicatesSkipped:
        candidatePersistenceResult.candidateObservationDuplicatesSkipped,
      candidateObservationInsertFailures:
        candidatePersistenceResult.candidateObservationInsertFailures,
      candidateObservationBatchAttempts:
        candidatePersistenceResult.candidateObservationBatchAttempts,
      candidateObservationSuccessfulBatches:
        candidatePersistenceResult.candidateObservationSuccessfulBatches,
      candidateObservationFailedBatchAttempts:
        candidatePersistenceResult.candidateObservationFailedBatchAttempts,
      candidateObservationBatchSplits: candidatePersistenceResult.candidateObservationBatchSplits,
      candidateObservationTransientRetries:
        candidatePersistenceResult.candidateObservationTransientRetries,
      candidateObservationIsolatedFailures:
        candidatePersistenceResult.candidateObservationIsolatedFailures,
      candidateObservationUnresolvedBatchFailures:
        candidatePersistenceResult.candidateObservationUnresolvedBatchFailures,
      candidateObservationPersistenceFailureSamples:
        candidatePersistenceResult.candidateObservationPersistenceFailureSamples,
      candidateObservationPersistenceErrorGroups:
        candidatePersistenceResult.candidateObservationPersistenceErrorGroups,
      candidateObservationResolutionFailures:
        candidatePersistenceResult.candidateObservationResolutionFailures,
      candidateObservationsFound: candidatePersistenceResult.candidateObservationsFound,
      candidateObservationsInserted: candidatePersistenceResult.candidateObservationsInserted,
      candidateObservationValidationFailures:
        candidatePersistenceResult.candidateObservationValidationFailures,
      candidateObservationValidationSummary:
        candidatePersistenceResult.candidateObservationValidationSummary,
      candidateObservationsRejected: candidatePersistenceResult.candidateObservationsRejected,
      candidateObservationsValidated: candidatePersistenceResult.candidateObservationsValidated,
      candidateProfileFailures: candidatePersistenceResult.candidateProfileFailures,
      candidateProfilesRebuilt: candidatePersistenceResult.candidateProfilesRebuilt,
      candidateUniqueIdResolutionFailures:
        candidatePersistenceResult.candidateUniqueIdResolutionFailures,
      existingCandidatesUpdated: candidatePersistenceResult.existingCandidatesUpdated,
      newCandidatesCreated: candidatePersistenceResult.newCandidatesCreated,
      observationDuplicatesSkipped: persistenceResult.duplicateObservationsSkipped,
      focus_champion_observations_duplicate: focusChampionObservationsDuplicate,
      focus_champion_observations_new: focusChampionObservationsNew,
      observationInsertFailures: persistenceResult.insertFailures,
      matchupObservationBatchAttempts: persistenceResult.matchupObservationBatchAttempts,
      matchupObservationSuccessfulBatches: persistenceResult.matchupObservationSuccessfulBatches,
      matchupObservationFailedBatchAttempts:
        persistenceResult.matchupObservationFailedBatchAttempts,
      matchupObservationBatchSplits: persistenceResult.matchupObservationBatchSplits,
      matchupObservationTransientRetries: persistenceResult.matchupObservationTransientRetries,
      matchupObservationIsolatedFailures: persistenceResult.matchupObservationIsolatedFailures,
      matchupObservationUnresolvedBatchFailures:
        persistenceResult.matchupObservationUnresolvedBatchFailures,
      matchupObservationPersistenceFailureSamples:
        persistenceResult.matchupObservationPersistenceFailureSamples,
      matchupObservationPersistenceErrorGroups:
        persistenceResult.matchupObservationPersistenceErrorGroups,
      observationsFound: persistenceResult.observationsFound,
      observationsInserted: persistenceResult.insertedObservations,
      matchupObservationValidationFailures: persistenceResult.matchupObservationValidationFailures,
      matchupObservationValidationSummary: persistenceResult.matchupObservationValidationSummary,
      matchupObservationsRejected: persistenceResult.matchupObservationsRejected,
      matchupObservationsValidated: persistenceResult.matchupObservationsValidated,
      matchupRankAttributionFailures: persistenceResult.matchupRankAttributionFailures,
      matchupRankAttributionsAttempted: persistenceResult.matchupRankAttributionsAttempted,
      matchupRankAttributionsSinglePlayer: persistenceResult.matchupRankAttributionsSinglePlayer,
      matchupRankAttributionsTwoPlayer: persistenceResult.matchupRankAttributionsTwoPlayer,
      matchupRankAttributionsUnknown: persistenceResult.matchupRankAttributionsUnknown,
      matchupRankParticipantsNotFound: persistenceResult.matchupRankParticipantsNotFound,
      matchupRankSnapshotTooOld: persistenceResult.matchupRankSnapshotTooOld,
      counterPickAggregateValidationFailures:
        persistenceResult.counterPickAggregateValidationFailures,
      counterPickAggregateValidationSummary:
        persistenceResult.counterPickAggregateValidationSummary,
      counterPickAggregatesValidated: persistenceResult.counterPickAggregatesValidated,
      counterPickAggregateInsertFailures: persistenceResult.counterPickAggregateInsertFailures,
      counterPickAggregateBatchAttempts: persistenceResult.counterPickAggregateBatchAttempts,
      counterPickAggregateSuccessfulBatches:
        persistenceResult.counterPickAggregateSuccessfulBatches,
      counterPickAggregateFailedBatchAttempts:
        persistenceResult.counterPickAggregateFailedBatchAttempts,
      counterPickAggregateBatchSplits: persistenceResult.counterPickAggregateBatchSplits,
      counterPickAggregateTransientRetries: persistenceResult.counterPickAggregateTransientRetries,
      counterPickAggregateIsolatedFailures: persistenceResult.counterPickAggregateIsolatedFailures,
      counterPickAggregateUnresolvedBatchFailures:
        persistenceResult.counterPickAggregateUnresolvedBatchFailures,
      counterPickAggregatePersistenceFailureSamples:
        persistenceResult.counterPickAggregatePersistenceFailureSamples,
      counterPickAggregatePersistenceErrorGroups:
        persistenceResult.counterPickAggregatePersistenceErrorGroups,
      participantPuuidsObserved: candidatePersistenceResult.participantPuuidsObserved,
      statsRowsUpdated: persistenceResult.statsRowsUpdated,
      uniqueCandidatesEncountered: candidatePersistenceResult.uniqueCandidatesEncountered,
    };
    const discoveryResults = scanResult.discoveryResults as RiotScanDiscoveryResult[];
    const results =
      input.mode === "discovery"
        ? getRankedDiscoveryResults({
            focusChampion: input.discoveryFocusChampion,
            maxDisplayedResults: input.maxDisplayedResults,
            minimumGames: input.minimumGames,
            results: discoveryResults,
            updatedStats: persistenceResult.updatedStats,
          })
        : getPersistedTargetResult({
            result: scanResult.targetResult as RiotScanTargetResult | null,
            updatedStats: persistenceResult.updatedStats,
          });
    const didCandidatePersistenceFail =
      candidatePersistenceResult.candidateIdLookupChunkFailures > 0 ||
      candidatePersistenceResult.candidateUniqueIdResolutionFailures > 0 ||
      candidatePersistenceResult.candidateObservationResolutionFailures > 0 ||
      candidatePersistenceResult.candidateProfileFailures > 0;
    const persistenceRecoveryState = getPersistenceRecoveryState(persistedSummary);
    const didValidationFail =
      exceedsValidationFailureRate({
        rejected: persistenceResult.matchupObservationsRejected,
        validated: persistenceResult.matchupObservationsValidated,
      }) ||
      exceedsValidationFailureRate({
        rejected: candidatePersistenceResult.candidateObservationsRejected,
        validated: candidatePersistenceResult.candidateObservationsValidated,
      }) ||
      exceedsValidationFailureRate({
        rejected: persistenceResult.counterPickAggregateValidationFailures,
        validated: persistenceResult.counterPickAggregatesValidated,
      });
    const didPersistenceFail =
      didCandidatePersistenceFail || didValidationFail || persistenceRecoveryState.shouldFail;
    const persistenceErrorMessage = didCandidatePersistenceFail
      ? getCandidatePersistenceErrorMessage(persistedSummary)
      : didValidationFail
        ? getValidationErrorMessage(persistedSummary)
        : persistenceRecoveryState.shouldFail
          ? getPersistenceRecoveryErrorMessage(persistedSummary)
          : persistenceRecoveryState.hasWarnings
            ? getPersistenceRecoveryWarningMessage(persistedSummary)
            : null;

    await supabase
      .from("riot_scan_jobs")
      .update({
        completed_at: new Date().toISOString(),
        error_message: persistenceErrorMessage,
        progress: persistedSummary,
        results,
        status: didPersistenceFail ? "failed" : "completed",
        summary: persistedSummary,
      })
      .eq("id", jobId);

    if (didPersistenceFail) {
      await markSeedCandidatesScanFailed({
        seedPuuids: input.seedPuuids,
        supabase,
      });
    } else {
      await markSeedCandidatesScanSucceeded({
        seedPuuids: input.seedPuuids,
        supabase,
      });
    }
  } catch (error) {
    await failJob({
      errorMessage: getScannerErrorMessage(error),
      jobId,
      supabase,
    });
    await markSeedCandidatesScanFailed({
      seedPuuids: input.seedPuuids,
      supabase,
    });
  }
}

function getRankedDiscoveryResults({
  focusChampion,
  maxDisplayedResults,
  minimumGames,
  results,
  updatedStats,
}: {
  focusChampion: string | null;
  maxDisplayedResults: number;
  minimumGames: number;
  results: RiotScanDiscoveryResult[];
  updatedStats: Array<{
    counter_champion_id: string;
    enemy_champion_id: string;
    games: number;
    role: string;
    tier?: string | null;
  }>;
}) {
  return results
    .filter((result) => result.games >= minimumGames)
    .map((result) => ({
      ...result,
      ...getStoredFocusedDiscoveryStats({
        result,
        updatedStats,
      }),
      representedInStats: getDiscoveryResultStoredStatus({
        result,
        updatedStats,
      }),
    }))
    .sort((left, right) => {
      if (!focusChampion) {
        return 0;
      }

      if (left.games !== right.games) {
        return right.games - left.games;
      }

      const leftStoredGames = left.storedGamesAfterAggregation ?? 0;
      const rightStoredGames = right.storedGamesAfterAggregation ?? 0;

      if (leftStoredGames !== rightStoredGames) {
        return rightStoredGames - leftStoredGames;
      }

      return String(left.opponentChampionDisplayName ?? left.championB).localeCompare(
        String(right.opponentChampionDisplayName ?? right.championB),
      );
    })
    .slice(0, maxDisplayedResults);
}

function getPersistedTargetResult({
  result,
  updatedStats,
}: {
  result: RiotScanTargetResult | null;
  updatedStats: Array<{
    counter_champion_id: string;
    enemy_champion_id: string;
    games: number;
    role: string;
  }>;
}) {
  if (!result) {
    return null;
  }

  const storedStat = updatedStats.find(
    (stat) =>
      stat.enemy_champion_id === result.enemyChampion &&
      stat.counter_champion_id === result.counterChampion &&
      stat.role === result.role,
  );

  return {
    ...result,
    storedGamesAfterAggregation: storedStat?.games ?? 0,
    wasWrittenToStats: Boolean(storedStat),
  };
}

function getStoredFocusedDiscoveryStats({
  result,
  updatedStats,
}: {
  result: RiotScanDiscoveryResult;
  updatedStats: Array<{
    counter_champion_id: string;
    enemy_champion_id: string;
    games: number;
    role: string;
    tier?: string | null;
  }>;
}) {
  const focusChampion = result.focusChampion ?? result.championA;
  const opponentChampion = result.opponentChampion ?? result.championB;
  const storedStat = updatedStats.find(
    (stat) =>
      stat.enemy_champion_id === opponentChampion &&
      stat.counter_champion_id === focusChampion &&
      stat.role === result.role,
  );

  if (!result.focusChampion && !result.opponentChampion) {
    return {};
  }

  return {
    storedGamesAfterAggregation: storedStat?.games ?? 0,
    storedTier: storedStat?.tier ?? null,
  };
}

function getDiscoveryResultStoredStatus({
  result,
  updatedStats,
}: {
  result: RiotScanDiscoveryResult;
  updatedStats: Array<{
    counter_champion_id: string;
    enemy_champion_id: string;
    role: string;
  }>;
}) {
  const focusChampion = result.focusChampion ?? result.championA;
  const opponentChampion = result.opponentChampion ?? result.championB;

  if (result.focusChampion || result.opponentChampion) {
    return updatedStats.some(
      (stat) =>
        stat.enemy_champion_id === opponentChampion &&
        stat.counter_champion_id === focusChampion &&
        stat.role === result.role,
    );
  }

  return updatedStats.some(
    (stat) =>
      stat.role === result.role &&
      ((stat.enemy_champion_id === result.championA &&
        stat.counter_champion_id === result.championB) ||
        (stat.enemy_champion_id === result.championB &&
          stat.counter_champion_id === result.championA)),
  );
}

function countKeyIntersections(keys: Set<string>, candidates: string[]) {
  let count = 0;

  for (const candidate of candidates) {
    if (keys.has(candidate)) {
      count += 1;
    }
  }

  return count;
}

function getCandidatePersistenceErrorMessage(summary: RiotScanSummary) {
  return [
    "Candidate persistence partially failed:",
    `${summary.uniqueCandidatesEncountered ?? 0} unique candidates encountered`,
    `${summary.candidateIdsResolved ?? 0} candidate IDs resolved`,
    `${summary.candidateUniqueIdResolutionFailures ?? 0} identities unresolved`,
    `${summary.candidateObservationResolutionFailures ?? 0} participant observations skipped`,
    `${summary.candidateIdLookupChunkFailures ?? 0} lookup chunks failed`,
    `${summary.candidateObservationInsertFailures ?? 0} observation insert failures`,
    `${summary.candidateProfileFailures ?? 0} profile rebuild failures`,
  ].join(" ");
}

function getValidationErrorMessage(summary: RiotScanSummary) {
  return [
    "Riot observation validation rejected too many rows:",
    `${summary.matchupObservationsRejected ?? 0} matchup observations rejected`,
    `${summary.candidateObservationsRejected ?? 0} candidate observations rejected`,
    `${summary.counterPickAggregateValidationFailures ?? 0} counter-pick aggregates rejected`,
  ].join(" ");
}

async function markSeedCandidatesQueued({
  jobId,
  seedPuuids,
  supabase,
}: {
  jobId: number;
  seedPuuids: string[];
  supabase: SupabaseClient;
}) {
  const candidates = await fetchScanSeedCandidates({ seedPuuids, supabase });

  for (const candidate of candidates) {
    const { error } = await supabase
      .from("riot_seed_candidates")
      .update({
        first_seen_scan_job_id: candidate.first_seen_scan_job_id ?? jobId,
        status: "queued",
      })
      .eq("id", candidate.id);

    if (error) {
      console.error("Seed candidate queue metadata update failed", getSafeDatabaseError(error));
    }
  }
}

async function markSeedCandidatesScanRunning({
  seedPuuids,
  supabase,
}: {
  seedPuuids: string[];
  supabase: SupabaseClient;
}) {
  const candidates = await fetchScanSeedCandidates({ seedPuuids, supabase });

  for (const candidate of candidates) {
    const { error } = await supabase
      .from("riot_seed_candidates")
      .update({
        status: "active",
      })
      .eq("id", candidate.id);

    if (error) {
      console.error("Seed candidate running metadata update failed", getSafeDatabaseError(error));
    }
  }
}

async function markSeedCandidatesScanSucceeded({
  seedPuuids,
  supabase,
}: {
  seedPuuids: string[];
  supabase: SupabaseClient;
}) {
  const candidates = await fetchScanSeedCandidates({ seedPuuids, supabase });
  const scannedAt = new Date().toISOString();

  for (const candidate of candidates) {
    const { error } = await supabase
      .from("riot_seed_candidates")
      .update({
        consecutive_scan_failures: 0,
        last_scanned_at: scannedAt,
        status: "candidate",
        successful_scan_count: Number(candidate.successful_scan_count ?? 0) + 1,
        times_scanned: Number(candidate.times_scanned ?? 0) + 1,
      })
      .eq("id", candidate.id);

    if (error) {
      console.error("Seed candidate success metadata update failed", getSafeDatabaseError(error));
    }
  }
}

async function markSeedCandidatesScanFailed({
  seedPuuids,
  supabase,
}: {
  seedPuuids: string[];
  supabase: SupabaseClient;
}) {
  const candidates = await fetchScanSeedCandidates({ seedPuuids, supabase });

  for (const candidate of candidates) {
    const { error } = await supabase
      .from("riot_seed_candidates")
      .update({
        consecutive_scan_failures: Number(candidate.consecutive_scan_failures ?? 0) + 1,
        failed_scan_count: Number(candidate.failed_scan_count ?? 0) + 1,
        status: "failed",
      })
      .eq("id", candidate.id);

    if (error) {
      console.error("Seed candidate failure metadata update failed", getSafeDatabaseError(error));
    }
  }
}

async function fetchScanSeedCandidates({
  seedPuuids,
  supabase,
}: {
  seedPuuids: string[];
  supabase: SupabaseClient;
}) {
  const uniquePuuids = uniqueValues(seedPuuids);

  if (uniquePuuids.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("riot_seed_candidates")
    .select(
      "id, puuid, platform_region, status, first_seen_scan_job_id, times_scanned, successful_scan_count, failed_scan_count, consecutive_scan_failures",
    )
    .eq(
      "platform_region",
      (process.env.RIOT_PLATFORM_REGION ?? defaultPlatformRegion).toUpperCase(),
    )
    .in("puuid", uniquePuuids);

  if (error) {
    console.error("Seed candidate scan metadata lookup failed", getSafeDatabaseError(error));
    return [];
  }

  return data ?? [];
}

function getSafeDatabaseError(error: { code?: string; message?: string; status?: number }) {
  return {
    code: error.code ?? null,
    message: error.message ?? "Database operation failed.",
    status: error.status ?? null,
  };
}

function getPersistenceRecoveryState(summary: RiotScanSummary) {
  const states = [
    getPersistenceStageState({
      attempted:
        (summary.candidateObservationsValidated ?? 0) -
        (summary.candidateObservationsRejected ?? 0),
      failures: summary.candidateObservationInsertFailures ?? 0,
      unresolved: summary.candidateObservationUnresolvedBatchFailures ?? 0,
    }),
    getPersistenceStageState({
      attempted:
        (summary.matchupObservationsValidated ?? 0) - (summary.matchupObservationsRejected ?? 0),
      failures: summary.observationInsertFailures ?? 0,
      unresolved: summary.matchupObservationUnresolvedBatchFailures ?? 0,
    }),
    getPersistenceStageState({
      attempted: summary.counterPickAggregatesValidated ?? 0,
      failures: summary.counterPickAggregateInsertFailures ?? 0,
      unresolved: summary.counterPickAggregateUnresolvedBatchFailures ?? 0,
    }),
  ];

  return {
    hasWarnings: states.some((state) => state.hasWarnings),
    shouldFail: states.some((state) => state.shouldFail),
  };
}

function getPersistenceStageState({
  attempted,
  failures,
  unresolved,
}: {
  attempted: number;
  failures: number;
  unresolved: number;
}) {
  const failureRate = attempted > 0 ? failures / attempted : 0;
  const hasWarnings = failures > 0 || unresolved > 0;

  return {
    hasWarnings,
    shouldFail:
      unresolved > 0 ||
      failures > maxWarningOnlyPersistenceFailureCount ||
      failureRate > maxWarningOnlyPersistenceFailureRate,
  };
}

function getPersistenceRecoveryErrorMessage(summary: RiotScanSummary) {
  return [
    "Riot persistence recovery could not save enough valid rows:",
    `${summary.candidateObservationInsertFailures ?? 0} candidate observation failures`,
    `${summary.observationInsertFailures ?? 0} matchup observation failures`,
    `${summary.counterPickAggregateInsertFailures ?? 0} aggregate write failures`,
    `${summary.candidateObservationUnresolvedBatchFailures ?? 0} candidate rows unresolved`,
    `${summary.matchupObservationUnresolvedBatchFailures ?? 0} matchup rows unresolved`,
  ].join(" ");
}

function getPersistenceRecoveryWarningMessage(summary: RiotScanSummary) {
  return [
    "Completed with Riot persistence recovery warnings:",
    `${summary.candidateObservationIsolatedFailures ?? 0} candidate rows isolated`,
    `${summary.matchupObservationIsolatedFailures ?? 0} matchup rows isolated`,
    `${summary.counterPickAggregateIsolatedFailures ?? 0} aggregate rows isolated`,
  ].join(" ");
}

async function failJob({
  errorMessage,
  jobId,
  supabase,
}: {
  errorMessage: string;
  jobId: number;
  supabase: SupabaseClient;
}) {
  const { data } = await supabase
    .from("riot_scan_jobs")
    .update({
      completed_at: new Date().toISOString(),
      error_message: errorMessage,
      status: "failed",
    })
    .eq("id", jobId)
    .select(riotScanJobSelect)
    .maybeSingle<RiotScanJobRow>();

  return data ? sanitizeJobRow(data) : null;
}

function getAuthorizedAdmin(
  accessToken: string,
  actionLabel: string,
): Promise<AuthorizedClientResult> {
  return getAuthorizedAdminClient(accessToken, actionLabel);
}

async function getAuthorizedAdminClient(
  accessToken: string,
  actionLabel: string,
): Promise<AuthorizedClientResult> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: "Supabase is not configured.",
      ok: false,
    };
  }

  if (!accessToken) {
    return {
      error: "Admin session is not ready.",
      ok: false,
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
  const user = userData.user;

  if (userError || !user) {
    return {
      error: "Admin session could not be verified.",
      ok: false,
    };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
    user_id: user.id,
  });

  if (adminError || !isAdmin) {
    return {
      error: `Only admins can ${actionLabel}.`,
      ok: false,
    };
  }

  return {
    ok: true,
    userId: user.id,
  };
}

function getServiceSupabaseClient():
  | {
      ok: true;
      supabase: SupabaseClient;
    }
  | {
      error: string;
      ok: false;
    } {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return {
      error: "Supabase service credentials are not configured.",
      ok: false,
    };
  }

  return {
    ok: true,
    supabase: createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    }),
  };
}

async function loadChampionRegistry(supabase: SupabaseClient): Promise<
  | {
      normalizeChampionIdentifier: (
        value: unknown,
        registry: unknown,
      ) => { canonicalKey: string } | null;
      ok: true;
      registry: unknown;
    }
  | {
      error: string;
      ok: false;
    }
> {
  try {
    const { loadActiveChampionRegistry, normalizeChampionIdentifier } =
      await import("@/scripts/lib/league-champion-normalizer.mjs");
    const registry = await loadActiveChampionRegistry({
      supabase,
    });

    return {
      normalizeChampionIdentifier,
      ok: true,
      registry,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "League champion registry could not be initialized.",
      ok: false,
    };
  }
}

type ValidatedStartInput = {
  counterChampion: string;
  currentPatchOnly: boolean;
  discoveryFocusChampion: string | null;
  enemyChampion: string;
  matchCount: number;
  maxDisplayedResults: number;
  minimumGames: number;
  mode: RiotScanMode;
  role: LeagueRole;
  seedPuuids: string[];
};

function normalizeTargetChampions(
  enemyChampion: string,
  counterChampion: string,
  championRegistry: unknown,
  normalizeChampionIdentifier: (
    value: unknown,
    registry: unknown,
  ) => { canonicalKey: string } | null,
):
  | {
      counterChampion: string;
      enemyChampion: string;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    } {
  if (!enemyChampion || !counterChampion) {
    return {
      error: "Target scans require enemy and counter champions.",
      ok: false,
    };
  }

  const enemy = normalizeChampionIdentifier(enemyChampion, championRegistry);
  const counter = normalizeChampionIdentifier(counterChampion, championRegistry);

  if (!enemy || !counter) {
    return {
      error: "Select valid enemy and counter champions.",
      ok: false,
    };
  }

  return {
    counterChampion: counter.canonicalKey,
    enemyChampion: enemy.canonicalKey,
    ok: true,
  };
}

function validateStartInput(
  input: StartRiotScanJobInput,
  championRegistry: unknown,
  normalizeChampionIdentifier: (
    value: unknown,
    registry: unknown,
  ) => { canonicalKey: string } | null,
):
  | ({
      ok: true;
    } & ValidatedStartInput)
  | {
      error: string;
      ok: false;
    } {
  const mode = input.mode;
  const role = normalizeRole(input.role);
  const seedPuuids = uniqueValues(input.seedPuuids ?? []);
  const matchCount = Number(input.matchCount);
  const minimumGames = Number(input.minimumGames);
  const maxDisplayedResults = Number(input.maxDisplayedResults);
  const enemyChampion = input.enemyChampion?.trim() ?? "";
  const counterChampion = input.counterChampion?.trim() ?? "";
  const discoveryFocusChampionInput = input.discoveryFocusChampion?.trim() ?? "";
  const normalizedChampions =
    mode === "target"
      ? normalizeTargetChampions(
          enemyChampion,
          counterChampion,
          championRegistry,
          normalizeChampionIdentifier,
        )
      : null;
  const normalizedDiscoveryFocusChampion =
    mode === "discovery" && discoveryFocusChampionInput
      ? normalizeChampionIdentifier(discoveryFocusChampionInput, championRegistry)
      : null;

  if (mode !== "target" && mode !== "discovery") {
    return {
      error: "Select a valid scan mode.",
      ok: false,
    };
  }

  if (!role) {
    return {
      error: "Select a valid role.",
      ok: false,
    };
  }

  if (seedPuuids.length === 0) {
    return {
      error: "Add at least one Seed PUUID.",
      ok: false,
    };
  }

  if (seedPuuids.length > maxSeedCandidatesPerScan) {
    return {
      error: `You selected ${seedPuuids.length} seed candidates. The maximum per scan job is ${maxSeedCandidatesPerScan}.`,
      ok: false,
    };
  }

  if (!Number.isInteger(matchCount) || matchCount < 1 || matchCount > maxMatchCount) {
    return {
      error: `Match count must be between 1 and ${maxMatchCount}.`,
      ok: false,
    };
  }

  const hasInvalidMinimumGames =
    !Number.isInteger(minimumGames) || minimumGames < 1 || minimumGames > 1000;
  const hasInvalidMaxDisplayedResults =
    !Number.isInteger(maxDisplayedResults) ||
    maxDisplayedResults < 1 ||
    maxDisplayedResults > maxDisplayedResultsLimit;

  if (mode === "discovery" && hasInvalidMinimumGames) {
    return {
      error: "Minimum games must be between 1 and 1000.",
      ok: false,
    };
  }

  if (mode === "discovery" && hasInvalidMaxDisplayedResults) {
    return {
      error: `Maximum displayed results must be between 1 and ${maxDisplayedResultsLimit}.`,
      ok: false,
    };
  }

  if (mode === "target" && !normalizedChampions?.ok) {
    return {
      error:
        normalizedChampions?.error ?? "Target scans require valid enemy and counter champions.",
      ok: false,
    };
  }

  if (mode === "discovery" && discoveryFocusChampionInput && !normalizedDiscoveryFocusChampion) {
    return {
      error: "Select a valid discovery focus champion.",
      ok: false,
    };
  }

  if (
    mode === "target" &&
    normalizedChampions?.ok &&
    normalizedChampions.enemyChampion === normalizedChampions.counterChampion
  ) {
    return {
      error: "Enemy and counter champion cannot be the same.",
      ok: false,
    };
  }

  return {
    counterChampion:
      mode === "target" && normalizedChampions?.ok ? normalizedChampions.counterChampion : "",
    currentPatchOnly: input.currentPatchOnly,
    discoveryFocusChampion:
      mode === "discovery" && normalizedDiscoveryFocusChampion
        ? normalizedDiscoveryFocusChampion.canonicalKey
        : null,
    enemyChampion:
      mode === "target" && normalizedChampions?.ok ? normalizedChampions.enemyChampion : "",
    matchCount,
    maxDisplayedResults: mode === "discovery" ? maxDisplayedResults : 20,
    minimumGames: mode === "discovery" ? minimumGames : 1,
    mode,
    ok: true,
    role,
    seedPuuids,
  };
}

function sanitizeJobRow(row: RiotScanJobRow): RiotScanJobView {
  const seedCount =
    row.seed_puuids?.length ?? row.summary?.seedCount ?? row.progress?.seedCount ?? 0;

  return {
    completed_at: row.completed_at,
    counter_champion: row.counter_champion,
    created_at: row.created_at,
    enemy_champion: row.enemy_champion,
    error_message: row.error_message,
    focus_champion_id: row.focus_champion_id,
    id: row.id,
    match_count: row.match_count,
    minimum_games: row.minimum_games,
    mode: row.mode,
    progress: {
      ...(row.progress ?? {}),
      seedCount,
    },
    results: row.results,
    role: row.role,
    seed_count: seedCount,
    started_at: row.started_at,
    status: row.status,
    summary: {
      ...(row.summary ?? {}),
      seedCount,
    },
  };
}

function normalizeRole(value: unknown): LeagueRole | null {
  const role = String(value).trim().toLowerCase();

  if (role === "bottom" || role === "bot") {
    return "adc";
  }

  return role === "top" ||
    role === "jungle" ||
    role === "mid" ||
    role === "adc" ||
    role === "support"
    ? role
    : null;
}

function uniqueValues(values: unknown[]) {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)));
}

function getCandidateSortColumn(sort: RiotSeedCandidateSort) {
  switch (sort) {
    case "created_at":
      return "created_at";
    case "last_scanned_at":
      return "last_scanned_at";
    case "rank_league_points":
      return "rank_league_points";
    case "rank_last_success_at":
      return "rank_last_success_at";
    case "rank_tier":
      return "rank_last_success_at";
    case "observed_games":
      return "observed_games";
    case "primary_champion_share":
      return "primary_champion_share";
    case "primary_role_share":
      return "primary_role_share";
    case "last_seen_at":
    default:
      return "last_seen_at";
  }
}

function buildRiotSeedCandidateQuery({
  filters,
  rankGroup = null,
  selectOptions,
  supabase,
}: {
  filters: RiotSeedCandidateFilters;
  rankGroup?: RiotSeedCandidateRankGroupId | null;
  selectOptions?: {
    count?: "exact";
    head?: boolean;
  };
  supabase: SupabaseClient;
}) {
  let query = supabase.from("riot_seed_candidates").select(riotSeedCandidateSelect, selectOptions);

  if (filters.platformRegion?.trim()) {
    query = query.eq("platform_region", filters.platformRegion.trim().toUpperCase());
  }

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.primaryRole && filters.primaryRole !== "all") {
    query = query.eq("estimated_primary_role", filters.primaryRole);
  }

  if (filters.primaryChampion?.trim()) {
    query = query.ilike("primary_champion", `%${filters.primaryChampion.trim()}%`);
  }

  if (filters.lastScanned === "never") {
    query = query.is("last_scanned_at", null);
  } else if (filters.lastScanned === "recent") {
    query = query.gte("last_scanned_at", getRecentSeedCandidateScanCutoff());
  } else if (filters.lastScanned === "older") {
    query = query.or(
      `last_scanned_at.is.null,last_scanned_at.lt.${getRecentSeedCandidateScanCutoff()}`,
    );
  }

  if (filters.source && filters.source !== "all") {
    query = query.eq("source", filters.source);
  }

  if (filters.rankStatus && filters.rankStatus !== "all") {
    query = query.eq("rank_enrichment_status", filters.rankStatus);
  }

  if (filters.rankTier && filters.rankTier !== "all") {
    query = query.eq("rank_tier", filters.rankTier);
  }

  if (filters.rankedState === "ranked") {
    query = query.eq("rank_enrichment_status", "ranked");
  } else if (filters.rankedState === "unranked") {
    query = query.in("rank_enrichment_status", ["unranked", "not_found"]);
  }

  if (filters.rankLastRefreshed === "never") {
    query = query.is("rank_last_success_at", null);
  } else if (filters.rankLastRefreshed === "recent") {
    query = query.gte("rank_last_success_at", getRecentSeedCandidateRankRefreshCutoff());
  } else if (filters.rankLastRefreshed === "older") {
    query = query.or(
      `rank_last_success_at.is.null,rank_last_success_at.lt.${getRecentSeedCandidateRankRefreshCutoff()}`,
    );
  }

  if (filters.minObservedGames && filters.minObservedGames > 0) {
    query = query.gte("observed_games", Math.trunc(filters.minObservedGames));
  }

  const minPrimaryRoleShare = normalizeShareFilter(filters.minPrimaryRoleShare);
  const minPrimaryChampionShare = normalizeShareFilter(filters.minPrimaryChampionShare);

  if (minPrimaryRoleShare !== null) {
    query = query.gte("primary_role_share", minPrimaryRoleShare);
  }

  if (minPrimaryChampionShare !== null) {
    query = query.gte("primary_champion_share", minPrimaryChampionShare);
  }

  if (rankGroup) {
    const group = riotSeedCandidateRankGroupsById.get(rankGroup);

    if (group && group.tiers.length > 0) {
      query = query.eq("rank_enrichment_status", "ranked").in("rank_tier", group.tiers);
    } else {
      query = query.or(
        "rank_tier.is.null,rank_enrichment_status.in.(pending,unranked,not_found,failed)",
      );
    }
  }

  return query;
}

function getRiotSeedCandidateGroupLabel(rankGroup: RiotSeedCandidateRankGroupId) {
  return riotSeedCandidateRankGroupsById.get(rankGroup)?.label ?? "Riot seed";
}

async function fetchRankTierSortedSeedCandidatePage({
  filters,
  page,
  pageSize,
  rankGroup,
  sortDirection,
  supabase,
}: {
  filters: RiotSeedCandidateFilters;
  page: number;
  pageSize: number;
  rankGroup: RiotSeedCandidateRankGroupId;
  sortDirection: "asc" | "desc";
  supabase: SupabaseClient;
}) {
  const group = riotSeedCandidateRankGroupsById.get(rankGroup);

  if (!group || group.tiers.length === 0) {
    return buildRiotSeedCandidateQuery({
      filters,
      rankGroup,
      supabase,
    })
      .order("observed_games", { ascending: false, nullsFirst: false })
      .range((page - 1) * pageSize, page * pageSize - 1)
      .returns<RiotSeedCandidateView[]>();
  }

  const tiers = sortDirection === "asc" ? group.tiers : [...group.tiers].reverse();
  const rows: RiotSeedCandidateView[] = [];
  let offset = (page - 1) * pageSize;
  let remaining = pageSize;

  for (const tier of tiers) {
    if (remaining <= 0) {
      break;
    }

    const { count, error: countError } = await buildRiotSeedCandidateQuery({
      filters,
      rankGroup,
      selectOptions: { count: "exact", head: true },
      supabase,
    }).eq("rank_tier", tier);

    if (countError) {
      return {
        data: null,
        error: countError,
      };
    }

    const tierCount = count ?? 0;

    if (offset >= tierCount) {
      offset -= tierCount;
      continue;
    }

    const from = offset;
    const to = Math.min(tierCount - 1, offset + remaining - 1);
    const { data, error } = await buildRiotSeedCandidateQuery({
      filters,
      rankGroup,
      supabase,
    })
      .eq("rank_tier", tier)
      .order("rank_division", {
        ascending: sortDirection === "asc",
        nullsFirst: false,
      })
      .order("rank_league_points", {
        ascending: sortDirection === "desc",
        nullsFirst: false,
      })
      .order("observed_games", { ascending: false, nullsFirst: false })
      .range(from, to)
      .returns<RiotSeedCandidateView[]>();

    if (error) {
      return {
        data: null,
        error,
      };
    }

    rows.push(...(data ?? []));
    remaining = pageSize - rows.length;
    offset = 0;
  }

  return {
    data: rows,
    error: null,
  };
}

function sortCandidateRows(candidates: RiotSeedCandidateView[], sort: RiotSeedCandidateSort) {
  if (sort !== "rank_tier") {
    return candidates;
  }

  return [...candidates].sort((left, right) => {
    const leftWeight = getRankSortWeight(left);
    const rightWeight = getRankSortWeight(right);

    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }

    return Number(right.rank_league_points ?? -1) - Number(left.rank_league_points ?? -1);
  });
}

function getRankSortWeight(candidate: Pick<RiotSeedCandidateView, "rank_division" | "rank_tier">) {
  const tierOrder = [
    "CHALLENGER",
    "GRANDMASTER",
    "MASTER",
    "DIAMOND",
    "EMERALD",
    "PLATINUM",
    "GOLD",
    "SILVER",
    "BRONZE",
    "IRON",
  ];
  const divisionOrder = ["I", "II", "III", "IV"];
  const tierIndex = tierOrder.indexOf(candidate.rank_tier ?? "");
  const divisionIndex = divisionOrder.indexOf(candidate.rank_division ?? "");

  if (tierIndex === -1) {
    return Number.MAX_SAFE_INTEGER;
  }

  return tierIndex * 10 + (divisionIndex === -1 ? 0 : divisionIndex);
}

function normalizeShareFilter(value: number | undefined) {
  const share = Number(value);

  if (!Number.isFinite(share) || share <= 0) {
    return null;
  }

  if (share > 1) {
    return Math.min(share / 100, 1);
  }

  return Math.min(share, 1);
}

function getRecentSeedCandidateScanCutoff() {
  return new Date(Date.now() - recentSeedCandidateScanHours * 60 * 60 * 1000).toISOString();
}

function getRecentSeedCandidateRankRefreshCutoff() {
  return new Date(
    Date.now() - recentSeedCandidateRankRefreshHours * 60 * 60 * 1000,
  ).toISOString();
}

function getScannerErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes("401") || error.message.includes("403")) {
      return "Riot authentication failed. Check the Riot API key.";
    }

    if (error.message.includes("429") || error.message.toLowerCase().includes("rate limit")) {
      return "Riot rate limit was reached. Try again later or lower the scan size.";
    }

    if (error.message.toLowerCase().includes("fetch")) {
      return "Network failure while contacting Riot.";
    }

    if (
      error.message.startsWith("Database write failed") ||
      error.message.startsWith("Could not fetch current League patch")
    ) {
      return error.message;
    }
  }

  return "Scanner failure. Check the scan inputs and try again.";
}

function getRiotIdLookupErrorMessage(error: unknown) {
  if (error instanceof Error) {
    const errorWithStatus = error as Error & { status?: number };

    if (errorWithStatus.status === 404) {
      return "Riot account not found.";
    }

    if (errorWithStatus.status === 401 || errorWithStatus.status === 403) {
      return "Riot API authentication failed. Check the Riot API key.";
    }

    if (errorWithStatus.status === 429 || error.message.toLowerCase().includes("rate limit")) {
      return "Riot rate limit was reached. Try again later.";
    }

    if (error.message.toLowerCase().includes("fetch")) {
      return "Network error while contacting Riot.";
    }
  }

  return "Riot account lookup failed.";
}

function getRiotRankRefreshErrorMessage(error: Error) {
  const errorWithStatus = error as Error & { status?: number };

  if (errorWithStatus.status === 401 || errorWithStatus.status === 403) {
    return "Riot API authentication failed. Check the Riot API key.";
  }

  if (errorWithStatus.status === 429 || error.message.toLowerCase().includes("rate limit")) {
    return "Riot rank refresh was rate limited. Try again later.";
  }

  if (error.message.toLowerCase().includes("fetch")) {
    return "Network error while contacting Riot rank endpoint.";
  }

  return error.message || "Riot rank refresh failed.";
}

function getRegistryRowLabel(row: { id?: string | null; name?: string | null }) {
  const id = row.id ?? "unknown";

  return row.name ? `${row.name} (${id})` : id;
}
