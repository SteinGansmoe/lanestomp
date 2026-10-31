import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// Disposable PostgreSQL only: no environment files, credentials or network.
const db = new PGlite();
const admin = "00000000-0000-0000-0000-000000000001";
const user = "00000000-0000-0000-0000-000000000002";
const otherUser = "00000000-0000-0000-0000-000000000003";
const migration = "20261031193000_secure_matchup_feedback_submission.sql";
const signature = "public.submit_matchup_feedback(bigint,text,text,text,text,text,text,text,text)";
const inspectionSql = await readFile(
  new URL("../supabase/inspection/matchup-feedback-access.sql", import.meta.url),
  "utf8",
);
const rows = async (sql, params = []) => (await db.query(sql, params)).rows;
const migrate = async (name) =>
  db.exec(await readFile(new URL(`../supabase/migrations/${name}`, import.meta.url), "utf8"));
async function asRole(role, id, fn) {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? ""]);
  await db.exec(`set role ${role}`);
  try {
    return await fn();
  } finally {
    await db.exec("reset role");
  }
}
async function submit(overrides = {}) {
  const args = {
    matchup: 1,
    player: "Spoofed player",
    enemy: "Spoofed enemy",
    lane: "mid",
    card: "overview",
    type: "helpful",
    reason: null,
    message: null,
    session: "session-a",
    ...overrides,
  };
  return rows(
    `select * from public.submit_matchup_feedback($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    Object.values(args),
  );
}
async function snapshot() {
  return {
    feedback: await rows("select * from public.matchup_feedback order by id"),
    counts: await rows(
      "select * from public.matchup_feedback_counts order by matchup_id, card_type",
    ),
  };
}

try {
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth;
    create schema supabase_migrations;
    create table supabase_migrations.schema_migrations(version text primary key);
    create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    create table public.league_champions (id text primary key, name text not null);
    insert into public.league_champions values ('Ahri', 'Ahri Canonical'), ('Annie', 'Annie Canonical');
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
    "20261030193000_expand_matchup_guide_public_view.sql",
    "20261030193100_contract_matchup_guide_storage_access.sql",
  ])
    await migrate(name);
  await db.exec(`
    insert into auth.users(id) values ('${admin}'), ('${user}'), ('${otherUser}');
    update public.profiles set role='admin' where id='${admin}';
    insert into public.league_matchups(champion_a_id,champion_b_id,role,generation_status)
      values ('Ahri','Annie','mid','reviewed'), ('Ahri','Annie','top','draft'),
             ('Ahri','Annie','support','failed');
  `);
  // Confirm the original weakness without touching a hosted database.
  await asRole("anon", null, () =>
    db.exec(`
    insert into public.matchup_feedback(matchup_id,player_champion,enemy_champion,lane,card_type,feedback_type,status)
      values (1,'legacy','legacy','mid','arbitrary','helpful','resolved');
  `),
  );
  const before = await snapshot();
  await db.exec(inspectionSql);
  assert.deepEqual(await snapshot(), before, "Pre-migration inspection must not change feedback");
  // The RPC must assign open explicitly, independently of a changed table default.
  await db.exec("alter table public.matchup_feedback alter column status set default 'dismissed'");
  // Explicit column grants must not survive a table-level revoke.
  await db.exec(
    "grant insert (matchup_id, status) on public.matchup_feedback to anon, authenticated",
  );
  await migrate(migration);
  assert.deepEqual(
    await snapshot(),
    before,
    "Migration must preserve records and counts byte-for-byte",
  );
  for (const [role, id] of [
    ["anon", null],
    ["authenticated", user],
  ]) {
    await asRole(role, id, async () => {
      await assert.rejects(
        db.exec(`insert into public.matchup_feedback
        (matchup_id,player_champion,enemy_champion,lane,card_type,feedback_type,status,user_id)
        values (1,'spoof','spoof','mid','overview','helpful','resolved','${otherUser}')`),
        { code: "42501" },
      );
      await assert.rejects(
        db.exec("insert into public.matchup_feedback(matchup_id,status) values(1,'resolved')"),
        { code: "42501" },
      );
      await assert.rejects(
        db.query("select public.refresh_matchup_feedback_counts(1,'overview')"),
        { code: "42501" },
      );
      await assert.rejects(db.query("select public.handle_matchup_feedback_counts()"), {
        code: "42501",
      });
      assert.deepEqual(await rows("select id from public.matchup_feedback"), []);
      assert.deepEqual(
        await rows("update public.matchup_feedback set status='dismissed' returning id"),
        [],
      );
      for (const invalid of [
        { type: "invalid" },
        { type: null },
        { lane: null },
        { lane: "invalid" },
        { card: null },
        { card: "invalid" },
        { reason: "invalid" },
        { matchup: null },
        { matchup: 9999 },
        { matchup: 2, lane: "top" },
        { matchup: 3, lane: "support" },
        { lane: "top" },
        { message: "x".repeat(4001) },
      ])
        await assert.rejects(submit(invalid), { code: "P0001" });
      if (!id) {
        for (const session of [null, "", "   ", "x".repeat(201)])
          await assert.rejects(submit({ session }), { code: "P0001" });
      }
      // Additional caller-assigned status/user fields do not exist in the RPC.
      await assert.rejects(
        db.query(`select * from public.submit_matchup_feedback(
        p_matchup_id=>1,p_player_champion=>'x',p_enemy_champion=>'x',p_lane=>'mid',
        p_card_type=>'overview',p_feedback_type=>'helpful',p_status=>'resolved')`),
        { code: "42883" },
      );
      await assert.rejects(
        db.query(`select * from public.submit_matchup_feedback(
        p_matchup_id=>1,p_player_champion=>'x',p_enemy_champion=>'x',p_lane=>'mid',
        p_card_type=>'overview',p_feedback_type=>'helpful',p_user_id=>'${otherUser}'::uuid)`),
        { code: "42883" },
      );
      await submit();
      await submit(); // Idempotent repeated vote.
      await submit({ type: "not_helpful" }); // Vote switch updates rather than duplicates.
      await submit({ type: "report_issue", reason: "incorrect_advice", message: " first " });
      await submit({ type: "report_issue", reason: "other", message: " second " });
    });
  }
  let feedback = await rows(
    "select * from public.matchup_feedback where card_type='overview' order by id",
  );
  assert.equal(feedback.length, 4, "One vote and one report per identity");
  for (const row of feedback) {
    assert.equal(row.player_champion, "Ahri Canonical");
    assert.equal(row.enemy_champion, "Annie Canonical");
    assert.equal(row.status, "open");
    assert.equal(
      row.user_id === null ? row.session_id : row.user_id,
      row.user_id === null ? "session-a" : user,
    );
    if (row.user_id) assert.equal(row.session_id, null);
    if (row.feedback_type === "report_issue") {
      assert.equal(row.reason, "other");
      assert.equal(row.message, "second");
    } else assert.equal(row.reason, null);
  }
  assert.deepEqual(
    await rows(
      "select helpful_count,not_helpful_count from public.matchup_feedback_counts where card_type='overview'",
    ),
    [{ helpful_count: 0, not_helpful_count: 2 }],
  );
  // Moderation still works, and resubmission cannot reopen a moderated record.
  await asRole("authenticated", admin, async () => {
    assert.equal((await rows("select id from public.matchup_feedback")).length, 5);
    assert.equal(
      (
        await rows(
          "update public.matchup_feedback set status='resolved' where card_type='overview' returning id",
        )
      ).length,
      4,
    );
  });
  for (const [role, id] of [
    ["anon", null],
    ["authenticated", user],
  ]) {
    await asRole(role, id, async () => {
      const vote = await submit({ type: "helpful", reason: "other" });
      assert.equal(vote[0].selected_feedback_type, "helpful");
      await submit({ type: "report_issue", reason: "other" });
      for (const card of [
        "early_game",
        "trading_pattern",
        "power_spikes",
        "danger_windows",
        "win_conditions",
      ])
        await submit({ card });
      await submit({ card: "early_game", message: "x".repeat(4000) });
      await submit({ card: "early_game", message: "😀".repeat(4000) });
      await assert.rejects(submit({ message: "😀".repeat(4001) }), { code: "P0001" });
      // SQL checks the raw argument before its own space-only trim. The UI
      // sends already-trimmed text; padded oversized direct RPC input is denied.
      await assert.rejects(submit({ message: " " + "x".repeat(4000) }), { code: "P0001" });
    });
  }
  assert.deepEqual(
    await rows("select distinct status from public.matchup_feedback where card_type='overview'"),
    [{ status: "resolved" }],
  );
  assert.deepEqual(
    await rows(
      "select helpful_count,not_helpful_count from public.matchup_feedback_counts where card_type='overview'",
    ),
    [{ helpful_count: 2, not_helpful_count: 0 }],
  );
  // A different authenticated user cannot update the first user's vote by sharing its session.
  await asRole("authenticated", otherUser, () => submit({ type: "not_helpful" }));
  assert.equal(
    (await rows("select id from public.matchup_feedback where user_id=$1", [user])).length,
    7,
  );
  // Service maintenance/delete and trigger-derived counts remain operational.
  await asRole("service_role", null, async () => {
    await db.exec(
      "delete from public.matchup_feedback where card_type='overview' and user_id is null",
    );
    await db.exec("select public.refresh_matchup_feedback_counts(1,'overview')");
  });
  assert.deepEqual(
    await rows(
      "select helpful_count,not_helpful_count from public.matchup_feedback_counts where card_type='overview'",
    ),
    [{ helpful_count: 1, not_helpful_count: 1 }],
  );
  // Function ownership, safe search path and explicit public execution contract.
  const fn = (
    await rows(
      `select prosecdef,proowner::regrole::text as owner,proconfig
    from pg_proc where oid=$1::regprocedure`,
      [signature],
    )
  )[0];
  assert.equal(fn.prosecdef, true);
  assert.equal(fn.owner, "postgres");
  assert.ok(fn.proconfig.includes('search_path=""'));
  assert.deepEqual(
    await rows(
      `select p.proname from pg_proc p, lateral aclexplode(p.proacl) acl
      where p.oid in ($1::regprocedure,
        'public.refresh_matchup_feedback_counts(bigint,text)'::regprocedure,
        'public.handle_matchup_feedback_counts()'::regprocedure)
      and acl.grantee=0`,
      [signature],
    ),
    [],
    "No PUBLIC execution grant on submission or count helpers",
  );
  const preserved = await snapshot();
  await db.exec(inspectionSql);
  assert.deepEqual(
    await snapshot(),
    preserved,
    "Post-migration inspection must not change feedback",
  );
  await migrate(migration);
  assert.deepEqual(await snapshot(), preserved);
  console.log(
    "PASS: feedback RPC validation, direct-insert denial, identity/status protection, duplicates, moderation, counts and migration preservation (disposable PostgreSQL).",
  );
} finally {
  await db.close();
}
