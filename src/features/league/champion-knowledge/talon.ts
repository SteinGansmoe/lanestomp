import type { LeagueChampionKnowledgeProfile } from "./types";

export const talonCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Noxian Diplomacy",
    W: "Rake",
    E: "Assassin's Path",
    R: "Shadow Assault",
  },
  archetype: ["assassin", "roam", "burst"],
  primaryWinCondition: [
    "Push the wave to create roam opportunities, then use (E) to move around the map quickly.",
  ],
  dangerAbilities: ["(E) terrain mobility, (R) burst and stealth"],
  dangerProfile: {
    dangerousWhen: ["(E) terrain mobility, (R) burst and stealth"],
    mustRespect: [
      "(E) gives terrain mobility, not combat crowd control.",
      "(R) gives level 6 burst and stealth.",
      "(E) is not a direct engage tool, can only be used on terrain and is best for roaming or repositioning.",
      "(W) return damage and passive bleed matter for trades.",
    ],
  },
  commonWeaknesses: [
    "Can be punished by ranged control before all-in access.",
    "Needs lane movement and flank angles to maximize pressure.",
    "Weaker when forced to stay visible in lane.",
  ],
  damageType: "physical",
  hardCrowdControl: [],
  id: "Talon",
  importantAbilityNotes: [
    "(E) gives terrain mobility, not combat crowd control.",
    "(R) gives level 6 burst and stealth.",
    "(E) is not a direct engage tool, can only be used on terrain and is best for roaming or repositioning.",
    "(W) return damage and passive bleed matter for trades.",
  ],
  lanePlan: {
    avoids: [
      "Can be punished by ranged control before all-in access.",
      "Needs lane movement and flank angles to maximize pressure.",
      "Weaker when forced to stay visible in lane.",
    ],
    idealLaneState: "AD assassin who pushes or trades for roam timers and burst windows.",
    wants: [
      "Push the wave to create roam opportunities, then use (E) to move around the map quickly.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    scalingPriority: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Push the wave to create roam opportunities, then use (E) to move around the map quickly.",
    ],
    winLaneBy: [
      "Push the wave to create roam opportunities, then use (E) to move around the map quickly.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 access to (Q) plus (W) pressure.",
    "Level 6 (R).",
    "First completed lethality item.",
  ],
  matchupPreferences: {
    strongInto: [],
    weakInto: [],
  },
  mobilityLevel: "high",
  name: "Talon",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "snowball",
    scalingProfile: "early",
    preferredGameLength: "short",
    winMethod: ["roams", "early kills", "map pressure"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 access to (Q) plus (W) pressure",
        changesGameplay:
          "The early ability combination gives Talon a real trade or all-in pattern instead of isolated lane pressure.",
        playerAction:
          "Use the unlocked combo only when cooldowns, minions, and spacing make the trade hard to punish.",
        enemyResponse:
          "Respect the early combo unlock and avoid giving Talon the wave or spacing needed to start it cleanly.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay:
          "Talon's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed lethality item",
        reason: "First completed lethality item",
        changesGameplay:
          "Talon's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Talon's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["mid"],
  secondaryRoles: ["jungle"],
  primaryTradingPattern:
    "Land (W), threaten (Q) follow-up and passive bleed, then use roam pressure when the wave allows.",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "Can be punished by ranged control before all-in access.",
      "Needs lane movement and flank angles to maximize pressure.",
      "Weaker when forced to stay visible in lane.",
    ],
  },
  shields: [],
  softCrowdControl: ["(W) slow on return"],
  stealthOrInvisibility: "(R) grants stealth during the burst window.",
  sustain: ["(Q) heals on unit kill."],
  trading: {
    badTradeConditions: [
      "When he uses (Q) he dashes towards the target.",
      "Talon has to wait a while to use (E) over the same terrain.",
      "Talon's waveclear is not the best, he can be shoved under turret and forced to farm",
    ],
    goodTradeConditions: ["Enemy has spent key cooldowns and is in (W) + (Q) Range"],
    primaryPattern:
      "Land (W), threaten (Q) follow-up and passive bleed, then use roam pressure when the wave allows.",
  },
  punishWindows: [
    "When he uses (Q) he dashes towards the target.",
    "Talon has to wait a while to use (E) over the same terrain.",
    "Talon's waveclear is not the best, he can be shoved under turret and forced to farm",
  ],
} satisfies LeagueChampionKnowledgeProfile;
