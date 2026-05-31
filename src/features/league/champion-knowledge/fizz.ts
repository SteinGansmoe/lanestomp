import type { LeagueChampionKnowledgeProfile } from "./types";

export const fizzCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Urchin Strike",
      W: "Seastone Trident",
      E: "Playful / Trickster",
      R: "Chum the Waters",
    },
    archetype: ["assassin", "burst", "skirmisher"],
    primaryWinCondition: ["Short trades until target is in kill range."],
    dangerAbilities: [],
    dangerProfile: {
      dangerousWhen: [],
      mustRespect: [
            "E Playful / Trickster is his main dodge, engage, and escape tool.",
            "R Chum the Waters creates his level 6 kill threat.",
            "He has no reliable hard CC before ultimate.",
          ],
    },
    commonWeaknesses: [
      "If enemy team is very tanky, Fizz might not be able to secure kills.",
      "Have to be very careful before level 3, give up minions to not lose hp.",
      "Is a melee champion.",
    ],
    damageType: "magic",
    hardCrowdControl: ["R Chum the Waters knockup"],
    id: "Fizz",
    importantAbilityNotes: [
      "E Playful / Trickster is his main dodge, engage, and escape tool.",
      "R Chum the Waters creates his level 6 kill threat.",
      "He has no reliable hard CC before ultimate.",
    ],
    lanePlan: {
      avoids: [
            "If enemy team is very tanky, Fizz might not be able to secure kills.",
            "Have to be very careful before level 3, give up minions to not lose hp.",
            "Is a melee champion.",
          ],
      idealLaneState: "Melee AP assassin who survives early pressure and looks for level 6 burst windows.",
      wants: ["Short trades until target is in kill range."],
    },
    laneIdentity:
      {
      earlyGameAgency: "high",
      scalingPriority: "medium",
      lanePressure: "high",
      preferredGameState: ["Short trades until target is in kill range."],
      winLaneBy: ["Short trades until target is in kill range."],
    },
    majorPowerSpikes: [
      "Level 3 unlocks Fizz's first real trade pattern with Q engage, W damage, and E dodge or escape.",
      "Level 6 Chum the Waters.",
      "First completed AP assassin item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "high",
    name: "Fizz",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 3 unlocks Fizz's first real trade pattern with Q engage, W damage, and E dodge or escape.",
            "Level 6 Chum the Waters.",
            "First completed AP assassin item.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "Dash in for burst, use Playful / Trickster to dodge the key answer, then exit or finish.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "If enemy team is very tanky, Fizz might not be able to secure kills.",
            "Have to be very careful before level 3, give up minions to not lose hp.",
            "Is a melee champion.",
          ],
    },
    shields: [],
    softCrowdControl: ["E Playful / Trickster slow"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If Fizz uses E recklessly, he will struggle.",
        "Before Fizz turns level 3 he is very weak, if he steps up attack him"
      ],
      goodTradeConditions: [],
      primaryPattern: "Dash in for burst, use Playful / Trickster to dodge the key answer, then exit or finish.",
    },
    punishWindows: [
  "If Fizz uses E recklessly, he will struggle.",
  "Before Fizz turns level 3 he is very weak, if he steps up attack him"
]
  } satisfies LeagueChampionKnowledgeProfile;
