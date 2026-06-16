import assert from "node:assert/strict";

const optionsModule = await import("../src/features/league/public-counter-pick-options.ts");
const statisticsModule = await import("../src/features/league/counter-pick-statistics.ts");
const confidenceModule = await import("../src/features/league/counter-pick-confidence.ts");

const {
  getPublicCounterPickChampionSearchText,
  matchesPublicCounterPickChampionSearch,
} = optionsModule;
const {
  compareCounterPickStatistics,
  getPublicCounterResultsForSelectedChampionStats,
  isCounterIntoSelectedChampion,
  isCounterPickStatisticsPubliclyRanked,
  isCounterPickStatisticsTrusted,
  isSelectedChampionGoodInto,
  publicCounterPickLowSampleThreshold,
  toPublicCounterPickResult,
} = statisticsModule;
const { calculateCounterPickConfidence } = confidenceModule;

const championRows = [
  champion("Ahri", "Ahri", "the Nine-Tailed Fox", ["Mage", "Assassin"], true),
  champion("Kaisa", "Kai'Sa", "Daughter of the Void", ["Marksman"], true),
  champion("Khazix", "Kha'Zix", "the Voidreaver", ["Assassin"], true),
  champion("MonkeyKing", "Wukong", "the Monkey King", ["Fighter"], true),
  champion("Fiddlesticks", "Fiddlesticks", "the Ancient Fear", ["Mage"], true),
  champion("Nunu", "Nunu & Willump", "the Boy and His Yeti", ["Tank"], true),
  champion("DrMundo", "Dr. Mundo", "the Madman of Zaun", ["Fighter", "Tank"], true),
  champion("Velkoz", "Vel'Koz", "the Eye of the Void", ["Mage"], true),
  champion("RekSai", "Rek'Sai", "the Void Burrower", ["Fighter"], true),
  champion("KSante", "K'Sante", "the Pride of Nazumah", ["Tank"], true),
  champion("OldAatrox", "Old Aatrox", "inactive fixture", ["Fighter"], false),
];

const activeOptions = championRows
  .filter((row) => row.is_active)
  .sort((left, right) => left.name.localeCompare(right.name));

assert.equal(activeOptions.length, championRows.filter((row) => row.is_active).length);
assert.equal(new Set(activeOptions.map((row) => row.id)).size, activeOptions.length);
assert.equal(activeOptions.some((row) => row.id === "OldAatrox"), false);

for (const [query, expectedId] of [
  ["Ahri", "Ahri"],
  ["kaisa", "Kaisa"],
  ["khazix", "Khazix"],
  ["wukong", "MonkeyKing"],
  ["monkeyking", "MonkeyKing"],
  ["FiddleSticks", "Fiddlesticks"],
  ["nunu willump", "Nunu"],
  ["Dr Mundo", "DrMundo"],
  ["velkoz", "Velkoz"],
  ["reksai", "RekSai"],
  ["ksante", "KSante"],
]) {
  const matches = activeOptions.filter((row) =>
    matchesPublicCounterPickChampionSearch(row, query, ["Mid"]),
  );

  assert.equal(matches[0]?.id, expectedId, `${query} should resolve to ${expectedId}`);
}

const kaisaSearchText = getPublicCounterPickChampionSearchText(
  activeOptions.find((row) => row.id === "Kaisa"),
  ["ADC"],
);
assert.equal(kaisaSearchText.includes("kaisadaughterofthevoidmarksmanadc"), false);
assert.equal(kaisaSearchText.includes("kaisa"), true);
assert.equal(kaisaSearchText.includes("adc"), true);

const worstRows = [
  stat({ games: 80, winRate: 44.2 }),
  stat({ games: 140, winRate: 47.1 }),
  stat({ games: 80, winRate: 44.2, tier: "C" }),
].sort((left, right) => compareCounterPickStatistics(left, right, "asc"));

assert.equal(worstRows[0].winRate, 44.2);
assert.equal(worstRows[0].games, 80);

const bestRows = [
  stat({ games: 20, winRate: 54.8 }),
  stat({ games: 200, winRate: 52.1 }),
  stat({ games: 9, winRate: 60.5 }),
].sort((left, right) => compareCounterPickStatistics(left, right, "desc"));

assert.equal(bestRows[0].winRate, 60.5);
assert.equal(bestRows[0].games, 9);
assert.equal(publicCounterPickLowSampleThreshold, 20);
assert.equal(isCounterPickStatisticsTrusted(bestRows[0]), true);
assert.equal(bestRows[0].games < publicCounterPickLowSampleThreshold, true);

await testPublicCounterPickDirectionMapping();

console.log("Public Counter Pick champion coverage passed.");

function champion(id, name, title, tags, isActive) {
  return {
    id,
    image_filename: null,
    image_url: `/league/champions/icons/${id.toLowerCase()}.png`,
    is_active: isActive,
    name,
    riot_data_key: id,
    riot_key: id,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    tags,
    title,
    version: "15.12.1",
  };
}

function stat({ games, tier = "B", winRate }) {
  return {
    games,
    confidence: calculateCounterPickConfidence(games),
    lastUpdatedAt: "2026-06-15T00:00:00.000Z",
    patch: "15.12",
    rankFilter: "all",
    region: null,
    sampleConfidence: games < publicCounterPickLowSampleThreshold ? "low_sample" : "low",
    source: "provider",
    tier,
    winRate,
    wins: Math.round(games * (winRate / 100)),
  };
}

async function testPublicCounterPickDirectionMapping() {
  const zed = publicResultFromStoredStat(
    {
      counterChampionId: "Zed",
      enemyChampionId: "Ahri",
      games: 10,
      winRate: 30,
    },
    "Ahri",
  );
  const syndra = publicResultFromStoredStat(
    {
      counterChampionId: "Syndra",
      enemyChampionId: "Ahri",
      games: 8,
      winRate: 50,
    },
    "Ahri",
  );
  const sylas = publicResultFromStoredStat(
    {
      counterChampionId: "Sylas",
      enemyChampionId: "Ahri",
      games: 5,
      winRate: 80,
    },
    "Ahri",
  );
  const zedInverse = publicResultFromStoredStat(
    {
      counterChampionId: "Ahri",
      enemyChampionId: "Zed",
      games: 10,
      winRate: 70,
    },
    "Ahri",
  );
  const talon = publicResultFromStoredStat(
    {
      counterChampionId: "Talon",
      enemyChampionId: "Ahri",
      games: 4,
      winRate: 25,
    },
    "Ahri",
  );
  assert.ok(zed.result);
  assert.ok(syndra.result);
  assert.ok(sylas.result);
  assert.equal(zedInverse.result, null);
  assert.ok(talon.result);

  const publicResults = [zed.result, syndra.result, sylas.result, talon.result];
  const bestIds = publicResults
    .filter(isCounterIntoSelectedChampion)
    .map((result) => result.listedChampionId.toLowerCase())
    .sort();
  const badIds = publicResults
    .filter(isSelectedChampionGoodInto)
    .map((result) => result.listedChampionId.toLowerCase())
    .sort();
  const duplicateIds = bestIds.filter((id) => badIds.includes(id));
  const buckets = getPublicCounterResultsForSelectedChampionStats(
    [
      zed.stat,
      syndra.stat,
      sylas.stat,
      zedInverse.stat,
      storedStat({
        counterChampionId: "Ahri",
        enemyChampionId: "Sylas",
        games: 5,
        winRate: 20,
      }),
      talon.stat,
    ],
    "Ahri",
  );
  const bucketBestIds = buckets.countersIntoSelectedChampion
    .map((result) => result.listedChampionId.toLowerCase())
    .sort();
  const bucketBadIds = buckets.selectedChampionGoodInto
    .map((result) => result.listedChampionId.toLowerCase())
    .sort();
  const bucketZed = buckets.countersIntoSelectedChampion.find(
    (result) => result.listedChampionId === "Zed",
  );
  const bucketSylas = buckets.selectedChampionGoodInto.find(
    (result) => result.listedChampionId === "Sylas",
  );

  assert.equal(zed.result.statistics.winRate, 70);
  assert.equal(sylas.result.statistics.winRate, 20);
  assert.equal(isCounterIntoSelectedChampion(zed.result), true);
  assert.equal(isSelectedChampionGoodInto(zed.result), false);
  assert.notEqual(zed.result.statistics.winRate, 30);
  assert.notEqual(sylas.result.statistics.winRate, 80);
  assert.deepEqual(bestIds, ["talon", "zed"]);
  assert.deepEqual(badIds, ["sylas"]);
  assert.deepEqual(duplicateIds, []);
  assert.equal(syndra.result.statistics.winRate, 50);
  assert.equal(isCounterIntoSelectedChampion(syndra.result), false);
  assert.equal(isSelectedChampionGoodInto(syndra.result), false);
  assert.equal(sylas.result.statistics.confidence.warningVisible, true);
  assert.equal(isCounterPickStatisticsPubliclyRanked(talon.result.statistics), false);
  assert.deepEqual(bucketBestIds, ["talon", "zed"]);
  assert.deepEqual(bucketBadIds, ["sylas"]);
  assert.equal(bucketZed?.statistics.winRate, 70);
  assert.equal(bucketSylas?.statistics.winRate, 20);
}

function publicResultFromStoredStat(input, selectedChampionId) {
  const statRow = storedStat(input);

  return {
    result: toPublicCounterPickResult(statRow, selectedChampionId),
    stat: statRow,
  };
}

function storedStat({
  counterChampionId,
  enemyChampionId,
  games,
  patch = "15.12",
  role = "mid",
  tier = "A",
  winRate,
}) {
  const wins = Math.round(games * (winRate / 100));

  return {
    counter_champion_id: counterChampionId,
    enemy_champion_id: enemyChampionId,
    games,
    id: `${enemyChampionId}-${counterChampionId}`,
    losses: games - wins,
    patch,
    rank_bracket: "all",
    role,
    tier,
    updated_at: "2026-06-15T00:00:00.000Z",
    win_rate: winRate,
    wins,
  };
}
