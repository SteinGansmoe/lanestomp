import type { LeagueChampionKnowledgeProfile } from "./types";

export const talonCombatProfile = {
    archetype: ["assassin", "roam", "burst"],
    primaryWinCondition: ["Push the wave to create roam opportunities, then use E to move around the map quickly."],
    dangerAbilities: ["E Assassin's Path terrain mobility, R Shadow Assault burst and stealth"],
    commonWeaknesses: [
      "Can be punished by ranged control before all-in access.",
      "Needs lane movement and flank angles to maximize pressure.",
      "Weaker when forced to stay visible in lane.",
    ],
    damageType: "physical",
    hardCrowdControl: [],
    id: "Talon",
    importantAbilityNotes: [
      "Assassin's Path gives terrain mobility, not combat crowd control.",
      "Shadow Assault gives level 6 burst and stealth.",
      "E is not a direct engage tool, can only be used on terrain and is best for roaming or repositioning.",
      "Rake return damage and passive bleed matter for trades.",
    ],
    laneIdentity:
      "AD assassin who pushes or trades for roam timers and burst windows.",
    majorPowerSpikes: [
      "Level 2 access to Q plus W pressure.",
      "Level 6 Shadow Assault.",
      "First completed lethality item.",
    ],
    mobilityLevel: "high",
    name: "Talon",
    offMetaRoles: [],
    primaryRoles: ["mid"],
    secondaryRoles: ["jungle"],
    primaryTradingPattern:
      "Land Rake, threaten Q follow-up and passive bleed, then use roam pressure when the wave allows.",
    shields: [],
    softCrowdControl: ["W Rake slow on return"],
    stealthOrInvisibility: "R Shadow Assault grants stealth during the burst window.",
    sustain: ["Q Noxian Diplomacy heals on unit kill."],
    punishWindows: [
  "When he uses Q he dashes towards the target.",
  "Talon has to wait a while to use E over the same terrain.",
  "Talon's waveclear is not the best, he can be shoved under turret and forced to farm"
]
  } satisfies LeagueChampionKnowledgeProfile;
