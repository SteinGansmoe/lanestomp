import type { LeagueChampionKnowledgeProfile } from "./types";

export const luxCombatProfile = {
  profileQuality: "draft",
  abilities: {
    Q: "Light Binding",
    W: "Prismatic Barrier",
    E: "Lucent Singularity",
    R: "Final Spark",
  },
  archetype: ["artillery mage", "pick", "poke", "burst"],
  primaryWinCondition: [],
  dangerAbilities: [],
  dangerProfile: {
    dangerousWhen: [],
    mustRespect: [
      "(Q) is her key defensive and pick tool.",
      "(W) shields allies and herself.",
      "(Q) + (E) + (R) does significant damage.",
    ],
  },
  commonWeaknesses: [
    "If (Q) is used recklessly, she can be punished.",
    "Skillshot reliant.",
    "Can be all-inned if she loses range control.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) root"],
  id: "Lux",
  importantAbilityNotes: [
    "(Q) is her key defensive and pick tool.",
    "(W) shields allies and herself.",
    "(Q) + (E) + (R) does significant damage.",
  ],
  lanePlan: {
    avoids: [
      "If (Q) is used recklessly, she can be punished.",
      "Skillshot reliant.",
      "Can be all-inned if she loses range control.",
    ],
    idealLaneState: "Long-range mage who controls lane with poke, binding threat, and waveclear.",
    wants: [],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    scalingPriority: "medium",
    lanePressure: "high",
    preferredGameState: [],
    winLaneBy: [],
  },
  majorPowerSpikes: ["Level 6 (R).", "First completed mage item."],
  matchupPreferences: {
    strongInto: [],
    weakInto: [],
  },
  mobilityLevel: "none",
  name: "Lux",
  offMetaRoles: [],
  strategicIdentity: {
    laneGoal: "control",
    scalingProfile: "mid",
    preferredGameLength: "medium",
    winMethod: ["long-range poke", "pick setup", "objective control"],
  },
  powerSpikes: {
    major: [
      {
        timing: "Level 6",
        reason: "Level 6 (R)",
        changesGameplay:
          "Lux's ultimate becomes available, so the matchup shifts around whether the commit, pick, roam, or escape threat is ready.",
        playerAction:
          "Track (R) availability and use the window for verified all-ins, picks, roams, or defensive resets rather than forcing blind.",
        enemyResponse:
          "Respect (R) window, hold key defensive tools for the commit, and punish after (R) is spent.",
      },
      {
        timing: "First completed mage item",
        reason: "First completed mage item",
        changesGameplay:
          "Lux's damage, wave control, or trade reliability improves enough that earlier neutral trades can become losing trades.",
        playerAction:
          "After the item, pressure waves and trades more confidently while still tracking the enemy's main answer.",
        enemyResponse:
          "Do not treat pre-item trades as still safe once Lux's first item threshold is completed.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: ["mid"],
  primaryTradingPattern: "Poke with (E) and punish oversteps with (Q) into burst.",
  punishProfile: {
    canPunish: [],
    strugglesToPunish: [
      "If (Q) is used recklessly, she can be punished.",
      "Skillshot reliant.",
      "Can be all-inned if she loses range control.",
    ],
  },
  shields: ["(W)"],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  supportSynergy: {
    excellentWith: ["Caitlyn", "Jhin", "Varus"],
    goodWith: ["Ezreal", "Ashe", "MissFortune"],
    strugglesWith: ["Samira", "Nilah", "Kalista"],
    notes: [
      "Caitlyn and Jhin convert Lux binding into traps, roots, or guaranteed burst.",
      "Poke ADCs help Lux maintain lane pressure without overstepping.",
      "Hard all-in ADCs often want a tankier support or more reliable engage.",
  ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "If Lux misses (Q) she can be punished.",
      "Skillshot reliant champions like Lux can be punished by dodging their key abilities and forcing them into unfavorable trades.",
    ],
    goodTradeConditions: [],
    primaryPattern: "Poke with (E) and punish oversteps with (Q) into burst.",
  },
  punishWindows: [
    "If Lux misses (Q) she can be punished.",
    "Skillshot reliant champions like Lux can be punished by dodging their key abilities and forcing them into unfavorable trades.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
