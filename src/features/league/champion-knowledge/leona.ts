import type { LeagueChampionKnowledgeProfile } from "./types";

export const leonaCombatProfile = {
  profileQuality: "draft",
  masteryDifficulty: "medium",
  abilities: { Q: "Shield of Daybreak", W: "Eclipse", E: "Zenith Blade", R: "Solar Flare" },
  archetype: ["support", "tank", "engage", "lockdown"],
  primaryWinCondition: [
    "Force decisive all-ins with (E)+(Q), leverage level 2 and level 3 threat, and lock priority targets for ADC burst.",
  ],
  dangerAbilities: ["(E)+(Q) engage", "(W) durability", "(R) long-range engage"],
  dangerProfile: {
    dangerousWhen: [
      "She hits level 2 first.",
      "Enemy ADC steps past the wave.",
      "Level 6 gives long-range (R) setup.",
    ],
    mustRespect: [
      "Leona punishes one misstep with layered crowd control.",
      "(W) makes return damage inefficient.",
      "(R) starts fights even when (E) range is respected.",
    ],
  },
  commonWeaknesses: [
    "Very punishable if (E) misses.",
    "Low disengage after committing.",
    "Can be poked before she enters range.",
  ],
  damageType: "magic",
  hardCrowdControl: ["(Q) stun", "(E) root/dash", "(R) stun/slow"],
  id: "Leona",
  importantAbilityNotes: [
    "Leona punishes one misstep with layered crowd control.",
    "(W) makes return damage inefficient.",
    "(R) starts fights even when (E) range is respected.",
  ],
  lanePlan: {
    avoids: [
      "Engaging into huge waves.",
      "Starting without ADC follow-up.",
      "Being poked low before level 2.",
    ],
    idealLaneState:
      "A lane where Leona's side can reach level 2 or level 3 first, thin the wave, and force enemies to respect engage from brush.",
    wants: ["Brush control.", "ADC burst ready.", "Enemy wave thin enough to engage through."],
  },
  laneIdentity: {
    earlyGameAgency: "high",
    lanePressure: "high",
    preferredGameState: ["Kill lanes.", "Dragon fights with first move.", "Pick setups from fog."],
    scalingPriority: "medium",
    winLaneBy: ["Level 2 all-ins.", "Layering stuns for ADC damage.", "Roaming after crash."],
  },
  majorPowerSpikes: [
    "Level 2 (E)+(Q) all-in.",
    "Level 3 adds (W) durability.",
    "Level 6 (R) starts fights from range.",
  ],
  matchupPreferences: {
    strongInto: [
      "Immobile ADCs.",
      "Low-disengage enchanters.",
      "Lanes that cannot punish her before engage.",
    ],
    weakInto: [
      "Heavy poke before level 2.",
      "Disengage supports.",
      "ADCs that cleanse or dash her engage.",
    ],
  },
  mobilityLevel: "medium",
  name: "Leona",
  offMetaRoles: [],
  powerSpikes: {
    major: [
      {
        timing: "Level 2",
        reason: "Level 2 (E)+(Q) all-in.",
        changesGameplay:
          "The first real bot-lane interaction changes once this support can pair two early abilities.",
        playerAction:
          "Track the level 2 race and only contest the wave if the ADC can follow the support's threat.",
        enemyResponse:
          "Respect the level 2 timer and back up before the support reaches the wave first.",
      },
      {
        timing: "Level 3",
        reason: "Level 3 adds (W) durability.",
        changesGameplay:
          "The full basic kit unlocks the support's main trade, peel, or poke pattern.",
        playerAction:
          "Use the complete kit around brush control, ADC follow-up, and the enemy support's key cooldown.",
        enemyResponse:
          "Punish the support after their main cooldown is spent or when the wave blocks their angle.",
      },
      {
        timing: "Level 6",
        reason: "Level 6 (R) starts fights from range.",
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
    "Threaten from brush, engage only with ADC damage in range, and layer (Q) after (E) connects.",
  punishProfile: {
    canPunish: [
      "ADCs stepping past minions.",
      "Enchanters using peel early.",
      "Bot lanes without flash.",
    ],
    strugglesToPunish: [
      "Clean disengage.",
      "Large enemy waves.",
      "Lanes that keep her below engage HP.",
    ],
  },
  shields: [],
  softCrowdControl: ["(R) slow"],
  stealthOrInvisibility: null,
  strategicIdentity: {
    laneGoal: "control",
    preferredGameLength: "medium",
    scalingProfile: "mid",
    winMethod: ["Level 2 all-ins.", "Layering stuns for ADC damage.", "Roaming after crash."],
  },
  supportSynergy: {
    excellentWith: ["Samira", "Draven", "Tristana"],
    goodWith: ["Kaisa", "MissFortune", "Kalista"],
    strugglesWith: ["Ezreal", "Smolder", "Ziggs"],
    notes: [
      "All-in and burst ADCs convert her lockdown best.",
      "Miss Fortune and Kai'Sa use her CC to land high-value damage windows.",
      "Low-commit poke ADCs can leave Leona overextended after engage.",
    ],
  },
  sustain: [],
  trading: {
    badTradeConditions: [
      "(E) misses.",
      "The wave is too large.",
      "Her ADC cannot follow immediately.",
    ],
    goodTradeConditions: [
      "Level 2 first.",
      "Enemy flash is down.",
      "Brush hides her engage range.",
    ],
    primaryPattern:
      "Threaten from brush, engage only with ADC damage in range, and layer (Q) after (E) connects.",
  },
  punishWindows: [
    "Punish after (E) misses.",
    "Poke her before level 2.",
    "Freeze outside her engage range.",
  ],
} satisfies LeagueChampionKnowledgeProfile;
