import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const sectionKeys = [
  "overview",
  "early_game",
  "trading_pattern",
  "power_spikes",
  "danger_windows",
  "win_conditions",
];

const fallbackPatterns = [
  ["old overview review placeholder", /\breview the non-obvious\b/i],
  ["old broad notes placeholder", /\bkeep broad notes out of this section\b/i],
  ["old list-only placeholder", /\blist only real level\b/i],
  ["old verified spike placeholder", /\bverified (?:jungle fight|spike|cooldown|ability)/i],
  ["old re-check power spike placeholder", /\bre-?check river fights after first recall\b/i],
  [
    "old generic cross-map placeholder",
    /\buse cross-map trades when direct river fights are not favorable\b/i,
  ],
  ["current jungle overview placeholder", /\bneeds a controlled jungle plan that weighs invade\b/i],
  ["current jungle pathing placeholder", /\bplay early pathing around lane priority\b/i],
  [
    "current jungle tracking placeholder",
    /\bsetup by tracking camps and trading sides when direct fights are bad\b/i,
  ],
  [
    "current jungle scuttle placeholder",
    /\bfirst clear should set up river control only when the first scuttle is actually contestable\b/i,
  ],
  ["current jungle invade placeholder", /\binvade .+ only when nearby lanes can move\b/i],
  ["current jungle tempo placeholder", /\btempo leads matter most when they become void grubs\b/i],
  [
    "current jungle danger placeholder",
    /\bstrongest invade, river, or objective timing makes blind fog checks dangerous\b/i,
  ],
  [
    "current jungle caution placeholder",
    /\bmissing lane priority around scuttle, dragon, void grubs, or herald turns river contests\b/i,
  ],
  [
    "current jungle early clear placeholder",
    /\bfirst clear should path toward lanes that can move before the enemy jungler's level 3 threat\b/i,
  ],
  [
    "current jungle first river placeholder",
    /\bpath .+ toward the first river move only when nearby lanes can collapse first\b/i,
  ],
  [
    "current jungle cross-map placeholder",
    /\bcross-map camps or gank opposite side instead of flipping a bad scuttle fight\b/i,
  ],
  [
    "current jungle level 6 placeholder",
    /\blevel 6 usually adds enough threat to make isolated river\b/i,
  ],
  [
    "current jungle first item placeholder",
    /\bfirst completed item improves clear tempo and durability\b/i,
  ],
  [
    "current jungle two-item placeholder",
    /\btwo completed items make .+ more reliable in front-to-back objective fights\b/i,
  ],
  [
    "current jungle objective placeholder",
    /\bjungle tempo into objective access and repeatable gank pressure\b/i,
  ],
  [
    "current jungle denial placeholder",
    /\bthe clears, objective setups, or scaling windows that let them play on their terms\b/i,
  ],
  [
    "current dragon fight placeholder",
    /\bif you have a numbers disadvantage, trade the tempo window into top-side camps\b/i,
  ],
  [
    "current lane overview placeholder",
    /\blane plan depends on whether pressure, free-farm denial\b/i,
  ],
  [
    "current lane danger placeholder",
    /\bjungle fog and missing summoners make extended lane pressure much riskier\b/i,
  ],
  [
    "current lane power spike placeholder",
    /\blevel 6 or first completed item can turn short trades into lethal\b/i,
  ],
  [
    "current lane two-item placeholder",
    /\btwo completed items make .+ lane pressure matter more in objective fights\b/i,
  ],
];

loadLocalEnv(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

const { data: matchups, error: matchupsError } = await supabase
  .from("league_matchups")
  .select(
    "id, role, champion_a_id, champion_b_id, overview, early_game, trading_pattern, power_spikes, danger_windows, win_conditions, updated_at, admin_notes",
  );

if (matchupsError) {
  console.error(`Could not fetch league_matchups: ${matchupsError.message}`);
  process.exit(1);
}

const championIds = Array.from(
  new Set((matchups ?? []).flatMap((matchup) => [matchup.champion_a_id, matchup.champion_b_id])),
);
const { data: champions, error: championsError } = await supabase
  .from("league_champions")
  .select("id, name")
  .in("id", championIds);

if (championsError) {
  console.error(`Could not fetch league_champions: ${championsError.message}`);
  process.exit(1);
}

const championNamesById = new Map(
  (champions ?? []).map((champion) => [champion.id, champion.name]),
);
const contaminated = (matchups ?? [])
  .map((matchup) => {
    const matches = scanMatchup(matchup);

    if (matches.length === 0) {
      return null;
    }

    return {
      admin_notes: matchup.admin_notes ?? "",
      affected_sections: Array.from(new Set(matches.map((match) => match.section))),
      champion_a: championNamesById.get(matchup.champion_a_id) ?? matchup.champion_a_id,
      champion_b: championNamesById.get(matchup.champion_b_id) ?? matchup.champion_b_id,
      fallback_phrase_count: matches.length,
      id: matchup.id,
      matches,
      role: matchup.role,
      updated_at: matchup.updated_at,
    };
  })
  .filter(Boolean);

console.log(
  JSON.stringify(
    {
      contaminated_matchup_count: contaminated.length,
      scanned_matchup_count: matchups?.length ?? 0,
      rows: contaminated,
    },
    null,
    2,
  ),
);

function scanMatchup(matchup) {
  const matches = [];

  for (const section of sectionKeys) {
    const content = matchup[section];

    if (!content) {
      continue;
    }

    for (const [label, pattern] of fallbackPatterns) {
      if (!pattern.test(content)) {
        continue;
      }

      matches.push({
        label,
        sample: getSample(content, pattern),
        section,
      });
    }
  }

  return matches;
}

function getSample(content, pattern) {
  return (
    content
      .split("\n")
      .find((line) => pattern.test(line))
      ?.trim()
      .slice(0, 180) ?? ""
  );
}

function loadLocalEnv(fileName) {
  const envPath = resolve(process.cwd(), fileName);

  if (!existsSync(envPath)) {
    return;
  }

  const envFile = readFileSync(envPath, "utf8");

  for (const rawLine of envFile.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    process.env[key] ??= value.replace(/^["']|["']$/g, "");
  }
}
