import type { LeagueChampionKnowledgeProfile } from "./types";

export const luxCombatProfile = {
    archetype: ["artillery mage", "pick", "poke", "burst"],
    primaryWinCondition: [],
    dangerAbilities: [],
    commonWeaknesses: [
      "If Q is used recklessly, she can be punished.",
      "Skillshot reliant.",
      "Can be all-inned if she loses range control.",
    ],
    damageType: "magic",
    hardCrowdControl: ["Q Light Binding root"],
    id: "Lux",
    importantAbilityNotes: [
      "Light Binding is her key defensive and pick tool.",
      "Prismatic Barrier shields allies and herself.",
      "Q + E + R does significant damage.",
    ],
    laneIdentity:
      "Long-range mage who controls lane with poke, binding threat, and waveclear.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Final Spark.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Lux",
    offMetaRoles: [],
    primaryRoles: ["support"],
    secondaryRoles: ["mid"],
    primaryTradingPattern:
      "Poke with Lucent Singularity and punish oversteps with Light Binding into burst.",
    shields: ["W Prismatic Barrier"],
    softCrowdControl: ["E Lucent Singularity slow"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Lux misses Q she can be punished.",
  "Skillshot reliant champions like Lux can be punished by dodging their key abilities and forcing them into unfavorable trades."
]
  } satisfies LeagueChampionKnowledgeProfile;
