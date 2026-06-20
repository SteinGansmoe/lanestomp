import type { LeagueChampionKnowledgeProfile } from "./types";

export const blitzcrankCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Rocket Grab", W: "Overdrive", E: "Power Fist", R: "Static Field" },
  archetype: ["support", "pick", "engage", "burst setup"],
  primaryWinCondition: [
    "Use fog, brush, and lane pressure to threaten (Q) picks that pull targets into ADC burst and objective control.",
  ],
  dangerAbilities: ["(Q) hook", "(E) knockup", "(R) silence"],
  dangerProfile: {
    dangerousWhen: [
      "He controls brush or fog and can hide hook startup.",
      "Level 2 gives (Q)+(E) kill threat.",
      "(R) can silence shields or escapes after the hook lands.",
    ],
    mustRespect: [
      "One hook can decide lane even if Blitzcrank has low sustained pressure.",
      "Hook threat zones change where ADCs can last hit.",
      "(R) can interrupt defensive spell timing after the pull.",
    ],
  },
  commonWeaknesses: [
    "Very punishable after (Q) misses.",
    "Can struggle into minion waves and spell shields.",
    "Limited peel if he spends hook aggressively.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) pull", "(E) knockup", "(R) silence"],
  id: "Blitzcrank",
  importantAbilityNotes: [
    "One hook can decide lane even if Blitzcrank has low sustained pressure.",
    "Hook threat zones change where ADCs can last hit.",
    "(R) can interrupt defensive spell timing after the pull.",
  ],
  lanePlan: {
    avoids: [
      "Throwing hook through full waves.",
      "Missing (Q) before objective fights.",
      "Hooking tanks that want to enter.",
    ],
    idealLaneState:
      "A lane where Blitzcrank can hold brush, thin enough minions to expose hook angles, and threaten ADC last hits with (Q).",
    wants: ["Brush control.", "Minion gaps.", "ADC burst ready after hook."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Fog-of-war pick lanes.",
      "Early kill lanes.",
      "Objective setups where hook denies face-checks.",
    ],
    scalingPriority: "low",
    winLaneBy: ["Landing (Q).", "Forcing enemy ADC away from CS.", "Roaming after bot wave crash."],
  },
  majorPowerSpikes: [
    "Level 2 (Q)+(E) all-in.",
    "Level 3 adds (W) chase speed.",
    "Level 6 adds silence burst.",
  ],
  matchupPreferences: {
    strongInto: [
      "Immobile carries.",
      "Enchanters with poor minion control.",
      "Lanes that must face-check river.",
    ],
    weakInto: [
      "Spell shields.",
      "Tank supports happy to be hooked.",
      "Poke lanes that keep him low.",
    ],
  },
  mobilityLevel: "medium",
  name: "Blitzcrank",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (Q)+(E) all-in.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds (W) chase speed.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 adds silence burst.",
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
    "Hold hook threat longer than the enemy wants, then pull when minion cover or escape cooldowns are gone.",
  punishProfile: {
    canPunish: [
      "ADC last hits without minion cover.",
      "Supports warding alone.",
      "Enemies who step past their wave after (Q) is available.",
    ],
    strugglesToPunish: [
      "Spell-shielded carries.",
      "Lanes that keep minion cover.",
      "Tanks who can punish being pulled.",
    ],
  },
  shields: ["Passive Mana Barrier"],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Landing (Q).", "Forcing enemy ADC away from CS.", "Roaming after bot wave crash."],
  },
  supportSynergy: {
    excellentWith: ["Draven", "Jhin", "Caitlyn"],
    goodWith: ["Tristana", "MissFortune", "Lucian"],
    strugglesWith: ["Ezreal", "Smolder", "Sivir"],
    notes: [
      "Burst ADCs convert hooks immediately.",
      "Trap or root follow-up makes hooked targets lose flash or die.",
      "Low-commit scaling ADCs can leave Blitzcrank hooks without enough damage.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(Q) misses.",
      "The target can hide behind minions.",
      "His ADC cannot burst the pulled target.",
    ],
    goodTradeConditions: [
      "Enemy flash or dash is down.",
      "Brush is controlled.",
      "The enemy wave is thin enough for a clean hook.",
    ],
    primaryPattern:
      "Hold hook threat longer than the enemy wants, then pull when minion cover or escape cooldowns are gone.",
  },
  punishWindows: [
    "Trade aggressively after (Q) misses.",
    "Stand behind minions and force him to waste roam timers.",
    "Punish him when (W) slow ends.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
