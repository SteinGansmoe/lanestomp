# Counter Pick Data Pipeline Audit

Issue: https://github.com/SteinGansmoe/lanestomp/issues/246

Scope: this audit maps the current Riot scan -> stored observations -> aggregate stats -> public Counter Pick flow. It documents what the implementation does today and adds observability around completed scan jobs. It does not redesign the pipeline or change stat math.

## Current Flow

1. Admin opens `src/components/admin/league/riot-match-scanner-panel.tsx`.
2. Admin resolves Riot IDs or selects seed candidates.
3. Admin starts a target or discovery scan through `startRiotScanJob` in `src/app/admin/league/counter-picks/actions.ts`.
4. `runRiotScanJob` loads the champion registry, Riot API client, validation context, and current patch filter.
5. `scanRiotCounterPickMatchups` in `scripts/lib/riot-counter-pick-scanner.mjs` fetches recent ranked match IDs per seed PUUID, dedupes match IDs, fetches matches, normalizes champions, creates matchup observations, and creates seed candidate observations.
6. `persistObservationsAndRebuildStats` in `scripts/lib/riot-counter-pick-aggregation.mjs` dedupes observations by `match_id + role`, validates rows, inserts new `riot_matchup_observations`, attributes rank brackets for inserted rows, rebuilds affected `counter_pick_stats` groups, and returns persistence/aggregation counts.
7. `persistSeedCandidatesFromObservations` in `scripts/lib/riot-seed-candidates.mjs` persists participant seed candidates and `riot_seed_candidate_observations`, then rebuilds seed profiles.
8. `runRiotScanJob` stores summary/results on `riot_scan_jobs` and marks selected seeds as succeeded or failed.
9. Public Counter Pick UI loads `counter_pick_stats` through `fetchCounterPickStatsForSelectedChampion` and combines stats with reviewed explanation/build fields from `league_counter_picks`.

## Admin Actions

| UI label | Component | Server action/file | Inputs | DB reads | DB writes | Starts scan | Triggers aggregation | Next admin step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Refresh registry | `LeagueChampionRegistryStatusPanel` | `getLeagueChampionRegistryAdminStatus`, `src/app/admin/league/counter-picks/actions.ts` | Admin access token | `league_champions`, `league_champion_registry_sync_state` | None | No | No | Fix/sync registry if health check reports missing, inactive, or conflicting champions. |
| Resolve players | `RiotIdResolverPanel` | `resolveRiotIdsToPuuids`, same file | Riot IDs, platform/route defaults | Existing `riot_seed_candidates` by PUUID | Upserts `riot_seed_candidates` with source `riot_id_resolver` | No | No | Add resolved PUUIDs to scanner or review seed candidates. |
| Add to scanner | `ResolverResultRow` | Client-only state update | Resolved PUUID | None | None | No | No | Start scan with that PUUID. |
| Refresh queue | `MatchupRankCoverageQueuePanel` | `getMatchupRankCoverageQueue`, same file | Filters, sort, limit | `riot_matchup_observations`, `riot_seed_candidates`, rank fields | None | No | No | Select participants missing rank coverage. |
| Refresh rank for selected | `MatchupRankCoverageQueuePanel` | `refreshMatchupRankCoverageParticipants`, same file | Participant PUUIDs, force flag | `riot_seed_candidates`, Riot rank API data | `riot_seed_candidates`, `riot_seed_candidate_rank_snapshots` | No | No | Re-run rank attribution so stored observations can move out of `unknown`. |
| Re-run attribution | `MatchupRankCoverageQueuePanel` | `rerunMatchupRankCoverageAttribution`, same file | Coverage filters | `riot_matchup_observations`, `riot_seed_candidates`, `riot_seed_candidate_rank_snapshots` | Updates rank attribution fields on `riot_matchup_observations`; rebuilds affected `counter_pick_stats` | No | Yes, via stored observation rebuild | Refresh public stats or continue rank coverage work. |
| Refresh candidates | `RiotSeedCandidatesPanel` | `getPaginatedRiotSeedCandidates`, same file | Group/page/filter/sort inputs | `riot_seed_candidates` | None | No | No | Select seed candidates. |
| Add selected to scanner | `RiotSeedCandidatesPanel` | Client-only state update | Selected candidates | None | None | No | No | Start scan from the scanner card. |
| Refresh rank for selected | `RiotSeedCandidatesPanel` | `refreshRiotSeedCandidateRanks`, same file | Candidate IDs, force flag | `riot_seed_candidates`, Riot rank API data | `riot_seed_candidates`, `riot_seed_candidate_rank_snapshots` | No | No | Scan ranked seeds or use rank coverage queue. |
| Scan selected | `RiotSeedCandidatesPanel` | `startRiotScanJob`, same file | Selected PUUIDs, mode, role, match count, optional target/focus champion, current patch filter | `riot_scan_jobs`, champion registry, seed metadata | Inserts `riot_scan_jobs`; later writes observations, candidates, stats, job summary | Yes | Yes | Open job details and inspect summary/results. |
| Refresh jobs | `Riot Match Scanner` | `getRecentRiotScanJobs`, same file | Limit | `riot_scan_jobs` | None | No | No | Open a completed or failed job. |
| Start scan | `Riot Match Scanner` | `startRiotScanJob`, same file | Manual PUUIDs, mode, role, match count, target/focus champion, current patch filter | Same as Scan selected | Same as Scan selected | Yes | Yes | Watch job details, then review public Counter Pick output. |
| Open details | Recent jobs list | Client state plus `getRiotScanJob` while polling | Scan job ID | `riot_scan_jobs` | None | No | No | Review progress, validation, persistence, rank attribution, and aggregate counts. |

## Discovery Scan Trace

For a successful focused discovery scan:

1. `startRiotScanJob` validates the admin token, role, seed PUUIDs, scan limits, and optional focus champion.
2. A `riot_scan_jobs` row is inserted with `status = queued`, then `runRiotScanJob` starts asynchronously and marks it `running`.
3. Selected seed candidates are marked scan-running so the admin UI can avoid accidental immediate re-use.
4. The scanner fetches recent ranked solo/duo match IDs per seed PUUID.
5. Match IDs are deduped in memory before match fetch. `fetchedMatchIds` is the raw total returned by Riot; `uniqueMatchIds` is the deduped set.
6. Each fetched match is skipped when patch or queue does not match the scan request.
7. Participants are normalized against the canonical champion registry.
8. The role matchup is converted into one canonical observation for that match and role.
9. Focused discovery results are calculated from in-memory observations for the job result payload.
10. Matchup observations are deduped again by `match_id + role`, validated, inserted into `riot_matchup_observations` with `ignoreDuplicates: true`, and rank-attributed if newly inserted.
11. Affected champion-pair/role/patch groups are rebuilt from stored observations into `counter_pick_stats`.
12. Participant candidate observations are persisted to `riot_seed_candidate_observations`; seed candidate profiles are updated.
13. Job `progress`, `summary`, `results`, `completed_at`, and final `status` are written to `riot_scan_jobs`.

## Table Responsibilities

| Table | Responsibility | Notes |
| --- | --- | --- |
| `riot_scan_jobs` | Admin-only job ledger and progress/result store. | Holds mode, role, seed PUUIDs, target/focus champions, progress JSON, summary JSON, results JSON, error message, and timestamps. It is the primary admin-facing observability record. |
| `riot_seed_candidates` | Durable seed player pool. | Stores PUUID, platform/route, source, scan state, profile summaries, rank enrichment state, and rank totals. It should not be public. |
| `riot_seed_candidate_observations` | Per-candidate match participation history. | Unique by `candidate_id + match_id`. Used to rebuild seed profiles and discover good future seed candidates. It is not the source of public matchup stats. |
| `riot_matchup_observations` | Source of truth for public Counter Pick matchup data. | Unique by `match_id + role`, because a ranked match has one matchup per role. Stores canonical champion pair, winner, rank attribution fields, patch, queue, and timing. |
| `counter_pick_stats` | Derived directed aggregate cache for public Counter Pick stats. | Unique by `enemy_champion_id + counter_champion_id + role + patch + rank_bracket`. Rebuilt from `riot_matchup_observations`, not edited by the scanner directly. |
| `league_champions` | Canonical champion registry used by scanner and public UI. | The issue calls this `league_champion_registry`; in the current schema the registry table is `league_champions`, with sync metadata in `league_champion_registry_sync_state`. |

## Aggregation Behavior

- Aggregation is automatic inside scan completion. It is called by `persistObservationsAndRebuildStats` immediately after observation persistence.
- Rows are deduped before validation by `match_id + role`.
- Invalid observations are rejected before insert and never aggregate.
- Existing observations are skipped by Supabase `upsert(..., { ignoreDuplicates: true, onConflict: "match_id,role" })`.
- Affected aggregate groups are based on successful observation writes, including duplicate rows that were successfully processed by the resilient writer. This can trigger a rebuild for an already-known group, but duplicates are not counted twice because the rebuild reads stored observations from `riot_matchup_observations`.
- `rebuildCounterPickStatsForGroups` loads all stored observations for each affected `champion_a + champion_b + role + patch` group.
- For each stored observation, `getCounterPickAggregateRankBrackets` fans out to `all` plus the attributed bracket. Unknown observations fan out to `all` and `unknown`.
- Each aggregate group writes two directed rows, one for each champion orientation.
- Before writing a group, stale `counter_pick_stats` rows for that champion pair, role, and patch are deleted, then the current aggregate rows are upserted.
- Aggregation failures are surfaced through `counterPickAggregateInsertFailures`, batch/isolation metrics, persistence samples, error groups, and job `status = failed` when the recovery threshold says the failure is not warning-only.

Stale risk:

- If a scan crashes before persistence completes, `riot_scan_jobs` is failed and no completed summary is produced.
- If rank enrichment happens after observations already exist, rank attribution must be re-run and affected aggregates rebuilt.
- If an aggregate write fails for a group, old rows may have been deleted before the failed upsert. This is visible through aggregate failure metrics and should be handled operationally by re-running aggregation.

## Rank Handling

- New scanner observations start with `rank_bracket = unknown` and `rank_attribution_method = unknown`.
- Inserted observations are rank-attributed immediately by `attributeInsertedObservations`.
- Rank attribution reads participant PUUIDs from `champion_a_puuid` and `champion_b_puuid`.
- Participant ranks come from `riot_seed_candidates` and `riot_seed_candidate_rank_snapshots`.
- Only ranked snapshots are useful, and snapshots older than `MAX_RANK_SNAPSHOT_DISTANCE_DAYS` are treated as too old.
- If both participants have usable ranks, the bracket uses the average rank score and method `two-player-average`.
- If one participant has a usable rank, the bracket uses that rank and method `single-player`.
- If neither participant has a usable rank, the bracket remains `unknown`.
- Aggregate brackets are `all`, `iron-silver`, `gold-emerald`, `diamond`, `master-plus`, and `unknown`.
- Public Counter Pick currently requests `rankBracket: "all"` in `fetchCounterPickStatsForEnemy`, so public results are all-rank by default. The schema and aggregate cache support future public rank filters.

## Public Query And Visibility

Public UI path:

1. `src/app/league/counters/page.tsx` renders `CounterPickSelector`.
2. `CounterPickSelector` watches selected champion and role.
3. It calls `fetchCounterPickStatsForSelectedChampion` from `src/features/league/counter-pick-statistics-provider.ts`.
4. The provider calls `fetchCounterPickStatsByEnemyAndRole` from `src/features/league/counter-pick-stats.ts` with `enemyChampionId = selectedChampion`, `role = selectedRole`, and `rankBracket = all`.
5. `counter_pick_stats` is ordered by newest patch and games, then deduped to one row per listed champion.
6. `getPublicCounterResultsForSelectedChampionStats` buckets results by public win-rate thresholds:
   - listed champion WR above 52 percent goes to Best Counters.
   - listed champion WR below 48 percent goes to Bad Into / selected champion good into.
   - even matchups stay out of both public lists.
7. `calculateCounterPickConfidence` controls public visibility. Fewer than 5 games is not publicly ranked.
8. Reviewed `league_counter_picks` content supplies LaneStomp explanation/build fields on top of stat rows.

Caching/revalidation:

- There is no explicit `unstable_cache`, route revalidation, or server action cache in the current public stats path.
- The public selector loads stats client-side via the Supabase client whenever selected champion or role changes.
- Fresh aggregate rows should be visible after the client reloads/refetches the selected champion/role. Browser/session state can still hold already-loaded React state until selection changes or the page reloads.

## Observability Added

Completed scan jobs now emit a concise structured log from `runRiotScanJob`:

```ts
console.info("Riot counter pick scan completed", {
  scanJobId,
  seedCount,
  matchIdsFetched,
  uniqueMatchIds,
  duplicateMatchIds,
  matchesLoaded,
  matchesFailed,
  observationsGenerated,
  observationsRejected,
  observationsInserted,
  duplicateObservations,
  statsRows,
  aggregationTriggered,
  aggregationSucceeded,
  rankBracket,
  rankBrackets,
  status,
  errorMessage,
});
```

Failed scans also emit:

```ts
console.error("Riot counter pick scan failed", {
  scanJobId,
  seedCount,
  error,
});
```

Known limitation: completed scans report `matchesFailed: 0` because `scanRiotCounterPickMatchups` currently lets match fetch failures throw and fail the whole job instead of collecting per-match fetch failures. That is an observability gap, not a stats behavior change.

## Regression Coverage

Added `scripts/test-counter-pick-data-pipeline.mjs` and `npm run test:counter-pick-data-pipeline`.

The test covers:

- Duplicate `match_id + role` observations are not counted twice.
- Invalid observations are rejected and do not aggregate.
- Valid stored observations rebuild into `counter_pick_stats`.
- Rank attribution produces an expected `gold-emerald` bracket.
- Aggregate fanout includes `all` and the attributed bracket.
- Public query shape reads the expected `counter_pick_stats` row.
- Failed aggregate persistence is visible through aggregate failure counts and error groups.

## Current Audit Findings

- The data pipeline has a clear source-of-truth boundary: raw matchup evidence is `riot_matchup_observations`; public stats are derived in `counter_pick_stats`.
- The scanner does not silently count duplicate matches twice because it dedupes match IDs before fetching and dedupes observations before validation.
- `riot_seed_candidate_observations` is separate from public matchup aggregation. It supports seed discovery/profile quality, not public Counter Pick math.
- Rank attribution is best-effort at insert time and can be improved later through the rank coverage queue.
- Public rank filters are not wired into the UI yet, but storage and aggregation already support them.
- Completed job summaries are rich enough for admin debugging, and the new structured log makes the same core counters easier to find in logs.
- The largest remaining operational risk is aggregate rebuild failure after stale rows are deleted. The failure is visible, but a failed group may require a rebuild command or re-run after the underlying write issue is fixed.
