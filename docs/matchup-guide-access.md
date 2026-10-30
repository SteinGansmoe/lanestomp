# Matchup Guide access and staged rollout — A01 / #374

Branch: `fix/matchup-guides-rls`. Prepared 30 October 2026 for owner review.
No commit, push, merge, deployment or production migration has been performed.

## Root cause and scope

The original migration grants table-wide SELECT on `league_matchups` to `anon`
and `authenticated`, combined with a permissive `USING (true)` policy. Later
migrations add draft/failed state, internal notes and reviewer metadata without
narrowing access. Application filters cannot protect direct API requests. The
weakness was reproduced in disposable PostgreSQL. Production exposure is unverified.

All migration references were inspected: guide creation, review workflow, failed
status, uniqueness repair, and feedback foreign keys. No checked-in guide-returning
RPC or existing guide view was found. Additional deployed paths require inspection.
Historical migrations, Counter Pick behavior and Riot collection are unchanged.
The guide-availability lookup inside the retained Counter Pick selector uses the
new view to preserve that dependency.

## Two forward migrations

The previous **unapplied** combined migration was replaced:

1. `supabase/migrations/20261030193000_expand_matchup_guide_public_view.sql`
   creates the public view, grants SELECT and reloads the schema cache. It changes
   no base-table grants or RLS, preserving the currently deployed application's reads.
2. `supabase/deferred-migrations/20261030193100_contract_matchup_guide_storage_access.sql`
   removes the broad public policy, revokes PUBLIC/anonymous storage access, and
   adds a restrictive authenticated admin policy. Existing admin CRUD and service
   access remain. The migration requires the expanded view and leaves its grants
   and ownership intact.

**The contract is outside `supabase/migrations`.** Normal `supabase db push`
cannot discover it. Do not move it into the active directory or recursively run
all SQL. The existence guard cannot prove an application deployment: live release
verification and separate owner approval are required before staging contraction.
Both migrations are transactional, have distinct ordered timestamps and delete no
data. Do not apply or record the removed combined migration. If it was applied in
another environment, reconcile that history separately before proceeding.

## Public projection and access matrix

The explicit reviewed-only view exposes `id`, `champion_a_id`, `champion_b_id`,
`role`, `overview`, `early_game`, `trading_pattern`, `power_spikes`, `danger_windows`,
`win_conditions`, `difficulty_rating`, `confidence_level`, `generation_status`,
and `updated_at`. It excludes draft/failed rows, `admin_notes`, `reviewed_by`,
`reviewed_at`, `generated_at`, `created_at`, and unused `itemization_notes`.
Future storage fields remain excluded automatically.

The view deliberately uses `postgres` ownership, `security_invoker = false` and
`security_barrier = true`. Its predicate and allowlist are the public boundary;
the owner's underlying RLS does not protect the projection. Never use `SELECT *`
in its definition or grant public writes. See [PostgreSQL CREATE VIEW](https://www.postgresql.org/docs/current/sql-createview.html).

| Identity                | Expanded: base table                                   | Public view, both phases            | Contracted: base table                            |
| ----------------------- | ------------------------------------------------------ | ----------------------------------- | ------------------------------------------------- |
| Anonymous               | Original access unchanged, including existing exposure | Reviewed public fields; SELECT only | Denied                                            |
| Non-admin authenticated | Original reads unchanged; RLS blocks guide mutations   | Reviewed public fields; SELECT only | SELECT no rows; UPDATE/DELETE none; INSERT denied |
| Admin authenticated     | Existing full reads/CRUD                               | Reviewed public fields              | Full reads/CRUD retained                          |
| Service role / owner    | Trusted unrestricted storage                           | Trusted access                      | Unchanged                                         |

Expansion is compatibility preparation, **not completion of the security fix**.
Keep the interval before contraction short and tracked.

Admin dashboard CRUD, review overlay and generation actions retain the base-table
API. Generation validates the token and `is_admin`, then uses the user's JWT.
Browser checks cannot override RLS. Check deployed protection of `profiles.role`,
the admin trust root. The fallback scanner needs a service key or actual admin
session after contraction; its anonymous fallback cannot read private storage.
Feedback tables, foreign keys, triggers and submission RPC are unchanged.

## Fail-closed sitemap and build proof

`src/app/sitemap.ts` exports `dynamic = 'force-static'`, supported by installed
Next.js 16.4.3 with the current configuration (Cache Components is not enabled).
The production build prerenders `/sitemap.xml`.
Its `fetchCache = 'force-no-store'` setting rechecks dependencies even when a
previous build cache is restored; the generated XML itself remains static.

The reader requires configuration and completely paginates active champions and
reviewed guides. Each response must have an array, exact count, expected page
length and unique IDs. Pages use stable ID ordering. Missing view, query failure
on any page, null data/count, truncation, changed counts, duplicate IDs/URLs,
invalid role/date and unresolved champions throw errors. No partial result is
returned. A successful empty array with exact count zero is distinct from failure
and emits only the three existing static URLs. Errors omit raw database messages.

`npm run test:sitemap-build` copies the runtime source/config without environment
files and runs six **default Turbopack production builds** against a local
synthetic Supabase-shaped HTTP API. Only scratch output/module-resolution paths
differ from deployment configuration. Missing config, missing view and second-page
failure must exit nonzero with a sitemap prerender error. Zero and 1,001-guide
datasets must succeed; the test checks the prerender manifest and exact XML count.
An additional rebuild reuses successful build state, removes the dependency,
and must fail rather than reuse cached successful database responses.
It also starts `next start` and checks home, guide HTML/metadata and complete
sitemap, plus the actual guide/coverage readers. No production API or AI provider
is invoked. Existing Google Fonts need network access. The test cleans its scratch
tree; do not run typecheck/lint concurrently while that source snapshot exists.

Pagination is not an atomic database snapshot. Count changes fail the build;
same-count concurrent edits are not fully detectable. Avoid publication during
the release build and retry if data changes. The sitemap remains a release
snapshot; later publication follows the existing rebuild/release process.

## Exact release procedure — owner execution only

No production command below has been executed. Do not use `--yes`, `--include-all`,
`--include-seed`, or automatic migration hooks for this rollout. The installed
CLI's `--dry-run`, `--skip-vault` and `--workdir` flags were checked locally.

1. Run `supabase/inspection/matchup-guide-access.sql` in the owner SQL editor.
   This read-only metadata inspection covers grants, effective columns, policies,
   dependent views, routines and profile authorization. Review extra deployed
   paths and exposed schemas. Keep definitions/credentials private. Confirm
   migration history contains all preceding approved migrations.
2. Run `npm ci`, `npm run test:matchup-guide-access`,
   `npm run test:sitemap-completeness`, `npm run test:sitemap-build`,
   `npm run typecheck`, `npm run lint`, and the guide regressions. Permission
   tests use only in-memory disposable PostgreSQL and synthetic identities.
3. Create an isolated CLI stage **outside this repository**, copying config and
   only normal migrations, never `.temp`, secrets, seeds, roles or deferred SQL:

   ```powershell
   $releaseStage = Join-Path $env:TEMP ('lanestomp-a01-' + [guid]::NewGuid().ToString('N'))
   New-Item -ItemType Directory -Path (Join-Path $releaseStage 'supabase/migrations') -Force | Out-Null
   Copy-Item -LiteralPath 'supabase/config.toml' -Destination (Join-Path $releaseStage 'supabase/config.toml')
   Copy-Item -Path 'supabase/migrations/*.sql' -Destination (Join-Path $releaseStage 'supabase/migrations')
   npx supabase link --workdir $releaseStage --project-ref <owner-verified-project-ref>
   npx supabase db push --workdir $releaseStage --linked --skip-vault --dry-run
   ```

   **Stop unless expansion `20261030193000` is the only pending migration.**
   Confirm target and file hash. After owner approval, execute the same push
   command without `--dry-run`. `--skip-vault` prevents unrelated config-driven
   vault writes. Verify old guide/coverage reads and admin access before proceeding.

4. Verify the new view through the API after schema-cache reload. Build and deploy
   the updated application with normal credentials/configuration. Expansion must
   precede the build. Verify the artifact's sitemap count and representative URLs
   against the full public dataset; an empty dataset needs explicit confirmation.
   Verify the **live release**: guide content, coverage, metadata, admin review and
   sitemap. Record its release ID and retain a compatible rollback artifact. Drain
   old instances/assets; old browser tabs may need refresh when storage closes.
5. **Only after live verification and separate owner approval**, copy exactly
   the contract into the isolated stage and dry-run again:

   ```powershell
   Copy-Item -LiteralPath 'supabase/deferred-migrations/20261030193100_contract_matchup_guide_storage_access.sql' -Destination (Join-Path $releaseStage 'supabase/migrations')
   npx supabase db push --workdir $releaseStage --linked --skip-vault --dry-run
   ```

   Stop unless contraction `20261030193100` is the only pending migration.
   Confirm target/hash, then owner runs the command without `--dry-run`. The CLI
   records normal migration history. Retain the staging/history evidence. Before
   later normal releases, reconcile the applied deferred file with the canonical
   migration directory in a separately reviewed change; otherwise remote history
   may be absent locally. Never mark an unexecuted migration as applied.

6. Repeat the inspection and public REST checks, then repeat with an ordinary JWT:
   - `GET /rest/v1/public_league_matchups?select=*`: only reviewed allowlisted fields.
   - Add `&generation_status=eq.draft`, then `eq.failed`: both `[]`.
   - `GET /rest/v1/public_league_matchups?select=admin_notes,reviewed_by`: rejected.
   - `GET /rest/v1/league_matchups?select=*`: anonymous denied; non-admin no rows.
     Admins retain private reads and service access remains. Do not log private
     results or tokens. Verify admin create/generation/edit/review/unpublish/delete
     and denied public writes in a disposable Supabase project. Production smoke
     checks remain read-only.

## Verification limits and recovery

Recorded verification:

| Check                                                            | Result                                                                                                                                          |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `test:matchup-guide-access`                                      | Passed: disposable PostgreSQL expand/contract permissions, compatibility and workflow transitions                                               |
| `test:sitemap-completeness`                                      | Passed: full champion/guide pagination, zero, first/subsequent failures and malformed/partial results                                           |
| `test:sitemap-build`                                             | Passed: six default Turbopack builds, including nonzero failure with a warm successful cache; static XML and production HTTP/reader smoke tests |
| Typecheck and ESLint                                             | Passed                                                                                                                                          |
| `test:sitemap-slugs`                                             | Passed: 13 champion slugs and 3 canonical URLs                                                                                                  |
| Guide list/detail/artwork, draft prompt and homepage regressions | Passed                                                                                                                                          |
| `git diff --check`                                               | Passed                                                                                                                                          |

The disposable suite tests old/new read and coverage shapes after expansion,
unchanged old exposure during that phase, the early-contraction guard, normal
migration-directory exclusion, then public/admin/service behavior after contraction.
It verifies admin CRUD/RETURNING, generation/reset and publishing transitions,
feedback RPC compatibility and future-field exclusion.

The API build harness is synthetic, not a full PostgREST stack; PostgreSQL ACL/RLS
is tested separately. Docker/local Supabase, browser hydration and external AI
generation are not covered. Production role inheritance, explicit column grants,
additional policies/views/RPCs and profile-role protection need owner verification.
Reviewed guides referencing inactive/missing champions or invalid dates/roles
will now block a release instead of being silently omitted; correct the data
before release rather than disabling the checks.
Check target PostgreSQL 15+ view-option support and `postgres` ownership.

The previous CSS worker panic was resolved by refreshing `.next` generated state.
No permanent bundler change was made. Building against a database without expansion
is now intentionally unsuccessful.

Both migration transactions roll back on failure and delete no content. Retain
normal backups, inspection and release artifacts. After expansion, leave the view
in place and defer contraction if the app release fails. Old readers remain
compatible then, but reverting does not finish the security fix; track that exposure.

After contraction, never restore broad SELECT or `USING (true)`. Roll back only
to a view-compatible application, fix forward, or serve maintenance while repairing
readers. The original application is no longer a compatible rollback target.
Keep the view and SELECT grants. If building fails because data changes or an API
is unavailable, retain the last verified release and rebuild after recovery.

## Exact files changed for A01

- The two SQL files above; the unapplied combined SQL file was removed.
- `src/features/league/matchups.ts`: public guide/coverage relation.
- `src/components/league/counter-pick-selector.tsx`: guide-availability relation only.
- `src/data/sitemap-matchups.ts`, `src/app/sitemap.ts`: complete fail-closed static sitemap.
- `scripts/test-matchup-guide-access.mjs`, `scripts/test-sitemap-completeness.mjs`,
  `scripts/test-sitemap-build.mjs`, `scripts/lib/load-source-module.mjs`: test harnesses.
- `package.json`, `package-lock.json`: test commands and pinned development-only PGlite.
- `supabase/inspection/matchup-guide-access.sql` and this document.

The pre-existing untracked `docs/architecture-audit.md` is untouched.
