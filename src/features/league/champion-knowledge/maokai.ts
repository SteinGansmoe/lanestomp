import type { LeagueChampionKnowledgeProfile } from "./types";

export const maokaiCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Bramble Smash", W: "Twisted Advance", E: "Sapling Toss", R: "Nature's Grasp" },
  archetype: ["support", "tank", "engage", "vision control"],
  primaryWinCondition: [
    "Control brush with saplings, threaten point-and-click (W) engages, and use (R) to start objective fights.",
  ],
  dangerAbilities: ["(E) sapling brush control", "(W) root", "(R) engage"],
  dangerProfile: {
    dangerousWhen: [
      "Brush saplings deny enemy vision.",
      "He can (W) onto an exposed carry.",
      "Objective corridors force enemies through (R).",
  ],
    mustRespect: [
      "Saplings make face-checking expensive.",
      "(W) follows dashes once cast.",
      "(R) is strongest in narrow river paths.",
  ],
  },
  commonWeaknesses: [
    "Can be poked before engage.",
    "Low damage without ADC follow-up.",
    "Saplings lose value if enemies control brush first.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(W) root", "(Q) knockback", "(R) root"],
  id: "Maokai",
  importantAbilityNotes: [
    "Saplings make face-checking expensive.",
    "(W) follows dashes once cast.",
    "(R) is strongest in narrow river paths.",
  ],
  lanePlan: {
    avoids: [
      "Losing brush before saplings are placed.",
      "Engaging without ally damage.",
      "Fighting in open space where (R) is easy to dodge.",
  ],
    idealLaneState: "A brush-control lane where saplings own the side brush and Maokai can start short all-ins when the enemy ADC steps forward.",
    wants: [
      "Brush control.",
      "ADC follow-up for rooted targets.",
      "River objective setups.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Brush control lanes.",
      "Objective choke fights.",
      "Counter-engage around his ADC.",
  ],
    scalingPriority: "medium",
    winLaneBy: [
      "Winning vision brush.",
      "Rooting overextended ADCs.",
      "Layering (R) through river.",
  ],
  },
  majorPowerSpikes: ["Level 2 (W)+(Q) trade.", "Level 3 sapling control.", "Level 6 Nature's Grasp engage."],
  matchupPreferences: {
    strongInto: [
      "Low mobility ADCs.",
      "Melee engage lanes.",
      "Objective-heavy comps.",
  ],
    weakInto: [
      "Long-range poke.",
      "Disengage that breaks his first engage.",
      "Lanes that clear saplings safely.",
  ],
  },
  mobilityLevel: "medium",
  name: "Maokai",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (W)+(Q) trade.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 sapling control.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 Nature's Grasp engage.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Stack brush with saplings, threaten (W) from fog, and use (Q) to keep targets in ADC range.",
  punishProfile: {
    canPunish: [
      "Face-checks.",
      "ADCs stepping near sapling brush.",
      "Teams grouped in river corridors.",
  ],
    strugglesToPunish: [
      "Long-range lanes clearing saplings.",
      "ADCs with cleanse or disengage.",
      "Fights in open lane.",
  ],
  },
  shields: [],
  softCrowdControl: ["(E) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Winning vision brush.", "Rooting overextended ADCs.", "Layering (R) through river."],
  },
  supportSynergy: {
    excellentWith: ["MissFortune", "Jhin", "Kaisa"],
    goodWith: ["Ashe", "Varus", "Samira"],
    strugglesWith: ["Ezreal", "Ziggs", "Smolder"],
    notes: [
      "MissFortune, Jhin, Kaisa convert Maokai's strongest lane pattern especially well.",
      "Ashe, Varus, Samira fit Maokai when the lane can play around the same tempo window.",
      "Ezreal, Ziggs, Smolder can struggle with Maokai when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["Passive healing."],
  trading: {
    badTradeConditions: [
      "Brush is cleared.",
      "(W) is down.",
      "His ADC cannot hit the rooted target.",
  ],
    goodTradeConditions: [
      "Enemy must face-check.",
      "Saplings control brush.",
      "Objective fight starts in a choke.",
  ],
    primaryPattern: "Stack brush with saplings, threaten (W) from fog, and use (Q) to keep targets in ADC range.",
  },
  punishWindows: [
    "Clear brush before walking up.",
    "Poke him before engage.",
    "Avoid lining up in river for (R).",
  ],
} satisfies LeagueChampionKnowledgeProfile;
