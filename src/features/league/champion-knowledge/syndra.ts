import type { LeagueChampionKnowledgeProfile } from "./types";

export const syndraCombatProfile = {
    archetype: ["burst mage", "control mage"],
    primaryWinCondition: ["Use Q and W to control space and poke, then look for E stun into R burst all-in windows."],
    dangerAbilities: ["E Scatter the Weak stun when knocking spheres"],
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
    laneIdentity:
      "Burst control mage who zones with spheres and punishes oversteps with stun into burst.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Unleashed Power.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Syndra",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Poke with Dark Sphere, hold Scatter the Weak to punish commits, and burst when stun lands.",
    shields: [],
    softCrowdControl: ["W Force of Will slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If E stun is missed, Syndra has no escape at all.",
  "If Syndra misses spells, she can be all-inned as she has no mobility or sustain."
]
  } satisfies LeagueChampionKnowledgeProfile;
