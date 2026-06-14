import type { LeagueRole } from "./roles";

export type RiotScanMode = "target" | "discovery";
export type RiotScanStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type RiotScanSummary = {
  candidateDiscoverySkipped?: number;
  candidateIdLookupChunkFailures?: number;
  candidateIdLookupChunks?: number;
  candidateIdResolutionFailures?: number;
  candidateIdsResolved?: number;
  candidateObservationDuplicatesSkipped?: number;
  candidateObservationInsertFailures?: number;
  candidateObservationResolutionFailures?: number;
  candidateObservationsFound?: number;
  candidateObservationsInserted?: number;
  candidateProfileFailures?: number;
  candidateProfilesRebuilt?: number;
  candidateUniqueIdResolutionFailures?: number;
  championPairMatched?: number;
  existingCandidatesUpdated?: number;
  fetchedMatchIds?: number;
  games?: number;
  losses?: number;
  matchesScanned?: number;
  matchupPairsDiscovered?: number;
  newCandidatesCreated?: number;
  patch?: string | null;
  patchSkipped?: number;
  queueSkipped?: number;
  role?: LeagueRole;
  roleSkipped?: number;
  seedCount?: number;
  participantPuuidsObserved?: number;
  observationDuplicatesSkipped?: number;
  observationInsertFailures?: number;
  observationsFound?: number;
  observationsInserted?: number;
  statsRowsUpdated?: number;
  targetMatches?: number;
  uniqueCandidatesEncountered?: number;
  uniqueMatchIds?: number;
  wins?: number;
};

export type RiotSeedCandidateSource =
  | "ladder_import"
  | "manual"
  | "match_discovery"
  | "riot_id_resolver";
export type RiotSeedCandidateStatus =
  | "active"
  | "approved"
  | "candidate"
  | "cooldown"
  | "failed"
  | "ignored"
  | "queued";

export type RiotSeedCandidateTopChampion = {
  champion: string;
  games: number;
  lastPlayedAt: string | null;
  losses: number;
  role: LeagueRole;
  share: number;
  wins: number;
};

export type RiotSeedCandidateRoleDistribution = Partial<
  Record<
    LeagueRole,
    {
      games: number;
      share: number;
    }
  >
>;

export type RiotSeedCandidateView = {
  consecutive_scan_failures: number;
  created_at: string;
  estimated_primary_role: LeagueRole | null;
  estimated_secondary_role: LeagueRole | null;
  failed_scan_count: number;
  first_seen_at: string;
  first_seen_match_id: string | null;
  first_seen_scan_job_id: number | null;
  id: string;
  last_profiled_at: string | null;
  last_scanned_at: string | null;
  last_seen_at: string;
  latest_match_seen_at: string | null;
  next_eligible_scan_at: string | null;
  observed_games: number;
  platform_region: string;
  primary_champion: string | null;
  primary_champion_games: number;
  primary_champion_role: LeagueRole | null;
  primary_champion_share: number | null;
  primary_role_share: number | null;
  puuid: string;
  regional_routing: string;
  role_distribution: RiotSeedCandidateRoleDistribution;
  secondary_role_share: number | null;
  source: RiotSeedCandidateSource;
  status: RiotSeedCandidateStatus;
  successful_scan_count: number;
  times_scanned: number;
  top_champions: RiotSeedCandidateTopChampion[];
};

export type RiotSeedCandidateFilters = {
  minObservedGames?: number;
  platformRegion?: string;
  primaryChampion?: string;
  primaryRole?: LeagueRole | "all";
  source?: RiotSeedCandidateSource | "all";
  status?: RiotSeedCandidateStatus | "all";
};

export type RiotSeedCandidateSort =
  | "created_at"
  | "last_seen_at"
  | "observed_games"
  | "primary_champion_share"
  | "primary_role_share";

export type RiotSeedCandidatesResult =
  | {
      candidates: RiotSeedCandidateView[];
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

export type RiotScanTargetResult = {
  counterChampion: string;
  enemyChampion: string;
  games: number;
  losses: number;
  role: LeagueRole;
  tier: string;
  storedGamesAfterAggregation?: number;
  wasWrittenToStats: boolean;
  winRate: number;
  wins: number;
};

export type RiotScanDiscoveryResult = {
  championA: string;
  championAWins: number;
  championAWinRate: number;
  championB: string;
  championBWins: number;
  championBWinRate: number;
  games: number;
  representedInStats?: boolean;
  role: LeagueRole;
};

export type RiotScanJobView = {
  completed_at: string | null;
  counter_champion: string | null;
  created_at: string;
  enemy_champion: string | null;
  error_message: string | null;
  id: number;
  match_count: number;
  minimum_games: number;
  mode: RiotScanMode;
  progress: RiotScanSummary;
  results: RiotScanDiscoveryResult[] | RiotScanTargetResult | null;
  role: LeagueRole;
  seed_count: number;
  started_at: string | null;
  status: RiotScanStatus;
  summary: RiotScanSummary;
};

export type StartRiotScanJobInput = {
  accessToken: string;
  counterChampion?: string | null;
  currentPatchOnly: boolean;
  enemyChampion?: string | null;
  matchCount: number;
  maxDisplayedResults: number;
  minimumGames: number;
  mode: RiotScanMode;
  role: LeagueRole;
  seedPuuids: string[];
};

export type RiotScanJobResult =
  | {
      job: RiotScanJobView;
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

export type RiotScanJobsResult =
  | {
      jobs: RiotScanJobView[];
      ok: true;
    }
  | {
      error: string;
      ok: false;
    };

export type RiotIdResolverInput = {
  accessToken: string;
  riotIds: string[];
};

export type RiotIdResolverRow =
  | {
      error: string;
      gameName: string | null;
      ok: false;
      originalRiotId: string;
      puuid: null;
      riotId: string;
      tagLine: string | null;
    }
  | {
      error: null;
      gameName: string;
      ok: true;
      originalRiotId: string;
      puuid: string;
      riotId: string;
      tagLine: string;
    };

export type RiotIdResolverResult =
  | {
      failedCount: number;
      ok: true;
      results: RiotIdResolverRow[];
      successCount: number;
      uniqueCount: number;
    }
  | {
      error: string;
      ok: false;
    };
