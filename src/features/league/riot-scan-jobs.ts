import type { LeagueRole } from "./roles";

export type RiotScanMode = "target" | "discovery";
export type RiotScanStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type RiotScanSummary = {
  championPairMatched?: number;
  fetchedMatchIds?: number;
  games?: number;
  losses?: number;
  matchesScanned?: number;
  matchupPairsDiscovered?: number;
  patch?: string | null;
  patchSkipped?: number;
  queueSkipped?: number;
  role?: LeagueRole;
  roleSkipped?: number;
  seedCount?: number;
  observationDuplicatesSkipped?: number;
  observationInsertFailures?: number;
  observationsFound?: number;
  observationsInserted?: number;
  statsRowsUpdated?: number;
  targetMatches?: number;
  uniqueMatchIds?: number;
  wins?: number;
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
