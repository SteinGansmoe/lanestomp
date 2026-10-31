# Counter Pick metrics RPC access — A09 / #384

Local implementation on `codex/a09-investigation`. No production connection,
application deployment, migration application, commit or push was performed.

## Contract and change

`20260617194500_add_counter_pick_management_metric_rpc.sql` introduced
`public.get_counter_pick_unique_matchup_group_count()` returning bigint, STABLE,
SECURITY DEFINER, with `search_path = public`. It explicitly granted EXECUTE to
all authenticated users and service_role, without revoking PUBLIC or checking
admin identity. Standard PostgreSQL defaults also allow PUBLIC execution unless
the creator's default privileges or later grants changed it. Production ACLs,
owner and actual exposure require inspection; no live vulnerability is asserted.

The sole application caller is `countUniqueMatchupGroups` inside
`src/app/admin/league/counter-picks/actions.ts`. The exported management-metrics
Server Action first verifies the access token with `auth.getUser` and checks
`is_admin(user.id)`, then obtains a separate service-role client. The admin UI
calls this action. No browser or other repository integration calls this RPC
with its authenticated JWT directly.

The forward migration `20261031223000_restrict_counter_pick_metrics_rpc.sql` only
revokes EXECUTE from PUBLIC, anon and authenticated, explicitly grants service_role
EXECUTE, sets an empty search_path, and requests a PostgREST schema-cache reload
inside one transaction. ALTER FUNCTION preserves the existing owner, OID, body,
no-argument signature, bigint result, STABLE and SECURITY DEFINER properties.
The table is already schema-qualified; count/least/greatest use PostgreSQL builtins.
Do not apply the empty path to an unexpectedly different hosted body without review.

Counting remains canonical unordered champion pair + role + patch across the
observation corpus. Reversed orientation, duplicate groups across matches and
rank brackets do not add groups; different pairs, roles and patches do. No patch
ordering/selection is introduced. The function takes no arguments and writes no
metrics. No observations, statistics, summaries, counts, ingestion or aggregation
code is changed. The known issue is administrative aggregate disclosure, not
proved record disclosure or statistic forgery. Repeated aggregate calls might
consume resources; no load/performance attack was tested.

| Caller                                                    | Before (repository/default PostgreSQL fixture) | After                            |
| --------------------------------------------------------- | ---------------------------------------------- | -------------------------------- |
| PUBLIC-only / anonymous                                   | Allowed via default PUBLIC execution           | Denied                           |
| Ordinary authenticated                                    | Explicitly allowed                             | Denied                           |
| Admin JWT (authenticated SQL role), direct RPC            | Allowed                                        | Denied                           |
| Admin UI via authorized Server Action                     | Service-backed execution                       | Still service-backed and allowed |
| service_role / explicitly trusted inheriting service role | Allowed                                        | Allowed                          |
| Function owner / privileged database maintenance          | Owner/privileged execution                     | Unchanged                        |

This is a database-only deployment. No frontend release or staged expand/contract
rollout is required. External direct-authenticated RPC clients, if any, must move
to an authorized server boundary. Do not distribute service credentials to clients.
The production collection guard and public Counter Pick closure remain unchanged.

## Local verification

Run without environment credentials or network:

```powershell
npm run test:counter-pick-metrics-access
npm run test:counter-pick-management-metrics
npm run test:counter-pick-access-safety
npm run test:matchup-guide-access
npm run test:matchup-feedback-access
npm run test:matchup-feedback-ui
npx next typegen
npm run typecheck
npm run lint
git diff --check
```

The new in-memory PGlite test enables its bundled pgcrypto extension and replays
actual relevant migrations, including A01 and A08. It tests old exposure,
PUBLIC/anon/user/direct-admin/inherited-user denial after migration, service and
inherited-service success, empty/nonempty corpus semantics, owner/OID/body/result
preservation, unchanged rows/table ACLs/RLS/unrelated functions, reapplication,
public guide privacy and working feedback submission/moderation. It executes the
inspection transaction before/after and checks preservation. No hosted database,
production credentials or Riot API is used.

The fixture uses synthetic roles, a simplified auth.uid(), broad modeled default
grants and selected historical migrations, not the entire hosted schema. It does
not reproduce hosted role inheritance, PostgREST/JWT/schema-cache behavior or all
views/functions/external integrations. Existing metrics tests cover normalization
and grouping but do not replace the database role tests.

## Owner production inspection (read-only)

Independently verify the intended Supabase project. In its SQL editor, as an
owner-approved metadata inspector, run the complete file
`supabase/inspection/counter-pick-metrics-access.sql`. It begins with
BEGIN TRANSACTION READ ONLY and ends with COMMIT. It reads catalogs and migration
versions only; it does not invoke the count RPC or read any observation rows.
No credentials are required in the file. Keep resulting metadata in private owner
review. If history/relations/roles are absent or inaccessible, stop, ROLLBACK the
failed transaction and investigate; never repair history or infer success.

Inspect all signatures/overloads and same-name schema copies, the trusted owner,
SECURITY DEFINER/STABLE attributes, effective role/PUBLIC EXECUTE, explicit ACLs,
role inheritance/default grants, public schema privileges, observation table/column
privileges, owner and FORCE RLS/BYPASSRLS, and the existing admin/service policies.
The function owner must retain schema usage and observation SELECT privileges
with the expected RLS behavior. The migration runner must own/be authorized to
alter the function and its grants. This migration deliberately does not fix an
unknown owner, inherited extra grants, alternate entry point or schema drift.

The inventory includes dependencies both ways, routines referencing this RPC or
observations, and recursively dependent views. SQL string bodies and dynamic SQL
may evade catalog/text scans: unexpected paths require manual review. Function
bodies are not output; normalized_body_md5 fingerprints prosrc after CRLF-to-LF
normalization. Compare the trusted repository body with the hosted definition in
private review before using an empty search path; a mismatch is a blocker until
explained. Hash equality is supporting evidence, not a substitute for ACL/RLS checks.

Expected before: observation and original RPC migration versions registered; A09
absent. Explicit authenticated/service execution; PUBLIC/anon is environment-dependent.
Expected after: A09 version registered, service EXECUTE true, anon/authenticated
false, PUBLIC absent, empty search_path. Owner, body fingerprint, signature/result,
STABLE/DEFINER, underlying table grants/policies and unrelated contracts stay the same.
An admin uses the authenticated SQL role; direct denial is expected and does not
break the service-backed admin action.

## Exact release sequence (owner execution only)

1. Review the one forward migration, new tests, inspection, this document and package
   script. Exclude `docs/architecture-audit.md`. Confirm no frontend, pipeline,
   historical migration, data-cleanup or disabled-guard changes are included.
2. Run local checks above. In disposable hosted staging, apply through the normal
   migration workflow and verify actual PostgREST/JWT anonymous/user/direct-admin
   denial and authorized service-backed admin success. Verify minimal guide/count
   reads and feedback behavior there. Staging feedback/moderation tests are
   authorized staging writes, never implicit permission for production writes.
3. Retain normal backups and inspect production metadata read-only as above. Resolve
   owner/body/schema drift, inherited effective grants, alternate overloads/paths
   and any legitimate external direct JWT client before release.
4. With the intended project already linked, run `npx supabase migration list --linked`
   and `npx supabase db push --linked --dry-run`. These are read-only database checks.
   Prerequisite observation/RPC migrations and existing A01/A08 history must align.
   The dry-run must propose exactly the A09 migration. Stop for anything else; do
   not use `--include-all`, seeds or migration-history repair to force the plan.
5. Obtain explicit owner approval for the inspected migration plan. Only then apply
   via the approved database workflow (`npx supabase db push --linked` for that
   verified CLI plan). This changes production permissions/configuration; it is
   not performed by this implementation task. Schema-cache reload is included.
6. Re-run metadata/history inspection read-only and compare expected after results.
   With separately authorized identities, ordinary-user GET RPC probes should be
   denied and the admin UI/service path should still work. A successful count reads
   private aggregate data: only the authorized owner may perform/record that check.
   Do not expose the resulting corpus count, tokens or headers in public logs.
   Feedback submissions/moderation are production writes requiring separate approval;
   use staging regression evidence unless the owner explicitly authorizes them.
7. Record deployed version and verification outcomes. Do not claim production PASS
   based on PGlite or catalog checks alone. Leave untested identity/behavior checks
   explicitly incomplete. Keep Counter Pick collection disabled throughout.

## Recovery and remaining assumptions

A failed migration transaction should roll back its ACL/path changes. Confirm actual
history/metadata before retrying. After commit, keep public/user EXECUTE revoked;
prepare a reviewed forward correction if an owner privilege or body issue surfaces.
Do not restore PUBLIC/authenticated EXECUTE to repair an admin UI metric. The UI
already represents metric failures as unavailable. Restoring a reviewed safe path
or fixing service access can be considered separately after inspecting the cause,
without changing counting semantics or opening the endpoint. Do not drop/recreate
this function or repair applied migration history as an ad hoc rollback.

Production ownership/ACL/default privileges, extra integrations, actual function
body, PostgREST configuration and remote migration history remain owner inspection
gates. The local implementation does not authorize a commit, push, PR, production
migration or deployment. No frontend changes are needed for the known caller.
