import type { LeagueChampionKnowledgeProfile } from "./types";

export const bardCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: {
    Q: "Cosmic Binding",
    W: "Caretaker's Shrine",
    E: "Magical Journey",
    R: "Tempered Fate",
  },
  archetype: ["support", "roam", "pick", "utility"],
  primaryWinCondition: [
    "Create lane threat with meep trades and wall stuns, then use roam windows and (E) paths to influence mid, jungle, and objectives.",
  ],
  dangerAbilities: ["(Q) wall stun", "(E) roam path", "(R) pick or disengage"],
  dangerProfile: {
    dangerousWhen: [
      "He can angle (Q) into a wall, minion, or second champion.",
      "The wave lets him roam without his ADC losing too much.",
      "(R) can start a pick or deny an enemy engage.",
    ],
    mustRespect: [
      "Bard changes fights by arriving from unusual terrain angles.",
      "Meeps make short trades stronger than his base stats suggest.",
      "(R) can isolate a target for ADC follow-up or stall a dive.",
    ],
  },
  commonWeaknesses: [
    "His ADC can be punished while he roams.",
    "Unreliable if (Q) has no wall or second target.",
    "Poor roams can sacrifice bot wave and plate pressure.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) stun", "(R) stasis"],
  id: "Bard",
  importantAbilityNotes: [
    "Bard changes fights by arriving from unusual terrain angles.",
    "Meeps make short trades stronger than his base stats suggest.",
    "(R) can isolate a target for ADC follow-up or stall a dive.",
  ],
  lanePlan: {
    avoids: [
      "Roaming while the wave is frozen against his ADC.",
      "Casting (R) without ally follow-up.",
      "Open-lane fights with no (Q) stun angle.",
    ],
    idealLaneState:
      "A stable wave where Bard can trade with meeps, threaten wall stuns from brush, and leave after crashing or resetting the lane.",
    wants: [
      "Wall-adjacent fights.",
      "Roam timers after wave crash.",
      "ADC lanes that can survive short 1v2 windows.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Roam-heavy tempo games.",
      "Skirmishes near walls.",
      "Objective setups where (R) can split teams.",
    ],
    scalingPriority: "high",
    winLaneBy: [
      "Landing wall stuns.",
      "Creating numbers advantages with roams.",
      "Using shrines to keep ADC healthy.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 (Q)+(W) trade setup.",
    "Level 3 unlocks roam paths with (E).",
    "Level 6 (R) changes pick and dive setups.",
  ],
  matchupPreferences: {
    strongInto: ["Immobile bot lanes near walls.", "Passive lanes that cannot punish roams."],
    weakInto: [
      "Hard engage that kills his ADC while he roams.",
      "Poke lanes that force him to stay bot.",
    ],
  },
  mobilityLevel: "high",
  name: "Bard",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (Q)+(W) trade setup.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 unlocks roam paths with (E).",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R) changes pick and dive setups.",
        changesGameplay:
          "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction:
          "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse:
          "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern:
    "Trade with meep autos, look for (Q) wall stuns from brush, and roam only after the wave state protects his ADC.",
  punishProfile: {
    canPunish: [
      "Targets near walls.",
      "Overextended lanes without river vision.",
      "Objective starts that can be stalled by (R).",
    ],
    strugglesToPunish: [
      "Open-lane targets away from walls.",
      "Bot lanes that crash waves before he can roam.",
    ],
  },
  shields: [],
  softCrowdControl: ["Meeps slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "roam",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: [
      "Landing wall stuns.",
      "Creating numbers advantages with roams.",
      "Using shrines to keep ADC healthy.",
    ],
  },
  supportSynergy: {
    excellentWith: ["Ezreal", "Sivir", "Caitlyn"],
    goodWith: ["Jhin", "Varus", "Ashe"],
    strugglesWith: ["KogMaw", "Aphelios", "Jinx"],
    notes: [
      "Safe or waveclear ADCs handle Bard roam windows best.",
      "Pick ADCs can follow wall stuns and (R) setups from long range.",
      "Immobile hypercarries suffer if Bard leaves before the wave is secured.",
    ],
  },
  sustain: ["(W) shrine healing."],
  trading: {
    badTradeConditions: [
      "No meep available.",
      "(Q) has no stun angle.",
      "His ADC is vulnerable to engage during a roam.",
    ],
    goodTradeConditions: [
      "A wall stun is available.",
      "The wave is safe for a roam.",
      "(R) can isolate an immobile carry.",
    ],
    primaryPattern:
      "Trade with meep autos, look for (Q) wall stuns from brush, and roam only after the wave state protects his ADC.",
  },
  punishWindows: [
    "Punish his ADC when Bard roams on a bad wave.",
    "Force fights when (Q) is down.",
    "Track chime routes and collapse through river.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
