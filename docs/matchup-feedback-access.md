# Matchup feedback submission — A08 / #380

Prepared on `fix/feedback-access-security`, 31 October 2026. This is a local
implementation and disposable PostgreSQL verification, not a production rollout.
No hosted database requests, migrations or data changes were performed.

## Investigation

The repository confirms the bypass identified by A08:

- `20260602164000_create_matchup_feedback.sql` grants INSERT to `anon` and
  `authenticated`. Its permissive INSERT policy accepts a null user ID or the
  caller's ID. It does not enforce sessions, card types or database-assigned
  moderation state. The table constrains lane, feedback type, reason and status,
  and references `league_matchups` and `profiles`, but does not require publication.
- `20260613093000_add_matchup_feedback_counts.sql` adds sessions, duplicate indexes,
  counts, a submission RPC and insert/update/delete count triggers.
- `20260613103000_remove_report_feedback_counts.sql` is the latest RPC definition.
  Votes and reports have separate partial unique indexes for user/session identity.
  It validates lane/type/reason and requires an anonymous session, but leaves the
  original direct INSERT grant/policy intact. It also trusts champion names and
  card type and does not require a reviewed matchup. Null inputs can skip its
  `NOT IN` checks. PUBLIC function execution is not explicitly revoked.
- `src/components/league/matchup-feedback-controls.tsx` is the only repository
  submission client. It calls the nine-argument `submit_matchup_feedback` RPC;
  it reads `matchup_feedback_counts` and never inserts into storage directly.
  Its localStorage session is a UUID or timestamp/random fallback. Signed-in
  identity comes from `auth.uid()`, not a caller argument.
- `src/components/league/league-matchup-review-panel.tsx` supplies the six supported
  card keys, display names, guide ID and lane. The follow-up gates only feedback
  controls on the displayed guide's `generation_status = 'reviewed'`. Missing,
  draft, failed and unpublished guides have no feedback controls; admin preview,
  editing, regeneration and publication actions remain available.
- `src/components/admin/admin-dashboard.tsx` reads feedback and updates its status.
  No repository client requires direct feedback INSERT or DELETE. Service-role
  maintenance retains its existing table grants. External clients are unknown.
- Count rows store helpful/not-helpful totals; reports are excluded. Moderation
  status does not exclude a vote from totals. The trigger refreshes old/new groups
  after updates and deletions. No separate materialized feedback state was found.

These are repository findings, reproduced with synthetic data. Current production
grants, extra policies, function overloads/owners, role inheritance, external clients
and evidence of abuse have not been inspected or inferred.

## Smallest compatible database contract

`20261031193000_secure_matchup_feedback_submission.sql` is a forward, transactional
migration. Historical migrations, records, counts, indexes and constraints remain
unchanged; the migration neither deletes data nor rebuilds counts.

- Revoke table and explicit column INSERT privileges from PUBLIC, anon and
  authenticated, and remove the public INSERT policy. Admin SELECT/UPDATE and
  service-role maintenance remain available. Admins also submit through the RPC.
- Preserve the deployed RPC name, argument names/defaults, return columns and
  vote/report update behavior. There are no status/user/timestamp arguments.
  Inserts explicitly use `open`; updates retain the existing moderation status.
- Reject null/invalid lane/type/card/reason, nonexistent/draft/failed guides and
  lane mismatches. Card keys are `overview`, `early_game`, `trading_pattern`,
  `power_spikes`, `danger_windows`, `win_conditions`.
- Derive champion display names from the referenced guide/champion rows. The two
  name arguments remain for deployed-client compatibility but are ignored.
- Allow optional messages up to 4,000 characters and anonymous session IDs up to
  200 characters. Anonymous sessions must be nonblank; existing session spelling
  is retained for duplicate compatibility. Authenticated submissions use the user
  ID and discard session IDs, as before. Messages retain existing trim/null behavior.
- Serialize RPC submissions per guide/card with a transaction advisory lock. This
  protects update-then-insert duplicate handling and trigger count refreshes among
  RPC submissions. Direct privileged maintenance must be coordinated separately.
- Keep SECURITY DEFINER so revoking caller INSERT does not break submission.
  Explicitly set the RPC and its two count helpers to owner `postgres`, with an
  empty search path and schema-qualified data access. Revoke PUBLIC EXECUTE;
  explicitly grant submission to anon/authenticated/service_role. Count helpers
  are callable by their owner/trigger or service maintenance, not public callers.

Client-controlled sessions are weak identity, not rate limiting or abuse prevention.
Users can create new sessions, and anonymous and authenticated votes remain separate
identities. This change does not attempt account linking, spam prevention or historical
cleanup. Existing malformed legacy rows remain intact for separate owner review.

## Validation and release

Run locally without credentials or network:

```powershell
npm run test:matchup-feedback-access
npm run test:matchup-feedback-ui
npm run test:matchup-guide-access
npm run test:matchup-guide-detail-redesign
npm run typecheck
npm run lint
git diff --check
```

The new test replays the relevant actual migrations (including A01 contraction)
in disposable PGlite. It reproduces the old bypass, verifies byte-for-byte row/count
preservation, tests table/column INSERT denial and helper execution denial, invalid
inputs, spoofed identities/status, canonical names, all six cards, repeat/switch
votes, report updates, moderation, user isolation, service maintenance, counts,
function ownership/search path and reapplication without data changes.

The UI suite executes the actual feedback component's event handlers with mocked
React state and a mocked RPC; it exercises valid reports/votes, 4,000/4,001 ASCII
and emoji boundaries, whitespace, combining characters, server rejection and
network errors. It tests publication gating and retains the existing admin controls.
These are not browser interaction or hosted authentication tests. The SQL suite
also executes the metadata inspection before/after migration and checks unchanged
records/counts, plus PostgreSQL's Unicode and raw-input length boundaries.

## Message length and error behavior

The UI applies JavaScript `trim()` once and counts Unicode code points in that
exact RPC payload. Empty/whitespace-only text is sent as null. PostgreSQL checks
`char_length(p_message)` before its own space-only trim: it counts code points,
including combining marks separately, not visible graphemes or UTF-8 bytes.
For UI submissions, outer whitespace is already removed, including tabs/newlines
and JavaScript Unicode whitespace. Direct RPC clients must respect the raw
4,000-code-point argument limit; a 4,000-character message plus a leading space
is rejected by SQL even if subsequent trim would shorten it. Browser textarea
newlines are LF; each LF counts once. The RPC length limit is unchanged.

HTML `maxLength` counts UTF-16 units, so the native ceiling is 8,000 units to
accommodate 4,000 astral characters such as emoji. The visible counter, invalid
state, disabled submit/vote buttons and handler guard enforce 4,000 code points.
ASCII input can pass the native ceiling at 4,001, but is visibly invalid and cannot
be submitted. An oversized report can still be opened/edited to correct it.
Known server length/publication errors receive clear messages, other rejections
and network failures receive a generic retry/refresh message. Raw database errors
are not displayed. Failed requests retain the entered message. SQL remains the
authoritative boundary for old/tampered clients and stale publication state.

## Read-only hosted inspection

Open `supabase/inspection/matchup-feedback-access.sql` in the intended project's SQL
editor as an authorized metadata inspector. Execute the complete transaction,
which starts with `BEGIN TRANSACTION READ ONLY` and ends with `COMMIT`. It queries
catalogs and migration version identifiers only; it never calls the feedback RPC,
reads feedback contents or changes grants/data. Keep metadata in the owner's
private review environment. Missing/inaccessible history or relations is a blocker,
not evidence that a prerequisite was applied. If a query fails, end the failed
transaction with `ROLLBACK`, investigate privately, and rerun after resolution.

The inventory covers effective table/column grants, explicit PUBLIC ACLs, inherited
roles, RLS, function overloads/ownership/search paths/EXECUTE, owner schema/table/
sequence access, types/defaults, triggers, constraints, indexes and dependencies/
dependent views. It includes helper functions and text references across user
schemas. Dynamic SQL or indirect paths can escape text/catalog scanning: inspect
unexpected objects manually. Catalog metadata alone does not exercise RLS or JWTs.
An application admin uses the `authenticated` SQL role, with admin SELECT/UPDATE
decided by `is_admin(auth.uid())`; there is no separate SQL admin role to simulate.

| Check                      | Before A08 (repository baseline)                                    | After A08                                                                                                                          |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Prerequisite history       | Three feedback migrations and both A01 phases present; A08 absent   | Same prerequisites plus `20261031193000`                                                                                           |
| Feedback direct INSERT     | anon/authenticated allowed, permissive public INSERT policy present | Effective table and every column INSERT false for anon/authenticated, including admin identity; old INSERT policy absent           |
| Admin moderation           | Authenticated SELECT/UPDATE grants with admin-only RLS              | Unchanged; ordinary user cannot view/moderate records                                                                              |
| Service maintenance        | Existing feedback/count CRUD privileges and bypass/authorized RLS   | Unchanged; sequence access retained                                                                                                |
| Submit RPC                 | Nine input arguments, three output fields; inspect actual owner/ACL | Same signature; SECURITY DEFINER; owner postgres; empty search_path; anon/authenticated/service EXECUTE true; PUBLIC EXECUTE false |
| Count helpers              | Inspect inherited/default public execution                          | Owner postgres, empty search_path, public/anon/authenticated EXECUTE false; service EXECUTE true                                   |
| Stored feedback and counts | Existing schema/records                                             | No migration DML, index changes or count rebuild; triggers/indexes/constraints retained                                            |

Compare owner privileges against operations: postgres needs SELECT on guides/
champions, feedback SELECT/INSERT/UPDATE, count SELECT/INSERT/UPDATE, schema usage,
identity sequence access and `auth.uid()` EXECUTE. Check table ownership, FORCE RLS,
role inheritance and bypass settings together; hosted postgres need not be a
superuser. The migration runner must be able to alter the routines and assign
ownership to postgres. Unexpected inherited INSERT, extra overloads, write-capable
views or definer routines are release blockers requiring review, not automatic repair.

## Exact rollout sequence (owner execution only)

1. **Local/staging:** include the frontend, tests, inspection, documentation and
   existing A08 migration in a reviewed release. Leave the architecture audit out.
   Replay in disposable/hosted staging and test real PostgREST anonymous, ordinary
   authenticated and admin identities, repeat/switch votes, report updates,
   counts/moderation and simultaneous requests. These are **authorized staging
   writes**, not production tests. PGlite uses synthetic roles, simplified auth,
   selected migrations and a single session; hosted version, role privileges,
   JWT validation, PostgREST/schema cache and concurrency remain separate checks.
2. **Frontend deployment:** deploy the compatible frontend first, using a release
   path that does not automatically apply the pending migration. This is an
   **explicitly authorized deployment**, not performed by this task. The old RPC
   accepts the unchanged argument/return contract. Retain the frontend release ID.
3. **Production UI verification:** inspect draft/failed/absent guide previews and
   reviewed guides, confirming admin editing/review controls remain. Enter/paste
   4,000 and 4,001 code points (including emoji), check the counter and disabled
   submission, then discard the text. **Do not click submit or change publication/
   moderation.** Inspecting existing states and local form input is **read-only
   for production data**. Missing preview states must be verified in staging,
   rather than created in production for testing.
4. **Hosted metadata:** independently confirm the project, retain normal backups,
   then run the inspection above **read-only before migration**. Confirm no
   legitimate external client requires raw INSERT/helper execution. Resolve all
   unexpected grants, overloads, prerequisites or owner-permission questions.
5. **History/dry-run:** with the intended project already linked, run
   `npx supabase migration list --linked`, then
   `npx supabase db push --linked --dry-run`. These are **read-only database checks**.
   The plan must contain exactly `20261031193000_secure_matchup_feedback_submission.sql`.
   If anything else appears, stop. Never use history repair, `--include-all`, seeds
   or historical migration replay to force the expected plan.
6. **Approval and migration:** obtain **explicit owner approval of the inspected
   plan** and apply the single migration through the approved database release
   workflow (for the verified CLI workflow, `npx supabase db push --linked`). This
   changes production schema/privileges. The transactional migration includes
   PostgREST schema-cache reload. No migration is applied by this task.
7. **Post-deployment:** rerun the metadata inspection/history checks **read-only**.
   Confirm A08 registered and expected ACLs/RLS/owners/overloads. Recheck public
   guide and count reads using minimal fields. End-to-end successful submission,
   duplicate/report updates and moderation are **production writes requiring
   separate explicit owner authorization**; a denied INSERT probe is also an
   attempted production write. Use staging for these unless specifically approved.
   Keep final production behavioral verification incomplete until authorized
   evidence exists; do not infer it from catalog checks or local tests.

## Older clients, rollback and recovery

Already-open tabs and cached frontend versions retain the compatible RPC signature
and normal reviewed-guide votes/reports. They may still show draft feedback or allow
oversized messages, which the secured RPC rejects. Refresh those tabs to obtain the
new gating/counter/error messages. External raw INSERT clients and direct count-helper
callers will stop working; migrate legitimate integrations to the RPC before release.
Do not assume unknown clients are compatible. Anonymous sessions remain spoofable;
rate limiting and stronger abuse prevention are separate work.

Before migration, a frontend rollback is possible but restores the old UX gaps;
the public INSERT weakness also remains until A08 is applied. After migration,
prefer the compatible frontend release if a later frontend deploy fails. An older
RPC-compatible frontend can still submit valid reviewed feedback but may show
rejected actions. Do not roll back to raw-table writers.

If migration execution fails, its transaction should roll back; inspect actual
history/metadata before retrying. If a post-commit defect appears, retain the closed
INSERT boundary, disable feedback UI temporarily if needed, and prepare a reviewed
forward correction preserving validation/ACLs. Never casually restore the old public
INSERT grant/policy or broadly regrant helper EXECUTE. Coordinate privileged
maintenance with RPC traffic because it does not take the RPC's advisory lock.
No historical cleanup, history repair or production data recovery is part of A08.

The local follow-up is ready for owner review after the listed tests pass. Frontend
deployment, production inspection, exact remote pending history, external-client
confirmation, hosted behavioral/concurrency tests and owner migration approval
remain release gates. No production security PASS or deployment approval is claimed.
