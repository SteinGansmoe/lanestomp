type RiotObservationValidationIssueSummary = {
  issuesByCode: Record<string, number>;
  samples: Array<{
    code: string;
    field: string;
    matchId: string | null;
    safeValue: string | null;
  }>;
  totalRejected: number;
};

type RiotPersistenceFailureSample = {
  errorClass: string;
  errorCode: string | null;
  message: string;
  rowIdentity: string;
  safeFields: Record<string, string | number | boolean | null>;
  table: string;
};

type RiotPersistenceErrorGroup = {
  errorClass: string;
  errorCode: string | null;
  failureCount: number;
  httpStatus: number | null;
  messageFingerprint: string;
};

declare module "@/scripts/lib/riot-api-client.mjs" {
  export class RiotApiError extends Error {
    status?: number;
    url?: string;
  }

  export class RiotApiClient {
    constructor(options: {
      apiKey: string;
      regionalRoute?: string;
      requestDelayMs?: number;
      retryOnRateLimit?: boolean;
    });
    fetchLeagueEntriesByPuuid(options: {
      platformRegion: string;
      puuid: string;
    }): Promise<unknown[]>;
  }
}

declare module "@/scripts/lib/riot-seed-rank-enrichment.mjs" {
  export const maxAdminRankRefreshBatchSize: number;
  export const rankEnrichmentStatuses: string[];
  export function createSupabaseRankRepository(supabase: unknown): unknown;
  export function enrichRiotSeedCandidateRanks(options: {
    candidateIds?: string[] | null;
    force?: boolean;
    limit?: number;
    platformRegion?: string | null;
    puuid?: string | null;
    repository: unknown;
    riot: unknown;
    status?: string | null;
  }): Promise<{
    failedCount: number;
    notFoundCount: number;
    ok: true;
    rankedCount: number;
    rateLimitedCount: number;
    results: unknown[];
    skippedCount: number;
    snapshotInsertedCount: number;
    total: number;
    unrankedCount: number;
  }>;
  export function getRankSortWeight(candidate: {
    rank_division?: string | null;
    rank_tier?: string | null;
  }): number;
}

declare module "@/scripts/lib/matchup-rank-coverage-queue.mjs" {
  export const maxMatchupRankCoverageLimit: number;
  export function createSupabaseMatchupRankCoverageRepository(supabase: unknown): unknown;
  export function ensureMatchupRankCoverageCandidates(options: {
    participants: Array<{
      platformRegion: string;
      puuid: string;
    }>;
    repository: unknown;
  }): Promise<{
    candidateIds: string[];
    createdCount: number;
    existingCount: number;
    requestedCount: number;
  }>;
  export function getProjectedMatchupRankCoverageImpact(
    candidates: unknown[],
  ): {
    observationsAffected: number;
    twoPlayerUpgradePotential: number;
    unknownObservationsAffected: number;
  };
  export function loadMatchupRankCoverageQueue(options: {
    filters?: Record<string, unknown>;
    limit?: number;
    repository: unknown;
    sort?: string;
    sortDirection?: "asc" | "desc";
  }): Promise<{
    candidates: unknown[];
    projectedImpact: {
      observationsAffected: number;
      twoPlayerUpgradePotential: number;
      unknownObservationsAffected: number;
    };
    summary: {
      anyRankCoveragePercent: number;
      singlePlayer: number;
      strictCoveragePercent: number;
      totalObservations: number;
      twoPlayerAverage: number;
      unknown: number;
    };
  }>;
}

declare module "@/scripts/lib/riot-rank-brackets.mjs" {
  export const MAX_RANK_SNAPSHOT_DISTANCE_DAYS: number;
  export const counterPickRankBrackets: string[];
  export const matchupRankAttributionMethods: string[];
  export const riotRankTiers: string[];
  export function getCounterPickAggregateRankBrackets(rankBracket: unknown): string[];
  export function getRankBracketFromRank(rank: {
    division?: string | null;
    tier?: string | null;
  }): string;
  export function getRankBracketFromScore(score: unknown): string;
  export function getRankScore(rank: {
    division?: string | null;
    tier?: string | null;
  }): number | null;
  export function getRankSortWeight(candidate: {
    division?: string | null;
    rank_division?: string | null;
    rank_tier?: string | null;
    tier?: string | null;
  }): number;
  export function isCounterPickRankBracket(value: unknown): boolean;
  export function isMatchupRankAttributionMethod(value: unknown): boolean;
  export function normalizeRiotRankDivision(value: unknown): string | null;
  export function normalizeRiotRankTier(value: unknown): string | null;
}

declare module "@/scripts/lib/riot-matchup-rank-attribution.mjs" {
  export function attributeStoredMatchupRankBrackets(options: {
    filters?: {
      champion?: string | null;
      matchId?: string | null;
      patch?: string | null;
      role?: string | null;
    };
    force?: boolean;
    limit?: number;
    repository: unknown;
  }): Promise<{
    results: unknown[];
    summary: {
      alreadyAttributed: number;
      failures: number;
      participantsNotFound: number;
      processed: number;
      singlePlayer: number;
      snapshotTooOld: number;
      total: number;
      twoPlayerAverage: number;
      unknown: number;
    };
  }>;
  export function createSupabaseMatchupRankAttributionRepository(supabase: unknown): unknown;
}

declare module "@/scripts/lib/riot-counter-pick-scanner.mjs" {
  export const rankedSoloDuoQueueId: number;
  export function calculateTier(options: { games: number; winRate: number }): string;
  export function fetchCurrentPatch(): Promise<string>;
  export function normalizeRole(
    value: unknown,
  ): "top" | "jungle" | "mid" | "adc" | "support" | null;
  export function getParticipantRole(
    value: unknown,
  ): "top" | "jungle" | "mid" | "adc" | "support" | null;
  export function getFocusedDiscoveryResultsFromObservations(options: {
    focusChampion: string;
    observations: Record<string, unknown>[];
    registry: unknown;
    role: string;
  }): unknown[];
  export function scanRiotCounterPickMatchups(options: {
    championRegistry: unknown;
    discover?: boolean;
    focusChampionId?: string | null;
    logger?: { log: (message: string) => void } | null;
    matchCount?: number;
    onProgress?: ((progress: Record<string, unknown>) => Promise<void> | void) | null;
    patch?: string | null;
    platformRegion?: string;
    queue?: number;
    regionalRouting?: string;
    riot: unknown;
    role: string;
    seedPuuids: string[];
    target?: {
      counterChampionId: string;
      enemyChampionId: string;
    } | null;
  }): Promise<{
    candidateObservations: Record<string, unknown>[];
    discoveryResults: unknown[];
    focusObservationKeys: string[];
    observations: Record<string, unknown>[];
    summary: Record<string, unknown>;
    targetResult: Record<string, unknown> | null;
  }>;
  export function uniqueValues(values: unknown[]): string[];
}

declare module "@/scripts/lib/riot-seed-candidates.mjs" {
  export const defaultPlatformRegion: string;
  export const defaultRegionalRouting: string;
  export function createCandidateIdentityKey(platformRegion: string, puuid: string): string;
  export function normalizePlatformRegion(value: unknown): string;
  export function normalizeRegionalRouting(value: unknown): string;
  export function persistSeedCandidatesFromObservations(options: {
    championRegistry?: unknown;
    observations: Record<string, unknown>[];
    scanJobId?: number | null;
    source?: string;
    supabase: unknown;
    validationContext?: unknown;
  }): Promise<{
    candidateIdLookupChunkFailures: number;
    candidateIdLookupChunks: number;
    candidateIdResolutionFailures: number;
    candidateIdsResolved: number;
    candidateObservationDuplicatesSkipped: number;
    candidateObservationInsertFailures: number;
    candidateObservationBatchAttempts: number;
    candidateObservationSuccessfulBatches: number;
    candidateObservationFailedBatchAttempts: number;
    candidateObservationBatchSplits: number;
    candidateObservationTransientRetries: number;
    candidateObservationIsolatedFailures: number;
    candidateObservationUnresolvedBatchFailures: number;
    candidateObservationPersistenceFailureSamples: RiotPersistenceFailureSample[];
    candidateObservationPersistenceErrorGroups: RiotPersistenceErrorGroup[];
    candidateObservationResolutionFailures: number;
    candidateObservationValidationFailures: number;
    candidateObservationValidationSummary: RiotObservationValidationIssueSummary;
    candidateObservationsFound: number;
    candidateObservationsInserted: number;
    candidateObservationsRejected: number;
    candidateObservationsValidated: number;
    candidateProfileFailures: number;
    candidateProfilesRebuilt: number;
    candidateUniqueIdResolutionFailures: number;
    existingCandidatesUpdated: number;
    newCandidatesCreated: number;
    participantPuuidsObserved: number;
    uniqueCandidatesEncountered: number;
  }>;
  export function rebuildSeedCandidateProfiles(options: {
    candidateIds?: string[] | null;
    platformRegion?: string | null;
    puuid?: string | null;
    supabase: unknown;
  }): Promise<{
    profileFailures: number;
    profilesRebuilt: number;
  }>;
  export function upsertSeedCandidatesFromPuuids(options: {
    platformRegion?: string;
    puuids: string[];
    regionalRouting?: string;
    source?: string;
    supabase: unknown;
  }): Promise<{
    candidatesByKey: Map<string, unknown>;
    existingCandidatesUpdated: number;
    newCandidatesCreated: number;
  }>;
}

declare module "@/scripts/lib/riot-counter-pick-aggregation.mjs" {
  export function getDirectedAggregateRows(observations: unknown[]): unknown[];
  export function persistObservationsAndRebuildStats(options: {
    championRegistry?: unknown;
    observations: Record<string, unknown>[];
    scanJobId?: number | null;
    supabase: unknown;
    validationContext?: unknown;
  }): Promise<{
    affectedGroups: Record<string, unknown>[];
    counterPickAggregateValidationFailures: number;
    counterPickAggregateValidationSummary: RiotObservationValidationIssueSummary;
    counterPickAggregatesValidated: number;
    counterPickAggregateInsertFailures: number;
    counterPickAggregateBatchAttempts: number;
    counterPickAggregateSuccessfulBatches: number;
    counterPickAggregateFailedBatchAttempts: number;
    counterPickAggregateBatchSplits: number;
    counterPickAggregateTransientRetries: number;
    counterPickAggregateIsolatedFailures: number;
    counterPickAggregateUnresolvedBatchFailures: number;
    counterPickAggregatePersistenceFailureSamples: RiotPersistenceFailureSample[];
    counterPickAggregatePersistenceErrorGroups: RiotPersistenceErrorGroup[];
    duplicateObservationsSkipped: number;
    insertedObservations: number;
    insertFailures: number;
    matchupObservationBatchAttempts: number;
    matchupObservationSuccessfulBatches: number;
    matchupObservationFailedBatchAttempts: number;
    matchupObservationBatchSplits: number;
    matchupObservationTransientRetries: number;
    matchupObservationIsolatedFailures: number;
    matchupObservationUnresolvedBatchFailures: number;
    matchupObservationPersistenceFailureSamples: RiotPersistenceFailureSample[];
    matchupObservationPersistenceErrorGroups: RiotPersistenceErrorGroup[];
    matchupObservationValidationFailures: number;
    matchupObservationValidationSummary: RiotObservationValidationIssueSummary;
    matchupObservationsRejected: number;
    matchupObservationsValidated: number;
    matchupRankAttributionFailures: number;
    matchupRankAttributionsAttempted: number;
    matchupRankAttributionsSinglePlayer: number;
    matchupRankAttributionsTwoPlayer: number;
    matchupRankAttributionsUnknown: number;
    matchupRankParticipantsNotFound: number;
    matchupRankSnapshotTooOld: number;
    observationsFound: number;
    insertedObservationKeys: string[];
    duplicateObservationKeys: string[];
    statsRowsUpdated: number;
    updatedStats: Array<{
      counter_champion_id: string;
      enemy_champion_id: string;
      games: number;
      losses: number;
      patch: string;
      role: string;
      tier: string;
      win_rate: number;
      wins: number;
    }>;
  }>;
  export function rebuildCounterPickStatsFromObservations(options: {
    champion?: string | null;
    championRegistry?: unknown;
    patch?: string | null;
    role?: string | null;
    supabase: unknown;
    validationContext?: unknown;
  }): Promise<{
    counterPickAggregateValidationFailures: number;
    counterPickAggregateValidationSummary: RiotObservationValidationIssueSummary;
    counterPickAggregatesValidated: number;
    counterPickAggregateInsertFailures: number;
    counterPickAggregateBatchAttempts: number;
    counterPickAggregateSuccessfulBatches: number;
    counterPickAggregateFailedBatchAttempts: number;
    counterPickAggregateBatchSplits: number;
    counterPickAggregateTransientRetries: number;
    counterPickAggregateIsolatedFailures: number;
    counterPickAggregateUnresolvedBatchFailures: number;
    counterPickAggregatePersistenceFailureSamples: RiotPersistenceFailureSample[];
    counterPickAggregatePersistenceErrorGroups: RiotPersistenceErrorGroup[];
    statsRowsUpdated: number;
    updatedStats: unknown[];
  }>;
}

declare module "@/scripts/lib/riot-account-lookup.mjs" {
  export function parseRiotId(value: unknown):
    | {
        error: string;
        gameName: null;
        ok: false;
        originalRiotId: string;
        tagLine: null;
      }
    | {
        gameName: string;
        ok: true;
        originalRiotId: string;
        tagLine: string;
      };
  export function resolveRiotAccountByRiotId(options: {
    gameName: string;
    riot: unknown;
    tagLine: string;
  }): Promise<{
    gameName: string;
    puuid: string;
    riotId: string;
    tagLine: string;
  }>;
  export function uniqueRiotIds(values: unknown[]): string[];
}

declare module "@/scripts/lib/league-champion-registry.mjs" {
  export function getLeagueChampionRegistryStatus(options: {
    locale?: string;
    supabase: unknown;
    version?: string | null;
  }): Promise<{
    activeDatabaseChampionCount: number;
    conflicts: string[];
    databaseChampionCount: number;
    inactiveReturnedByRiot: Array<{
      id: string;
      name: string;
    }>;
    lastSyncedAt: string | null;
    lastSyncError: string | null;
    lastSyncStatus: string;
    missing: Array<{
      id: string;
      name: string;
    }>;
    nameMismatches: Array<{
      databaseName: string;
      id: string;
      sourceName: string;
    }>;
    ok: boolean;
    sourceChampionCount: number;
    sourceVersion: string;
    unknown: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

declare module "@/scripts/lib/league-champion-normalizer.mjs" {
  export type ChampionRegistryEntry = {
    canonicalKey: string;
    displayName: string;
    riotDataKey: string | null;
    riotNumericKey: string | null;
    slug: string | null;
  };

  export type ChampionRegistry = {
    byCanonicalKey: Map<string, ChampionRegistryEntry>;
    entries: ChampionRegistryEntry[];
  };

  export function loadActiveChampionRegistry(options: {
    supabase: unknown;
  }): Promise<ChampionRegistry>;
  export function normalizeChampionIdentifier(
    value: unknown,
    registry: ChampionRegistry | unknown,
  ): ChampionRegistryEntry | null;
}

declare module "@/scripts/lib/riot-observation-validation.mjs" {
  export function createObservationValidationContext(options?: {
    activeChampionIds?: string[] | Set<string> | null;
    candidateIds?: string[] | Set<string> | null;
    championRegistry?: unknown;
    platformRouting?: Record<string, string>;
    queues?: number[];
  }): unknown;
  export function exceedsValidationFailureRate(options: {
    rejected: number | undefined;
    validated: number | undefined;
  }): boolean;
  export function validateRoutingConfiguration(options: {
    context: unknown;
    platformRegion: string;
    regionalRouting: string;
  }): {
    issues: Array<{
      code: string;
      field: string;
    }>;
    ok: boolean;
  };
}
