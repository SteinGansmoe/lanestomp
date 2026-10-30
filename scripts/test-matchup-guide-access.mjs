import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// A disposable PostgreSQL engine: no environment files, credentials or network.
const db = new PGlite();
const adminId = "00000000-0000-0000-0000-000000000001";
const userId = "00000000-0000-0000-0000-000000000002";
const expandName = "20261030193000_expand_matchup_guide_public_view.sql";
const contractName = "20261030193100_contract_matchup_guide_storage_access.sql";
const contractSql = await readFile(
  new URL(`../supabase/deferred-migrations/${contractName}`, import.meta.url),
  "utf8",
);
const publicFields = [
  "id",
  "champion_a_id",
  "champion_b_id",
  "role",
  "overview",
  "early_game",
  "trading_pattern",
  "power_spikes",
  "danger_windows",
  "win_conditions",
  "difficulty_rating",
  "confidence_level",
  "generation_status",
  "updated_at",
];
const privateFields = [
  "admin_notes",
  "reviewed_by",
  "reviewed_at",
  "generated_at",
  "created_at",
  "itemization_notes",
];

async function migrate(name) {
  await db.exec(await readFile(new URL(`../supabase/migrations/${name}`, import.meta.url), "utf8"));
}

async function asRole(role, user, fn) {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [user ?? ""]);
  await db.exec(`set role ${role}`);
  try {
    await fn();
  } finally {
    await db.exec("reset role");
  }
}

async function rows(sql) {
  return (await db.query(sql)).rows;
}

try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (id uuid primary key, email text);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema public, auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    -- Model Supabase's broad default grants, including on newly created views.
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
    create table public.league_champions (id text primary key);
    insert into public.league_champions values ('Ahri'), ('Annie');
  `);
  for (const name of [
    "20260526183000_create_profiles.sql",
    "20260527131500_create_league_matchups.sql",
    "20260527141000_add_league_matchup_review_workflow.sql",
    "20260605110000_fix_league_matchup_role_uniqueness.sql",
    "20260605212000_add_failed_league_matchup_generation_status.sql",
    "20260602164000_create_matchup_feedback.sql",
    "20260613093000_add_matchup_feedback_counts.sql",
  ])
    await migrate(name);

  await db.exec(`
    insert into auth.users (id) values ('${adminId}'), ('${userId}');
    update public.profiles set role = 'admin' where id = '${adminId}';
    insert into public.league_matchups
      (champion_a_id, champion_b_id, role, generation_status, overview, admin_notes, reviewed_by)
    values
      ('Ahri', 'Annie', 'mid', 'reviewed', 'Published advice', 'private reviewed note', '${adminId}'),
      ('Ahri', 'Annie', 'top', 'draft', 'Draft advice', 'private draft note', null),
      ('Ahri', 'Annie', 'support', 'failed', null, 'private failure detail', null);
  `);
  // Reproduce the repository weakness before applying the repair.
  await asRole("anon", null, async () => {
    assert.equal((await rows("select admin_notes from public.league_matchups")).length, 3);
  });

  // Contraction must fail before expansion and roll back without touching grants.
  await assert.rejects(db.exec(contractSql), /Expand the public guide view/);
  await db.exec("rollback");
  // Expansion must leave the OLD deployed reader working, including coverage.
  await migrate(expandName);
  for (const [role, user] of [
    ["anon", null],
    ["authenticated", userId],
  ]) {
    await asRole(role, user, async () => {
      const oldGuide = await rows(
        "select id, overview from public.league_matchups where generation_status = 'reviewed'",
      );
      const newGuide = await rows("select id, overview from public.public_league_matchups");
      assert.deepEqual(newGuide, oldGuide);
      assert.equal(newGuide.length, 1);
      assert.equal(
        (
          await rows(
            "select count(*)::int as count from public.league_matchups where generation_status = 'reviewed'",
          )
        )[0].count,
        1,
      );
      // Existing exposure intentionally remains until the app is switched.
      assert.equal((await rows("select admin_notes from public.league_matchups")).length, 3);
      for (const field of privateFields)
        await assert.rejects(db.query(`select ${field} from public.public_league_matchups`), {
          code: "42703",
        });
    });
  }
  // Normal db push must not discover the contract migration.
  const activeMigrations = await readdir(new URL("../supabase/migrations/", import.meta.url));
  assert.ok(activeMigrations.includes(expandName));
  assert.ok(!activeMigrations.includes(contractName));
  assert.ok(expandName.slice(0, 14) < contractName.slice(0, 14));
  await asRole("authenticated", adminId, async () => {
    assert.equal((await rows("select admin_notes from public.league_matchups")).length, 3);
    assert.equal(
      (
        await rows(
          "update public.league_matchups set admin_notes = admin_notes where role = 'top' returning id",
        )
      ).length,
      1,
    );
  });
  await db.exec(contractSql);
  await db.exec(
    await readFile(
      new URL("../supabase/inspection/matchup-guide-access.sql", import.meta.url),
      "utf8",
    ),
  );
  // An accidental future permissive policy must not reopen authenticated reads.
  await db.exec(`create policy "Test broad policy" on public.league_matchups
    for all to authenticated using (true) with check (true)`);
  for (const [role, user] of [
    ["anon", null],
    ["authenticated", userId],
  ]) {
    await asRole(role, user, async () => {
      const published = await rows("select * from public.public_league_matchups");
      assert.equal(published.length, 1);
      assert.equal(published[0].overview, "Published advice");
      assert.deepEqual(Object.keys(published[0]), publicFields);
      assert.deepEqual(
        await rows(
          "select id from public.public_league_matchups where generation_status <> 'reviewed'",
        ),
        [],
      );
      assert.deepEqual(
        await rows("select id from public.public_league_matchups where role = 'top'"),
        [],
      );
      for (const field of privateFields) {
        await assert.rejects(db.query(`select ${field} from public.public_league_matchups`), {
          code: "42703",
        });
      }
      if (role === "anon") {
        await assert.rejects(db.query("select * from public.league_matchups"), { code: "42501" });
      } else {
        assert.deepEqual(await rows("select * from public.league_matchups"), []);
        assert.deepEqual(
          await rows(
            "update public.league_matchups set generation_status = 'reviewed' returning id",
          ),
          [],
        );
        assert.deepEqual(await rows("delete from public.league_matchups returning id"), []);
        await assert.rejects(
          db.query(
            "insert into public.league_matchups (champion_a_id, champion_b_id, role) values ('Annie', 'Ahri', 'mid')",
          ),
          { code: "42501" },
        );
      }
      for (const sql of [
        "update public.public_league_matchups set overview = 'injected'",
        "delete from public.public_league_matchups",
        "insert into public.public_league_matchups (champion_a_id, champion_b_id, role) values ('Annie', 'Ahri', 'mid')",
      ])
        await assert.rejects(db.query(sql), { code: "42501" });

      // Existing feedback RPC still accepts votes against the public guide.
      const feedback = await db.query(
        `select * from public.submit_matchup_feedback(
        1, 'Ahri', 'Annie', 'mid', 'overview', 'helpful', null, null, $1)`,
        [`test-${role}`],
      );
      assert.equal(feedback.rows[0].selected_feedback_type, "helpful");
    });
  }

  await asRole("authenticated", adminId, async () => {
    assert.equal(
      (await rows("select admin_notes, reviewed_by from public.league_matchups")).length,
      3,
    );
    // Model generation/reset, editing, publication, INSERT RETURNING and deletion.
    await db.exec(
      "update public.league_matchups set overview = 'Generated advice', generated_at = now(), generation_status = 'draft', reviewed_at = null, reviewed_by = null where role = 'top'",
    );
    assert.equal((await rows("select * from public.public_league_matchups")).length, 1);
    const published = await rows(
      `update public.league_matchups set generation_status = 'reviewed', reviewed_at = now(), reviewed_by = '${adminId}' where role = 'top' returning admin_notes, reviewed_by`,
    );
    assert.equal(published[0].reviewed_by, adminId);
    assert.equal((await rows("select * from public.public_league_matchups")).length, 2);
    const inserted = await rows(
      "insert into public.league_matchups (champion_a_id, champion_b_id, role, admin_notes) values ('Annie', 'Ahri', 'mid', 'admin only') returning id, admin_notes",
    );
    assert.equal(inserted[0].admin_notes, "admin only");
    assert.equal(
      (await rows("delete from public.league_matchups where champion_a_id = 'Annie' returning id"))
        .length,
      1,
    );
    await db.exec(
      "update public.league_matchups set generation_status = 'draft' where role = 'top'",
    );
  });
  await asRole("anon", null, async () => {
    assert.equal((await rows("select * from public.public_league_matchups")).length, 1);
  });
  await asRole("service_role", null, async () => {
    assert.equal((await rows("select admin_notes from public.league_matchups")).length, 3);
  });

  // Adding storage columns must never expand the public API.
  await db.exec("alter table public.league_matchups add column future_internal_field text");
  assert.deepEqual(
    Object.keys((await rows("select * from public.public_league_matchups"))[0]),
    publicFields,
  );
  console.log(
    "Matchup Guide PostgreSQL access tests passed (before/after RLS, projection, CRUD, publication, feedback).",
  );
} finally {
  await db.close();
}
