import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const routingModule = await import("../src/features/league/counter-pick-routes.ts");

const {
  buildCounterPickUrl,
  counterPickBasePath,
  normalizeCounterPickChampionLookupKey,
  resolveCounterPickChampion,
} = routingModule;

const champions = [
  createChampion({ id: "Kaisa", name: "Kai'Sa", slug: "kai-sa" }),
  createChampion({ id: "Khazix", name: "Kha'Zix", slug: "kha-zix" }),
  createChampion({ id: "Chogath", name: "Cho'Gath", slug: "cho-gath" }),
  createChampion({ id: "Twitch", name: "Twitch", slug: "twitch" }),
  createChampion({ id: "Jinx", name: "Jinx", slug: "jinx" }),
];

testChampionNormalization();
testCounterPickUrlBuilder();
testCounterPickSourceGuards();

console.log("Counter Pick routing regression tests passed.");

function testChampionNormalization() {
  assert.equal(counterPickBasePath, "/league/counters");
  assert.equal(normalizeCounterPickChampionLookupKey("Kai'Sa"), "kaisa");
  assert.equal(resolveCounterPickChampion(champions, "kaisa")?.id, "Kaisa");
  assert.equal(resolveCounterPickChampion(champions, "Kai'Sa")?.id, "Kaisa");
  assert.equal(resolveCounterPickChampion(champions, "kha-zix")?.id, "Khazix");
  assert.equal(resolveCounterPickChampion(champions, "ChoGath")?.id, "Chogath");
  assert.equal(resolveCounterPickChampion(champions, "Unknown"), null);
}

function testCounterPickUrlBuilder() {
  for (const role of ["top", "jungle", "mid", "adc", "support"]) {
    assert.equal(
      buildCounterPickUrl({ champion: champions[0], role }),
      `/league/counters?champion=Kaisa&role=${role}`,
    );
  }

  assert.equal(
    buildCounterPickUrl({ champion: "Kai'Sa", champions, role: "adc" }),
    "/league/counters?champion=Kaisa&role=adc",
  );
  assert.equal(
    buildCounterPickUrl({ champion: "Kha'Zix", champions, role: "jungle" }),
    "/league/counters?champion=Khazix&role=jungle",
  );
  assert.equal(buildCounterPickUrl({ champion: champions[0], role: "invalid" }), null);
  assert.equal(buildCounterPickUrl({ champion: "Unknown", champions, role: "mid" }), null);
}

function testCounterPickSourceGuards() {
  const selectorSource = readFileSync(
    "src/components/league/counter-pick-selector.tsx",
    "utf8",
  );
  const startFormSource = readFileSync(
    "src/components/league/counter-pick-start-form.tsx",
    "utf8",
  );

  assert.match(
    selectorSource,
    /resolveCounterPickChampion\(champions, initialChampionId\)/,
    "Counter Pick result champion should be derived from URL props.",
  );
  assert.doesNotMatch(
    selectorSource,
    /useState<string \| null>\(\s*\(\) => findCounterPickInitialChampion/,
    "Counter Pick result champion should not be copied into committed local state.",
  );
  assert.match(
    selectorSource,
    /buildCounterPickUrl\(\{ champion, role: selectedRole \}\)/,
    "Change Champion should navigate through the shared URL builder.",
  );
  assert.match(
    selectorSource,
    /buildCounterPickUrl\(\{ champion: selectedChampion, role \}\)/,
    "Change Role should navigate through the shared URL builder.",
  );
  assert.match(
    selectorSource,
    /isCounterPickDataLoading/,
    "Result rendering should guard against stale route data.",
  );
  assert.match(
    startFormSource,
    /buildCounterPickUrl\(\{ champion: selectedChampion, role: selectedRole \}\)/,
    "Homepage Counter Pick entry should use the shared URL builder.",
  );
}

function createChampion({ id, name, slug }) {
  return {
    id,
    image_filename: null,
    image_url: "",
    is_active: true,
    name,
    riot_data_key: id,
    riot_key: id,
    slug,
    tags: [],
    title: "Champion",
    version: "test",
  };
}
