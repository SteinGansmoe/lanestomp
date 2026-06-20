import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pageSource = readFileSync("src/app/league/matchups/[matchup]/page.tsx", "utf8");

const heroSource = pageSource.slice(
  pageSource.indexOf("function MatchupHero"),
  pageSource.indexOf("function MatchupMetaPill"),
);

assert.match(
  heroSource,
  /<HextechFrame className="relative isolate[\s\S]*overflow-hidden bg-\[#030914\]/,
  "Matchup hero should be isolated, clipped, and backed by an opaque dark surface.",
);
assert.match(
  heroSource,
  /getChampionSplashUrl\(championA\)[\s\S]*getChampionSplashUrl\(championB\)/,
  "Hero should keep one controlled splash layer for each matchup champion.",
);
assert.match(
  heroSource,
  /maskImage:\s*"linear-gradient\(to right,[\s\S]*maskImage:\s*"linear-gradient\(to left,/,
  "Hero champion artwork should use directional masks to blend into the center.",
);
assert.match(
  heroSource,
  /z-\[2\][\s\S]*z-\[2\][\s\S]*z-10[\s\S]*z-40/,
  "Hero should layer artwork below overlays and content.",
);
assert.match(
  heroSource,
  /bg-\[radial-gradient\(circle_at_50%_34%,rgba\(34,211,238,0\.1\)/,
  "Hero should include a controlled cyan center blend behind the VS block.",
);
assert.doesNotMatch(
  heroSource,
  /124,58,237|139,92,246|violet|purple/i,
  "Hero should not use purple fog or violet VS styling.",
);

assert.doesNotMatch(
  pageSource,
  /function MatchupPageTheme|function ThemedSplash|<MatchupPageTheme/,
  "Detail page should not render page-level champion splash artwork behind the hero.",
);
assert.doesNotMatch(
  pageSource,
  /backgroundImage:\s*`url\("\$\{getChampionSplashUrl\(champion\)\}"\)`/,
  "Champion splash artwork should not be injected into the outer page background.",
);

console.log("Matchup Guide artwork layering regression tests passed.");
