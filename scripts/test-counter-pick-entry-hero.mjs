import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const selectorSource = readFileSync("src/components/league/counter-pick-selector.tsx", "utf8");
const frameSource = readFileSync("src/components/league/hextech-frame.tsx", "utf8");
const selectionSource = readFileSync(
  "src/features/league/counter-pick-champion-selection.ts",
  "utf8",
);
const entryHeroSource = selectorSource.slice(
  selectorSource.indexOf("function CounterPickEntryHero"),
  selectorSource.indexOf("function ChampionSearchCombobox"),
);
const championHeroSource = selectorSource.slice(
  selectorSource.indexOf("function ChampionHero"),
  selectorSource.indexOf("function CounterPickConfidenceSummary"),
);

assert.match(
  selectorSource,
  /const \[selectedRole, setSelectedRole\] = useState<LeagueRole \| null>\(null\)/,
  "Counter Pick entry hero should not silently default to a role.",
);
assert.match(
  selectorSource,
  /function handleRoleSelect\(role: LeagueRole\)[\s\S]*isCounterPickChampionSupportedInRole\(selectedChampion, role\)[\s\S]*setSelectedChampion\(null\)/,
  "Changing to an unsupported role should clear the selected champion.",
);
assert.match(
  selectorSource,
  /<CounterPickRoleControls[\s\S]*selectedRole=\{selectedRole\}[\s\S]*<ChampionSearchCombobox/,
  "Entry hero should present role selection before champion search.",
);
assert.match(
  selectorSource,
  /selectedRole=\{selectedRole\}/,
  "Entry champion search should receive the selected role.",
);
assert.match(
  selectorSource,
  /disabled=\{!selectedRole\}/,
  "Entry champion search should stay disabled until a role is selected.",
);
assert.match(
  selectorSource,
  /placeholder=\{selectedRole \? "Search champion\.\.\." : "Select your role first\.\.\."\}/,
  "Entry champion search should explain the required role first step.",
);
assert.match(
  selectorSource,
  /getCounterPickChampionOptionsForRole\(\{[\s\S]*role: selectedRole/,
  "Entry champion search should use the role-aware champion option helper.",
);
assert.match(
  selectorSource,
  /Exact off-role/,
  "Exact off-role champion fallbacks should be clearly labeled.",
);
assert.match(
  selectorSource,
  /disabled=\{!canSubmit\}/,
  "Entry CTA should remain disabled until both role and champion are selected.",
);
assert.match(
  selectorSource,
  /counterPickPrimaryCtaClassName/,
  "Counter Pick entry CTA should use the shared muted primary CTA style.",
);
assert.doesNotMatch(
  entryHeroSource,
  /hover:bg-cyan-300 hover:text-\[#04111d\]/,
  "Counter Pick entry CTA should not use the old bright cyan hover fill.",
);
assert.match(
  selectorSource,
  /<HextechFrame/,
  "Entry hero should use the shared custom Hextech frame component.",
);
assert.match(
  frameSource,
  /corner|top-0 size-4|bottom-0 left-1\/2|top-1\/2 z-30 hidden h-48/,
  "Hextech frame should include corner accents, center notches, and side ticks.",
);
assert.doesNotMatch(
  entryHeroSource,
  /rounded-(?:xl|2xl)/,
  "Entry hero should avoid rounded card styling.",
);
assert.match(
  championHeroSource,
  /<HextechFrame/,
  "Selected champion result hero should use the shared Hextech frame component.",
);
assert.match(
  championHeroSource,
  /z-40/,
  "Selected champion result hero content should sit above Hextech frame accents.",
);
assert.match(
  championHeroSource,
  /z-\[70\][\s\S]*BackButton/,
  "Selected champion result hero back button should sit above the full-height content layer.",
);

assert.match(
  selectionSource,
  /if \(!role\)[\s\S]*return \[\]/,
  "Role-aware champion options should return no results before a role is chosen.",
);
assert.match(
  selectionSource,
  /champions\.filter\(\(champion\) => isChampionInRole\(champion, role\)\)/,
  "Role-aware champion options should primarily filter by selected role.",
);
assert.match(
  selectionSource,
  /exactOffRoleMatches/,
  "Role-aware champion options should keep an exact off-role search fallback.",
);
assert.match(
  selectionSource,
  /seenChampionIds/,
  "Role-aware champion options should dedupe exact fallback results.",
);

console.log("Counter Pick entry hero regression tests passed.");
