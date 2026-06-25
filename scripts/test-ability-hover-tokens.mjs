import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const tokenModule = await import("../src/features/league/ability-hover-tokens.ts");

const { normalizeAbilityHoverTokenKey, parseAbilityHoverText, parseLeagueHoverText } = tokenModule;

testAbilityTokenKeyNormalization();
testAbilityTokenFixtureParsing();
testMalformedAbilityTokenFallback();
testItemTokenFixtureParsing();
testMixedLeagueHoverTokenParsing();
testNormalTextWithoutTokens();
testAbilityHoverComponentBoundary();
testItemHoverComponentBoundary();

console.log("League hover token regression tests passed.");

function testAbilityTokenKeyNormalization() {
  assert.equal(normalizeAbilityHoverTokenKey("q"), "Q");
  assert.equal(normalizeAbilityHoverTokenKey("W"), "W");
  assert.equal(normalizeAbilityHoverTokenKey("passive"), "Passive");
  assert.equal(normalizeAbilityHoverTokenKey("P"), "Passive");
  assert.equal(normalizeAbilityHoverTokenKey("Z"), null);
}

function testAbilityTokenFixtureParsing() {
  const parts = parseAbilityHoverText(
    "Respect {{ability:Vex:W}}, dodge {{ability:Yone:R}}, punish {{ability:Ahri:E}}, and track {{ability:Malzahar:Passive}}.",
  );
  const abilityParts = parts.filter((part) => part.type === "ability");

  assert.equal(abilityParts.length, 4);
  assert.deepEqual(
    abilityParts.map((part) => [part.championId, part.abilityKey, part.fallbackText]),
    [
      ["Vex", "W", "Vex W"],
      ["Yone", "R", "Yone R"],
      ["Ahri", "E", "Ahri E"],
      ["Malzahar", "Passive", "Malzahar Passive"],
    ],
  );
}

function testMalformedAbilityTokenFallback() {
  const parts = parseAbilityHoverText("Unknown token {{ability:Ahri:Z}} should stay safe.");
  const abilityPart = parts.find((part) => part.type === "ability");

  assert.equal(abilityPart?.championId, "Ahri");
  assert.equal(abilityPart?.abilityKey, null);
  assert.equal(abilityPart?.fallbackText, "Ahri Z");
}

function testItemTokenFixtureParsing() {
  const parts = parseLeagueHoverText(
    "Rush {{item:3157}} if Zed's burst is the main threat. If you need early movement and magic penetration, consider {{item:3020}}.",
  );
  const itemParts = parts.filter((part) => part.type === "item");

  assert.equal(itemParts.length, 2);
  assert.deepEqual(
    itemParts.map((part) => [part.itemId, part.fallbackText]),
    [
      ["3157", "Item 3157"],
      ["3020", "Item 3020"],
    ],
  );
}

function testMixedLeagueHoverTokenParsing() {
  const parts = parseLeagueHoverText(
    "Dodge {{ability:Yone:R}} and buy {{item:3157}} before the all-in.",
  );

  assert.deepEqual(
    parts.map((part) => part.type),
    ["text", "ability", "text", "item", "text"],
  );
}

function testNormalTextWithoutTokens() {
  assert.deepEqual(parseLeagueHoverText("Plain guide text."), [
    { text: "Plain guide text.", type: "text" },
  ]);
}

function testAbilityHoverComponentBoundary() {
  const abilityHoverSource = readFileSync("src/components/league/ability-hover.tsx", "utf8");
  const tokenRendererSource = readFileSync(
    "src/components/league/ability-hover-token-text.tsx",
    "utf8",
  );

  assert.doesNotMatch(
    abilityHoverSource,
    /ability-hover-tokens|parseAbilityHoverText/,
    "AbilityHover should be reusable and not import token parsing.",
  );
  assert.match(abilityHoverSource, /championId: string;/);
  assert.match(abilityHoverSource, /abilityKey: LeagueAbilityTokenKey;/);
  assert.match(abilityHoverSource, /compact\?: boolean;/);
  assert.match(abilityHoverSource, /label\?: string;/);
  assert.match(tokenRendererSource, /parseLeagueHoverText/);
  assert.match(tokenRendererSource, /<AbilityHover/);
  assert.match(tokenRendererSource, /abilityKey=\{part\.abilityKey\}/);
  assert.match(tokenRendererSource, /championId=\{part\.championId\}/);
}

function testItemHoverComponentBoundary() {
  const itemHoverSource = readFileSync("src/components/league/item-hover.tsx", "utf8");
  const tokenRendererSource = readFileSync(
    "src/components/league/ability-hover-token-text.tsx",
    "utf8",
  );

  assert.doesNotMatch(
    itemHoverSource,
    /ability-hover-tokens|parseLeagueHoverText|parseAbilityHoverText/,
    "ItemHover should be reusable and not import token parsing.",
  );
  assert.match(itemHoverSource, /itemId: number \| string;/);
  assert.match(itemHoverSource, /compact\?: boolean;/);
  assert.match(itemHoverSource, /label\?: string;/);
  assert.match(tokenRendererSource, /<ItemHover/);
  assert.match(tokenRendererSource, /itemId=\{part\.itemId\}/);
}
