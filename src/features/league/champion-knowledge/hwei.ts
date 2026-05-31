import type { LeagueChampionKnowledgeProfile } from "./types";

export const hweiCombatProfile = {
    archetype: ["artillery mage", "control mage", "poke"],
    primaryWinCondition: ["Use long-range poke and E spellbook CC to control the lane and set up for level 6 all-in with Spiraling Despair."],
    dangerAbilities: ["E spellbook fear or root depending on spell choice"],
    commonWeaknesses: [
      "Has more ability options then any other champion, requires a lot of practice to master.",
      "Can be punished by fast all-ins.",
      "Requires correct spell choice under pressure.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E spellbook fear or root depending on spell choice"],
    id: "Hwei",
    importantAbilityNotes: [
      "Hwei has multiple spellbook choices, but only some provide crowd control.",
      "His defensive answer depends on choosing the right E spell.",
      "He should not be framed as mobile.",
    ],
    laneIdentity:
      "Long-range control mage who uses spell variety to poke, waveclear, and punish predictable engages.",
    majorPowerSpikes: [
      "Level 3 access to all basic spellbooks.",
      "Level 6 Spiraling Despair.",
      "First completed mage item.",
    ],
    mobilityLevel: "none",
    name: "Hwei",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["adc", "support"],
    primaryTradingPattern:
      "Control space with long-range spells and hold defensive E choices for enemy engage timing.",
    shields: ["W spellbook can provide shielding depending on spell choice"],
    softCrowdControl: ["Several E and R effects can slow or disrupt"],
    stealthOrInvisibility: null,
    sustain: [],
    punishWindows: [
  "If Hwei chooses the wrong E spell for the situation, he can be punished hard.",
  "Skillshot reliant champions can be punished by dodging their key abilities and forcing them into unfavorable trades."
]
  } satisfies LeagueChampionKnowledgeProfile;
