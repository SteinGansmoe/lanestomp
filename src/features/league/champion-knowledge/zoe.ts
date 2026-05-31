import type { LeagueChampionKnowledgeProfile } from "./types";

export const zoeCombatProfile = {
    archetype: ["poke mage", "pick", "burst"],
    primaryWinCondition: ["Can find very good angles for E and have incredible range with R + Q."],
    commonWeaknesses: [
      "Vulnerable if E miss or is on cooldown.",
      "Skillshot reliant and punishable after missed bubble.",
      "Easily punished by targeted CC.",
    ],
    damageType: "magic",
    hardCrowdControl: ["E"],
    id: "Zoe",
    importantAbilityNotes: [
      "E is her key pick and damage amp setup.",
      "R is her key dodge ability skill, she also use it to extend the range of her Q.",
      "W can provide Zoe with great summoner abilities and items effects.",
    ],
    laneIdentity:
      "Pick-focused poke mage who threatens long-range burst after bubble connects.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Portal Jump for extended poke angles.",
      "First completed AP burst item.",
    ],
    mobilityLevel: "medium",
    name: "Zoe",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: [],
    primaryTradingPattern:
      "Fish for E, then use Q and R for burst.",
    shields: [],
    softCrowdControl: ["E applies sleep after a short delay, and the next damaging hit wakes the target up."],
    stealthOrInvisibility: null,
    sustain: [],
    dangerAbilities: ["E Paddle Star"],
    punishWindows: [
  "After E is missed.",
  "If R is used at bad timings."
]
  } satisfies LeagueChampionKnowledgeProfile;
