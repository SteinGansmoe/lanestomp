import assert from "node:assert/strict";

const tokenModule = await import("../src/features/league/ability-hover-tokens.ts");

const { normalizeAbilityHoverTokenKey, parseAbilityHoverText } = tokenModule;

testAbilityTokenKeyNormalization();
testAbilityTokenFixtureParsing();
testMalformedAbilityTokenFallback();

console.log("Ability hover token regression tests passed.");

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
