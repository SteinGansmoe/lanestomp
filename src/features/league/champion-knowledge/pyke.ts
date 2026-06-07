import type { LeagueChampionKnowledgeProfile } from "./types";

export const pykeCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Bone Skewer", W: "Ghostwater Dive", E: "Phantom Undertow", R: "Death From Below" },
  archetype: ["support", "assassin", "pick", "roam"],
  primaryWinCondition: [
    "Create early pick pressure with hook and stun, roam from fog, and snowball fights with execute resets.",
  ],
  dangerAbilities: ["(Q) hook", "(E) stun", "(R) execute reset"],
  dangerProfile: {
    dangerousWhen: [
      "He can hide with (W).",
      "Level 2 or 3 gives hook plus stun.",
      "Low-health targets are in execute range.",
  ],
    mustRespect: [
      "Pyke punishes isolated positioning harder than most supports.",
      "His roams can decide mid and jungle.",
      "Execute resets make messy fights dangerous.",
  ],
  },
  commonWeaknesses: [
    "Falls off as a frontliner.",
    "Cannot protect ADC well in extended fights.",
    "Punishable if hook misses or roam fails.",
  ],
  damageType: "physical",
  hardCrowdControl: ["(Q) hook", "(E) stun"],
  id: "Pyke",
  importantAbilityNotes: [
    "Pyke punishes isolated positioning harder than most supports.",
    "His roams can decide mid and jungle.",
    "Execute resets make messy fights dangerous.",
  ],
  lanePlan: {
    avoids: [
      "Missing hook in lane.",
      "Roaming on bad waves.",
      "Trying to peel like a tank.",
  ],
    idealLaneState: "A volatile lane where Pyke threatens brush hooks, creates roam timers after wave crash, and looks for low-health execute chains.",
    wants: [
      "Fog control.",
      "Burst ADC follow-up.",
      "Enemy bot lane below execute threshold.",
  ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Snowball lanes.",
      "Roam-heavy maps.",
      "Skirmishes with execute resets.",
  ],
    scalingPriority: "low",
    winLaneBy: [
      "Landing hook.",
      "Creating numbers advantages.",
      "Executing low-health targets.",
  ],
  },
  majorPowerSpikes: ["Level 2 hook plus stun threat.", "Level 3 stealth roam threat.", "Level 6 execute reset."],
  matchupPreferences: {
    strongInto: [
      "Immobile enchanters.",
      "Low-sustain carries.",
      "Bot lanes that cannot punish roams.",
  ],
    weakInto: [
      "Peel tanks.",
      "Heavy poke that keeps him low.",
      "Scaling lanes that survive early.",
  ],
  },
  mobilityLevel: "high",
  name: "Pyke",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 hook plus stun threat.",
        changesGameplay: "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction: "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse: "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 stealth roam threat.",
        changesGameplay: "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction: "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse: "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 execute reset.",
        changesGameplay: "The ultimate changes all-in, peel, roam, or objective threat for the bot lane.",
        playerAction: "Use level 6 around confirmed ADC follow-up, river setup, or defensive reset value.",
        enemyResponse: "Track the ultimate cooldown and avoid giving a clean engage or counter-engage angle.",
      },
    ],
  },
  primaryRoles: ["support"],
  secondaryRoles: [],
  primaryTradingPattern: "Hide hook threat from brush or (W), pull targets into ADC burst, then use (E) to stun the escape path.",
  punishProfile: {
    canPunish: [
      "Supports warding alone.",
      "ADCs without dash or flash.",
      "Low-health targets after skirmishes.",
  ],
    strugglesToPunish: [
      "Tanks and peel supports.",
      "Lanes with safe waveclear.",
      "ADCs who can dodge hook and punish.",
  ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "roam",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing hook.", "Creating numbers advantages.", "Executing low-health targets."],
  },
  supportSynergy: {
    excellentWith: ["Draven", "Samira", "Kalista"],
    goodWith: ["Lucian", "Tristana", "Jhin"],
    strugglesWith: ["KogMaw", "Jinx", "Smolder"],
    notes: [
      "Draven, Samira, Kalista convert Pyke's strongest lane pattern especially well.",
      "Lucian, Tristana, Jhin fit Pyke when the lane can play around the same tempo window.",
      "KogMaw, Jinx, Smolder can struggle with Pyke when they need a different lane pace or protection pattern.",
  ],
  },
  sustain: ["Passive gray health regeneration."],
  trading: {
    badTradeConditions: [
      "(Q) misses.",
      "(E) is used forward.",
      "His roam leaves ADC exposed.",
  ],
    goodTradeConditions: [
      "Fog is controlled.",
      "Enemy flash is down.",
      "ADC can burst after hook.",
  ],
    primaryPattern: "Hide hook threat from brush or (W), pull targets into ADC burst, then use (E) to stun the escape path.",
  },
  punishWindows: [
    "Punish missed hook.",
    "Crash waves when he roams.",
    "Group around peel once level 6 is up.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
