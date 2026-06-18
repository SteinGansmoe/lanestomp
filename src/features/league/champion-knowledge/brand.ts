import type { LeagueChampionKnowledgeProfile } from "./types";

export const brandCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Sear", W: "Pillar of Flame", E: "Conflagration", R: "Pyroclasm" },
  archetype: ["support", "mage", "poke", "burst"],
  primaryWinCondition: [
    "Win lane through burn poke, punish clustered enemies with passive explosions, and turn level 6 skirmishes with (R) bounces.",
  ],
  dangerAbilities: ["(W) poke", "Empowered (Q) stun", "(R) bounce damage"],
  dangerProfile: {
    dangerousWhen: [
      "He can tag enemies before (Q).",
      "Bot lane is clustered in the wave.",
      "Level 6 (R) can bounce between champions.",
    ],
    mustRespect: [
      "Passive burn makes small trades add up.",
      "His stun requires setup but creates ADC follow-up.",
      "(R) punishes grouped 2v2 fights.",
    ],
  },
  commonWeaknesses: [
    "Immobile and vulnerable to engage.",
    "Stun is unreliable if he cannot apply Blaze first.",
    "Can push waves unintentionally with spells.",
  ],
  damageType: "magic",
  hardCrowdControl: ["Empowered (Q) stun"],
  id: "Brand",
  importantAbilityNotes: [
    "Passive burn makes small trades add up.",
    "His stun requires setup but creates ADC follow-up.",
    "(R) punishes grouped 2v2 fights.",
  ],
  lanePlan: {
    avoids: [
      "Missing setup spell before (Q).",
      "Standing in engage range.",
      "Burning the wave when his ADC needs it frozen.",
    ],
    idealLaneState:
      "A poke lane where Brand can stand behind the wave, hit (W) or (E), and threaten stun if enemies walk through his fire zones.",
    wants: [
      "Enemy bot lane grouped.",
      "Brush or wave angles for (W).",
      "ADC poke follow-up rather than forced all-ins.",
    ],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: [
      "Poke lanes.",
      "Dragon fights with grouped enemies.",
      "Bot lanes that cannot hard engage through damage.",
    ],
    scalingPriority: "medium",
    winLaneBy: [
      "Landing repeated (W).",
      "Threatening stun after Blaze.",
      "Turning level 6 bounces into all-in damage.",
    ],
  },
  majorPowerSpikes: [
    "Level 2 poke plus stun setup.",
    "Level 3 full Blaze combo.",
    "Level 6 (R) bounce all-in.",
  ],
  matchupPreferences: {
    strongInto: ["Short-range lanes.", "Grouped engage comps.", "Low-sustain ADCs."],
    weakInto: ["Hard engage supports.", "Long-range sustain lanes.", "Mobile ADCs that dodge (W)."],
  },
  mobilityLevel: "none",
  name: "Brand",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 poke plus stun setup.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 full Blaze combo.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R) bounce all-in.",
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
    "Apply Blaze with (W) or (E), threaten empowered (Q), and avoid walking forward after cooldowns are spent.",
  punishProfile: {
    canPunish: [
      "ADCs standing in the caster wave.",
      "Supports who cannot engage after taking poke.",
      "Grouped river fights.",
    ],
    strugglesToPunish: [
      "Fast engage before he sets Blaze.",
      "Sustain lanes that erase poke.",
      "Mobile champions dodging (W).",
    ],
  },
  shields: [],
  softCrowdControl: [],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: [
      "Landing repeated (W).",
      "Threatening stun after Blaze.",
      "Turning level 6 bounces into all-in damage.",
    ],
  },
  supportSynergy: {
    excellentWith: ["Jhin", "Ashe", "Varus"],
    goodWith: ["Caitlyn", "MissFortune", "Ezreal"],
    strugglesWith: ["Samira", "Nilah", "Kalista"],
    notes: [
      "Poke and pick ADCs layer damage onto his burn and stun setup.",
      "Long-range ADCs help him win lane without overstepping.",
      "Hard all-in ADCs may engage before Brand has reliable setup.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(W) misses.",
      "No Blaze setup for (Q).",
      "Enemy engage support has cooldowns ready.",
    ],
    goodTradeConditions: [
      "Enemies are grouped.",
      "He can stun after Blaze.",
      "His ADC can add poke while enemies retreat.",
    ],
    primaryPattern:
      "Apply Blaze with (W) or (E), threaten empowered (Q), and avoid walking forward after cooldowns are spent.",
  },
  punishWindows: [
    "Engage after he misses (Q) or (W).",
    "Force him to choose between wave and champion poke.",
    "Stand split after level 6.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
