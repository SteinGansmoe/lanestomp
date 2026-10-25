import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { RiotApiClient } from "./lib/riot-api-client.mjs";
import { getRiotCollectionBlockReason } from "./lib/riot-collection-safety.mjs";

assert.equal(getRiotCollectionBlockReason({ NODE_ENV: "development" }), null);
assert.equal(getRiotCollectionBlockReason({ NODE_ENV: "test" }), null);
for (const env of [
  { NODE_ENV: "production" },
  { VERCEL_ENV: "production" },
  { NODE_ENV: "production", RIOT_API_KEY: "development-test-key" },
  { NODE_ENV: "production", RIOT_COLLECTION_ENABLED: "true" },
]) {
  assert.match(getRiotCollectionBlockReason(env), /disabled in production/);
}

// Production must fail before a rate-limit wait or network dispatch, regardless of key value.
const previousNodeEnv = process.env.NODE_ENV;
let requests = 0;
const previousFetch = globalThis.fetch;
globalThis.fetch = async () => {
  requests++;
  throw new Error("Unexpected network call");
};
try {
  process.env.NODE_ENV = "production";
  const client = new RiotApiClient({
    apiKey: "test-only-key",
    rateLimiter: {
      acquire() {
        throw new Error("Unexpected rate limiter call");
      },
    },
  });
  await assert.rejects(client.fetchMatch("EUW1_test"), /disabled in production/);
  await assert.rejects(
    client.fetchLeagueEntriesByPuuid({ platformRegion: "EUW1", puuid: "test" }),
    /disabled in production/,
  );
  assert.equal(requests, 0);
} finally {
  globalThis.fetch = previousFetch;
  if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = previousNodeEnv;
}

// The legacy script bypasses RiotApiClient; it must stop before loading DB data too.
const legacy = spawnSync(process.execPath, ["scripts/update-counter-pick-match-statistics.mjs"], {
  encoding: "utf8",
  env: { ...process.env, NODE_ENV: "production" },
});
assert.notEqual(legacy.status, 0);
assert.match(legacy.stderr, /disabled in production/);

const read = (path) =>
  readFileSync(new URL("../" + path, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const actions = read("src/app/admin/league/counter-picks/actions.ts");
for (const name of [
  "startRiotScanJob",
  "startRiotCollectionJob",
  "resumeRiotCollectionJob",
  "refreshRiotSeedCandidateRanks",
  "refreshMatchupRankCoverageParticipants",
]) {
  const body = actions.slice(actions.indexOf("export async function " + name + "("));
  assert.ok(body.indexOf("getRiotCollectionBlockReason()") >= 0, name + " guard missing");
  assert.ok(
    body.indexOf("getRiotCollectionBlockReason()") < body.indexOf("getAuthorizedAdmin("),
    name + " must block before any work",
  );
}
const poll = actions.slice(
  actions.indexOf("export async function getRiotCollectionJob("),
  actions.indexOf("export async function getRiotCollectionInventory("),
);
assert.ok(
  poll.indexOf("if (getRiotCollectionBlockReason()) return jobResult;") <
    poll.indexOf("advanceRiotCollectionJob("),
);
assert.match(
  read("src/app/league/counters/page.tsx"),
  /if \(!publicCounterPickEnabled\) notFound\(\)/,
);
for (const path of [
  "src/app/page.tsx",
  "src/app/sitemap.ts",
  "src/components/site-header.tsx",
  "src/components/site-footer.tsx",
]) {
  assert.doesNotMatch(read(path), /\/league\/counters/);
}
const migration = read("supabase/migrations/20261026090000_restrict_counter_pick_public_reads.sql");
assert.doesNotMatch(migration, /delete from|truncate|drop table|on public\.league_matchups/i);
assert.match(migration, /from anon/);
assert.match(migration, /public\.is_admin\(auth\.uid\(\)\)/);
console.log("Counter Pick access and Riot production safety tests passed.");
