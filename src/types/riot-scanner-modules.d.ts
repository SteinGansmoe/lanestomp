declare module "@/scripts/lib/riot-api-client.mjs" {
  export class RiotApiError extends Error {
    status?: number;
    url?: string;
  }

  export class RiotApiClient {
    constructor(options: { apiKey: string; regionalRoute?: string; requestDelayMs?: number });
  }
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
  export function scanRiotCounterPickMatchups(options: {
    discover?: boolean;
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
    observations: Record<string, unknown>[];
    scanJobId?: number | null;
    source?: string;
    supabase: unknown;
  }): Promise<{
    candidateIdLookupChunkFailures: number;
    candidateIdLookupChunks: number;
    candidateIdResolutionFailures: number;
    candidateIdsResolved: number;
    candidateObservationDuplicatesSkipped: number;
    candidateObservationInsertFailures: number;
    candidateObservationResolutionFailures: number;
    candidateObservationsFound: number;
    candidateObservationsInserted: number;
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
    observations: Record<string, unknown>[];
    scanJobId?: number | null;
    supabase: unknown;
  }): Promise<{
    affectedGroups: Record<string, unknown>[];
    duplicateObservationsSkipped: number;
    insertedObservations: number;
    insertFailures: number;
    observationsFound: number;
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
    patch?: string | null;
    role?: string | null;
    supabase: unknown;
  }): Promise<{
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
