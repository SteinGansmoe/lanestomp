import assert from "node:assert/strict";

import { buildChampionRegistry } from "./lib/league-champion-normalizer.mjs";
import { getFocusedDiscoveryResultsFromObservations } from "./lib/riot-counter-pick-scanner.mjs";

const registry = buildChampionRegistry([
  {
    id: "Ahri",
    name: "Ahri",
    riot_data_key: "Ahri",
    riot_key: "103",
    slug: "ahri",
  },
  {
    id: "Yasuo",
    name: "Yasuo",
    riot_data_key: "Yasuo",
    riot_key: "157",
    slug: "yasuo",
  },
  {
    id: "Lissandra",
    name: "Lissandra",
    riot_data_key: "Lissandra",
    riot_key: "127",
    slug: "lissandra",
  },
  {
    id: "Lux",
    name: "Lux",
    riot_data_key: "Lux",
    riot_key: "99",
    slug: "lux",
  },
]);

const observations = [
  {
    champion_a: "Ahri",
    champion_a_won: true,
    champion_b: "Yasuo",
    match_id: "match-1",
    role: "mid",
  },
  {
    champion_a: "Ahri",
    champion_a_won: false,
    champion_b: "Yasuo",
    match_id: "match-2",
    role: "mid",
  },
  {
    champion_a: "Lissandra",
    champion_a_won: true,
    champion_b: "Ahri",
    match_id: "match-3",
    role: "mid",
  },
  {
    champion_a: "Lux",
    champion_a_won: true,
    champion_b: "Yasuo",
    match_id: "match-4",
    role: "mid",
  },
  {
    champion_a: "Ahri",
    champion_a_won: true,
    champion_b: "Lux",
    match_id: "match-5",
    role: "support",
  },
];

const results = getFocusedDiscoveryResultsFromObservations({
  focusChampion: "Ahri",
  observations,
  registry,
  role: "mid",
});

assert.equal(results.length, 2);
assert.deepEqual(
  results.map((result) => result.opponentChampion),
  ["Yasuo", "Lissandra"],
);

const yasuoResult = results[0];
assert.equal(yasuoResult.championA, "Ahri");
assert.equal(yasuoResult.championB, "Yasuo");
assert.equal(yasuoResult.focusChampionWins, 1);
assert.equal(yasuoResult.opponentWins, 1);
assert.equal(yasuoResult.focusChampionWinRate, 50);
assert.equal(yasuoResult.games, 2);

const lissandraResult = results[1];
assert.equal(lissandraResult.championA, "Ahri");
assert.equal(lissandraResult.championB, "Lissandra");
assert.equal(lissandraResult.focusChampionWins, 0);
assert.equal(lissandraResult.opponentWins, 1);
assert.equal(lissandraResult.focusChampionWinRate, 0);
assert.equal(lissandraResult.games, 1);

console.log("Champion-focused discovery orientation passed.");
