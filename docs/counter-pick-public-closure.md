# Temporary public Counter Pick closure — issue #367

Work performed on `feature/counter-pick-disable`, verified before editing, on 26 October 2026. No commits, pushes, deployments, environment changes, or live database migrations were performed.

## Architecture audit before implementation

- Public route: `src/app/league/counters/page.tsx`, with its loading skeleton in the same directory. `CounterPickSelector` in `src/components/league/counter-pick-selector.tsx` retrieves persisted statistics through `src/features/league/counter-pick-statistics-provider.ts` and `counter-pick-stats.ts`. It does not call Riot APIs. Homepage popular picks read `counter_pick_stats` through `counter-pick-popular-champions.ts`.
- Public entry points: `src/app/page.tsx`, `src/components/site-header.tsx` (desktop/mobile navigation and desktop CTA), `src/components/site-footer.tsx`, and `src/app/sitemap.ts`. Homepage/root metadata and auth-page highlights also advertised Counter Pick.
- Admin inspection: `src/components/admin/league/league-counter-pick-section.tsx` reads stored statistics for the existing admin dashboard. `/admin/counter-picks`, its collection/profile/shadow-ranking subpages, and `/admin/league/counter-picks` remain available as admin UI shells. Data actions in `src/app/admin/league/counter-picks/actions.ts` verify supplied access tokens with `supabase.auth.getUser` and require `is_admin`. Some authorized operations use the service-role client only after authorization. Client email fallback checks are not the server authorization boundary.
- Sessions are currently managed by the browser Supabase client (`src/lib/supabase.ts`), not a server-readable cookie session. Rather than introduce a second authentication system, this change closes the public URL for everyone and retains inspection through the existing authenticated admin tools. It does not provide an admin exception at `/league/counters`.
- Existing reviewed-mechanical display flag: `NEXT_PUBLIC_USE_REVIEWED_MECHANICAL_COUNTERS_PUBLICLY`; it affects recommendation composition, not access control. It is not used to authorize the closed feature.
- Keyed Riot API operations: scan start, collection start/resume, seed-rank refresh, matchup-participant-rank refresh, collection seed discovery, and scan execution in `src/app/admin/league/counter-picks/actions.ts`. Critically, `getRiotCollectionJob` previously called `advanceRiotCollectionJob` during polling/recovery. `src/components/admin/league/riot-match-scanner-panel.tsx` polls these actions on intervals.
- Shared request implementation: `scripts/lib/riot-api-client.mjs`, used by admin actions and CLI tools `poc-riot-counter-pick-stats.mjs`, `enrich-riot-seed-ranks.mjs`, `enrich-missing-matchup-participant-ranks.mjs`, and `riot-get-puuid.mjs`. `scripts/update-counter-pick-match-statistics.mjs` has a separate direct-fetch implementation. Aggregation/rebuild scripts also manipulate stored data without requiring Riot requests; those remain intact.
- No checked-in Vercel cron configuration, GitHub scheduled workflow, API route handler, middleware/proxy, or independent collection worker was found. Collection advances through admin actions/polling. External schedulers, deployment settings, and already-running old deployments were not inspected and cannot be ruled out from this repository.
- Public reviewed Matchup Guides read separate matchup data through `src/features/league/matchups.ts`. No statistics-provider dependency was found in their public routes or champion pages. Data Dragon champion/assets downloads use a separate public API, not the keyed Riot collection pipeline; those remain available.

## Changes

### Public access and promotion

The public route calls `notFound()` on the server before champion or statistics retrieval. `src/features/league/counter-pick-access.ts` holds a code-level temporary closure; an environment variable cannot reopen it. The loading component returns no Counter Pick shell while closed. Both unauthenticated and non-admin users are denied by the same unconditional closure; admins use the existing dashboard instead.

Header/footer links, the homepage selector and Counter Pick feature link, the homepage statistical confidence strip and LIVE claim, and the sitemap entry were removed. The homepage now links to reviewed Matchup Guides and no longer queries popular Counter Pick statistics. Public metadata and auth highlights were updated accordingly. Counter Pick components, calculations, providers, admin tools, and stored rows remain intact.

### Direct database endpoints

The audit demonstrated an access-control gap: public browser queries go directly to Supabase REST using public SELECT grants/policies. A Next.js-only gate would leave those endpoints open. This is why an RLS migration is necessary rather than relying only on hidden links or client flags.

`supabase/migrations/20261026090000_restrict_counter_pick_public_reads.sql` removes public SELECT policies/grants for:

- `counter_pick_stats`
- `league_counter_pick_match_statistics`
- `league_counter_picks`
- `counter_ranking_v2_mechanical_reviews`

Authenticated reads of the two statistics tables use the existing `public.is_admin(auth.uid())` helper. Existing admin management policies already cover the latter two tables. Existing service-role access remains intact. The migration deletes no data and changes no schema, write policies, Matchup Guide policies, or champion policies.

**This migration has not been applied.** Direct Supabase access is not closed on an existing database until the owner applies it. Review database policy drift as part of deployment; this migration targets the public policy names in the checked-in migration history. Do not claim live non-admin denial based only on the prepared SQL.

### Riot production safety

`scripts/lib/riot-collection-safety.mjs` denies collection whenever `NODE_ENV=production` or `VERCEL_ENV=production`. This also disables production-built preview servers. No flag or key-format guess can override it; reopening requires an explicit reviewed code change after approval. Development execution is preserved.

Five exported server actions check the guard before authorization, job insertion, or other work: `startRiotScanJob`, `startRiotCollectionJob`, `resumeRiotCollectionJob`, `refreshRiotSeedCandidateRanks`, and `refreshMatchupRankCoverageParticipants`. These checks cover direct action invocation as well as buttons. Existing authorization remains in place for development use.

In production, authenticated `getRiotCollectionJob` polling returns the stored job without consistency recovery or advancement. Pause/cancel and read-only inspection remain available. Existing in-flight jobs are not deleted or marked failed by preview requests.

The shared Riot client checks the guard before entering request handling and on each retry before the rate limiter/network dispatch. The legacy statistics updater checks at startup and at its independent fetch boundary. Thus a production runtime cannot dispatch these requests using either a development or production key. No key was inspected, generated, rotated, or exposed.

For any external non-Vercel scheduler, the owner must ensure it identifies its deployment with `NODE_ENV=production`; an unmarked standalone process is treated as development. Verify external schedules and stop any older deployed collector before rollout. This code cannot stop a process running an older revision.

## Verification and limitations

Validation results:

- `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check`: passed.
- Ran all 36 pre-existing test commands; updated the homepage test for the intentional removal of public Counter Pick. The resulting 34 pass; two pre-existing failures remain. Added `npm run test:counter-pick-access-safety`, which passes, for a total of 35 passing commands out of 37.
- The new safety test verifies production and Vercel-production detection, rejection despite an enable flag or supplied key, no network/rate-limiter dispatch from the shared client, rejection of the standalone legacy updater, action entry guards, read-only production polling, public-link removal, and the scoped migration.
- Local production HTTP checks: `/league/counters` and its champion/role query URL return **404**; `/`, `/league/matchups`, `/champions`, and `/sitemap.xml` return **200**. Home HTML and sitemap contain no Counter Pick URL.
- Direct HTTP POSTs using built Server Action IDs to all five collection actions return the production-disabled error. An unauthenticated POST to `getCounterPickManagementMetrics` is denied. No collection request or job was initiated by these checks.
- Verified no diff in public Matchup Guide routes/provider, champion index implementation, or retained Counter Pick selector/start-form components.

The two existing failing tests and their inputs are unchanged from HEAD: `test:champion-knowledge-profiles` expects a draft Locke profile although it is marked reviewed; `test:muted-primary-button-actions` assumes LF in an exact string while the checkout uses CRLF. No unrelated test changes were made.

Live admin/non-admin identities and applied database RLS were not tested. Successful admin UI-shell rendering is not proof of admin authorization. Configured preview verification must include an admin inspecting stored stats, a signed-in non-admin receiving no table rows, and anonymous direct REST rejection after the migration.

Public Matchup Guide routes, provider code, champion pages, and Counter Pick implementation components were not changed. Shared navigation changes are intentional. Existing collection controls still appear in admin tools but return the explicit disabled message in production; hiding them is not the safety mechanism.

## Reopening

After Riot production approval and a data-quality review, review the code-level route closure, public promotion, collection guard, and the four SELECT policies together. Restore only the intended public read policies in a new migration. Test with approved credentials in a configured preview before enabling collection. Do not bypass the guard by marking a production deployment as development.
