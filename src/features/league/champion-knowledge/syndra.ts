import type { LeagueChampionKnowledgeProfile } from "./types";

export const syndraCombatProfile = {
    profileQuality: "draft",
    abilities: {
      Q: "Dark Sphere",
      W: "Force of Will",
      E: "Scatter the Weak",
      R: "Unleashed Power",
    },
    archetype: ["burst mage", "control mage"],
    primaryWinCondition: ["Use Q and W to control space and poke, then look for E stun into R burst all-in windows."],
    dangerAbilities: ["E Scatter the Weak stun when knocking spheres"],
    dangerProfile: {
      dangerousWhen: ["E Scatter the Weak stun when knocking spheres"],
      mustRespect: [
            "Scatter the Weak is her key disengage and stun tool.",
            "Unleashed Power is level 6 single-target burst.",
            "Sphere placement changes her stun threat.",
          ],
    },
    commonWeaknesses: [
      "Immobile and punishable when Scatter the Weak is down.",
      "Needs sphere setup for strongest control.",
      "Can be pressured before scaling stacks and items.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E Scatter the Weak stun when knocking spheres"],
    id: "Syndra",
    importantAbilityNotes: [
      "Scatter the Weak is her key disengage and stun tool.",
      "Unleashed Power is level 6 single-target burst.",
      "Sphere placement changes her stun threat.",
    ],
    lanePlan: {
      avoids: [
            "Immobile and punishable when Scatter the Weak is down.",
            "Needs sphere setup for strongest control.",
            "Can be pressured before scaling stacks and items.",
          ],
      idealLaneState: "Burst control mage who zones with spheres and punishes oversteps with stun into burst.",
      wants: ["Use Q and W to control space and poke, then look for E stun into R burst all-in windows."],
    },
    laneIdentity:
      {
      earlyGameAgency: "low",
      scalingPriority: "high",
      lanePressure: "medium",
      preferredGameState: ["Use Q and W to control space and poke, then look for E stun into R burst all-in windows."],
      winLaneBy: ["Use Q and W to control space and poke, then look for E stun into R burst all-in windows."],
    },
    majorPowerSpikes: [
      "Level 6 Unleashed Power.",
      "First completed mage item.",
    ],
    matchupPreferences: {
      strongInto: [],
      weakInto: [],
    },
    mobilityLevel: "none",
    name: "Syndra",
    offMetaRoles: [],
    powerSpikes: {
      major: [
            "Level 6 Unleashed Power.",
            "First completed mage item.",
            "Level 11 and 16 when maxing Q for lower cooldown and stronger poke.",
            "Once her (Q) Dark Sphere is upgraded she can reliably poke back and threaten stuns more often.",
          ],
      notes: [],
    },
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Poke with Dark Sphere, hold Scatter the Weak to punish commits, and burst when stun lands.",
    punishProfile: {
      canPunish: [],
      strugglesToPunish: [
            "Immobile and punishable when Scatter the Weak is down.",
            "Needs sphere setup for strongest control.",
            "Can be pressured before scaling stacks and items.",
          ],
    },
    shields: [],
    softCrowdControl: ["W Force of Will slow"],
    stealthOrInvisibility: null,
    sustain: [],
    trading: {
      badTradeConditions: [
        "If E stun is missed, Syndra has no escape at all.",
        "If Syndra misses spells, she can be all-inned as she has no mobility or sustain."
      ],
      goodTradeConditions: [],
      primaryPattern: "Poke with Dark Sphere, hold Scatter the Weak to punish commits, and burst when stun lands.",
    },
    punishWindows: [
  "If E stun is missed, Syndra has no escape at all.",
  "If Syndra misses spells, she can be all-inned as she has no mobility or sustain."
]
  } satisfies LeagueChampionKnowledgeProfile;
