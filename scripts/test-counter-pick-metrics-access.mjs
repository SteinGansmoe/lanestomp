import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

// In-memory PostgreSQL: no environment files, credentials, network or production.
const db = new PGlite({ extensions: { pgcrypto } });
const migration = "20261031223000_restrict_counter_pick_metrics_rpc.sql";
const signature = "public.get_counter_pick_unique_matchup_group_count()";
const admin = "00000000-0000-0000-0000-000000000001";
const user = "00000000-0000-0000-0000-000000000002";
const readSql = (folder, name) =>
  readFile(new URL(`../supabase/${folder}/${name}`, import.meta.url), "utf8");
const inspection = await readSql("inspection", "counter-pick-metrics-access.sql");
const rows = async (sql, args = []) => (await db.query(sql, args)).rows;
const scalarCount = async () => Number((await rows(`select ${signature} as count`))[0].count);
async function migrate(name) {
  await db.exec(await readSql("migrations", name));
  await db.query(
    "insert into supabase_migrations.schema_migrations values ($1) on conflict do nothing",
    [name.slice(0, 14)],
  );
}
async function asRole(role, id, fn) {
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id ?? ""]);
  await db.exec(`set role ${role}`);
  try {
    return await fn();
  } finally {
    await db.exec("reset role");
  }
}
async function functionState() {
  return (
    await rows(
      `select oid,prosrc,proowner,prosecdef,provolatile,prorettype,pronargs,
    proargtypes::text as arguments,proconfig from pg_proc where oid=$1::regprocedure`,
      [signature],
    )
  )[0];
}
async function snapshot() {
  const data = {};
  for (const table of [
    "riot_matchup_observations",
    "counter_pick_stats",
    "league_matchups",
    "matchup_feedback",
    "matchup_feedback_counts",
  ])
    data[table] = await rows(
      `select * from public.${table} order by ${table === "matchup_feedback_counts" ? "matchup_id,card_type" : "id"}`,
    );
  const tables = await rows(`select oid,relowner,relacl,relrowsecurity,relforcerowsecurity
    from pg_class where relnamespace='public'::regnamespace and relkind in ('r','v','S') order by oid`);
  const policies = await rows(
    "select * from pg_policies where schemaname='public' order by tablename,policyname",
  );
  const otherFunctions = await rows(
    `select oid,prosrc,proowner,proacl,proconfig from pg_proc
    where pronamespace='public'::regnamespace and oid<>$1::regprocedure order by oid`,
    [signature],
  );
  return { data, tables, policies, otherFunctions };
}
async function unrelatedContracts() {
  for (const [role, id] of [
    ["anon", null],
    ["authenticated", user],
  ]) {
    await asRole(role, id, async () => {
      assert.equal((await rows("select id from public.public_league_matchups")).length, 1);
      assert.deepEqual(
        await rows("select id from public.public_league_matchups where generation_status='draft'"),
        [],
      );
      await assert.rejects(db.query("select admin_notes from public.public_league_matchups"), {
        code: "42703",
      });
      if (role === "anon")
        await assert.rejects(db.query("select id from public.league_matchups"), { code: "42501" });
      else assert.deepEqual(await rows("select id from public.league_matchups"), []);
      const result = await rows(`select * from public.submit_matchup_feedback(
        1,'Ahri','Annie','mid','overview','helpful',null,null,'metrics-test-session')`);
      assert.equal(result[0].selected_feedback_type, "helpful");
      await assert.rejects(
        db.query(`insert into public.matchup_feedback
        (matchup_id,player_champion,enemy_champion,lane,card_type,feedback_type)
        values (1,'Ahri','Annie','mid','overview','helpful')`),
        { code: "42501" },
      );
      assert.deepEqual(await rows("select id from public.riot_matchup_observations"), []);
      await assert.rejects(
        db.query(`insert into public.riot_matchup_observations
        (match_id,patch,queue_id,role,champion_a,champion_b,winner_champion,champion_a_won)
        values ('forged','16.9',420,'mid','Ahri','Annie','Ahri',true)`),
        { code: "42501" },
      );
    });
  }
  await asRole("authenticated", admin, async () => {
    assert.equal((await rows("select id from public.riot_matchup_observations")).length, 6);
    assert.equal(
      (await rows("update public.matchup_feedback set status='resolved' returning id")).length,
      2,
    );
  });
}
try {
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create role test_public_only; create role test_auth_member inherit;
    create role test_service_member inherit;
    grant authenticated to test_auth_member; grant service_role to test_service_member;
    create schema auth; create table auth.users(id uuid primary key,email text);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    grant usage on schema public,auth to anon,authenticated,service_role,test_public_only;
    alter default privileges in schema public grant all on tables to anon,authenticated,service_role;
    alter default privileges in schema public grant all on sequences to anon,authenticated,service_role;
    create schema supabase_migrations;
    create table supabase_migrations.schema_migrations(version text primary key);
    create table public.league_champions(id text primary key,name text not null);
    insert into public.league_champions values ('Ahri','Ahri'),('Annie','Annie'),('Zed','Zed');
  `);
  for (const name of [
    "20260526183000_create_profiles.sql",
    "20260527131500_create_league_matchups.sql",
    "20260527141000_add_league_matchup_review_workflow.sql",
    "20260605110000_fix_league_matchup_role_uniqueness.sql",
    "20260605212000_add_failed_league_matchup_generation_status.sql",
    "20260602164000_create_matchup_feedback.sql",
    "20260613093000_add_matchup_feedback_counts.sql",
    "20260613103000_remove_report_feedback_counts.sql",
    "20260614014000_create_counter_pick_stats.sql",
    "20260614133000_create_riot_scan_jobs.sql",
    "20260614183000_create_riot_matchup_observations.sql",
    "20260617194500_add_counter_pick_management_metric_rpc.sql",
    "20261030193000_expand_matchup_guide_public_view.sql",
    "20261030193100_contract_matchup_guide_storage_access.sql",
    "20261031193000_secure_matchup_feedback_submission.sql",
  ])
    await migrate(name);
  await db.exec(`
    insert into auth.users(id) values ('${admin}'),('${user}');
    update public.profiles set role='admin' where id='${admin}';
    insert into public.league_matchups(champion_a_id,champion_b_id,role,generation_status)
      values ('Ahri','Annie','mid','reviewed'),('Ahri','Annie','top','draft');
    insert into public.counter_pick_stats(enemy_champion_id,counter_champion_id,role,patch)
      values ('Ahri','Annie','mid','16.9');
  `);
  assert.equal(await scalarCount(), 0, "Empty corpus count");
  const observations = [
    ["Ahri", "Annie", "mid", "16.9", "gold"],
    ["Annie", "Ahri", "mid", "16.9", "diamond"], // Same canonical group, reversed orientation/rank.
    ["Ahri", "Annie", "mid", "16.9", null], // Duplicate group across matches.
    ["Ahri", "Annie", "top", "16.9", "gold"], // Distinct role.
    ["Ahri", "Annie", "mid", "16.10", "gold"], // Distinct patch, no string-order selection.
    ["Ahri", "Zed", "mid", "16.9", "gold"], // Distinct pair.
  ];
  for (const [index, [a, b, role, patch, rank]] of observations.entries())
    await db.query(
      `insert into public.riot_matchup_observations
      (match_id,patch,queue_id,role,champion_a,champion_b,winner_champion,champion_a_won,rank_bracket)
      values ($1,$2,420,$3,$4,$5,$4,true,$6)`,
      [`synthetic-${index}`, patch, role, a, b, rank],
    );
  for (const [role, id] of [
    ["anon", null],
    ["authenticated", user],
    ["test_public_only", null],
    ["test_auth_member", user],
  ])
    await asRole(role, id, async () =>
      assert.equal(await scalarCount(), 4, "Reproduce legacy exposure"),
    );
  await unrelatedContracts();
  const beforeFunction = await functionState();
  const before = await snapshot();
  await db.exec(inspection);
  assert.deepEqual(await snapshot(), before, "Before inspection is read-only");
  await migrate(migration);
  assert.deepEqual(
    await snapshot(),
    before,
    "No data, table grants, policies or unrelated functions changed",
  );
  const afterFunction = await functionState();
  assert.deepEqual(
    { ...afterFunction, proconfig: beforeFunction.proconfig },
    beforeFunction,
    "Function owner, body, signature, result and STABLE/DEFINER properties are unchanged",
  );
  assert.ok(afterFunction.proconfig.includes('search_path=""'));
  for (const [role, id] of [
    ["anon", null],
    ["authenticated", user],
    ["authenticated", admin],
    ["test_public_only", null],
    ["test_auth_member", user],
  ])
    await asRole(role, id, async () => {
      await assert.rejects(db.query(`select ${signature}`), { code: "42501" });
      const permission = await rows(
        "select has_function_privilege(current_user,$1,'EXECUTE') as allowed",
        [signature],
      );
      assert.equal(permission[0].allowed, false);
    });
  for (const role of ["service_role", "test_service_member"])
    await asRole(role, null, async () =>
      assert.equal(await scalarCount(), 4, "Service execution succeeds"),
    );
  assert.deepEqual(
    await rows(
      `select a.privilege_type from pg_proc p,
    lateral aclexplode(p.proacl) a where p.oid=$1::regprocedure and a.grantee=0`,
      [signature],
    ),
    [],
  );
  await db.exec(inspection);
  assert.deepEqual(await snapshot(), before, "After inspection is read-only");
  await unrelatedContracts();
  const reapplyBefore = await snapshot();
  await migrate(migration);
  assert.deepEqual(await snapshot(), reapplyBefore, "Reapplication preserves existing data");
  const names = (await readdir(new URL("../supabase/migrations/", import.meta.url)))
    .filter((n) => n.endsWith(".sql"))
    .sort();
  assert.equal(
    new Set(names.map((n) => n.slice(0, 14))).size,
    names.length,
    "Unique migration versions",
  );
  assert.equal(names.at(-1), migration, "Exactly one newest forward migration for A09");
  console.log(
    "PASS: A09 legacy exposure, PUBLIC/auth/inherited denial, service access, grouping semantics, unchanged function/data/ACLs and A01/A08 contracts; read-only inspection executed before/after (disposable PostgreSQL).",
  );
} finally {
  await db.close();
}
