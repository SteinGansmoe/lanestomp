import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pageSource = readFileSync("src/app/league/matchups/page.tsx", "utf8");
const selectorSource = readFileSync("src/components/league/matchup-selector.tsx", "utf8");
const changePanelSource = readFileSync("src/components/league/change-matchup-panel.tsx", "utf8");

assert.match(
  pageSource,
  /<HextechFrame/,
  "Matchup Guides entry page should use the shared Hextech frame hero.",
);
assert.match(pageSource, /MatchupGuidesHero/, "Matchup Guides page should render the new hero.");
assert.match(pageSource, /Matchup guides/i, "Hero should keep the approved eyebrow.");
assert.match(pageSource, /Find your[\s\S]*lane plan/i, "Hero should use the approved headline.");
assert.match(
  pageSource,
  /Search champions directly,\s+filter by role,\s+and open the matchup guide for the lane you\s+want to study\./,
  "Hero should use the approved support copy.",
);
assert.match(
  pageSource,
  /getChampionSplashUrl/,
  "Hero should use champion splash artwork instead of a flat card background.",
);
assert.doesNotMatch(
  pageSource,
  /getLeagueMatchupCoverageSummary|matchupCoverage=\{coverage\}/,
  "Matchup Guides entry page should not fetch or pass the old coverage pill data.",
);
assert.doesNotMatch(
  pageSource,
  /href="\/champions"|BackButton|Back to LaneStomp/,
  "Old utility link row should be removed from the redesigned entry page.",
);

assert.match(selectorSource, /Matchup setup/i, "Selector should keep the setup heading.");
assert.match(selectorSource, /RoleIconSelector/, "Selector should keep role filtering controls.");
assert.match(
  selectorSource,
  /includeOffMeta/,
  "Selector should preserve the off-meta toggle behavior.",
);
assert.match(
  selectorSource,
  /ChangeMatchupPanel/,
  "Selector should preserve inline matchup editing after a champion is selected.",
);
assert.match(
  selectorSource,
  /handleChampionPick/,
  "Selector should preserve champion selection flow.",
);
assert.match(
  selectorSource,
  /\[scrollbar-color:rgba\(34,211,238,0\.35\)_rgba\(7,19,33,0\.8\)\]/,
  "Champion grid should keep the styled internal scrollbar.",
);
assert.doesNotMatch(
  selectorSource,
  /MatchupCoverageIndicator|matchups available|Coverage/,
  "Selector should not render the old matchup coverage pill.",
);
assert.doesNotMatch(
  selectorSource,
  /rounded-(?:md|lg|xl|2xl)| rounded /,
  "Redesigned selector should avoid rounded card/control styling.",
);
assert.match(
  selectorSource,
  /text-\[#C9AA5A\]/,
  "Role controls should use gold-toned icon styling.",
);
assert.match(
  selectorSource,
  /border-cyan-300\/70 bg-cyan-400\/\[0\.12\]/,
  "Active role controls should use a cyan border treatment.",
);

assert.match(
  changePanelSource,
  /Generate matchup/,
  "Inline change panel should still expose the guide action.",
);
assert.match(
  changePanelSource,
  /getLeagueMatchupHref/,
  "Inline change panel should preserve routing to matchup guide pages.",
);
assert.doesNotMatch(
  changePanelSource,
  /rounded-(?:md|lg|xl|2xl)| rounded /,
  "Inline change panel should follow the sharper selector styling.",
);

console.log("Matchup Guides redesign regression tests passed.");
