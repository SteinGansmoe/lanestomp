import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const homepage = readFileSync("src/app/page.tsx", "utf8");
const startForm = readFileSync("src/components/league/counter-pick-start-form.tsx", "utf8");
const countersPage = readFileSync("src/app/league/counters/page.tsx", "utf8");

assert.match(
  homepage,
  /Counter Pick available now/,
  "Homepage should present Counter Pick as available now.",
);
assert.match(
  homepage,
  /<CounterPickStartForm champions=\{champions\} \/>/,
  "Homepage hero should render the Counter Pick start form.",
);
assert.doesNotMatch(
  homepage,
  /Counter Pick Tool[\s\S]*Coming Soon/,
  "Homepage should not show old Counter Pick coming-soon messaging.",
);
assert.match(homepage, /href="\/league\/matchups"/, "Homepage should link to Matchup Guides.");
assert.match(homepage, /Available Now/, "Live tools should be labelled Available Now.");
assert.match(
  startForm,
  /router\.push\(`\/league\/counters\?champion=\$\{encodeURIComponent\(selectedChampion\.id\)\}&role=\$\{selectedRole\}`\)/,
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

console.log("Homepage Counter Pick entry regression tests passed.");
