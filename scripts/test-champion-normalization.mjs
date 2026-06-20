import assert from "node:assert/strict";

import {
  buildChampionRegistry,
  normalizeChampionIdentifier,
  normalizeParticipantChampionIdentifiers,
} from "./lib/league-champion-normalizer.mjs";

const registryRows = [
  row("Ahri", "103", "Ahri", "ahri"),
  row("Belveth", "200", "Bel'Veth", "belveth"),
  row("Chogath", "31", "Cho'Gath", "chogath"),
  row("Fiddlesticks", "9", "Fiddlesticks", "fiddlesticks"),
  row("Kaisa", "145", "Kai'Sa", "kaisa"),
  row("Khazix", "121", "Kha'Zix", "khazix"),
  row("KSante", "897", "K'Sante", "ksante"),
  row("LeeSin", "64", "Lee Sin", "lee-sin"),
  row("MissFortune", "21", "Miss Fortune", "miss-fortune"),
  row("MonkeyKing", "62", "Wukong", "wukong"),
  row("Nunu", "20", "Nunu & Willump", "nunu-willump"),
  row("Renata", "888", "Renata Glasc", "renata-glasc"),
  row("TwistedFate", "4", "Twisted Fate", "twisted-fate"),
  row("Yasuo", "157", "Yasuo", "yasuo"),
];
const registry = buildChampionRegistry(registryRows);

testFiddlesticksCaseMismatch();
testWukongInternalKey();
testApostropheNames();
testMultiWordNames();
testRenamedDisplayNames();
testNumericLookup();
testConflictingParticipantIdentifiers();
testUnknownChampion();
testCaseAndWhitespace();
testCollisionDetection();

console.log("Champion normalization regression tests passed.");

function testFiddlesticksCaseMismatch() {
  assert.equal(resolve("FiddleSticks"), "Fiddlesticks");
}

function testWukongInternalKey() {
  assert.equal(resolve("MonkeyKing"), "MonkeyKing");
  assert.equal(resolve("Wukong"), "MonkeyKing");
  assert.equal(resolve("62"), "MonkeyKing");
}

function testApostropheNames() {
  assertPairs([
    ["Kaisa", "Kai'Sa", "Kaisa"],
    ["Khazix", "Kha'Zix", "Khazix"],
    ["Chogath", "Cho'Gath", "Chogath"],
    ["Belveth", "Bel'Veth", "Belveth"],
    ["KSante", "K'Sante", "KSante"],
  ]);
}

function testMultiWordNames() {
  assertPairs([
    ["LeeSin", "Lee Sin", "LeeSin"],
    ["MissFortune", "Miss Fortune", "MissFortune"],
    ["TwistedFate", "Twisted Fate", "TwistedFate"],
  ]);
}

function testRenamedDisplayNames() {
  assertPairs([
    ["Renata", "Renata Glasc", "Renata"],
    ["Nunu", "Nunu & Willump", "Nunu"],
  ]);
}

function testNumericLookup() {
  for (const champion of registryRows) {
    assert.equal(resolve(champion.riot_key), champion.id);
    assert.equal(resolve(Number(champion.riot_key)), champion.id);
  }
}

function testConflictingParticipantIdentifiers() {
  const result = normalizeParticipantChampionIdentifiers(
    {
      championId: 103,
      championName: "Yasuo",
    },
    registry,
  );

  assert.equal(result.conflict, true);
  assert.equal(result.entry, null);
}

function testUnknownChampion() {
  assert.equal(resolve("DefinitelyNotAChampion"), null);
}

function testCaseAndWhitespace() {
  assert.equal(resolve("  fiddlesticks  "), "Fiddlesticks");
  assert.equal(resolve("FIDDLESTICKS"), "Fiddlesticks");
}

function testCollisionDetection() {
  assert.throws(
    () =>
      buildChampionRegistry([row("TestOne", "1", "A B", "a-b"), row("TestTwo", "2", "AB", "ab")]),
    /ambiguous/,
  );
}

function assertPairs(pairs) {
  for (const [left, right, expected] of pairs) {
    assert.equal(resolve(left), expected);
    assert.equal(resolve(right), expected);
  }
}

function resolve(value) {
  return normalizeChampionIdentifier(value, registry)?.canonicalKey ?? null;
}

function row(id, riotKey, name, slug) {
  return {
    id,
    name,
    riot_data_key: id,
    riot_key: riotKey,
    slug,
  };
}
