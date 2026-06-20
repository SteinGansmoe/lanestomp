import type { LeagueChampionKnowledgeProfile } from "./types";

export const swainCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Death's Hand", W: "Vision of Empire", E: "Nevermove", R: "Demonic Ascension" },
  archetype: ["support", "mage", "pick", "drain tank"],
  primaryWinCondition: [
    "Pull rooted targets into bot-lane burst, punish short-range lanes, and dominate level 6 all-ins with drain tank presence.",
  ],
  dangerAbilities: ["(E) root and pull", "(W) follow-up slow", "(R) drain fight"],
  dangerProfile: {
    dangerousWhen: [
      "He lands (E) through or around minions.",
      "Enemy bot lane must fight inside his range.",
      "Level 6 lets him sustain through all-ins.",
    ],
    mustRespect: [
      "Swain is strongest when enemies cannot leave his zone.",
      "(E) pull creates ADC follow-up.",
      "His level 6 changes him from poke mage into drain threat.",
    ],
  },
  commonWeaknesses: [
    "Immobile and short ranged for a mage.",
    "Weak if (E) misses.",
    "Can be outranged by artillery.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(E) root/pull"],
  id: "Swain",
  importantAbilityNotes: [
    "Swain is strongest when enemies cannot leave his zone.",
    "(E) pull creates ADC follow-up.",
    "His level 6 changes him from poke mage into drain threat.",
  ],
  lanePlan: {
    avoids: [
      "Fishing (E) with no follow-up.",
      "Fighting long-range poke.",
      "Entering before level 6 without health advantage.",
    ],
    idealLaneState:
      "A pull-threat lane where Swain controls minion angles, lands (E), and forces extended fights only when his ADC can follow.",
    wants: ["Enemy in pull range.", "ADC burst after root.", "Close river skirmishes."],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: ["Pick lanes.", "Short-range brawls.", "Level 6 all-ins."],
    scalingPriority: "medium",
    winLaneBy: ["Landing (E).", "Pulling targets into ADC damage.", "Sustaining with (R)."],
  },
  majorPowerSpikes: [
    "Level 2 (E)+(Q) pull trade.",
    "Level 3 adds long-range vision/poke.",
    "Level 6 Demonic Ascension.",
  ],
  matchupPreferences: {
    strongInto: [
      "Short-range ADCs.",
      "Engage lanes that enter his range.",
      "Low mobility supports.",
    ],
    weakInto: ["Artillery poke.", "Mobile ADCs.", "Disengage supports."],
  },
  mobilityLevel: "none",
  name: "Swain",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (E)+(Q) pull trade.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds long-range vision/poke.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Demonic Ascension.",
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
    "Threaten (E) from minion angles, pull only when ADC can damage, and commit after level 6 when enemies must stay in his drain zone.",
  punishProfile: {
    canPunish: [
      "ADCs with no dash.",
      "Supports walking through minions.",
      "All-ins that cannot leave his (R).",
    ],
    strugglesToPunish: ["Long-range poke.", "Clean disengage.", "Targets who dodge (E)."],
  },
  shields: [],
  softCrowdControl: ["(W) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing (E).", "Pulling targets into ADC damage.", "Sustaining with (R)."],
  },
  supportSynergy: {
    excellentWith: ["Jhin", "Ashe", "Draven"],
    goodWith: ["Varus", "MissFortune", "Lucian"],
    strugglesWith: ["Ezreal", "Ziggs", "Caitlyn"],
    notes: [
      "Jhin, Ashe, Draven convert Swain's strongest lane pattern especially well.",
      "Varus, MissFortune, Lucian fit Swain when the lane can play around the same tempo window.",
      "Ezreal, Ziggs, Caitlyn can struggle with Swain when they need a different lane pace or protection pattern.",
    ],
  },
  sustain: ["(R) drain healing."],
  trading: {
    badTradeConditions: ["(E) misses.", "He is kited outside (R).", "His ADC cannot follow pull."],
    goodTradeConditions: [
      "Enemy is short range.",
      "(E) can clip through wave.",
      "Level 6 is available.",
    ],
    primaryPattern:
      "Threaten (E) from minion angles, pull only when ADC can damage, and commit after level 6 when enemies must stay in his drain zone.",
  },
  punishWindows: ["Dodge (E), then punish.", "Kite out his (R).", "Outrange him with poke."],
} satisfies LeagueChampionKnowledgeProfile;
