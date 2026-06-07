import type { LeagueChampionKnowledgeProfile } from "./types";

export const rakanCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Gleaming Quill", W: "Grand Entrance", E: "Battle Dance", R: "The Quickness" },
  archetype: ["support", "engage", "peel", "mobile enchanter"],
  primaryWinCondition: [
    "Use mobility to start fast engages, shield back to his ADC, and turn level 6 fights with charm into knockup chains.",
  ],
  dangerAbilities: ["(W) knockup", "(E) double dash", "(R) charm"],
  dangerProfile: {
    dangerousWhen: [
      "He can dash from fog or allied positions.",
      "His ADC can follow a (W) knockup.",
      "Level 6 lets him charm through multiple targets.",
  ],
    mustRespect: [
      "Rakan's range changes with ally positioning.",
      "He can engage and exit faster than most supports.",
      "His peel is strong when he saves (E).",
  ],
  },
  commonWeaknesses: [
    "Can be punished if (W) misses.",
    "Lower lane damage without ADC follow-up.",
    "Struggles when rooted before engaging.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(W) knockup", "(R) charm"],
  id: "Rakan",
  importantAbilityNotes: [
    "Rakan's range changes with ally positioning.",
    "He can engage and exit faster than most supports.",
    "His peel is strong when he saves (E).",
  ],
  lanePlan: {
    avoids: [
      "Using both (E) charges before engage starts.",
      "Raw (W) from obvious range.",
      "Fighting after being rooted.",
  ],
    idealLaneState: "A mobile lane where Rakan uses brush, minions, and ally position to threaten (W) while keeping (E) available to exit or peel.",
    wants: [
      "ADC positioned for (E).",
      "Fog or flank engage.",
      "Grouped enemies for level 6.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "medium",
    lanePressure: "medium",
    preferredGameState: [
      "Fast engage lanes.",
      "Skirmishes.",
      "Teamfights with flank access.",
  ],
    scalingPriority: "high",
    winLaneBy: [
      "Landing (W).",
      "Charming multiple targets.",
      "Peeling back with (E).",
  ],
  },
  majorPowerSpikes: ["Level 2 (W)+(E) trade.", "Level 3 adds heal/poke.", "Level 6 charm engage."],
  matchupPreferences: {
    strongInto: [
      "Immobile carries.",
      "Skillshot supports he can dodge.",
      "Teamfights needing flexible engage.",
  ],
    weakInto: [
      "Point-and-click lockdown.",
      "Heavy poke before engage.",
      "Lanes that punish missed (W).",
  ],
  },
  mobilityLevel: "very_high",
  name: "Rakan",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (W)+(E) trade.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds heal/poke.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 charm engage.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Dash in with (W), let the ADC hit the knockup, then (E) out or re-enter when cooldowns allow.",
  punishProfile: {
    canPunish: [
      "ADCs stepping near his dash target.",
      "Supports using CC before he enters.",
      "Grouped teams at level 6.",
  ],
    strugglesToPunish: [
      "Hard CC held for his entry.",
      "Long-range poke.",
      "Targets spread outside charm path.",
  ],
  },
  shields: ["(E) shield"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "long",
    scalingProfile: "late",
    winMethod: ["Landing (W).", "Charming multiple targets.", "Peeling back with (E)."],
  },
  supportSynergy: {
    excellentWith: ["Xayah", "Kaisa", "Samira"],
    goodWith: ["Tristana", "Kalista", "Nilah"],
    strugglesWith: ["Caitlyn", "Ziggs", "KogMaw"],
    notes: [
      "Xayah, Kaisa, Samira convert Rakan's strongest lane pattern especially well.",
      "Tristana, Kalista, Nilah fit Rakan when the lane can play around the same tempo window.",
      "Caitlyn, Ziggs, KogMaw can struggle with Rakan when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["(Q) healing."],
  trading: {
    badTradeConditions: [
      "(W) misses.",
      "(E) targets are out of range.",
      "He is rooted before starting.",
  ],
    goodTradeConditions: [
      "Ally is positioned for (E).",
      "Enemy CC is down.",
      "Level 6 charm can hit multiple targets.",
  ],
    primaryPattern: "Dash in with (W), let the ADC hit the knockup, then (E) out or re-enter when cooldowns allow.",
  },
  punishWindows: [
    "Hold CC for his entry.",
    "Punish missed (W).",
    "Keep spacing so charm cannot chain.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
