# Matchup Guide access — A01 / #374 / #376

Finalization on `chore/finalize-matchup-guide-security`, 31 October 2026.
This change reconciles repository history without changing application behavior,
SQL contents or RLS policies. Codex performed no production requests, migrations,
commit, push, merge or deployment for #376.

## Completed production rollout (owner-reported)

The owner reports in [issue #376](https://github.com/SteinGansmoe/lanestomp/issues/376):

- Expand applied successfully to Supabase production; the public view was deployed.
- The view-based application was merged into `main` and deployed.
- Contract applied successfully through an isolated release stage; its version
  is already registered in production migration history.
- PostgreSQL privilege checks returned the expected values.
- All **9,073 reviewed guides** remained available.
- The owner verified `lanestomp.com` after contraction.
- Database exports completed successfully before contraction.

These are owner-reported production results, not live checks executed by Codex.
The count records rollout evidence, not a permanent expected dataset size.
Live anonymous and ordinary authenticated PostgREST tests remain unperformed here.

## Canonical migration history

Both applied phases now live in the normal migration directory:

1. `supabase/migrations/20261030193000_expand_matchup_guide_public_view.sql`
   creates the public view, grants SELECT and reloads the schema cache without
   changing base-table access.
2. `supabase/migrations/20261030193100_contract_matchup_guide_storage_access.sql`
   removes the broad public policy, revokes PUBLIC/anonymous storage access and
   adds the restrictive authenticated admin policy. Existing admin CRUD and
   service access remain.

The Contract file was moved from `supabase/deferred-migrations` byte-for-byte.
Its original and final SHA256 are identical:

```text
422343B211C73A62B03FC4E6623A53F3EFE8BAF76623B97288EA7074E6A5C5FF
```

There is no deferred copy. The historical SQL header describes its former staging
location because the applied SQL must remain unchanged. No other historical
migration was edited. Versions must be unique and sorted by their 14-digit prefix;
Expand precedes Contract. Both migrations are transactional and delete no content.
The local check found 59 unique, ordered versions. The hash above covers the
original Windows working-copy bytes, including CRLF; comparison with the Git
original using its checkout filters also matched. Git stores normalized LF bytes.

### Owner verification commands

These commands were not executed against production by Codex. From this repository,
with the intended production project already linked and its identity independently
verified, run these read-only checks:

```powershell
Get-ChildItem -LiteralPath supabase/migrations -Filter '*matchup_guide*.sql' |
  Sort-Object Name | Select-Object -ExpandProperty Name
Get-FileHash -Algorithm SHA256 -LiteralPath supabase/migrations/20261030193100_contract_matchup_guide_storage_access.sql
npx supabase migration list --linked
npx supabase db push --linked --dry-run
```

The list must show both local and remote entries for `20261030193000` and
`20261030193100`, with no unmatched history elsewhere. The dry-run must report no
pending migrations. Keep `--dry-run`; do not execute a push without it for this
task. Do not use `--include-all`, seeds, automatic migration hooks or history repair.
No `supabase migration repair` is required for the owner-reported state: the
already-applied remote version now has its exact local file. If history differs,
stop and investigate the target and release evidence instead of marking anything
applied or rerunning SQL. Remote history and the linked dry-run remain unverified
by Codex.

Optional read-only SQL in the owner's SQL editor confirms the remote versions:

```sql
begin transaction read only;
select version from supabase_migrations.schema_migrations
where version in ('20261030193000', '20261030193100') order by version;
commit;
```

Run `supabase/inspection/matchup-guide-access.sql` for read-only grants, effective
column privileges, policies, dependent views/routines and profile authorization.
Keep definitions and credentials private. Additional deployed paths, role inheritance
and explicit column grants still require inspection in that environment.

## Public projection and access matrix

The reviewed-only view exposes `id`, `champion_a_id`, `champion_b_id`, `role`,
`overview`, `early_game`, `trading_pattern`, `power_spikes`, `danger_windows`,
`win_conditions`, `difficulty_rating`, `confidence_level`, `generation_status`,
and `updated_at`. It excludes draft/failed rows, `admin_notes`, `reviewed_by`,
`reviewed_at`, `generated_at`, `created_at`, and unused `itemization_notes`.
Future storage fields remain excluded automatically.

The view uses `postgres` ownership, `security_invoker = false` and
`security_barrier = true`. Its predicate and explicit column allowlist are the
public boundary; the owner's underlying RLS does not protect the projection.
Never replace its projection with `SELECT *` or grant public writes.

| Identity | Public view | Original table after Contract |
| --- | --- | --- |
| Anonymous | Reviewed public fields; SELECT only | No SELECT access |
| Signed-in non-admin | Reviewed public fields; SELECT only | No rows visible; UPDATE/DELETE none; INSERT denied |
| Administrator | Reviewed public fields | Authorized SELECT/INSERT/UPDATE/DELETE |
| Service role / owner | Authorized access | Authorized access retained |

Public guide, coverage, sitemap and Counter Pick guide-availability readers use
`public_league_matchups`. Admin CRUD, review and generation retain the base-table
API. Generation validates the token and `is_admin`, then uses the user's JWT.
Browser checks cannot override RLS. `profiles.role` is the admin trust root and its
deployed protection needs inspection. The fallback scanner requires a service key
or actual admin session; anonymous storage reads are closed. Feedback foreign keys,
triggers and submission RPC are unchanged.

## Reproducible read-only PostgREST checks

Owner execution only; **not executed live by Codex**. Use a known ordinary user's
fresh access JWT, independently confirmed to have a non-admin profile. Never use
an admin JWT or service/secret key. Use the project's publishable key or legacy
anon key as `apikey`. Anonymous requests omit Authorization; authenticated requests
send the user's JWT.

Save the following Python 3 standard-library code as a local temporary script and
run `python <script-path>` (or `py <script-path>` on Windows with the Python launcher)
in a private terminal with transcription/debug tracing off.
Credentials use hidden prompts, never shell arguments, source, environment files
or logs. Only fixed PASS/FAIL labels are printed. Response bodies, raw errors,
tokens, headers and private values are never printed. Requests are GET-only and
redirects are refused. Responses stay in memory. This samples public content;
the SQL definition and disposable database tests independently check its predicate
and complete column projection.

```python
import getpass
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
import warnings

# Refuse getpass's echoing fallback if the terminal cannot hide input.
warnings.simplefilter("error", getpass.GetPassWarning)

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def require(condition):
    if not condition:
        raise ValueError("check failed")

def run():
    base = input("Owner-verified Supabase HTTPS origin: ").strip().rstrip("/")
    origin = urllib.parse.urlsplit(base)
    require(origin.scheme == "https" and origin.hostname and
            not origin.username and not origin.password and
            origin.path in ("", "/") and not origin.query and not origin.fragment)
    key = getpass.getpass("Publishable or legacy anon key: ")
    jwt = getpass.getpass("Ordinary non-admin user's access JWT: ")
    require(bool(key) and bool(jwt))
    opener = urllib.request.build_opener(NoRedirect())
    allowed = set("id champion_a_id champion_b_id role overview early_game "
                  "trading_pattern power_spikes danger_windows win_conditions "
                  "difficulty_rating confidence_level generation_status updated_at".split())
    private = "admin_notes reviewed_by reviewed_at generated_at created_at itemization_notes".split()

    def get(relation, query, token):
        headers = {"apikey": key, "Accept": "application/json"}
        if token:
            headers["Authorization"] = "Bearer " + token
        request = urllib.request.Request(base + "/rest/v1/" + relation + "?" +
                                         urllib.parse.urlencode(query), headers=headers)
        try:
            with opener.open(request, timeout=30) as response:
                return response.status, json.load(response)
        except urllib.error.HTTPError as error:
            with error:
                return error.code, json.load(error)

    for identity, token in (("anonymous", None), ("ordinary authenticated", jwt)):
        status, rows = get("public_league_matchups", {"select": "*", "limit": "1"}, token)
        require(status == 200 and isinstance(rows, list) and len(rows) == 1)
        require(set(rows[0]) == allowed and rows[0]["generation_status"] == "reviewed")
        for state in ("draft", "failed"):
            status, rows = get("public_league_matchups", {
                "select": "id", "generation_status": "eq." + state, "limit": "1"}, token)
            require(status == 200 and rows == [])
        for field in private:
            status, error = get("public_league_matchups", {"select": field, "limit": "1"}, token)
            require(status == 400 and isinstance(error, dict) and error.get("code") == "42703")
        status, rows = get("league_matchups", {"select": "id", "limit": "1"}, token)
        if token:
            require(status == 200 and rows == [])
        else:
            require(status in (401, 403) and isinstance(rows, dict) and rows.get("code") == "42501")
        print(identity + ": PASS")

try:
    run()
except Exception:
    print("REST checks: FAIL (inspect privately; no response or credential logged)")
    sys.exit(1)
```

A failure is not proof of an ACL regression: privately inspect target identity,
JWT expiry/profile, schema-cache state and network conditions. Do not paste raw
responses into issue logs. The nonempty public sample assumes reviewed guides
exist, as reported at rollout. This does not test production mutations, admin
workflows, service-role REST access or every deployed RPC/schema. Test CRUD and
denied public writes only in a disposable Supabase environment.

## Local verification and limitations

Codex executed these checks locally for #376:

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run test:matchup-guide-access` | Passed (disposable PostgreSQL) |
| `npm run test:sitemap-completeness` | Passed |
| `npm run test:matchup-guides-redesign` | Passed |
| `npm run test:matchup-guide-detail-redesign` | Passed |
| `npm run test:matchup-guide-artwork-layering` | Passed |
| Migration bytes/history checks and `git diff --check` | Passed |

The access suite also checks canonical migration presence, deferred-copy absence,
unique well-formed versions and Expand-before-Contract ordering.
The Python REST procedure was reviewed but not executed in this environment;
it requires an installed Python 3 interpreter and owner-supplied credentials.

The access suite uses disposable in-memory PGlite with synthetic roles/data and
no credentials or production requests. It checks the preexisting exposure,
expansion compatibility, early-contraction guard, final anonymous/non-admin/admin/
service access, excluded columns, publication/reset, admin CRUD/RETURNING,
feedback compatibility and future-column exclusion. A broad test policy confirms
the restrictive admin policy still blocks ordinary users. Local results cannot
establish live PostgREST behavior.

The previous A01 report recorded passing sitemap build tests (six default Turbopack
builds against a synthetic HTTP API, including warm-cache failure), slug checks,
draft prompt and homepage regressions. Those are historical local results, not
rerun evidence for #376. No full rebuild is needed for this SQL file move,
test-path update and documentation change.

The sitemap fully paginates active champions and reviewed guides, validates
counts, IDs, dates, roles and champion resolution, and fails rather than returning
partial results. It remains a release snapshot. Pagination is not an atomic
database snapshot: count changes fail the build; same-count concurrent edits may
escape detection. Avoid publication during release builds and retry after recovery.
Missing/inactive champions or invalid dates/roles must be repaired in data rather
than bypassing checks.

Docker/local Supabase, browser hydration and external AI generation are not covered
by disposable tests. Additional deployed policies/views/RPCs, effective role
inheritance, column grants, profile-role protection and PostgreSQL 15+ view options
remain environment-specific checks. Do not infer them from a passing local suite.

## Recovery after completed contraction

Retain pre-contract database exports, normal backups, release artifacts, inspection
evidence and a verified view-compatible application rollback artifact. Never restore
broad SELECT or `USING (true)` to recover an old reader. Keep the public view and
SELECT grants; roll back only to a view-compatible application, fix forward, or
serve maintenance while repairing readers. The original base-table public reader
is no longer a compatible rollback target. Do not delete or repair applied history
as a rollback. Database recovery requires a separate owner-reviewed plan and
authorization. If builds fail due to data/API problems, retain the last verified
release and rebuild after recovery.

## Finalization files

- Move unchanged Contract SQL from deferred to canonical migrations.
- Update `scripts/test-matchup-guide-access.mjs` for reconciled history.
- Update this document for completed production rollout and remaining checks.

The pre-existing untracked `docs/architecture-audit.md` is untouched and excluded.
