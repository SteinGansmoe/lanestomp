import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const masteryModule = await import("../src/features/league/champion-mastery-requirements.ts");
const buildModule = await import("../src/features/league/counter-pick-builds.ts");

const {
  championMasteryRequirementCopy,
  getChampionMasteryRequirement,
  getChampionMasteryRequirementLevel,
} = masteryModule;
const { getCounterPickAlternativeBuildSections } = buildModule;

for (const level of ["low", "moderate", "high", "very_high"]) {
  const requirement = getChampionMasteryRequirement(levelFixtureChampion(level));

  assert.equal(requirement.level, level);
  assert.equal(requirement.label, championMasteryRequirementCopy[level].label);
  assert.deepEqual(requirement.description, championMasteryRequirementCopy[level].description);
}

assert.equal(getChampionMasteryRequirementLevel("Annie"), "low");
assert.equal(getChampionMasteryRequirementLevel("Zed"), "high");
assert.equal(getChampionMasteryRequirementLevel("Irelia"), "very_high");
assert.equal(
  getChampionMasteryRequirementLevel({
    id: "Kaisa",
    name: "Kai'Sa",
    riot_data_key: "KaiSa",
  }),
  "high",
);
assert.equal(getChampionMasteryRequirementLevel("Wukong"), "high");
assert.equal(getChampionMasteryRequirementLevel("Nunu & Willump"), "low");
assert.equal(getChampionMasteryRequirementLevel("UnknownChampion"), "moderate");

assert.equal(
  getChampionMasteryRequirement("Riven").description.join(" ").includes("First-timing"),
  true,
);
assert.equal(
  getChampionMasteryRequirement("Azir").description.join(" ").includes("not recommended"),
  true,
);

const buildGuide = {
  build: buildPath("build", [1001, 1002], "Core path"),
  "alternative-build": buildPath("alternative-build", [2001, 2002], "Alternative path"),
  "ad-heavy": buildPath("ad-heavy", [3001, 3002], "Armor path"),
  "ap-heavy": buildPath("ap-heavy", [4001, 4002], "Magic resist path"),
};
const sections = getCounterPickAlternativeBuildSections({
  behindBuildPath: { itemIds: [5001, 5002], note: "Play from behind" },
  commonBuildPath: { item_ids: [2001, 2002], note: "Duplicate alternative should not repeat" },
  guide: buildGuide,
});

assert.deepEqual(
  sections.map((section) => section.title),
  ["Against this matchup", "Against heavy AD", "Against heavy AP", "When behind"],
);
assert.equal(
  sections.some((section) => section.key === "ad-heavy"),
  true,
);
assert.equal(
  sections.some((section) => section.key === "ap-heavy"),
  true,
);
assert.equal(
  sections.some((section) => section.key === "alternative-build"),
  false,
);
assert.equal(sections.find((section) => section.key === "behind")?.note, "Play from behind");

const emptySections = getCounterPickAlternativeBuildSections({
  guide: {
    build: buildPath("build", [1001], "Core path"),
    "alternative-build": buildPath("alternative-build", [], ""),
    "ad-heavy": buildPath("ad-heavy", [], ""),
    "ap-heavy": buildPath("ap-heavy", [], ""),
  },
});
assert.equal(emptySections.length, 0);

const counterPickSelectorSource = readFileSync(
  new URL("../src/components/league/counter-pick-selector.tsx", import.meta.url),
  "utf8",
);
const counterPickBuildsSource = readFileSync(
  new URL("../src/features/league/counter-pick-builds.ts", import.meta.url),
  "utf8",
);

assert.equal(counterPickSelectorSource.includes('title: "Build vs Heavy AD"'), false);
assert.equal(counterPickSelectorSource.includes('title: "Build vs Heavy AP"'), false);
assert.equal(counterPickBuildsSource.includes("Against heavy AD"), true);
assert.equal(counterPickBuildsSource.includes("Against heavy AP"), true);
assert.equal(counterPickSelectorSource.includes('title: "Mastery Requirement"'), true);
assert.equal(
  counterPickSelectorSource.indexOf('title: "Mastery Requirement"') <
    counterPickSelectorSource.indexOf("Why ${counterName}"),
  true,
);
assert.equal(counterPickSelectorSource.includes("aria-expanded={isOpen}"), true);
assert.equal(counterPickSelectorSource.includes("Build ${counterName}"), true);
assert.equal(counterPickSelectorSource.includes("How ${counterName} Should Play The Lane"), true);
assert.equal(counterPickSelectorSource.includes("Open Full ${counterName}"), true);

console.log("Champion mastery requirement handling passed.");

function levelFixtureChampion(level) {
  return {
    high: "Zed",
    low: "Annie",
    moderate: "Ahri",
    very_high: "Irelia",
  }[level];
}

function buildPath(key, itemIds, note) {
  return {
    itemIds,
    key,
    note,
  };
}
