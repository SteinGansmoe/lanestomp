import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceLoader } from "./lib/load-source-module.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const champions = Array.from({ length: 1002 }, (_, i) => ({
  id: `Champion${i}`,
  name: `Champion ${i}`,
}));
const guides = Array.from({ length: 1001 }, (_, i) => ({
  id: i + 1,
  champion_a_id: champions[i].id,
  champion_b_id: champions[1001].id,
  role: "mid",
  updated_at: "2026-10-30T12:00:00Z",
}));
const calls = [];
let scenario = "ok";
const client = {
  from(table) {
    const builder = {
      select(columns, options) {
        assert.equal(options.count, "exact");
        assert.ok(columns.includes("id"));
        return this;
      },
      eq() {
        return this;
      },
      order(column, options) {
        assert.equal(column, "id");
        assert.equal(options.ascending, true);
        return this;
      },
      async range(from, to) {
        calls.push([table, from, to]);
        const source = table === "league_champions" ? champions : guides;
        let data = source.slice(from, to + 1).map((row) => ({ ...row }));
        let count = source.length;
        if (table === "league_champions" && scenario === "champions-fail")
          return { data: null, count: null, error: { code: "503" } };
        if (table === "public_league_matchups") {
          if (scenario === "first-fail" || (scenario === "second-fail" && from > 0))
            return { data: null, count: null, error: { code: "PGRST205" } };
          if (scenario === "null-data") data = null;
          if (scenario === "null-count") count = null;
          if (scenario === "zero") {
            data = [];
            count = 0;
          }
          if (scenario === "truncated") data = data.slice(0, 50);
          if (scenario === "changed-count" && from > 0) count++;
          if (scenario === "duplicate-id") data[1].id = data[0].id;
          if (scenario === "missing-champion") data[0].champion_b_id = "Missing";
          if (scenario === "invalid-role") data[0].role = "invalid";
          if (scenario === "invalid-date") data[0].updated_at = "invalid";
          if (scenario === "duplicate-url" && from === 0)
            Object.assign(data[1], { ...data[0], id: data[1].id });
        }
        return { data, count, error: null };
      },
    };
    return builder;
  },
};
function load(clientValue) {
  return sourceLoader(root, {
    [path.join(root, "src/lib/supabase.ts")]: { supabase: clientValue },
  })("src/data/sitemap-matchups.ts");
}
await assert.rejects(load(null).getMatchupsForSitemap(), /Sitemap requires/);
const reader = load(client);
const sitemap = await reader.getMatchupsForSitemap();
assert.equal(sitemap.length, guides.length);
assert.equal(new Set(sitemap.map((row) => row.url)).size, guides.length);
assert.ok(sitemap[0].url.endsWith("/league/matchups/champion-0-vs-champion-1001?role=mid"));
assert.ok(calls.some(([table, from]) => table === "league_champions" && from === 1000));
assert.ok(calls.some(([table, from]) => table === "public_league_matchups" && from === 1000));
for (scenario of [
  "champions-fail",
  "first-fail",
  "second-fail",
  "null-data",
  "null-count",
  "truncated",
  "changed-count",
  "duplicate-id",
  "missing-champion",
  "invalid-role",
  "invalid-date",
  "duplicate-url",
]) {
  await assert.rejects(reader.getMatchupsForSitemap(), /Sitemap/, scenario);
}
scenario = "zero";
assert.deepEqual(await reader.getMatchupsForSitemap(), []);
console.log(
  "Sitemap completeness tests passed: complete pagination, explicit zero, missing config, dependency failures, partial/invalid data.",
);
