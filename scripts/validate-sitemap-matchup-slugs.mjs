import assert from "node:assert/strict";
import {
  getChampionSlug,
  getLeagueMatchupUrl,
} from "../src/features/league/matchup-route-core.ts";

const baseUrl = "https://lanestomp.com";

const champions = [
  { id: "Aatrox", name: "Aatrox" },
  { id: "Kaisa", name: "Kai'Sa" },
  { id: "Chogath", name: "Cho'Gath" },
  { id: "Khazix", name: "Kha'Zix" },
  { id: "RekSai", name: "Rek'Sai" },
  { id: "Velkoz", name: "Vel'Koz" },
  { id: "KogMaw", name: "Kog'Maw" },
  { id: "Belveth", name: "Bel'Veth" },
  { id: "DrMundo", name: "Dr. Mundo" },
  { id: "Nunu", name: "Nunu & Willump" },
  { id: "JarvanIV", name: "Jarvan IV" },
  { id: "LeeSin", name: "Lee Sin" },
  { id: "Jinx", name: "Jinx" },
];

const expectedSlugs = new Map([
  ["Aatrox", "aatrox"],
  ["Kai'Sa", "kai-sa"],
  ["Cho'Gath", "cho-gath"],
  ["Kha'Zix", "kha-zix"],
  ["Rek'Sai", "rek-sai"],
  ["Vel'Koz", "vel-koz"],
  ["Kog'Maw", "kog-maw"],
  ["Bel'Veth", "bel-veth"],
  ["Dr. Mundo", "dr-mundo"],
  ["Nunu & Willump", "nunu-willump"],
  ["Jarvan IV", "jarvan-iv"],
  ["Lee Sin", "lee-sin"],
  ["Jinx", "jinx"],
]);

for (const champion of champions) {
  assert.equal(
    getChampionSlug(champion),
    expectedSlugs.get(champion.name),
    `${champion.name} should use the canonical public slug`,
  );
}

function championByName(name) {
  const champion = champions.find((candidate) => candidate.name === name);
  assert.ok(champion, `Missing test champion ${name}`);
  return champion;
}

const urlCases = [
  {
    championA: championByName("Kai'Sa"),
    championB: championByName("Jinx"),
    role: "adc",
    expectedUrl: `${baseUrl}/league/matchups/kai-sa-vs-jinx?role=adc`,
  },
  {
    championA: championByName("Cho'Gath"),
    championB: championByName("Aatrox"),
    role: "top",
    expectedUrl: `${baseUrl}/league/matchups/cho-gath-vs-aatrox?role=top`,
  },
  {
    championA: championByName("Kha'Zix"),
    championB: championByName("Lee Sin"),
    role: "jungle",
    expectedUrl: `${baseUrl}/league/matchups/kha-zix-vs-lee-sin?role=jungle`,
  },
];

const generatedUrls = [];

for (const testCase of urlCases) {
  const url = getLeagueMatchupUrl(baseUrl, testCase);
  generatedUrls.push(url);
  assert.equal(url, testCase.expectedUrl);
}

const oldBadFragments = [
  "/league/matchups/kaisa-vs-jinx",
  "/league/matchups/chogath-vs-aatrox",
  "/league/matchups/khazix-vs-lee-sin",
];

for (const fragment of oldBadFragments) {
  assert.ok(
    generatedUrls.every((url) => !url.includes(fragment)),
    `Sitemap matchup URL should not contain legacy fragment ${fragment}`,
  );
}

for (const championA of champions) {
  const championB = champions.find(
    (candidate) => candidate.name !== championA.name,
  );
  assert.ok(championB, `Missing matchup partner for ${championA.name}`);

  const url = getLeagueMatchupUrl(baseUrl, {
    championA,
    championB,
    role: "mid",
  });
  const route = url.split("/league/matchups/")[1].split("?")[0];
  const [sitemapSlug] = route.split("-vs-");

  assert.equal(
    sitemapSlug,
    getChampionSlug(championA),
    `${championA.name} sitemap slug should match canonical public slug`,
  );
}

console.log(
  `Validated ${champions.length} champion slugs and ${generatedUrls.length} matchup URLs.`,
);
