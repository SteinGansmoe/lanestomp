import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const homepage = readFileSync("src/app/page.tsx", "utf8");
const pageShell = readFileSync("src/components/lane-stomp-page.tsx", "utf8");
const startForm = readFileSync("src/components/league/counter-pick-start-form.tsx", "utf8");
const countersPage = readFileSync("src/app/league/counters/page.tsx", "utf8");
const changedHomepageFiles = `${homepage}\n${pageShell}\n${startForm}`;

assert.match(homepage, /Counter Pick/, "Homepage should include the Counter Pick eyebrow.");
assert.match(homepage, /Find the right/, "Homepage should render the approved hero headline.");
assert.match(homepage, /counter before/, "Homepage should keep the approved headline line break.");
assert.match(homepage, /champion select/, "Homepage should keep the approved headline ending.");
assert.match(
  homepage,
  /Search any champion to get smart counter picks,\s+matchup insights,\s+and practical prep\s+before you lock in\./,
  "Homepage should use the approved hero supporting copy.",
);
assert.match(
  homepage,
  /<CounterPickStartForm champions=\{champions\} popularChampions=\{popularChampions\} \/>/,
  "Homepage hero should render the integrated Counter Pick search.",
);
assert.match(
  homepage,
  /<LaneStompPageBackground \/>/,
  "Homepage should use the shared layered atmosphere background component.",
);
assert.match(
  pageShell,
  /fractalNoise/,
  "Shared page background should include a lightweight grain layer.",
);
assert.match(
  pageShell,
  /backgroundSize: "88px 88px, 88px 88px, 176px 176px"/,
  "Shared page background should include a faint technical pattern layer.",
);
assert.doesNotMatch(
  homepage,
  /Counter Pick Tool[\s\S]*Coming Soon/,
  "Homepage should not show old Counter Pick coming-soon messaging.",
);
assert.doesNotMatch(
  homepage,
  /ToolStatusSection|ValueSection|ProgressSection|HomeTopNavigation|HomepageBackgroundEffects/,
  "Homepage should remove the old issue 258 card-heavy hierarchy and one-off shell copies.",
);
assert.doesNotMatch(
  changedHomepageFiles,
  /rounded-(?:xl|2xl)/,
  "Redesigned homepage files should not contain rounded-xl or rounded-2xl.",
);
assert.doesNotMatch(
  changedHomepageFiles,
  /80%\+ win rate|60[–-]80% win rate/,
  "Confidence guide should not use extreme win-rate tiers.",
);

assert.match(homepage, /Confidence Guide/, "Homepage should include the Confidence Guide strip.");
assert.match(homepage, /1000\+ stored games/, "Very high confidence threshold should be 1000+.");
assert.match(homepage, /500–999 games/, "High confidence threshold should be 500–999.");
assert.match(homepage, /200–499 games/, "Medium confidence threshold should be 200–499.");
assert.match(homepage, /50–199 games/, "Low confidence threshold should be 50–199.");
assert.match(
  homepage,
  /Under 50 \/ preliminary/,
  "Very low confidence threshold should be under 50 / preliminary.",
);

assert.match(homepage, /Matchup Guides/, "Homepage should include Matchup Guide feature links.");
assert.match(homepage, /Understand the matchup/, "Homepage should include matchup feature one.");
assert.match(homepage, /Prepare your counter pick/, "Homepage should include matchup feature two.");
assert.match(homepage, /Play with a plan/, "Homepage should include matchup feature three.");
assert.match(homepage, /LaneStomp in Numbers/, "Homepage should include the statistics strip.");

assert.match(
  startForm,
  /popularChampions\.slice\(0, 9\)/,
  "Counter Pick hero search should render exactly nine popular champion shortcuts.",
);
assert.match(
  startForm,
  /Most popular picks/,
  "Champion quick-access row should use the approved popular picks label.",
);
assert.doesNotMatch(
  startForm,
  /MoreHorizontal/,
  "Champion quick-access row should not include an ALL control.",
);
assert.match(
  startForm,
  /Choose a champion from the results to continue\./,
  "Counter Pick hero search should explain the empty CTA state inline.",
);
assert.match(
  startForm,
  /document\.addEventListener\("mousedown", closeResultsOnOutsideClick\)/,
  "Counter Pick hero search should close when clicking outside.",
);
assert.match(
  startForm,
  /event\.key === "Escape"/,
  "Counter Pick hero search should close on Escape.",
);
assert.match(
  startForm,
  /router\.push\(\s*`\/league\/counters\?champion=\$\{encodeURIComponent\(selectedChampion\.id\)\}&role=\$\{selectedRole\}`/,
  "Counter Pick hero search should navigate with selected champion and role.",
);
assert.match(
  startForm,
  /onKeyDown=\{handleKeyDown\}/,
  "Counter Pick hero search should expose keyboard navigation.",
);
assert.match(
  countersPage,
  /initialChampionId=\{initialChampionId\}/,
  "Counter Pick page should consume champion query state.",
);
assert.match(
  countersPage,
  /initialRole=\{initialRole\}/,
  "Counter Pick page should consume role query state.",
);

const accountMenu = readFileSync("src/components/authenticated-account-menu.tsx", "utf8");

assert.match(
  accountMenu,
  /createPortal/,
  "Topbar account dropdown should render outside normal navbar layout flow.",
);
assert.match(
  accountMenu,
  /event\.key !== "Escape"/,
  "Account dropdown should handle Escape close behavior.",
);
assert.match(
  accountMenu,
  /handlePointerDown/,
  "Account dropdown should close on outside click.",
);
assert.match(
  accountMenu,
  /showSignedOutActions/,
  "Account menu should support a mobile authenticated-only trigger.",
);

console.log("Homepage Counter Pick entry regression tests passed.");
