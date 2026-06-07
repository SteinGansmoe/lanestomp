import type { LeagueChampionKnowledgeProfile } from "./types";

export const rellCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Shattering Strike", W: "Ferromancy: Crash Down", E: "Full Tilt", R: "Magnet Storm" },
  archetype: ["support", "tank", "engage", "teamfight"],
  primaryWinCondition: [
    "Force committed engage windows with (W), layer (E) and (R), and create multi-target lockdown for ADC AoE or all-in damage.",
  ],
  dangerAbilities: ["(W) engage", "(E) stun", "(R) Magnet Storm"],
  dangerProfile: {
    dangerousWhen: [
      "She can flank or control brush.",
      "Her ADC can follow the crash down.",
      "Level 6 groups enemies for damage.",
  ],
    mustRespect: [
      "Rell commits harder than most supports.",
      "Her engage is devastating if allies are ready.",
      "Missed engage leaves her slow and exposed.",
  ],
  },
  commonWeaknesses: [
    "Weak if engage misses.",
    "Can be poked before entering.",
    "Needs team follow-up for damage.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(W) knockup", "(E) stun", "(R) pull"],
  id: "Rell",
  importantAbilityNotes: [
    "Rell commits harder than most supports.",
    "Her engage is devastating if allies are ready.",
    "Missed engage leaves her slow and exposed.",
  ],
  lanePlan: {
    avoids: [
      "Engaging without follow-up.",
      "Walking in slowly through poke.",
      "Using (W) where enemies can disengage.",
  ],
    idealLaneState: "A kill lane where Rell hides engage range, crashes onto priority targets, and chains CC while her ADC unloads damage.",
    wants: [
      "ADC ready for all-in.",
      "Enemy wave thin enough to enter.",
      "Grouped targets.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "All-in lanes.",
      "Dragon fights.",
      "Grouped teamfights.",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing multi-target engage.",
      "Chaining CC.",
      "Roaming after wave crash.",
  ],
  },
  majorPowerSpikes: ["Level 2 (W) all-in.", "Level 3 full CC chain.", "Level 6 Magnet Storm."],
  matchupPreferences: {
    strongInto: [
      "Immobile bot lanes.",
      "Grouped objective teams.",
      "Enchanters without disengage.",
  ],
    weakInto: [
      "Poke lanes that deny entry.",
      "Disengage supports.",
      "Mobile ADCs who dash her crash.",
  ],
  },
  mobilityLevel: "medium",
  name: "Rell",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (W) all-in.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 full CC chain.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Magnet Storm.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Enter from brush or flank with (W), layer (E), then use (R) when enemies try to split from the engage.",
  punishProfile: {
    canPunish: [
      "Grouped enemies.",
      "ADCs without flash.",
      "Supports using disengage early.",
  ],
    strugglesToPunish: [
      "Spread targets.",
      "Long-range poke.",
      "Teams that kite after her first engage.",
  ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing multi-target engage.", "Chaining CC.", "Roaming after wave crash."],
  },
  supportSynergy: {
    excellentWith: ["Samira", "MissFortune", "Kaisa"],
    goodWith: ["Nilah", "Kalista", "Tristana"],
    strugglesWith: ["Ezreal", "Smolder", "Ziggs"],
    notes: [
      "Samira, MissFortune, Kaisa convert Rell's strongest lane pattern especially well.",
      "Nilah, Kalista, Tristana fit Rell when the lane can play around the same tempo window.",
      "Ezreal, Smolder, Ziggs can struggle with Rell when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) misses.",
      "She is dismounted in poke range.",
      "ADC cannot follow.",
  ],
    goodTradeConditions: [
      "Enemy wave is thin.",
      "Allies can follow instantly.",
      "Level 6 can group targets.",
  ],
    primaryPattern: "Enter from brush or flank with (W), layer (E), then use (R) when enemies try to split from the engage.",
  },
  punishWindows: [
    "Poke before she enters.",
    "Spread for (R).",
    "Punish failed crash down.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
