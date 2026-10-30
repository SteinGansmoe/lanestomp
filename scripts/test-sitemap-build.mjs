import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { sourceLoader } from "./lib/load-source-module.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
// All application source/config is copied, never environment files or credentials.
const scratch = path.join(root, "artifacts/generated-audits", `a01-build-${process.pid}`);
const cli = path.join(root, "node_modules/next/dist/bin/next");
const champions = ["Ahri", "Annie", ...Array.from({ length: 1001 }, (_, i) => `Fixture${i}`)].map(
  (id) => ({
    id,
    name: id,
    riot_key: id,
    riot_data_key: "1",
    title: "test fixture",
    tags: ["Mage"],
    image_url: "https://example.invalid/test.png",
    image_filename: null,
    slug: null,
    version: "test",
    is_active: true,
  }),
);
const guides = Array.from({ length: 1001 }, (_, i) => ({
  id: i + 1,
  champion_a_id: champions[i].id,
  champion_b_id: i === 0 ? "Annie" : champions.at(-1).id,
  role: "mid",
  generation_status: "reviewed",
  overview: "A01 synthetic public guide",
  early_game: "Synthetic early game",
  trading_pattern: "Synthetic trading",
  power_spikes: "Synthetic spikes",
  danger_windows: "Synthetic danger",
  win_conditions: "Synthetic win conditions",
  difficulty_rating: 3,
  confidence_level: "medium",
  updated_at: "2026-10-30T12:00:00Z",
}));
let scenario = "ok";
let viewRequests = 0;
const api = createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const table = url.pathname.split("/").at(-1);
  if (table !== "league_champions" && table !== "public_league_matchups") {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ code: "TEST_UNEXPECTED_TABLE" }));
    return;
  }
  const from = Number(url.searchParams.get("offset") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 10000);
  if (table === "public_league_matchups") viewRequests++;
  if (
    table === "public_league_matchups" &&
    (scenario === "view-missing" || (scenario === "page-two-fails" && from >= 1000))
  ) {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ code: "PGRST205", message: "Synthetic missing relation" }));
    return;
  }
  let rows = table === "league_champions" ? champions : scenario === "zero" ? [] : guides;
  for (const [column, filter] of url.searchParams) {
    if (filter.startsWith("eq."))
      rows = rows.filter((row) => String(row[column]) === filter.slice(3));
  }
  if (url.searchParams.has("order"))
    rows = [...rows].sort((a, b) =>
      typeof a.id === "number" ? a.id - b.id : a.id.localeCompare(b.id),
    );
  const total = rows.length;
  rows = rows.slice(from, from + limit);
  res.writeHead(200, {
    "content-type": "application/json",
    "content-range": `${from}-${from + rows.length - 1}/${total}`,
  });
  res.end(req.method === "HEAD" ? undefined : JSON.stringify(rows));
});
await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve));
const apiUrl = `http://127.0.0.1:${api.address().port}`;
const childEnv = {
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => !/SUPABASE|RIOT|OPENAI|RESEND|ADMIN_EMAILS/i.test(name),
    ),
  ),
  NEXT_PUBLIC_SUPABASE_URL: apiUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "local-test-key",
  NEXT_TELEMETRY_DISABLED: "1",
};
let web;
function run(args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd: scratch, env, windowsHide: true });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code) => resolve({ code, output }));
  });
}
async function configure(name) {
  // Only output/module-resolution paths differ from deployment config.
  const config = (await readFile(path.join(root, "next.config.ts"), "utf8"))
    .replace("root: projectRoot", `root: ${JSON.stringify(root)}`)
    .replace(
      "const nextConfig: NextConfig = {",
      `const nextConfig: NextConfig = { distDir: ${JSON.stringify(`.next-${name}`)},`,
    );
  await writeFile(path.join(scratch, "next.config.ts"), config);
}
try {
  await mkdir(scratch, { recursive: true });
  for (const entry of [
    "src",
    "public",
    "scripts/lib",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "postcss.config.mjs",
  ]) {
    await cp(path.join(root, entry), path.join(scratch, entry), { recursive: true });
  }
  for (scenario of ["missing-config", "view-missing", "page-two-fails", "zero", "ok"]) {
    await configure(scenario);
    viewRequests = 0;
    const env =
      scenario === "missing-config"
        ? { ...childEnv, NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "" }
        : childEnv;
    const result = await run(["build"], env);
    const success = scenario === "zero" || scenario === "ok";
    assert.equal(result.code === 0, success, `${scenario}:\n${result.output}`);
    if (!success) {
      assert.match(result.output, /sitemap\.xml/);
      assert.match(result.output, /Sitemap requires|Sitemap dependency/);
    } else {
      const manifest = JSON.parse(
        await readFile(path.join(scratch, `.next-${scenario}/prerender-manifest.json`), "utf8"),
      );
      assert.ok(manifest.routes["/sitemap.xml"], "Sitemap must be prerendered by the actual build");
      const xml = await readFile(
        path.join(scratch, `.next-${scenario}/server/app/sitemap.xml.body`),
        "utf8",
      );
      assert.equal(
        (xml.match(/<loc>/g) ?? []).length,
        success && scenario === "ok" ? guides.length + 3 : 3,
      );
    }
    if (scenario !== "missing-config")
      assert.ok(viewRequests > 0, "Build must actually query the test API");
    console.log(
      `Default Turbopack build ${scenario}: ${success ? "passed with verified sitemap artifact" : "failed closed as required"}.`,
    );
  }

  // Reuse a SUCCESSFUL output/cache directory, then make the dependency fail.
  // Cached successful responses must not hide a missing view on the next build.
  await configure("zero");
  scenario = "view-missing";
  viewRequests = 0;
  const warmFailure = await run(["build"], childEnv);
  assert.notEqual(warmFailure.code, 0, "Warm build cache hid a missing view");
  assert.match(warmFailure.output, /Sitemap dependency/);
  assert.ok(viewRequests > 0);
  console.log("Default Turbopack warm-cache rebuild: failed closed as required.");
  await configure("ok");
  scenario = "ok";

  // Exercise the actual public guide and coverage readers against the same API.
  const client = createClient(apiUrl, "local-test-key", { auth: { persistSession: false } });
  const load = sourceLoader(root, {
    [path.join(root, "src/lib/supabase.ts")]: { supabase: client },
  });
  const readers = load("src/features/league/matchups.ts");
  const guide = await readers.getLeagueMatchup({
    championAId: "Ahri",
    championBId: "Annie",
    role: "mid",
  });
  assert.equal(guide.error, null);
  assert.equal(guide.matchup.overview, "A01 synthetic public guide");
  const coverage = await readers.getLeagueMatchupCoverage({ champions, role: "mid" });
  assert.equal(coverage.error, null);
  assert.equal(coverage.coverage.generatedCount, 2); // Ahri/Annie are the fixture's actual mid pool.

  // Use the production server, not a shallow component mock, for HTML/metadata/XML.
  const portProbe = createServer();
  await new Promise((resolve) => portProbe.listen(0, "127.0.0.1", resolve));
  const port = portProbe.address().port;
  await new Promise((resolve) => portProbe.close(resolve));
  web = spawn(process.execPath, [cli, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: scratch,
    env: childEnv,
    windowsHide: true,
    stdio: "ignore",
  });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/sitemap.xml`);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, "Production server did not start");
  for (const route of ["/", "/league/matchups/ahri-vs-annie?role=mid", "/sitemap.xml"]) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`);
    assert.equal(response.status, 200, route);
    const body = await response.text();
    if (route.includes("ahri-vs-annie")) {
      assert.ok(body.includes("Ahri vs Annie MID Matchup Guide"), "Guide SEO title missing");
      assert.match(body, /A01 synthetic public guide/);
      assert.match(body, /name="description"/);
    }
    if (route === "/sitemap.xml")
      assert.equal((body.match(/<loc>/g) ?? []).length, guides.length + 3);
  }
  console.log(
    "Production guide HTML, metadata, home, coverage readers and complete sitemap smoke tests passed.",
  );
} finally {
  if (web && web.exitCode === null) {
    web.kill();
    await new Promise((resolve) => web.once("exit", resolve));
  }
  await new Promise((resolve) => api.close(resolve));
  // This exact per-process scratch directory contains only copied test artifacts.
  assert.equal(path.dirname(scratch), path.join(root, "artifacts/generated-audits"));
  await rm(scratch, { recursive: true, force: true });
}
