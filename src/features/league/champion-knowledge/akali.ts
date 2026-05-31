import type { LeagueChampionKnowledgeProfile } from "./types";

export const akaliCombatProfile = {
    archetype: ["assassin", "skirmisher", "burst"],
    primaryWinCondition: ["Use W Twilight Shroud to create safe windows for extended trades and all-ins."],
    dangerAbilities: ["W Twilight Shroud, E Shuriken Flip"],
    commonWeaknesses: [
      "Can be punished when Twilight Shroud is down.",
      "Early waveclear can be exploitable by ranged mids.",
      "Needs energy and ability access to extend trades.",
    ],
    damageType: "magic",
    hardCrowdControl: [],
    id: "Akali",
    importantAbilityNotes: [
      "Twilight Shroud is not a level 6 spike.",
      "Twilight Shroud creates her safest trading window.",
      "Shuriken Flip recast is a major commit point.",
    ],
    laneIdentity:
      "Melee AP assassin who gives ground early, becomes stronger after level 3.",
    majorPowerSpikes: [
      "Level 3 full basic ability access.",
      "Level 6 Perfect Execution.",
      "First completed AP assassin item.",
    ],
    mobilityLevel: "very_high",
    name: "Akali",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["top"],
    primaryTradingPattern:
      "Look for Q poke into passive autos, then commit harder with Shroud or E when the opponent is exposed.",
    shields: [],
    softCrowdControl: ["Short slow on Q hit"],
    stealthOrInvisibility: "W Twilight Shroud obscures Akali and enables trades.",
    sustain: [],
    punishWindows: [
  "When Akali uses W, if the opponent can step out of the shroud or wait it out, she can be punished hard.",
]
  } satisfies LeagueChampionKnowledgeProfile;
