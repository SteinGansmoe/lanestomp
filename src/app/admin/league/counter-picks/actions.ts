"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  RiotIdResolverInput,
  RiotIdResolverResult,
  RiotIdResolverRow,
  RiotSeedCandidateFilters,
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
import type { LeagueRole } from "@/src/features/league/roles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const maxMatchCount = 50;
const maxDisplayedResultsLimit = 100;
const maxRiotIdsPerBatch = 20;
const defaultRegionalRoute = "europe";
const defaultPlatformRegion = "EUW1";

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

  const validation = validateStartInput(input);

  if (!validation.ok) {
    return validation;
  }

  const { data: insertedJob, error: insertError } = await serviceClientResult.supabase
    .from("riot_scan_jobs")
    .insert({
      counter_champion: validation.mode === "target" ? validation.counterChampion : null,
      created_by: authResult.userId,
      enemy_champion: validation.mode === "target" ? validation.enemyChampion : null,
      match_count: validation.matchCount,
      minimum_games: validation.minimumGames,
      mode: validation.mode,
      progress: {
        maxDisplayedResults: validation.maxDisplayedResults,
        seedCount: validation.seedPuuids.length,
      },
      results: validation.mode === "discovery" ? [] : null,
      role: validation.role,
      seed_puuids: validation.seedPuuids,
      status: "queued",
      summary: {
        currentPatchOnly: validation.currentPatchOnly,
        maxDisplayedResults: validation.maxDisplayedResults,
        seedCount: validation.seedPuuids.length,
      },
    })
    .select(
      "id, mode, status, role, seed_puuids, enemy_champion, counter_champion, match_count, minimum_games, progress, summary, results, error_message, created_at, started_at, completed_at",
    )
    .single<RiotScanJobRow>();

  if (insertError || !insertedJob) {
    return {
      error: "Database write failed while creating the scan job.",
      ok: false,
    };
  }

  if (!process.env.RIOT_API_KEY) {
    const failedJob = await failJob({
      errorMessage: "Missing Riot API configuration.",
      jobId: insertedJob.id,
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

  let query = serviceClientResult.supabase
    .from("riot_seed_candidates")
    .select(
      [
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
      ].join(", "),
    );

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

  if (filters.source && filters.source !== "all") {
    query = query.eq("source", filters.source);
  }

  if (filters.minObservedGames && filters.minObservedGames > 0) {
    query = query.gte("observed_games", Math.trunc(filters.minObservedGames));
  }

  const orderColumn = getCandidateSortColumn(sort);
  const { data, error } = await query
    .order(orderColumn, { ascending: false, nullsFirst: false })
    .limit(Math.min(Math.max(limit, 1), 100))
    .returns<RiotSeedCandidateView[]>();

  if (error) {
    return {
      error: "Seed candidates could not be loaded.",
      ok: false,
    };
  }

  return {
    candidates: data ?? [],
    ok: true,
  };
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
    .select(
      "id, mode, status, role, seed_puuids, enemy_champion, counter_champion, match_count, minimum_games, progress, summary, results, error_message, created_at, started_at, completed_at",
    )
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
    .select(
      "id, mode, status, role, seed_puuids, enemy_champion, counter_champion, match_count, minimum_games, progress, summary, results, error_message, created_at, started_at, completed_at",
    )
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

    const patch = input.currentPatchOnly ? await fetchCurrentPatch() : null;
    const riot = new RiotApiClient({
      apiKey: process.env.RIOT_API_KEY ?? "",
      regionalRoute: process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute,
      requestDelayMs: Number(process.env.RIOT_REQUEST_DELAY_MS ?? 1200),
    });
    const platformRegion = process.env.RIOT_PLATFORM_REGION ?? defaultPlatformRegion;
    const regionalRouting = process.env.RIOT_REGIONAL_ROUTING ?? defaultRegionalRoute;
    const progressBase = {
      currentPatchOnly: input.currentPatchOnly,
      maxDisplayedResults: input.maxDisplayedResults,
      seedCount: input.seedPuuids.length,
    };
    const scanResult = await scanRiotCounterPickMatchups({
      discover: input.mode === "discovery",
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
      observations: scanResult.observations,
      scanJobId: jobId,
      supabase,
    });
    const candidatePersistenceResult = await persistSeedCandidatesFromObservations({
      observations: scanResult.candidateObservations,
      scanJobId: jobId,
      source: "match_discovery",
      supabase,
    });
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
      candidateObservationResolutionFailures:
        candidatePersistenceResult.candidateObservationResolutionFailures,
      candidateObservationsFound: candidatePersistenceResult.candidateObservationsFound,
      candidateObservationsInserted: candidatePersistenceResult.candidateObservationsInserted,
      candidateProfileFailures: candidatePersistenceResult.candidateProfileFailures,
      candidateProfilesRebuilt: candidatePersistenceResult.candidateProfilesRebuilt,
      candidateUniqueIdResolutionFailures:
        candidatePersistenceResult.candidateUniqueIdResolutionFailures,
      existingCandidatesUpdated: candidatePersistenceResult.existingCandidatesUpdated,
      newCandidatesCreated: candidatePersistenceResult.newCandidatesCreated,
      observationDuplicatesSkipped: persistenceResult.duplicateObservationsSkipped,
      observationInsertFailures: persistenceResult.insertFailures,
      observationsFound: persistenceResult.observationsFound,
      observationsInserted: persistenceResult.insertedObservations,
      participantPuuidsObserved: candidatePersistenceResult.participantPuuidsObserved,
      statsRowsUpdated: persistenceResult.statsRowsUpdated,
      uniqueCandidatesEncountered: candidatePersistenceResult.uniqueCandidatesEncountered,
    };
    const discoveryResults = scanResult.discoveryResults as RiotScanDiscoveryResult[];
    const results =
      input.mode === "discovery"
        ? discoveryResults
            .filter((result) => result.games >= input.minimumGames)
            .slice(0, input.maxDisplayedResults)
            .map((result) => ({
              ...result,
              representedInStats: persistenceResult.statsRowsUpdated > 0,
            }))
        : getPersistedTargetResult({
            result: scanResult.targetResult as RiotScanTargetResult | null,
            updatedStats: persistenceResult.updatedStats,
          });
    const didCandidatePersistenceFail =
      candidatePersistenceResult.candidateIdLookupChunkFailures > 0 ||
      candidatePersistenceResult.candidateUniqueIdResolutionFailures > 0 ||
      candidatePersistenceResult.candidateObservationResolutionFailures > 0 ||
      candidatePersistenceResult.candidateObservationInsertFailures > 0 ||
      candidatePersistenceResult.candidateProfileFailures > 0;
    const didPersistenceFail = persistenceResult.insertFailures > 0 || didCandidatePersistenceFail;
    const persistenceErrorMessage = didCandidatePersistenceFail
      ? getCandidatePersistenceErrorMessage(persistedSummary)
      : persistenceResult.insertFailures > 0
        ? "One or more persistence steps failed. Saved data was preserved where possible."
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
  } catch (error) {
    await failJob({
      errorMessage: getScannerErrorMessage(error),
      jobId,
      supabase,
    });
  }
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
    .select(
      "id, mode, status, role, seed_puuids, enemy_champion, counter_champion, match_count, minimum_games, progress, summary, results, error_message, created_at, started_at, completed_at",
    )
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

type ValidatedStartInput = {
  counterChampion: string;
  currentPatchOnly: boolean;
  enemyChampion: string;
  matchCount: number;
  maxDisplayedResults: number;
  minimumGames: number;
  mode: RiotScanMode;
  role: LeagueRole;
  seedPuuids: string[];
};

function validateStartInput(input: StartRiotScanJobInput):
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

  if (mode === "target" && (!enemyChampion || !counterChampion)) {
    return {
      error: "Target scans require enemy and counter champions.",
      ok: false,
    };
  }

  if (
    mode === "target" &&
    normalizeChampionId(enemyChampion) === normalizeChampionId(counterChampion)
  ) {
    return {
      error: "Enemy and counter champion cannot be the same.",
      ok: false,
    };
  }

  return {
    counterChampion,
    currentPatchOnly: input.currentPatchOnly,
    enemyChampion,
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

function normalizeChampionId(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getCandidateSortColumn(sort: RiotSeedCandidateSort) {
  switch (sort) {
    case "created_at":
      return "created_at";
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

function getRegistryRowLabel(row: { id?: string | null; name?: string | null }) {
  const id = row.id ?? "unknown";

  return row.name ? `${row.name} (${id})` : id;
}
