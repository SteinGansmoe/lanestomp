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

  assert.equal(tooltip.metaText, "12s / 60 Mana");
  assert.equal(tooltip.description, "Charms the first enemy hit and deals magic damage.");
  assert.deepEqual(tooltip.details, [
    { label: "Damage breakdown", values: ["80 / 120 / 160 / 200 / 240 (+85% AP) magic damage"] },
    { label: "Effect", values: ["Charm"] },
  ]);
  assert.doesNotMatch(tooltip.description, /walk harmlessly|blows a kiss/i);

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
    label: "Damage breakdown",
    values: ["Magic: 35 / 60 / 85 / 110 / 135 (+50% AP)", "True: 35 / 60 / 85 / 110 / 135 (+50% AP)"],
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
    label: "Damage breakdown",
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

  assert.equal(noDamageTooltip.details.some((detail) => detail.label === "Damage breakdown"), false);

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
    label: "Damage breakdown",
    values: ["Magic Damage", "True Damage"],
  });
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
