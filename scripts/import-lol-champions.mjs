import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

import {
  defaultDataDragonLocale,
  syncLeagueChampionRegistry,
} from "./lib/league-champion-registry.mjs";

loadEnvFile(".env.local");

const args = process.argv.slice(2);

if (args.includes("--help")) {
  printHelp();
  process.exit(0);
}

const isDryRun = args.includes("--dry-run") || process.env.npm_config_dry_run === "true";
const locale =
  getArgValue("--locale") ?? process.env.RIOT_DDRAGON_LOCALE ?? defaultDataDragonLocale;
const requestedVersion = getArgValue("--version") ?? process.env.RIOT_DDRAGON_VERSION ?? null;
const supabase = isDryRun ? null : getSupabaseClient();
const result = await syncLeagueChampionRegistry({
  dryRun: isDryRun,
  locale,
  supabase,
  version: requestedVersion,
});

printSyncSummary(result, {
  dryRun: isDryRun,
  locale,
});

if (!result.ok) {
  process.exit(1);
}

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase import credentials. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL, plus SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

function printSyncSummary(result, { dryRun, locale }) {
  console.log(
    [
      dryRun
        ? "League champion registry dry run complete"
        : "League champion registry sync complete",
      `status=${result.status}`,
      `locale=${locale}`,
      `sourceVersion=${result.sourceVersion}`,
      `championsReceived=${result.championsReceived}`,
      `inserted=${result.championsInserted}`,
      `updated=${result.championsUpdated}`,
      `unchanged=${result.championsUnchanged}`,
      `deactivated=${result.championsDeactivated}`,
      `failed=${result.failed}`,
    ].join(" | "),
  );

  if (result.failures.length > 0) {
    result.failures.forEach((failure) => console.error(`- ${failure}`));
  }
}

function getArgValue(name) {
  const index = args.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = args[index + 1];

  return value && !value.startsWith("--") ? value : null;
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
  console.log(`League Champion Registry Sync

Fetches the full current champion registry from Riot Data Dragon and upserts
source-managed champion metadata into league_champions.

Usage:
  npm run sync:league-champions
  npm run sync:league-champions -- --dry-run
  npm run sync:league-champions -- --version 15.12.1
  npm run sync:league-champions -- --locale en_US

Environment:
  RIOT_DDRAGON_LOCALE       Defaults to en_US
  RIOT_DDRAGON_VERSION      Optional explicit Data Dragon version
  SUPABASE_SERVICE_ROLE_KEY Required unless --dry-run
`);
}
