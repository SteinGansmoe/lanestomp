# Counter Pick Management Metrics

The Counter Pick admin page separates Riot-derived data from editorial guide content. This avoids treating an empty guide table as proof that Riot scans did not persist matchup data.

## Previous Summary Cards

Before this split, the top cards in `AdminLeagueCounterPicksSection` measured editorial records loaded by `fetchAllLeagueCounterPicks()` in `AdminDashboard`.

| Old card            | Component                        | Query path                                           | Source                 | Filters                                                                                          | Refresh behavior                                                                     | Actual meaning                                      |
| ------------------- | -------------------------------- | ---------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| Total counter picks | `AdminLeagueCounterPicksSection` | `AdminDashboard` -> `fetchAllLeagueCounterPicks()`   | `league_counter_picks` | none                                                                                             | Loaded into client admin state; refreshed by the page `Refresh` flow after mutations | Total editorial guide rows                          |
| Reviewed            | `AdminLeagueCounterPicksSection` | Client `useMemo` over `adminData.leagueCounterPicks` | `league_counter_picks` | `generation_status = reviewed`                                                                   | Recomputed from refreshed admin state                                                | Reviewed editorial guide rows                       |
| Visible drafts      | `AdminLeagueCounterPicksSection` | Client filter over `counterPicks` prop               | `league_counter_picks` | selected champion, selected role, active status/type/search filters, `generation_status = draft` | Recomputed from local filters and refreshed admin state                              | Draft guide rows visible in the current editor view |

Those cards did not read `riot_matchup_observations`, `counter_pick_stats`, or `riot_scan_jobs`, so they could correctly show zero even after Riot scan data was persisted.

## Riot Data Pipeline

| Metric                 | Source                                          | Definition                                                                                                                                                  |
| ---------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Matchup observations   | `riot_matchup_observations`                     | Count of validated Riot match-role observations. The table is unique by `match_id + role`, so this is evidence rows, not unique matches.                    |
| Counter Pick stat rows | `counter_pick_stats`                            | Count of aggregate rows split by directed champion orientation, role, patch, and rank bracket. This is not unique matchup pairs.                            |
| Unique matchup groups  | `get_counter_pick_unique_matchup_group_count()` | Count of canonical groups from `riot_matchup_observations`: sorted `champion_a/champion_b` pair + `role` + `patch`. Rank bracket is intentionally excluded. |
| Latest successful scan | `riot_scan_jobs`                                | Most recent row with `status = completed`, normalized from persisted `summary` first and `progress` as a legacy fallback.                                   |

## Editorial Content

| Metric              | Source                 | Definition                                 |
| ------------------- | ---------------------- | ------------------------------------------ |
| Counter Pick guides | `league_counter_picks` | Total editorial guide rows.                |
| Reviewed guides     | `league_counter_picks` | Rows where `generation_status = reviewed`. |
| Draft guides        | `league_counter_picks` | Rows where `generation_status = draft`.    |

## Failure Handling

Each metric query is independent. If one count fails, that card shows `Unavailable` and logs a concise admin-console error. Failed queries are not converted to zero.

## Refresh Behavior

Metrics load when the Counter Pick admin section opens and can be manually refreshed with `Refresh metrics`.

During Riot scan polling, the dashboard refreshes metrics, recent jobs, and seed candidates once when a job changes from a non-terminal state to `completed`, `failed`, or `cancelled`. A job that remains terminal does not trigger repeated metric requests on every polling interval.

## Known Limitations

Latest scan values depend on the fields persisted in `riot_scan_jobs.summary` or legacy `progress`. Missing historical fields display as `—`.

The unique matchup group metric requires the `get_counter_pick_unique_matchup_group_count()` migration to be applied.
