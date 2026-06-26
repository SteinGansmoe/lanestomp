import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const promptModule = await import("../src/features/league/matchup-draft-prompt.ts");

const { buildLeagueMatchupDraftPrompt } = promptModule;

const suggestedMidValidationSet = [
  ["Ahri", "Yone"],
  ["Ahri", "Fizz"],
  ["Vex", "Yone"],
  ["Malzahar", "Yasuo"],
  ["Lissandra", "Zed"],
  ["Annie", "Katarina"],
  ["Xerath", "Fizz"],
  ["Orianna", "Diana"],
  ["Kassadin", "Syndra"],
];

testPromptQualityRules();
testSuggestedMidValidationSetPrompts();
testProviderWarningHooks();

console.log("Matchup draft prompt quality regression tests passed.");

function testPromptQualityRules() {
  const prompt = buildTestPrompt("Ahri", "Fizz");
  const combinedPrompt = `${prompt.systemPrompt}\n${prompt.userPrompt}`;

  assert.match(combinedPrompt, /Write directly to the player/);
  assert.match(combinedPrompt, /you want to, you should, look to, hold, avoid, punish/);
  assert.match(combinedPrompt, /Avoid third-person champion phrasing/);
  assert.match(combinedPrompt, /Anti-Generic Advice Rules/);
  assert.match(combinedPrompt, /Hard avoid vague phrases/);
  assert.match(combinedPrompt, /vulnerable positions, safe scaling, free scaling/);
  assert.match(combinedPrompt, /all-in combo is ready, engage setup, control wave tempo/);
  assert.match(combinedPrompt, /create roam pressure, post-level 6/);
  assert.match(combinedPrompt, /play around cooldowns, respect engage/);
  assert.match(combinedPrompt, /mechanical anchor/);
  assert.match(combinedPrompt, /keep the wave small so Yone cannot dash through minions/);
  assert.match(combinedPrompt, /before Yone has \{\{ability:Yone:Q\}\} stacked/);
  assert.match(combinedPrompt, /deny free farm, deny free resets, stop him from stacking waves/);
  assert.match(combinedPrompt, /slow push, crash the wave, hold the wave outside your tower/);
  assert.match(combinedPrompt, /Do not give overly rigid waveclear advice/);
  assert.match(combinedPrompt, /\{\{ability:Ahri:Q\}\} is a normal poke and waveclear tool/);
  assert.match(combinedPrompt, /Any wave advice must include a concrete wave-state term/);
  assert.match(combinedPrompt, /If advice mentions engage, all-in, combo, punish window/);
  assert.match(combinedPrompt, /\{\{ability:Ahri:E\}\}/);
  assert.match(combinedPrompt, /\{\{ability:Fizz:E\}\}/);
  assert.match(combinedPrompt, /\{\{item:3157\}\}/);
  assert.match(combinedPrompt, /\{\{item:3020\}\}/);
  assert.match(combinedPrompt, /Hold \{\{ability:Ahri:E\}\} until Fizz uses \{\{ability:Fizz:E\}\}/);
  assert.match(
    combinedPrompt,
    /Use \{\{ability:Ahri:Q\}\} to thin the wave, but keep \{\{ability:Ahri:E\}\} available/,
  );
  assert.match(combinedPrompt, /Crash the wave before roaming so Yone must choose/);
  assert.doesNotMatch(combinedPrompt, /Use only \(Q\), \(W\), \(E\), or \(R\)/);
}

function testSuggestedMidValidationSetPrompts() {
  for (const [playerChampionName, enemyChampionName] of suggestedMidValidationSet) {
    const prompt = buildTestPrompt(playerChampionName, enemyChampionName);

    assert.match(prompt.userPrompt, /Role: mid/);
    assert.match(prompt.userPrompt, /Direct|direct|you want to/);
    assert.match(prompt.userPrompt, /Ability and Item Token Rules/);
    assert.match(prompt.userPrompt, /Final validation before returning JSON/);
    assert.match(prompt.userPrompt, /valid \{\{ability:ChampionId:AbilityKey\}\} tokens/);
    assert.match(prompt.userPrompt, /valid \{\{item:ItemId\}\} tokens/);
  }
}

function testProviderWarningHooks() {
  const providerSource = readFileSync("src/features/league/matchup-draft-provider.ts", "utf8");

  assert.match(providerSource, /findGenericAdviceWarningInSection/);
  assert.match(providerSource, /findInvalidHoverTokenWarningInSection/);
  assert.match(providerSource, /genericAdviceWithoutAnchorPatterns/);
  assert.match(providerSource, /concreteAdviceAnchorPattern/);
  assert.match(providerSource, /getLeagueChampionAbilitySet/);
  assert.match(providerSource, /getLeagueItemById/);
  assert.match(providerSource, /parseLeagueHoverText/);
  assert.match(providerSource, /invalid ability token/);
  assert.match(providerSource, /invalid item token/);
  assert.match(providerSource, /third-person champion coaching phrasing/);
  assert.match(providerSource, /findVagueAdviceWarningInSection/);
  assert.match(providerSource, /findWaveSpecificityWarningInSection/);
  assert.match(providerSource, /findAbilityAdviceSpecificityWarningInSection/);
  assert.match(providerSource, /vague phrase: \$\{label\}/);
  assert.match(providerSource, /bad Ahri Q waveclear restriction/);
  assert.match(providerSource, /bad plain Ahri Q waveclear restriction/);
  assert.match(providerSource, /bad only Ahri Q waveclear restriction/);
  assert.match(providerSource, /wave advice without concrete wave-state term/);
  assert.match(providerSource, /ability advice without concrete ability token or condition/);
  assert.match(providerSource, /safe scaling/);
  assert.match(providerSource, /free scaling/);
  assert.match(providerSource, /vulnerable positions/);
  assert.match(providerSource, /all-in combo is ready/);
  assert.match(providerSource, /engage setup/);
  assert.match(providerSource, /control wave tempo/);
  assert.match(providerSource, /create roam pressure/);
  assert.match(providerSource, /post-level/);
  assert.match(providerSource, /\{\{ability:\$\{getAbilityTokenChampionId\(champion\)\}:\$\{abilityKey\}\}\}/);
}

function buildTestPrompt(playerChampionName, enemyChampionName) {
  return buildLeagueMatchupDraftPrompt({
    adminNotes: null,
    enemyChampionName,
    enemyChampionProfile: championProfile(enemyChampionName),
    playerChampionName,
    playerChampionProfile: championProfile(playerChampionName),
    role: "mid",
  });
}

function championProfile(name) {
  return {
    abilities: {
      E: `${name} E`,
      Q: `${name} Q`,
      R: `${name} R`,
      W: `${name} W`,
    },
    id: name,
    name,
    profileQuality: "draft",
    strategicIdentity: {
      laneGoal: "control",
      preferredGameLength: "medium",
      scalingProfile: "mid",
      winMethod: ["lane control"],
    },
  };
}
