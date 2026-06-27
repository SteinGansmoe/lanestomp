import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const tokenModule = await import("../src/features/league/ability-hover-tokens.ts");
const tooltipFormattingModule = await import(
  "../src/features/league/ability-tooltip-formatting.ts"
);
const abilityCache = JSON.parse(
  readFileSync("src/features/league/data-dragon/champion-abilities.json", "utf8"),
);

const { normalizeAbilityHoverTokenKey, parseAbilityHoverText, parseLeagueHoverText } = tokenModule;
const { getCompactAbilityTooltip } = tooltipFormattingModule;

testAbilityTokenKeyNormalization();
testAbilityTokenFixtureParsing();
testDenseAbilitySentenceParsing();
testLockeAbilityTokenValidation();
testInvalidLockeAbilityKeyFallback();
testLockeAbilityCacheData();
testMalformedAbilityTokenFallback();
testItemTokenFixtureParsing();
testMixedLeagueHoverTokenParsing();
testNormalTextWithoutTokens();
testCompactAbilityTooltipFormatting();
testTotaldamageFormulaResolution();
testLocalDataDragonAbilityTooltipFormatting();
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

function testDenseAbilitySentenceParsing() {
  const parts = parseAbilityHoverText(
    "Hold {{ability:Ahri:E}} when Yone has {{ability:Yone:Q}} stacked and {{ability:Yone:E}} ready.",
  );
  const abilityParts = parts.filter((part) => part.type === "ability");

  assert.equal(abilityParts.length, 3);
  assert.deepEqual(
    abilityParts.map((part) => [part.championId, part.abilityKey, part.fallbackText]),
    [
      ["Ahri", "E", "Ahri E"],
      ["Yone", "Q", "Yone Q"],
      ["Yone", "E", "Yone E"],
    ],
  );
}

function testLockeAbilityTokenValidation() {
  const parts = parseLeagueHoverText(
    "{{ability:Locke:Passive}} {{ability:Locke:Q}} {{ability:Locke:W}} {{ability:Locke:E}} {{ability:Locke:R}}",
  );
  const abilityParts = parts.filter((part) => part.type === "ability");

  assert.equal(abilityParts.length, 5);
  assert.deepEqual(
    abilityParts.map((part) => [part.championId, part.abilityKey, part.fallbackText]),
    [
      ["Locke", "Passive", "Locke Passive"],
      ["Locke", "Q", "Locke Q"],
      ["Locke", "W", "Locke W"],
      ["Locke", "E", "Locke E"],
      ["Locke", "R", "Locke R"],
    ],
  );
}

function testInvalidLockeAbilityKeyFallback() {
  const parts = parseLeagueHoverText("Bad Locke token {{ability:Locke:Z}} should stay safe.");
  const abilityPart = parts.find((part) => part.type === "ability");

  assert.equal(abilityPart?.championId, "Locke");
  assert.equal(abilityPart?.abilityKey, null);
  assert.equal(abilityPart?.fallbackText, "Locke Z");
}

function testLockeAbilityCacheData() {
  const locke = abilityCache.champions.Locke;

  assert.equal(abilityCache.patch, "16.13.1");
  assert.ok(locke, "Locke should be included in the generated Data Dragon ability cache.");
  assert.equal(locke.id, "Locke");
  assert.equal(locke.name, "Locke");
  assert.equal(locke.abilities.Passive.name, "Silver Stake");
  assert.equal(locke.abilities.Q.name, "Ritual Nails");
  assert.equal(locke.abilities.W.name, "Soul Ignition");
  assert.equal(locke.abilities.E.name, "Ashen Pursuit");
  assert.equal(locke.abilities.R.name, "Purgatory");
  assert.equal(locke.abilities.Q.icon.localPath, "/league/abilities/icons/LockeQ.png");
  assert.equal(locke.abilities.W.icon.localPath, "/league/abilities/icons/LockeW.png");
  assert.equal(locke.abilities.E.icon.localPath, "/league/abilities/icons/LockeE.png");
  assert.equal(locke.abilities.R.icon.localPath, "/league/abilities/icons/LockeR.png");
  assert.equal(
    locke.abilities.Passive.icon.localPath,
    "/league/abilities/icons/Locke_Passive.Locke.png",
  );
  assert.match(locke.abilities.Q.cooldownBurn, /10\/9\/8\/7\/6/);
  assert.match(locke.abilities.R.tooltip, /execution threshold/i);
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

function testCompactAbilityTooltipFormatting() {
  const tooltip = getCompactAbilityTooltip(
    {
      cooldownBurn: "12",
      costBurn: "60",
      costType: "Mana",
      description:
        "Ahri blows a kiss that damages and charms an enemy it encounters, instantly stopping movement abilities and causing them to walk harmlessly towards her.",
      icon: {
        dataDragonUrl: "",
        imageFile: "AhriE.png",
        localPath: "/league/abilities/icons/AhriE.png",
      },
      id: "AhriE",
      key: "E",
      name: "Charm",
      patch: "16.12.1",
      tooltip:
        "Ahri blows a kiss that <status>Charms</status> the first enemy hit for {{ charmduration }} seconds and deals <magicDamage>{{ e1 }} (+{{ apratio*100 }}% AP) magic damage</magicDamage>.{{ spellmodifierdescriptionappend }}",
      effectBurn: [null, "80 / 120 / 160 / 200 / 240"],
      vars: [{ coeff: 0.85, key: "apratio", link: "spelldamage" }],
    },
    "Ahri",
  );

  assert.equal(tooltip.metaText, "Cooldown: 12s / Cost: 60 Mana");
  assert.deepEqual(tooltip.stats, [
    { label: "Cooldown", value: "12s" },
    { label: "Cost", value: "60 Mana" },
  ]);
  assert.equal(tooltip.description, "Charms the first enemy hit and deals magic damage.");
  assert.deepEqual(tooltip.details, [
    { label: "Damage", values: ["80 / 120 / 160 / 200 / 240 (+85% AP) magic damage"] },
    { label: "Effect", values: ["Charm"] },
  ]);
  assert.doesNotMatch(tooltip.description, /walk harmlessly|blows a kiss/i);

  const rankedCostTooltip = getCompactAbilityTooltip(
    {
      cooldownBurn: "1.5",
      costBurn: "110/100/90/80/70",
      costType: "Mana",
      description: "Diana dashes to an enemy and deals magic damage.",
      icon: {
        dataDragonUrl: "",
        imageFile: "DianaE.png",
        localPath: "/league/abilities/icons/DianaE.png",
      },
      id: "DianaE",
      key: "E",
      name: "Lunar Rush",
      patch: "16.12.1",
      tooltip:
        "Diana dashes to an enemy and deals <magicDamage>{{ e1 }} (+{{ apratio*100 }}% AP) magic damage</magicDamage>.",
      effectBurn: [null, "50 / 70 / 90 / 110 / 130"],
      vars: [{ coeff: 0.6, key: "apratio", link: "spelldamage" }],
    },
    "Diana",
  );

  assert.deepEqual(rankedCostTooltip.stats, [
    { label: "Cooldown", value: "1.5s" },
    { label: "Cost", value: "110 / 100 / 90 / 80 / 70 Mana" },
  ]);
  assert.deepEqual(rankedCostTooltip.details[0], {
    label: "Damage",
    values: ["50 / 70 / 90 / 110 / 130 (+60% AP) magic damage"],
  });

  const multiPartTooltip = getCompactAbilityTooltip(
    {
      description:
        "Ahri sends out and pulls back her orb, dealing magic damage on the way out and true damage on the way back.",
      icon: {
        dataDragonUrl: "",
        imageFile: "AhriQ.png",
        localPath: "/league/abilities/icons/AhriQ.png",
      },
      id: "AhriQ",
      key: "Q",
      name: "Orb of Deception",
      patch: "16.12.1",
      tooltip:
        "Ahri throws then pulls back her orb, dealing <magicDamage>35 / 60 / 85 / 110 / 135 (+50% AP) magic damage</magicDamage> on the way out and <trueDamage>35 / 60 / 85 / 110 / 135 (+50% AP) true damage</trueDamage> on the way back.",
    },
    "Ahri",
  );

  assert.equal(
    multiPartTooltip.description,
    "Deals magic damage on the way out and true damage on the way back.",
  );
  assert.deepEqual(multiPartTooltip.details[0], {
    label: "Damage",
    values: [
      "Outgoing: 35 / 60 / 85 / 110 / 135 (+50% AP) magic damage",
      "Return: 35 / 60 / 85 / 110 / 135 (+50% AP) true damage",
    ],
  });

  const shieldTooltip = getCompactAbilityTooltip(
    {
      description: "Gain a shield and damage nearby enemies.",
      icon: {
        dataDragonUrl: "",
        imageFile: "VexW.png",
        localPath: "/league/abilities/icons/VexW.png",
      },
      id: "VexW",
      key: "W",
      name: "Personal Space",
      patch: "16.12.1",
      tooltip:
        "Vex gains <shield>{{ shieldcalc }} Shield</shield> for {{ shieldduration }} seconds and emits a shockwave that deals <magicDamage>{{ wdamagecalc }} magic damage</magicDamage>.",
    },
    "Vex",
  );

  assert.equal(shieldTooltip.description, "Grants a shield and deals magic damage.");

  const physicalTooltip = getCompactAbilityTooltip(
    {
      description: "Aatrox slams his greatsword down, dealing physical damage.",
      effectBurn: [null, "10 / 25 / 40 / 55 / 70"],
      icon: {
        dataDragonUrl: "",
        imageFile: "AatroxQ.png",
        localPath: "/league/abilities/icons/AatroxQ.png",
      },
      id: "AatroxQ",
      key: "Q",
      name: "The Darkin Blade",
      patch: "16.12.1",
      tooltip: "Aatrox slams his greatsword, dealing <physicalDamage>{{ e1 }} physical damage</physicalDamage>.",
      vars: [{ coeff: 0.6, key: "bonusadratio", link: "bonusattackdamage" }],
    },
    "Aatrox",
  );

  assert.deepEqual(physicalTooltip.details[0], {
    label: "Damage",
    values: ["10 / 25 / 40 / 55 / 70 physical damage"],
  });

  const moveSpeedTooltip = getCompactAbilityTooltip(
    {
      description: "Aatrox unleashes his demonic form.",
      icon: {
        dataDragonUrl: "",
        imageFile: "AatroxR.png",
        localPath: "/league/abilities/icons/AatroxR.png",
      },
      id: "AatroxR",
      key: "R",
      name: "World Ender",
      patch: "16.12.1",
      tooltip:
        "Aatrox gains <speed>{{ rmovementspeedbonus*100 }}% Move Speed</speed> and <scaleAD>{{ rtotaladamp*100 }}% Attack Damage</scaleAD>.",
    },
    "Aatrox",
  );

  assert.equal(moveSpeedTooltip.description, "Grants move speed.");

  const noDamageTooltip = getCompactAbilityTooltip(
    {
      cooldownBurn: "18",
      costBurn: "0",
      costType: "No Cost",
      description: "Akshan camouflages near terrain and gains movement speed.",
      icon: {
        dataDragonUrl: "",
        imageFile: "AkshanW.png",
        localPath: "/league/abilities/icons/AkshanW.png",
      },
      id: "AkshanW",
      key: "W",
      name: "Going Rogue",
      patch: "16.12.1",
      tooltip: "Akshan becomes <status>Camouflaged</status> while near terrain.",
    },
    "Akshan",
  );

  assert.deepEqual(noDamageTooltip.stats, [
    { label: "Cooldown", value: "18s" },
    { label: "Cost", value: "No cost" },
  ]);
  assert.equal(noDamageTooltip.details.some((detail) => detail.label === "Damage"), false);

  const fallbackTooltip = getCompactAbilityTooltip(
    {
      description: "Ahri throws an orb.",
      icon: {
        dataDragonUrl: "",
        imageFile: "AhriQ.png",
        localPath: "/league/abilities/icons/AhriQ.png",
      },
      id: "AhriQ",
      key: "Q",
      name: "Orb of Deception",
      patch: "16.12.1",
      tooltip:
        "Ahri throws then pulls back her orb, dealing <magicDamage>{{ missingvalue }} magic damage</magicDamage> and <trueDamage>{{ missingvalue }} true damage</trueDamage>.",
    },
    "Ahri",
  );

  assert.deepEqual(fallbackTooltip.details[0], {
    label: "Damage",
    values: ["magic damage", "true damage"],
  });
}

function testTotaldamageFormulaResolution() {
  const apTooltip = getCompactAbilityTooltip(
    {
      description: "Deals magic damage.",
      effectBurn: [null, "60 / 90 / 120 / 150 / 180"],
      icon: {
        dataDragonUrl: "",
        imageFile: "TestQ.png",
        localPath: "/league/abilities/icons/TestQ.png",
      },
      id: "TestApTotaldamage",
      key: "Q",
      maxrank: 5,
      name: "AP Totaldamage",
      patch: "16.13.1",
      tooltip:
        "The spell deals <magicDamage>{{ totaldamage }} magic damage</magicDamage>.{{ spellmodifierdescriptionappend }}",
      vars: [{ coeff: 0.5, key: "apratio", link: "spelldamage" }],
    },
    "Test",
  );

  assert.deepEqual(apTooltip.details[0], {
    label: "Damage",
    values: ["60 / 90 / 120 / 150 / 180 (+50% AP) magic damage"],
  });

  const bonusAdTooltip = getCompactAbilityTooltip(
    {
      description: "Deals physical damage.",
      effectBurn: [null, "30 / 55 / 80 / 105 / 130"],
      icon: {
        dataDragonUrl: "",
        imageFile: "TestW.png",
        localPath: "/league/abilities/icons/TestW.png",
      },
      id: "TestBonusAdTotaldamage",
      key: "W",
      maxrank: 5,
      name: "Bonus AD Totaldamage",
      patch: "16.13.1",
      tooltip:
        "The spell deals <physicalDamage>{{ totaldamage }} physical damage</physicalDamage>.{{ spellmodifierdescriptionappend }}",
      vars: [{ coeff: 0.65, key: "bonusadratio", link: "bonusattackdamage" }],
    },
    "Test",
  );

  assert.deepEqual(bonusAdTooltip.details[0], {
    label: "Damage",
    values: ["30 / 55 / 80 / 105 / 130 (+65% bonus AD) physical damage"],
  });

  const baseOnlyTooltip = getCompactAbilityTooltip(
    {
      description: "Deals magic damage.",
      effectBurn: [null, "70 / 95 / 120 / 145 / 170"],
      icon: {
        dataDragonUrl: "",
        imageFile: "TestE.png",
        localPath: "/league/abilities/icons/TestE.png",
      },
      id: "TestBaseTotaldamage",
      key: "E",
      maxrank: 5,
      name: "Base Totaldamage",
      patch: "16.13.1",
      tooltip:
        "The spell deals <magicDamage>{{ totaldamage }} magic damage</magicDamage>.{{ spellmodifierdescriptionappend }}",
    },
    "Test",
  );

  assert.deepEqual(baseOnlyTooltip.details[0], {
    label: "Damage",
    values: ["70 / 95 / 120 / 145 / 170 magic damage"],
  });

  const unresolvedTooltip = getCompactAbilityTooltip(
    {
      description: "Deals magic damage.",
      effectBurn: [null, "1", "900"],
      icon: {
        dataDragonUrl: "",
        imageFile: "TestR.png",
        localPath: "/league/abilities/icons/TestR.png",
      },
      id: "TestUnresolvedTotaldamage",
      key: "R",
      maxrank: 5,
      name: "Unresolved Totaldamage",
      patch: "16.13.1",
      tooltip:
        "The spell deals <magicDamage>{{ totaldamage }} magic damage</magicDamage>.{{ spellmodifierdescriptionappend }}",
    },
    "Test",
  );

  assert.deepEqual(unresolvedTooltip.details[0], {
    label: "Damage",
    values: ["magic damage"],
  });
}

function testLocalDataDragonAbilityTooltipFormatting() {
  const ahriQTooltip = getCompactAbilityTooltip(abilityCache.champions.Ahri.abilities.Q, "Ahri");

  assert.deepEqual(ahriQTooltip.stats, [
    { label: "Cooldown", value: "7s" },
    { label: "Cost", value: "55 / 65 / 75 / 85 / 95 Mana" },
  ]);
  assert.deepEqual(ahriQTooltip.details[0], {
    label: "Damage",
    values: [
      "Outgoing: 35 / 60 / 85 / 110 / 135 (+50% AP) magic damage",
      "Return: 35 / 60 / 85 / 110 / 135 (+50% AP) true damage",
    ],
  });

  const ahriETooltip = getCompactAbilityTooltip(abilityCache.champions.Ahri.abilities.E, "Ahri");

  assert.deepEqual(ahriETooltip.details[0], {
    label: "Damage",
    values: ["80 / 110 / 140 / 170 / 200 (+60% AP) magic damage"],
  });

  const ahriWTooltip = getCompactAbilityTooltip(abilityCache.champions.Ahri.abilities.W, "Ahri");

  assert.deepEqual(ahriWTooltip.details[0], {
    label: "Damage",
    values: ["magic damage"],
  });

  const ahriRTooltip = getCompactAbilityTooltip(abilityCache.champions.Ahri.abilities.R, "Ahri");

  assert.deepEqual(ahriRTooltip.details[0], {
    label: "Damage",
    values: ["magic damage"],
  });

  const dianaETooltip = getCompactAbilityTooltip(abilityCache.champions.Diana.abilities.E, "Diana");

  assert.deepEqual(dianaETooltip.stats, [
    { label: "Cooldown", value: "22 / 20 / 18 / 16 / 14s" },
    { label: "Cost", value: "40 / 45 / 50 / 55 / 60 Mana" },
  ]);
  assert.deepEqual(dianaETooltip.details[0], {
    label: "Damage",
    values: ["40 / 60 / 80 / 100 / 120 magic damage"],
  });

  const akaliQTooltip = getCompactAbilityTooltip(abilityCache.champions.Akali.abilities.Q, "Akali");

  assert.deepEqual(akaliQTooltip.stats, [
    { label: "Cooldown", value: "1.5s" },
    { label: "Cost", value: "110 / 100 / 90 / 80 / 70 Energy" },
  ]);
  assert.deepEqual(akaliQTooltip.details[0], {
    label: "Damage",
    values: ["magic damage"],
  });

  const fizzQTooltip = getCompactAbilityTooltip(abilityCache.champions.Fizz.abilities.Q, "Fizz");

  assert.deepEqual(fizzQTooltip.details[0], {
    label: "Damage",
    values: ["physical damage", "magic damage"],
  });

  const luxETooltip = getCompactAbilityTooltip(abilityCache.champions.Lux.abilities.E, "Lux");

  assert.deepEqual(luxETooltip.details[0], {
    label: "Damage",
    values: ["65 / 115 / 165 / 215 / 265 magic damage"],
  });

  const malzaharRTooltip = getCompactAbilityTooltip(
    abilityCache.champions.Malzahar.abilities.R,
    "Malzahar",
  );

  assert.deepEqual(malzaharRTooltip.details[0], {
    label: "Damage",
    values: ["magic damage"],
  });

  const lockeWTooltip = getCompactAbilityTooltip(abilityCache.champions.Locke.abilities.W, "Locke");

  assert.deepEqual(lockeWTooltip.stats, [
    { label: "Cooldown", value: "18 / 17 / 16 / 15 / 14s" },
    { label: "Cost", value: "50 / 55 / 60 / 65 / 70 Mana" },
  ]);
}

function testAbilityHoverComponentBoundary() {
  const abilityHoverSource = readFileSync("src/components/league/ability-hover.tsx", "utf8");
  const abilitiesSource = readFileSync("src/features/league/abilities.ts", "utf8");
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
  assert.match(abilityHoverSource, /if \(!ability\)/);
  assert.match(abilityHoverSource, /getLeagueAbilityDataDiagnostics/);
  assert.match(abilityHoverSource, /Missing League ability hover data/);
  assert.match(abilityHoverSource, /ability\.key\}<\/span> \{ability\.name\}/);
  assert.match(abilityHoverSource, /getCompactAbilityTooltip/);
  assert.match(abilityHoverSource, /bg-transparent/);
  assert.match(abilityHoverSource, /decoration-dotted/);
  assert.match(abilityHoverSource, /focus-visible:ring-2/);
  assert.doesNotMatch(abilityHoverSource, /bg-cyan-400\/\[0\.08\]/);
  assert.doesNotMatch(abilityHoverSource, /shadow-\[0_0_14px/);
  assert.doesNotMatch(abilityHoverSource, /border border-cyan-300\/25/);
  assert.match(tokenRendererSource, /parseLeagueHoverText/);
  assert.match(tokenRendererSource, /<AbilityHover/);
  assert.match(tokenRendererSource, /abilityKey=\{part\.abilityKey\}/);
  assert.match(tokenRendererSource, /championId=\{part\.championId\}/);
  assert.match(abilitiesSource, /addAbilitySetLookup\(lookupMap, champion\.id, champion\)/);
  assert.match(abilitiesSource, /addAbilitySetLookup\(lookupMap, champion\.name, champion\)/);
  assert.match(abilitiesSource, /championRegistryEntryExists/);
  assert.match(abilitiesSource, /data-dragon-champion-abilities-cache/);
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
