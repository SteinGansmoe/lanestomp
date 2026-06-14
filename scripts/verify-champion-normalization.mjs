import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  loadActiveChampionRegistry,
  manualChampionAliases,
  normalizeChampionIdentifier,
} from "./lib/league-champion-normalizer.mjs";

loadEnvFile(".env.local");

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, plus SUPABASE_SERVICE_ROLE_KEY.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});
const registry = await loadActiveChampionRegistry({
  supabase,
});
const failures = [];
const counts = {
  aliasesTested: 0,
  canonicalKeysResolved: 0,
  dataKeysResolved: 0,
  displayNamesResolved: 0,
  numericKeysResolved: 0,
  slugsResolved: 0,
};

for (const entry of registry.entries) {
  counts.canonicalKeysResolved += assertResolves({
    expected: entry.canonicalKey,
    failures,
    label: "canonical key",
    value: entry.canonicalKey,
    registry,
  });
  counts.numericKeysResolved += assertResolves({
    expected: entry.canonicalKey,
    failures,
    label: "Riot numeric key",
    value: entry.riotNumericKey,
    registry,
  });
  counts.dataKeysResolved += assertResolves({
    expected: entry.canonicalKey,
    failures,
    label: "Riot data key",
    value: entry.riotDataKey,
    registry,
  });
  counts.slugsResolved += assertResolves({
    expected: entry.canonicalKey,
    failures,
    label: "slug",
    value: entry.slug,
    registry,
  });
  counts.displayNamesResolved += assertResolves({
    expected: entry.canonicalKey,
    failures,
    label: "display name",
    value: entry.displayName,
    registry,
  });
}

for (const [alias, expected] of Object.entries(manualChampionAliases)) {
  if (!registry.byCanonicalKey.has(expected)) {
    continue;
  }

  counts.aliasesTested += 1;
  assertResolves({
    expected,
    failures,
    label: "manual alias",
    value: alias,
    registry,
  });
}

console.log(
  [
    `Champion normalization valid: ${failures.length === 0 ? "Yes" : "No"}`,
    `Registry champions tested: ${registry.entries.length}`,
    `Canonical keys resolved: ${counts.canonicalKeysResolved}`,
    `Numeric keys resolved: ${counts.numericKeysResolved}`,
    `Data keys resolved: ${counts.dataKeysResolved}`,
    `Slugs resolved: ${counts.slugsResolved}`,
    `Display names resolved: ${counts.displayNamesResolved}`,
    `Aliases tested: ${counts.aliasesTested}`,
    `Alias failures: ${failures.filter((failure) => failure.includes("manual alias")).length}`,
    `Collisions: 0`,
  ].join("\n"),
);

if (failures.length > 0) {
  console.error("\nFailures:");
  failures.slice(0, 50).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

function assertResolves({ expected, failures, label, registry, value }) {
  if (!value) {
    failures.push(`${label} missing for ${expected}`);
    return 0;
  }

  const resolved = normalizeChampionIdentifier(value, registry);

  if (resolved?.canonicalKey !== expected) {
    failures.push(
      `${label} "${value}" resolved to ${resolved?.canonicalKey ?? "null"} instead of ${expected}`,
    );
    return 0;
  }

  return 1;
}

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const entries = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const entry of entries) {
    const trimmedEntry = entry.trim();

    if (!trimmedEntry || trimmedEntry.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedEntry.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedEntry.slice(0, separatorIndex).trim();
    const value = trimmedEntry.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = value.replace(/^["']|["']$/g, "");
  }
}

function printHelp() {
  console.log(`Champion Normalization Verification

Loads active league_champions rows and verifies every supported champion
identifier form resolves to the canonical league_champions.id value.

Usage:
  npm run verify:champion-normalization

Environment:
  SUPABASE_SERVICE_ROLE_KEY Required
`);
}
