import type { LeagueChampionKnowledgeProfile } from "./types";

export const nautilusCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Dredge Line", W: "Titan's Wrath", E: "Riptide", R: "Depth Charge" },
  archetype: ["support", "tank", "engage", "lockdown"],
  primaryWinCondition: [
    "Threaten level 2 hook all-ins, lock targets with passive and (R), and create easy ADC follow-up through layered CC.",
  ],
  dangerAbilities: ["(Q) hook", "Passive root", "(R) point-and-click knockup"],
  dangerProfile: {
    dangerousWhen: [
      "He controls brush.",
      "Level 2 arrives first.",
      "(R) can force an immobile carry to flash or die.",
    ],
    mustRespect: [
      "Hook plus passive gives long lockdown.",
      "(R) cannot be sidestepped once cast.",
      "Missing hook leaves a large punish window.",
    ],
  },
  commonWeaknesses: [
    "Punishable after missed (Q).",
    "Can be poked before engage.",
    "Commits his body into bad waves.",
  ],
  damageType: "magic",
  hardCrowdControl: ["Passive root", "(Q) hook", "(R) knockup"],
  id: "Nautilus",
  importantAbilityNotes: [
    "Hook plus passive gives long lockdown.",
    "(R) cannot be sidestepped once cast.",
    "Missing hook leaves a large punish window.",
  ],
  lanePlan: {
    avoids: [
      "Hooking into huge waves.",
      "Missing (Q) before river fights.",
      "Engaging without ADC range.",
    ],
    idealLaneState:
      "A thin-wave lane where Nautilus controls brush and threatens hook into passive root whenever the enemy ADC steps up.",
    wants: ["Brush control.", "Burst ADC follow-up.", "Thin enemy wave."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Kill lanes.",
      "Fog picks.",
      "Objective fights where (R) starts the fight.",
    ],
    scalingPriority: "medium",
    winLaneBy: ["Landing hook.", "Layering passive root.", "Using (R) to guarantee follow-up."],
  },
  majorPowerSpikes: [
    "Level 2 hook plus passive.",
    "Level 3 shield and slow.",
    "Level 6 Depth Charge.",
  ],
  matchupPreferences: {
    strongInto: ["Immobile ADCs.", "Enchanters without disengage.", "Bot lanes with weak level 2."],
    weakInto: ["Poke lanes that keep him low.", "Spell shields.", "Disengage after hook."],
  },
  mobilityLevel: "medium",
  name: "Nautilus",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 hook plus passive.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 shield and slow.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Depth Charge.",
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
    "Threaten hook from brush, auto for passive after connecting, and save (R) for targets who can dodge (Q).",
  punishProfile: {
    canPunish: [
      "ADCs last-hitting near brush.",
      "Supports with peel on cooldown.",
      "Carries without flash.",
    ],
    strugglesToPunish: [
      "Spell shields.",
      "Minion-covered targets.",
      "Tanks who want to be hooked.",
    ],
  },
  shields: ["(W) shield"],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing hook.", "Layering passive root.", "Using (R) to guarantee follow-up."],
  },
  supportSynergy: {
    excellentWith: ["Samira", "Kaisa", "Draven"],
    goodWith: ["Tristana", "MissFortune", "Kalista"],
    strugglesWith: ["Ezreal", "Smolder", "Ziggs"],
    notes: [
      "Samira, Kaisa, Draven convert Nautilus's strongest lane pattern especially well.",
      "Tristana, MissFortune, Kalista fit Nautilus when the lane can play around the same tempo window.",
      "Ezreal, Smolder, Ziggs can struggle with Nautilus when they need a different lane pace or protection pattern.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: ["(Q) misses.", "Wave is too large.", "ADC cannot follow."],
    goodTradeConditions: ["Level 2 first.", "Enemy flash is down.", "Brush hides hook angle."],
    primaryPattern:
      "Threaten hook from brush, auto for passive after connecting, and save (R) for targets who can dodge (Q).",
  },
  punishWindows: ["Punish missed hook.", "Stand behind minions.", "Poke before he can engage."],
} satisfies LeagueChampionKnowledgeProfile;
